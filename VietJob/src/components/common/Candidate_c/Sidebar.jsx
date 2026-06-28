import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  User,
  Briefcase,
  Mail,
  Bell,
  Settings,
  MessageSquare,
  LogOut
} from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";


const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};



function Sidebar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    alert("Bạn đã đăng xuất thành công!");

    navigate("/login");
  };

  const menuItems = [
    { to: "/candidate/Tong_quan", icon: <LayoutDashboard size={20} />, label: "Tổng quan" },
    { to: "/candidate/HSo_Dinh_Kem", icon: <FileText size={20} />, label: "Hồ sơ đính kèm" },
    { to: "/candidate/Hoso", icon: <User size={20} />, label: "Hồ sơ" },
    { to: "/candidate/Vieclamcuatoi", icon: <Briefcase size={20} />, label: "Việc làm của tôi" },
    { to: "/candidate/Thongbao", icon: <Bell size={20} />, label: "Thông báo", badge: unreadCount },
    { to: "/candidate/Quan_ly_tin_nhan", icon: <MessageSquare size={20} />, label: "Tin nhắn" },
    { to: "/candidate/Caidat", icon: <Settings size={20} />, label: "Cài đặt" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("=== SIDEBAR CỦA ỨNG VIÊN ===");
      const rawUser = localStorage.getItem("user");
      console.log("Dữ liệu thô từ localStorage ('user'):", rawUser);

      try {
        let stored = null;
        try {
          if (rawUser) {
            stored = JSON.parse(rawUser);
            console.log("Đã parse user thành công:", stored);
          }
        } catch (e) {
          console.error("Lỗi parse JSON từ localStorage:", e);
        }

        const userId = stored?.id || parseJwt(stored?.token)?.id;
        console.log("ID Ứng viên giải mã được:", userId);

        if (!userId) {
          console.warn("Không tìm thấy userId hợp lệ, dừng gọi API profile.");
          setLoading(false);
          return;
        }

        console.log("Đang gọi API lấy profile: http://localhost:5000/api/auth/profile/" + userId);
        const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
        console.log("Kết quả profile từ API:", res.data);
        setProfile(res.data);
      } catch (err) {
        console.error("Lỗi mạng hoặc lỗi API khi lấy profile:", err.message);
        if (err.response) {
          console.error("Mã lỗi HTTP từ Server:", err.response.status, err.response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    let userId = null;
    try { userId = JSON.parse(rawUser)?.id; } catch { }
    if (!userId) return;

    const fetchUnread = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${userId}/unread-count`);
        setUnreadCount(res.data?.unread || 0);
      } catch { }
    };

    fetchUnread()
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const username = profile?.Username || "Ứng viên";
  const email = profile?.Email || "";

  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    if (profile?.AvatarUrl) setAvatarUrl(profile.AvatarUrl);
  }, [profile]);

  useEffect(() => {
    const handler = (e) => setAvatarUrl(e.detail);
    window.addEventListener('avatarUpdated', handler);
    return () => window.removeEventListener('avatarUpdated', handler);
  }, []);

  const avatarName = String(username).substring(0, 2).toUpperCase();

  return (
    <aside className="w-64 bg-white border-r border-blue-100 p-6 flex flex-col" style={{ fontFamily: "'Inter', sans-serif", flexShrink: 0, height: "100vh", position: "sticky", top: 0, overflow: "hidden" }}>

      <div className="flex items-center gap-3 mb-10 p-2 border border-dashed border-blue-300 rounded-lg">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0 overflow-hidden"
          style={{ background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
        >
          {avatarUrl
            ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : avatarName
          }
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-800 truncate" title={username}>
            {username}
          </p>
          <p className="text-xs text-gray-400 truncate" title={email}>
            {email || "Ứng viên"}
          </p>
        </div>
      </div>

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

            <span className="relative flex-shrink-0">
              {item.icon}
              {item.badge > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-8px",
                    background: "#EF4444",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 700,
                    lineHeight: 1,
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    boxShadow: "0 0 0 2px #fff",
                    animation: "pulse 2s infinite",
                  }}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

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

export default Sidebar;