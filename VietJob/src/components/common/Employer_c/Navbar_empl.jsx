import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, User, Briefcase, Mail, Bell, Settings } from "lucide-react";

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

                    <Link to="/Login_Employer" className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                        Nhà tuyển dụng
                    </Link>

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
                                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md transition-all active:scale-95"
                            >
                                Đăng Nhập
                            </Link>

                        </div>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;