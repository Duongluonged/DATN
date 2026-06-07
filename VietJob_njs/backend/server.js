require('dotenv').config(); // Load .env variables
const express = require("express");
const cors = require("cors");
// Import các Route
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const cvRoutes = require('./routes/cvRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const courseRoutes = require('./routes/courseRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reportRoutes = require('./routes/reportRoutes');
const reviewRoutes  = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/admin');
const walletRoutes = require('./routes/walletRoutes');
const userCourseRoutes = require('./routes/userCourseRoutes');

const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload API Endpoint (Base64 file writer)
app.post("/api/upload", (req, res) => {
    try {
        const { base64, fileName } = req.body;
        if (!base64 || !fileName) {
            return res.status(400).json({ error: "Vui lòng cung cấp dữ liệu tệp tin." });
        }

        // Regex tổng quát: khớp mọi MIME type (kể cả .docx, .pdf, ...)
        const matches = base64.match(/^data:([^;]+);base64,([\s\S]+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ error: "Định dạng file không hợp lệ." });
        }

        const fileBuffer = Buffer.from(matches[2], "base64");
        const uploadDir = path.join(__dirname, "uploads");

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uniqueFileName = `${Date.now()}_${fileName.replace(/\s+/g, "_")}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        fs.writeFileSync(filePath, fileBuffer);

        const fileUrl = `http://localhost:5000/uploads/${uniqueFileName}`;
        res.status(200).json({ url: fileUrl });
    } catch (err) {
        console.error("❌ Lỗi upload:", err);
        res.status(500).json({ error: "Lỗi tải ảnh lên máy chủ", details: err.message });
    }
});

// Sử dụng route - Phân tách rõ ràng các đầu mục API
app.use("/api/auth", authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/applications', applicationRoutes); // Ứng tuyển & quản lý hồ sơ
app.use('/api/courses', courseRoutes); // Quản lý khóa học
app.use('/api/messages', messageRoutes); // Nhắn tin ứng viên & nhà tuyển dụng
app.use('/api/reports', reportRoutes); // Khiếu nại/Báo cáo tin tuyển dụng vi phạm
app.use('/api/reviews', reviewRoutes);  // Đánh giá công ty
app.use('/api/notifications', notificationRoutes); // Thông báo
app.use('/api/admin', adminRoutes); // Admin routes
app.use('/api/wallet', walletRoutes); // Ví tiền nhà tuyển dụng
app.use('/api/user-courses', userCourseRoutes); // Lộ trình học tập

// Xử lý lỗi 404 cho các route không tồn tại
app.use((req, res) => {
    res.status(404).json({ message: "API Endpoint không tồn tại" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chay tai: http://localhost:${PORT}`);
});