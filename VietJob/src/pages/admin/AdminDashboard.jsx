import { useState, useEffect } from "react";
import { Calendar, Download, User, Briefcase, Book, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import Sidebar from "../../components/common/admin_c/sidebar";
import Topbar from "../../components/common/admin_c/topbar";
import axios from "axios";

const API = "http://localhost:5000/api";

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  app: {
    display: "flex", height: "100vh",
    background: "#f4f5f7",
    fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif",
    fontSize: 13, color: "#1a1a2e", overflow: "hidden",
  },
  main:    { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  content: { flex: 1, overflowY: "auto", padding: 24 },
  card:    { background: "#fff", borderRadius: 10, border: "0.5px solid #eee", padding: "14px 16px" },
  statGrid:   { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 },
  midGrid:    { display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 14 },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  btn: (variant) => ({
    display: "flex", alignItems: "center", gap: 5,
    padding: "7px 14px", borderRadius: 8,
    fontSize: 12, fontWeight: 500, cursor: "pointer",
    background: variant === "primary" ? "#3b5bdb" : "#fff",
    color: variant === "primary" ? "#fff" : "#555",
    border: variant === "primary" ? "none" : "0.5px solid #ddd",
  }),
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, iconColor, iconBg, icon, loading }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor }}>
          {icon}
        </div>
      </div>
      {loading ? (
        <div style={{ height: 32, display: "flex", alignItems: "center" }}>
          <Loader2 size={18} style={{ animation: "spin 1s linear infinite", color: "#3b5bdb" }} />
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{value?.toLocaleString() ?? "—"}</div>
          {sub && (
            <div style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#e8f5e9", color: "#2e7d32" }}>
              {sub}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Trend Chart ─────────────────────────────────────────────────────────────
function TrendChart({ data, loading }) {
  if (loading) return (
    <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "#3b5bdb" }} />
    </div>
  );
  if (!data || data.length === 0) return (
    <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 12 }}>
      Chưa có dữ liệu
    </div>
  );

  const W = 460, H = 140, padL = 10, padB = 20, padT = 10;
  const chartW = W - padL - 10;
  const chartH = H - padB - padT;
  const values = data.map(d => d.value);
  const min = 0;
  const max = Math.max(...values, 1);
  const pts = data.map((d, i) => ({
    x: padL + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padT + (1 - (d.value - min) / (max - min)) * chartH,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${H - padB} L${pts[0].x},${H - padB} Z`;
  const last = pts[pts.length - 1];
  const lastData = data[data.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", marginTop: 8 }}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b5bdb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b5bdb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#f0f0f0" strokeWidth="1" />
      <line x1={padL} y1={H - padB} x2={W - 10} y2={H - padB} stroke="#f0f0f0" strokeWidth="1" />
      {[0.25, 0.5, 0.75].map(t => (
        <line key={t} x1={padL} y1={padT + t * chartH} x2={W - 10} y2={padT + t * chartH}
          stroke="#f5f5f5" strokeWidth="0.5" strokeDasharray="4,4" />
      ))}
      <path d={areaPath} fill="url(#grad)" />
      <path d={linePath} fill="none" stroke="#3b5bdb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 4}
          fill={i === pts.length - 1 ? "#3b5bdb" : "#fff"} stroke="#3b5bdb" strokeWidth="2" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={pts[i].x} y={H - 4} textAnchor="middle"
          fontSize="9" fill={i === data.length - 1 ? "#3b5bdb" : "#aaa"}
          fontWeight={i === data.length - 1 ? "600" : "400"}>
          {d.month}
        </text>
      ))}
      {data.length > 0 && (
        <>
          <rect x={last.x - 45} y={padT - 8} width="90" height="28" rx="6" fill="#1a1a2e" />
          <text x={last.x} y={padT + 5} textAnchor="middle" fontSize="9" fill="#aaa">{lastData.month}</text>
          <text x={last.x} y={padT + 17} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">{lastData.value} tin</text>
        </>
      )}
    </svg>
  );
}

// ─── Growth Card ──────────────────────────────────────────────────────────────
function GrowthCard({ value, loading }) {
  return (
    <div style={{ background: "#3b5bdb", borderRadius: 10, padding: 16, color: "#fff" }}>
      <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>Tăng Trưởng Người Dùng</div>
      <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 10 }}>Người dùng mới tháng này</div>
      {loading ? (
        <Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        <div style={{ fontSize: 30, fontWeight: 700 }}>+{(value ?? 0).toLocaleString()}</div>
      )}
      <div style={{ fontSize: 11, opacity: 0.7 }}>tháng này</div>
      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 5, marginTop: 14 }}>
        <div style={{ background: "#fff", borderRadius: 4, height: "100%", width: "60%" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, opacity: 0.7 }}>
        <span>NGƯỜI DÙNG MỚI</span><span>Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</span>
      </div>
    </div>
  );
}

// ─── Hot Jobs List ────────────────────────────────────────────────────────────
function HotJobsList({ jobs, loading }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Tin Tuyển Dụng Hot</div>
        <div style={{ fontSize: 11, color: "#aaa" }}>Top lượt xem</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", fontSize: 10.5, color: "#aaa", fontWeight: 600, paddingBottom: 6, borderBottom: "0.5px solid #f0f0f0", marginBottom: 4 }}>
        <span>VỊ TRÍ</span><span>CÔNG TY</span><span style={{ textAlign: "right" }}>LƯỢT XEM</span>
      </div>
      {loading ? (
        <div style={{ height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "#3b5bdb" }} />
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", color: "#bbb", padding: "20px 0", fontSize: 12 }}>Chưa có dữ liệu</div>
      ) : (
        jobs.map((job, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr", alignItems: "center",
            padding: "7px 0", borderBottom: i < jobs.length - 1 ? "0.5px solid #f9f9f9" : "none",
          }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{job.title}</div>
            <div style={{ fontSize: 10.5, color: "#777" }}>{job.company || "—"}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#3b5bdb", textAlign: "right" }}>
              {(job.views ?? 0).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Reports Panel (placeholder — có thể kết nối API Reports sau) ─────────────
function ReportsSummary({ count, loading }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Báo Cáo Chờ Xử Lý</div>
        <a href="/admin/Report_Management" style={{ fontSize: 11, color: "#3b5bdb", textDecoration: "none" }}>Xem Tất Cả →</a>
      </div>
      {loading ? (
        <div style={{ height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "#3b5bdb" }} />
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fffde7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={22} color="#f59f00" />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f59f00" }}>{count ?? 0}</div>
            <div style={{ fontSize: 11, color: "#888" }}>báo cáo đang chờ admin xử lý</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/stats`);
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Lỗi fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const statCards = [
    {
      label: "Tổng Người Dùng",
      value: stats?.totalUsers,
      iconColor: "#3b5bdb", iconBg: "#e8eeff",
      icon: <User size={16} />,
    },
    {
      label: "Tin Tuyển Dụng",
      value: stats?.totalJobs,
      iconColor: "#e65100", iconBg: "#fff3e0",
      icon: <Briefcase size={16} />,
    },
    {
      label: "Khóa Học Hoạt Động",
      value: stats?.totalCourses,
      iconColor: "#7048e8", iconBg: "#f3e8ff",
      icon: <Book size={16} />,
    },
    {
      label: "Báo Cáo Chờ Duyệt",
      value: stats?.pendingReports,
      sub: "Chờ xử lý",
      iconColor: "#f59f00", iconBg: "#fffde7",
      icon: <AlertTriangle size={16} />,
    },
  ];

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <div style={styles.main}>
        <Topbar />

        <div style={styles.content}>
          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Bảng điều khiển Admin</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                Tổng quan hệ thống VietJob
                {lastUpdated && (
                  <span style={{ marginLeft: 8, color: "#bbb" }}>
                    · Cập nhật lúc {lastUpdated.toLocaleTimeString("vi-VN")}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={fetchStats} style={styles.btn("outline")} disabled={loading}>
                <RefreshCw size={14} style={loading ? { animation: "spin 1s linear infinite" } : {}} />
                <span>Làm mới</span>
              </button>
              <button style={styles.btn("primary")}>
                <Download size={14} />
                <span>Xuất Báo Cáo</span>
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={styles.statGrid}>
            {statCards.map((s, i) => (
              <StatCard key={i} {...s} loading={loading} />
            ))}
          </div>

          {/* Chart + Growth */}
          <div style={styles.midGrid}>
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Xu Hướng Đăng Tuyển</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Số tin tuyển dụng 6 tháng gần nhất</div>
                </div>
              </div>
              <TrendChart data={stats?.trend ?? []} loading={loading} />
            </div>
            <GrowthCard value={stats?.newUsersThisMonth} loading={loading} />
          </div>

          {/* Bottom */}
          <div style={styles.bottomGrid}>
            <ReportsSummary count={stats?.pendingReports} loading={loading} />
            <HotJobsList jobs={stats?.hotJobs ?? []} loading={loading} />
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 10, color: "#bbb", padding: "10px 24px", borderTop: "0.5px solid #f0f0f0", background: "#fff" }}>
          © 2024 VietJob Admin Portal. All rights reserved. · Phiên bản 2.4.0
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}