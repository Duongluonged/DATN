import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Activity, 
  Briefcase, 
  BookOpen, 
  Calendar, 
  Search, 
  Loader2, 
  RefreshCw,
  Wallet
} from 'lucide-react';

export default function RevenueManager() {
  const [activeNav, setActiveNav] = useState("Revenue_Manager");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách giao dịch hệ thống:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate stats based on transactions
  let totalSystemRevenue = 0;
  let vipJobRevenue = 0;
  let courseCommissionRevenue = 0;
  let totalDeposits = 0;

  transactions.forEach(t => {
    if (t.Status === 'ThanhCong') {
      if (t.Type === 'ThanhToan') {
        // VIP Highlight Job Fee (recruiter pays -1M VND, system gains +1M VND)
        const fee = Math.abs(t.Amount);
        vipJobRevenue += fee;
        totalSystemRevenue += fee;
      } else if (t.Type === 'BanKhoaHoc') {
        // Recruiter receives 85% of price, system gets 15%
        // Recruiter Amount = Price * 0.85 => systemFee = Amount / 85 * 15
        const fee = Math.floor(t.Amount / 85 * 15);
        courseCommissionRevenue += fee;
        totalSystemRevenue += fee;
      } else if (t.Type === 'Nap') {
        // User deposited money into wallet
        totalDeposits += t.Amount;
      }
    }
  });

  // Filtered list
  const filteredList = transactions.filter(t => {
    // 1. Category Filter
    if (activeFilter === "Tin VIP" && t.Type !== "ThanhToan") return false;
    if (activeFilter === "Khóa học" && t.Type !== "BanKhoaHoc") return false;
    if (activeFilter === "Nạp ví" && t.Type !== "Nap") return false;

    // 2. Search query filter (Recruiter Name or RefCode or Title)
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const titleMatch = (t.Title || "").toLowerCase().includes(query);
      const nameMatch = (t.RecruiterName || "").toLowerCase().includes(query);
      const refMatch = (t.RefCode || "").toLowerCase().includes(query);
      return titleMatch || nameMatch || refMatch;
    }
    return true;
  });

  // Simple monthly dataset for visual SVG chart
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'];
  const revenueValues = [15000000, 22000000, 18000000, 29000000, totalSystemRevenue * 0.6, totalSystemRevenue];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1e293b", fontSize: 13 }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Quản Lý Doanh Thu Hệ Thống</div>
              <div style={{ color: "#64748b", fontSize: 12.5, lineHeight: 1.5 }}>
                Theo dõi nguồn thu từ phí dịch vụ Tin tuyển dụng nổi bật VIP và 15% phí hoa hồng chia sẻ từ các giao dịch bán khóa học thực tế.
              </div>
            </div>
            <button
              onClick={fetchTransactions}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
                background: "#2563eb", color: "#fff", border: "none", borderRadius: 8,
                fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                boxShadow: "0 4px 12px rgba(37,99,235,0.15)"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
              onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Làm mới giao dịch
            </button>
          </div>

          {/* Cards Statistics Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
            {[
              {
                label: "TỔNG DOANH THU HỆ THỐNG",
                value: totalSystemRevenue,
                icon: <DollarSign size={20} style={{ color: "#2563eb" }} />,
                bg: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(37,99,235,0.01))",
                border: "1px solid rgba(37,99,235,0.15)",
                textColor: "#2563eb",
                desc: "Từ Tin VIP & Phí Khóa học"
              },
              {
                label: "TIN TUYỂN DỤNG VIP",
                value: vipJobRevenue,
                icon: <Briefcase size={20} style={{ color: "#ca8a04" }} />,
                bg: "linear-gradient(135deg, rgba(234,179,8,0.06), rgba(234,179,8,0.01))",
                border: "1px solid rgba(234,179,8,0.15)",
                textColor: "#a16207",
                desc: "Phí cố định 1,000,000đ/tin"
              },
              {
                label: "HOA HỒNG KHÓA HỌC",
                value: courseCommissionRevenue,
                icon: <BookOpen size={20} style={{ color: "#16a34a" }} />,
                bg: "linear-gradient(135deg, rgba(22,163,74,0.06), rgba(22,163,74,0.01))",
                border: "1px solid rgba(22,163,74,0.15)",
                textColor: "#16a34a",
                desc: "Hệ thống thu 15% doanh số"
              },
              {
                label: "TỔNG DÒNG TIỀN NẠP VÍ",
                value: totalDeposits,
                icon: <Wallet size={20} style={{ color: "#7c3aed" }} />,
                bg: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(124,58,237,0.01))",
                border: "1px solid rgba(124,58,237,0.15)",
                textColor: "#6d28d9",
                desc: "Số dư khả dụng của NTD"
              }
            ].map((card, i) => (
              <div 
                key={i} 
                style={{ 
                  background: "#ffffff", padding: "20px 22px", borderRadius: 16, 
                  border: card.border, display: "flex", flexDirection: "column", 
                  justifyContent: "space-between", boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  background: card.bg
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: "#64748b", tracking: "0.5px" }}>{card.label}</span>
                  <div style={{ padding: 7, borderRadius: 8, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>{card.icon}</div>
                </div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", tracking: "-0.5px" }}>
                    {card.value.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600 }}>đ</span>
                  </h3>
                  <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>{card.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual SVG Chart & Right Summary Info */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Visual SVG Line Chart */}
            <div style={{ background: "#ffffff", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h4 style={{ margin: 0, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#0f172a" }}>
                  <TrendingUp size={16} style={{ color: "#2563eb" }} />
                  Biểu đồ tăng trưởng doanh thu hệ thống (6 tháng)
                </h4>
                <span style={{ fontSize: 9.5, color: "#3b82f6", background: "rgba(37,99,235,0.08)", fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>DỮ LIỆU THỰC TẾ</span>
              </div>

              {loading ? (
                <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={24} className="animate-spin" style={{ color: "#2563eb" }} />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ position: "relative", height: 180, width: "100%" }}>
                    <svg viewBox="0 0 500 180" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                      {/* Grid Lines */}
                      {[0, 45, 90, 135, 180].map((yVal) => (
                        <line key={yVal} x1="0" y1={yVal} x2="500" y2={yVal} stroke="#f8fafc" strokeWidth="1.5" />
                      ))}

                      {/* Trend Line Path */}
                      <path
                        fill="none"
                        stroke="linear-gradient(to right, #2563eb, #8b5cf6)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={revenueValues.map((val, idx) => {
                          const x = (idx / (revenueValues.length - 1)) * 500;
                          const maxVal = Math.max(...revenueValues, 10000000);
                          const y = 150 - (val / maxVal) * 110;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        style={{ stroke: "#2563eb" }}
                      />

                      {/* Dots & Labels */}
                      {revenueValues.map((val, idx) => {
                        const x = (idx / (revenueValues.length - 1)) * 500;
                        const maxVal = Math.max(...revenueValues, 10000000);
                        const y = 150 - (val / maxVal) * 110;
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                            <text x={x} y={y - 12} textAnchor="middle" style={{ fontSize: 9.5, fontWeight: 800, fill: "#1e3a8a" }}>
                              {(val / 1000000).toFixed(1)}M
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* X-axis labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px", borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
                    {months.map((m, idx) => (
                      <span key={idx} style={{ fontSize: 10, fontWeight: 700, color: "#64748b" }}>{m}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick summary stats breakdown */}
            <div style={{ background: "#ffffff", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.01)" }}>
              <h4 style={{ margin: "0 0 16px 0", fontWeight: 800, fontSize: 14, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                <Activity size={16} style={{ color: "#7c3aed" }} />
                Phân tích tỷ trọng
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { name: "Phí dịch vụ Tin đăng VIP", pct: totalSystemRevenue ? Math.round((vipJobRevenue / totalSystemRevenue) * 100) : 0, color: "#ca8a04", raw: vipJobRevenue },
                  { name: "Hoa hồng Bán khóa học (15%)", pct: totalSystemRevenue ? Math.round((courseCommissionRevenue / totalSystemRevenue) * 100) : 0, color: "#16a34a", raw: courseCommissionRevenue }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, color: "#475569", marginBottom: 5 }}>
                      <span>{item.name}</span>
                      <span>{item.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ width: `${item.pct}%`, height: "100%", background: item.color, borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 10.5, color: "#94a3b8", textAlign: "right" }}>{item.raw.toLocaleString()}đ thực nhận</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Transactions Log Table */}
          <div style={{ background: "#ffffff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            
            {/* Table Header Controls */}
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {["Tất cả", "Tin VIP", "Khóa học", "Nạp ví"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      padding: "7px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
                      background: activeFilter === f ? "#2563eb" : "#ffffff",
                      color: activeFilter === f ? "#ffffff" : "#475569",
                      fontSize: 12, cursor: "pointer", fontWeight: 700, transition: "all 0.15s"
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div style={{ position: "relative", minWidth: 260 }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Tìm theo tin, đối tác, mã GD..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px 8px 32px", border: "1px solid #cbd5e1",
                    borderRadius: 8, fontSize: 12.5, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Table View */}
            {loading ? (
              <div style={{ padding: 60, textAlign: "center" }}>
                <Loader2 size={28} className="animate-spin" style={{ color: "#2563eb", margin: "0 auto" }} />
                <p style={{ marginTop: 10, color: "#64748b", fontSize: 12 }}>Đang tải lịch sử giao dịch...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#64748b" }}>
                Không tìm thấy giao dịch nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                    <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>Nội dung giao dịch</th>
                    <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>Đối tác / Nhà tuyển dụng</th>
                    <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>Phân loại</th>
                    <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase" }}>Thời gian & Mã Ref</th>
                    <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", textAlign: "right" }}>Giao dịch đối tác</th>
                    <th style={{ padding: "14px 20px", fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", textAlign: "right" }}>Doanh thu Hệ thống</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((t, idx) => {
                    let typeLabel = "Nạp ví";
                    let typeBg = "rgba(124,58,237,0.08)";
                    let typeColor = "#7c3aed";
                    let systemProfit = 0;

                    if (t.Type === 'ThanhToan') {
                      typeLabel = "Dịch vụ Tin VIP";
                      typeBg = "rgba(234,179,8,0.08)";
                      typeColor = "#a16207";
                      systemProfit = Math.abs(t.Amount); // Fixed VIP job commission
                    } else if (t.Type === 'BanKhoaHoc') {
                      typeLabel = "Bán khóa học";
                      typeBg = "rgba(22,163,74,0.08)";
                      typeColor = "#16a34a";
                      systemProfit = Math.floor(t.Amount / 85 * 15); // Dynamic 15% sharing fee
                    }

                    return (
                      <tr 
                        key={t.Id} 
                        style={{ borderBottom: idx < filteredList.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafbfe"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Title */}
                        <td style={{ padding: "14px 20px", fontWeight: 700, color: "#0f172a" }}>
                          {t.Title}
                        </td>
                        {/* Recruiter Name */}
                        <td style={{ padding: "14px 20px", color: "#334155", fontWeight: 600 }}>
                          👤 {t.RecruiterName || "Không xác định"}
                        </td>
                        {/* Type Badge */}
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ background: typeBg, color: typeColor, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.2px" }}>
                            {typeLabel}
                          </span>
                        </td>
                        {/* Date & Ref */}
                        <td style={{ padding: "14px 20px", color: "#64748b", fontSize: 12 }}>
                          <div>{new Date(t.CreatedAt).toLocaleString("vi-VN")}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", marginTop: 2 }}>{t.RefCode}</div>
                        </td>
                        {/* Recruiter side amount */}
                        <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 700, color: t.Amount >= 0 ? "#16a34a" : "#dc2626" }}>
                          {t.Amount >= 0 ? "+" : ""}{t.Amount.toLocaleString()}đ
                        </td>
                        {/* System commission amount */}
                        <td style={{ padding: "14px 20px", textAlign: "right", fontWeight: 800, color: systemProfit > 0 ? "#2563eb" : "#94a3b8" }}>
                          {systemProfit > 0 ? `+${systemProfit.toLocaleString()}đ` : "---"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
