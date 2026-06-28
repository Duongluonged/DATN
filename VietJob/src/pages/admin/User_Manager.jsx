import { CheckCircle, Pen, Trash, User, Flame, Ban, Key, AlertTriangle, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/common/admin_c/sidebar";
import Topbar from "../../components/common/admin_c/topbar";



const ROLE_COLORS = {
  employer: { bg: "rgba(249,115,22,0.15)", text: "#fb923c" },
  member: { bg: "rgba(100,116,139,0.15)", text: "#94a3b8" },
  talent: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
};

const TABS = ["Tất cả", "Nhà tuyển dụng", "Ứng viên"];

function StatCard({ icon, label, value, change, up, loading }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: up ? "rgba(59,130,246,0.12)" : "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 6px", borderRadius: 6, color: up ? "#16a34a" : "#dc2626", background: up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}>{change}</span>
      </div>
      {loading ? (
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: "#3b82f6", marginBottom: 2 }} />
      ) : (
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 2, color: "#111827" }}>{value}</div>
      )}
      <div style={{ fontSize: 11, color: "#6b7280" }}>{label}</div>
    </div>
  );
}

function UserTable({ users, activeTab, setActiveTab, loading, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleApprove = async (userId, email) => {
    if (!window.confirm(`Xác nhận duyệt tài khoản ${email}?`)) return;
    try {
      await axios.post("http://localhost:5000/api/auth/approve", { userId, email });
      alert("Đã duyệt nhà tuyển dụng thành công!");
      onRefresh();
    } catch (err) {
      alert("Lỗi khi duyệt: " + (err.response?.data?.error || err.message));
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn từ chối tài khoản này?")) return;
    try {
      await axios.post("http://localhost:5000/api/auth/reject", { userId });
      alert("Đã từ chối nhà tuyển dụng!");
      onRefresh();
    } catch (err) {
      alert("Lỗi khi từ chối: " + (err.response?.data?.error || err.message));
    }
  };

  const handleLockUser = async (userId, email) => {
    if (!window.confirm(`Bạn có chắc muốn KHÓA tài khoản ${email}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`);
      alert("Đã khóa tài khoản thành công!");
      onRefresh();
    } catch (err) {
      alert("Lỗi khi khóa: " + (err.response?.data?.error || err.message));
    }
  };


  const filteredUsers = users.filter(u => {
    if (u.RoleName === "Admin") return false;

    if (activeTab === "Nhà tuyển dụng" && u.RoleName !== "Employer") return false;
    if (activeTab === "Ứng viên" && u.RoleName !== "Candidate") return false;

    if (statusFilter !== "all") {
      const isPending = u.Status?.toLowerCase() === "pending" || u.Status?.toLowerCase() === "chờ duyệt";
      const isRejected = u.Status?.toLowerCase() === "rejected" || u.Status?.toLowerCase() === "từ chối";
      const isLocked = u.Status?.toLowerCase() === "locked" || u.Status?.toLowerCase() === "khóa";
      const isActive = !isPending && !isRejected && !isLocked;

      if (statusFilter === "active" && !isActive) return false;
      if (statusFilter === "pending" && !isPending) return false;
      if (statusFilter === "locked" && !isLocked && !isRejected) return false;
    }

    if (searchTerm.trim() !== "") {
      const s = searchTerm.toLowerCase();
      const nameMatch = u.Username?.toLowerCase().includes(s);
      const emailMatch = u.Email?.toLowerCase().includes(s);
      const idMatch = String(u.Id).includes(s);
      return nameMatch || emailMatch || idMatch;
    }

    return true;
  });


  const totalPages = Math.max(Math.ceil(filteredUsers.length / itemsPerPage), 1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab]);

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 16, overflow: "hidden" }}>

      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", gap: 12, flexWrap: "wrap" }}>

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

        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, justifyContent: "flex-end", maxWidth: 500 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Tìm theo tên, email, mã..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%", padding: "6px 10px 6px 32px", fontSize: 12,
                borderRadius: 8, border: "1px solid #e2e8f0", outline: "none",
                fontFamily: "inherit",
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "6px 12px", background: "#f8fafc", color: "#4b5563",
              border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12,
              fontWeight: 500, cursor: "pointer", fontFamily: "inherit", outline: "none"
            }}
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending">Chờ duyệt</option>
            <option value="locked">Bị khóa / Từ chối</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#fcfdfe" }}>
              {["STT", "HỌ VÀ TÊN", "EMAIL", "VAI TRÒ", "TRẠNG THÁI", "THAO TÁC"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", width: h === "STT" ? 60 : "auto" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
                  <Loader2 size={24} style={{ animation: "spin 1s linear infinite", margin: "0 auto 8px auto", color: "#3b82f6" }} />
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af", fontSize: 12.5 }}>
                  Không tìm thấy người dùng nào phù hợp.
                </td>
              </tr>
            ) : (
              currentItems.map((u, index) => {
                let roleKey = "member";
                if (u.RoleName === "Employer") roleKey = "employer";
                const rc = ROLE_COLORS[roleKey] || ROLE_COLORS.member;

                const initials = u.Username ? u.Username.substring(0, 2).toUpperCase() : "US";
                const isPending = u.RoleName !== "Candidate" && (u.Status?.toLowerCase() === "pending" || u.Status?.toLowerCase() === "chờ duyệt");
                const isRejected = u.Status?.toLowerCase() === "rejected" || u.Status?.toLowerCase() === "từ chối";
                const isLocked = u.Status?.toLowerCase() === "locked" || u.Status?.toLowerCase() === "khóa";
                const isActive = !isPending && !isRejected && !isLocked;

                return (
                  <tr key={u.Id} style={{ borderBottom: "1px solid #e2e8f0", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfe"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                      {String(indexOfFirstItem + index + 1).padStart(2, '0')}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, #3b82f6, #8b5cf6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                          {initials}
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#111827" }}>{u.Username}</div>
                          <div style={{ fontSize: 10.5, color: "#6b7280" }}>Mã ID: {u.Id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>{u.Email}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: rc.bg, color: rc.text }}>
                        {u.RoleName === "Employer" ? "Nhà tuyển dụng" : u.RoleName === "Candidate" ? "Ứng viên" : u.RoleName || "Thành viên"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#111827", fontWeight: 500 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: isActive ? "#22c55e" : (isPending ? "#f59e0b" : "#ef4444"), boxShadow: isActive ? "0 0 6px rgba(34,197,94,0.25)" : "none" }} />
                        {isPending ? "Chờ duyệt" : isLocked ? "Đã khóa" : isRejected ? "Từ chối" : "Hoạt động"}
                      </div>
                    </td>
                    <td style={{ textAlign: "left", padding: "12px 16px" }}>
                      {isPending && u.RoleName === "Employer" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => handleApprove(u.Id, u.Email)} style={{ padding: "4px 10px", background: "#22c55e", color: "white", borderRadius: "6px", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2 }}>Duyệt</button>
                          <button onClick={() => handleReject(u.Id)} style={{ padding: "4px 10px", background: "#ef4444", color: "white", borderRadius: "6px", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer" }}>Từ chối</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => handleLockUser(u.Id, u.Email)} disabled={!isActive} style={{ background: "transparent", border: "none", cursor: isActive ? "pointer" : "not-allowed", color: isActive ? "#ef4444" : "#cbd5e1", display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 500 }} title="Khóa tài khoản">
                            <Trash size={14} />
                            <span>Khóa</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>


      <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", background: "#fcfdfe" }}>
        <div style={{ fontSize: 11.5, color: "#6b7280" }}>
          Hiển thị <b>{Math.min(indexOfLastItem, filteredUsers.length)}</b> trên <b>{filteredUsers.length}</b> người dùng
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            style={{
              padding: "4px 8px", background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 6, fontSize: 11, cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "#94a3b8" : "#475569",
            }}
          >Trước</button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  width: 28, height: 28,
                  background: currentPage === pageNum ? "#3b82f6" : "#f8fafc",
                  border: `1px solid ${currentPage === pageNum ? "#3b82f6" : "#e2e8f0"}`,
                  borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
                  color: currentPage === pageNum ? "#fff" : "#475569",
                  fontWeight: currentPage === pageNum ? "600" : "400"
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            style={{
              padding: "4px 8px", background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 6, fontSize: 11, cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              color: currentPage === totalPages ? "#94a3b8" : "#475569",
            }}
          >Sau</button>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { icon: <Key size={20} />, bg: "rgba(59,130,246,0.15)", title: "Xác thực tài khoản mới", desc: "Nhà tuyển dụng Dương Lê vừa hoàn tất xác minh doanh nghiệp VietJob và đã được kích hoạt.", time: "Vừa xong" },
    { icon: <AlertTriangle size={20} />, bg: "rgba(239,68,68,0.15)", title: "Cảnh báo bảo mật", desc: "Hệ thống phát hiện tài khoản đăng ký trùng lặp IP và tự động đưa vào danh sách kiểm duyệt.", time: "30 phút trước" },
  ];
  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Hoạt động hệ thống gần đây</span>
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


function RoleDistribution({ users }) {
  const total = users.length || 1;
  const candidates = users.filter(u => u.RoleName === "Candidate").length;
  const employers = users.filter(u => u.RoleName === "Employer").length;
  const admins = users.filter(u => u.RoleName === "Admin").length;

  const candidatePct = Math.round((candidates / total) * 100) || 0;
  const employerPct = Math.round((employers / total) * 100) || 0;
  const adminPct = Math.round((admins / total) * 100) || 0;

  const bars = [
    { label: "Ứng viên", count: candidates, pct: candidatePct, color: "#3b82f6", textColor: "#3b82f6" },
    { label: "Nhà tuyển dụng", count: employers, pct: employerPct, color: "#f97316", textColor: "#f97316" },
    { label: "Quản trị viên", count: admins, pct: adminPct, color: "#ef4444", textColor: "#ef4444" },
  ];

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Mật độ vai trò</span>
        <span style={{ fontSize: 10, color: "#6b7280", fontWeight: "600" }}>LIVE DATABASE</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 42, fontWeight: 700, color: "#3b82f6", lineHeight: 1 }}>{candidatePct}%</div>
        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, marginBottom: 16 }}>là ứng viên tuyển dụng (Candidate)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bars.map(b => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 11, color: "#475569", width: 100, flexShrink: 0 }}>{b.label} ({b.count})</div>
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


export default function User_Manager() {
  const [activeNav, setActiveNav] = useState("User Management");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalCount = users.filter(u => u.RoleName !== "Admin").length;
  const activeCount = users.filter(u =>
    u.RoleName !== "Admin" &&
    (u.RoleName === "Candidate" || u.Status?.toLowerCase() !== "pending") &&
    u.Status?.toLowerCase() !== "rejected" &&
    u.Status?.toLowerCase() !== "locked"
  ).length;
  const employerCount = users.filter(u => u.RoleName === "Employer").length;
  const blockedCount = users.filter(u => u.RoleName !== "Admin" && (u.Status?.toLowerCase() === "rejected" || u.Status?.toLowerCase() === "locked")).length;

  const STATS = [
    { icon: <User size={20} />, label: "Tổng người dùng", value: totalCount.toLocaleString(), change: "Hệ thống", up: true },
    { icon: <CheckCircle size={20} />, label: "Tài khoản Active", value: activeCount.toLocaleString(), change: "Hoạt động", up: true },
    { icon: <Flame size={20} />, label: "Nhà tuyển dụng", value: employerCount.toLocaleString(), change: "Tuyển dụng", up: true },
    { icon: <Ban size={20} />, label: "Tài khoản bị khóa", value: blockedCount.toLocaleString(), change: "Bị khóa", up: false },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Be Vietnam Pro', sans-serif", color: "#111827", fontSize: 13 }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Quản lý người dùng</div>
              <div style={{ color: "#888", fontSize: 12, maxWidth: 480, lineHeight: 1.5 }}>
                Kiểm soát truy cập, phân quyền và giám sát hoạt động của tất cả người dùng trong hệ thống IT Career VN.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={fetchUsers} style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>
                <span>Làm mới dữ liệu</span>
              </button>
            </div>
          </div>


          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {STATS.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
          </div>


          <UserTable
            users={users}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            loading={loading}
            onRefresh={fetchUsers}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ActivityFeed />
            <RoleDistribution users={users} />
          </div>
        </main>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}