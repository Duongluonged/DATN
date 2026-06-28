import React, { useState, useEffect } from "react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import { User, Bell, Lock, Eye, ArrowRight, ShieldCheck, Trash2, Loader2, CheckCircle2, XCircle } from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api";

const getUserFromStorage = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); }
  catch { return {}; }
};

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  const isOk = type === "success";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
      background: isOk ? "#f0fdf4" : "#fef2f2",
      border: `1px solid ${isOk ? "#86efac" : "#fca5a5"}`,
      color: isOk ? "#15803d" : "#dc2626",
    }}>
      {isOk ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      {msg}
    </div>
  );
};

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`w-12 h-6 rounded-full transition-all relative ${value ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? "right-1" : "left-1"}`} />
  </button>
);

const Caidat = () => {
  const user = getUserFromStorage();
  const userId = user?.id;

  const [form, setForm] = useState({ username: "", phone: "", email: "" });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileToast, setProfileToast] = useState({ msg: "", type: "" });

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPwModal, setShowPwModal] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [pwToast, setPwToast] = useState({ msg: "", type: "" });

  const [emailNoti, setEmailNoti] = useState(true);
  const [pushNoti, setPushNoti] = useState(false);
  const [privacy, setPrivacy] = useState("public");

  useEffect(() => {
    if (!userId) { setLoadingProfile(false); return; }
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/auth/profile/${userId}`);
        const p = res.data;
        setForm({
          username: p.Username || "",
          phone:    p.Phone    || "",
          email:    p.Email    || "",
        });
      } catch (err) {
        console.error("Lỗi load profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const showToast = (setter, msg, type) => {
    setter({ msg, type });
    setTimeout(() => setter({ msg: "", type: "" }), 3500);
  };

  const handleSaveProfile = async () => {
    if (!form.username.trim()) { showToast(setProfileToast, "Họ tên không được để trống.", "error"); return; }
    setSavingProfile(true);
    try {
      await axios.put(`${API}/auth/profile/${userId}`, {
        username: form.username,
        phone:    form.phone,
      });
      const stored = getUserFromStorage();
      localStorage.setItem("user", JSON.stringify({ ...stored, username: form.username }));
      showToast(setProfileToast, "Lưu thông tin thành công!", "success");
    } catch (err) {
      showToast(setProfileToast, err.response?.data?.error || "Lưu thất bại.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) {
      showToast(setPwToast, "Vui lòng điền đầy đủ thông tin.", "error"); return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      showToast(setPwToast, "Mật khẩu mới và xác nhận không khớp.", "error"); return;
    }
    setSavingPw(true);
    try {
      const res = await axios.put(`${API}/auth/profile/${userId}/password`, {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      showToast(setPwToast, res.data.message || "Đổi mật khẩu thành công!", "success");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setShowPwModal(false), 1800);
    } catch (err) {
      showToast(setPwToast, err.response?.data?.error || "Đổi mật khẩu thất bại.", "error");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f5f7fa", color: "#111827", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-10">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#0F172A]">Cài đặt</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Quản lý thông tin cá nhân và cấu hình trải nghiệm của bạn trên VietJob.</p>
          </div>

          <div className="space-y-6 max-w-8xl">

            <section className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-[#2563EB]">
                  <User size={20} />
                </div>
                <h2 className="text-[18px] font-bold text-[#0F172A]">Thông tin tài khoản</h2>
              </div>

              {loadingProfile ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={28} className="animate-spin text-[#2563EB]" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-[#64748B] ml-1">Họ và tên</label>
                      <input
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#2563EB] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-[#64748B] ml-1">Số điện thoại</label>
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[14px] focus:outline-none focus:border-[#2563EB] transition-all"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[13px] font-semibold text-[#64748B] ml-1">Địa chỉ Email</label>
                      <input
                        type="email"
                        value={form.email}
                        readOnly
                        className="w-full px-4 py-3 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[14px] text-[#94A3B8] cursor-not-allowed"
                        title="Email không thể thay đổi"
                      />
                      <p className="text-[11px] text-[#94A3B8] ml-1">Email đăng ký không thể thay đổi.</p>
                    </div>
                  </div>

                  {profileToast.msg && <div className="mb-3"><Toast {...profileToast} /></div>}

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className="flex items-center gap-2 bg-[#2563EB] text-white px-8 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#1D4ED8] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {savingProfile && <Loader2 size={15} className="animate-spin" />}
                      Lưu thay đổi
                    </button>
                  </div>
                </>
              )}
            </section>

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
                  <Toggle value={emailNoti} onChange={setEmailNoti} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-[#334155]">Thông báo đẩy (Push)</p>
                    <p className="text-[13px] text-[#64748B]">Nhận thông báo trực tiếp trên trình duyệt khi có tin nhắn mới.</p>
                  </div>
                  <Toggle value={pushNoti} onChange={setPushNoti} />
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-6">
              <section className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#F5F3FF] rounded-xl flex items-center justify-center text-[#7C3AED]">
                    <Lock size={20} />
                  </div>
                  <h2 className="text-[18px] font-bold text-[#0F172A]">Bảo mật</h2>
                </div>
                <div className="space-y-4">
                  <button
                    onClick={() => { setShowPwModal(true); setPwToast({ msg: "", type: "" }); }}
                    className="w-full flex items-center justify-between p-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-xl transition-all border border-[#E2E8F0] group"
                  >
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

              <section className="bg-white rounded-[24px] border border-[#F1F5F9] shadow-sm p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#F0FDF4] rounded-xl flex items-center justify-center text-[#16A34A]">
                    <Eye size={20} />
                  </div>
                  <h2 className="text-[18px] font-bold text-[#0F172A]">Quyền riêng tư</h2>
                </div>
                <p className="text-[12px] text-[#64748B] mb-4">Điều chỉnh cách nhà tuyển dụng nhìn thấy hồ sơ của bạn.</p>
                <div className="space-y-3">
                  {[
                    { key: "public",  label: "Công khai",      desc: "Tất cả nhà tuyển dụng có thể tìm thấy bạn." },
                    { key: "private", label: "Chế độ ẩn danh", desc: "Chỉ nhà tuyển dụng bạn đã ứng tuyển mới thấy hồ sơ." },
                  ].map(opt => (
                    <div
                      key={opt.key}
                      onClick={() => setPrivacy(opt.key)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${privacy === opt.key ? "bg-[#EFF6FF] border-[#2563EB]" : "bg-[#F8FAFC] border-[#E2E8F0]"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${privacy === opt.key ? "border-[#2563EB]" : "border-[#CBD5E1]"}`}>
                          {privacy === opt.key && <div className="w-2 h-2 bg-[#2563EB] rounded-full" />}
                        </div>
                        <span className="text-[13px] font-bold text-[#334155]">{opt.label}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] ml-7 mt-1 text-left">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex justify-start">
              <button className="flex items-center gap-2 text-[#EF4444] text-[13px] font-bold hover:underline py-2">
                <Trash2 size={16} />
                Vô hiệu hóa tài khoản
              </button>
            </div>
          </div>
        </main>
      </div>

      {showPwModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPwModal(false); }}
        >
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", width: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "#0F172A" }}>Đổi mật khẩu</h3>
            <p style={{ fontSize: 12, color: "#64748B", marginBottom: 24 }}>Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật.</p>

            {[
              { label: "Mật khẩu hiện tại", key: "currentPassword" },
              { label: "Mật khẩu mới",      key: "newPassword" },
              { label: "Xác nhận mật khẩu mới", key: "confirmPassword" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input
                  type="password"
                  value={pwForm[f.key]}
                  onChange={(e) => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  placeholder={f.label}
                />
              </div>
            ))}

            {pwToast.msg && <div style={{ marginBottom: 16 }}><Toast {...pwToast} /></div>}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button
                onClick={() => setShowPwModal(false)}
                style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid #E2E8F0", background: "#F8FAFC", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#64748B" }}
              >
                Hủy
              </button>
              <button
                onClick={handleChangePassword}
                disabled={savingPw}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 22px", borderRadius: 10, background: "#2563EB", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: savingPw ? "not-allowed" : "pointer", opacity: savingPw ? 0.7 : 1 }}
              >
                {savingPw && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
                Xác nhận đổi
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Caidat;