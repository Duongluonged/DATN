import { Link, NavLink, useNavigate } from "react-router-dom"; // Thêm useNavigate
import {
    LayoutDashboard,
    FileText,
    User,
    Briefcase,
    Mail,
    Bell,
    Settings,
    LogOut,
    Building2 // Dùng icon Building2 chuyên nghiệp cho hồ sơ công ty
} from "lucide-react";

function Sidebar_Empl() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.username || "Nhà tuyển dụng";
    const avatarName = username.substring(0, 2).toUpperCase();

    const handleLogout = () => {
        // 1. Xóa thông tin đăng nhập của nhà tuyển dụng
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // 2. Thông báo cho người dùng
        alert("Bạn đã đăng xuất thành công!");

        // 3. Điều hướng về trang đăng nhập nhà tuyển dụng
        navigate("/login_employer");
    };

    // Tạo danh sách menu để code gọn hơn và dễ quản lý
    const menuItems = [
        { to: "/employer/Quan_ly_tin_tuyen_dung", icon: <LayoutDashboard size={20} />, label: "Quản lý tin tuyển dụng" },
        { to: "/employer/Quan_ly_Hoso_Cty", icon: <Building2 size={20} />, label: "Quản lý hồ sơ công ty" },
        { to: "/employer/Quan_ly_ung_vien", icon: <FileText size={20} />, label: "Quản lý ứng viên" },
        { to: "/employer/Quan_ly_khoa_hoc", icon: <User size={20} />, label: "Quản lý khoá học" },
        { to: "/employer/Quan_ly_tin_nhan", icon: <Briefcase size={20} />, label: "Tin nhắn" },
        { to: "/employer/Vi_tien", icon: <Briefcase size={20} />, label: "Ví tiền" },
        { to: "/employer/Thong_ke_ntd", icon: <Briefcase size={20} />, label: "Thống kê" },
    ];

    return (
        <aside className="w-64 bg-white border-r border-blue-100 p-6 flex flex-col" style={{ fontFamily: "'Inter', sans-serif", flexShrink: 0 }}>

            {/* Avatar Section */}
            <div className="flex items-center gap-3 mb-10 p-2 border border-dashed border-blue-300 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {avatarName}
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-800 truncate max-w-[130px]">{username}</p>
                    <p className="text-xs text-gray-400">Nhà tuyển dụng</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors rounded-md ${isActive
                                ? "bg-blue-50 text-blue-600 font-bold"
                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                            }`
                        }
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Logout Action */}
            <div className="pt-6 border-t border-blue-50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors rounded-md"
                >
                    <LogOut size={20} />
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
}

export default Sidebar_Empl;