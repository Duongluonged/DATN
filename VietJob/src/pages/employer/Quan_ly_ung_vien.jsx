import { useState, useEffect } from "react";
import { Phone, MapPin, Calendar, Building2, FileText, Inbox, AlertTriangle, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar_Empl from "../../components/common/Employer_c/Sidebar_empl";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl";

const API = "http://localhost:5000/api";

const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.id) return user.id;
        const token = user?.token;
        if (token) return JSON.parse(atob(token.split('.')[1]))?.id ?? null;
        return null;
    } catch { return null; }
};

const STATUS_CONFIG = {
    "Mới": { color: "#16a34a", bg: "#dcfce7" },
    "Đang xem xét": { color: "#d97706", bg: "#fef3c7" },
    "Đang chờ duyệt": { color: "#d97706", bg: "#fef3c7" },
    "Đã xem": { color: "#2563eb", bg: "#dbeafe" },
    "Phỏng vấn": { color: "#2563eb", bg: "#dbeafe" },
    "Từ chối": { color: "#dc2626", bg: "#fee2e2" },
    "Đã tuyển": { color: "#7c3aed", bg: "#ede9fe" },
};

const STATUS_OPTIONS = ["Mới", "Đang xem xét", "Phỏng vấn", "Đã tuyển", "Từ chối"];

const getStatusCfg = (s) => STATUS_CONFIG[s] || { color: "#555", bg: "#f0f0f5" };

const AVATAR_COLORS = ["#f97316", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1", "#f59e0b", "#10b981", "#3b82f6"];

function getInitials(name = "") {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name = "") {
    let hash = 0;
    for (let c of name) hash += c.charCodeAt(0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function Avatar({ name, size = 48 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: getAvatarColor(name), color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: size * 0.3, flexShrink: 0,
        }}>
            {getInitials(name)}
        </div>
    );
}

function StatusBadge({ status }) {
    const cfg = getStatusCfg(status);
    return (
        <span style={{
            background: cfg.bg, color: cfg.color, fontSize: 10, fontWeight: 700,
            padding: "3px 8px", borderRadius: 20, letterSpacing: 0.3, whiteSpace: "nowrap",
        }}>
            {status || "Mới"}
        </span>
    );
}

function InterviewScheduleModal({ app, onClose, onSubmit }) {
    const [date, setDate] = useState("");
    const [format, setFormat] = useState("Online (Google Meet / Zoom)");
    const [location, setLocation] = useState("");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!app) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!date) {
            alert("Vui lòng chọn thời gian phỏng vấn!");
            return;
        }
        setSubmitting(true);
        await onSubmit({
            interviewDate: new Date(date).toLocaleString("vi-VN", {
                year: "numeric", month: "2-digit", day: "2-digit",
                hour: "2-digit", minute: "2-digit"
            }),
            interviewFormat: format,
            interviewLocation: location || (format.startsWith("Online") ? "Sẽ gửi link họp sau" : "Tại văn phòng công ty"),
            interviewNote: note
        });
        setSubmitting(false);
    };

    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: "#fff", borderRadius: 20, width: "100%", maxWidth: 500,
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)", overflow: "hidden",
                fontFamily: "'Be Vietnam Pro', sans-serif"
            }}>
                <div style={{
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    padding: "20px 24px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={20} /> Lên lịch phỏng vấn</h3>
                        <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.9 }}>Ứng viên: <strong>{app.CandidateName}</strong></p>
                    </div>
                    <button onClick={onClose} style={{
                        background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
                        width: 28, height: 28, borderRadius: "50%", cursor: "pointer", fontSize: 16,
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: 10, fontSize: 13 }}>
                        Vị trí ứng tuyển: <strong style={{ color: "#2563eb" }}>{app.JobTitle}</strong>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Thời gian phỏng vấn *</label>
                        <input 
                            type="datetime-local" 
                            required
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            style={{
                                padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1",
                                fontSize: 13, outline: "none"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Hình thức phỏng vấn</label>
                        <select 
                            value={format}
                            onChange={e => setFormat(e.target.value)}
                            style={{
                                padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1",
                                fontSize: 13, background: "#fff", cursor: "pointer", outline: "none"
                            }}
                        >
                            <option value="Online (Google Meet / Zoom)">Online (Google Meet / Zoom)</option>
                            <option value="Trực tiếp tại văn phòng">Trực tiếp tại văn phòng</option>
                            <option value="Phỏng vấn qua điện thoại">Phỏng vấn qua điện thoại</option>
                        </select>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
                            {format.startsWith("Online") ? "Link phòng họp (Zoom/Meet)" : "Địa điểm phỏng vấn"}
                        </label>
                        <input 
                            type="text"
                            placeholder={format.startsWith("Online") ? "Dán link Google Meet hoặc Zoom tại đây..." : "Nhập địa chỉ văn phòng công ty..."}
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            style={{
                                padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1",
                                fontSize: 13, outline: "none"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Ghi chú gửi ứng viên (nếu có)</label>
                        <textarea 
                            rows={3}
                            placeholder="Ví dụ: Vui lòng chuẩn bị CV bản cứng và trang phục lịch sự..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            style={{
                                padding: "10px 14px", borderRadius: 10, border: "1px solid #cbd5e1",
                                fontSize: 13, outline: "none", resize: "none"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end" }}>
                        <button type="button" onClick={onClose} style={{
                            padding: "10px 18px", borderRadius: 10, border: "1px solid #cbd5e1",
                            background: "#fff", color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer"
                        }}>Hủy</button>
                        
                        <button type="submit" disabled={submitting} style={{
                            padding: "10px 20px", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff",
                            fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                        }}>
                            {submitting ? "Đang gửi..." : "🚀 Gửi lời mời & Lên lịch"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function CandidateDetailModal({ app, onClose, onStatusChange }) {
    if (!app) return null;
    const cfg = getStatusCfg(app.Status);

    return (
        <div onClick={onClose} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
            zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: "#fff", borderRadius: 18, width: "100%", maxWidth: 560,
                maxHeight: "90vh", overflowY: "auto",
                boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            }}>
                <div style={{
                    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                    borderRadius: "18px 18px 0 0", padding: "24px 24px 20px",
                    color: "#fff", position: "relative",
                }}>
                    <button onClick={onClose} style={{
                        position: "absolute", top: 14, right: 14,
                        background: "rgba(255,255,255,0.2)", border: "none",
                        borderRadius: "50%", width: 30, height: 30, fontSize: 16,
                        cursor: "pointer", color: "#fff", display: "flex",
                        alignItems: "center", justifyContent: "center",
                    }}>×</button>

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: "50%",
                            background: "rgba(255,255,255,0.25)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 22, fontWeight: 800, flexShrink: 0,
                        }}>
                            {getInitials(app.CandidateName)}
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{app.CandidateName}</div>
                            <div style={{ fontSize: 13, opacity: 0.85 }}>Ứng tuyển: <strong>{app.JobTitle}</strong></div>
                            <span style={{
                                display: "inline-block", marginTop: 6,
                                background: cfg.bg, color: cfg.color,
                                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                            }}>{app.Status || "Mới"}</span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 18 }}>

                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Thông tin liên hệ</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {[[
                                { icon: <Phone size={12}/>, label: "Số điện thoại", value: app.Phone || "Chưa cung cấp" },
                                { icon: <MapPin size={12}/>, label: "Địa điểm", value: app.City || "Chưa cung cấp" },
                            ], [
                                { icon: <Calendar size={12}/>, label: "Ngày ứng tuyển", value: app.AppliedAt ? new Date(app.AppliedAt).toLocaleDateString("vi-VN") : "—" },
                                { icon: <Building2 size={12}/>, label: "Vị trí", value: app.JobTitle },
                            ]].flat().map(({ icon, label, value }) => (
                                <div key={label} style={{ background: "#f8f9fc", borderRadius: 10, padding: "10px 12px" }}>
                                    <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, marginBottom: 3 }}>{icon} {label}</div>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Hồ sơ CV</div>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 12,
                            background: "#eff6ff", border: "1.5px solid #bfdbfe",
                            borderRadius: 10, padding: "12px 16px",
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 8,
                                background: "#2563eb", color: "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18, flexShrink: 0,
                            }}><FileText size={20}/></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {app.CV_Path || "Chưa có file CV"}
                                </div>
                                <div style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>Tệp đính kèm</div>
                            </div>
                        </div>
                    </div>

                    {app.CoverLetter && (
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Thư giới thiệu</div>
                            <div style={{
                                background: "#f8f9fc", borderRadius: 10, padding: "14px 16px",
                                fontSize: 13, color: "#444", lineHeight: 1.7,
                                borderLeft: "3px solid #2563eb",
                                whiteSpace: "pre-wrap",
                            }}>
                                {app.CoverLetter}
                            </div>
                        </div>
                    )}

                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Cập nhật trạng thái</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {STATUS_OPTIONS.map(s => {
                                const sc = getStatusCfg(s);
                                const isActive = app.Status === s;
                                return (
                                    <button key={s}
                                        onClick={() => onStatusChange(app.ApplicationID, s)}
                                        style={{
                                            padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                                            cursor: "pointer", transition: "all 0.15s",
                                            border: `1.5px solid ${isActive ? sc.color : "#e0e0e0"}`,
                                            background: isActive ? sc.bg : "#fff",
                                            color: isActive ? sc.color : "#555",
                                        }}
                                    >{s}</button>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function CandidateCard({ app, onStatusChange, onViewDetail, onChat }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            onClick={() => onViewDetail(app)}
            style={{
                background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0",
                padding: "18px 18px 14px", display: "flex", flexDirection: "column", gap: 10,
                transition: "box-shadow 0.15s, transform 0.12s", cursor: "pointer", position: "relative",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(37,99,235,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <Avatar name={app.CandidateName} />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{app.CandidateName}</span>
                        <StatusBadge status={app.Status} />
                    </div>
                    <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 500, marginTop: 2 }}>{app.JobTitle}</div>
                    {app.City && <div style={{ fontSize: 11, color: "#aaa", marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10}/> {app.City}</div>}
                    {app.Phone && <div style={{ fontSize: 11, color: "#888", marginTop: 1, display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={10}/> {app.Phone}</div>}
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11.5, color: "#aaa" }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Calendar size={12}/> {app.AppliedAt ? new Date(app.AppliedAt).toLocaleDateString("vi-VN") : "—"}</span>
                </div>
                <div style={{ display: "flex", gap: 6, position: "relative" }}>
                    {app.CandidateUserId && (
                        <button
                            onClick={e => { e.stopPropagation(); onChat(app.CandidateUserId); }}
                            style={{ fontSize: 11.5, color: "#0284c7", background: "#e0f2fe", border: "1px solid #bae6fd", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                            Nhắn tin
                        </button>
                    )}
                    <button
                        onClick={e => { e.stopPropagation(); onViewDetail(app); }}
                        style={{ fontSize: 11.5, color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                        Xem hồ sơ
                    </button>
                    <div style={{ position: "relative" }}>
                        <button
                            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                            style={{ fontSize: 11.5, color: "#555", background: "#f0f0f5", border: "1px solid #e0e0e0", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                            ▾
                        </button>
                        {menuOpen && (
                            <div style={{
                                position: "absolute", right: 0, top: "110%", background: "#fff",
                                border: "1px solid #e8eaf0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                                zIndex: 50, minWidth: 150, overflow: "hidden",
                            }}>
                                {STATUS_OPTIONS.map(s => {
                                    const cfg = getStatusCfg(s);
                                    return (
                                        <div key={s}
                                            onClick={e => { e.stopPropagation(); onStatusChange(app.ApplicationID, s); setMenuOpen(false); }}
                                            style={{
                                                padding: "9px 14px", fontSize: 12, fontWeight: 600,
                                                color: cfg.color, cursor: "pointer",
                                                background: app.Status === s ? cfg.bg : "transparent",
                                                borderBottom: "1px solid #f0f0f5",
                                                transition: "background 0.1s",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = cfg.bg}
                                            onMouseLeave={e => e.currentTarget.style.background = app.Status === s ? cfg.bg : "transparent"}
                                        >
                                            {s}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {app.CoverLetter && (
                <div style={{ fontSize: 11.5, color: "#666", background: "#f8f9fc", borderRadius: 8, padding: "8px 10px", lineHeight: 1.5, borderLeft: "3px solid #2563eb" }}>
                    "{app.CoverLetter.slice(0, 100)}{app.CoverLetter.length > 100 ? "..." : ""}"
                </div>
            )}
        </div>
    );
}

export default function Quan_ly_ung_vien() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterJob, setFilterJob] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [toast, setToast] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const [schedulingApp, setSchedulingApp] = useState(null);
    const [rejectingApp, setRejectingApp] = useState(null);

    const userId = getUserId();

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChatWithCandidate = (candidateUserId) => {
        if (!candidateUserId) {
            showToast("Ứng viên này nộp đơn tự do hoặc chưa kích hoạt tài khoản.", false);
            return;
        }
        navigate(`/employer/Quan_ly_tin_nhan?partnerId=${candidateUserId}`);
    };

    const fetchApplications = async () => {
        if (!userId) { setLoading(false); return; }
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterJob !== "all") params.append("jobId", filterJob);
            if (filterStatus !== "all") params.append("status", filterStatus);

            const res = await fetch(`${API}/applications/employer/${userId}?${params}`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user") || "{}")?.token}` }
            });
            const data = await res.json();
            setApplications(Array.isArray(data) ? data : []);

            const jobsRes = await fetch(`${API}/jobs/employer/${userId}`, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("user") || "{}")?.token}` }
            });
            const jobsData = await jobsRes.json();
            setJobs(Array.isArray(jobsData) ? jobsData : []);
        } catch {
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, [userId, filterJob, filterStatus]);

    const handleStatusChange = async (applicationId, newStatus, scheduleData = null) => {
        const app = applications.find(a => a.ApplicationID === applicationId);
        if (!app) return;

        if (newStatus === "Phỏng vấn" && !scheduleData) {
            setSchedulingApp(app);
            return;
        }
        if (newStatus === "Từ chối" && !scheduleData) {
            setRejectingApp(app);
            return;
        }

        try {
            const res = await fetch(`${API}/applications/${applicationId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("user") || "{}")?.token}`
                },
                body: JSON.stringify({ status: newStatus, ...scheduleData }),
            });
            if (!res.ok) throw new Error();
            showToast(`Đã cập nhật trạng thái thành "${newStatus}" và gửi mail thành công!`);
            
            setApplications(prev => prev.map(a =>
                a.ApplicationID === applicationId ? { ...a, Status: newStatus } : a
            ));

            if (selectedApp && selectedApp.ApplicationID === applicationId) {
                setSelectedApp(prev => prev ? { ...prev, Status: newStatus } : null);
            }
        } catch {
            showToast("Có lỗi khi cập nhật trạng thái", false);
        }
    };

    const statusCounts = applications.reduce((acc, a) => {
        acc[a.Status] = (acc[a.Status] || 0) + 1;
        return acc;
    }, {});

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f5f6fa", color: "#1a1a2e" }}>
            <Sidebar_Empl />

            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />

                <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Danh sách ứng viên</h1>
                            <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
                                Tổng cộng <strong>{applications.length}</strong> hồ sơ ứng tuyển từ các tin đăng của bạn.
                            </p>
                        </div>
                        <button onClick={fetchApplications} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, color: "#555", cursor: "pointer", fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <RefreshCw size={14}/> Làm mới
                        </button>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                        {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
                            <div key={s} style={{ background: cfg.bg, color: cfg.color, padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                {s}: {statusCounts[s] || 0}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 10, marginBottom: 22, alignItems: "flex-end", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <label style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Vị trí tuyển dụng</label>
                            <select value={filterJob} onChange={e => setFilterJob(e.target.value)}
                                style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 13, color: "#555", background: "#fff", minWidth: 180, cursor: "pointer" }}>
                                <option value="all">Tất cả vị trí</option>
                                {jobs.map(j => <option key={j.JobID} value={j.JobID}>{j.JobTitle}</option>)}
                            </select>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            <label style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Trạng thái hồ sơ</label>
                            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 13, color: "#555", background: "#fff", minWidth: 160, cursor: "pointer" }}>
                                <option value="all">Tất cả trạng thái</option>
                                {Object.keys(STATUS_CONFIG).map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: 60, color: "#aaa", fontSize: 14 }}>Đang tải dữ liệu...</div>
                    ) : applications.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
                            <div style={{ fontSize: 40, marginBottom: 12, display: 'flex', justifyContent: 'center' }}><Inbox size={48} className="text-gray-300"/></div>
                            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Chưa có hồ sơ ứng tuyển nào</div>
                            <div style={{ fontSize: 13 }}>Ứng viên ứng tuyển sẽ xuất hiện tại đây.</div>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                            {applications.map(app => (
                                <CandidateCard key={app.ApplicationID} app={app} onStatusChange={handleStatusChange} onViewDetail={setSelectedApp} onChat={handleChatWithCandidate} />
                            ))}
                        </div>
                    )}

                    {applications.length > 0 && (
                        <div style={{ marginTop: 20, fontSize: 13, color: "#888", textAlign: "center" }}>
                            Hiển thị {applications.length} hồ sơ
                        </div>
                    )}
                </div>
            </main>

            {selectedApp && (
                <CandidateDetailModal
                    app={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onStatusChange={(appId, newStatus) => {
                        handleStatusChange(appId, newStatus);
                    }}
                />
            )}

            {schedulingApp && (
                <InterviewScheduleModal
                    app={schedulingApp}
                    onClose={() => setSchedulingApp(null)}
                    onSubmit={async (scheduleData) => {
                        await handleStatusChange(schedulingApp.ApplicationID, "Phỏng vấn", scheduleData);
                        setSchedulingApp(null);
                    }}
                />
            )}

            {rejectingApp && (
                <div onClick={() => setRejectingApp(null)} style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                    zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)", overflow: "hidden",
                        fontFamily: "'Be Vietnam Pro', sans-serif"
                    }}>
                        <div style={{ padding: "24px 24px 20px", textAlign: "center" }}>
                            <span style={{ fontSize: 44, display: 'flex', justifyContent: 'center' }}><AlertTriangle size={48} className="text-yellow-500"/></span>
                            <h3 style={{ margin: "14px 0 8px", fontSize: 17, fontWeight: 700, color: "#1e293b" }}>Xác nhận từ chối</h3>
                            <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                                Bạn có chắc chắn muốn từ chối ứng viên <strong>{rejectingApp.CandidateName}</strong> cho vị trí <strong>{rejectingApp.JobTitle}</strong>?<br/>
                                Hệ thống sẽ tự động gửi email thông báo kết quả từ chối cho ứng viên.
                            </p>
                        </div>
                        
                        <div style={{ background: "#f8fafc", padding: "16px 24px", display: "flex", gap: 12, justifyContent: "flex-end" }}>
                            <button onClick={() => setRejectingApp(null)} style={{
                                padding: "8px 16px", borderRadius: 8, border: "1px solid #cbd5e1",
                                background: "#fff", color: "#475569", fontSize: 12, fontWeight: 600, cursor: "pointer"
                            }}>Hủy</button>
                            <button onClick={() => {
                                handleStatusChange(rejectingApp.ApplicationID, "Từ chối", { confirmed: true });
                                setRejectingApp(null);
                            }} style={{
                                padding: "8px 16px", borderRadius: 8, border: "none",
                                background: "#dc2626", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer"
                            }}>Xác nhận từ chối</button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div style={{
                    position: "fixed", bottom: 28, right: 28,
                    background: toast.ok ? "#1a7f37" : "#c0392b", color: "#fff",
                    padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 9999,
                }}>
                    {toast.ok ? <CheckCircle2 size={16}/> : <XCircle size={16}/>} {toast.msg}
                </div>
            )}
        </div>
    );
}