const authorize = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.sendStatus(401);

        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'SECRET_KEY_CUA_BAN', (err, decoded) => {
            if (err) return res.sendStatus(403);

            // Kiểm tra xem role của user có nằm trong danh sách được phép không
            const userRoles = decoded.roles;
            const hasPermission = userRoles.some(role => allowedRoles.includes(role));

            if (!hasPermission) return res.status(403).json({ message: "Bạn không có quyền!" });

            req.user = decoded;
            next();
        });
    };
};

// Sử dụng: Chỉ Admin mới được xem danh sách User
app.get('/api/users', authorize(['Admin']), (req, res) => { ... });

// Chỉ Employer (Nhà tuyển dụng) mới được đăng tin
app.post('/api/jobs', authorize(['Employer', 'Admin']), (req, res) => { ... });