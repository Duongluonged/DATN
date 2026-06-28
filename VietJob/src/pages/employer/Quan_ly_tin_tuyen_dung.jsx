import { useState, useEffect } from "react";
import Sidebar_Empl from "../../components/common/Employer_c/Sidebar_empl";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl";

const API = "http://localhost:5000/api";

const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.id) return user.id;

        const token = user?.token || localStorage.getItem("token");
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload?.id) return payload.id;
        }
        return null;
    } catch { return null; }
};

const statusConfig = {
    active: { label: "Đang hiển thị", bg: "#e6f4ea", color: "#1a7f37", dot: "#1a7f37" },
    inactive: { label: "Đã ẩn", bg: "#fde8e8", color: "#c0392b", dot: "#e74c3c" },
    expired: { label: "Hết hạn", bg: "#fde8e8", color: "#c0392b", dot: "#e74c3c" },
    draft: { label: "Nháp", bg: "#fff3cd", color: "#856404", dot: "#f0ad4e" },
};

const EMPTY_FORM = {
    jobTitle: "", location: "", salaryRange: "", jobType: "Full-time",
    jobLevel: "", experience: "", skills: "", description: "", requirements: "", gender: "",
};

const inp = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #e0e0e0", fontSize: 13, boxSizing: "border-box",
    fontFamily: "inherit", outline: "none",
};
const lbl = { fontSize: 12, fontWeight: 600, color: "#444", display: "block", marginBottom: 4 };
const row2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 };

export default function Quan_ly_tin_tuyen_dung() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Tất cả");
    const [showModal, setShowModal] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const userId = getUserId();
    const tabs = ["Tất cả", "Đang hiển thị", "Đã ẩn", "Hết hạn"];

    const fetchJobs = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API}/jobs/employer/${userId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch {
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, [userId]);

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3000);
    };

    const openCreate = () => { setEditJob(null); setForm(EMPTY_FORM); setShowModal(true); };
    const openEdit = (job) => {
        setEditJob(job);
        setForm({
            jobTitle: job.JobTitle || "", location: job.Location || "",
            salaryRange: job.SalaryRange || "", jobType: job.JobType || "Full-time",
            jobLevel: job.JobLevel || "", experience: job.Experience || "",
            skills: job.Skills || "", description: job.Description || "",
            requirements: job.Requirements || "",
            gender: job.Gender || "",
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            showToast("Phiên làm việc hết hạn hoặc không tìm thấy ID người dùng. Vui lòng đăng nhập lại.", false);
            return;
        }
        setSaving(true);
        try {
            let res;
            if (editJob) {
                res = await fetch(`${API}/jobs/${editJob.JobID}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                    body: JSON.stringify({ ...form, isActive: 1 }),
                });
            } else {
                res = await fetch(`${API}/jobs/employer/${userId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
                    body: JSON.stringify(form),
                });
            }
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi");
            showToast(editJob ? "Cập nhật thành công!" : "Đăng tin thành công!");
            setShowModal(false);
            fetchJobs();
        } catch (err) {
            showToast(err.message, false);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm("Bạn có chắc muốn ẩn tin này?")) return;
        try {
            await fetch(`${API}/jobs/${jobId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            showToast("Đã ẩn tin tuyển dụng.");
            fetchJobs();
        } catch {
            showToast("Có lỗi xảy ra.", false);
        }
    };

    const filtered = jobs.filter((j) => {
        if (activeTab === "Tất cả") return true;
        const isExpired = j.Deadline && new Date(j.Deadline) < new Date();
        if (activeTab === "Đang hiển thị") return j.IsActive && !isExpired;
        if (activeTab === "Hết hạn") return isExpired;
        if (activeTab === "Đã ẩn") return !j.IsActive;
        return true;
    });

    const getStatus = (job) => {
        if (!job.IsActive) return statusConfig.inactive;
        if (job.Deadline && new Date(job.Deadline) < new Date()) return statusConfig.expired;
        return statusConfig.active;
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f5f6fa", color: "#1a1a2e" }}>
            <Sidebar_Empl />
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />
                <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Danh sách tin tuyển dụng</h1>
                            <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Quản lý và theo dõi các tin tuyển dụng của bạn.</p>
                        </div>
                        <button onClick={openCreate} style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                            + Đăng tin mới
                        </button>
                    </div>

                    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", overflow: "hidden" }}>
                        <div style={{ padding: "14px 20px", borderBottom: "1px solid #e8eaf0", display: "flex", gap: 4 }}>
                            {tabs.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", background: activeTab === tab ? "#2563eb" : "transparent", color: activeTab === tab ? "#fff" : "#555", fontWeight: activeTab === tab ? 600 : 400, fontSize: 13, transition: "all 0.15s" }}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Đang tải...</div>
                        ) : filtered.length === 0 ? (
                            <div style={{ padding: 40, textAlign: "center", color: "#aaa" }}>Chưa có tin tuyển dụng nào.</div>
                        ) : (
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: "#f8f9fc" }}>
                                        {["Tên công việc", "Loại hình", "Lương", "Trạng thái", "Ứng viên", "Hạn nộp", "Thao tác"].map((h) => (
                                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#888", fontWeight: 600, fontSize: 12, borderBottom: "1px solid #e8eaf0", whiteSpace: "nowrap" }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((job, idx) => {
                                        const sc = getStatus(job);
                                        return (
                                            <tr key={job.JobID} style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f0f0f5" : "none" }}
                                                onMouseEnter={e => e.currentTarget.style.background = "#f8f9fc"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                <td style={{ padding: "14px 16px" }}>
                                                    <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{job.JobTitle}</div>
                                                    <div style={{ fontSize: 12, color: "#aaa" }}>{job.Location}</div>
                                                </td>
                                                <td style={{ padding: "14px 16px", color: "#555" }}>{job.JobType || "—"}</td>
                                                <td style={{ padding: "14px 16px", color: "#555" }}>{job.SalaryRange || "Thỏa thuận"}</td>
                                                <td style={{ padding: "14px 16px" }}>
                                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: sc.bg, color: sc.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                                                        {sc.label}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "14px 16px" }}>
                                                    <div style={{ fontWeight: 600 }}>{job.ApplicantCount ?? 0}</div>
                                                    <div style={{ fontSize: 11, color: "#aaa" }}>ứng viên</div>
                                                </td>
                                                <td style={{ padding: "14px 16px", color: "#555" }}>
                                                    {job.Deadline ? new Date(job.Deadline).toLocaleDateString("vi-VN") : "—"}
                                                </td>
                                                <td style={{ padding: "14px 16px" }}>
                                                    <div style={{ display: "flex", gap: 6 }}>
                                                        <button onClick={() => openEdit(job)} style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #2563eb", background: "transparent", color: "#2563eb", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Sửa</button>
                                                        <button onClick={() => handleDelete(job.JobID)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #fde8e8", background: "#fde8e8", color: "#e74c3c", fontSize: 13, cursor: "pointer" }}>🗑</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}

                        <div style={{ padding: "14px 20px", borderTop: "1px solid #e8eaf0", fontSize: 13, color: "#888" }}>
                            Hiển thị {filtered.length} / tổng số {jobs.length} tin đăng
                        </div>
                    </div>
                </div>

                <footer style={{ borderTop: "1px solid #e8eaf0", padding: "10px 28px", display: "flex", justifyContent: "space-between", background: "#fff", fontSize: 11.5, color: "#aaa" }}>
                    <span>© 2024 VIETJOB. ALL RIGHTS RESERVED.</span>
                    <div style={{ display: "flex", gap: 16 }}>
                        <span style={{ cursor: "pointer" }}>Điều khoản</span>
                        <span style={{ cursor: "pointer" }}>Bảo mật</span>
                        <span style={{ cursor: "pointer" }}>Hỗ trợ</span>
                    </div>
                </footer>
            </main>

            {showModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eaf0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{editJob ? "Chỉnh sửa tin tuyển dụng" : "Đăng tin tuyển dụng mới"}</h2>
                                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#888" }}>Điền đầy đủ thông tin để thu hút ứng viên phù hợp.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888", lineHeight: 1 }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

                            <div>
                                <label style={lbl}>Tên vị trí tuyển dụng <span style={{ color: "red" }}>*</span></label>
                                <input required style={inp} placeholder="Ví dụ: Senior Frontend Developer" value={form.jobTitle}
                                    onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} />
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={lbl}>Địa điểm làm việc <span style={{ color: "red" }}>*</span></label>
                                    <input required style={inp} placeholder="Ví dụ: Hà Nội, TP.HCM" value={form.location}
                                        onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={lbl}>Loại hình công việc <span style={{ color: "red" }}>*</span></label>
                                    <select required style={inp} value={form.jobType} onChange={e => setForm(f => ({ ...f, jobType: e.target.value }))}>
                                        {["Full-time", "Part-time", "Remote", "Internship", "Contract"].map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={lbl}>Mức lương</label>
                                    <input style={inp} placeholder="Ví dụ: 15 - 25 triệu" value={form.salaryRange}
                                        onChange={e => setForm(f => ({ ...f, salaryRange: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={lbl}>Cấp bậc</label>
                                    <select style={inp} value={form.jobLevel} onChange={e => setForm(f => ({ ...f, jobLevel: e.target.value }))}>
                                        <option value="">-- Chọn cấp bậc --</option>
                                        {["Intern", "Junior", "Middle", "Senior", "Manager", "Director"].map(l => <option key={l}>{l}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={row2}>
                                <div>
                                    <label style={lbl}>Kinh nghiệm yêu cầu</label>
                                    <input style={inp} placeholder="Ví dụ: 2-3 năm" value={form.experience}
                                        onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={lbl}>Hạn nộp hồ sơ</label>
                                    <input type="date" style={inp} value={form.deadline}
                                        onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                                </div>
                            </div>

                            <div>
                                <label style={lbl}>Kỹ năng yêu cầu</label>
                                <input style={inp} placeholder="Ví dụ: React, Node.js, SQL (cách nhau bằng dấu phẩy)" value={form.skills}
                                    onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
                            </div>

                            <div>
                                <label style={lbl}>Yêu cầu giới tính</label>
                                <select style={inp} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                                    <option value="Không yêu cầu">Không yêu cầu</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Nam/Nữ">Nam / Nữ</option>
                                </select>
                            </div>

                            <div>
                                <label style={lbl}>Yêu cầu ứng viên</label>
                                <textarea rows={4} style={{ ...inp, resize: "vertical" }} placeholder="Mô tả các yêu cầu công việc, bằng cấp, kỹ năng cần thiết cho vị trí ứng tuyển..." value={form.requirements}
                                    onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} />
                            </div>

                            <div>
                                <label style={lbl}>Mô tả công việc</label>
                                <textarea rows={5} style={{ ...inp, resize: "vertical" }} placeholder="Mô tả chi tiết công việc, môi trường làm việc, phúc lợi..." value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 8, borderTop: "1px solid #f0f0f5" }}>
                                <button type="button" onClick={() => setShowModal(false)}
                                    style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", color: "#555", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                                    Hủy
                                </button>
                                <button type="submit" disabled={saving}
                                    style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: saving ? "#93c5fd" : "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                                    {saving ? "Đang lưu..." : editJob ? "Cập nhật tin" : "Đăng tin ngay"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && (
                <div style={{ position: "fixed", bottom: 28, right: 28, background: toast.ok ? "#1a7f37" : "#c0392b", color: "#fff", padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 9999 }}>
                    {toast.ok ? "✅" : "❌"} {toast.msg}
                </div>
            )}
        </div>
    );
}