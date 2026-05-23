import { useState } from "react";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl.jsx";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl.jsx";

const navItems = [
    { icon: "⊞", label: "Dashboard" },
    { icon: "💼", label: "Jobs" },
    { icon: "👤", label: "Candidates", active: true },
    { icon: "📚", label: "Courses" },
    { icon: "💳", label: "Wallet" },
    { icon: "⚙️", label: "Settings" },
];

const contacts = [
    {
        id: 1,
        name: "Nguyễn Minh Quân",
        role: "Senior AI Engineer",
        date: "15/10/2023, 14:30",
        tag: "Đã phân tích",
        tagColor: "#16a34a",
        tagBg: "#dcfce7",
        avatar: "NQ",
        avatarBg: "#f97316",
    },
    {
        id: 2,
        name: "Trần Thị Thu Hà",
        role: "Lead Product Designer",
        date: "14/10/2023, 09:15",
        tag: "Chờ phân hồi",
        tagColor: "#d97706",
        tagBg: "#fef3c7",
        avatar: "TH",
        avatarBg: "#8b5cf6",
    },
    {
        id: 3,
        name: "Phạm Văn Đức",
        role: "Fullstack Developer",
        date: "12/10/2023, 16:45",
        tag: "Từ chối",
        tagColor: "#dc2626",
        tagBg: "#fee2e2",
        avatar: "PĐ",
        avatarBg: "#14b8a6",
    },
];

const services = [
    {
        id: 1,
        name: "Premium Talent Hub",
        desc: "Truy cập toàn bộ kho dữ liệu ứng viên cao cấp, không giới hạn hoạt động hồ sơ.",
        price: "15.000.000",
        unit: "đ/tháng",
        btnLabel: "Kích hoạt gói",
        btnStyle: { background: "#2563eb", color: "#fff", border: "none" },
        dark: true,
        badge: "PHỔ BIẾN NHẤT",
        icon: "🏆",
    },
    {
        id: 2,
        name: "Fast Recruit",
        desc: "Đăng tin tuyển dụng lên top đầu trong 7 ngày, tiếp cận hơn 5.000 ứng viên tiềm năng.",
        price: "2.500.000",
        unit: "đ/th",
        btnLabel: "Mua ngay",
        btnStyle: { background: "#fff", color: "#1a1a2e", border: "1px solid #e0e0e0" },
        dark: false,
        icon: "⚡",
    },
    {
        id: 3,
        name: "AI Screening Plus",
        desc: "Hệ thống AI tự động sắp xếp hồ sơ, xếp hạng ứng viên và gửi email phỏng vấn tự động.",
        price: "8.000.000",
        unit: "đ/tháng",
        btnLabel: "Tìm hiểu thêm",
        btnStyle: { background: "#fff", color: "#1a1a2e", border: "1px solid #e0e0e0" },
        dark: false,
        icon: "🤖",
    },
];

export default function Quan_ly_tin_nhan() {
    const [activeFilter, setActiveFilter] = useState("Tất cả");

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f5f6fa", color: "#1a1a2e" }}>
            <Sidebar_empl />

            {/* Main */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />

                <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", gap: 18 }}>
                    {/* LEFT */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Hero contact card */}
                        <div style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#2563eb 55%,#6d28d9 100%)", borderRadius: 16, padding: "22px 24px", color: "#fff", marginBottom: 18, position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", right: -20, top: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ position: "absolute", right: 60, bottom: -30, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                            {/* Person illustration */}
                            <div style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", fontSize: 52, opacity: 0.25 }}>👤</div>

                            <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>
                                TỔNG SỐ LƯỢT LIÊN HỆ CÒN LẠI
                            </div>
                            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 4 }}>
                                1.250 <span style={{ fontSize: 18, fontWeight: 600 }}>Contacts</span>
                            </div>
                            <div style={{ display: "flex", gap: 16, fontSize: 12, opacity: 0.85, marginBottom: 18, flexWrap: "wrap" }}>
                                <span>↑ +10% so với tháng trước</span>
                                <span>·</span>
                                <span>🔒 Tài khoản Doanh nghiệp</span>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button style={{ padding: "9px 18px", borderRadius: 9, background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                    Mua thêm lượt liên hệ
                                </button>
                                <button style={{ padding: "9px 18px", borderRadius: 9, background: "#fff", border: "none", color: "#2563eb", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                    Xem báo cáo chi tiết
                                </button>
                            </div>
                        </div>

                        {/* Contact history */}
                        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", overflow: "hidden" }}>
                            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>Lịch sử liên hệ ứng viên</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {["Bộ lọc", "Tất cả"].map((f) => (
                                        <button key={f} onClick={() => setActiveFilter(f)} style={{
                                            padding: "5px 12px", borderRadius: 7, border: "1px solid #e0e0e0",
                                            background: activeFilter === f ? "#1a1a2e" : "#fff",
                                            color: activeFilter === f ? "#fff" : "#555",
                                            fontSize: 12, cursor: "pointer", fontWeight: 500,
                                        }}>{f}</button>
                                    ))}
                                </div>
                            </div>

                            {contacts.map((c, idx) => (
                                <div key={c.id} style={{
                                    padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
                                    borderBottom: idx < contacts.length - 1 ? "1px solid #f5f5f8" : "none",
                                    transition: "background 0.1s", cursor: "pointer",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                                        {c.avatar}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1a1a2e" }}>{c.name}</div>
                                        <div style={{ fontSize: 12, color: "#888" }}>{c.role}</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>{c.date}</div>
                                        <span style={{ background: c.tagBg, color: c.tagColor, fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>{c.tag}</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ padding: "12px 18px", textAlign: "center" }}>
                                <button style={{ fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                                    Xem tất cả 142 lượt liên hệ →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={{ width: 270, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                        {/* Quick stats */}
                        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f0fdf4", borderRadius: 10, marginBottom: 8, cursor: "pointer" }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>📋</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>TIN TUYỂN DỤNG</div>
                                    <div style={{ fontSize: 11.5, color: "#16a34a", fontWeight: 600 }}>12 Đang chạy</div>
                                </div>
                                <span style={{ color: "#aaa" }}>›</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#eff6ff", borderRadius: 10, marginBottom: 8, cursor: "pointer" }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>⭐</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 11, color: "#888" }}>DỊCH VỤ ĐỀ XUẤT</div>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>Premium Plus</div>
                                </div>
                                <span style={{ color: "#aaa" }}>›</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f5f6fa", borderRadius: 10, cursor: "pointer" }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>🕐</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 11, color: "#888" }}>LẦN NẠP MỚI NHẤT</div>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>15/10/2023</div>
                                </div>
                                <span style={{ color: "#aaa" }}>›</span>
                            </div>
                        </div>

                        {/* Service suggestions */}
                        <div style={{ fontWeight: 700, fontSize: 14, paddingLeft: 2 }}>Gói dịch vụ đề xuất</div>
                        {services.map((s) => (
                            <div key={s.id} style={{
                                background: s.dark ? "#1a1a2e" : "#fff",
                                borderRadius: 14,
                                border: s.dark ? "none" : "1px solid #e8eaf0",
                                padding: "16px",
                                position: "relative",
                                overflow: "hidden",
                            }}>
                                {s.badge && (
                                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                                        <span style={{ background: "#f59e0b", color: "#fff", fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{s.badge}</span>
                                    </div>
                                )}
                                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                                <div style={{ fontWeight: 700, fontSize: 14, color: s.dark ? "#fff" : "#1a1a2e", marginBottom: 6 }}>{s.name}</div>
                                <div style={{ fontSize: 12, color: s.dark ? "rgba(255,255,255,0.7)" : "#888", lineHeight: 1.5, marginBottom: 12 }}>{s.desc}</div>
                                <div style={{ fontWeight: 800, fontSize: 16, color: s.dark ? "#fff" : "#1a1a2e", marginBottom: 12 }}>
                                    {s.price} <span style={{ fontSize: 11, fontWeight: 500, color: s.dark ? "rgba(255,255,255,0.6)" : "#aaa" }}>{s.unit}</span>
                                </div>
                                <button style={{ width: "100%", padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", ...s.btnStyle }}>
                                    {s.btnLabel}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer style={{ borderTop: "1px solid #e8eaf0", padding: "9px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", fontSize: 11, color: "#aaa" }}>
                    <span>© 2023 CareerCurator. Hệ thống quản lý tài chính doanh nghiệp an toàn, minh bạch.</span>
                    <div style={{ display: "flex", gap: 14 }}>
                        {["Quy định bảo mật", "Hỗ trợ đối tác", "Hoàn đơn điều tư"].map((l) => (
                            <span key={l} style={{ cursor: "pointer", color: "#888" }}>{l}</span>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
}