import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import { Mail, Phone, MapPin, Pen, GraduationCap, Briefcase, Plus, Loader2, X, Save, Trash2 } from "lucide-react";

const API = "http://localhost:5000/api";

// Bảng màu cho kỹ năng (tự động xoay vòng)
const SKILL_COLORS = [
  { color: "#2563eb", bg: "#eff6ff" },
  { color: "#059669", bg: "#d1fae5" },
  { color: "#7c3aed", bg: "#ede9fe" },
  { color: "#d97706", bg: "#fef3c7" },
  { color: "#dc2626", bg: "#fee2e2" },
  { color: "#0891b2", bg: "#e0f2fe" },
];

function fmtMonth(val) {
  if (!val) return "";
  const [y, m] = val.split("-");
  return `Tháng ${m}, ${y}`;
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

// ─── Modal Overlay ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 680,
          boxShadow: "0 24px 80px rgba(0,0,0,0.22)", overflow: "hidden",
          animation: "modalIn 0.22s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "22px 28px", borderBottom: "1px solid #f3f4f6",
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{title}</span>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: 9, border: "none",
              background: "#f3f4f6", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", color: "#6b7280",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 32px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10,
  border: "1px solid #e5e7eb", fontSize: 15, color: "#111827",
  outline: "none", background: "#f9fafb", boxSizing: "border-box",
  transition: "border-color .2s",
};

function SaveBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "12px 28px", borderRadius: 10, border: "none",
        background: "linear-gradient(135deg,#6366f1,#2563eb)",
        color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
        marginTop: 8,
      }}
    >
      <Save size={17} /> Lưu thay đổi
    </button>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────
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

function SmBtn({ icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 30, height: 30, borderRadius: 7, border: "1px solid #e5e7eb",
        background: "#fff", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "center", color: "#6b7280",
        transition: "background .15s, color .15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#2563eb"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6b7280"; }}
    >
      <Icon size={20} />
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Hoso() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modal, setModal] = useState(null); // 'bio' | 'edu' | 'exp' | 'skill'

  // CV data từ DB
  const [bio, setBio] = useState("");
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]); // mảng string ["ReactJS", "Node.js"]

  // Form states
  const [bioForm, setBioForm] = useState("");
  const [eduForm, setEduForm] = useState({ school: "", major: "", from: "", to: "" });
  const [expForm, setExpForm] = useState({ company: "", position: "", from: "", to: "", description: "" });
  const [skillForm, setSkillForm] = useState("");

  // ── Fetch tất cả dữ liệu khi component mount ──
  useEffect(() => {
    const init = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("user"));
        if (!stored?.token) return;
        const decoded = parseJwt(stored.token);
        if (!decoded?.id) return;
        setUserId(decoded.id);

        const [profileRes, cvRes, eduRes, expRes] = await Promise.all([
          axios.get(`${API}/auth/profile/${decoded.id}`),
          axios.get(`${API}/cv/${decoded.id}`),
          axios.get(`${API}/cv/${decoded.id}/education`),
          axios.get(`${API}/cv/${decoded.id}/experience`),
        ]);

        setProfile(profileRes.data);
        const bioVal = cvRes.data.bio || "";
        setBio(bioVal);
        setBioForm(bioVal);
        // Skills là chuỗi "ReactJS, Node.js" → tách thành mảng
        const rawSkills = cvRes.data.skills || "";
        setSkills(rawSkills ? rawSkills.split(",").map(s => s.trim()).filter(Boolean) : []);
        setEducations(eduRes.data);
        setExperiences(expRes.data);
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const avatarText = profile?.Username
    ? profile.Username.substring(0, 2).toUpperCase()
    : "??";

  const contactItems = [
    { Icon: Mail, value: profile?.Email || "Chưa cập nhật" },
    { Icon: Phone, value: profile?.Phone || "Chưa cập nhật" },
    { Icon: MapPin, value: profile?.Address || "Chưa cập nhật" },
  ];

  const closeModal = () => setModal(null);

  // ── Lưu Giới thiệu ──
  const saveBio = async () => {
    try {
      await axios.post(`${API}/cv/${userId}/bio`, { bio: bioForm });
      setBio(bioForm);
      closeModal();
    } catch (err) { console.error(err); }
  };

  // ── Lưu Học vấn ──
  const saveEducation = async () => {
    try {
      const payload = { school: eduForm.school, major: eduForm.major, from: eduForm.from, to: eduForm.to };
      if (eduForm.id) {
        await axios.put(`${API}/cv/${userId}/education/${eduForm.id}`, payload);
        setEducations(prev => prev.map(e => e.Id === eduForm.id
          ? { ...e, SchoolName: eduForm.school, Major: eduForm.major, StartDate: eduForm.from, EndDate: eduForm.to }
          : e));
      } else {
        const res = await axios.post(`${API}/cv/${userId}/education`, payload);
        setEducations(prev => [...prev, { Id: res.data.id, SchoolName: eduForm.school, Major: eduForm.major, StartDate: eduForm.from, EndDate: eduForm.to }]);
      }
      setEduForm({ school: "", major: "", from: "", to: "" });
      closeModal();
    } catch (err) { console.error(err); }
  };

  const deleteEducation = async (id) => {
    try {
      await axios.delete(`${API}/cv/${userId}/education/${id}`);
      setEducations(prev => prev.filter(e => e.Id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Lưu Kinh nghiệm ──
  const saveExperience = async () => {
    try {
      const payload = { company: expForm.company, position: expForm.position, from: expForm.from, to: expForm.to, description: expForm.description };
      if (expForm.id) {
        await axios.put(`${API}/cv/${userId}/experience/${expForm.id}`, payload);
        setExperiences(prev => prev.map(e => e.Id === expForm.id
          ? { ...e, CompanyName: expForm.company, Position: expForm.position, StartDate: expForm.from, EndDate: expForm.to, Description: expForm.description }
          : e));
      } else {
        const res = await axios.post(`${API}/cv/${userId}/experience`, payload);
        setExperiences(prev => [...prev, { Id: res.data.id, CompanyName: expForm.company, Position: expForm.position, StartDate: expForm.from, EndDate: expForm.to, Description: expForm.description }]);
      }
      setExpForm({ company: "", position: "", from: "", to: "", description: "" });
      closeModal();
    } catch (err) { console.error(err); }
  };

  const deleteExperience = async (id) => {
    try {
      await axios.delete(`${API}/cv/${userId}/experience/${id}`);
      setExperiences(prev => prev.filter(e => e.Id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Lưu Kỹ năng (lưu toàn bộ chuỗi) ──
  const saveSkill = async () => {
    if (!skillForm.trim()) return;
    try {
      const newList = [...skills, skillForm.trim()];
      await axios.post(`${API}/cv/${userId}/skills`, { skills: newList.join(", ") });
      setSkills(newList);
      setSkillForm("");
      closeModal();
    } catch (err) { console.error(err); }
  };

  const deleteSkill = async (name) => {
    try {
      const newList = skills.filter(s => s !== name);
      await axios.post(`${API}/cv/${userId}/skills`, { skills: newList.join(", ") });
      setSkills(newList);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f3f4f6", color: "#111827", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>

      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto" }}>

          {/* Profile header */}
          <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "18px 24px 14px", display: "flex", alignItems: "flex-start", gap: 18 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 72, height: 72, borderRadius: 14, background: "linear-gradient(135deg,#93c5fd,#6366f1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", border: "3px solid #fff", boxShadow: "0 2px 12px rgba(0,0,0,.12)" }}>
                {loading ? <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} /> : avatarText}
              </div>
              <div style={{ width: 12, height: 12, background: "#10b981", border: "2px solid #fff", borderRadius: "50%", position: "absolute", bottom: 4, right: 4 }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                {loading ? "Đang tải..." : (profile?.Username || "Người dùng")}
                <span style={{ fontSize: 11, background: "#d1fae5", color: "#059669", padding: "2px 8px", borderRadius: 20, fontWeight: 600 }}>Đang tìm việc</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {contactItems.map(({ Icon, value }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: value === "Chưa cập nhật" ? "#d1d5db" : "#6b7280" }}>
                    <Icon size={12} /><span>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content row */}
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, borderRight: "1px solid #e5e7eb" }}>

              {/* Giới thiệu */}
              <SectionCard
                title="Giới thiệu bản thân"
                actions={[<SmBtn key="e" icon={Pen} onClick={() => { setBioForm(bio); setModal("bio"); }} />]}
              >
                <div style={{ padding: "14px 16px", fontSize: 12, color: bio ? "#374151" : "#9ca3af", lineHeight: 1.7 }}>
                  {bio || "Hãy viết đôi điều ngắn gọn về lĩnh vực và kỹ năng nổi bật của bạn để nhà tuyển dụng có thể hiểu hơn về bạn."}
                </div>
              </SectionCard>

              {/* Học vấn */}
              <SectionCard
                title="Học vấn"
                actions={[
                  <SmBtn key="a" icon={Plus} onClick={() => { setEduForm({ school: "", major: "", from: "", to: "", mo_ta: "" }); setModal("edu"); }} />,
                ]}
              >
                {educations.length === 0 ? (
                  <div style={{ padding: "24px 16px", textAlign: "center", color: "#9ca3af", fontSize: 12 }}>
                    Chưa có thông tin học vấn.
                    <span onClick={() => { setEduForm({ school: "", major: "", from: "", to: "", mo_ta: "" }); setModal("edu"); }}
                      style={{ color: "#2563eb", fontWeight: 600, cursor: "pointer", marginLeft: 6 }}>+ Thêm</span>
                  </div>
                ) : educations.map((edu) => (
                  <div key={edu.Id} style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", borderBottom: "1px solid #f9fafb" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#2563eb" }}>
                      <GraduationCap size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{edu.SchoolName}</div>
                      <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 600, marginBottom: 2 }}>{edu.Major}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{fmtMonth(edu.StartDate)} – {fmtMonth(edu.EndDate)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <SmBtn icon={Pen} onClick={() => { setEduForm({ id: edu.Id, school: edu.SchoolName, major: edu.Major, from: edu.StartDate?.slice(0,7), to: edu.EndDate?.slice(0,7) }); setModal("edu"); }} />
                      <SmBtn icon={Trash2} onClick={() => deleteEducation(edu.Id)} />
                    </div>
                  </div>
                ))}
              </SectionCard>

              {/* Kinh nghiệm */}
              <SectionCard
                title="Kinh nghiệm làm việc"
                actions={[<SmBtn key="a" icon={Plus} onClick={() => { setExpForm({ company: "", position: "", from: "", to: "", description: "" }); setModal("exp"); }} />]}
              >
                {experiences.length === 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 16px", textAlign: "center", gap: 10 }}>
                    <div style={{ opacity: .3, color: "#6b7280" }}><Briefcase size={36} /></div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Chưa có thông tin kinh nghiệm làm việc.</div>
                    <span onClick={() => { setExpForm({ company: "", position: "", from: "", to: "", description: "" }); setModal("exp"); }}
                      style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, cursor: "pointer" }}>+ Thêm kinh nghiệm</span>
                  </div>
                ) : experiences.map((exp) => (
                  <div key={exp.Id} style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", borderBottom: "1px solid #f9fafb" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#d97706" }}>
                      <Briefcase size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{exp.Position}</div>
                      <div style={{ fontSize: 11, color: "#d97706", fontWeight: 600, marginBottom: 2 }}>{exp.CompanyName}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{fmtMonth(exp.StartDate)} – {exp.EndDate ? fmtMonth(exp.EndDate) : "Hiện tại"}</div>
                      {exp.Description && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4, lineHeight: 1.6 }}>{exp.Description}</div>}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <SmBtn icon={Pen} onClick={() => { setExpForm({ id: exp.Id, company: exp.CompanyName, position: exp.Position, from: exp.StartDate?.slice(0,7), to: exp.EndDate?.slice(0,7), description: exp.Description }); setModal("exp"); }} />
                      <SmBtn icon={Trash2} onClick={() => deleteExperience(exp.Id)} />
                    </div>
                  </div>
                ))}
              </SectionCard>

              {/* Kỹ năng */}
              <SectionCard
                title="Kỹ năng"
                actions={[<SmBtn key="a" icon={Plus} onClick={() => { setSkillForm(""); setModal("skill"); }} />]}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "14px 16px" }}>
                  {skills.map((name, i) => {
                    const c = SKILL_COLORS[i % SKILL_COLORS.length];
                    return (
                      <span key={i} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "default", background: c.bg, color: c.color, display: "flex", alignItems: "center", gap: 5 }}>
                        {name}
                        <X size={11} style={{ cursor: "pointer", opacity: 0.6 }} onClick={() => deleteSkill(name)} />
                      </span>
                    );
                  })}
                  <span onClick={() => { setSkillForm(""); setModal("skill"); }}
                    style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", background: "#f3f4f6", color: "#6b7280", border: "1px dashed #e5e7eb" }}>
                    + Thêm kỹ năng
                  </span>
                </div>
              </SectionCard>

            </div>
          </div>
        </main>
      </div>

      {/* ── Modal: Giới thiệu bản thân ── */}
      {modal === "bio" && (
        <Modal title="Chỉnh sửa giới thiệu bản thân" onClose={closeModal}>
          <Field label="Giới thiệu">
            <textarea
              rows={5}
              value={bioForm}
              onChange={(e) => setBioForm(e.target.value)}
              placeholder="Viết đôi điều về bản thân bạn..."
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            />
          </Field>
          <SaveBtn onClick={saveBio} />
        </Modal>
      )}

      {/* ── Modal: Học vấn ── */}
      {modal === "edu" && (
        <Modal title={eduForm.id ? "Chỉnh sửa học vấn" : "Thêm học vấn"} onClose={closeModal}>
          <Field label="Trường / Cơ sở đào tạo">
            <input type="text" value={eduForm.school}
              onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
              placeholder="VD: Đại học Bách Khoa" style={inputStyle} />
          </Field>
          <Field label="Chuyên ngành">
            <input type="text" value={eduForm.major}
              onChange={(e) => setEduForm({ ...eduForm, major: e.target.value })}
              placeholder="VD: Kỹ thuật phần mềm" style={inputStyle} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Từ tháng / năm">
              <input type="month" value={eduForm.from}
                onChange={(e) => setEduForm({ ...eduForm, from: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Đến tháng / năm">
              <input type="month" value={eduForm.to}
                onChange={(e) => setEduForm({ ...eduForm, to: e.target.value })} style={inputStyle} />
            </Field>
          </div>
          <SaveBtn onClick={saveEducation} />
        </Modal>
      )}

      {/* ── Modal: Kinh nghiệm làm việc ── */}
      {modal === "exp" && (
        <Modal title={expForm.id ? "Chỉnh sửa kinh nghiệm" : "Thêm kinh nghiệm làm việc"} onClose={closeModal}>
          <Field label="Công ty">
            <input type="text" value={expForm.company}
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
              placeholder="VD: FPT Software" style={inputStyle} />
          </Field>
          <Field label="Chức vụ / Vị trí">
            <input type="text" value={expForm.position}
              onChange={(e) => setExpForm({ ...expForm, position: e.target.value })}
              placeholder="VD: Frontend Developer" style={inputStyle} />
          </Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Từ tháng / năm">
              <input type="month" value={expForm.from}
                onChange={(e) => setExpForm({ ...expForm, from: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Đến tháng / năm (bỏ trống nếu đang làm)">
              <input type="month" value={expForm.to}
                onChange={(e) => setExpForm({ ...expForm, to: e.target.value })} style={inputStyle} />
            </Field>
          </div>
          <Field label="Mô tả công việc">
            <textarea rows={3} value={expForm.description}
              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
              placeholder="Mô tả ngắn gọn vai trò và thành tích của bạn..."
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
          </Field>
          <SaveBtn onClick={saveExperience} />
        </Modal>
      )}

      {/* ── Modal: Kỹ năng ── */}
      {modal === "skill" && (
        <Modal title="Thêm kỹ năng" onClose={closeModal}>
          <Field label="Tên kỹ năng">
            <input type="text" value={skillForm}
              onChange={(e) => setSkillForm(e.target.value)}
              placeholder="VD: TypeScript, Docker, Figma..."
              onKeyDown={(e) => e.key === "Enter" && saveSkill()}
              style={inputStyle} />
          </Field>
          <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 14 }}>
            💡 Nhập một kỹ năng mỗi lần, nhấn Enter hoặc Lưu để thêm.
          </p>
          <SaveBtn onClick={saveSkill} />
        </Modal>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        input:focus, textarea:focus {
          border-color: #6366f1 !important;
          outline: none;
          background: #fff !important;
        }
      `}</style>
    </div>
  );
}