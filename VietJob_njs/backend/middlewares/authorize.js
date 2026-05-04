// Middleware check role
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user được tạo ra từ middleware auth.js sau khi giải mã JWT
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này!" });
        }
        next();
    };
};

module.exports = authorize;