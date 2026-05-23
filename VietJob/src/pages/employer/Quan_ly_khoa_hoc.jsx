import { useState, useEffect } from "react";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl.jsx";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl.jsx";

const API = "http://localhost:5000/api";

// Lấy userId từ localStorage
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

const STATUS_CONFIG = {
    "Đang bán": { label: "ĐANG BÁN", color: "#16a34a", bg: "#dcfce7" },
    "Nháp":     { label: "NHÁP", color: "#d97706", bg: "#fef3c7" },
    "Đã ẩn":    { label: "ĐÃ ẨN", color: "#6b7280", bg: "#f3f4f6" },
};

const getStatusCfg = (status) => STATUS_CONFIG[status] || { label: "KHÁC", color: "#4f46e5", bg: "#eef2ff" };

export default function Quan_Ly_Khoa_Hoc() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Tất cả");
    const [toast, setToast] = useState(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [form, setForm] = useState({ tieuDe: "", moTa: "", trangThai: "Nháp" });
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const userId = getUserId();

    // Show toast message
    const showToast = (message, success = true) => {
        setToast({ message, success });
        setTimeout(() => setToast(null), 3000);
    };

    // Fetch courses
    const fetchCourses = async () => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API}/courses/employer/${userId}`);
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCourses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi lấy danh sách khóa học:", error);
            showToast("Không thể tải danh sách khóa học", false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [userId]);

    // Handle Open Create Modal
    const handleOpenCreate = () => {
        setModalMode("create");
        setForm({ tieuDe: "", moTa: "", trangThai: "Nháp" });
        setFormErrors({});
        setShowModal(true);
    };

    // Handle Open Edit Modal
    const handleOpenEdit = (course) => {
        setModalMode("edit");
        setSelectedCourse(course);
        setForm({
            tieuDe: course.TieuDe || "",
            moTa: course.MoTa || "",
            trangThai: course.TrangThai || "Nháp",
        });
        setFormErrors({});
        setShowModal(true);
    };

    // Form validation
    const validate = () => {
        const errors = {};
        if (!form.tieuDe.trim()) errors.tieuDe = "Tiêu đề khóa học không được để trống";
        if (form.tieuDe.trim().length < 5) errors.tieuDe = "Tiêu đề quá ngắn (tối thiểu 5 ký tự)";
        return errors;
    };

    // Save course (Create or Update)
    const handleSaveCourse = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSaving(true);
        try {
            let url = "";
            let method = "";
            if (modalMode === "create") {
                url = `${API}/courses/employer/${userId}`;
                method = "POST";
            } else {
                url = `${API}/courses/${selectedCourse.Id}?userId=${userId}`;
                method = "PUT";
            }

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to save");
            }

            showToast(modalMode === "create" ? "🎉 Đăng khóa học mới thành công!" : "✏️ Cập nhật khóa học thành công!");
            setShowModal(false);
            fetchCourses();
        } catch (error) {
            console.error("Lỗi lưu khóa học:", error);
            showToast(error.message || "Có lỗi xảy ra, vui lòng thử lại", false);
        } finally {
            setSaving(false);
        }
    };

    // Delete course
    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;

        try {
            const res = await fetch(`${API}/courses/${courseId}?userId=${userId}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to delete");
            }

            showToast("🗑️ Đã xóa khóa học thành công!");
            fetchCourses();
        } catch (error) {
            console.error("Lỗi xóa khóa học:", error);
            showToast(error.message || "Không thể xóa khóa học này", false);
        }
    };

    // Filter courses based on active tab
    const filteredCourses = courses.filter((c) => {
        if (activeTab === "Tất cả") return true;
        return c.TrangThai === activeTab;
    });

    // Counts for tabs
    const tabCounts = {
        "Tất cả": courses.length,
        "Đang bán": courses.filter(c => c.TrangThai === "Đang bán").length,
        "Nháp": courses.filter(c => c.TrangThai === "Nháp").length,
        "Đã ẩn": courses.filter(c => c.TrangThai === "Đã ẩn").length,
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f5f6fa", color: "#1a1a2e" }}>
            {/* Sidebar */}
            <Sidebar_empl />

            {/* Main */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* Header */}
                <Topbar_empl />

                <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                    {/* Title */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div>
                            <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Quản lý khóa học</h1>
                            <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Theo dõi và tối ưu hóa hiệu suất các chương trình đào tạo của bạn.</p>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={fetchCourses} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, color: "#555", cursor: "pointer", fontWeight: 500 }}>
                                🔄 Làm mới
                            </button>
                            <button onClick={handleOpenCreate} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                + Đăng khóa học mới
                            </button>
                        </div>
                    </div>

                    {/* Stats summary cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 14, marginBottom: 22 }}>
                        <div style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)", borderRadius: 14, padding: "20px 22px", color: "#fff", position: "relative", overflow: "hidden" }}>
                            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>📚 Tổng khóa học đã tạo</div>
                            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.15 }}>{courses.length} Khóa học</div>
                            <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "3px 10px", fontSize: 11.5, fontWeight: 600 }}>
                                Phổ biến kiến thức chất lượng
                            </div>
                            <div style={{ position: "absolute", right: -16, top: -16, width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
                        </div>
                        {[
                            { label: "Đang hoạt động", value: tabCounts["Đang bán"], icon: "🟢", color: "#16a34a" },
                            { label: "Bản nháp", value: tabCounts["Nháp"], icon: "✏️", color: "#d97706" },
                            { label: "Đã tạm ẩn", value: tabCounts["Đã ẩn"], icon: "🔒", color: "#6b7280" },
                        ].map((s) => (
                            <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #e8eaf0" }}>
                                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                                <div style={{ fontSize: 11.5, color: "#aaa", marginBottom: 4 }}>{s.label}</div>
                                <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs + Sorting bar */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", gap: 2, background: "#f1f3f8", borderRadius: 10, padding: 4 }}>
                            {["Tất cả", "Đang bán", "Nháp", "Đã ẩn"].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                    padding: "6px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                                    background: activeTab === tab ? "#fff" : "transparent",
                                    color: activeTab === tab ? "#1a1a2e" : "#888",
                                    fontWeight: activeTab === tab ? 600 : 400, fontSize: 13,
                                    boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                                    transition: "all 0.15s",
                                }}>
                                    {tab} <span style={{ fontSize: 11, color: activeTab === tab ? "#2563eb" : "#bbb" }}>({tabCounts[tab] || 0})</span>
                                </button>
                            ))}
                        </div>
                        <div style={{ fontSize: 13, color: "#888" }}>
                            Hiển thị: <strong>{filteredCourses.length}</strong> khóa học
                        </div>
                    </div>

                    {/* Course List */}
                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
                            <div style={{ fontSize: 16 }}>Đang tải dữ liệu...</div>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0" }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: "#555" }}>Không có khóa học nào để hiển thị</div>
                            <p style={{ fontSize: 13, color: "#888", margin: "6px 0 16px" }}>Hãy bắt đầu bằng việc đăng khóa học đầu tiên của bạn để tiếp cận học viên!</p>
                            <button onClick={handleOpenCreate} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                + Đăng khóa học ngay
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {filteredCourses.map((c) => {
                                const cfg = getStatusCfg(c.TrangThai);
                                return (
                                    <div key={c.Id} style={{
                                        background: "#fff", borderRadius: 12, border: "1px solid #e8eaf0",
                                        display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
                                        transition: "all 0.2s"
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                                    >
                                        <div style={{ width: 110, height: 72, borderRadius: 8, flexShrink: 0, background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: 28, opacity: 0.8 }}>🎓</span>
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#1a1a2e" }}>{c.TieuDe}</h3>
                                                <span style={{ background: cfg.bg, color: cfg.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {c.MoTa || "Chưa có mô tả ngắn gọn cho khóa học này."}
                                            </p>
                                            <div style={{ fontSize: 11.5, color: "#aaa" }}>
                                                📅 Đăng ngày: {c.CreationTime ? new Date(c.CreationTime).toLocaleDateString("vi-VN") : "—"}
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                            <button onClick={() => handleOpenEdit(c)} style={{
                                                height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #e0e0e0",
                                                background: "#fff", color: "#555", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                                                display: "flex", alignItems: "center", gap: 4
                                            }}>
                                                ✏️ Sửa
                                            </button>
                                            <button onClick={() => handleDeleteCourse(c.Id)} style={{
                                                height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #fee2e2",
                                                background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                                                display: "flex", alignItems: "center", gap: 4
                                            }}>
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* CREATE / EDIT COURSE MODAL */}
            {showModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
                    backdropFilter: "blur(4px)",
                }}>
                    <div style={{
                        background: "#fff", borderRadius: 16, width: "100%", maxWidth: 520,
                        boxShadow: "0 24px 60px rgba(0,0,0,0.15)", overflow: "hidden"
                    }}>
                        {/* Header */}
                        <div style={{
                            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                            padding: "20px 24px", color: "#fff", display: "flex",
                            justifyContent: "space-between", alignItems: "center"
                        }}>
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                                {modalMode === "create" ? "📚 Đăng khóa học mới" : "✏️ Chỉnh sửa khóa học"}
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{
                                background: "rgba(255,255,255,0.2)", border: "none",
                                borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
                                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"
                            }}>✕</button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveCourse} style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Tiêu đề khóa học <span style={{ color: "#ef4444" }}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: Lập trình Python ứng dụng AI nâng cao"
                                    value={form.tieuDe}
                                    onChange={e => setForm({ ...form, tieuDe: e.target.value })}
                                    style={{
                                        border: `1.5px solid ${formErrors.tieuDe ? "#ef4444" : "#e2e8f0"}`,
                                        borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none"
                                    }}
                                />
                                {formErrors.tieuDe && <span style={{ fontSize: 12, color: "#ef4444" }}>⚠️ {formErrors.tieuDe}</span>}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Mô tả ngắn khóa học</label>
                                <textarea
                                    placeholder="Mô tả tóm tắt nội dung học viên sẽ được trang bị..."
                                    rows={4}
                                    value={form.moTa}
                                    onChange={e => setForm({ ...form, moTa: e.target.value })}
                                    style={{
                                        border: "1.5px solid #e2e8f0", borderRadius: 8,
                                        padding: "10px 12px", fontSize: 13.5, outline: "none", resize: "vertical"
                                    }}
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Trạng thái khóa học</label>
                                <select
                                    value={form.trangThai}
                                    onChange={e => setForm({ ...form, trangThai: e.target.value })}
                                    style={{
                                        border: "1.5px solid #e2e8f0", borderRadius: 8,
                                        padding: "10px 12px", fontSize: 13.5, outline: "none",
                                        background: "#fff", cursor: "pointer"
                                    }}
                                >
                                    <option value="Nháp">Bản nháp (Chưa bán)</option>
                                    <option value="Đang bán">Đang hoạt động (Đang bán)</option>
                                    <option value="Đã ẩn">Ẩn khóa học</option>
                                </select>
                            </div>

                            {/* Footer Actions */}
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{
                                    padding: "9px 18px", borderRadius: 8, border: "1px solid #e2e8f0",
                                    background: "#fff", color: "#555", fontSize: 13, fontWeight: 600, cursor: "pointer"
                                }}>
                                    Hủy bỏ
                                </button>
                                <button type="submit" disabled={saving} style={{
                                    padding: "9px 22px", borderRadius: 8, border: "none",
                                    background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600,
                                    cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1
                                }}>
                                    {saving ? "Đang lưu..." : "Lưu khóa học"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Toast Alert */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 28, right: 28,
                    background: toast.success ? "#16a34a" : "#dc2626", color: "#fff",
                    padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 9999,
                    animation: "fadeIn 0.2s ease"
                }}>
                    {toast.success ? "✅" : "⚠️"} {toast.message}
                </div>
            )}
        </div>
    );
}