import { useState } from "react";
import Navbar from "../../components/common/Navbar";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, FileText, User, Briefcase, 
  Mail, Bell, Settings, Plus, MoreHorizontal, Shield
} from 'lucide-react';
import Sidebar from "../../components/common/Candidate_c/Sidebar";


const s = {
  body: { fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f3f4f6", color: "#111827", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { height: 52, background: "#fff", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 },
  logo: { fontSize: 20, fontWeight: 800, color: "#2563eb", letterSpacing: -0.5 },
  topActions: { display: "flex", alignItems: "center", gap: 12 },
  iconBtn: { width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer" },
  layout: { display: "flex", flex: 1, overflow: "hidden" },
  sidebar: { width: 220, background: "#fff", borderRight: "1px solid #e5e7eb", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 },
  userCard: { display: "flex", alignItems: "center", gap: 10, padding: 10, background: "#eff6ff", borderRadius: 10, marginBottom: 8 },
  userAvatar: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  main: { flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 },
};

export default function HoSoDinhKem() {
  const [dragging, setDragging] = useState(false); 

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); };

  
  
  const MenuItem = ({ icon, label, path, active }) => (
  <Link to={path} className={`flex items-center gap-3 p-3 ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}>
    {icon}
    <span>{label}</span>
  </Link>
);

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50 font-sans text-slate-700"
        style={{ fontFamily: "'Inter', sans-serif" }}>
          <Sidebar />

        {/* MAIN */}
        <main style={s.main}>
          {/* Page header */}
          <div>
            <h1 className="text-2xl font-bold mb-2">Hồ sơ đính kèm</h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              Quản lý các bản CV của bạn để sẵn sàng ứng tuyển vào những vị trí mơ ước. Chúng tôi hỗ trợ định dạng .pdf và .docx.
            </p>
          </div>

          {/* Upload + Tip row */}
          <div style={{ display: "flex", gap: 16 }}>
            {/* Upload card */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              // eslint-disable-next-line no-dupe-keys
              style={{ flex: 1, background: "#fff", border: `1.5px dashed ${dragging ? "#2563eb" : "#d1d5db"}`, borderRadius: 14, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8, transition: "border-color .15s", background: dragging ? "#eff6ff" : "#fff" }}>
              <div style={{ fontSize: 36 }}>☁️</div>
              <div className="text-xl font-bold mb-2">Tải lên hồ sơ mới</div>
              <div className="text-sm text-gray-500 leading-relaxed">
                Kéo và thả tệp CV của bạn vào đây hoặc nhấn để<br />duyệt tệp từ máy tính.
              </div>
              <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                Chọn File CV
              </button>
              <div className="text-sm text-gray-500">
                Dung lượng tối đa 10MB · .pdf, .docx, .doc
              </div>
            </div>

            {/* Tip card */}
            <div style={{ width: 220, background: "#2563eb", borderRadius: 14, padding: 20, color: "#fff", flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }}><Shield size={28} /></div>
              <div className="text-xl font-bold mb-2">Mẹo cho bạn</div>
              <div className="text-sm leading-relaxed">
                Mỗi hồ sơ được lưu giữ an toàn và chỉ chia sẻ với các tổ chức tuyển dụng khi bạn cho phép. Cập nhật thường xuyên giúp tăng 65% cơ hội được nhà tuyển dụng chú ý.
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: .8, marginBottom: 5 }}>
                  <span>Dung lượng đã dùng</span><span>4.1MB / 50MB</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,.3)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "82%", background: "#fff", borderRadius: 99 }} />
                </div>
              </div>
            </div>
          </div>

          

          {/* Promo banner */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div className="text-xl font-bold mb-2">Bạn chưa hài lòng với CV hiện tại?</div>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>
                Hãy thử công cụ tạo hồ sơ trực tuyến của Talent Arc. Chúng tôi cung cấp các mẫu thiết kế chuẩn ATS, giúp bạn vượt qua các vòng lọc hồ sơ tự động dễ dàng.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ background: "transparent", border: "1.5px solid #e5e7eb", color: "#111827", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Tìm hiểu thêm
                </button>
                <button style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                  Tạo hồ sơ ngay →
                </button>
              </div>
            </div>
            {/* Resume illustration */}
            <div style={{ width: 130, height: 90, background: "linear-gradient(135deg,#1e3a5f,#2563eb)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", overflow: "hidden" }}>
              <div style={{ width: 72, height: 82, background: "#fff", borderRadius: 6, padding: "8px 6px", display: "flex", flexDirection: "column", gap: 4, position: "relative", zIndex: 1 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#2563eb", marginBottom: 2 }} />
                {[60, 80, 70, 85, 65, 75].map((w, i) => (
                  <div key={i} style={{ height: 4, background: i === 0 ? "#2563eb" : "#e5e7eb", borderRadius: 2, width: `${w}%` }} />
                ))}
              </div>
              <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 22, opacity: .9 }}>🌙</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}