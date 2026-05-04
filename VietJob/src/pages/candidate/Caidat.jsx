import React, { useState } from "react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import { User, Bell, Lock, Eye, ArrowRight, ShieldCheck, Trash2 } from "lucide-react";


const c = {
  blue: "#1a56db", blueLt: "#e8f0fe",
  border: "#e5e7eb", bg: "#f5f7fa", white: "#fff",
  text: "#111827", muted: "#6b7280",
};

const Caidat = () => {
  const [emailNoti, setEmailNoti] = useState(true);
  const [pushNoti, setPushNoti] = useState(false);
  const [privacy, setPrivacy] = useState("public");

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
      <Navbar />

       <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#0F172A]">Cài đặt</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Quản lý thông tin cá nhân và cấu hình trải nghiệm của bạn trên VietJob.</p>
          </div>

          <div className="space-y-6 max-w-8xl">
            {/* 1. Thông tin tài khoản */}
            <section className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-[#2563EB]">
                  <User size={20} />
                </div>
                <h2 className="text-[18px] font-bold text-[#0F172A]">Thông tin tài khoản</h2>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#64748B] ml-1">Họ và tên</label>
                  <input type="text" defaultValue="Dương Lương" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#2563EB] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-[#64748B] ml-1">Số điện thoại</label>
                  <input type="text" defaultValue="+84 987 654 321" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#2563EB] transition-all" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[13px] font-semibold text-[#64748B] ml-1">Địa chỉ Email</label>
                  <input type="email" defaultValue="duong.luong@example.com" className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#2563EB] transition-all" />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-[#2563EB] text-white px-8 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#1D4ED8] transition-all shadow-md">
                  Lưu thay đổi
                </button>
              </div>
            </section>

            {/* 2. Cài đặt thông báo */}
            <section className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#16A34A]">
                  <Bell size={20} />
                </div>
                <h2 className="text-[18px] font-bold text-[#0F172A]">Cài đặt thông báo</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-[#334155]">Thông báo qua Email</p>
                    <p className="text-[13px] text-[#64748B]">Nhận cập nhật về các công việc mới phù hợp với bạn.</p>
                  </div>
                  <button onClick={() => setEmailNoti(!emailNoti)} className={`w-12 h-6 rounded-full transition-all relative ${emailNoti ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${emailNoti ? "right-1" : "left-1"}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-[#334155]">Thông báo đẩy (Push)</p>
                    <p className="text-[13px] text-[#64748B]">Nhận thông báo trực tiếp trên trình duyệt khi có tin nhắn mới.</p>
                  </div>
                  <button onClick={() => setPushNoti(!pushNoti)} className={`w-12 h-6 rounded-full transition-all relative ${pushNoti ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pushNoti ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
              {/* 3. Bảo mật */}
              <section className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#F5F3FF] rounded-xl flex items-center justify-center text-[#7C3AED]">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-[18px] font-bold text-[#0F172A]">Bảo mật</h2>
                </div>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-xl transition-all border border-[#E2E8F0] group">
                    <span className="text-[14px] font-bold text-[#334155]">Đổi mật khẩu</span>
                    <ArrowRight size={18} className="text-[#94A3B8] group-hover:translate-x-1 transition-all" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-xl transition-all border border-[#E2E8F0]">
                    <div className="text-left">
                      <p className="text-[14px] font-bold text-[#334155]">Xác thực 2 lớp (2FA)</p>
                      <p className="text-[11px] text-[#EF4444] font-bold">Chưa kích hoạt</p>
                    </div>
                    <ShieldCheck size={20} className="text-[#94A3B8]" />
                  </button>
                </div>
              </section>

              {/* 4. Quyền riêng tư */}
              <section className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#16A34A]">
                    <Eye size={20} />
                  </div>
                  <h2 className="text-[18px] font-bold text-[#0F172A]">Quyền riêng tư</h2>
                </div>
                <p className="text-[12px] text-[#64748B] mb-4">Điều chỉnh cách nhà tuyển dụng nhìn thấy hồ sơ của bạn.</p>
                <div className="space-y-3">
                  <div onClick={() => setPrivacy("public")} className={`p-4 rounded-xl border cursor-pointer transition-all ${privacy === "public" ? "bg-[#EFF6FF] border-[#2563EB]" : "bg-[#F8FAFC] border-[#E2E8F0]"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${privacy === "public" ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                        {privacy === "public" && <div className="w-2 h-2 bg-[#2563EB] rounded-full" />}
                      </div>
                      <span className="text-[13px] font-bold text-[#334155]">Công khai</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] ml-7 mt-1 text-left">Tất cả nhà tuyển dụng có thể tìm thấy bạn.</p>
                  </div>
                  <div onClick={() => setPrivacy("private")} className={`p-4 rounded-xl border cursor-pointer transition-all ${privacy === "private" ? "bg-[#EFF6FF] border-[#2563EB]" : "bg-[#F8FAFC] border-[#E2E8F0]"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${privacy === "private" ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                        {privacy === "private" && <div className="w-2 h-2 bg-[#2563EB] rounded-full" />}
                      </div>
                      <span className="text-[13px] font-bold text-[#334155]">Chế độ ẩn danh</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] ml-7 mt-1 text-left">Chỉ nhà tuyển dụng bạn đã ứng tuyển mới thấy hồ sơ.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Vô hiệu hóa tài khoản */}
            <div className="flex justify-start">
              <button className="flex items-center gap-2 text-[#EF4444] text-[13px] font-bold hover:underline py-2">
                <Trash2 size={16} />
                Vô hiệu hóa tài khoản
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Caidat;