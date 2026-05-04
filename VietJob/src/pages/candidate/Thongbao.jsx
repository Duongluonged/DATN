import React from "react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import { Briefcase, Mail, ShieldCheck } from "lucide-react";


const c = {
  blue: "#1a56db", blueLt: "#e8f0fe",
  border: "#e5e7eb", bg: "#f5f7fa", white: "#fff",
  text: "#111827", muted: "#6b7280",
};


const Thongbao = () => {
  const notifications = [
    {
      id: 1,
      type: "job",
      icon: <Briefcase size={20} className="text-[#2563EB]" />,
      iconBg: "bg-[#EFF6FF]",
      title: "Thông báo việc làm mới từ Google",
      content: (
        <span>
          Bạn có <span className="text-[#2563EB] font-bold">5 việc làm mới</span> phù hợp với kỹ năng UI/UX Designer.
        </span>
      ),
      time: "Vừa xong",
      isNew: true,
      actionText: "Xem chi tiết",
    },
    {
      id: 2,
      type: "invite",
      icon: <Mail size={20} className="text-[#16A34A]" />,
      iconBg: "bg-[#F0FDF4]",
      title: "Lời mời phỏng vấn từ VinFast",
      content: "Nhà tuyển dụng VinFast đã gửi cho bạn một lời mời phỏng vấn cho vị trí Senior Designer.",
      time: "2 giờ trước",
      isNew: true,
      button: "Phản hồi ngay",
    },
    {
      id: 3,
      type: "system",
      icon: <ShieldCheck size={20} className="text-[#64748B]" />,
      iconBg: "bg-[#F1F5F9]",
      title: "Cập nhật hệ thống",
      content: "Tài khoản của bạn đã được xác thực thành công. Bạn hiện có thể ứng tuyển vào các công ty Top đầu.",
      time: "Hôm qua",
      isNew: false,
    },
  ];

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
      <Navbar />

       <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        
        <main className="flex-1 overflow-y-auto p-10">
          {/* Header Section */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-[28px] font-bold text-[#0F172A]">Thông báo</h1>
              <p className="text-[14px] text-[#64748B] mt-1">Cập nhật những cơ hội và tin tức mới nhất dành cho bạn.</p>
            </div>
            {/* Filter Tabs */}
            <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
              {["Tất cả", "Việc làm mới", "Lời mời", "Hệ thống"].map((tab, i) => (
                <button
                  key={tab}
                  className={`px-5 py-2 text-[13px] font-semibold rounded-lg transition-all ${
                    i === 0 ? "bg-[#3B82F6] text-white shadow-md" : "text-[#64748B] hover:bg-white/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#F1F5F9] shadow-sm p-5 flex items-start gap-5 relative overflow-hidden group hover:shadow-md transition-all"
              >
                {/* Blue indicator for new notifications */}
                {item.isNew && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB]" />}
                
                <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[15px] font-bold text-[#0F172A]">{item.title}</h3>
                    <span className="text-[11px] font-medium text-[#94A3B8]">{item.time}</span>
                  </div>
                  <p className="text-[14px] text-[#64748B] leading-relaxed mb-3">{item.content}</p>
                  
                  <div className="flex items-center gap-4">
                    {item.button ? (
                      <button className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-[13px] font-bold hover:bg-[#1D4ED8] transition-all">
                        {item.button}
                      </button>
                    ) : null}
                    {item.actionText && (
                      <button className="text-[#2563EB] text-[13px] font-bold hover:underline">
                        {item.actionText}
                      </button>
                    )}
                    <button className="text-[#94A3B8] text-[12px] font-medium hover:text-[#64748B]">Để sau</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Professional Tip Card (Banner màu xanh bên dưới) */}
          <div className="mt-10 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] rounded-[24px] p-8 text-white relative overflow-hidden shadow-lg">
             <div className="relative z-10 max-w-lg">
                <span className="bg-white/20 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                  Mẹo nghề nghiệp
                </span>
                <h2 className="text-[22px] font-bold mb-3 leading-tight">
                  Hoàn thiện hồ sơ để nhận thông báo chính xác hơn
                </h2>
                <p className="text-[14px] text-blue-100 mb-6 opacity-90 leading-relaxed">
                  Các ứng viên có hồ sơ đầy đủ 100% nhận được lời mời phỏng vấn cao gấp 3 lần bình thường.
                </p>
                <button className="bg-white text-[#2563EB] px-8 py-3 rounded-xl font-bold text-[14px] hover:bg-blue-50 transition-all shadow-md">
                  Cập nhật ngay
                </button>
             </div>
             {/* Decorative Circles/Icons (Giả lập hình vẽ trừu tượng trong thiết kế) */}
             <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Briefcase size={250} strokeWidth={1} />
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Thongbao;