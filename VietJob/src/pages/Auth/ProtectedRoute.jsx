import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // Lấy thông tin user từ localStorage (hoặc Redux/Context)
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Nếu chưa đăng nhập -> Đẩy về trang Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Nếu đã đăng nhập nhưng không có quyền phù hợp -> Đẩy về trang báo lỗi hoặc trang chủ
    const hasAccess = user.roles.some(role => allowedRoles.includes(role));
    
    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Nếu thỏa mãn tất cả -> Cho phép truy cập vào các Route con (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;