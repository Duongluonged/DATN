import { Link, NavLink } from "react-router-dom"; // Thay Link bằng NavLink
import { 
  LayoutDashboard, 
  FileText, 
  User, 
  Briefcase, 
  Mail, 
  Bell, 
  Settings 
} from "lucide-react";

function Sidebar() {
  // Tạo danh sách menu để code gọn hơn và dễ quản lý
  const menuItems = [
    { to: "/candidate/Tong_quan", icon: <LayoutDashboard size={20} />, label: "Tổng quan" },
    { to: "/candidate/HSo_Dinh_Kem", icon: <FileText size={20} />, label: "Hồ sơ đính kèm" },
    { to: "/candidate/Hoso", icon: <User size={20} />, label: "Hồ sơ" },
    { to: "/candidate/Viec_lam_cua_toi", icon: <Briefcase size={20} />, label: "Việc làm của tôi" },
    { to: "/candidate/Loimoicv", icon: <Mail size={20} />, label: "Lời mời công việc" },
    { to: "/candidate/Thongbao", icon: <Bell size={20} />, label: "Thông báo" },
    { to: "/candidate/Caidat", icon: <Settings size={20} />, label: "Cài đặt" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-slate-700" style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside className="w-64 bg-white border-r border-blue-100 p-6 flex flex-col">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-3 mb-10 p-2 border border-dashed border-blue-300 rounded-lg">
          <img src="https://via.placeholder.com/40" alt="Avatar" className="rounded-full w-10 h-10" />
          <div>
            <p className="text-sm font-bold">Dương Lương</p>
            <p className="text-xs text-gray-400">Senior UI Designer</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-bold" // Class khi đang ở trang này
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600" // Class khi bình thường
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;