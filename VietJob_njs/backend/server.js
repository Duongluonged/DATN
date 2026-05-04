const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require('./routes/companyRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Sử dụng route
app.use("/api", authRoutes); // Các API sẽ có dạng: http://localhost:5000/api/login
app.use('/api', companyRoutes);

app.listen(5000, () => {
    console.log("Server đang chạy tại cổng 5000...");
});

