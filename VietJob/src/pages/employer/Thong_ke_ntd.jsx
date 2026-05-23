import { useState } from "react";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl.jsx";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl.jsx";

const navItems = [
    { icon: "⊞", label: "Dashboard" },
    { icon: "💼", label: "Jobs" },
    { icon: "📊", label: "Analytics", active: true },
    { icon: "👤", label: "Candidates" },
    { icon: "📚", label: "Courses" },
    { icon: "💳", label: "Wallet" },
];

const industries = [
    { label: "Công nghệ thông tin", pct: 45, color: "#2563eb" },
    { label: "Marketing & Sales", pct: 28, color: "#2563eb" },
    { label: "Tài chính / Kế toán", pct: 15, color: "#2563eb" },
    { label: "Thiết kế / Sáng tạo", pct: 12, color: "#2563eb" },
];

const jobs = [
    {
        id: 1,
        icon: "</>",
        iconBg: "#dbeafe",
        iconColor: "#2563eb",
        title: "Senior Frontend Developer",
        posted: "Đăng 2 ngày trước",
        status: "Đang hoạt động",
        applicants: [
            { color: "#f97316" },
            { color: "#8b5cf6" },
            { color: "#14b8a6" },
        ],
        extra: 18,
    },
    {
        id: 2,
        icon: "✦",
        iconBg: "#fce7f3",
        iconColor: "#ec4899",
        title: "UI/UX Designer (Contract)",
        posted: "Đăng 5 ngày trước",
        status: "Đang hoạt động",
        applicants: [{ color: "#f97316" }],
        extra: 5,
    },
];

// Bar chart data (relative heights 0-1)
const barData = [
    { label: "01 TH09", cur: 0.22, prev: 0.18 },
    { label: "08 TH09", cur: 0.38, prev: 0.28 },
    { label: "15 TH09", cur: 0.55, prev: 0.42 },
    { label: "22 TH09", cur: 0.88, prev: 0.60 },
    { label: "30 TH09", cur: 0.72, prev: 0.50 },
];

function BarChart() {
    const maxH = 140;
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: maxH + 28, paddingTop: 8 }}>
            {barData.map((d, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: maxH }}>
                        <div style={{ width: 18, background: "#2563eb", borderRadius: "4px 4px 0 0", height: d.cur * maxH, transition: "height 0.4s" }} />
                        <div style={{ width: 18, background: "#e0e7ff", borderRadius: "4px 4px 0 0", height: d.prev * maxH, transition: "height 0.4s" }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: "#aaa", whiteSpace: "nowrap" }}>{d.label}</div>
                </div>
            ))}
        </div>
    );
}

export default function Thongke_ntd() {
    const [period, setPeriod] = useState("30 ngày qua");

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f5f6fa", color: "#1a1a2e" }}>
            <Sidebar_empl />

            {/* Main */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />

                <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
                    {/* Page title row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                        <div>
                            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Thống Kê Tuyển Dụng</h1>
                            <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>Chào mừng trở lại, đây là hiệu quả tuyển dụng tháng này.</p>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", fontSize: 13, color: "#555", cursor: "pointer" }}>
                                📅 {period} ▾
                            </button>
                            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                ⬆ Xuất báo cáo
                            </button>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
                        {[
                            { label: "Tổng tin tuyển dụng", value: "128", change: "+12%", up: true, icon: "📋", iconBg: "#dbeafe", iconColor: "#2563eb" },
                            { label: "Tổng số ứng viên", value: "2,450", change: "+8%", up: true, icon: "👥", iconBg: "#dcfce7", iconColor: "#16a34a" },
                            { label: "Số lượng hồ sơ ứng tuyển", value: "412", change: "-2%", up: false, icon: "📄", iconBg: "#fce7f3", iconColor: "#ec4899" },
                        ].map((s) => (
                            <div key={s.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "18px 20px", position: "relative", overflow: "hidden" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: s.up ? "#16a34a" : "#dc2626", background: s.up ? "#f0fdf4" : "#fef2f2", padding: "3px 8px", borderRadius: 20 }}>
                                        {s.up ? "↑" : "↓"} {s.change}
                                    </span>
                                </div>
                                <div style={{ fontSize: 11.5, color: "#aaa", marginBottom: 4 }}>{s.label}</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e" }}>{s.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts row */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 20 }}>
                        {/* Bar chart */}
                        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "18px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 15 }}>Xu hướng ứng tuyển</div>
                                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>Thống kê theo lượt nộp hồ sơ mỗi ngày</div>
                                </div>
                                <div style={{ display: "flex", gap: 14, fontSize: 12, alignItems: "center" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
                                        Tháng này
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e0e7ff", display: "inline-block" }} />
                                        Tháng trước
                                    </span>
                                </div>
                            </div>
                            <BarChart />
                        </div>

                        {/* Industry breakdown */}
                        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "18px 20px" }}>
                            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Ứng tuyển theo ngành</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                {industries.map((ind) => (
                                    <div key={ind.label}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                                            <span style={{ color: "#444", fontWeight: 500 }}>{ind.label}</span>
                                            <span style={{ fontWeight: 700, color: "#1a1a2e" }}>{ind.pct}%</span>
                                        </div>
                                        <div style={{ height: 6, background: "#f0f0f5", borderRadius: 10, overflow: "hidden" }}>
                                            <div style={{ height: "100%", width: `${ind.pct}%`, background: "linear-gradient(90deg,#2563eb,#7c3aed)", borderRadius: 10, transition: "width 0.5s" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button style={{ marginTop: 18, fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>
                                Xem chi tiết ngành nghề →
                            </button>
                        </div>
                    </div>

                    {/* Featured jobs */}
                    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", overflow: "hidden" }}>
                        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f0f0f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontWeight: 700, fontSize: 15 }}>Việc làm đang tuyển nổi bật</div>
                            <button style={{ fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Xem tất cả</button>
                        </div>

                        {/* Table header */}
                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 12, padding: "10px 20px", background: "#f8f9fc", fontSize: 11.5, fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5 }}>
                            <span>Tên công việc</span>
                            <span>Trạng thái</span>
                            <span>Hồ sơ</span>
                            <span>Hành động</span>
                        </div>

                        {jobs.map((job, idx) => (
                            <div key={job.id} style={{
                                display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto",
                                gap: 12, padding: "14px 20px", alignItems: "center",
                                borderBottom: idx < jobs.length - 1 ? "1px solid #f5f5f8" : "none",
                                transition: "background 0.1s",
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 9, background: job.iconBg, color: job.iconColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                                        {job.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1a1a2e" }}>{job.title}</div>
                                        <div style={{ fontSize: 11.5, color: "#aaa" }}>{job.posted}</div>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", color: "#16a34a", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                                        {job.status}
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{ display: "flex" }}>
                                        {job.applicants.map((a, i) => (
                                            <div key={i} style={{
                                                width: 26, height: 26, borderRadius: "50%", background: a.color,
                                                border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: "#fff", fontSize: 10, fontWeight: 700,
                                            }}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 12, color: "#888", marginLeft: 8, fontWeight: 600 }}>+{job.extra}</span>
                                </div>
                                <button style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontSize: 16, color: "#aaa", display: "flex", alignItems: "center", justifyContent: "center" }}>⋮</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer style={{ borderTop: "1px solid #e8eaf0", padding: "9px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", fontSize: 11.5, color: "#aaa" }}>
                    <span>© 2023 CareerCurator. Hệ thống quản lý tuyển dụng cao cấp.</span>
                    <div style={{ display: "flex", gap: 18 }}>
                        {["Chính sách bảo mật", "Trung tâm hỗ trợ", "Điều khoản dịch vụ"].map((l) => (
                            <span key={l} style={{ cursor: "pointer", color: "#888" }}>{l}</span>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
}