import { useState } from "react";
// Sửa lại cho đúng cấu trúc thư mục thực tế của bạn
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useNavigate } from "react-router-dom";
/* ─── CONSTANTS ─── */
const STEPS = [
  { icon: "📋", label: "Application Info" },
  { icon: "📄", label: "CV & Portfolio" },
  { icon: "👤", label: "Personal Details" },
  { icon: "✉️", label: "Cover Letter" },
];

const CITIES = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Remote"];

const c = {
  blue: "#1a56db", blueLt: "#e8f0fe",
  border: "#e5e7eb", bg: "#f5f7fa",
  white: "#fff", text: "#111827", muted: "#6b7280",
};


function SectionCard({ icon, title, children }) {
  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
      </div>
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", color: c.text, outline: "none" }}
      />
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function ApplyJob() {
  const [cvOption, setCvOption] = useState("existing"); // "existing" | "upload"
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "Nguyễn Văn A", phone: "080 1234 567", city: "Hồ Chí Minh", coverLetter: "" });

  const updateForm = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, minheight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
      <Navbar />

      {/* PAGE BODY */}
      <div style={{ display: "flex", gap: 20, maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px", width: "100%" }}>


        {/* MAIN CONTENT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>

          {/* Job banner */}
          <div style={{ background: "linear-gradient(120deg,#1a56db,#2563eb 60%,#3b82f6)", borderRadius: 14, padding: "20px 22px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,.2)", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, marginBottom: 8, letterSpacing: .4 }}>FULL-TIME</span>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Senior UI Designer</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, opacity: .9 }}>
                <span>🏢</span><span>TechCorp Solutions</span>
                <span style={{ opacity: .5 }}>·</span>
                <span>📍 Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
            <div style={{ width: 54, height: 54, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>💼</div>
          </div>

          {/* CV Section */}
          <SectionCard icon="📄" title="Hồ sơ ứng tuyển (CV)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Use existing CV */}
              <div onClick={() => setCvOption("existing")} style={{ border: `2px solid ${cvOption === "existing" ? c.blue : c.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: cvOption === "existing" ? "#f0f5ff" : c.white, transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Sử dụng CV hiện tại</span>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${cvOption === "existing" ? c.blue : c.border}`, background: cvOption === "existing" ? c.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {cvOption === "existing" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: c.blue, background: "#e8f0fe", padding: "4px 10px", borderRadius: 6, display: "inline-block", wordBreak: "break-all" }}>Nguyen_Van_A_UI_Designer_2024.pdf</span>
                <div style={{ fontSize: 10, color: c.muted, marginTop: 4 }}>Tải lên ngày: 21/01/2024</div>
              </div>

              {/* Upload new */}
              <div onClick={() => setCvOption("upload")} style={{ border: `2px solid ${cvOption === "upload" ? c.blue : c.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: cvOption === "upload" ? "#f0f5ff" : c.white, transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Tải lên CV mới</span>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${cvOption === "upload" ? c.blue : c.border}`, background: cvOption === "upload" ? c.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {cvOption === "upload" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", color: c.muted }}>
                  <span style={{ fontSize: 22, opacity: .4 }}>☁️</span>
                  <span style={{ fontSize: 11, textAlign: "center", lineHeight: 1.5 }}>Chọn file từ máy tính</span>
                  <span style={{ fontSize: 10, color: "#9ca3af" }}>PDF, DOC, DOCX (tối đa 5MB)</span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Personal Info */}
          <SectionCard icon="👤" title="Thông tin cá nhân">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <FormInput label="Họ và Tên" value={form.name} onChange={updateForm("name")} />
              <FormInput label="Số điện thoại" value={form.phone} onChange={updateForm("phone")} />
              <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Nơi làm việc mong muốn</label>
                <select value={form.city} onChange={updateForm("city")} style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", color: c.text, outline: "none", background: c.white, appearance: "none", cursor: "pointer" }}>
                  {CITIES.map((city) => <option key={city}>{city}</option>)}
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Cover Letter */}
          <SectionCard icon="✍️" title="Thư giới thiệu bản thân">
            <p style={{ fontSize: 12, color: c.muted, lineHeight: 1.6 }}>
              Hãy chia sẻ ngắn gọn về lý do bạn phù hợp với vị trí này hoặc những thành tựu nổi bật của bạn.
            </p>
            <textarea
              value={form.coverLetter}
              onChange={updateForm("coverLetter")}
              placeholder="Nhập nội dung giới thiệu của bạn tại đây..."
              style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", color: c.text, outline: "none", resize: "vertical", minHeight: 110, lineHeight: 1.6 }}
            />
            <div style={{ fontSize: 11, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
              ℹ️ Một thư giới thiệu ấn tượng thường dài khoảng 420 từ, mạch lạc, phù hợp vị trí.
            </div>
          </SectionCard>

          {/* Footer actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: c.white, border: `1px solid ${c.border}`, borderRadius: 14 }}>
            <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: c.muted, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>
              ← Quay lại
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, background: c.blue, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Nộp hồ sơ ứng tuyển ✈
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}