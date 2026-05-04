import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {LayoutDashboard,FileText,User,Briefcase,Mail,Bell,Settings} from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để theo dõi sự thay đổi đường dẫn

  // Hàm kiểm tra trạng thái đăng nhập
  const checkAuth = () => {
  const storedUser = localStorage.getItem("user"); // Lấy object 'user'
  
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    // Đảm bảo userData có trường username (hoặc name tùy backend trả về)
    setUser(userData); 
  } else {
    setUser(null);
  }
};

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, [location]); // Mỗi khi chuyển trang (login xong nhảy về home), Navbar sẽ tự kiểm tra lại

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);
  setShowDropdown(false); 
  navigate("/"); 
  };
  
  return (
    <header className="w-full bg-white border-b-4 border-blue-500 shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 py-4 flex justify-between items-center">
        
        {/* NHÓM BÊN TRÁI: Logo và Menu */}
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-bold text-black tracking-wide hover:text-blue-600 transition-colors">
            VietJobs
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            {/* Top Công Ty IT */}
            <div className="group relative cursor-pointer py-2">
              <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <span>Top Công Ty IT</span>
                <svg className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                <Link to="/companies/product" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Công ty Product</Link>
                <Link to="/companies/outsource" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Công ty Outsource</Link>
              </div>
            </div>

            {/* Khoá học */}
            <div className="group relative cursor-pointer py-2">
              <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <span>Khoá học</span>
                <svg className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                <Link to="/courses/web" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Lập trình Web</Link>
                <Link to="/courses/mobile" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Lập trình Mobile</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* NHÓM BÊN PHẢI: Logic Đăng nhập / Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="dropdown-container relative flex items-center gap-3 cursor-pointer py-1">
              {/* Giới hạn tên quá dài bằng truncate */}
              <span className="text-sm font-semibold text-gray-700 hidden sm:inline-block max-w-[100px] truncate">
                {user.username}
              </span>
              <div 
                className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm border-2 border-blue-100 transition-transform hover:scale-105"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-md shadow-xl border border-gray-100 flex flex-col py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    
                    <p className="text-sm font-bold text-blue-600 truncate">{user.username}</p>
                    <p className="text-sm font-bold text-blue-600 truncate">{user.email}</p>
                  </div>
                  <Link to="/candidate/Tong_quan" className="flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <LayoutDashboard size={16} />
                    Tổng quan
                  </Link>

                  <Link to="/candidate/HSo_Dinh_Kem" className="flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <FileText size={16} />
                    Hồ sơ đính kèm
                  </Link>

                  <Link to="/candidate/Hoso" className="flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <User size={16} />
                    Hồ sơ
                  </Link>

                  <Link to="/candidate/Vieclamcuatoi" className="flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Briefcase size={16} />
                    Việc làm của tôi
                  </Link>

                  <Link to="/candidate/Loimoicv" className="flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Mail size={16} />
                    Lời mời công việc
                  </Link>

                  <Link to="/candidate/Thongbao" className="flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Bell size={16} />
                    Thông báo
                  </Link>

                  <Link to="/candidate/Caidat" className="flex items-center gap-2 px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <Settings size={16} />
                    Cài đặt
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 font-bold transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="px-5 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition-all active:scale-95"
              >
                Đăng Nhập
              </Link>
              <Link 
                to="/register" 
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;