import React from 'react';
import { 
  Users, DollarSign, Briefcase, BookOpen, 
  TrendingUp, PieChart, Clock, ChevronRight,
  MoreHorizontal
} from "lucide-react";
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar';

const Statistical = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
      <Sidebar  />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Topbar />

            <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3, textAlign: "left", marginLeft: 200}}>Thống kê</div>
                        <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>
                                Thống kê tổng quan về người dùng, công việc, khóa học và doanh thu của hệ thống VietJob.
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[
                        { label: "Tổng người dùng", value: "42,893", icon: <Users size={20} className="text-blue-600" />, trend: "+12.5%", color: "bg-blue-50" },
                        { label: "Tổng doanh thu", value: "1.250M đ", icon: <DollarSign size={20} className="text-green-600" />, trend: "+8.2%", color: "bg-green-50" },
                        { label: "Công việc mới", value: "342", icon: <Briefcase size={20} className="text-orange-600" />, trend: "+5.1%", color: "bg-orange-50" },
                        { label: "Khóa học mới", value: "128", icon: <BookOpen size={20} className="text-purple-600" />, trend: "+2.4%", color: "bg-purple-50" },
                        ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
                            <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                            </div>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                        </div>
                        ))}
                    </div>

                    {/* 2. Middle Section - Tăng trưởng & Phân loại */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Biểu đồ tăng trưởng (Placeholder) */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <TrendingUp size={18} className="text-blue-600" /> Tăng trưởng người dùng & Doanh thu
                                </h4>
                                <select className="text-[11px] font-bold border border-gray-100 rounded-lg px-2 py-1 outline-none">
                                <option>Tháng này</option>
                                <option>Tháng trước</option>
                                </select>
                            </div>
                        {/* Hình ảnh minh họa cho nội dung ở giữa (giống trong ảnh) */}
                            <div className="bg-blue-50/50 rounded-xl p-8 flex items-center justify-center border border-blue-50 border-dashed min-h-[200px]">
                                <div className="text-center">
                                    <p className="text-blue-600 font-bold text-sm">Giao diện mô phỏng tăng trưởng hệ thống</p>
                                    <p className="text-gray-400 text-xs mt-1">Dữ liệu được cập nhật theo thời gian thực</p>
                                </div>
                            </div>
                        </div>

                        {/* Biểu đồ tròn - Phân loại ngành nghề */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                        <h4 className="font-bold text-gray-900 w-full mb-6">Phân loại ngành nghề</h4>
                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            {/* Vòng tròn Progress giả lập */}
                            <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="110" className="text-blue-600" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black">75%</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Công nghệ</span>
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            {["Công nghệ thông tin", "Marketing", "Y tế"].map((job, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-gray-400 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-gray-200'}`}></span> {job}
                                </span>
                                <span>{idx === 0 ? '75%' : idx === 1 ? '15%' : '10%'}</span>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>

                    {/* 3. Bottom Section - Khóa học & Hoạt động */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Khóa học mới nhất */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2"><BookOpen size={18} className="text-blue-600" /> Khóa học mới cập nhật</h4>
                            <button className="text-[11px] font-bold text-blue-600 hover:underline">Xem tất cả</button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {[
                            { title: "UI/UX Advanced: Master the Design System", provider: "FPT Software", price: "450.000 đ", status: "Hot" },
                            { title: "Business Analysis Fundamentals", provider: "VTI Cloud", price: "1.200.000 đ", status: "New" },
                            { title: "Data Science for Beginners", provider: "CodeGym", price: "600.000 đ", status: "Trending" },
                            ].map((course, i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">
                                {course.provider.charAt(0)}
                                </div>
                                <div className="flex-1">
                                <h5 className="text-sm font-bold text-gray-800">{course.title}</h5>
                                <p className="text-[11px] text-gray-400">{course.provider}</p>
                                </div>
                                <div className="text-right">
                                <p className="text-sm font-black text-blue-600">{course.price}</p>
                                <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{course.status}</span>
                                </div>
                            </div>
                            ))}
                        </div>
                        </div>

                        {/* Hoạt động gần đây */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-6"><Clock size={18} className="text-blue-600" /> Hoạt động gần đây</h4>
                        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                            {[
                            { user: "Dương Lương", action: "đã duyệt khóa học mới", time: "10 phút trước", color: "bg-blue-600" },
                            { user: "Admin Quản trị", action: "đã cập nhật hệ thống", time: "1 giờ trước", color: "bg-green-600" },
                            { user: "HR Phương Thảo", action: "đã thêm tin tuyển dụng", time: "3 giờ trước", color: "bg-orange-600" },
                            ].map((act, i) => (
                            <div key={i} className="relative pl-10">
                                <div className={`absolute left-2 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${act.color}`}></div>
                                <p className="text-sm">
                                <span className="font-bold text-gray-900">{act.user}</span> {act.action}
                                </p>
                                <p className="text-[11px] text-gray-400 font-medium">{act.time}</p>
                            </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-2 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                            Xem lịch sử hệ thống
                        </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    </div>
  );
};

export default Statistical;