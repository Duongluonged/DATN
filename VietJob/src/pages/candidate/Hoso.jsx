import { useState } from "react";
import Navbar from "../../components/common/Navbar";
import { Sidebar as SidebarIcon } from "lucide-react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import { Bell, Settings, Pen } from "lucide-react";

const skills = [
  { label: "ReactJS", color: "#2563eb", bg: "#eff6ff" },
  { label: "JavaScript (ES6+)", color: "#059669", bg: "#d1fae5" },
  { label: "Git", color: "#7c3aed", bg: "#ede9fe" },
  { label: "Node.js", color: "#d97706", bg: "#fef3c7" },
  { label: "UI/UX", color: "#dc2626", bg: "#fee2e2" },
];


function NavItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
      borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: active ? 600 : 500,
      background: active ? "#eff6ff" : "transparent", color: active ? "#2563eb" : "#6b7280",
      transition: "all .12s"
    }}>
      <span style={{ fontSize: 13, width: 16, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      {label}
    </div>
  );
}

function SectionCard({ title, actions, children }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px", borderBottom: "1px solid #f3f4f6" }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
        <div style={{ display: "flex", gap: 6 }}>{actions}</div>
      </div>
      {children}
    </div>
  );
}

function SmBtn({ children }) {
  return (
    <button style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#6b7280" }}>
      {children}
    </button>
  );
}

// Donut SVG
function DonutChart({ pct = 25 }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="8" />
      <circle cx="36" cy="36" r={r} fill="none" stroke="white" strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90 36 36)" />
      <text x="36" y="41" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Be Vietnam Pro">{pct}%</text>
    </svg>
  );
}

export default function Hoso() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f3f4f6", color: "#111827", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>

      <Navbar />

      <div class = "flex flex-1 overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {/* Profile header */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "18px 24px 0", display: "flex", alignItems: "flex-start", gap: 18 }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: 14, background: "linear-gradient(135deg,#93c5fd,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", border: "3px solid #fff", boxShadow: "0 2px 12px rgba(0,0,0,.12)" }}>DL</div>
              <div style={{ width: 12, height: 12, background: "#10b981", border: "2px solid #fff", borderRadius: "50%", position: "absolute", bottom: 4, right: 4 }} />
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                Dương Lương ✏️
                <span style={{ fontSize: 11, background: "#d1fae5", color: "#059669", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Đang tìm việc</span>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Lập trình viên chính thức</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[["✉️", "duong@example.com"], ["📱", "0901 234 567"], ["📍", "Hồ Chí Minh, VN"]].map(([icon, text], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7280" }}>
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
              {/* Tabs */}
              <div style={{ display: "flex", gap: 0, marginTop: 12, borderTop: "1px solid #e5e7eb", marginLeft: -24, marginRight: -24, paddingLeft: 24 }}>
                {["Hồ sơ", "Hoạt động", "Kết nối"].map((tab, i) => (
                  <div key={i} onClick={() => setActiveTab(i)} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: activeTab === i ? "#2563eb" : "#6b7280", borderBottom: `2px solid ${activeTab === i ? "#2563eb" : "transparent"}`, transition: "all .12s" }}>{tab}</div>
                ))}
              </div>
            </div>

            
          </div>

          {/* Content row */}
          <div style={{ display: "flex" }}>
            {/* Left */}
            <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, borderRight: "1px solid #e5e7eb" }}>

              {/* Giới thiệu */}
              <SectionCard title="Giới thiệu bản thân" actions={[<SmBtn key="e">✏️</SmBtn>]}>
                <div style={{ padding: "14px 16px", fontSize: 12, color: "#6b7280", lineHeight: 1.7 }}>
                  Hãy viết đôi điều ngắn gọn về lĩnh vực và kỹ năng nổi bật của bạn để nhà tuyển dụng có thể hiểu hơn về bạn.
                </div>
              </SectionCard>

              {/* Học vấn */}
              <SectionCard title="Học vấn" actions={[<SmBtn key="e">✏️</SmBtn>, <SmBtn key="a">+</SmBtn>]}>
                <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🎓</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Đại học Thủ Lợi</div>
                    <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, marginBottom: 2 }}>Kỹ thuật phần mềm</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>Tháng 9, 2019 – Tháng 6, 2023</div>
                  </div>
                </div>
              </SectionCard>

              {/* Kinh nghiệm */}
              <SectionCard title="Kinh nghiệm làm việc" actions={[<SmBtn key="a">+</SmBtn>]}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 16px", textAlign: "center", gap: 10 }}>
                  <div style={{ fontSize: 32, opacity: .3 }}>💼</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Chưa có thông tin kinh nghiệm làm việc.</div>
                  <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>+ Thêm kinh nghiệm</span>
                </div>
              </SectionCard>

              {/* Kỹ năng */}
              <SectionCard title="Kỹ năng" actions={[<SmBtn key="a">+</SmBtn>]}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "14px 16px" }}>
                  {skills.map((skill, i) => (
                    <span key={i} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", background: skill.bg, color: skill.color }}>
                      {skill.label}
                    </span>
                  ))}
                  <span style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "#f3f4f6", color: "#6b7280", border: "1px dashed #e5e7eb" }}>
                    + Thêm kỹ năng
                  </span>
                </div>
              </SectionCard>
            </div>
          </div>          
            
        </main>
      </div>
    </div>
  );
}