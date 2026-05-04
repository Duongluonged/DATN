import { useState } from "react";
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar.jsx';
import { Search, Filter, Eye, CheckCircle, XCircle, Plus, Hourglass } from "lucide-react";


const STATS = [
  { icon: <Hourglass size={20} />, label: "Đang chờ duyệt", value: "42" },
  { icon: <CheckCircle size={20} />, label: "Đã phê duyệt",   value: "1,284" },
  { icon: <XCircle size={20} />, label: "Hết hạn / bị từ",value: "18" },
];

const JOBS = [
  {
    emoji: "💻", bg: "#e8f0fe",
    title: "Senior Fullstack Developer (React/Node)",
    location: "TP.HCM", salary: "$2,000 – $4,200", type: "Toàn thời gian",
    employer: "VinGroup Technology", domain: "vingroup.net",
    status: "cho", statusLabel: "CHỜ DUYỆT",
    date: "Hôm nay, 09:30",
    actions: ["view", "approve", "reject"],
  },
  {
    emoji: "🎨", bg: "#fef0e7",
    title: "UI/UX Designer – Fintech Project",
    location: "Cầu Giấy, Hà Nội", salary: "$1,290", type: "Bán thời gian",
    employer: "FPT Software", domain: "fpt.com.vn",
    status: "da", statusLabel: "ĐÃ DUYỆT",
    date: "24/09/2024",
    actions: ["view", "add"],
  },
  {
    emoji: "🔐", bg: "#f0fdf4",
    title: "Cyber Security Analyst",
    location: "Từ xa", salary: "$2,500", type: "",
    employer: "Viettel Telecom", domain: "viettel.vn",
    status: "het", statusLabel: "HẾT HẠN",
    date: "12/04/2023",
    actions: ["view", "refresh"],
  },
  {
    emoji: "📱", bg: "#fdf4ff",
    title: "Product Manager (Mobile App)",
    location: "Q.1, TP.HCM", salary: "$5,500", type: "Toàn thời gian",
    employer: "Web Corporation", domain: "webcorp.io",
    status: "cho", statusLabel: "CHỜ DUYỆT",
    date: "Hôm nay, 10:45",
    actions: ["view", "approve", "reject"],
  },
];

const STATUS_STYLES = {
  cho: { bg: "#fff3cd", color: "#b45309" },
  da:  { bg: "#dcfce7", color: "#15803d" },
  het: { bg: "#fee2e2", color: "#b91c1c" },
  tam: { bg: "#ede9fe", color: "#7c3aed" },
};

// ─── SVG Icons ──────────────────────────────────────────────────
function SvgIcon({ type, size = 14, color = "currentColor" }) {
  const sw = 2;
  const p = { fill: "none", stroke: color, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    grid:      <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>,
    layers:    <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></>,
    bell:      <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    file:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></>,
    help:      <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    logout:    <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    eye:       <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    check:     <polyline points="20,6 9,17 4,12"/>,
    x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    refresh:   <><polyline points="23,4 23,11 16,11"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 11"/></>,
    filter:    <><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...p}>{icons[type]}</svg>
  );
}


// ─── Action icon ─────────────────────────────────────────────────
function ActionBtn({ iconType, hoverColor }) {
  const [hovered, setHovered] = useState(false);
  const colorMap = { green: "#22c55e", red: "#ef4444", default: "#8b93a7" };
  const borderColor = hovered ? (colorMap[hoverColor] || colorMap.default) : "#e8eaf0";
  const bg = hovered ? (hoverColor === "green" ? "#f0fdf4" : hoverColor === "red" ? "#fef2f2" : "#eef3ff") : "#fff";
  const iconColor = hovered ? (colorMap[hoverColor] || "#3b7efa") : "#8b93a7";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: 28, height: 28, border: `1px solid ${borderColor}`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: bg, transition: "all .15s" }}
    >
      <SvgIcon type={iconType} size={13} color={iconColor} />
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function JobListings() {
  const [activeNav, setActiveNav] = useState("Job Listings");
  const [activePage, setActivePage] = useState(1);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>

          {/* Page Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Quản lý tin tuyển dụng</div>
              <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>Phê duyệt và kiểm soát chất lượng nội dung tuyển dụng trên toàn hệ thống.</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              {["Tất cả", "Gần đây", "Ưa dùng"].map((label, i) => (
                <button key={label} style={{
                  border: i === 0 ? "none" : "1px solid #e8eaf0",
                  background: i === 0 ? "#3b7efa" : "#fff",
                  color: i === 0 ? "#fff" : "#8b93a7",
                  borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #e8eaf0", borderRadius: 10, padding: "14px 18px", minWidth: 110 }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: "#8b93a7", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ background: "#fff", border: "1px solid #e8eaf0", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e8eaf0" }}>
                  {["THÔNG TIN CÔNG VIỆC", "NHÀ TUYỂN DỤNG", "TRẠNG THÁI", "NGÀY Đ/HẠN", "THAO TÁC"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#8b93a7", textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JOBS.map((job, idx) => {
                  const ss = STATUS_STYLES[job.status];
                  return (
                    <tr key={idx} style={{ borderBottom: idx < JOBS.length - 1 ? "1px solid #e8eaf0" : "none" }}>
                      {/* Job cell */}
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 8, background: job.bg, border: "1px solid #e8eaf0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{job.emoji}</div>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3 }}>{job.title}</div>
                            <div style={{ fontSize: 11, color: "#8b93a7", display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <span>📍 {job.location}</span>
                              <span>💰 {job.salary}</span>
                              {job.type && <span>🕐 {job.type}</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Employer */}
                      <td style={{ padding: "10px 14px", verticalAlign: "middle" }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{job.employer}</div>
                        <div style={{ fontSize: 11, color: "#8b93a7" }}>{job.domain}</div>
                      </td>
                      {/* Status */}
                      <td style={{ padding: "10px 14px", verticalAlign: "middle" }}>
                        <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, background: ss.bg, color: ss.color, letterSpacing: ".02em" }}>{job.statusLabel}</span>
                      </td>
                      {/* Date */}
                      <td style={{ padding: "10px 14px", verticalAlign: "middle", fontSize: 12, color: "#1a1d27" }}>{job.date}</td>
                      {/* Actions */}
                      <td style={{ padding: "10px 14px", verticalAlign: "middle" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {job.actions.map(a => {
                            const map = { view: ["eye", "default"], approve: ["check", "green"], reject: ["x", "red"], add: ["plus", "default"], refresh: ["refresh", "default"] };
                            const [icon, hc] = map[a] || ["eye", "default"];
                            return <ActionBtn key={a} iconType={icon} hoverColor={hc} />;
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer */}
            <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e8eaf0" }}>
              <div style={{ fontSize: 11.5, color: "#8b93a7" }}>Hiển thị 1 – 4 trên 42 tin đăng</div>
              <div style={{ display: "flex", gap: 4 }}>
                {["1", "2", "3", "›"].map((p, i) => (
                  <button key={i} onClick={() => setActivePage(i + 1)} style={{
                    width: 28, height: 28,
                    background: activePage === i + 1 ? "#3b7efa" : "#fff",
                    border: `1px solid ${activePage === i + 1 ? "#3b7efa" : "#e8eaf0"}`,
                    borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
                    color: activePage === i + 1 ? "#fff" : "#8b93a7",
                  }}>{p}</button>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}