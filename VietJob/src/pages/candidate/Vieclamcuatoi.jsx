import { useState } from "react";
// Sửa lại cho đúng cấu trúc thư mục thực tế của bạn
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";

/* ─── DATA ─── */
const STATS = [
  { icon: "💬", num: "04", label: "Đang chờ phản hồi", badge: "+2 tuần này", badgeColor: "#1d4ed8", badgeBg: "#dbeafe" },
  { icon: "📅", num: "02", label: "Hẹn phỏng vấn",     badge: "Mới",          badgeColor: "#15803d", badgeBg: "#dcfce7" },
  { icon: "👁️", num: "06", label: "Nhà tuyển dụng đã xem" },
  { icon: "⊗",  num: "02", label: "Từ chối", iconColor: "#ef4444" },
];

const TABS = ["Tất cả (12)", "Đã ứng tuyển", "Đang Mở"];

const JOBS = [
  {
    id: 1,
    status: "ĐANG CHỜ",
    statusColor: "#a16207", statusBg: "#fef9c3",
    logoBg: "#f1f5f9", logoText: "CO", logoColor: "#94a3b8",
    title: "Senior UI/UX Designer",
    company: "Spotify Technology · Stockholm (Remote)",
    tags: ["Figma", "Design System"],
    salary: "$4k – $6k",
    time: "2 ngày trước",
    action: { label: "Chi tiết ›", type: "primary" },
  },
  {
    id: 2,
    status: "HẸN PHỎNG VẤN",
    statusColor: "#15803d", statusBg: "#dcfce7",
    logoBg: "#e0f2fe", logoText: "VC", logoColor: "#0284c7",
    title: "Creative Director",
    company: "Vincit · Helsinki, Finland",
    tags: ["Leadership", "Strategy", "Competitive"],
    time: "1 tuần trước",
    interview: "Thứ 4, 25 Tháng 10 · 14:00",
    action: { label: "Xác nhận ✓", type: "primary", secondary: "Hủy" },
  },
  {
    id: 3,
    status: "ĐÃ XEM",
    statusColor: "#4338ca", statusBg: "#e0e7ff",
    logoBg: "#eff6ff", logoText: "AD", logoColor: "#1d4ed8",
    title: "Product Designer",
    company: "Adobe Inc. · San Jose, CA",
    tags: ["SaaS", "Interaction"],
    salary: "$5k – $7k",
    time: "5 ngày trước",
    action: { label: "Xem tin tuyển dụng ↗", type: "primary" },
  },
  {
    id: 4,
    status: "TỪ CHỐI",
    statusColor: "#b91c1c", statusBg: "#fee2e2",
    logoBg: "#f3f4f6", logoText: "MP", logoColor: "#94a3b8",
    title: "Interaction Designer",
    company: "Meta Platforms · Menlo Park, CA",
    tags: ["Prototyping", "Unity"],
    time: "3 tuần trước",
    rejected: true,
    action: { label: "Xem lý do ⓘ", type: "muted" },
  },
];

const c = {
  blue: "#1a56db", blueLt: "#e8f0fe",
  border: "#e5e7eb", bg: "#f5f7fa", white: "#fff",
  text: "#111827", muted: "#6b7280",
};


/* ─── SUB-COMPONENTS ─── */
function StatCard({ icon, num, label, badge, badgeColor, badgeBg, iconColor }) {
  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 18, color: iconColor }}>{icon}</span>
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: badgeBg, color: badgeColor }}>{badge}</span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 11, color: c.muted }}>{label}</div>
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20, display: "flex", flexDirection: "column", gap: 10, position: "relative", opacity: job.rejected ? .65 : 1 }}>
      {/* Status badge */}
      <span style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: job.statusBg, color: job.statusColor }}>
        {job.status}
      </span>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: job.logoBg, border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: job.logoColor }}>{job.logoText}</span>
        </div>
        <div style={{ flex: 1, paddingRight: 80 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2, color: job.rejected ? c.muted : c.text }}>{job.title}</div>
          <div style={{ fontSize: 12, color: c.muted }}>{job.company}</div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {job.tags.map((tag, i) => (
          <span key={i} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#f3f4f6", color: "#374151", border: `1px solid ${c.border}` }}>{tag}</span>
        ))}
        {job.salary && (
          <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>{job.salary}</span>
        )}
      </div>

      {/* Interview box */}
      {job.interview && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>📅</span>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#15803d", letterSpacing: .4, textTransform: "uppercase", marginBottom: 2 }}>Lịch hẹn</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{job.interview}</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: c.muted }}>
          {job.rejected ? "📧 Đã gửi thư phản hồi" : `🕐 Lng tuyển: ${job.time}`}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {job.action.secondary && (
            <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", cursor: "pointer" }}>{job.action.secondary}</span>
          )}
          <span style={{ fontSize: 12, fontWeight: 700, color: job.action.type === "muted" ? c.muted : c.blue, cursor: "pointer" }}>
            {job.action.label}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
export default function ViecLamCuaToi() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>

      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Việc làm của tôi</h1>
              <p style={{ fontSize: 13, color: c.muted }}>Theo dõi trạng thái và quản lý các đơn ứng tuyển của bạn.</p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {TABS.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{
                  padding: "6px 14px", borderRadius: 8, border: `1px solid ${c.border}`,
                  background: activeTab === i ? c.blue : c.white,
                  color: activeTab === i ? "#fff" : c.muted,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .12s",
                }}>{tab}</button>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: 14 }}>
            {STATS.map((stat, i) => <StatCard key={i} {...stat} />)}
          </div>

          {/* Job cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {JOBS.map((job) => <JobCard key={job.id} job={job} />)}
          </div>

        </main>
      </div>
    </div>
  );
}