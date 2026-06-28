import { useState, useEffect } from "react";
import { BookOpen, GraduationCap, Clock, Book, User, Banknote, Edit3, Trash2, CheckCircle2, AlertTriangle, Plus } from "lucide-react";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl.jsx";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl.jsx";

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

const STATUS_CONFIG = {
    "Đang bán":  { label: "ĐANG BÁN", color: "#16a34a", bg: "#dcfce7" },
    "Nháp":      { label: "NHÁP", color: "#6b7280", bg: "#f3f4f6" },
    "Chờ duyệt": { label: "CHỜ DUYỆT", color: "#d97706", bg: "#fef3c7" },
    "Đã ẩn":     { label: "ĐÃ ẨN", color: "#ef4444", bg: "#fee2e2" },
};

const getStatusCfg = (status) => STATUS_CONFIG[status] || { label: "KHÁC", color: "#4f46e5", bg: "#eef2ff" };

const categoryOptions = [
    { value: "web", label: "Lập trình Web" },
    { value: "mobile", label: "Lập trình Mobile" },
    { value: "data-ai", label: "Dữ liệu & AI" },
    { value: "design-gamedev", label: "Thiết kế & Gamedev" }
];

const levelOptions = [
    { value: "Mọi trình độ", label: "Mọi trình độ" },
    { value: "Cơ bản", label: "Cơ bản" },
    { value: "Trung cấp", label: "Trung cấp" },
    { value: "Nâng cao", label: "Nâng cao" }
];

export default function Quan_Ly_Khoa_Hoc() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Tất cả");
    const [toast, setToast] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [form, setForm] = useState({
        tieuDe: "",
        moTa: "",
        trangThai: "Chờ duyệt",
        category: "web",
        duration: "45 giờ",
        lecturesCount: 50,
        level: "Mọi trình độ",
        instructorName: "Đỗ Phương Thảo",
        instructorRole: "Đối tác Đào tạo VietJob",
        price: 1500000,
        oldPrice: 3000000
    });
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);

    const userId = getUserId();

    const showToast = (message, success = true) => {
        setToast({ message, success });
        setTimeout(() => setToast(null), 3000);
    };

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

    const handleOpenCreate = () => {
        setModalMode("create");
        setForm({
            tieuDe: "",
            moTa: "",
            trangThai: "Chờ duyệt",
            category: "web",
            duration: "45 giờ",
            lecturesCount: 50,
            level: "Mọi trình độ",
            instructorName: "Đỗ Phương Thảo",
            instructorRole: "Đối tác Đào tạo VietJob",
            price: 1500000,
            oldPrice: 3000000
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleOpenEdit = (course) => {
        setModalMode("edit");
        setSelectedCourse(course);
        setForm({
            tieuDe: course.TieuDe || "",
            moTa: course.MoTa || "",
            trangThai: course.TrangThai || "Chờ duyệt",
            category: course.Category || "web",
            duration: course.Duration || "45 giờ",
            lecturesCount: course.LecturesCount || 50,
            level: course.Level || "Mọi trình độ",
            instructorName: course.InstructorName || "Đỗ Phương Thảo",
            instructorRole: course.InstructorRole || "Đối tác Đào tạo VietJob",
            price: course.Price || 1500000,
            oldPrice: course.OldPrice || 3000000
        });
        setFormErrors({});
        setShowModal(true);
    };

    const validate = () => {
        const errors = {};
        if (!form.tieuDe.trim()) errors.tieuDe = "Tiêu đề khóa học không được để trống";
        if (form.tieuDe.trim().length < 5) errors.tieuDe = "Tiêu đề quá ngắn (tối thiểu 5 ký tự)";
        if (!form.instructorName.trim()) errors.instructorName = "Tên giảng viên không được để trống";
        if (!form.duration.trim()) errors.duration = "Thời lượng không được để trống";
        if (!form.lecturesCount || form.lecturesCount <= 0) errors.lecturesCount = "Số bài học phải lớn hơn 0";
        if (form.price === undefined || form.price === "") errors.price = "Học phí khuyến mãi không được trống";
        return errors;
    };

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

            showToast(modalMode === "create" ? "Đăng khóa học mới thành công!" : "Cập nhật khóa học thành công!");
            setShowModal(false);
            fetchCourses();
        } catch (error) {
            console.error("Lỗi lưu khóa học:", error);
            showToast(error.message || "Có lỗi xảy ra, vui lòng thử lại", false);
        } finally {
            setSaving(false);
        }
    };

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

            showToast("Đã xóa khóa học thành công!");
            fetchCourses();
        } catch (error) {
            console.error("Lỗi xóa khóa học:", error);
            showToast(error.message || "Không thể xóa khóa học này", false);
        }
    };

    const filteredCourses = courses.filter((c) => {
        if (activeTab === "Tất cả") return true;
        if (activeTab === "Đang bán") return c.TrangThai === "Đang bán";
        if (activeTab === "Chờ duyệt") return c.TrangThai === "Chờ duyệt";
        if (activeTab === "Nháp") return c.TrangThai === "Nháp";
        if (activeTab === "Đã ẩn") return c.TrangThai === "Đã ẩn";
        return true;
    });

    return (
        <div style={{ display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
            <Sidebar_empl />

            <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <Topbar_empl />

                <div style={{ padding: "30px 40px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "between", alignItems: "center", marginBottom: 28, gap: 16 }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Quản Lý Khoá Học</h1>
                            <p style={{ margin: "4px 0 0", fontSize: 13.5, color: "#64748b" }}>Đăng tải và tùy chỉnh lộ trình học tập tiếp cận hàng ngàn học viên VietJob.</p>
                        </div>
                        <button onClick={handleOpenCreate} style={{
                            padding: "10px 22px", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff",
                            fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                            boxShadow: "0 4px 12px rgba(37,99,235,0.2)"
                        }}>
                            <Plus size={16} /> Đăng khóa học mới
                        </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", marginBottom: 20 }}>
                        <div style={{ display: "flex", gap: 8 }}>
                            {["Tất cả", "Đang bán", "Chờ duyệt", "Nháp", "Đã ẩn"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: "12px 20px", fontSize: 13.5, fontWeight: activeTab === tab ? 700 : 500,
                                        color: activeTab === tab ? "#2563eb" : "#64748b", border: "none", background: "none",
                                        borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
                                        cursor: "pointer", transition: "all 0.15s"
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600 }}>
                            Hiển thị: <strong>{filteredCourses.length}</strong> khóa học
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
                            <div style={{ fontSize: 16 }}>Đang tải dữ liệu...</div>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0" }}>
                            <div style={{ fontSize: 48, marginBottom: 12, display: 'flex', justifyContent: 'center' }}><BookOpen size={48} className="text-gray-400" /></div>
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
                                            <span style={{ display: 'flex' }}><GraduationCap size={28} className="text-white opacity-80" /></span>
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
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", fontSize: 11, color: "#888" }}>
                                                <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Clock size={12}/> {c.Duration || "45 giờ"}</span>
                                                <span>•</span>
                                                <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Book size={12}/> {c.LecturesCount || 50} bài học</span>
                                                <span>•</span>
                                                <span style={{display: 'flex', alignItems: 'center', gap: 4}}><User size={12}/> GV: {c.InstructorName || "Đỗ Phương Thảo"}</span>
                                                <span>•</span>
                                                <span style={{ color: "#2563eb", fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}><Banknote size={12}/> {c.Price ? c.Price.toLocaleString() : "0"}đ</span>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                            <button onClick={() => handleOpenEdit(c)} style={{
                                                height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #e0e0e0",
                                                background: "#fff", color: "#555", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                                                display: "flex", alignItems: "center", gap: 4
                                            }}>
                                                <Edit3 size={14}/> Sửa
                                            </button>
                                            <button onClick={() => handleDeleteCourse(c.Id)} style={{
                                                height: 32, padding: "0 12px", borderRadius: 8, border: "1px solid #fee2e2",
                                                background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: 12.5, fontWeight: 600,
                                                display: "flex", alignItems: "center", gap: 4
                                            }}>
                                                <Trash2 size={14}/> Xóa
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {showModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
                    backdropFilter: "blur(4px)",
                }}>
                    <div style={{
                        background: "#fff", borderRadius: 16, width: "90%", maxWidth: 640,
                        boxShadow: "0 24px 60px rgba(0,0,0,0.15)", overflow: "hidden"
                    }}>
                        <div style={{
                            background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
                            padding: "20px 24px", color: "#fff", display: "flex",
                            justifyContent: "space-between", alignItems: "center"
                        }}>
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
                                <span style={{display: 'flex', alignItems: 'center', gap: 6}}>{modalMode === "create" ? <><BookOpen size={20}/> Đăng khóa học mới</> : <><Edit3 size={20}/> Chỉnh sửa khóa học</>}</span>
                            </h3>
                            <button onClick={() => setShowModal(false)} style={{
                                background: "rgba(255,255,255,0.2)", border: "none",
                                borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
                                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center"
                            }}>✕</button>
                        </div>

                        <form onSubmit={handleSaveCourse} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16, maxHeight: "80vh", overflowY: "auto" }}>

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
                                {formErrors.tieuDe && <span style={{ fontSize: 12, color: "#ef4444", display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12}/> {formErrors.tieuDe}</span>}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Mô tả ngắn khóa học</label>
                                <textarea
                                    placeholder="Mô tả tóm tắt nội dung học viên sẽ được trang bị..."
                                    rows={3}
                                    value={form.moTa}
                                    onChange={e => setForm({ ...form, moTa: e.target.value })}
                                    style={{
                                        border: "1.5px solid #e2e8f0", borderRadius: 8,
                                        padding: "10px 12px", fontSize: 13.5, outline: "none", resize: "vertical"
                                    }}
                                />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Chuyên mục <span style={{ color: "#ef4444" }}>*</span></label>
                                    <select
                                        value={form.category}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                        style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none" }}
                                    >
                                        {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Trình độ <span style={{ color: "#ef4444" }}>*</span></label>
                                    <select
                                        value={form.level}
                                        onChange={e => setForm({ ...form, level: e.target.value })}
                                        style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none" }}
                                    >
                                        {levelOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Thời lượng <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: 45 giờ"
                                        value={form.duration}
                                        onChange={e => setForm({ ...form, duration: e.target.value })}
                                        style={{
                                            border: `1.5px solid ${formErrors.duration ? "#ef4444" : "#e2e8f0"}`,
                                            borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none"
                                        }}
                                    />
                                    {formErrors.duration && <span style={{ fontSize: 12, color: "#ef4444", display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12}/> {formErrors.duration}</span>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Số bài học <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        type="number"
                                        placeholder="Ví dụ: 50"
                                        value={form.lecturesCount}
                                        onChange={e => setForm({ ...form, lecturesCount: e.target.value })}
                                        style={{
                                            border: `1.5px solid ${formErrors.lecturesCount ? "#ef4444" : "#e2e8f0"}`,
                                            borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none"
                                        }}
                                    />
                                    {formErrors.lecturesCount && <span style={{ fontSize: 12, color: "#ef4444", display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12}/> {formErrors.lecturesCount}</span>}
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Giảng viên chính <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Đỗ Phương Thảo"
                                        value={form.instructorName}
                                        onChange={e => setForm({ ...form, instructorName: e.target.value })}
                                        style={{
                                            border: `1.5px solid ${formErrors.instructorName ? "#ef4444" : "#e2e8f0"}`,
                                            borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none"
                                        }}
                                    />
                                    {formErrors.instructorName && <span style={{ fontSize: 12, color: "#ef4444", display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12}/> {formErrors.instructorName}</span>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Đơn vị / Vai trò giảng viên</label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Đối tác Đào tạo VietJob"
                                        value={form.instructorRole}
                                        onChange={e => setForm({ ...form, instructorRole: e.target.value })}
                                        style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none" }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Học phí khuyến mãi (đ) <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        type="number"
                                        placeholder="Ví dụ: 1500000"
                                        value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })}
                                        style={{
                                            border: `1.5px solid ${formErrors.price ? "#ef4444" : "#e2e8f0"}`,
                                            borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none"
                                        }}
                                    />
                                    {formErrors.price && <span style={{ fontSize: 12, color: "#ef4444", display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12}/> {formErrors.price}</span>}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Học phí gốc chưa giảm (đ)</label>
                                    <input
                                        type="number"
                                        placeholder="Ví dụ: 3000000"
                                        value={form.oldPrice}
                                        onChange={e => setForm({ ...form, oldPrice: e.target.value })}
                                        style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, outline: "none" }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Trạng thái hiển thị</label>
                                <select
                                    value={form.trangThai}
                                    onChange={e => setForm({ ...form, trangThai: e.target.value })}
                                    style={{
                                        border: "1.5px solid #e2e8f0", borderRadius: 8,
                                        padding: "10px 12px", fontSize: 13.5, outline: "none",
                                        background: "#fff", cursor: "pointer"
                                    }}
                                >
                                    <option value="Chờ duyệt">Gửi yêu cầu duyệt (Chờ duyệt)</option>
                                    <option value="Nháp">Bản nháp (Lưu trữ nội bộ)</option>
                                    <option value="Đã ẩn">Ẩn khóa học</option>
                                    {modalMode === "edit" && selectedCourse?.TrangThai === "Đang bán" && (
                                        <option value="Đang bán">Đang hoạt động (Đang bán)</option>
                                    )}
                                </select>
                            </div>

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

            {toast && (
                <div style={{
                    position: "fixed", bottom: 28, right: 28,
                    background: toast.success ? "#16a34a" : "#dc2626", color: "#fff",
                    padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 9999,
                    animation: "fadeIn 0.2s ease"
                }}>
                    {toast.success ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>} {toast.message}
                </div>
            )}
        </div>
    );
}