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

const STATUS_MAP = {
  "Mới": { label: "ĐANG CHỜ", color: "#a16207", bg: "#fef9c3" },
  "Đang xem xét": { label: "ĐANG XEM XÉT", color: "#4338ca", bg: "#e0e7ff" },
  "Phỏng vấn": { label: "HẸN PHỎNG VẤN", color: "#15803d", bg: "#dcfce7" },
  "Đã tuyển": { label: "ĐÃ TUYỂN", color: "#0369a1", bg: "#e0f2fe" },
  "Từ chối": { label: "TỪ CHỐI", color: "#b91c1c", bg: "#fee2e2" },
};

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

function JobCard({ app, navigate, onChat }) {
  const statusInfo = STATUS_MAP[app.Status] || STATUS_MAP["Mới"];
  const isRejected = app.Status === "Từ chối";
  const isInterview = app.Status === "Phỏng vấn";
  const isHired = app.Status === "Đã tuyển";

  const logoText = (app.CompanyName || "??").substring(0, 2).toUpperCase();

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
      <span style={{ position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: statusInfo.bg, color: statusInfo.color }}>
        {statusInfo.label}
      </span>

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

      {isInterview && (
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarDays size={18} color="#15803d" />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#15803d", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 2 }}>Lịch hẹn phỏng vấn</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Nhà tuyển dụng sẽ liên hệ với bạn</div>
          </div>
        </div>
      )}

      {isHired && (
        <div style={{ background: "#e0f2fe", border: "1px solid #7dd3fc", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <Check size={18} color="#0369a1" />
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0369a1" }}>Chúc mừng! Bạn đã được tuyển dụng 🎉</div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
          {isRejected
            ? <><Mail size={12} /> Nhà tuyển dụng đã từ chối hồ sơ</>
            : <><Clock size={12} /> Ứng tuyển: {timeAgo}</>}
        </span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {app.CompanyID && (
            <span
              onClick={() => onChat(app.CompanyID, app.CompanyName)}
              style={{ fontSize: 12, fontWeight: 700, color: "#0284c7", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
            >
              <MessageCircle size={13} /> Nhắn tin
            </span>
          )}
          <span
            onClick={() => navigate(`/job-detail/${app.JobID}`)}
            style={{ fontSize: 12, fontWeight: 700, color: c.blue, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}
          >
            <ExternalLink size={13} /> Xem tin
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ViecLamCuaToi() {
  const navigate = useNavigate();
  const location = useLocation();

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatCompany, setChatCompany] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const handleChatWithEmployer = (companyId, companyName) => {
    if (!companyId) {
      alert("Không tìm thấy thông tin công ty.");
      return;
    }
    setChatCompany({ id: companyId, name: companyName });
    setChatMessage("");
    setChatModalOpen(true);
  };

  const submitChatMessage = async () => {
    if (!userId || !chatCompany || !chatMessage.trim()) return;
    setSendingChat(true);
    try {
      const res = await axios.get(`${API}/messages/employer-of-company/${chatCompany.id}`);
      const employerUserId = res.data.Id;

      await axios.post(`${API}/messages/send`, {
        senderId: userId,
        receiverId: employerUserId,
        messageContent: chatMessage
      });

      setChatModalOpen(false);
      setChatMessage("");
      navigate(`/candidate/Quan_ly_tin_nhan?partnerId=${employerUserId}`);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn nhanh:", err);
      alert("Doanh nghiệp này chưa kích hoạt tài khoản nhắn tin tuyển dụng.");
    } finally {
      setSendingChat(false);
    }
  };

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

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

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

  const TAB_FILTERS = [null, "applied", "Mới"];
  const filtered = activeTab === 0
    ? applications
    : activeTab === 1
      ? applications
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

          <div style={{ display: "flex", gap: 14 }}>
            {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
          </div>

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
                <JobCard key={app.ApplicationID} app={app} navigate={navigate} onChat={handleChatWithEmployer} />
              ))}
            </div>
          )}

          {chatModalOpen && chatCompany && (
            <div style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 9999, backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease"
            }}>
              <div style={{
                background: "#fff", borderRadius: 20, width: 460, padding: 24,
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                fontFamily: "'Be Vietnam Pro',sans-serif"
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>
                  Nhắn tin cho nhà tuyển dụng
                </h3>
                <p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 16 }}>
                  Gửi lời chào hoặc câu hỏi đến <strong style={{ color: "#1a56db" }}>{chatCompany.name}</strong>. Tin nhắn của bạn sẽ được gửi và lưu trực tiếp vào mục Tin nhắn.
                </p>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Lời chào gợi ý</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      "Xin chào, tôi muốn hỏi thăm về trạng thái hồ sơ ứng tuyển của mình.",
                      "Chào anh/chị, tôi rất quan tâm đến vị trí tuyển dụng và muốn trao đổi thêm.",
                      "Chào công ty, tôi đã ứng tuyển và muốn gửi lời chào đến HR đại diện."
                    ].map((txt, idx) => (
                      <div
                        key={idx}
                        onClick={() => setChatMessage(txt)}
                        style={{ fontSize: 11.5, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px 12px", borderRadius: 8, cursor: "pointer", color: "#475569", transition: "all 0.1s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
                      >
                        {txt}
                      </div>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Nhập tin nhắn khởi đầu của bạn tại đây..."
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  style={{
                    width: "100%", height: 100, border: "1.5px solid #cbd5e1", borderRadius: 12,
                    padding: "10px 12px", fontSize: 13, outline: "none", resize: "none", marginBottom: 16,
                    fontFamily: "inherit"
                  }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    onClick={() => { setChatModalOpen(false); setChatMessage(""); }}
                    style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", color: "#64748b", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={submitChatMessage}
                    disabled={sendingChat || !chatMessage.trim()}
                    style={{
                      padding: "8px 20px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg,#2563eb,#3b82f6)", color: "#fff",
                      fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6, opacity: (sendingChat || !chatMessage.trim()) ? 0.6 : 1
                    }}
                  >
                    {sendingChat ? "Đang gửi..." : "Gửi tin nhắn"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}