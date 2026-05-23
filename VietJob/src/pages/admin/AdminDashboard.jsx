import { useState } from "react";
import { NavLink } from "react-router-dom";
import { BarChart3, Bell, HelpCircle, LogOut, Calendar, Download, User, Briefcase, Book, AlertTriangle  } from "lucide-react";
import Sidebar from "../../components/common/admin_c/sidebar";
import Topbar from "../../components/common/admin_c/topbar";
// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 14, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);


const styles = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#f4f5f7",
    fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif",
    fontSize: 13,
    color: "#1a1a2e",
    overflow: "hidden",
  },
  sidebar: {
    width: 220,
    minWidth: 220,
    background: "#fff",
    borderRight: "0.5px solid #e8e8e8",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 16px 12px",
    borderBottom: "0.5px solid #f0f0f0",
  },
  logoIcon: {
    width: 34, height: 34,
    background: "#3b5bdb",
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontWeight: 700, fontSize: 13,
  },
  navItem: (active) => ({
    display: "flex", alignItems: "center", gap: 9,
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: 12.5,
    color: active ? "#3b5bdb" : "#555",
    background: active ? "#eef1ff" : "transparent",
    fontWeight: active ? 600 : 400,
    borderLeft: active ? "3px solid #3b5bdb" : "3px solid transparent",
    transition: "all 0.15s",
  }),
  main: {
    flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
  },
  topbar: {
    background: "#fff",
    borderBottom: "0.5px solid #e8e8e8",
    padding: "10px 24px",
    display: "flex", alignItems: "center", gap: 12,
    flexShrink: 0,
  },
  searchBox: {
    flex: 1, display: "flex", alignItems: "center", gap: 8,
    background: "#f5f5f7", borderRadius: 8, padding: "7px 12px",
  },
  content: {
    flex: 1, overflowY: "auto", padding: 24,
  },
  card: {
    background: "#fff", borderRadius: 10,
    border: "0.5px solid #eee", padding: "14px 16px",
  },
  statGrid: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20,
  },
  midGrid: {
    display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, marginBottom: 14,
  },
  bottomGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
  },
  btn: (variant) => ({
    display: "flex", alignItems: "center", gap: 5,
    padding: "7px 14px", borderRadius: 8,
    fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
    background: variant === "primary" ? "#3b5bdb" : "#fff",
    color: variant === "primary" ? "#fff" : "#555",
    // eslint-disable-next-line no-dupe-keys
    border: variant === "primary" ? "none" : "0.5px solid #ddd",
  }),
  iconBtn: {
    width: 32, height: 32, borderRadius: 8, background: "#f5f5f7",
    border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};


const statCards = [
  { label: "Tổng Người Dùng", value: "45,280", change: "+12.5%", up: true, iconColor: "#3b5bdb", iconBg: "#e8eeff", icon: <User size={20} /> },
  { label: "Tin Tuyển Dụng Mới", value: "1,245", change: "-8.2%", up: false, iconColor: "#e65100", iconBg: "#fff3e0", icon: <Briefcase size={20} /> },
  { label: "Khóa Học Hoạt Động", value: "382", change: "-2.4%", up: false, iconColor: "#7048e8", iconBg: "#f3e8ff", icon: <Book size={20} /> },
  { label: "Vi Phạm Chờ Duyệt", value: "14", change: "Chờ xử lý", up: true, iconColor: "#f59f00", iconBg: "#fffde7", icon: <AlertTriangle size={20} /> },
];

const violations = [
  { title: "Spam tin tuyển dụng", desc: "Người dùng: Ngô Văn Lên • 3 ngày trước", type: "warn", count: "3 lần" },
  { title: "Ngôn từ không phù hợp", desc: "Người dùng: Nguyễn Hiệu • 4 ngày trước", type: "warn", count: "2 lần" },
  { title: "Đăng nhập bất thường", desc: "Người dùng: Trần Minh Lê • 4 ngày trước", type: "err", count: "1 lần" },
];

const hotJobs = [
  { title: "Senior Java Developer", company: "TechWave Vn", views: "2.4k" },
  { title: "UI/UX Designer", company: "CreativeHub", views: "1.8k" },
  { title: "DevOps Engineer", company: "CloudScale", views: "1.5k" },
  { title: "Product Manager", company: "Unosoft", views: "1.2k" },
];

const chartData = [
  { month: "Th2", value: 75 }, { month: "Th3", value: 62 },
  { month: "Th4", value: 52 }, { month: "Th5", value: 38 },
  { month: "Th6", value: 28 }, { month: "Th7", value: 24 },
];


function StatCard({ label, value, change, up, iconColor, iconBg }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
        
          </svg>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        <div style={{
          fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
          background: up ? "#e8f5e9" : "#fff3e0",
          color: up ? "#2e7d32" : "#e65100",
        }}>
          {up && change !== "Chờ xử lý" ? "▲ " : change !== "Chờ xử lý" ? "▼ " : ""}{change}
        </div>
      </div>
    </div>
  );
}

function TrendChart() {
  const W = 460, H = 140, padL = 10, padB = 20, padT = 10;
  const chartW = W - padL - 10;
  const chartH = H - padB - padT;
  const min = 0, max = 100;
  const pts = chartData.map((d, i) => ({
    x: padL + (i / (chartData.length - 1)) * chartW,
    y: padT + ((d.value - min) / (max - min)) * chartH,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${H - padB} L${pts[0].x},${H - padB} Z`;

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
      <path d={linePath} fill="none" stroke="#3b5bdb" strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 4}
          fill={i === pts.length - 1 ? "#3b5bdb" : "#fff"}
          stroke="#3b5bdb" strokeWidth="2" />
      ))}
      {chartData.map((d, i) => (
        <text key={i} x={pts[i].x} y={H - 4} textAnchor="middle"
          fontSize="9" fill={i === chartData.length - 1 ? "#3b5bdb" : "#aaa"}
          fontWeight={i === chartData.length - 1 ? "600" : "400"}>
          {d.month}
        </text>
      ))}
      <rect x={pts[pts.length - 1].x - 45} y={padT - 8} width="90" height="28" rx="6" fill="#1a1a2e" />
      <text x={pts[pts.length - 1].x} y={padT + 5} textAnchor="middle" fontSize="9" fill="#aaa">Th7/2024</text>
      <text x={pts[pts.length - 1].x} y={padT + 17} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">1,245 tin</text>
    </svg>
  );
}

function GrowthCard() {
  return (
    <div style={{ background: "#3b5bdb", borderRadius: 10, padding: 16, color: "#fff" }}>
      <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>Tăng Trưởng Người Dùng</div>
      <div style={{ fontSize: 11, opacity: 0.65, marginBottom: 10 }}>Người dùng mới đăng ký</div>
      <div style={{ fontSize: 30, fontWeight: 700 }}>+12,4k</div>
      <div style={{ fontSize: 11, opacity: 0.7 }}>tháng này</div>
      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, height: 5, marginTop: 14 }}>
        <div style={{ background: "#fff", borderRadius: 4, height: "100%", width: "82%" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 10, opacity: 0.7 }}>
        <span>MỤC TIÊU QUÝ</span><span>82%</span>
      </div>
    </div>
  );
}

function ViolationList() {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Vi Phạm Mới Nhất</div>
        <div style={{ fontSize: 11, color: "#3b5bdb", cursor: "pointer" }}>Xem Tất Cả</div>
      </div>
      {violations.map((v, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 0",
          borderBottom: i < violations.length - 1 ? "0.5px solid #f5f5f5" : "none",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, flexShrink: 0,
            background: v.type === "err" ? "#fce4ec" : "#fff3e0",
          }}>
            {v.type === "err" ? "🚫" : "⚠"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{v.title}</div>
            <div style={{ fontSize: 10.5, color: "#aaa", marginTop: 1 }}>{v.desc}</div>
          </div>
          <div style={{
            fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
            background: v.type === "err" ? "#fce4ec" : "#fff3e0",
            color: v.type === "err" ? "#c62828" : "#bf360c",
          }}>
            {v.count}
          </div>
        </div>
      ))}
    </div>
  );
}

function HotJobsList() {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Tin Tuyển Dụng Hot</div>
        <div style={{ fontSize: 18, color: "#ccc", cursor: "pointer" }}>···</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", fontSize: 10.5, color: "#aaa", fontWeight: 600, paddingBottom: 6, borderBottom: "0.5px solid #f0f0f0", marginBottom: 4 }}>
        <span>VỊ TRÍ</span><span>CÔNG TY</span><span style={{ textAlign: "right" }}>LƯỢT XEM</span>
      </div>
      {hotJobs.map((job, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr", alignItems: "center",
          padding: "7px 0",
          borderBottom: i < hotJobs.length - 1 ? "0.5px solid #f9f9f9" : "none",
        }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>{job.title}</div>
          <div style={{ fontSize: 10.5, color: "#777" }}>{job.company}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#3b5bdb", textAlign: "right" }}>{job.views}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");

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
                Chào mừng quay trở lại. Đây là tổng quan về hiệu suất hệ thống IT Career VN hôm nay.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={styles.btn("outline")}>
                <Calendar size={14} />
                <span>7 Ngày Qua</span>
              </button>42

              <button style={styles.btn("primary")}>
                <Download size={14} />
                <span>Xuất Báo Cáo</span>
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div style={styles.statGrid}>
            {statCards.map((s, i) => <StatCard key={i} {...s} />)}
          </div>

          {/* Chart + Growth */}
          <div style={styles.midGrid}>
            <div style={styles.card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Xu Hướng Đăng Tuyển</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>Thống kê số lượng tin tuyển dụng trong 6 tháng qua</div>
                </div>
                <select style={{ fontSize: 11, border: "0.5px solid #eee", borderRadius: 6, padding: "4px 8px", color: "#555", background: "#fff" }}>
                  <option>Năm 2024</option>
                </select>
              </div>
              <TrendChart />
            </div>
            <GrowthCard />
          </div>

          {/* Bottom */}
          <div style={styles.bottomGrid}>
            <ViolationList />
            <HotJobsList />
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 10, color: "#bbb", padding: "10px 24px", borderTop: "0.5px solid #f0f0f0", background: "#fff" }}>
          © 2024 IT Career VN Admin Portal. All rights reserved. · Phiên bản 2.4.0
        </div>
      </div>
    </div>
  );
}