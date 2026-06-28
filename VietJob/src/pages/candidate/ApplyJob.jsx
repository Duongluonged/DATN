import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { Building, MapPin, BriefcaseBusiness, FileText, User, PenLine, Info, UploadCloud, X, CheckCircle2, Loader2 } from 'lucide-react';
import axios from "axios";

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
        style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, fontFamily: "inherit", color: c.text, outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );
}

export default function ApplyJob() {
  const [cvOption, setCvOption] = useState("existing");
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userObj?.id || null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "Hồ Chí Minh", coverLetter: "" });
  const [job, setJob] = useState();
  const [existingCv, setExistingCv] = useState(null);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const updateForm = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const { jobId } = location.state || {};

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const [profileRes, cvRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/auth/profile/${userId}`),
          axios.get(`http://localhost:5000/api/cv/${userId}`).catch(() => ({ data: null })),
        ]);
        const profile = profileRes.data;
        if (profile) {
          setForm((prev) => ({
            ...prev,
            name: profile.Username || "",
            phone: profile.Phone || "",
            city: CITIES.includes(profile.Address) ? profile.Address : "Hồ Chí Minh",
          }));
        }
        if (cvRes.data?.cvFilePath) {
          setExistingCv({ path: cvRes.data.cvFilePath, name: cvRes.data.cvFileName || "CV của tôi" });
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin:", err);
      }
    };
    fetchProfile();
  }, [userId]);

  useEffect(() => {
    if (!jobId) { setLoading(false); return; }
    const fetchJobData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/companies/jobs/${jobId}`);
        setJob(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu job:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [jobId]);

  const uploadFile = async (file) => {
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      alert("Chỉ chấp nhận file PDF, DOC hoặc DOCX!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File không được vượt quá 5MB!");
      return;
    }

    setUploadedFile(file);
    setUploading(true);
    setUploadedUrl("");

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await axios.post("http://localhost:5000/api/upload", {
        base64,
        fileName: file.name,
      });

      setUploadedUrl(res.data.url);
    } catch (err) {
      console.error("Lỗi upload:", err);
      alert("Tải file lên thất bại, vui lòng thử lại.");
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemoveUpload = () => {
    setUploadedFile(null);
    setUploadedUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!jobId) { alert("Không tìm thấy thông tin công việc!"); return; }
    if (cvOption === "upload" && !uploadedUrl) {
      alert("Vui lòng tải lên CV trước khi nộp đơn!");
      return;
    }

    setSubmitting(true);
    try {
      const userObj = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userObj?.id || null;

      let cvPath = "";
      if (cvOption === "existing") {
        cvPath = existingCv?.path || "";
      } else {
        cvPath = uploadedUrl;
      }

      const dataToSubmit = {
        jobId, userId,
        name: form.name,
        phone: form.phone,
        city: form.city,
        coverLetter: form.coverLetter,
        cvPath,
      };

      const res = await axios.post("http://localhost:5000/api/applications/apply", dataToSubmit);
      if (res.status === 201) {
        navigate("/candidate/Vieclamcuatoi", {
          state: { successMsg: `Nộp đơn thành công cho vị trí "${job?.JobTitle}"!` }
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, minHeight: "100vh", display: "flex", flexDirection: "column", fontSize: 13 }}>
      <Navbar />

      <div style={{ display: "flex", gap: 20, maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>

          <div style={{ background: "linear-gradient(120deg,#1a56db,#2563eb 60%,#3b82f6)", borderRadius: 14, padding: "20px 22px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textAlign: "left" }}>
            <div>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,.2)", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, marginBottom: 8, letterSpacing: .4 }}>{job?.JobType}</span>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{job?.JobTitle}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, opacity: .9 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Building size={14} /><span>{job?.CompanyName}</span></span>
                <span style={{ opacity: .5 }}>·</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MapPin size={14} /><span>{job?.Location || "Đang cập nhật"}</span></span>
              </div>
            </div>
            <div style={{ width: 54, height: 54, borderRadius: 12, background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <BriefcaseBusiness size={24} />
            </div>
          </div>

          <SectionCard icon={<FileText size={18} />} title="Hồ sơ ứng tuyển (CV)">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

              <div
                onClick={() => setCvOption("existing")}
                style={{ border: `2px solid ${cvOption === "existing" ? c.blue : c.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: cvOption === "existing" ? "#f0f5ff" : c.white, transition: "all .15s" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Sử dụng CV hiện tại</span>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${cvOption === "existing" ? c.blue : c.border}`, background: cvOption === "existing" ? c.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {cvOption === "existing" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
                {existingCv ? (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 600, color: c.blue, background: "#e8f0fe", padding: "4px 10px", borderRadius: 6, display: "inline-block", wordBreak: "break-all" }}>
                      {existingCv.name}
                    </span>
                    <div style={{ fontSize: 10, color: c.muted, marginTop: 4 }}>CV đã lưu trong hệ thống</div>
                  </>
                ) : (
                  <div style={{ fontSize: 11, color: c.muted, fontStyle: "italic" }}>Chưa có CV trong hệ thống</div>
                )}
              </div>

              <div
                onClick={() => { setCvOption("upload"); if (!uploadedFile) fileInputRef.current?.click(); }}
                style={{ border: `2px solid ${cvOption === "upload" ? c.blue : c.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer", background: cvOption === "upload" ? "#f0f5ff" : c.white, transition: "all .15s" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Tải lên CV mới</span>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${cvOption === "upload" ? c.blue : c.border}`, background: cvOption === "upload" ? c.blue : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {cvOption === "upload" && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>

                {uploading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Loader2 size={16} color={c.blue} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: c.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {uploadedFile?.name}
                    </span>
                  </div>
                ) : uploadedUrl ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CheckCircle2 size={15} color="#22c55e" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#15803d", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {uploadedFile?.name}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveUpload(); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}
                      title="Xóa và chọn file khác"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, padding: "6px 0", color: c.muted }}>
                    <UploadCloud size={20} style={{ opacity: 0.4 }} />
                    <span style={{ fontSize: 11, textAlign: "center", lineHeight: 1.5 }}>Bấm để chọn file</span>
                    <span style={{ fontSize: 10, color: "#9ca3af" }}>PDF, DOC, DOCX • Tối đa 5MB</span>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

          </SectionCard>

          <SectionCard icon={<User size={18} />} title="Thông tin cá nhân">
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

          <SectionCard icon={<PenLine size={18} />} title="Thư giới thiệu bản thân">
            <p style={{ fontSize: 12, color: c.muted, lineHeight: 1.6 }}>
              Hãy chia sẻ ngắn gọn về lý do bạn phù hợp với vị trí này hoặc những thành tựu nổi bật của bạn.
            </p>
            <textarea
              value={form.coverLetter}
              onChange={updateForm("coverLetter")}
              placeholder="Nhập nội dung giới thiệu của bạn tại đây..."
              style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", color: c.text, outline: "none", resize: "vertical", minHeight: 110, lineHeight: 1.6, boxSizing: "border-box" }}
            />
            <div style={{ fontSize: 11, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
              <Info size={14} />
              Một thư giới thiệu ấn tượng thường dài khoảng 420 từ, mạch lạc, phù hợp vị trí.
            </div>
          </SectionCard>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", background: c.white, border: `1px solid ${c.border}`, borderRadius: 14 }}>
            <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: c.muted, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" }}>
              ← Quay lại
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || (cvOption === "upload" && uploading)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: submitting ? "#93c5fd" : c.blue, color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit", transition: "background .2s" }}
            >
              {submitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Đang nộp...</> : "Nộp hồ sơ ứng tuyển ✈"}
            </button>
          </div>

        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}