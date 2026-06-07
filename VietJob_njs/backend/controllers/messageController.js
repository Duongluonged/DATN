const { sql, pool, poolConnect } = require('../config/db');

// ─── 1. Lấy danh sách cuộc trò chuyện của một User ────────────────
const getConversations = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const parsedUserId = parseInt(userId, 10);
        
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ error: "UserId không hợp lệ." });
        }

        // Truy vấn lấy danh sách hội thoại, tin nhắn cuối, thông tin đối tác và số tin chưa đọc
        const result = await pool.request()
            .input('userId', sql.Int, parsedUserId)
            .query(`
                WITH LastMessages AS (
                    SELECT 
                        M.*,
                        ROW_NUMBER() OVER (PARTITION BY 
                            CASE WHEN SenderID = @userId THEN ReceiverID ELSE SenderID END 
                            ORDER BY CreatedAt DESC) as rn
                    FROM Messages M
                    WHERE SenderID = @userId OR ReceiverID = @userId
                ),
                UnreadCounts AS (
                    SELECT SenderID, COUNT(*) AS UnreadCount
                    FROM Messages
                    WHERE ReceiverID = @userId AND IsRead = 0
                    GROUP BY SenderID
                )
                SELECT 
                    LM.MessageID,
                    LM.MessageContent,
                    LM.CreatedAt,
                    LM.IsRead,
                    LM.SenderID,
                    LM.ReceiverID,
                    CASE WHEN LM.SenderID = @userId THEN LM.ReceiverID ELSE LM.SenderID END AS PartnerID,
                    U.Username AS PartnerName,
                    U.Email AS PartnerEmail,
                    U.Phone AS PartnerPhone,
                    U.Address AS PartnerAddress,
                    C.CompanyName,
                    C.LogoURL,
                    COALESCE(UC.UnreadCount, 0) AS UnreadCount
                FROM LastMessages LM
                JOIN Users U ON U.Id = CASE WHEN LM.SenderID = @userId THEN LM.ReceiverID ELSE LM.SenderID END
                LEFT JOIN Companies C ON U.CompanyID = C.CompanyID
                LEFT JOIN UnreadCounts UC ON UC.SenderID = U.Id
                WHERE LM.rn = 1
                ORDER BY LM.CreatedAt DESC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi getConversations:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

// ─── 2. Lấy lịch sử tin nhắn giữa hai User ─────────────────────────
const getChatHistory = async (req, res) => {
    try {
        await poolConnect;
        const { userId, partnerId } = req.params;
        const uid = parseInt(userId, 10);
        const pid = parseInt(partnerId, 10);

        if (isNaN(uid) || isNaN(pid)) {
            return res.status(400).json({ error: "Tham số ID không hợp lệ." });
        }

        const result = await pool.request()
            .input('userId', sql.Int, uid)
            .input('partnerId', sql.Int, pid)
            .query(`
                SELECT 
                    MessageID,
                    SenderID,
                    ReceiverID,
                    MessageContent,
                    CreatedAt,
                    IsRead,
                    AttachmentURL,
                    AttachmentName
                FROM Messages
                WHERE (SenderID = @userId AND ReceiverID = @partnerId)
                   OR (SenderID = @partnerId AND ReceiverID = @userId)
                ORDER BY CreatedAt ASC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi getChatHistory:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

// ─── 3. Đánh dấu tin nhắn là đã đọc ───────────────────────────────
const markAsRead = async (req, res) => {
    try {
        await poolConnect;
        const { userId, partnerId } = req.params;
        const uid = parseInt(userId, 10);
        const pid = parseInt(partnerId, 10);

        if (isNaN(uid) || isNaN(pid)) {
            return res.status(400).json({ error: "Tham số ID không hợp lệ." });
        }

        await pool.request()
            .input('userId', sql.Int, uid)
            .input('partnerId', sql.Int, pid)
            .query(`
                UPDATE Messages
                SET IsRead = 1
                WHERE SenderID = @partnerId AND ReceiverID = @userId AND IsRead = 0
            `);

        res.status(200).json({ message: "Đã đánh dấu các tin nhắn là đã đọc." });
    } catch (err) {
        console.error("❌ Lỗi markAsRead:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

// ─── 4. Gửi tin nhắn mới ─────────────────────────────────────────
const sendMessage = async (req, res) => {
    try {
        await poolConnect;
        const { senderId, receiverId, messageContent, attachmentUrl, attachmentName } = req.body;

        const sid = parseInt(senderId, 10);
        const rid = parseInt(receiverId, 10);

        if (isNaN(sid) || isNaN(rid) || !messageContent) {
            return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc hoặc tham số không hợp lệ." });
        }

        const result = await pool.request()
            .input('senderId', sql.Int, sid)
            .input('receiverId', sql.Int, rid)
            .input('messageContent', sql.NVarChar, messageContent)
            .input('attachmentUrl', sql.NVarChar, attachmentUrl || null)
            .input('attachmentName', sql.NVarChar, attachmentName || null)
            .query(`
                INSERT INTO Messages (SenderID, ReceiverID, MessageContent, CreatedAt, IsRead, AttachmentURL, AttachmentName)
                OUTPUT INSERTED.MessageID, INSERTED.CreatedAt, INSERTED.IsRead
                VALUES (@senderId, @receiverId, @messageContent, GETDATE(), 0, @attachmentUrl, @attachmentName)
            `);

        const inserted = result.recordset[0];

        res.status(201).json({
            message: "Gửi tin nhắn thành công",
            data: {
                MessageID: inserted.MessageID,
                SenderID: sid,
                ReceiverID: rid,
                MessageContent: messageContent,
                CreatedAt: inserted.CreatedAt,
                IsRead: inserted.IsRead,
                AttachmentURL: attachmentUrl || null,
                AttachmentName: attachmentName || null
            }
        });
    } catch (err) {
        console.error("❌ Lỗi sendMessage:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

// ─── 5. Lấy nhà tuyển dụng của công ty để ứng viên chat ───────────────
const getEmployerOfCompany = async (req, res) => {
    try {
        await poolConnect;
        const { companyId } = req.params;
        const cid = parseInt(companyId, 10);

        if (isNaN(cid)) {
            return res.status(400).json({ error: "CompanyID không hợp lệ." });
        }

        const result = await pool.request()
            .input('companyId', sql.Int, cid)
            .query(`
                SELECT TOP 1 U.Id, U.Username, U.Email, U.Phone
                FROM Users U
                JOIN UserRoles UR ON U.Id = UR.UserId
                JOIN Roles R ON UR.RoleId = R.RoleId
                WHERE U.CompanyID = @companyId AND R.RoleName = 'Employer'
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy nhà tuyển dụng của công ty này." });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error("❌ Lỗi getEmployerOfCompany:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

module.exports = {
    getConversations,
    getChatHistory,
    markAsRead,
    sendMessage,
    getEmployerOfCompany
};
