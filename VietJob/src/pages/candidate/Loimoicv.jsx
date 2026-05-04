import React from "react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import { MailOpen, X } from "lucide-react";


const c = {
  blue: "#1a56db", blueLt: "#e8f0fe",
  border: "#e5e7eb", bg: "#f5f7fa", white: "#fff",
  text: "#111827", muted: "#6b7280",
};

const Loimoicongviec = () => {
  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
      < Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-10">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-[24px] font-bold text-[#0F172A]">Lời mời công việc</h1>
            <p className="text-[14px] text-[#64748B] mt-1">
              Ở đây bạn có thể quản lý những lời mời làm việc từ các nhà tuyển dụng. 
              <span className="text-[#2563EB] cursor-pointer ml-1 font-medium hover:underline">
                Tìm hiểu thêm về lời mời
              </span>
            </p>
          </div>

          {/* Tab Filter - Giống hệt trong ảnh image_4eecd3.png */}
          <div className="flex gap-1 mb-8 bg-[#F1F5F9] p-1 rounded-xl w-fit border border-[#E2E8F0]">
            {["Đang chờ (0)", "Đã chấp nhận (0)", "Đã hết hạn (0)"].map((tab, index) => (
              <button
                key={tab}
                className={`px-6 py-2.5 text-[13px] font-semibold rounded-lg transition-all ${
                  index === 2 
                    ? "bg-white shadow-sm text-[#2563EB] border border-[#E2E8F0]" 
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Empty State Card - Center Content */}
          <div className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-20 flex flex-col items-center text-center justify-center min-h-[500px]">
            {/* Icon Group */}
            <div className="w-36 h-36 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-8 relative">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#DBEAFE]">
                <MailOpen size={52} className="text-[#3B82F6]" strokeWidth={1.5} />
              </div>
              {/* Nút X đỏ nhỏ góc trên icon */}
              <div className="absolute top-8 right-6 w-7 h-7 bg-[#FEE2E2] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                 <X size={14} className="text-[#EF4444]" strokeWidth={3} />
              </div>
            </div>
            
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-3">Chưa có lời mời đã hết hạn</h2>
            <p className="text-[14px] text-[#64748B] max-w-sm mb-10 leading-relaxed">
              Mục này hiển thị các lời mời đã quá hạn phản hồi. Hiện tại bạn có 
              <span className="text-[#2563EB] font-bold"> 0 lời mời </span> đã quá hạn.
            </p>

            <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-10 py-4 rounded-full font-bold text-[15px] transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]">
              Cập nhật hồ sơ của bạn ngay
            </button>
            
            <p className="text-[12px] text-[#94A3B8] mt-8 font-medium tracking-wide">
              Giúp nhà tuyển dụng tìm thấy bạn dễ hơn
            </p>
          </div>

          {/* Footer Info Cards */}
          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="bg-[#F0F7FF] p-5 rounded-2xl flex items-center gap-4 border border-[#D1E9FF]">
               <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center text-white shadow-md">
                 <span className="text-xl">✨</span>
               </div>
               <div>
                 <p className="text-[14px] font-bold text-[#1E3A8A]">Kết nối ngay</p>
                 <p className="text-[12px] text-[#1D4ED8] opacity-80">Gặp gỡ 500+ nhà tuyển dụng hàng đầu mỗi ngày.</p>
               </div>
            </div>
            <div className="bg-[#F0FDF4] p-5 rounded-2xl flex items-center gap-4 border border-[#DCFCE7]">
               <div className="w-12 h-12 bg-[#16A34A] rounded-xl flex items-center justify-center text-white shadow-md">
                 <span className="text-xl">🚀</span>
               </div>
               <div>
                 <p className="text-[14px] font-bold text-[#064E3B]">Cơ hội thăng tiến</p>
                 <p className="text-[12px] text-[#15803D] opacity-80">Tăng 40% tỉ lệ trúng tuyển khi cập nhật CV.</p>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Loimoicongviec;