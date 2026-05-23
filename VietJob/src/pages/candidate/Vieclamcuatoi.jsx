import { useState, useEffect } from "react";
import { MessageCircle, CalendarDays, Eye, XCircle, Mail, Clock, ExternalLink, ChevronRight, Check, Info, RefreshCw, CheckCircle } from "lucide-react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API = "http://localhost:5000/api";

const c = {
  blue: "#1a56db", blueLt: "#e8f0fe",
  border: "#e5e7eb", bg: "#f5f7fa", white: "#fff",
  text: "#111827", muted: "#6b7280",
};

/* ─── Chuyển đổi Status từ DB sang hiển thị ─── */
const STATUS_MAP = {
  "Mới":          { label: "ĐANG CHỜ",       color: "#a16207", bg: "#fef9c3" },
  "Đang xem xét": { label: "ĐANG XEM XÉT",   color: "#4338ca", bg: "#e0e7ff" },
  "Phỏng vấn":    { label: "HẸN PHỎNG VẤN",  color: "#15803d", bg: "#dcfce7" },
  "Đã tuyển":     { label: "ĐÃ TUYỂN",        color: "#0369a1", bg: "#e0f2fe" },
  "Từ chối":      { label: "TỪ CHỐI",         color: "#b91c1c", bg: "#fee2e2" },
};

/* ─── SUB-COMPONENTS ─── */
function StatCard({ icon: Icon, num, label, badge, badgeColor, badgeBg, iconColor }) {
  return (
    <div style={{ background: c.white, border: `1px solid ${c.border}`, borderRadius: 12, padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Icon size={20} color={iconColor} />
        {badge && (
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: badgeBg, color: badgeColor }}>{badge}</span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 11, color: c.muted }}>{label}</div>
    </div>
  );
}

function JobCard({ app, navigate }) {
  const statusInfo = STATUS_MAP[app.Status] || STATUS_MAP["Mới"];
  const isRejected = app.Status === "Từ chối";
  const isInterview = app.Status === "Phỏng vấn";
  const isHired = app.Status === "Đã tuyển";

  // Lấy 2 chữ cái đầu tên công ty làm logo
  const logoText = (app.CompanyName || "??").substring(0, 2).toUpperCase();

  // Tính thời gian ứng tuyển
  const appliedDate = new Date(app.AppliedAt);
  const now = new Date();
  const diffDays = Math.floor((now - appliedDate) / (1000 * 60 * 60 * 24));
  const timeAgo = diffDays === 0 ? "Hôm nay" : diffDays === 1 ? "1 ngày trước" : `${diffDays} ngày trước`;

  return (
    <div style={{
      background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, padding: 20,
      display: "flex", flexDirection: "column", gap: 10, position: "relative",
      opacity: isRejected ? 0.65 : 1,
      transition: "box-shadow .2s",
    }}>
      {/* Status badge */}
      <span style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: statusInfo.bg, color: statusInfo.color }}>
        {statusInfo.label}
      </span>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#e8f0fe", border: `1px solid ${c.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#1a56db" }}>{logoText}</span>
        </div>
        <div style={{ flex: 1, paddingRight: 100 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2, color: isRejected ? c.muted : c.text }}>
            {app.JobTitle}
          </div>
          <div style={{ fontSize: 12, color: c.muted }}>{app.CompanyName} · {app.Location}</div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {app.JobType && (
          <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#f3f4f6", color: "#374151", border: `1px solid ${c.border}` }}>
            {app.JobType}
          </span>
        )}
        {app.SalaryRange && (
          <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
            {app.SalaryRange}
          </span>
        )}
      </div>

      {/* Interview notice */}
      {isInterview && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarDays size={18} color="#15803d" />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#15803d", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 2 }}>Lịch hẹn phỏng vấn</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Nhà tuyển dụng sẽ liên hệ với bạn</div>
          </div>
        </div>
      )}

      {/* Hired notice */}
      {isHired && (
        <div style={{ background: "#e0f2fe", border: "1px solid #7dd3fc", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <Check size={18} color="#0369a1" />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0369a1" }}>Chúc mừng! Bạn đã được tuyển dụng 🎉</div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
          {isRejected
            ? <><Mail size={12} /> Nhà tuyển dụng đã từ chối hồ sơ</>
            : <><Clock size={12} /> Ứng tuyển: {timeAgo}</>}
        </span>
        <span
          onClick={() => navigate(`/jobs/${app.JobID}`)}
          style={{ fontSize: 12, fontWeight: 700, color: c.blue, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
        >
          <ExternalLink size={13} /> Xem tin
        </span>
      </div>
    </div>
  );
}

/* ─── PAGE ─── */
export default function ViecLamCuaToi() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.successMsg || null);

  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userObj?.id || null;

  const fetchApplications = async () => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await axios.get(`${API}/applications/candidate/${userId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách ứng tuyển:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [userId]);

  // Tự ẩn toast sau 4 giây
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  /* ─── Tính toán stats từ dữ liệu thực ─── */
  const stats = [
    {
      icon: MessageCircle, iconColor: "#1d4ed8",
      num: String(applications.filter(a => a.Status === "Mới" || a.Status === "Đang xem xét").length).padStart(2, "0"),
      label: "Đang chờ phản hồi",
      badge: applications.length > 0 ? `+${applications.length} tổng` : null,
      badgeColor: "#1d4ed8", badgeBg: "#dbeafe",
    },
    {
      icon: CalendarDays, iconColor: "#15803d",
      num: String(applications.filter(a => a.Status === "Phỏng vấn").length).padStart(2, "0"),
      label: "Hẹn phỏng vấn",
      badge: applications.filter(a => a.Status === "Phỏng vấn").length > 0 ? "Mới" : null,
      badgeColor: "#15803d", badgeBg: "#dcfce7",
    },
    {
      icon: Eye, iconColor: "#6b7280",
      num: String(applications.filter(a => a.Status === "Đang xem xét").length).padStart(2, "0"),
      label: "Nhà tuyển dụng đã xem",
    },
    {
      icon: XCircle, iconColor: "#ef4444",
      num: String(applications.filter(a => a.Status === "Từ chối").length).padStart(2, "0"),
      label: "Từ chối",
    },
  ];

  /* ─── Lọc theo tab ─── */
  const TAB_FILTERS = [null, "applied", "Mới"];
  const filtered = activeTab === 0
    ? applications
    : activeTab === 1
      ? applications // "Đã ứng tuyển" = tất cả
      : applications.filter(a => a.Status === "Mới");

  const TABS = [
    `Tất cả (${applications.length})`,
    "Đã ứng tuyển",
    "Đang chờ",
  ];

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 22 }}>

          {/* ✅ Toast thông báo ứng tuyển thành công */}
          {successMsg && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: "12px 18px",
              animation: "fadeIn .3s ease",
            }}>
              <CheckCircle size={18} color="#15803d" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d", flex: 1 }}>{successMsg}</span>
              <span onClick={() => setSuccessMsg(null)} style={{ cursor: "pointer", color: "#15803d", fontWeight: 700, fontSize: 16 }}>×</span>
            </div>
          )}

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Việc làm của tôi</h1>
              <p style={{ fontSize: 13, color: c.muted }}>Theo dõi trạng thái và quản lý các đơn ứng tuyển của bạn.</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={fetchApplications}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, border: `1px solid ${c.border}`, background: c.white, cursor: "pointer", fontSize: 12, color: c.muted, fontFamily: "inherit" }}
              >
                <RefreshCw size={13} /> Làm mới
              </button>
              {TABS.map((tab, i) => (
                <button key={i} onClick={() => setActiveTab(i)} style={{
                  padding: "6px 14px", borderRadius: 8, border: `1px solid ${c.border}`,
                  background: activeTab === i ? c.blue : c.white,
                  color: activeTab === i ? "#fff" : c.muted,
                  fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .12s", fontFamily: "inherit",
                }}>{tab}</button>
              ))}
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: 14 }}>
            {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
          </div>

          {/* Job cards */}
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: c.muted }}>
              <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: 8 }} />
              <div>Đang tải dữ liệu...</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: 40, color: "#ef4444", background: "#fef2f2", borderRadius: 12 }}>
              {error}
            </div>
          ) : !userId ? (
            <div style={{ textAlign: "center", padding: 40, color: c.muted, background: c.white, borderRadius: 12, border: `1px solid ${c.border}` }}>
              Vui lòng <span onClick={() => navigate("/login")} style={{ color: c.blue, cursor: "pointer", fontWeight: 600 }}>đăng nhập</span> để xem lịch sử ứng tuyển.
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: c.muted, background: c.white, borderRadius: 12, border: `1px solid ${c.border}` }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Chưa có đơn ứng tuyển nào</div>
              <div style={{ fontSize: 12 }}>Hãy tìm kiếm và ứng tuyển các vị trí phù hợp với bạn!</div>
              <button onClick={() => navigate("/")} style={{ marginTop: 16, padding: "8px 20px", background: c.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit" }}>
                Tìm việc ngay
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {filtered.map((app) => (
                <JobCard key={app.ApplicationID} app={app} navigate={navigate} />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}