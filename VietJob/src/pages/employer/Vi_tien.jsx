import { useState, useEffect } from "react";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl";
import axios from "axios";
import { 
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, 
  HelpCircle, ShieldCheck, QrCode, BookOpen, Landmark, Building, Lock, Loader2, AlertTriangle, RefreshCw, Sparkles, CheckCircle, AlertCircle
} from "lucide-react";

const suggestedAmounts = [2000000, 5000000, 10000000];

// ⚠️ Thay account bằng số tài khoản thật của hệ thống
const banks = [
    { id: "vcb", name: "Vietcombank", bin: "970436", account: "1014597123", accountName: "VIETJOB SYSTEM", icon: <Landmark size={15}/>, color: "#16a34a" },
    { id: "tpb", name: "TPBank",      bin: "970423", account: "0987654321", accountName: "VIETJOB SYSTEM", icon: <Building size={15}/>, color: "#7c3aed" },
];

export default function CareerCuratorWallet() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedAmount, setSelectedAmount] = useState(2000000);
    const [customAmount, setCustomAmount] = useState("");
    const [selectedBank, setSelectedBank] = useState("vcb");
    const [activeFilter, setActiveFilter] = useState("Tất cả");
    const [showQR, setShowQR] = useState(false);
    const [qrRefCode, setQrRefCode] = useState("");
    const [confirmLoading, setConfirmLoading] = useState(false);

    // Dynamic state for highlighting and selling courses
    const [selectedJobId, setSelectedJobId] = useState("");
    const [highlightLoading, setHighlightLoading] = useState(false);

    // Get current recruiter user
    let user = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Lỗi parse user:", e);
    }
    const userId = user?.id;

    // Fetch Wallet & DB Info
    const fetchWalletData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/wallet/info/${userId}`);
            setBalance(res.data.balance || 0);
            setTransactions(res.data.transactions || []);
            setJobs(res.data.jobs || []);
        } catch (err) {
            console.error("Lỗi lấy thông tin ví:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [userId]);

    const finalAmount = customAmount ? parseInt(customAmount.replace(/\D/g, "")) || 0 : selectedAmount;

    // 1. Hiển thị modal QR thanh toán
    const handleShowQR = () => {
        if (!userId) return;
        if (finalAmount <= 0) { alert("Vui lòng chọn hoặc nhập số tiền hợp lệ!"); return; }
        const ref = "NTD" + Math.floor(1000000 + Math.random() * 9000000);
        setQrRefCode(ref);
        setShowQR(true);
    };

    // 2. Xác nhận đã chuyển khoản → ghi vào DB
    const handleConfirmPayment = async () => {
        const bankObj = banks.find(b => b.id === selectedBank);
        setConfirmLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/wallet/deposit", {
                userId, amount: finalAmount,
                bankName: bankObj?.name || "Ngân hàng"
            });
            setShowQR(false);
            setCustomAmount("");
            fetchWalletData();
            alert(`✅ Nạp tiền thành công! Mã GD: ${res.data.refCode}`);
        } catch (err) {
            alert("Lỗi: " + (err.response?.data?.message || err.message));
        } finally {
            setConfirmLoading(false);
        }
    };

    // 2. Handle activating VIP package for company
    const handleHighlightCompany = async () => {
        if (!userId) return;

        if (balance < 3000000) {
            alert("Số dư tài khoản không đủ (cần 3.000.000 VND). Vui lòng nạp thêm tiền!");
            return;
        }

        if (!window.confirm("Xác nhận chi 3,000,000 VND từ ví để kích hoạt gói đặc quyền VIP Doanh nghiệp (Nổi bật cả Công ty và toàn bộ các Tin tuyển dụng lên Trang chủ)?")) return;

        setHighlightLoading(true);
        try {
            await axios.post("http://localhost:5000/api/wallet/highlight", {
                userId
            });
            alert("Kích hoạt đặc quyền VIP Doanh nghiệp thành công! Logo & hồ sơ công ty bạn đã được làm nổi bật tại mục 'Nhà tuyển dụng hàng đầu' trên Trang chủ!");
            fetchWalletData();
        } catch (err) {
            alert("Lỗi kích hoạt VIP Doanh nghiệp: " + (err.response?.data?.message || err.message));
        } finally {
            setHighlightLoading(false);
        }
    };

    // Filter transaction list
    const filteredTransactions = transactions.filter(t => {
        if (activeFilter === "Nạp ví" && t.Type !== "Nap") return false;
        if (activeFilter === "Thanh toán" && t.Type !== "ThanhToan") return false;
        if (activeFilter === "Doanh thu" && t.Type !== "BanKhoaHoc") return false;
        return true;
    });

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f8fafc", color: "#1e293b" }}>
            <Sidebar_empl />

            {/* Main */}
            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />
                
                <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
                    
                    {/* LEFT COLUMN: BALANCE & TRANSACTIONS & COURSE SALE COMMISSION */}
                    <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 24 }}>
                        
                        {/* Balance premium card */}
                        <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #8b5cf6 100%)", borderRadius: 16, padding: "24px", color: "#ffffff", position: "relative", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}>
                            <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ position: "absolute", right: 40, bottom: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                            
                            <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                                <WalletIcon size={14} /> SỐ DƯ VÍ NHÀ TUYỂN DỤNG
                            </div>
                            
                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                                {loading ? (
                                    <Loader2 size={32} className="animate-spin" style={{ color: "#ffffff" }} />
                                ) : (
                                    <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>{balance.toLocaleString()}</span>
                                )}
                                <span style={{ fontSize: 18, fontWeight: 600, opacity: 0.9 }}>VND</span>
                            </div>

                            <div style={{ display: "flex", gap: 16, fontSize: 12, opacity: 0.9, marginBottom: 20 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <ShieldCheck size={14} /> Tài khoản ví liên kết SQL
                                </span>
                                <span>•</span>
                                <span style={{display: "flex", alignItems: "center", gap: 4}}><Lock size={14}/> Bảo mật SSL</span>
                            </div>

                            <div style={{ display: "flex", gap: 12 }}>
                                <button 
                                  onClick={fetchWalletData}
                                  style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "10px 18px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "background 0.2s" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                                >
                                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                                    Cập nhật số dư
                                </button>
                            </div>
                        </div>

                        {/* HIGHLIGHT JOB VIP SERVICE SECTION */}
                        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 22, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                            <h4 style={{ margin: "0 0 10px 0", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8, color: "#1e3a8a" }}>
                                <Sparkles size={20} style={{ color: "#eab308" }} />
                                Kích hoạt gói VIP Nổi bật Doanh nghiệp
                            </h4>
                            <p style={{ margin: "0 0 18px 0", fontSize: 12.5, color: "#475569", lineHeight: 1.6 }}>
                                Đặc quyền cao cấp giúp **Quảng bá toàn bộ Công ty của bạn** lên mục danh giá *"Nhà Tuyển Dụng Hàng Đầu"* ngay tại vị trí trung tâm Trang chủ ứng dụng, đồng thời **tự động làm nổi bật VIP toàn bộ các Tin tuyển dụng đang hoạt động** của bạn.
                            </p>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(202, 138, 4, 0.03))", padding: "16px 20px", borderRadius: 12, border: "1px solid rgba(234, 179, 8, 0.25)", flexWrap: "wrap", gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#854d0e", textTransform: "uppercase", marginBottom: 2 }}>Chi phí kích hoạt gói VIP</div>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: "#a16207" }}>3,000,000đ <span style={{ fontSize: 13, fontWeight: 600 }}>/ 15 ngày</span></div>
                                </div>
                                <button
                                    onClick={handleHighlightCompany}
                                    disabled={highlightLoading}
                                    style={{
                                        padding: "11px 24px", background: "linear-gradient(135deg, #eab308, #ca8a04)", 
                                        color: "#ffffff", border: "none", borderRadius: 8, fontSize: 13, 
                                        fontWeight: 800, cursor: highlightLoading ? "not-allowed" : "pointer",
                                        display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(234, 179, 8, 0.25)",
                                        transition: "transform 0.15s"
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                                >
                                    {highlightLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                    Kích hoạt VIP doanh nghiệp (3M)
                                </button>
                            </div>
                        </div>

                        {/* AUTOMATIC COURSE SALES REVENUE SPLIT INFO */}
                        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 22, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                            <h4 style={{ margin: "0 0 10px 0", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8, color: "#1e3a8a" }}>
                                <BookOpen size={20} style={{ color: "#3b82f6" }} />
                                Cơ chế Đăng bán khóa học & Chia sẻ doanh thu (85/15)
                            </h4>
                            <p style={{ margin: "0 0 16px 0", fontSize: 12.5, color: "#475569", lineHeight: 1.6 }}>
                                Việc đăng bán khóa học đã được tích hợp đầy đủ giá bán thực tế. Khi ứng viên thực hiện giao dịch đăng ký mua khóa học của bạn thông qua ví điện tử:
                            </p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px 18px", borderRadius: 12 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase", marginBottom: 4 }}>Nhà tuyển dụng thực nhận</div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "#15803d" }}>85% <span style={{ fontSize: 13, fontWeight: 600 }}>Giá trị khóa học</span></div>
                                    <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#166534", lineHeight: 1.4 }}>Số tiền được cộng trực tiếp, ngay lập tức vào Số dư ví khả dụng của bạn khi có lượt mua mới.</p>
                                </div>
                                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "16px 18px", borderRadius: 12 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", textTransform: "uppercase", marginBottom: 4 }}>Phí dịch vụ hệ thống</div>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "#1d4ed8" }}>15% <span style={{ fontSize: 13, fontWeight: 600 }}>Phí duy trì</span></div>
                                    <p style={{ margin: "6px 0 0 0", fontSize: 11, color: "#1e40af", lineHeight: 1.4 }}>Khấu trừ tự động bởi VietJob nhằm nâng cấp hạ tầng băng thông lưu trữ bài giảng và hỗ trợ thanh toán.</p>
                                </div>
                            </div>
                        </div>

                        {/* Transaction history section */}
                        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h4 style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1e3a8a" }}>Lịch sử giao dịch ví</h4>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {["Tất cả", "Nạp ví", "Thanh toán", "Doanh thu"].map((f) => (
                                        <button 
                                          key={f} 
                                          onClick={() => setActiveFilter(f)} 
                                          style={{
                                            padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0",
                                            background: activeFilter === f ? "#1e3a8a" : "#ffffff",
                                            color: activeFilter === f ? "#ffffff" : "#475569",
                                            fontSize: 11.5, cursor: "pointer", fontWeight: 600, transition: "all 0.15s"
                                          }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {loading ? (
                                <div style={{ padding: 40, textAlign: "center" }}>
                                    <Loader2 size={24} className="animate-spin" style={{ color: "#3b82f6", margin: "0 auto" }} />
                                </div>
                            ) : filteredTransactions.length === 0 ? (
                                <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                                    Chưa có giao dịch nào được ghi nhận.
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {filteredTransactions.map((t, idx) => {
                                        const isDeposit = t.Type === "Nap";
                                        const isCommission = t.Type === "BanKhoaHoc";
                                        
                                        let sign = "-";
                                        let color = "#dc2626";
                                        let bg = "rgba(239, 68, 68, 0.08)";
                                        let icon = <ArrowDownLeft size={16} />;

                                        if (isDeposit) {
                                            sign = "+";
                                            color = "#16a34a";
                                            bg = "rgba(22, 163, 74, 0.08)";
                                            icon = <ArrowUpRight size={16} />;
                                        } else if (isCommission) {
                                            sign = "+";
                                            color = "#2563eb";
                                            bg = "rgba(37, 99, 235, 0.08)";
                                            icon = <ArrowUpRight size={16} />;
                                        }

                                        return (
                                            <div 
                                              key={t.Id} 
                                              style={{ padding: "14px 20px", borderBottom: idx < filteredTransactions.length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", alignItems: "center", gap: 14, transition: "background 0.1s" }}
                                              onMouseEnter={e => e.currentTarget.style.background = "#fafbfe"}
                                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                <div style={{ width: 36, height: 36, borderRadius: "50%", background: bg, color: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    {icon}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.Title}</div>
                                                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>
                                                        {new Date(t.CreatedAt).toLocaleString("vi-VN")} • {t.RefCode}
                                                    </div>
                                                </div>
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ fontWeight: 800, fontSize: 13.5, color: color }}>
                                                        {sign}{Math.abs(t.Amount).toLocaleString()} VND
                                                    </span>
                                                    <div style={{ marginTop: 4 }}>
                                                        <span style={{ background: bg, color: color, fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 12 }}>
                                                            {isDeposit ? "NẠP TIỀN" : isCommission ? "BÁN KHÓA HỌC" : "DỊCH VỤ VIP"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: WALLET TOP-UP PANEL */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        
                        {/* Top-up Panel */}
                        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 20, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                            <h4 style={{ margin: "0 0 16px 0", fontWeight: 800, fontSize: 14.5, color: "#1e3a8a", display: "flex", alignItems: "center", gap: 6 }}>
                                <QrCode size={18} /> Nạp tiền vào ví
                            </h4>
                            
                            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Chọn số tiền nạp (VND)</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                                {suggestedAmounts.map((amt) => (
                                    <button 
                                      key={amt} 
                                      onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }} 
                                      style={{
                                        padding: "10px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer",
                                        border: selectedAmount === amt && !customAmount ? "2px solid #2563eb" : "1px solid #cbd5e1",
                                        background: selectedAmount === amt && !customAmount ? "#eff6ff" : "#ffffff",
                                        color: selectedAmount === amt && !customAmount ? "#2563eb" : "#475569",
                                        transition: "all 0.15s"
                                      }}
                                    >
                                        {(amt / 1000000).toFixed(0)} Triệu
                                    </button>
                                ))}
                                <button 
                                  onClick={() => { setCustomAmount("1000000"); }}
                                  style={{ 
                                    padding: "10px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", 
                                    border: "1px solid #cbd5e1", background: "#ffffff", color: "#475569" 
                                  }}
                                >
                                    Khác
                                </button>
                            </div>

                            <div style={{ position: "relative", marginBottom: 16 }}>
                                <input
                                    type="text"
                                    placeholder="Nhập số tiền cần nạp..."
                                    value={customAmount ? Number(customAmount).toLocaleString("vi-VN") : ""}
                                    onChange={e => setCustomAmount(e.target.value.replace(/\D/g, ""))}
                                    style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                                />
                                {customAmount && (
                                    <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, fontWeight: 600, color: "#64748b" }}>VND</span>
                                )}
                            </div>

                            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Cổng thanh toán QR</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                                {banks.map((b) => (
                                    <div 
                                      key={b.id} 
                                      onClick={() => setSelectedBank(b.id)} 
                                      style={{
                                        display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10,
                                        border: selectedBank === b.id ? `2px solid ${b.color}` : "1px solid #cbd5e1",
                                        background: selectedBank === b.id ? b.color + "0a" : "#ffffff",
                                        cursor: "pointer", transition: "all 0.15s",
                                      }}
                                    >
                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: b.color + "1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{b.icon}</div>
                                        <div style={{ fontWeight: 700, fontSize: 12.5, color: "#1e293b" }}>{b.name}</div>
                                        {selectedBank === b.id && <span style={{ marginLeft: "auto", color: b.color, fontWeight: 800 }}>✓</span>}
                                    </div>
                                ))}
                            </div>

                            <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Tổng tiền nạp</span>
                                <span style={{ fontWeight: 800, fontSize: 16, color: "#2563eb" }}>
                                    {finalAmount.toLocaleString()} <span style={{ fontSize: 11, fontWeight: 600 }}>VND</span>
                                </span>
                            </div>

                            <button 
                              onClick={handleShowQR}
                              style={{ 
                                width: "100%", padding: "12px 0", borderRadius: 10, border: "none", 
                                background: "linear-gradient(135deg, #2563eb, #8b5cf6)", color: "#ffffff", 
                                fontSize: 13.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)" 
                              }}
                            >
                                Hiện mã QR thanh toán
                            </button>
                        </div>

                        {/* Support details */}
                        <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", padding: 16, display: "flex", flexDirection: "column", gap: 12, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <HelpCircle size={18} style={{ color: "#3b82f6", flexShrink: 0, marginTop: 1 }} />
                                <div>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>Trợ giúp giao dịch?</div>
                                    <div style={{ fontSize: 11.5, color: "#64748b", lineHeight: 1.4 }}>Số dư ví nạp hoặc chia sẻ được kết nối trực tiếp với CSDL SQL của hệ thống. Vui lòng liên hệ Hotline nếu gặp trục trặc!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* QR Payment Modal */}
            {showQR && (() => {
                const b = banks.find(x => x.id === selectedBank);
                const qrUrl = `https://img.vietqr.io/image/${b.bin}-${b.account}-compact2.png?amount=${finalAmount}&addInfo=${qrRefCode}&accountName=${encodeURIComponent(b.accountName)}`;
                return (
                    <div onClick={e => e.target === e.currentTarget && setShowQR(false)}
                        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:9999,
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <div style={{ background:"#fff", borderRadius:20, padding:"28px 28px 20px",
                            width:340, boxShadow:"0 20px 60px rgba(0,0,0,0.25)", textAlign:"center", position:"relative" }}>
                            <button onClick={() => setShowQR(false)}
                                style={{ position:"absolute", top:12, right:14, background:"none",
                                    border:"none", fontSize:20, cursor:"pointer", color:"#94a3b8" }}>×</button>
                            <div style={{ fontWeight:800, fontSize:15, color:"#1e293b", marginBottom:4 }}>
                                {b.icon} Quét QR để nạp tiền
                            </div>
                            <div style={{ fontSize:12, color:"#64748b", marginBottom:14 }}>
                                {b.name} · Mã: <b style={{color:"#7c3aed"}}>{qrRefCode}</b>
                            </div>
                            <img src={qrUrl} alt="QR" style={{ width:200, height:200,
                                borderRadius:12, border:"2px solid #e2e8f0", objectFit:"contain", marginBottom:14 }} />
                            <div style={{ background:"#f8fafc", borderRadius:10, padding:"10px 14px",
                                marginBottom:14, textAlign:"left", fontSize:12, color:"#475569", lineHeight:1.8 }}>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <span>Ngân hàng</span><b style={{color:"#1e293b"}}>{b.name}</b></div>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <span>Số TK</span><b style={{color:"#1e293b"}}>{b.account}</b></div>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <span>Chủ TK</span><b style={{color:"#1e293b"}}>{b.accountName}</b></div>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <span>Số tiền</span><b style={{color:"#2563eb"}}>{finalAmount.toLocaleString()} VND</b></div>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                    <span>Nội dung CK</span><b style={{color:"#7c3aed"}}>{qrRefCode}</b></div>
                            </div>
                            <button onClick={handleConfirmPayment} disabled={confirmLoading}
                                style={{ width:"100%", padding:"11px 0", borderRadius:10, border:"none",
                                    background: confirmLoading?"#94a3b8":"linear-gradient(135deg,#16a34a,#15803d)",
                                    color:"#fff", fontSize:13, fontWeight:700,
                                    cursor: confirmLoading?"not-allowed":"pointer",
                                    display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                                {confirmLoading
                                    ? <><Loader2 size={15} className="animate-spin" /> Đang xử lý...</>
                                    : <><CheckCircle size={15} /> Tôi đã chuyển khoản xong</>}
                            </button>
                            <p style={{ margin:"8px 0 0", fontSize:11, color:"#94a3b8" }}>
                                <span style={{display: "flex", alignItems: "center", gap: 4, justifyContent: "center"}}><AlertCircle size={14}/> Chỉ bấm sau khi đã chuyển khoản thành công</span>
                            </p>
                        </div>
                    </div>
                );
            })()}
            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}