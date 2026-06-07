const { pool, poolConnect, sql } = require('../config/db');

// ─── 1. Ứng viên nộp đơn ứng tuyển ────────────────────────────
const postApplyJob = async (req, res) => {
    try {
        await poolConnect;
        const { jobId, userId, name, phone, city, coverLetter, cvPath } = req.body;

        if (!jobId || !name) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (jobId, name).' });
        }

        // Kiểm tra đã ứng tuyển chưa
        if (userId) {
            const existed = await pool.request()
                .input('jobId',  sql.Int, jobId)
                .input('userId', sql.Int, userId)
                .query(`SELECT ApplicationID FROM Applications WHERE JobID = @jobId AND UserId = @userId`);
            if (existed.recordset.length > 0) {
                return res.status(409).json({ message: 'Bạn đã ứng tuyển vị trí này rồi!' });
            }
        }

        await pool.request()
            .input('jobId',       sql.Int,      jobId)
            .input('userId',      sql.Int,      userId || null)
            .input('name',        sql.NVarChar,  name)
            .input('phone',       sql.NVarChar,  phone       || null)
            .input('city',        sql.NVarChar,  city        || null)
            .input('coverLetter', sql.NVarChar,  coverLetter || null)
            .input('cvPath',      sql.NVarChar,  cvPath      || null)
            .query(`
                INSERT INTO Applications
                    (JobID, UserId, CandidateName, Phone, City, CoverLetter, CV_Path, Status, AppliedAt)
                VALUES
                    (@jobId, @userId, @name, @phone, @city, @coverLetter, @cvPath, N'Mới', GETDATE())
            `);

        res.status(201).json({ message: 'Nộp hồ sơ thành công!' });
    } catch (err) {
        console.error('❌ Lỗi postApplyJob:', err);
        res.status(500).json({ message: 'Lỗi khi nộp hồ sơ', error: err.message });
    }
};

// ─── 2. Lấy danh sách ứng viên theo NHÀ TUYỂN DỤNG ────────────
const getApplicationsByEmployer = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const { jobId, status } = req.query;

        const request = pool.request().input('userId', sql.Int, userId);
        let query = `
            SELECT 
                A.ApplicationID, A.CandidateName, A.Phone, A.City,
                A.CoverLetter, A.CV_Path, A.Status, A.AppliedAt,
                A.UserId AS CandidateUserId,
                J.JobID, J.JobTitle,
                C.CompanyName
            FROM Applications A
            JOIN Jobs J ON A.JobID = J.JobID
            JOIN Companies C ON J.CompanyID = C.CompanyID
            JOIN Users U ON U.CompanyID = C.CompanyID
            WHERE U.Id = @userId
        `;

        if (jobId && jobId !== 'all') {
            query += ` AND J.JobID = @jobId`;
            request.input('jobId', sql.Int, jobId);
        }
        if (status && status !== 'all') {
            query += ` AND A.Status = @status`;
            request.input('status', sql.NVarChar, status);
        }

        query += ` ORDER BY A.AppliedAt DESC`;

        const result = await request.query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getApplicationsByEmployer:', err);
        res.status(500).json({ message: 'Lỗi lấy danh sách ứng viên', error: err.message });
    }
};

// ─── 3. Cập nhật trạng thái hồ sơ ─────────────────────────────
const updateApplicationStatus = async (req, res) => {
    try {
        await poolConnect;
        const { applicationId } = req.params;
        const { status, interviewDate, interviewFormat, interviewLocation, interviewNote } = req.body;

        const allowed = ['Mới', 'Đang xem xét', 'Phỏng vấn', 'Từ chối', 'Đã tuyển'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ.' });
        }

        // 1. Cập nhật trạng thái và thông tin lịch hẹn
        await pool.request()
            .input('appId',  sql.Int,     applicationId)
            .input('status', sql.NVarChar, status)
            .input('date', sql.NVarChar, interviewDate || null)
            .input('format', sql.NVarChar, interviewFormat || null)
            .input('location', sql.NVarChar, interviewLocation || null)
            .input('note', sql.NVarChar, interviewNote || null)
            .query(`
                UPDATE Applications 
                SET Status = @status,
                    InterviewDate = @date,
                    InterviewFormat = @format,
                    InterviewLocation = @location,
                    InterviewNote = @note
                WHERE ApplicationID = @appId
            `);

        // 2. Lấy thông tin ứng viên để gửi email
        const appResult = await pool.request()
            .input('appId', sql.Int, applicationId)
            .query(`
                SELECT
                    A.CandidateName, A.UserId,
                    J.JobTitle,
                    C.CompanyName,
                    U.Email
                FROM Applications A
                JOIN Jobs J ON A.JobID = J.JobID
                JOIN Companies C ON J.CompanyID = C.CompanyID
                LEFT JOIN Users U ON A.UserId = U.Id
                WHERE A.ApplicationID = @appId
            `);

        // 3. Gửi email nếu có địa chỉ email và status cần thông báo
        const app = appResult.recordset[0];
        // 3. Tự động tạo thông báo trong hệ thống
        if (app && app.UserId) {
            const notifMap = {
                'Phỏng vấn': {
                    type: 'invite',
                    title: `Lời mời phỏng vấn từ ${app.CompanyName}`,
                    content: `Đơn ứng tuyển vị trí "${app.JobTitle}" của bạn đã được ${app.CompanyName} chấp nhận. Họ mời bạn tham gia phỏng vấn!`,
                },
                'Từ chối': {
                    type: 'system',
                    title: `Kết quả ứng tuyển từ ${app.CompanyName}`,
                    content: `Rất tiếc, hồ sơ ứng tuyển vị trí "${app.JobTitle}" tại ${app.CompanyName} chưa phù hợp lần này. Hãy tiếp tục cố gắng!`,
                },
                'Đã tuyển': {
                    type: 'invite',
                    title: `Chúc mừng! Bạn đã được tuyển dụng tại ${app.CompanyName}`,
                    content: `Bạn đã chính thức được tuyển cho vị trí "${app.JobTitle}" tại ${app.CompanyName}. HR sẽ sớm liên hệ bạn!`,
                },
                'Đang xem xét': {
                    type: 'system',
                    title: `Hồ sơ đang được xem xét bởi ${app.CompanyName}`,
                    content: `Nhà tuyển dụng ${app.CompanyName} đang xem xét hồ sơ ứng tuyển vị trí "${app.JobTitle}" của bạn.`,
                },
            };

            const notif = notifMap[status];
            if (notif) {
                try {
                    await pool.request()
                        .input('userId',  sql.Int,      app.UserId)
                        .input('type',    sql.NVarChar,  notif.type)
                        .input('title',   sql.NVarChar,  notif.title)
                        .input('content', sql.NVarChar,  notif.content)
                        .input('relatedId', sql.Int,    parseInt(applicationId))
                        .query(`
                            INSERT INTO Notifications (UserId, Type, Title, Content, RelatedID)
                            VALUES (@userId, @type, @title, @content, @relatedId)
                        `);
                } catch (notifErr) {
                    console.error('⚠️ Lỗi tạo thông báo (trạng thái vẫn đã cập nhật):', notifErr.message);
                }
            }
        }

        const shouldNotify = ['Phỏng vấn', 'Từ chối', 'Đã tuyển'].includes(status);

        if (app && app.Email && shouldNotify) {
            const subjects = {
                'Phỏng vấn': `[VietJob] Lời mời tham gia phỏng vấn tại ${app.CompanyName}`,
                'Từ chối':   `[VietJob] Kết quả ứng tuyển vị trí ${app.JobTitle} tại ${app.CompanyName}`,
                'Đã tuyển':  `[VietJob] Chúc mừng! Bạn đã được tuyển dụng tại ${app.CompanyName}`,
            };

            const bodies = {
                'Phỏng vấn': `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                        <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; color: #fff;">
                            <span style="font-size: 40px;">📅</span>
                            <h1 style="margin: 10px 0 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Lời Mời Phỏng Vấn</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Chúc mừng bạn đã lọt vào vòng tiếp theo!</p>
                        </div>
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <p>Xin chào <strong>${app.CandidateName}</strong>,</p>
                            <p>Hồ sơ ứng tuyển của bạn cho vị trí <strong style="color: #2563eb;">${app.JobTitle}</strong> tại công ty <strong>${app.CompanyName}</strong> đã xuất sắc vượt qua vòng sơ loại.</p>
                            <p>Chúng tôi trân trọng kính mời bạn tham dự buổi phỏng vấn chi tiết như sau:</p>
                            
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 13px; color: #64748b; width: 140px; font-weight: 600;">⏰ Thời gian:</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #1e293b; font-weight: 700;">${interviewDate || 'Sẽ liên hệ để thống nhất thêm'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">💻 Hình thức:</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #1e293b; font-weight: 700;">${interviewFormat || 'Trực tiếp / Online'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">📍 Địa điểm / Link họp:</td>
                                        <td style="padding: 6px 0; font-size: 14px; color: #1e293b; font-weight: 700; word-break: break-all;">${interviewLocation || 'Sẽ thông báo chi tiết'}</td>
                                    </tr>
                                    ${interviewNote ? `
                                    <tr>
                                        <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600; vertical-align: top;">📝 Ghi chú tuyển dụng:</td>
                                        <td style="padding: 6px 0; font-size: 13px; color: #475569; line-height: 1.5;">${interviewNote}</td>
                                    </tr>` : ''}
                                </table>
                            </div>
                            
                            <p>Vui lòng chuẩn bị trang phục lịch sự và phản hồi lại email này để xác nhận lịch phỏng vấn.</p>
                            <p>Chúc bạn có một buổi phỏng vấn đạt kết quả cao nhất!</p>
                            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                            <p style="color: #94a3b8; font-size: 11px; margin: 0; text-align: center;">Email tự động từ nền tảng hỗ trợ tuyển dụng <strong>VietJob</strong>.</p>
                        </div>
                    </div>`,
                'Từ chối': `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                        <div style="background: #374151; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; color: #fff;">
                            <span style="font-size: 40px;">✉️</span>
                            <h1 style="margin: 10px 0 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Thông báo kết quả ứng tuyển</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Cảm ơn bạn đã quan tâm đến cơ hội nghề nghiệp của chúng tôi</p>
                        </div>
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <p>Xin chào <strong>${app.CandidateName}</strong>,</p>
                            <p>Cảm ơn bạn đã dành thời gian ứng tuyển vào vị trí <strong style="color: #e11d48;">${app.JobTitle}</strong> tại công ty <strong>${app.CompanyName}</strong>.</p>
                            <p>Hội đồng tuyển dụng đã xem xét kỹ hồ sơ của bạn. Chúng tôi rất tiếc phải thông báo rằng ở thời điểm hiện tại, hồ sơ của bạn chưa đáp ứng trọn vẹn tiêu chí của vị trí tuyển dụng này.</p>
                            <p>Thông tin của bạn đã được lưu lại trong cơ sở dữ liệu doanh nghiệp và chúng tôi sẽ chủ động liên hệ nếu có vị trí khác phù hợp hơn trong tương lai.</p>
                            <p>Chúc bạn gặt hái nhiều thành công trên con đường phát triển sự nghiệp sắp tới.</p>
                            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                            <p style="color: #94a3b8; font-size: 11px; margin: 0; text-align: center;">Email tự động từ nền tảng hỗ trợ tuyển dụng <strong>VietJob</strong>.</p>
                        </div>
                    </div>`,
                'Đã tuyển': `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                        <div style="background: linear-gradient(135deg, #15803d, #16a34a); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; color: #fff;">
                            <span style="font-size: 40px;">🏆</span>
                            <h1 style="margin: 10px 0 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Chào mừng bạn gia nhập công ty!</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Chúc mừng bạn đã chính thức được tuyển dụng</p>
                        </div>
                        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <p>Xin chào <strong>${app.CandidateName}</strong>,</p>
                            <p>Chúc mừng! Bạn đã xuất sắc vượt qua toàn bộ các thử thách và chính thức được tiếp nhận vào làm việc tại vị trí <strong>${app.JobTitle}</strong> của <strong>${app.CompanyName}</strong>!</p>
                            <p>Đại diện bộ phận nhân sự của công ty sẽ sớm liên hệ trực tiếp với bạn qua điện thoại hoặc email để hướng dẫn chi tiết về ngày bắt đầu làm việc, hồ sơ chuẩn bị và ký kết hợp đồng lao động.</p>
                            <p>Chúc bạn có một khởi đầu may mắn và bùng nổ cùng tập thể mới!</p>
                            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                            <p style="color: #94a3b8; font-size: 11px; margin: 0; text-align: center;">Email tự động từ nền tảng hỗ trợ tuyển dụng <strong>VietJob</strong>.</p>
                        </div>
                    </div>`,
            };

            try {
                const transporter = require('../config/mailer');
                await transporter.sendMail({
                    from: '"VietJob" <luongduongess@gmail.com>',
                    to: app.Email,
                    subject: subjects[status],
                    html: bodies[status],
                });
                console.log(`✅ Đã gửi email thông báo "${status}" đến ${app.Email}`);
            } catch (mailErr) {
                console.error('⚠️ Lỗi gửi email (trạng thái vẫn đã cập nhật):', mailErr.message);
            }
        }

        res.status(200).json({ message: 'Cập nhật trạng thái thành công!' });
    } catch (err) {
        console.error('❌ Lỗi updateApplicationStatus:', err);
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái', error: err.message });
    }
};


// ─── 4. Lấy lịch sử ứng tuyển của ứng viên ────────────────────
const getApplicationsByCandidate = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;
        const parsedUserId = parseInt(userId, 10);
        if (isNaN(parsedUserId)) {
            return res.status(400).json({ message: 'UserId không hợp lệ.' });
        }

        const result = await pool.request()
            .input('userId', sql.Int, parsedUserId)
            .query(`
                SELECT 
                    A.ApplicationID, A.Status, A.AppliedAt,
                    J.JobID, J.JobTitle, J.Location, J.JobType, J.SalaryRange,
                    C.CompanyName, C.LogoURL, C.CompanyID
                FROM Applications A
                JOIN Jobs J ON A.JobID = J.JobID
                JOIN Companies C ON J.CompanyID = C.CompanyID
                WHERE A.UserId = @userId
                ORDER BY A.AppliedAt DESC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getApplicationsByCandidate:', err);
        res.status(500).json({ message: 'Lỗi lấy lịch sử ứng tuyển', error: err.message });
    }
};

module.exports = {
    postApplyJob,
    getApplicationsByEmployer,
    updateApplicationStatus,
    getApplicationsByCandidate
};