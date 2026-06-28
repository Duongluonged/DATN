import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import { Shield, UploadCloud, FileText, Trash2, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const API = "http://localhost:5000/api";

function fmtSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function parseJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); } catch { return null; }
}

const ACCEPTED = ".pdf,.doc,.docx";
const MAX_MB = 10;

export default function HoSoDinhKem() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [userId, setUserId] = useState(null);

  const [cvFilePath, setCvFilePath] = useState(null);
  const [cvFileName, setCvFileName] = useState(null);

  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      const id = stored?.id || parseJwt(stored?.token)?.id;
      if (id) setUserId(id);
    } catch { }
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API}/cv/${userId}`)
      .then(r => {
        setCvFilePath(r.data.cvFilePath || null);
        setCvFileName(r.data.cvFileName || null);
      })
      .catch(err => console.error("Lỗi tải thông tin CV:", err));
  }, [userId]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      showToast("error", "Chỉ chấp nhận file .pdf, .doc, .docx");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      showToast("error", `File quá lớn (tối đa ${MAX_MB}MB)`);
      return;
    }
    setPending({ file, previewName: file.name, previewSize: file.size });
  };

  const handleInputChange = (e) => handleFileSelect(e.target.files[0]);
  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!pending || !userId) return;
    setUploading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(pending.file);
      });

      const uploadRes = await axios.post(`http://localhost:5000/api/upload`, {
        base64,
        fileName: pending.file.name,
      });

      const fileUrl = uploadRes.data.url;

      await axios.put(`${API}/cv/${userId}/cv-file`, {
        fileUrl,
        fileName: pending.file.name,
      });

      setCvFilePath(fileUrl);
      setCvFileName(pending.file.name);
      setPending(null);
      if (inputRef.current) inputRef.current.value = "";
      showToast("success", "Tải CV lên thành công!");
    } catch (err) {
      console.error(err);
      showToast("error", "Tải lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa CV này không?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/cv/${userId}/cv-file`);
      setCvFilePath(null);
      setCvFileName(null);
      showToast("success", "Đã xóa CV.");
    } catch {
      showToast("error", "Xóa thất bại. Thử lại.");
    } finally {
      setDeleting(false);
    }
  };

  const handleGoToProfile = () => navigate("/candidate/Hoso");

  const extBadge = (name) => {
    const ext = (name || "").split(".").pop().toLowerCase();
    if (ext === "pdf") return { color: "#dc2626", bg: "#fee2e2", label: "PDF" };
    if (ext === "docx" || ext === "doc") return { color: "#2563eb", bg: "#dbeafe", label: "DOC" };
    return { color: "#6b7280", bg: "#f3f4f6", label: "FILE" };
  };

  const badge = extBadge(cvFileName || pending?.previewName);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#f3f4f6", color: "#111827", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {toast && (
        <div style={{
          position: "fixed", top: 80, right: 24, zIndex: 9999,
          background: toast.type === "success" ? "#ecfdf5" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#6ee7b7" : "#fca5a5"}`,
          color: toast.type === "success" ? "#065f46" : "#991b1b",
          padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: 8, maxWidth: 360,
          animation: "slideIn 0.25s ease",
        }}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, overflowY: "auto", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>

          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Hồ sơ đính kèm</h1>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
              Tải lên CV của bạn để sẵn sàng ứng tuyển. Hỗ trợ <strong>.pdf</strong>, <strong>.docx</strong>, <strong>.doc</strong> (tối đa {MAX_MB} MB).
            </p>
          </div>

          <div style={{ display: "flex", gap: 16 }}>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !pending && !cvFilePath && inputRef.current?.click()}
              style={{
                flex: 1, background: dragging ? "#eff6ff" : "#fff",
                border: `2px dashed ${dragging ? "#2563eb" : pending ? "#10b981" : cvFilePath ? "#e5e7eb" : "#d1d5db"}`,
                borderRadius: 16, padding: 32,
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", textAlign: "center", gap: 12,
                transition: "all .15s",
                cursor: (!pending && !cvFilePath) ? "pointer" : "default",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                style={{ display: "none" }}
                onChange={handleInputChange}
              />

              {!cvFilePath && !pending && (
                <>
                  <div style={{
                    width: 64, height: 64, borderRadius: 16,
                    background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <UploadCloud size={32} color="#2563eb" />
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Tải lên hồ sơ</div>
                  <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
                    Kéo & thả hoặc <span style={{ color: "#2563eb", fontWeight: 600 }}>nhấn để chọn file</span> từ máy tính
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    .pdf · .docx · .doc &nbsp;|&nbsp; Tối đa {MAX_MB}MB
                  </div>
                </>
              )}

              {pending && (
                <div style={{ width: "100%", maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
                  <div style={{
                    background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12,
                    padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 16,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: extBadge(pending.previewName).bg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800, color: extBadge(pending.previewName).color, flexShrink: 0,
                    }}>
                      {extBadge(pending.previewName).label}
                    </div>
                    <div style={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {pending.previewName}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{fmtSize(pending.previewSize)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button
                      onClick={() => { setPending(null); if (inputRef.current) inputRef.current.value = ""; }}
                      disabled={uploading}
                      style={{
                        padding: "10px 22px", borderRadius: 10, border: "1.5px solid #e5e7eb",
                        background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      style={{
                        padding: "10px 28px", borderRadius: 10, border: "none",
                        background: uploading ? "#93c5fd" : "#2563eb",
                        color: "#fff", fontSize: 13, fontWeight: 700,
                        cursor: uploading ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      {uploading
                        ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Đang tải lên...</>
                        : <><UploadCloud size={16} /> Tải lên</>}
                    </button>
                  </div>
                </div>
              )}

              {cvFilePath && !pending && (
                <div style={{ width: "100%", maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
                  <div style={{
                    background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 14,
                    padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, marginBottom: 18,
                  }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 12,
                      background: badge.bg, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, color: badge.color, flexShrink: 0,
                    }}>
                      {badge.label}
                    </div>
                    <div style={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {cvFileName}
                      </div>
                      <div style={{ fontSize: 12, color: "#16a34a", marginTop: 3, display: "flex", alignItems: "center", gap: 5 }}>
                        <CheckCircle size={13} /> CV đang được lưu
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <a
                      href={cvFilePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={cvFileName}
                      style={{
                        padding: "9px 20px", borderRadius: 10, border: "1.5px solid #2563eb",
                        background: "#fff", color: "#2563eb", fontSize: 13, fontWeight: 600,
                        textDecoration: "none", display: "flex", alignItems: "center", gap: 7,
                      }}
                    >
                      <Download size={15} /> Tải xuống
                    </a>
                    <button
                      onClick={() => inputRef.current?.click()}
                      style={{
                        padding: "9px 20px", borderRadius: 10, border: "1.5px solid #e5e7eb",
                        background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 7,
                      }}
                    >
                      <UploadCloud size={15} /> Thay thế
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      style={{
                        padding: "9px 20px", borderRadius: 10, border: "1.5px solid #fee2e2",
                        background: "#fff", color: "#dc2626", fontSize: 13, fontWeight: 600,
                        cursor: deleting ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 7,
                      }}
                    >
                      {deleting
                        ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Đang xóa...</>
                        : <><Trash2 size={15} /> Xóa CV</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              width: 230, background: "linear-gradient(135deg,#1e40af,#2563eb)",
              borderRadius: 16, padding: 24, color: "#fff", flexShrink: 0,
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={32} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Mẹo cho bạn</div>
              <div style={{ fontSize: 12, lineHeight: 1.8, opacity: 0.9 }}>
                CV được lưu an toàn và chỉ chia sẻ khi bạn cho phép. Cập nhật thường xuyên giúp tăng <strong>65%</strong> cơ hội được nhà tuyển dụng chú ý.
              </div>
              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, opacity: 0.8, marginBottom: 6 }}>
                  <span>Trạng thái CV</span>
                  <span>{cvFilePath ? "✅ Đã lưu" : "⬜ Chưa có"}</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,.25)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: cvFilePath ? "100%" : "0%",
                    background: "#fff", borderRadius: 99, transition: "width .5s ease",
                  }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{
            background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16,
            padding: "24px 28px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 20,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                Bạn chưa hài lòng với CV hiện tại?
              </div>
              <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>
                Thử công cụ tạo hồ sơ trực tuyến của VietJob. Chúng tôi cung cấp mẫu thiết kế chuẩn ATS giúp vượt qua vòng lọc hồ sơ tự động dễ dàng.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{
                  background: "#fff", border: "1.5px solid #e5e7eb", color: "#374151",
                  borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                  Tìm hiểu thêm
                </button>
                <button
                  onClick={handleGoToProfile}
                  style={{
                    background: "#2563eb", color: "#fff", border: "none",
                    borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 7,
                  }}
                >
                  <FileText size={15} /> Tạo hồ sơ ngay →
                </button>
              </div>
            </div>
            <div style={{
              width: 130, height: 90, background: "linear-gradient(135deg,#1e3a5f,#2563eb)",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                width: 72, height: 82, background: "#fff", borderRadius: 6,
                padding: "8px 6px", display: "flex", flexDirection: "column", gap: 4, zIndex: 1, position: "relative",
              }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#2563eb", marginBottom: 2 }} />
                {[60, 80, 70, 85, 65, 75].map((w, i) => (
                  <div key={i} style={{ height: 4, background: i === 0 ? "#2563eb" : "#e5e7eb", borderRadius: 2, width: `${w}%` }} />
                ))}
              </div>
              <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 20, opacity: 0.9 }}>📄</div>
            </div>
          </div>

        </main>
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
      `}</style>
    </div>
  );
}