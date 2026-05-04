import React, { useState } from 'react';
import { 
  AlertTriangle, Search, Filter, FileText, 
  ChevronLeft, ChevronRight, Gavel, Mail, 
  CheckCircle, ShieldAlert, Plus, HelpCircle, LogOut
} from "lucide-react";
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar';

const Report_Management = () => {
  const [activeTab, setActiveTab] = useState("TẤT CẢ");

  const reports = [
    { id: 1, reporter: "Nguyễn Văn Lâm", email: "lam.nv@gmail.com", target: "Công ty CP TechVina", type: "TIN TUYỂN DỤNG", content: "Thông tin sai sự thật", detail: "Công ty đăng tuyển mức lương 20-30tr nhưng khi phỏng vấn...", time: "14:20 Hôm nay", status: "Chưa xử lý" },
    { id: 2, reporter: "Trần Minh Hiếu", email: "hieutm@outlook.com", target: "Hr Nguyễn Thị A", type: "TÀI KHOẢN HR", content: "Lừa đảo / Đa cấp", detail: "Yêu cầu ứng viên đóng phí cọc 500k trước khi nhận việc làm...", time: "09:15 Hôm nay", status: "Chưa xử lý" },
    { id: 3, reporter: "Phạm Hoàng Nam", email: "nam.ph@fpt.vn", target: "Job: Senior NodeJS Dev", type: "TIN TUYỂN DỤNG", content: "Nội dung phản cảm", detail: "Mô tả công việc chứa các ngôn từ xúc phạm giới tính và phân...", time: "21:45 Hôm qua", status: "Đang xem xét", urgent: true },
    { id: 4, reporter: "Lê Minh", email: "minhle@gmail.com", target: "Global Outsourcing Co.", type: "CÔNG TY", content: "Spam tin tuyển dụng", detail: "Một vị trí đăng lặp lại hơn 50 lần trong ngày gây nhiễu kết quả...", time: "18:30 Hôm qua", status: "Chưa xử lý" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
      <Sidebar />
      {/* Header Section */}

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
            <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Quản lý khiếu nại & Vi phạm</div>
                        <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>
                            Xử lý các báo cáo từ cộng đồng về tin tuyển dụng không trung thực, lừa đảo hoặc vi phạm quy tắc nền tảng.
                        </div>
                    </div>
                    <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all">
                        <Filter size={16} /> Bộ lọc nâng cao
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                        <FileText size={16} /> Xuất báo cáo
                    </button>
                    </div>
                </div>

                {/* Status Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[
                    { label: "Chưa xử lý", value: "24", sub: "+12% so với hôm qua", color: "border-red-500", textColor: "text-red-500" },
                    { label: "Đang xem xét", value: "15", sub: "Đang chờ quản trị viên cấp cao", color: "border-blue-500", textColor: "text-blue-500" },
                    { label: "Đã giải quyết", value: "142", sub: "Tỷ lệ thành công 98.2%", color: "border-green-500", textColor: "text-green-500" },
                    { label: "Tài khoản bị khóa", value: "08", sub: "Vị phạm nghiêm trọng tháng này", color: "border-gray-900", textColor: "text-gray-900" },
                    ].map((item, i) => (
                    <div key={i} className={`bg-white p-5 rounded-xl border-b-4 ${item.color} shadow-sm`}>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                        <h3 className="text-3xl font-black mt-1 tracking-tight">{item.value}</h3>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">{item.sub}</p>
                    </div>
                    ))}
                </div>

                {/* Main Content Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Danh sách khiếu nại mới nhất</h3>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {["TẤT CẢ", "KHẨN CẤP"].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                        >
                            {tab}
                        </button>
                        ))}
                    </div>
                    </div>

                    <table className="w-full text-left">
                    <thead>
                        <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                        <th className="px-6 py-4">Người báo cáo</th>
                        <th className="px-6 py-4">Đối tượng bị khiếu nại</th>
                        <th className="px-6 py-4">Lý do & Nội dung</th>
                        <th className="px-6 py-4">Thời gian</th>
                        <th className="px-6 py-4 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[13px]">
                        {reports.map((r) => (
                        <tr key={r.id} className={`hover:bg-gray-50/50 transition-all ${r.urgent ? "bg-red-50/30 border-l-4 border-red-500" : ""}`}>
                            <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[10px]">{r.reporter.split(' ').pop().charAt(0)}</div>
                                <div>
                                <p className="font-bold text-gray-900">{r.reporter}</p>
                                <p className="text-[11px] text-gray-400">{r.email}</p>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-5">
                            <p className="font-bold text-gray-700">{r.target}</p>
                            <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase mt-1 inline-block border border-blue-100">
                                <span className="opacity-50 mr-1">#</span>{r.type}
                            </span>
                            </td>
                            <td className="px-6 py-5 max-w-xs">
                            <p className={`font-bold ${r.urgent ? "text-red-600" : "text-orange-600"}`}>
                                {r.urgent && "⚠ "}{r.content}
                            </p>
                            <p className="text-gray-400 text-[11px] line-clamp-1 mt-1">{r.detail}</p>
                            </td>
                            <td className="px-6 py-5 text-gray-500 font-medium whitespace-nowrap">
                            {r.time.split(' ')[0]} <br/> <span className="text-[10px] text-gray-300">{r.time.split(' ').slice(1).join(' ')}</span>
                            </td>
                            <td className="px-6 py-5">
                            <div className="flex justify-center gap-2">
                                <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md font-bold text-[10px] hover:bg-green-100 transition-all">GIẢI QUYẾT</button>
                                <button className={`px-3 py-1.5 rounded-md font-bold text-[10px] transition-all ${r.urgent ? "bg-red-600 text-white shadow-md shadow-red-200" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                                {r.urgent ? "KHẨN CẤP" : "LÊU THANG"}
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <p className="text-[11px] text-gray-400 font-medium">Đang hiển thị 1-10 trong số 24 khiếu nại</p>
                    <div className="flex gap-1 items-center">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600"><ChevronLeft size={16}/></button>
                        <button className="w-8 h-8 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md">1</button>
                        <button className="w-8 h-8 text-gray-400 hover:bg-gray-100 rounded-lg text-xs font-bold transition-all">2</button>
                        <button className="w-8 h-8 text-gray-400 hover:bg-gray-100 rounded-lg text-xs font-bold transition-all">3</button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600"><ChevronRight size={16}/></button>
                    </div>
                    </div>
                </div>

                {/* Bottom Section: Process & Support */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                    <div className="lg:col-span-2">
                    <h4 className="font-black text-gray-900 flex items-center gap-2 mb-6 uppercase tracking-wider text-sm border-l-4 border-blue-600 pl-3">
                        Quy trình xử lý vi phạm chuẩn
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                        { step: "1", title: "XÁC MINH", desc: "Kiểm tra tính xác thực của người báo cáo và thu thập bằng chứng từ hệ thống." },
                        { step: "2", title: "LIÊN HỆ", desc: "Gửi thông báo yêu cầu giải trình cho bên bị khiếu nại trong vòng 24h." },
                        { step: "3", title: "QUYẾT ĐỊNH", desc: "Gỡ bỏ nội dung, khóa tài khoản tạm thời hoặc vĩnh viễn tùy mức độ." },
                        ].map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                            <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black mb-4">{s.step}</span>
                            <h5 className="font-black text-xs text-gray-800 mb-2">{s.title}</h5>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{s.desc}</p>
                        </div>
                        ))}
                    </div>
                    </div>

                    {/* Support Card */}
                    <div className="bg-blue-700 p-8 rounded-3xl text-white relative shadow-2xl shadow-blue-200 flex flex-col justify-between overflow-hidden group">
                    <div className="relative z-10">
                        <ShieldAlert size={40} className="mb-6 opacity-80 group-hover:scale-110 transition-transform" />
                        <h4 className="text-xl font-black mb-3 leading-tight">Yêu cầu hỗ trợ pháp lý?</h4>
                        <p className="text-xs text-blue-100 font-medium leading-relaxed opacity-80">
                        Đối với các vụ việc lừa đảo có tổ chức hoặc chiếm đoạt tài sản quy mô lớn, hãy chuyển hồ sơ cho bộ phận Pháp chế.
                        </p>
                    </div>
                    <button className="relative z-10 w-full mt-10 py-3 bg-white text-blue-700 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-50 transition-all active:scale-95">
                        Kết nối pháp chế
                    </button>
                    
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                    </div>
                </div>

                {/* Floating Action Button */}
                <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-50">
                    <Plus size={24} />
                </button>

            </main>
        </div>
    </div>
  );
};

export default Report_Management;