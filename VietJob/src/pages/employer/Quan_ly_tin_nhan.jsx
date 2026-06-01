import React, { useState, useEffect, useRef } from "react";
import {
    Bell,
    BookOpen,
    Briefcase,
    FileText,
    Grid2X2,
    HelpCircle,
    LogOut,
    MessageSquare,
    MoreVertical,
    Phone,
    Search,
    Send,
    Settings,
    Users,
    Video,
    Paperclip,
    Smile,
    ArrowDown
} from "lucide-react";
import Sidebar_Empl from "../../components/common/Employer_c/Sidebar_empl";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl";
import axios from "axios";

const API = "http://localhost:5000/api";

const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

export default function Quan_ly_tin_nhan() {
    const currentUser = getCurrentUser();
    const userId = currentUser?.id;

    const [conversations, setConversations] = useState([]);
    const [activePartner, setActivePartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // 'all' | 'unread'
    const [noteText, setNoteText] = useState("");
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    // Helper for candidate initials
    const getInitials = (name = "") => {
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Safe JSON base64 converter
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // ─── FETCH CONVERSATIONS ──────────────────────────────────────
    const fetchConversations = async (silent = false) => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API}/messages/conversations/${userId}`);
            setConversations(Array.isArray(res.data) ? res.data : []);
            
            // If there's an active partner, update their latest status
            if (activePartner && Array.isArray(res.data)) {
                const updatedPartner = res.data.find(c => c.PartnerID === activePartner.PartnerID);
                if (updatedPartner) {
                    // Update partner stats if necessary
                }
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách hội thoại:", err);
        }
    };

    // ─── FETCH MESSAGES ───────────────────────────────────────────
    const fetchMessages = async (partnerId, silent = false) => {
        if (!userId || !partnerId) return;
        try {
            const res = await axios.get(`${API}/messages/history/${userId}/${partnerId}`);
            setMessages(res.data);
            
            // Mark as read
            await axios.put(`${API}/messages/read/${userId}/${partnerId}`);
        } catch (err) {
            console.error("Lỗi lấy lịch sử tin nhắn:", err);
        }
    };

    // ─── AUTO-POLLING INTERVAL ────────────────────────────────────
    useEffect(() => {
        fetchConversations();
        
        const interval = setInterval(() => {
            fetchConversations(true);
            if (activePartner) {
                fetchMessages(activePartner.PartnerID, true);
            }
        }, 3000); // Poll every 3 seconds

        return () => clearInterval(interval);
    }, [userId, activePartner?.PartnerID]);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle switching conversations
    const handleSelectPartner = (partner) => {
        setActivePartner(partner);
        setMessages([]);
        fetchMessages(partner.PartnerID);
        
        // Load note
        const savedNote = localStorage.getItem(`candidate_note_${partner.PartnerID}`) || "";
        setNoteText(savedNote);
    };

    // Check query parameters to see if we should start a chat with someone
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const partnerIdParam = queryParams.get("partnerId");
        if (partnerIdParam && conversations.length > 0) {
            const partnerId = parseInt(partnerIdParam, 10);
            const found = conversations.find(c => c.PartnerID === partnerId);
            if (found) {
                handleSelectPartner(found);
            } else {
                // If not in active conversations, let's fetch their user info to build a dummy conversation item
                const fetchUserInfo = async () => {
                    try {
                        const userRes = await axios.get(`${API}/auth/profile/${partnerId}`);
                        if (userRes.data) {
                            const newDummyPartner = {
                                PartnerID: userRes.data.Id,
                                PartnerName: userRes.data.Username,
                                PartnerEmail: userRes.data.Email,
                                PartnerPhone: userRes.data.Phone || "",
                                PartnerAddress: userRes.data.Address || "Chưa cung cấp",
                                UnreadCount: 0,
                                MessageContent: "Nhấn để bắt đầu trò chuyện...",
                                CreatedAt: new Date().toISOString()
                            };
                            setActivePartner(newDummyPartner);
                            fetchMessages(newDummyPartner.PartnerID);
                        }
                    } catch (e) {
                        console.error("Lỗi tìm thông tin đối tác mới:", e);
                    }
                };
                fetchUserInfo();
            }
            // Clean up URL query param so it doesn't re-trigger
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [conversations, window.location.search]);

    // ─── SEND MESSAGE ─────────────────────────────────────────────
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userId || !activePartner || (!inputText.trim())) return;

        const textToSend = inputText;
        setInputText(""); // Clear early for responsiveness

        try {
            const res = await axios.post(`${API}/messages/send`, {
                senderId: userId,
                receiverId: activePartner.PartnerID,
                messageContent: textToSend
            });

            if (res.status === 201) {
                // Append locally instantly
                setMessages(prev => [...prev, res.data.data]);
                fetchConversations();
            }
        } catch (err) {
            showToast("Không thể gửi tin nhắn. Vui lòng thử lại.", false);
        }
    };

    // ─── HANDLE FILE UPLOAD ────────────────────────────────────────
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !userId || !activePartner) return;

        setUploading(true);
        try {
            const base64 = await toBase64(file);
            // Upload to server upload api
            const uploadRes = await axios.post(`${API}/upload`, {
                base64,
                fileName: file.name
            });

            if (uploadRes.data?.url) {
                const fileUrl = uploadRes.data.url;
                
                // Send message with file URL
                const sendRes = await axios.post(`${API}/messages/send`, {
                    senderId: userId,
                    receiverId: activePartner.PartnerID,
                    messageContent: `📎 Đã gửi tệp: ${file.name}`,
                    attachmentUrl: fileUrl,
                    attachmentName: file.name
                });

                if (sendRes.status === 201) {
                    setMessages(prev => [...prev, sendRes.data.data]);
                    fetchConversations();
                    showToast("Tải tệp lên thành công!");
                }
            }
        } catch (err) {
            console.error("Lỗi tải tệp:", err);
            showToast("Tải tệp lên thất bại.", false);
        } finally {
            setUploading(false);
        }
    };

    // ─── SAVE NOTE ────────────────────────────────────────────────
    const handleSaveNote = () => {
        if (!activePartner) return;
        localStorage.setItem(`candidate_note_${activePartner.PartnerID}`, noteText);
        showToast("Lưu ghi chú tuyển dụng thành công!");
    };

    // Filtering lists
    const filteredConversations = conversations.filter(c => {
        const matchesSearch = c.PartnerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              c.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "all" ? true : c.UnreadCount > 0;
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f5f6fa", color: "#1a1a2e" }}>
            <Sidebar_Empl />

            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />

                <div style={{ flex: 1, padding: "24px", overflow: "hidden" }}>
                    <div className="h-full bg-white rounded-[26px] overflow-hidden border border-[#e8edf5] flex">

                        {/* CHAT LIST */}
                        <section className="w-[340px] border-r border-[#e8edf5] bg-white flex flex-col h-full overflow-hidden flex-shrink-0">
                            {/* SEARCH */}
                            <div className="px-5 pt-5 pb-3">
                                <div className="h-10 bg-[#f4f6fb] rounded-xl px-4 flex items-center gap-2">
                                    <Search size={16} className="text-gray-400" />
                                    <input
                                        placeholder="Tìm kiếm ứng viên..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="bg-transparent outline-none text-[13.5px] w-full"
                                    />
                                </div>
                            </div>

                            {/* FILTER TYPES */}
                            <div className="px-5 py-2 flex gap-2 flex-shrink-0">
                                <button
                                    onClick={() => setFilterType("all")}
                                    className={`h-[32px] px-4 rounded-full text-[12px] font-bold transition ${
                                        filterType === "all" ? "bg-[#1458e7] text-white" : "bg-[#f4f6fb] text-[#6b7280]"
                                    }`}
                                >
                                    Tất cả ({conversations.length})
                                </button>
                                <button
                                    onClick={() => setFilterType("unread")}
                                    className={`h-[32px] px-4 rounded-full text-[12px] font-bold transition ${
                                        filterType === "unread" ? "bg-red-500 text-white" : "bg-[#f4f6fb] text-[#6b7280]"
                                    }`}
                                >
                                    Chưa đọc ({conversations.filter(c => c.UnreadCount > 0).length})
                                </button>
                            </div>

                            {/* LIST */}
                            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                                {filteredConversations.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 text-xs">
                                        Không tìm thấy cuộc hội thoại nào
                                    </div>
                                ) : (
                                    filteredConversations.map((c) => {
                                        const isActive = activePartner?.PartnerID === c.PartnerID;
                                        const dateObj = new Date(c.CreatedAt);
                                        const timeStr = dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                                        return (
                                            <div
                                                key={c.PartnerID}
                                                onClick={() => handleSelectPartner(c)}
                                                className={`p-3 rounded-2xl flex gap-3 cursor-pointer transition ${
                                                    isActive ? "bg-[#f4f7ff]" : "hover:bg-[#f8fafc]"
                                                }`}
                                            >
                                                {/* Initials Avatar */}
                                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm border border-blue-50">
                                                    {getInitials(c.PartnerName)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="font-semibold text-[14px] text-gray-800 truncate">{c.PartnerName}</h4>
                                                        <span className="text-[10px] text-[#9ca3af]">{timeStr}</span>
                                                    </div>

                                                    <p className={`text-[12px] mt-1 truncate ${c.UnreadCount > 0 ? "font-bold text-gray-900" : "text-[#6b7280]"}`}>
                                                        {c.MessageContent}
                                                    </p>
                                                    
                                                    {c.CompanyName && (
                                                        <span className="text-[9.5px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full inline-block mt-1">
                                                            {c.CompanyName}
                                                        </span>
                                                    )}
                                                </div>

                                                {c.UnreadCount > 0 && (
                                                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center self-center flex-shrink-0 shadow-sm">
                                                        {c.UnreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>

                        {/* CHAT CONTENT */}
                        <section className="flex-1 bg-[#fbfbfc] relative flex flex-col h-full overflow-hidden">
                            {activePartner ? (
                                <>
                                    {/* HEADER */}
                                    <div className="h-[80px] bg-white border-b border-[#edf1f7] px-6 flex items-center justify-between flex-shrink-0 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                                                {getInitials(activePartner.PartnerName)}
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-[15px] text-gray-800">
                                                    {activePartner.PartnerName}
                                                </h3>

                                                <p className="text-[#22c55e] text-[11px] font-medium">
                                                    ● Đang hoạt động
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-[#6b7280]">
                                            <a href={`tel:${activePartner.PartnerPhone}`} className="hover:text-blue-600"><Phone size={18} /></a>
                                            <MoreVertical size={18} className="cursor-pointer hover:text-blue-600" />
                                        </div>
                                    </div>

                                    {/* MESSAGES CONTAINER */}
                                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center py-20 text-gray-400 text-xs">
                                                Chưa có tin nhắn nào. Bắt đầu cuộc trò chuyện ngay!
                                            </div>
                                        ) : (
                                            messages.map((m) => {
                                                const isMine = m.SenderID === userId;
                                                const dateObj = new Date(m.CreatedAt);
                                                const timeStr = dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                                                
                                                return (
                                                    <div key={m.MessageID} className={`flex gap-3 ${isMine ? "justify-end" : "justify-start"}`}>
                                                        {!isMine && (
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs font-bold flex-shrink-0 self-end">
                                                                {getInitials(activePartner.PartnerName)}
                                                            </div>
                                                        )}

                                                        <div className="max-w-[70%]">
                                                            {/* Text or Attachment */}
                                                            {m.AttachmentURL ? (
                                                                <div className="space-y-2">
                                                                    <div className={`rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 ${
                                                                        isMine ? "bg-blue-50 text-blue-900" : "bg-white text-gray-800"
                                                                    }`}>
                                                                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-500 font-bold text-xs flex-shrink-0">
                                                                            PDF
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <h5 className="font-semibold text-xs truncate text-gray-800">{m.AttachmentName || "Tài liệu đính kèm"}</h5>
                                                                            <p className="text-[10px] text-gray-400">Tệp đã gửi qua chat</p>
                                                                        </div>
                                                                        <a
                                                                            href={m.AttachmentURL}
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                            className="text-xs bg-white text-blue-600 px-3 py-1 rounded-md border border-blue-200 font-bold hover:bg-blue-50"
                                                                        >
                                                                            Tải về
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className={`rounded-[20px] px-4 py-3 shadow-sm ${
                                                                    isMine 
                                                                        ? "bg-[#1458e7] text-white rounded-br-sm" 
                                                                        : "bg-white text-[#374151] rounded-bl-sm border border-[#edf1f7]"
                                                                }`}>
                                                                    <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                                                                        {m.MessageContent}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            <span className={`text-[10px] text-[#9ca3af] mt-1 block ${isMine ? "text-right" : "text-left"}`}>
                                                                {timeStr}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* INPUT PANEL */}
                                    <div className="p-4 bg-white border-t border-[#edf1f7] flex-shrink-0 shadow-lg">
                                        <form onSubmit={handleSendMessage} className="h-[54px] bg-[#f4f6fb] rounded-2xl px-4 flex items-center gap-3">
                                            {/* Attachment input */}
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="text-gray-400 hover:text-blue-600 transition"
                                                title="Gửi tệp đính kèm"
                                            >
                                                <Paperclip size={18} />
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                style={{ display: "none" }}
                                            />

                                            <input
                                                placeholder={uploading ? "Đang tải tệp lên..." : "Nhập tin nhắn..."}
                                                disabled={uploading}
                                                value={inputText}
                                                onChange={e => setInputText(e.target.value)}
                                                className="flex-1 bg-transparent outline-none text-[13.5px] disabled:opacity-50"
                                            />

                                            <button
                                                type="submit"
                                                disabled={uploading || !inputText.trim()}
                                                className="w-9 h-9 rounded-xl bg-[#1458e7] flex items-center justify-center shadow-md hover:bg-blue-700 disabled:opacity-50 transition flex-shrink-0"
                                            >
                                                <Send size={15} className="text-white" />
                                            </button>
                                        </form>

                                        <div className="mt-2 flex items-center justify-between text-[11px] text-[#9ca3af]">
                                            <div className="flex gap-3">
                                                <span>😊 Biểu cảm</span>
                                                <span onClick={() => fileInputRef.current?.click()} className="cursor-pointer hover:underline">📎 Đính kèm tệp tin</span>
                                            </div>
                                            <span>Nhấn Enter để gửi</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                                    <MessageSquare size={48} className="mb-4 text-blue-200" />
                                    <h3 className="font-semibold text-gray-600 text-sm">Chưa chọn cuộc hội thoại nào</h3>
                                    <p className="text-xs max-w-xs mt-1">Chọn một ứng viên ở cột bên trái để bắt đầu trò chuyện trực tiếp và trao đổi thông tin.</p>
                                </div>
                            )}
                        </section>

                        {/* PROFILE CARD */}
                        <aside className="w-[300px] border-l border-[#e8edf5] bg-white h-full overflow-y-auto flex-shrink-0">
                            {activePartner ? (
                                <div className="p-6">
                                    <div className="text-center">
                                        <div className="w-20 h-20 rounded-[22px] bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-md">
                                            {getInitials(activePartner.PartnerName)}
                                        </div>

                                        <h2 className="mt-4 font-bold text-[18px] text-gray-800">
                                            {activePartner.PartnerName}
                                        </h2>

                                        <p className="text-[#1458e7] text-[12.5px] font-medium mt-1">
                                            Ứng viên ứng tuyển
                                        </p>
                                    </div>

                                    <div className="mt-8 border-t border-slate-100 pt-6">
                                        <h4 className="text-[11px] tracking-wider text-[#9ca3af] font-bold uppercase">
                                            Thông tin liên hệ
                                        </h4>

                                        <div className="mt-4 space-y-4">
                                            <div>
                                                <p className="text-[10px] text-gray-400">Email</p>
                                                <p className="text-[12.5px] font-bold text-gray-800 mt-0.5 break-all">{activePartner.PartnerEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400">Số điện thoại</p>
                                                <p className="text-[12.5px] font-bold text-gray-800 mt-0.5">{activePartner.PartnerPhone || "Chưa cung cấp"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400">Địa chỉ</p>
                                                <p className="text-[12.5px] font-bold text-gray-800 mt-0.5">{activePartner.PartnerAddress || "Chưa cung cấp"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GHI CHÚ TUYỂN DỤNG */}
                                    <div className="mt-8 border-t border-slate-100 pt-6">
                                        <h4 className="text-[11px] tracking-wider text-[#9ca3af] font-bold uppercase">
                                            Ghi chú tuyển dụng
                                        </h4>

                                        <textarea
                                            placeholder="Thêm ghi chú riêng cho ứng viên này..."
                                            value={noteText}
                                            onChange={e => setNoteText(e.target.value)}
                                            className="mt-3 w-full h-[120px] bg-[#f8fafc] border border-[#edf1f7] rounded-xl p-3 outline-none resize-none text-[12.5px] leading-relaxed"
                                        />

                                        <button
                                            onClick={handleSaveNote}
                                            className="mt-2 w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-100 transition"
                                        >
                                            💾 Lưu ghi chú
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-400 text-xs py-20">
                                    Chọn cuộc hội thoại để xem chi tiết ứng viên
                                </div>
                            )}
                        </aside>

                    </div>
                </div>
            </main>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 28, right: 28,
                    background: toast.ok ? "#10b981" : "#ef4444", color: "#fff",
                    padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 9999,
                }}>
                    {toast.ok ? "✅" : "❌"} {toast.msg}
                </div>
            )}
        </div>
    );
}