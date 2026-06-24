import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import Navbar from "../../components/common/Navbar";
import { Briefcase, Mail, ShieldCheck, Bell, CheckCheck, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api";

const getUserFromStorage = () => {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); }
  catch { return {}; }
};

// ─── Map thời gian ────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return `${Math.floor(diff / 604800)} tuần trước`;
};

// ─── Map loại thông báo → icon & màu ────────────────────────────
const TYPE_CONFIG = {
  invite: {
    icon: <Mail size={20} className="text-[#16A34A]" />,
    iconBg: "bg-[#F0FDF4]",
    badge: "Lời mời",
    badgeCls: "bg-green-100 text-green-600",
  },
  job: {
    icon: <Briefcase size={20} className="text-[#2563EB]" />,
    iconBg: "bg-[#EFF6FF]",
    badge: "Việc làm",
    badgeCls: "bg-blue-100 text-blue-600",
  },
  system: {
    icon: <ShieldCheck size={20} className="text-[#64748B]" />,
    iconBg: "bg-[#F1F5F9]",
    badge: "Hệ thống",
    badgeCls: "bg-gray-100 text-gray-500",
  },
};

const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "job", label: "Việc làm mới" },
  { key: "invite", label: "Lời mời" },
  { key: "system", label: "Hệ thống" },
];

// ─── MAIN COMPONENT ──────────────────────────────────────────────
const Thongbao = () => {
  const user = getUserFromStorage();
  const userId = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch thông báo từ API
  const fetchNotifications = useCallback(async (type = "all") => {
    if (!userId) { setLoading(false); return; }
    setLoading(true);
    try {
      const params = type !== "all" ? { type } : {};
      const res = await axios.get(`${API}/notifications/${userId}`, { params });
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Lỗi tải thông báo:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications(activeTab);
  }, [activeTab, fetchNotifications]);

  // Đánh dấu 1 thông báo đã đọc
  const handleRead = async (notifId) => {
    try {
      await axios.patch(`${API}/notifications/${notifId}/read`);
      setNotifications(prev =>
        prev.map(n => n.NotificationID === notifId ? { ...n, IsRead: true } : n)
      );
    } catch (err) {
      console.error("Lỗi đánh dấu đọc:", err);
    }
  };

  // Đánh dấu tất cả đã đọc
  const handleMarkAllRead = async () => {
    if (!userId) return;
    setMarkingAll(true);
    try {
      await axios.patch(`${API}/notifications/all/${userId}/read`);
      setNotifications(prev => prev.map(n => ({ ...n, IsRead: true })));
    } catch (err) {
      console.error("Lỗi đánh dấu tất cả:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.IsRead).length;

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: "#f5f7fa", color: "#111827", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-10">
          {/* ── Header ── */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-[28px] font-bold text-[#0F172A]">Thông báo</h1>
                {unreadCount > 0 && (
                  <span className="bg-[#2563EB] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {unreadCount} mới
                  </span>
                )}
              </div>
              <p className="text-[14px] text-[#64748B]">Cập nhật những cơ hội và tin tức mới nhất dành cho bạn.</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markingAll}
                  className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#2563EB] border border-[#BFDBFE] bg-[#EFF6FF] rounded-xl hover:bg-[#DBEAFE] transition-all disabled:opacity-60"
                >
                  <CheckCheck size={15} />
                  {markingAll ? "Đang cập nhật..." : "Đánh dấu tất cả đã đọc"}
                </button>
              )}
              <button
                onClick={() => fetchNotifications(activeTab)}
                className="p-2.5 text-[#64748B] border border-[#E2E8F0] bg-white rounded-xl hover:bg-[#F8FAFC] transition-all"
                title="Làm mới"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* ── Filter Tabs ── */}
          <div className="flex gap-2 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] w-fit mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 text-[13px] font-semibold rounded-lg transition-all ${activeTab === tab.key
                    ? "bg-[#3B82F6] text-white shadow-md"
                    : "text-[#64748B] hover:bg-white/70"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Loading ── */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[#3B82F6]" />
            </div>
          ) : notifications.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-4">
                <Bell size={36} className="text-[#CBD5E1]" />
              </div>
              <p className="text-[16px] font-bold text-[#94A3B8]">Chưa có thông báo nào</p>
              <p className="text-[13px] text-[#CBD5E1] mt-1">
                {activeTab === "all"
                  ? "Hãy ứng tuyển để nhận được cập nhật từ nhà tuyển dụng!"
                  : `Không có thông báo loại "${TABS.find(t => t.key === activeTab)?.label}".`}
              </p>
            </div>
          ) : (
            /* ── Notifications List ── */
            <div className="space-y-4">
              {notifications.map((item) => {
                const cfg = TYPE_CONFIG[item.Type] || TYPE_CONFIG.system;
                const isNew = !item.IsRead;

                return (
                  <div
                    key={item.NotificationID}
                    onClick={() => !item.IsRead && handleRead(item.NotificationID)}
                    className={`bg-white rounded-2xl border shadow-sm p-5 flex items-start gap-5 relative overflow-hidden transition-all cursor-pointer
                      ${isNew
                        ? "border-[#BFDBFE] hover:shadow-md"
                        : "border-[#F1F5F9] opacity-80 hover:opacity-100"
                      }`}
                  >
                    {/* Blue indicator for unread */}
                    {isNew && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB] rounded-l-2xl" />}

                    {/* Icon */}
                    <div className={`w-12 h-12 ${cfg.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-[15px] font-bold ${isNew ? "text-[#0F172A]" : "text-[#475569]"}`}>
                            {item.Title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeCls}`}>
                            {cfg.badge}
                          </span>
                          {isNew && (
                            <span className="w-2 h-2 rounded-full bg-[#2563EB] inline-block" />
                          )}
                        </div>
                        <span className="text-[11px] font-medium text-[#94A3B8] shrink-0">
                          {timeAgo(item.CreatedAt)}
                        </span>
                      </div>

                      <p className="text-[14px] text-[#64748B] leading-relaxed">
                        {item.Content}
                      </p>

                      {isNew && (
                        <p className="text-[11px] text-[#93C5FD] mt-2 font-medium">
                          Nhấn để đánh dấu đã đọc
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}


        </main>
      </div>
    </div>
  );
};

export default Thongbao;