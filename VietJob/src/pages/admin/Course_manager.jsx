import React, { useState } from 'react'; // 1. Đã thêm useState
import { 
  BookOpen, Users, DollarSign, Plus, FileText, 
  Search, Filter, MoreHorizontal, ChevronRight,
  Clock, Award
} from "lucide-react";
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar';

const courses = [
  { id: 1, name: "ReactJS & TypeScript Mastery", provider: "FPT Software Academy", category: "Frontend", price: "4,500,000đ", status: "Đang mở" },
  { id: 2, name: "Data Engineering with Python", provider: "FPT Cloud", category: "Data", price: "6,200,000đ", status: "Chờ duyệt" },
  { id: 3, name: "Node.js Backend Advanced", provider: "CodeGym Academy", category: "Backend", price: "5,500,000đ", status: "Đang mở" },
];

export default function CourseManage() {
  const [activeNav, setActiveNav] = useState("Course Management");


  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* 1. Header Section */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Quản lý khóa học</div>
              <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>Chào Admin, đây là báo cáo và danh sách khóa học của hệ thống VietJob.</div>
            </div>
          </div>

          {/* 2. Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Tổng số khóa học", value: "150", icon: <BookOpen className="text-blue-600" />, trend: "+12%" },
              { label: "Học viên đăng ký", value: "5,200", icon: <Users className="text-orange-600" />, trend: "+5.4%" },
              { label: "Doanh thu hệ thống", value: "1.2 tt vnđ", icon: <DollarSign className="text-green-600" />, trend: "+20%" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <span className="text-xs text-green-500 font-medium">{stat.trend} so với tháng trước</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
              </div>
            ))}
          </div>

          {/* 3. Table Section */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm khóa học, nhà cung cấp..." 
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"><Filter size={16}/> Lọc</button>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white">
                  <option>Tất cả trạng thái</option>
                  <option>Đang mở</option>
                  <option>Chờ duyệt</option>
                </select>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  {["Tên khóa học", "Nhà cung cấp", "Chuyên mục", "Giá", "Trạng thái", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-sm text-blue-600">{course.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{course.provider}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{course.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">{course.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        course.status === "Đang mở" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-blue-600"><MoreHorizontal size={20}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-blue-600" /> Hoạt động gần đây</h4>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors border-l-4 border-blue-500 bg-blue-50/30">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 font-bold">JD</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Admin đã duyệt khóa học "ReactJS Mastery"</p>
                      <p className="text-xs text-gray-400">10 phút trước • Quản lý: Dương Lương</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="font-bold mb-4 flex items-center gap-2"><Award size={18} /> Đối tác đào tạo</h4>
                    <div className="space-y-3">
                        {["FPT Academy", "VTI Cloud", "CodeGym"].map(p => (
                            <div key={p} className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer">
                                <span className="text-sm font-medium">{p}</span>
                                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">Đối tác Bạc</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">Xem tất cả đối tác</button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}