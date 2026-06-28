const { sql, pool, poolConnect } = require('../config/db');

const getConversations = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const parsedUserId = parseInt(userId, 10);
        
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ error: "UserId không hợp lệ." });
        }

        const result = await pool.request()
            .input('userId', sql.Int, parsedUserId)
            .query(`
                WITH LastMessages AS (
                    SELECT 
                        M.MaTinNhan,
                        M.MaNguoiGui,
                        M.MaNguoiNhan,
                        M.NoiDungTinNhan,
                        M.NgayTao,
                        M.DaDoc,
                        M.DuongDanDinhKem,
                        M.TenFileDinhKem,
                        ROW_NUMBER() OVER (PARTITION BY 
                            CASE WHEN MaNguoiGui = @userId THEN MaNguoiNhan ELSE MaNguoiGui END 
                            ORDER BY NgayTao DESC) as rn
                    FROM TinNhan M
                    WHERE MaNguoiGui = @userId OR MaNguoiNhan = @userId
                ),
                UnreadCounts AS (
                    SELECT MaNguoiGui AS SenderID, COUNT(*) AS UnreadCount
                    FROM TinNhan
                    WHERE MaNguoiNhan = @userId AND DaDoc = 0
                    GROUP BY MaNguoiGui
                )
                SELECT 
                    LM.MaTinNhan AS MessageID,
                    LM.NoiDungTinNhan AS MessageContent,
                    LM.NgayTao AS CreatedAt,
                    LM.DaDoc AS IsRead,
                    LM.MaNguoiGui AS SenderID,
                    LM.MaNguoiNhan AS ReceiverID,
                    CASE WHEN LM.MaNguoiGui = @userId THEN LM.MaNguoiNhan ELSE LM.MaNguoiGui END AS PartnerID,
                    U.TenDangNhap AS PartnerName,
                    U.Email AS PartnerEmail,
                    U.SoDienThoai AS PartnerPhone,
                    U.DiaChi AS PartnerAddress,
                    C.TenCongTy AS CompanyName,
                    C.DuongDanLogo AS LogoURL,
                    COALESCE(UC.UnreadCount, 0) AS UnreadCount
                FROM LastMessages LM
                JOIN NguoiDung U ON U.Id = CASE WHEN LM.MaNguoiGui = @userId THEN LM.MaNguoiNhan ELSE LM.MaNguoiGui END
                LEFT JOIN CongTy C ON U.MaCongTy = C.MaCongTy
                LEFT JOIN UnreadCounts UC ON UC.SenderID = U.Id
                WHERE LM.rn = 1
                ORDER BY LM.NgayTao DESC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi getConversations:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

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
                    MaTinNhan AS MessageID,
                    MaNguoiGui AS SenderID,
                    MaNguoiNhan AS ReceiverID,
                    NoiDungTinNhan AS MessageContent,
                    NgayTao AS CreatedAt,
                    DaDoc AS IsRead,
                    DuongDanDinhKem AS AttachmentURL,
                    TenFileDinhKem AS AttachmentName
                FROM TinNhan
                WHERE (MaNguoiGui = @userId AND MaNguoiNhan = @partnerId)
                   OR (MaNguoiGui = @partnerId AND MaNguoiNhan = @userId)
                ORDER BY NgayTao ASC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi getChatHistory:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

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
                UPDATE TinNhan
                SET DaDoc = 1
                WHERE MaNguoiGui = @partnerId AND MaNguoiNhan = @userId AND DaDoc = 0
            `);

        res.status(200).json({ message: "Đã đánh dấu các tin nhắn là đã đọc." });
    } catch (err) {
        console.error("❌ Lỗi markAsRead:", err);
        res.status(500).json({ error: "Lỗi máy chủ", details: err.message });
    }
};

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
                INSERT INTO TinNhan (MaNguoiGui, MaNguoiNhan, NoiDungTinNhan, NgayTao, DaDoc, DuongDanDinhKem, TenFileDinhKem)
                OUTPUT INSERTED.MaTinNhan AS MessageID, INSERTED.NgayTao AS CreatedAt, INSERTED.DaDoc AS IsRead
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
                SELECT TOP 1 U.Id, U.TenDangNhap AS Username, U.Email, U.SoDienThoai AS Phone
                FROM NguoiDung U
                JOIN VaiTroNguoiDung UR ON U.Id = UR.MaNguoiDung
                JOIN VaiTro R ON UR.MaVaiTro = R.MaVaiTro
                WHERE U.MaCongTy = @companyId AND R.TenVaiTro = 'Employer'
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
