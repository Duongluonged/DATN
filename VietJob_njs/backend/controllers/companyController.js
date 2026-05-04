const { pool, poolConnect } = require('../config/db');

const getTopCompanies = async (req, res) => {
    try {
        await poolConnect; // 👈 đảm bảo đã connect DB

        const result = await pool.request().query(`
            SELECT * FROM Companies WHERE IsHot = 1
        `);

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("❌ Lỗi getTopCompanies:", err); // 👈 in ra terminal để debug
        res.status(500).json({
            message: "Lỗi server",
            error: err.message
        });
    }

};

module.exports = { getTopCompanies };