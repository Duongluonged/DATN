const { pool, poolConnect, sql } = require('../config/db');

// ─── 1. Lấy danh sách lộ trình học tập của người dùng ─────────────────────────
const getUserCourses = async (req, res) => {
    try {
        await poolConnect;
        const { userId } = req.params;

        const result = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT UserCourseID, CourseId, Status, CreatedAt, LastModifiedAt
                FROM User_Courses
                WHERE UserId = @userId
                ORDER BY LastModifiedAt DESC
            `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error('❌ Lỗi getUserCourses:', err);
        res.status(500).json({ message: 'Lỗi lấy lộ trình học tập', error: err.message });
    }
};

// ─── 2. Thêm khóa học vào danh sách quan tâm (Wishlist) ─────────────────────────
const addUserCourse = async (req, res) => {
    try {
        await poolConnect;
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc khóa học.' });
        }

        // Kiểm tra xem khóa học đã tồn tại trong lộ trình chưa
        const checkExist = await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.NVarChar, courseId)
            .query(`
                SELECT UserCourseID, Status 
                FROM User_Courses 
                WHERE UserId = @userId AND CourseId = @courseId
            `);

        if (checkExist.recordset.length > 0) {
            return res.status(400).json({ 
                message: 'Khóa học này đã có trong lộ trình học tập của bạn.',
                status: checkExist.recordset[0].Status 
            });
        }

        // Thêm mới với trạng thái mặc định "Đang quan tâm"
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.NVarChar, courseId)
            .query(`
                INSERT INTO User_Courses (UserId, CourseId, Status, CreatedAt, LastModifiedAt)
                VALUES (@userId, @courseId, N'Đang quan tâm', GETDATE(), GETDATE())
            `);

        res.status(201).json({ message: 'Đã thêm khóa học vào danh sách quan tâm!' });
    } catch (err) {
        console.error('❌ Lỗi addUserCourse:', err);
        res.status(500).json({ message: 'Lỗi thêm khóa học vào lộ trình', error: err.message });
    }
};

// ─── 3. Gỡ bỏ khóa học khỏi danh sách ─────────────────────────────────────────
const removeUserCourse = async (req, res) => {
    try {
        await poolConnect;
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc khóa học.' });
        }

        await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.NVarChar, courseId)
            .query(`
                DELETE FROM User_Courses 
                WHERE UserId = @userId AND CourseId = @courseId
            `);

        res.status(200).json({ message: 'Đã gỡ khóa học khỏi lộ trình của bạn.' });
    } catch (err) {
        console.error('❌ Lỗi removeUserCourse:', err);
        res.status(500).json({ message: 'Lỗi gỡ khóa học', error: err.message });
    }
};

// ─── 4. Đăng ký học ngay (Thanh toán qua ví & Gửi mail link Driver khóa học) ───────
const transporter = require('../config/mailer');

const enrollUserCourse = async (req, res) => {
    try {
        await poolConnect;
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc khóa học.' });
        }

        // 1. Lấy thông tin chi tiết khóa học (từ SQL hoặc Mock if mock ID)
        let courseTitle = "Khóa học Đào tạo Công nghệ";
        let coursePrice = 1500000;
        let nhaTuyenDungId = null;
        let driveLink = "https://drive.google.com/drive/folders/1abc-vietjob-dummy-link-course";

        const isMock = isNaN(courseId);

        if (!isMock) {
            // Lấy từ bảng khoa_hoc
            const courseRes = await pool.request()
                .input('courseId', sql.Int, parseInt(courseId))
                .query(`
                    SELECT TieuDe, Price, NhaTuyenDungId, DriveLink 
                    FROM khoa_hoc 
                    WHERE Id = @courseId AND (IsDeleted = 0 OR IsDeleted IS NULL)
                `);
            
            if (courseRes.recordset.length > 0) {
                const c = courseRes.recordset[0];
                courseTitle = c.TieuDe || courseTitle;
                coursePrice = c.Price !== undefined && c.Price !== null ? c.Price : coursePrice;
                nhaTuyenDungId = c.NhaTuyenDungId || null;
                driveLink = c.DriveLink || driveLink;
            }
        } else {
            // Nếu là Mock course, tùy vào ID để gán giá trị trực quan
            if (courseId === 'web-1') {
                courseTitle = 'Lập trình Web Fullstack với React & Node.js';
                coursePrice = 2490000;
            } else if (courseId === 'web-2') {
                courseTitle = 'Phát triển ứng dụng Web hiện đại với Next.js & Tailwind CSS';
                coursePrice = 1890000;
            } else if (courseId === 'mobile-1') {
                courseTitle = 'Lập trình Flutter đa nền tảng cho iOS & Android';
                coursePrice = 2200000;
            } else if (courseId === 'mobile-2') {
                courseTitle = 'Lập trình React Native - Xây dựng ứng dụng thực tế';
                coursePrice = 1990000;
            } else if (courseId === 'data-ai-1') {
                courseTitle = 'Khoa học dữ liệu (Data Science) với Python thực chiến';
                coursePrice = 2990000;
            } else if (courseId === 'data-ai-2') {
                courseTitle = 'Kỹ sư Trí tuệ nhân tạo (AI) & Machine Learning ứng dụng';
                coursePrice = 3490000;
            } else if (courseId === 'design-gamedev-1') {
                courseTitle = 'Thiết kế UI/UX Chuyên nghiệp với Figma';
                coursePrice = 1590000;
            } else if (courseId === 'design-gamedev-2') {
                courseTitle = 'Lập trình Game 3D với Unity & C#';
                coursePrice = 2150000;
            }
        }

        // 2. Kiểm tra thông tin & số dư của Học viên
        const studentRes = await pool.request()
            .input('userId', sql.Int, userId)
            .query(`SELECT Balance, Email, Username FROM Users WHERE Id = @userId`);
        
        if (studentRes.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy tài khoản người dùng." });
        }

        const { Balance: studentBalance, Email: studentEmail, Username: studentName } = studentRes.recordset[0];
        let activeStudentBalance = studentBalance;

        if (req.body.isBankTransfer) {
            // Giả lập Webhook ngân hàng: tự động nạp tiền vào ví học viên nếu thiếu số dư để thanh toán khóa học
            if (studentBalance < coursePrice) {
                const depositAmount = coursePrice - studentBalance;
                await pool.request()
                    .input('userId', sql.Int, userId)
                    .input('amount', sql.Int, depositAmount)
                    .query(`UPDATE Users SET Balance = Balance + @amount WHERE Id = @userId`);
                
                // Ghi log giao dịch nạp tiền qua VietQR Webhook
                await pool.request()
                    .input('userId', sql.Int, userId)
                    .input('title', sql.NVarChar, `Nạp tiền tự động qua Webhook VietQR (Khớp lệnh: USER_${userId}_TXN_${req.body.txnId || 'MOCK'})`)
                    .input('amount', sql.Int, depositAmount)
                    .input('type', sql.NVarChar, 'Nap')
                    .input('status', sql.NVarChar, 'ThanhCong')
                    .input('refCode', sql.NVarChar, "QR" + Math.floor(1000000 + Math.random() * 9000000))
                    .query(`
                        INSERT INTO Transactions (UserId, Title, Amount, Type, Status, RefCode)
                        VALUES (@userId, @title, @amount, @type, @status, @refCode)
                    `);
                
                activeStudentBalance = coursePrice;
            }
        }

        if (activeStudentBalance < coursePrice) {
            return res.status(400).json({ 
                message: `Số dư ví của bạn không đủ để thanh toán khóa học này! (Cần: ${coursePrice.toLocaleString('vi-VN')}đ, hiện có: ${activeStudentBalance.toLocaleString('vi-VN')}đ). Vui lòng nạp thêm tiền!` 
            });
        }

        // 3. Thực hiện thanh toán & Chia sẻ doanh thu (giao dịch SQL)
        const studentRefCode = "CSH" + Math.floor(1000000 + Math.random() * 9000000);
        
        // Trừ tiền học viên
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('price', sql.Int, coursePrice)
            .query(`UPDATE Users SET Balance = Balance - @price WHERE Id = @userId`);

        // Ghi log giao dịch trừ tiền học viên
        await pool.request()
            .input('userId', sql.Int, userId)
            .input('title', sql.NVarChar, `Thanh toán mua khóa học: ${courseTitle}`)
            .input('amount', sql.Int, -coursePrice)
            .input('type', sql.NVarChar, 'ThanhToan')
            .input('status', sql.NVarChar, 'ThanhCong')
            .input('refCode', sql.NVarChar, studentRefCode)
            .query(`
                INSERT INTO Transactions (UserId, Title, Amount, Type, Status, RefCode)
                VALUES (@userId, @title, @amount, @type, @status, @refCode)
            `);

        // Chia sẻ hoa hồng cho Nhà tuyển dụng (85% giá bán) nếu có liên kết NTD
        if (nhaTuyenDungId) {
            const recruiterAmount = Math.floor(coursePrice * 0.85);
            const recruiterRefCode = "CSR" + Math.floor(1000000 + Math.random() * 9000000);

            // Cộng tiền vào ví NTD
            await pool.request()
                .input('recruiterId', sql.Int, nhaTuyenDungId)
                .input('amount', sql.Int, recruiterAmount)
                .query(`UPDATE Users SET Balance = Balance + @amount WHERE Id = @recruiterId`);

            // Ghi log giao dịch nhận hoa hồng của NTD
            await pool.request()
                .input('recruiterId', sql.Int, nhaTuyenDungId)
                .input('title', sql.NVarChar, `Doanh thu bán khóa học: ${courseTitle} (85%) từ học viên ${studentName}`)
                .input('amount', sql.Int, recruiterAmount)
                .input('type', sql.NVarChar, 'BanKhoaHoc')
                .input('status', sql.NVarChar, 'ThanhCong')
                .input('refCode', sql.NVarChar, recruiterRefCode)
                .query(`
                    INSERT INTO Transactions (UserId, Title, Amount, Type, Status, RefCode)
                    VALUES (@recruiterId, @title, @amount, @type, @status, @refCode)
                `);
        }

        // 4. Thêm khóa học vào User_Courses với trạng thái "Đang theo học"
        const checkExist = await pool.request()
            .input('userId', sql.Int, userId)
            .input('courseId', sql.NVarChar, String(courseId))
            .query(`SELECT UserCourseID FROM User_Courses WHERE UserId = @userId AND CourseId = @courseId`);

        if (checkExist.recordset.length > 0) {
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('courseId', sql.NVarChar, String(courseId))
                .query(`
                    UPDATE User_Courses 
                    SET Status = N'Đang theo học', LastModifiedAt = GETDATE()
                    WHERE UserId = @userId AND CourseId = @courseId
                `);
        } else {
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('courseId', sql.NVarChar, String(courseId))
                .query(`
                    INSERT INTO User_Courses (UserId, CourseId, Status, CreatedAt, LastModifiedAt)
                    VALUES (@userId, @courseId, N'Đang theo học', GETDATE(), GETDATE())
                `);
        }

        // 5. Gửi Email thông báo link Google Drive khóa học cho Học viên
        if (studentEmail) {
            const mailOptions = {
                from: '"VietJob Support" <luongduongess@gmail.com>',
                to: studentEmail,
                subject: `[VietJob] Xác nhận Thanh toán & Kích hoạt Khóa học: ${courseTitle}`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); color: #1e293b;">
                        <!-- Header banner -->
                        <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">XÁC NHẬN THANH TOÁN</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Chúc mừng bạn đã sở hữu khóa học thành công!</p>
                        </div>
                        
                        <!-- Body -->
                        <div style="padding: 24px; background-color: #ffffff;">
                            <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">Chào <strong>${studentName}</strong>,</p>
                            <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                                Cảm ơn bạn đã lựa chọn lộ trình đào tạo chuẩn thị trường việc làm tại <strong>VietJob</strong>. Hệ thống đã xử lý giao dịch mua khóa học của bạn thành công. Dưới đây là thông tin chi tiết biên lai của bạn:
                            </p>
                            
                            <!-- Receipt Info Grid -->
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
                                    <tr>
                                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Tên khóa học:</td>
                                        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #0f172a;">${courseTitle}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Giá khóa học:</td>
                                        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #ef4444;">${coursePrice.toLocaleString('vi-VN')} đ</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Phương thức:</td>
                                        <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #1e3a8a;">Ví điện tử VietJob</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Mã tham chiếu:</td>
                                        <td style="padding: 6px 0; text-align: right; font-family: monospace; color: #475569;">${studentRefCode}</td>
                                    </tr>
                                    <tr style="border-top: 1px solid #e2e8f0;">
                                        <td style="padding: 12px 0 0 0; color: #0f172a; font-weight: 700;">Tổng thanh toán:</td>
                                        <td style="padding: 12px 0 0 0; text-align: right; font-size: 16px; font-weight: 800; color: #10b981;">-${coursePrice.toLocaleString('vi-VN')} đ</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- Drive Access Link Card -->
                            <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(202, 138, 4, 0.03)); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 800; color: #a16207;">KÍCH HOẠT LINK HỌC TẬP (GOOGLE DRIVE)</h3>
                                <p style="margin: 0 0 16px 0; font-size: 12.5px; color: #713f12; line-height: 1.5;">
                                    Đặc quyền truy cập vĩnh viễn toàn bộ kho video bài giảng chất lượng cao, tài liệu đi kèm và source code thực hành của khóa học trên Google Drive:
                                </p>
                                <a href="${driveLink}" target="_blank" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #ca8a04, #a16207); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 800; font-size: 14.5px; box-shadow: 0 4px 10px rgba(202,138,4,0.3); transition: all 0.2s;">
                                    👉 TRUY CẬP THƯ MỤC KHÓA HỌC
                                </a>
                            </div>
                            
                            <p style="font-size: 13px; color: #64748b; line-height: 1.6; margin: 0; text-align: center;">
                                Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ Bộ phận hỗ trợ của chúng tôi tại <a href="mailto:support@vietjob.com" style="color: #3b82f6; text-decoration: none;">support@vietjob.com</a>.
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
                            © 2026 VietJob Inc. Lộ trình Đào tạo Công nghệ hàng đầu Việt Nam.<br/>
                            Tầng 5, Tòa nhà công nghệ cao, Hà Nội, Việt Nam.
                        </div>
                    </div>
                `
            };

            // Gửi email bất đồng bộ (không chặn phản hồi API để nâng cao trải nghiệm ứng viên)
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("❌ Lỗi gửi email biên lai khóa học:", error);
                } else {
                    console.log("✅ Đã gửi email biên lai & link Drive tới:", studentEmail, info.response);
                }
            });
        }

        res.status(200).json({ 
            message: '🎉 Thanh toán & Đăng ký khóa học thành công! Biên lai học tập & link Drive bài giảng đã được gửi tới email của bạn.',
            driveLink
        });
    } catch (err) {
        console.error('❌ Lỗi enrollUserCourse:', err);
        res.status(500).json({ message: 'Lỗi đăng ký học khóa học', error: err.message });
    }
};

module.exports = { getUserCourses, addUserCourse, removeUserCourse, enrollUserCourse };
