const sql = require("mssql");

const config = {
    server: "localhost",
    database: "VietJob_DATN", // Đã đổi theo tên bạn cung cấp
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    // Chế độ đăng nhập không cần mật khẩu (Windows Authentication)
    driver: "msnodesqlv8",
    connectionString: "Driver={SQL Server Native Client 11.0};Server=localhost;Database=VietJob_DATN;Trusted_Connection=yes;"
};

// Lưu ý: Nếu dùng connectionString, bạn cần cài thêm thư viện: npm install msnodesqlv8
// Nếu không muốn cài thêm, hãy dùng cách dưới đây (sa/123456):

const configWithAuth = {
    user: "sa",
    password: "123", 
    server: "localhost",
    database: "VietJob_DATN",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const pool = new sql.ConnectionPool(configWithAuth);
const poolConnect = pool.connect()
    .then(p => {
        console.log("Kết nối SQL Server thành công!");
        return p;
    })
    .catch(err => console.log("Lỗi kết nối DB:", err));

module.exports = { sql, pool, poolConnect };