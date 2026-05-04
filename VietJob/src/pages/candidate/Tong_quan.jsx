import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, User, Briefcase, 
  Mail, Bell, Settings, Plus, MoreHorizontal 
} from 'lucide-react';
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Candidate_c/Sidebar";


const Tongquan = () => {
  return (
    <div >
      <Navbar />
      <div className="flex min-h-screen bg-gray-50 font-sans text-slate-700"
        style={{ fontFamily: "'Inter', sans-serif" }}>
          <Sidebar />

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-8">

          <div className="grid grid-cols-3 gap-6">
            {/* Welcome & Stats */}
            <div className="col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-3xl relative overflow-hidden shadow-sm border border-gray-100">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Chào buổi sáng,  👋</h2>
                  <p className="text-gray-500 mb-6">Chào mừng bạn trở lại. Hôm nay có 12 việc làm UI Designer mới phù hợp với kỹ năng của bạn.</p>
                  
                  <div className="flex gap-4">
                    <StatCard label="Đã ứng tuyển" value="45" trend="+2 tuần này" color="text-green-500" />
                    <StatCard label="Lời mời phỏng vấn" value="12" trend="Cần phản hồi" color="text-teal-500" />
                    <StatCard label="Lượt xem hồ sơ" value="128" trend="↑ 14%" color="text-green-500" />
                  </div>
                </div>
                <div className="absolute top-4 right-8 opacity-10">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500">
                    <path d="M12 2.25l.444.007c4.643.141 8.354 3.852 8.496 8.496l.007.444-1.25.134v.214a1.75 1.75 0 01-1.75 1.75h-11.5a1.75 1.75 0 01-1.75-1.75v-.214L3.75 11.2l.007-.444c.141-4.644 3.852-8.355 8.496-8.496l.444-.007z" />
                  </svg>
                </div>
              </div>

              {/* Application Activity */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Hoạt động ứng tuyển mới nhất</h3>
                  <button className="text-blue-600 text-sm font-medium">Tất cả</button>
                </div>
                <div className="space-y-3">
                  <JobRow company="Google" role="Senior Product Designer" location="Mountain View, CA (Remote)" status="ĐÃ PHỎNG VẤN" statusColor="bg-green-100 text-green-600" time="2 ngày trước" />
                  <JobRow company="Spotify" role="UI/UX Interaction Lead" location="Stockholm, Sweden" status="ĐANG XEM XÉT" statusColor="bg-blue-100 text-blue-600" time="5 ngày trước" />
                  <JobRow company="Figma" role="Visual Designer" location="San Francisco, CA" status="ĐÃ NỘP HỒ SƠ" statusColor="bg-indigo-100 text-indigo-600" time="1 tuần trước" />
                </div>
              </div>
            </div>

            {/* Right Sidebar Inside Main */}
            <div className="space-y-6">
              {/* Profile Strength */}
              <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200">
                <div className="flex justify-between mb-4">
                  <span className="text-sm opacity-90">Độ mạnh hồ sơ</span>
                  <span className="bg-blue-400 px-2 py-0.5 rounded text-xs">Tốt</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1 uppercase font-bold">
                    <span>Hoàn thành 85%</span>
                  </div>
                  <div className="w-full bg-blue-400 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <p className="text-xs opacity-80 mb-6 leading-relaxed">Thêm chứng chỉ để đạt 100% và thu hút thêm 30% nhà tuyển dụng.</p>
                <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-sm shadow-md">Cập nhật hồ sơ</button>
              </div>

              {/* Recent Files */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm">Hồ sơ đính kèm gần đây</h3>
                  <Plus size={18} className="text-blue-600 cursor-pointer" />
                </div>
                <div className="space-y-4">
                  <FileItem name="HoangNguyen_UIUX_CV_2024.pdf" date="12/10/2023" size="2.4 MB" />
                  <FileItem name="Portfolio_Cases_Web_App.docx" date="05/10/2023" size="1.8 MB" />
                  <FileItem name="Cover_Letter_TalentArc.pdf" date="28/09/2023" size="0.9 MB" />
                </div>
                <button className="w-full text-blue-600 text-xs font-bold mt-6 flex items-center justify-center gap-1">
                  Xem tất cả tài liệu →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const MenuItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>
    {icon}
    <span className={`text-sm font-medium ${active ? 'font-bold' : ''}`}>{label}</span>
  </div>
);

const StatCard = ({ label, value, trend, color }) => (
  <div className="bg-gray-50 p-4 rounded-2xl flex-1 border border-gray-100">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">{value}</span>
      <span className={`text-[10px] font-bold ${color}`}>{trend}</span>
    </div>
  </div>
);

const JobRow = ({ company, role, location, status, statusColor, time }) => (
  <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 hover:shadow-md transition cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">{company[0]}</div>
      <div>
        <h4 className="font-bold text-sm">{role}</h4>
        <p className="text-xs text-gray-400">{company} • {location}</p>
      </div>
    </div>
    <div className="text-right">
      <span className={`text-[10px] font-bold px-2 py-1 rounded ${statusColor}`}>{status}</span>
      <p className="text-[10px] text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

const FileItem = ({ name, date, size }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600"><FileText size={16}/></div>
    <div className="overflow-hidden">
      <p className="text-[11px] font-bold truncate">{name}</p>
      <p className="text-[9px] text-gray-400">Cập nhật: {date} • {size}</p>
    </div>
  </div>
);

export default Tongquan;