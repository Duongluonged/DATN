require('dotenv').config();
const express = require("express");
const cors = require("cors");
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

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/upload", (req, res) => {
    try {
        const { base64, fileName } = req.body;
        if (!base64 || !fileName) {
            return res.status(400).json({ error: "Vui lòng cung cấp dữ liệu tệp tin." });
        }

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

app.use("/api/auth", authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/user-courses', userCourseRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "API Endpoint không tồn tại" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chay tai: http://localhost:${PORT}`);
});