import { CheckCircle, Pen, Trash, User, Flame, Ban, Key, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/common/admin_c/sidebar";
import Topbar from "../../components/common/admin_c/topbar";

// ─── Icon helpers ──────────────────────────────────────────────
const Icon = ({ d, size = 15, stroke = "currentColor", sw = 2, viewBox = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

// ─── Data ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: "Dashboard", icon: "grid" },
  { label: "User Management", icon: "users", active: true },
  { label: "Job Listings", icon: "briefcase" },
  { label: "Courses", icon: "layers" },
  { label: "System Categories", icon: "settings" },
  { label: "Violations", icon: "bell" },
  { label: "Reports", icon: "file" },
];

const STATS = [
  { icon: <User size={20} />, label: "Tổng người dùng", value: "24,512", change: "+5%", up: true },
  { icon: <CheckCircle size={20} />, label: "Tài khoản Active", value: "23,105", change: "+5%", up: true },
  { icon: <Flame size={20} />, label: "Nhà tuyển dụng", value: "1,240", change: "Ổn định", up: true },
  { icon: <Ban size={20} />, label: "Tài khoản bị khóa", value: "167", change: "-8%", up: false },
];

const USERS = [
  { initials: "LT", color: ["#3b82f6", "#8b5cf6"], name: "Lê Minh Tuấn", id: "#LMT-4821", email: "tuan@techvn.com", role: "Quản trị", roleKey: "admin", active: true },
  { initials: "PH", color: ["#f97316", "#ef4444"], name: "Phạm Thùy Hạnh", id: "#PTH-3317", email: "hanh.ph@fpt.vn", role: "Nhà tuyển dụng", roleKey: "employer", active: true },
  { initials: "NB", color: ["#22c55e", "#16a34a"], name: "Nguyễn Văn Ba", id: "#NVB-2904", email: "ba.nv.dev@gmail.com", role: "Lập trình viên", roleKey: "member", active: false },
  { initials: "TH", color: ["#a855f7", "#7c3aed"], name: "Trần Lê Thu Hà", id: "#TLTH-0756", email: "thuha.tran@voo.com", role: "Nhà tuyển dụng", roleKey: "talent", active: true },
];

const ROLE_COLORS = {
  employer: { bg: "rgba(249,115,22,0.15)", text: "#fb923c" },
  member: { bg: "rgba(100,116,139,0.15)", text: "#94a3b8" },
  talent: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
};

const TABS = ["Tất cả", "Nhà tuyển dụng", "Ứng viên"];

// ─── NavIcon map ────────────────────────────────────────────────
function NavIcon({ type, size = 15, color = "currentColor" }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></>,
    layers: <><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></>,
    help: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    filter: <><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17,8 12,3 7,8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {paths[type]}
    </svg>
  );
}


function StatCard({ icon, label, value, change, up }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: up ? "rgba(59,130,246,0.12)" : "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 6, color: up ? "#16a34a" : "#dc2626", background: up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>{change}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2, color: "#111827" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#6b7280" }}>{label}</div>
    </div>
  );
}

function UserTable({ activeTab, setActiveTab }) {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId, email) => {
    if (!window.confirm(`Xác nhận duyệt tài khoản ${email}?`)) return;
    try {
      await axios.post("http://localhost:5000/api/auth/approve", { userId, email });
      alert("Đã duyệt thành công!");
      fetchUsers();
    } catch (err) {
      alert("Lỗi khi duyệt: " + (err.response?.data?.error || err.message));
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn từ chối tài khoản này?")) return;
    try {
      await axios.post("http://localhost:5000/api/auth/reject", { userId });
      alert("Đã từ chối!");
      fetchUsers();
    } catch (err) {
      alert("Lỗi khi từ chối: " + (err.response?.data?.error || err.message));
    }
  };

  // Lọc users theo tab
  const filteredUsers = users.filter(u => {
    if (u.RoleName === "Admin") return false; // Loại bỏ Admin khỏi danh sách
    if (activeTab === "Tất cả") return true;
    if (activeTab === "Nhà tuyển dụng") return u.RoleName === "Employer";
    if (activeTab === "Ứng viên") return u.RoleName === "Candidate";
    return true;
  });

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", gap: 2, background: "#f8fafc", borderRadius: 8, padding: 3 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: "5px 12px", borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                cursor: "pointer", border: "none", fontFamily: "inherit",
                background: activeTab === tab ? "#ffffff" : "transparent",
                color: activeTab === tab ? "#111827" : "#6b7280",
                boxShadow: activeTab === tab ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s",
              }}
            >{tab}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button style={{ background: "#f8fafc", color: "#4b5563", border: "1px solid #e2e8f0", borderRadius: 8, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Trạng thái: Tất cả ▾
          </button>
          <div style={{ width: 30, height: 30, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <NavIcon type="filter" size={13} color="#6b7280" />
          </div>
        </div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
            {["STT", "HỌ VÀ TÊN", "EMAIL", "VAI TRÒ", "TRẠNG THÁI", "THAO TÁC"].map(h => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", width: h === "STT" ? 50 : "auto" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, index) => {
            let roleKey = "member";
            if (u.RoleName === "Employer") roleKey = "employer";
            const rc = ROLE_COLORS[roleKey] || ROLE_COLORS.member;

            const initials = u.Username ? u.Username.substring(0, 2).toUpperCase() : "U";
            const isPending = u.Status === "pending";
            const isRejected = u.Status === "rejected";
            const isActive = !isPending && !isRejected;

            return (
              <tr key={u.Id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "11px 16px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                  {String(index + 1).padStart(2, '0')}
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, #3b82f6, #8b5cf6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{u.Username}</div>
                      <div style={{ fontSize: 10.5, color: "#6b7280" }}>Mã: {u.Id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "11px 16px", fontSize: 12, color: "#475569" }}>{u.Email}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: rc.bg, color: rc.text }}>{u.RoleName || "Member"}</span>
                </td>
                <td style={{ padding: "11px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#111827" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? "#22c55e" : (isPending ? "#f59e0b" : "#ef4444"), boxShadow: isActive ? "0 0 6px rgba(34,197,94,0.25)" : "none" }} />
                    {isPending ? "Chờ duyệt" : isRejected ? "Từ chối" : "Hoạt động"}
                  </div>
                </td>
                <td style={{ textAlign: "left", padding: "10px 16px" }}>
                  {isPending && u.RoleName === "Employer" ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => handleApprove(u.Id, u.Email)} style={{ padding: "4px 10px", background: "#22c55e", color: "white", borderRadius: "4px", fontSize: 12, border: "none", cursor: "pointer" }}>Duyệt</button>
                      <button onClick={() => handleReject(u.Id)} style={{ padding: "4px 10px", background: "#ef4444", color: "white", borderRadius: "4px", fontSize: 12, border: "none", cursor: "pointer" }}>Từ chối</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280" }}><Pen size={16} /></button>
                      <button style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444" }}><Trash size={16} /></button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Footer / Pagination */}
      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ fontSize: 11.5, color: "#6b7280" }}>Hiển thị {filteredUsers.length} người dùng</div>
        <div style={{ display: "flex", gap: 4 }}>
          {["1", "2", "3", "...", "Cuối"].map((p, i) => (
            <button key={i} style={{
              width: p === "Cuối" ? 40 : 28, height: 28, background: p === "1" ? "#3b82f6" : "#f8fafc",
              border: `1px solid ${p === "1" ? "#3b82f6" : "#e2e8f0"}`,
              borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
              color: p === "1" ? "#fff" : "#475569",
            }}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { icon: <Key size={20} />, bg: "rgba(59,130,246,0.15)", title: "Xác thực tài khoản mới", desc: "Người dùng Dương Lê Thiện VNG vừa hoàn tất xác minh doanh nghiệp và đã đặt cầu tuyển dụng.", time: "5 phút trước" },
    { icon: <AlertTriangle size={20} />, bg: "rgba(239,68,68,0.15)", title: "Cảnh báo bảo mật", desc: "Phát hiện đăng nhập đồng thời từ hai địa chỉ IP. Hệ thống đã tạm thời khóa tài khoản dev@gmail.com.", time: "45 phút trước" },
  ];
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Gần đây</span>
      </div>
      {activities.map((a, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", borderBottom: i < activities.length - 1 ? "1px solid #e2e8f0" : "none" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{a.icon}</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827", marginBottom: 3 }}>{a.title}</div>
            <div style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.4 }}>{a.desc}</div>
            <div style={{ fontSize: 10.5, color: "#475569", marginTop: 4 }}>{a.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function RoleDistribution() {
  const bars = [
    { label: "Ứng viên", pct: 88, color: "#3b82f6", textColor: "#60a5fa" },
    { label: "Nhà tuyển dụng", pct: 10, color: "#f97316", textColor: "#fb923c" },
    { label: "Quản trị viên", pct: 2, color: "#ef4444", textColor: "#f87171" },
  ];
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Mật độ vai trò</span>
        <span style={{ fontSize: 11, color: "#6b7280" }}>DỮ LIỆU THÁNG 10</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: "#2563eb", lineHeight: 1 }}>88%</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, marginBottom: 16 }}>là ứng viên (Job Seekers)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bars.map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 11, color: "#475569", width: 100, flexShrink: 0 }}>{b.label}</div>
              <div style={{ flex: 1, height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${b.pct}%`, height: "100%", background: b.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, width: 32, textAlign: "right", flexShrink: 0, color: b.textColor }}>{b.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────
export default function User_Manager() {
  const [activeNav, setActiveNav] = useState("User Management");
  const [activeTab, setActiveTab] = useState("Tất cả");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#111827", fontSize: 13 }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          {/* Page header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Quản lý người dùng</div>
              <div style={{ color: "#888", fontSize: 12, maxWidth: 480, lineHeight: 1.5 }}>
                Kiểm soát truy cập, phân quyền và giám sát hoạt động của tất cả người dùng trong hệ thống IT Career VN.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                <NavIcon type="plus" size={13} color="#fff" /> Thêm người dùng
              </button>
              <button style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                <NavIcon type="upload" size={13} color="#475569" /> Xuất báo cáo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {STATS.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Table */}
          <UserTable activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Bottom */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ActivityFeed />
            <RoleDistribution />
          </div>
        </main>
      </div>
    </div>
  );
}