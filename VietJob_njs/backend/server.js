const express = require("express");
const cors = require("cors");
// Import các Route
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require('./routes/companyRoutes');
const jobRoutes = require('./routes/jobRoutes');
const cvRoutes = require('./routes/cvRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const courseRoutes = require('./routes/courseRoutes');

const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve static uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Upload API Endpoint (Base64 file writer)
app.post("/api/upload", (req, res) => {
    try {
        const { base64, fileName } = req.body;
        if (!base64 || !fileName) {
            return res.status(400).json({ error: "Vui lòng cung cấp dữ liệu tệp tin." });
        }

        const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ error: "Định dạng ảnh không hợp lệ." });
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

// Xử lý lỗi 404 cho các route không tồn tại
app.use((req, res) => {
    res.status(404).json({ message: "API Endpoint không tồn tại" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chay tai: http://localhost:${PORT}`);
});