import { useState } from "react";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl";

const navItems = [
    { icon: "⊞", label: "Tổng quan" },
    { icon: "📚", label: "Khóa học" },
    { icon: "👤", label: "Sinh viên" },
    { icon: "📊", label: "Phân tích" },
    { icon: "💳", label: "Ví tiền", active: true },
    { icon: "⚙️", label: "Cài đặt" },
];

const transactions = [
    {
        id: 1,
        title: "Nạp tiền vào ví qua Vietcombank",
        date: "11/10/2023, 10:10",
        ref: "Mã 7806854",
        amount: "+10.000.000 VND",
        positive: true,
        tag: "Nạp ví",
        tagColor: "#16a34a",
        tagBg: "#dcfce7",
        icon: "💚",
        iconBg: "#dcfce7",
    },
    {
        id: 2,
        title: 'Thanh toán tin đăng "Senior AI Engineer"',
        date: "11/10/2023, 08:30",
        ref: "Mã 7700879",
        amount: "-1.500.000 VND",
        positive: false,
        tag: "Nạp ví",
        tagColor: "#16a34a",
        tagBg: "#dcfce7",
        icon: "📄",
        iconBg: "#dbeafe",
    },
    {
        id: 3,
        title: 'Gia hạn gói dịch vụ Talent Search 30 ngày',
        date: "05/10/2023, 15:45",
        ref: "Mã 7609700",
        amount: "-5.000.000 VND",
        positive: false,
        tag: "tự động",
        tagColor: "#7c3aed",
        tagBg: "#ede9fe",
        icon: "🔄",
        iconBg: "#ede9fe",
    },
    {
        id: 4,
        title: "Nạp tiền thất bại - Lỗi ngân hàng",
        date: "28/09/2023, 18:20",
        ref: "Mã 7500534",
        amount: "0 VND",
        positive: null,
        tag: "LỖI",
        tagColor: "#dc2626",
        tagBg: "#fee2e2",
        icon: "❌",
        iconBg: "#fee2e2",
    },
];

const suggestedAmounts = [2000000, 5000000, 10000000];

const banks = [
    { id: "vcb", name: "Vietcombank", icon: "🏦", color: "#16a34a" },
    { id: "tp", name: "TPBank Ví QR", icon: "🏛", color: "#2563eb" },
];

export default function CareerCuratorWallet() {
    const [selectedAmount, setSelectedAmount] = useState(2000000);
    const [customAmount, setCustomAmount] = useState("");
    const [selectedBank, setSelectedBank] = useState("vcb");
    const [activeFilter, setActiveFilter] = useState("Tất cả");

    const finalAmount = customAmount ? parseInt(customAmount.replace(/\D/g, "")) || 0 : selectedAmount;

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f5f6fa", color: "#1a1a2e" }}>
            <Sidebar_empl />

            {/* Main */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />
                <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", gap: 20 }}>
                    {/* LEFT COLUMN */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Balance card */}
                        <div style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#2563eb 60%,#7c3aed 100%)", borderRadius: 16, padding: "22px 24px", color: "#fff", marginBottom: 22, position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ position: "absolute", right: 20, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                                <span>💳</span> SỐ DƯ VÍ
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px", marginBottom: 10 }}>24.500.000<span style={{ fontSize: 18, fontWeight: 600, opacity: 0.8 }}> VND</span></div>
                            <div style={{ display: "flex", gap: 16, fontSize: 12, opacity: 0.85, marginBottom: 18 }}>
                                <span>↑ +10% so với tháng WND</span>
                                <span>·</span>
                                <span>🔒 Tài khoản doanh nghiệp</span>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button style={{ flex: 1, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 9, padding: "9px 0", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(4px)" }}>
                                    Nạp tiền ngay
                                </button>
                                <button style={{ flex: 1, background: "#fff", border: "none", borderRadius: 9, padding: "9px 0", color: "#2563eb", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                                    Xuất hóa đơn
                                </button>
                            </div>
                        </div>

                        {/* Transaction history */}
                        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", overflow: "hidden" }}>
                            <div style={{ padding: "16px 18px", borderBottom: "1px solid #f0f0f5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>Lịch sử giao dịch</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {["Lọc lọc", "Tất cả"].map((f) => (
                                        <button key={f} onClick={() => setActiveFilter(f)} style={{
                                            padding: "5px 12px", borderRadius: 7, border: "1px solid #e0e0e0",
                                            background: activeFilter === f ? "#1a1a2e" : "#fff",
                                            color: activeFilter === f ? "#fff" : "#555",
                                            fontSize: 12, cursor: "pointer", fontWeight: 500,
                                        }}>{f}</button>
                                    ))}
                                </div>
                            </div>

                            {transactions.map((t, idx) => (
                                <div key={t.id} style={{
                                    padding: "14px 18px",
                                    borderBottom: idx < transactions.length - 1 ? "1px solid #f5f5f8" : "none",
                                    display: "flex", alignItems: "center", gap: 12,
                                    transition: "background 0.1s",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                                        {t.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                                        <div style={{ fontSize: 11.5, color: "#aaa" }}>{t.date} · {t.ref}</div>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <div style={{ fontWeight: 700, fontSize: 13, color: t.positive === true ? "#16a34a" : t.positive === false ? "#dc2626" : "#888", marginBottom: 4 }}>
                                            {t.amount}
                                        </div>
                                        <span style={{ background: t.tagBg, color: t.tagColor, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>{t.tag}</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ padding: "12px 18px", textAlign: "center" }}>
                                <button style={{ fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                                    Xem tất cả 142 giao dịch →
                                </button>
                            </div>
                        </div>

                        {/* Services */}
                        <div style={{ marginTop: 22 }}>
                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Gợi ý dịch vụ</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                                {/* Fast Recruit */}
                                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "18px 16px" }}>
                                    <div style={{ fontSize: 22, marginBottom: 8 }}>⚡</div>
                                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Fast Recruit</div>
                                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 14 }}>Đăng tin tuyển dụng nhanh và tiếp cận hàng nghìn ứng viên tiềm năng.</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>2.500.000 <span style={{ fontSize: 11, fontWeight: 500, color: "#888" }}>đ</span></div>
                                    <button style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", color: "#1a1a2e", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Mua ngay</button>
                                </div>

                                {/* Premium Talent Hub */}
                                <div style={{ background: "#1a1a2e", borderRadius: 14, padding: "18px 16px", color: "#fff", position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: 10, right: 10 }}>
                                        <span style={{ background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>PHỔ BIẾN NHẤT</span>
                                    </div>
                                    <div style={{ fontSize: 22, marginBottom: 8 }}>🏆</div>
                                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Premium Talent Hub</div>
                                    <div style={{ fontSize: 12, opacity: 0.75, lineHeight: 1.5, marginBottom: 14 }}>Top 10 ứng viên tốt nhất được gợi ý mỗi tuần và ưu tiên hiển thị.</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>15.000.000 <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>đ</span></div>
                                    <button style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Kích hoạt gói</button>
                                </div>

                                {/* AI Screening Plus */}
                                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "18px 16px" }}>
                                    <div style={{ fontSize: 22, marginBottom: 8 }}>🤖</div>
                                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>AI Screening Plus</div>
                                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5, marginBottom: 14 }}>Hệ thống AI tự động sàng lọc và đánh giá ứng viên phù hợp nhất.</div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>8.000.000 <span style={{ fontSize: 11, fontWeight: 500, color: "#888" }}>đ</span></div>
                                    <button style={{ width: "100%", padding: "8px 0", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", color: "#1a1a2e", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Tìm hiểu thêm</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                        {/* Active services */}
                        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "16px" }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Tin tuyển dụng</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f0fdf4", borderRadius: 10, marginBottom: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>📋</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>12 Đang chạy</div>
                                    <div style={{ fontSize: 11, color: "#888" }}>tin đang hoạt động</div>
                                </div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: 14, margin: "12px 0 10px" }}>Dịch vụ đang dùng</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#eff6ff", borderRadius: 10, marginBottom: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>⭐</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>Premium Plus</div>
                                    <div style={{ fontSize: 11, color: "#888" }}>Gói cao cấp đang hoạt động</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#f5f6fa", borderRadius: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14 }}>🕐</div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 13 }}>Lần nạp gần đây</div>
                                    <div style={{ fontSize: 11, color: "#888" }}>15/10/2023</div>
                                </div>
                            </div>
                        </div>

                        {/* Top-up panel */}
                        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaf0", padding: "16px" }}>
                            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Nạp tiền vào ví</div>

                            <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Chọn số tiền nạp</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
                                {suggestedAmounts.map((amt) => (
                                    <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }} style={{
                                        padding: "8px 6px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                                        border: selectedAmount === amt && !customAmount ? "2px solid #2563eb" : "1px solid #e0e0e0",
                                        background: selectedAmount === amt && !customAmount ? "#eff6ff" : "#fff",
                                        color: selectedAmount === amt && !customAmount ? "#2563eb" : "#555",
                                    }}>
                                        {(amt / 1000000).toFixed(0)}.000.000
                                    </button>
                                ))}
                                <button style={{ padding: "8px 6px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid #e0e0e0", background: "#fff", color: "#555" }}>
                                    Khác
                                </button>
                            </div>

                            <input
                                placeholder="Hoặc nhập số tiền..."
                                value={customAmount}
                                onChange={e => setCustomAmount(e.target.value)}
                                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e0e0e0", fontSize: 13, outline: "none", marginBottom: 12, boxSizing: "border-box" }}
                            />

                            <div style={{ fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Phương thức thanh toán</div>
                            {banks.map((b) => (
                                <div key={b.id} onClick={() => setSelectedBank(b.id)} style={{
                                    display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, marginBottom: 6,
                                    border: selectedBank === b.id ? `2px solid ${b.color}` : "1px solid #e0e0e0",
                                    background: selectedBank === b.id ? b.color + "0d" : "#fff",
                                    cursor: "pointer", transition: "all 0.15s",
                                }}>
                                    <div style={{ width: 30, height: 30, borderRadius: 7, background: b.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{b.icon}</div>
                                    <div style={{ fontWeight: 600, fontSize: 13, color: "#1a1a2e" }}>{b.name}</div>
                                    {selectedBank === b.id && <span style={{ marginLeft: "auto", color: b.color, fontSize: 16 }}>✓</span>}
                                </div>
                            ))}

                            <div style={{ marginTop: 14, padding: "12px", background: "#f8f9fc", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <span style={{ fontSize: 12, color: "#888" }}>Tổng tiền nạp</span>
                                <span style={{ fontWeight: 800, fontSize: 18, color: "#2563eb" }}>
                                    {(finalAmount / 1000000).toFixed(0)}.000.000 <span style={{ fontSize: 12, fontWeight: 600 }}>VND</span>
                                </span>
                            </div>

                            <button style={{ width: "100%", padding: "11px 0", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                                Xác nhận nạp tiền
                            </button>
                            <div style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
                                Giao dịch được bảo mật bởi hệ thống mã hóa SSL
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer style={{ borderTop: "1px solid #e8eaf0", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", fontSize: 11.5, color: "#aaa" }}>
                    <span>© 2023 CareerCurator. Hệ thống quản lý tuyển dụng và đào tạo chuyên nghiệp tại Việt Nam.</span>
                    <div style={{ display: "flex", gap: 16 }}>
                        {["Quy định bảo mật", "Về ứng dụng", "Hỗ trợ khách hàng"].map((l) => (
                            <span key={l} style={{ cursor: "pointer", color: "#888" }}>{l}</span>
                        ))}
                    </div>
                </footer>
            </main>
        </div>
    );
}