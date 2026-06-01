import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  Star,
  AlertTriangle,
  BarChart3,
  HelpCircle,
  LogOut,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Xóa toàn bộ thông tin user và token trong LocalStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Nếu bạn muốn xóa sạch mọi thứ liên quan đến phiên làm việc:
    // localStorage.clear();

    // 2. Thông báo cho người dùng (Tùy chọn)
    alert("Bạn đã đăng xuất thành công!");

    // 3. Điều hướng về trang Login
    navigate("/home_page_candidate"); // Hoặc navigate("/login") nếu bạn muốn về trang login
  };

  const menuItems = [
    { to: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Tổng quan" },
    { to: "/admin/User_Manager", icon: <Users size={20} />, label: "Quản lý người dùng" },
    { to: "/admin/JobPosting_Manager", icon: <Briefcase size={20} />, label: "Quản lý tin tuyển dụng" },
    { to: "/admin/Course_Manager", icon: <BookOpen size={20} />, label: "Quản lý khoá học" },
    { to: "/admin/Report_Management", icon: <AlertTriangle size={20} />, label: "Quản lí khiểu nại" },
    { to: "/admin/Revenue_Manager", icon: <DollarSign size={20} />, label: "Quản lý doanh thu" },
    { to: "/admin/Statistical", icon: <BarChart3 size={20} />, label: "Thống kê" },
  ];

  return (
    <aside className="sticky top-0 w-64 min-w-[256px] h-screen bg-white border-r border-gray-200 flex flex-col font-sans">

      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 border-b border-gray-100">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          IT
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm leading-tight">Quản trị viên</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider">VietJob System</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item, index) => (
          item.type === "divider" ? (
            <div key={`divider-${index}`} className="h-[1px] bg-gray-100 my-4 mx-2" />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-[13px] transition-all rounded-lg border-l-4 ${isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold border-indigo-600"
                  : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-indigo-600"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          )
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-100 space-y-1">
        <NavLink
          to="/admin/support"
          className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <HelpCircle size={18} />
          Hỗ trợ
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;