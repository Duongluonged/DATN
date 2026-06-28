import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    Send,
    Phone,
    MoreVertical,
    Paperclip,
    MessageSquare,
    Globe,
    MapPin,
    Building2,
    Users,
    ArrowLeft
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import axios from "axios";

const API = "http://localhost:5000/api";

const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

export default function CandidateMessages() {
    const currentUser = getCurrentUser();
    const userId = currentUser?.id;

    const [conversations, setConversations] = useState([]);
    const [activePartner, setActivePartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const showToast = (msg, ok = true) => {
        setToast({ msg, ok });
        setTimeout(() => setToast(null), 3500);
    };

    const getInitials = (name = "") => {
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const fetchConversations = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`${API}/messages/conversations/${userId}`);
            setConversations(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Lỗi lấy danh sách hội thoại của ứng viên:", err);
        }
    };

    const fetchMessages = async (partnerId) => {
        if (!userId || !partnerId) return;
        try {
            const res = await axios.get(`${API}/messages/history/${userId}/${partnerId}`);
            setMessages(res.data);
            
            await axios.put(`${API}/messages/read/${userId}/${partnerId}`);
        } catch (err) {
            console.error("Lỗi lấy lịch sử tin nhắn của ứng viên:", err);
        }
    };

    useEffect(() => {
        fetchConversations();
        
        const interval = setInterval(() => {
            fetchConversations();
            if (activePartner) {
                fetchMessages(activePartner.PartnerID);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [userId, activePartner?.PartnerID]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSelectPartner = (partner) => {
        setActivePartner(partner);
        setMessages([]);
        fetchMessages(partner.PartnerID);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const partnerIdParam = queryParams.get("partnerId");
        if (partnerIdParam && conversations.length > 0) {
            const partnerId = parseInt(partnerIdParam, 10);
            const found = conversations.find(c => c.PartnerID === partnerId);
            if (found) {
                handleSelectPartner(found);
            } else {
                const fetchRecruiterInfo = async () => {
                    try {
                        const res = await axios.get(`${API}/auth/profile/${partnerId}`);
                        if (res.data) {
                            const newDummy = {
                                PartnerID: res.data.Id,
                                PartnerName: res.data.Username,
                                PartnerEmail: res.data.Email,
                                PartnerPhone: res.data.Phone || "",
                                PartnerAddress: res.data.Address || "",
                                UnreadCount: 0,
                                MessageContent: "Bắt đầu cuộc trò chuyện ngay!",
                                CreatedAt: new Date().toISOString()
                            };
                            setActivePartner(newDummy);
                            fetchMessages(newDummy.PartnerID);
                        }
                    } catch (e) {
                        console.error("Lỗi lấy thông tin nhà tuyển dụng mới:", e);
                    }
                };
                fetchRecruiterInfo();
            }
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [conversations, window.location.search]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userId || !activePartner || !inputText.trim()) return;

        const textToSend = inputText;
        setInputText("");

        try {
            const res = await axios.post(`${API}/messages/send`, {
                senderId: userId,
                receiverId: activePartner.PartnerID,
                messageContent: textToSend
            });

            if (res.status === 201) {
                setMessages(prev => [...prev, res.data.data]);
                fetchConversations();
            }
        } catch (err) {
            showToast("Không thể gửi tin nhắn. Vui lòng thử lại.", false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !userId || !activePartner) return;

        setUploading(true);
        try {
            const base64 = await toBase64(file);
            const uploadRes = await axios.post(`${API}/upload`, {
                base64,
                fileName: file.name
            });

            if (uploadRes.data?.url) {
                const fileUrl = uploadRes.data.url;
                
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
            console.error("Lỗi gửi tệp:", err);
            showToast("Tải tệp lên thất bại.", false);
        } finally {
            setUploading(false);
        }
    };

    const filteredConversations = conversations.filter(c => 
        c.PartnerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.CompanyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div className="flex min-h-screen bg-gray-50 font-sans text-slate-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                <Sidebar />

                <main className="flex-1 p-8 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
                    <div className="flex-1 bg-white rounded-3xl overflow-hidden border border-blue-100 flex shadow-sm">
                        
                        <section className="w-[320px] border-r border-blue-50 bg-white flex flex-col h-full overflow-hidden flex-shrink-0">
                            <div className="p-4 border-b border-blue-50">
                                <h3 className="font-bold text-base mb-3 text-slate-800">Trò chuyện</h3>
                                <div className="h-9 bg-slate-50 rounded-xl px-3 flex items-center gap-2 border border-slate-100">
                                    <Search size={15} className="text-slate-400" />
                                    <input
                                        placeholder="Tìm nhà tuyển dụng..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="bg-transparent outline-none text-xs w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {filteredConversations.length === 0 ? (
                                    <div className="text-center py-10 text-slate-400 text-xs">
                                        Chưa có cuộc trò chuyện nào
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
                                                    isActive ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50"
                                                }`}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                                                    {getInitials(c.CompanyName || c.PartnerName)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline">
                                                        <h4 className="font-bold text-xs text-slate-800 truncate">{c.CompanyName || c.PartnerName}</h4>
                                                        <span className="text-[9px] text-slate-400">{timeStr}</span>
                                                    </div>
                                                    {c.CompanyName && (
                                                        <p className="text-[9.5px] text-blue-600 font-semibold truncate mt-0.5">{c.PartnerName} (HR)</p>
                                                    )}
                                                    <p className={`text-[11px] mt-1 truncate ${c.UnreadCount > 0 ? "font-bold text-slate-900" : "text-slate-500"}`}>
                                                        {c.MessageContent}
                                                    </p>
                                                </div>

                                                {c.UnreadCount > 0 && (
                                                    <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center self-center flex-shrink-0">
                                                        {c.UnreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </section>

                        <section className="flex-1 bg-slate-50/50 flex flex-col h-full overflow-hidden">
                            {activePartner ? (
                                <>
                                    <div className="h-[70px] bg-white border-b border-blue-50 px-5 flex items-center justify-between flex-shrink-0 shadow-xs">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shadow-xs">
                                                {getInitials(activePartner.CompanyName || activePartner.PartnerName)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[13.5px] text-slate-800">
                                                    {activePartner.CompanyName || activePartner.PartnerName}
                                                </h4>
                                                <p className="text-[10px] text-slate-400">
                                                    Nhà tuyển dụng: <span className="font-bold text-slate-600">{activePartner.PartnerName}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-400">
                                            {activePartner.PartnerPhone && (
                                                <a href={`tel:${activePartner.PartnerPhone}`} className="hover:text-blue-600">
                                                    <Phone size={16} />
                                                </a>
                                            )}
                                            <MoreVertical size={16} />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center py-20 text-slate-400 text-xs">
                                                Hãy là người mở lời trước! Gửi một lời chào ấn tượng đến nhà tuyển dụng.
                                            </div>
                                        ) : (
                                            messages.map((m) => {
                                                const isMine = m.SenderID === userId;
                                                const dateObj = new Date(m.CreatedAt);
                                                const timeStr = dateObj.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                                                return (
                                                    <div key={m.MessageID} className={`flex gap-3.5 ${isMine ? "justify-end" : "justify-start"}`}>
                                                        {!isMine && (
                                                            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 self-end">
                                                                {getInitials(activePartner.CompanyName || activePartner.PartnerName)}
                                                            </div>
                                                        )}
                                                        <div className="max-w-[70%]">
                                                            {m.AttachmentURL ? (
                                                                <div className={`rounded-xl p-3 shadow-xs border flex items-center gap-3 ${
                                                                    isMine ? "bg-blue-50 border-blue-100 text-blue-900" : "bg-white border-slate-100 text-slate-800"
                                                                }`}>
                                                                    <div className="w-8 h-8 rounded bg-red-100 text-red-500 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                                                                        PDF
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h5 className="font-bold text-[11px] truncate text-slate-800">{m.AttachmentName || "File"}</h5>
                                                                        <p className="text-[9px] text-slate-400">Tệp tin đính kèm</p>
                                                                    </div>
                                                                    <a
                                                                        href={m.AttachmentURL}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-[10px] bg-white text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-bold hover:bg-blue-50"
                                                                    >
                                                                        Tải
                                                                    </a>
                                                                </div>
                                                            ) : (
                                                                <div className={`rounded-2xl px-4 py-2.5 shadow-xs text-xs leading-relaxed break-words whitespace-pre-wrap ${
                                                                    isMine
                                                                        ? "bg-blue-600 text-white rounded-br-none shadow-md"
                                                                        : "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                                                                }`}>
                                                                    {m.MessageContent}
                                                                </div>
                                                            )}
                                                            <span className={`text-[9px] text-slate-400 mt-1 block ${isMine ? "text-right" : "text-left"}`}>
                                                                {timeStr}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <div className="p-3 bg-white border-t border-blue-50 flex-shrink-0">
                                        <form onSubmit={handleSendMessage} className="h-11 bg-slate-50 rounded-xl px-3 flex items-center gap-2 border border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="text-slate-400 hover:text-blue-600 transition"
                                            >
                                                <Paperclip size={16} />
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                style={{ display: "none" }}
                                            />
                                            <input
                                                placeholder={uploading ? "Đang tải tệp tin lên..." : "Nhập lời nhắn..."}
                                                disabled={uploading}
                                                value={inputText}
                                                onChange={e => setInputText(e.target.value)}
                                                className="flex-1 bg-transparent outline-none text-xs disabled:opacity-50"
                                            />
                                            <button
                                                type="submit"
                                                disabled={uploading || !inputText.trim()}
                                                className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition flex-shrink-0 shadow-xs"
                                            >
                                                <Send size={13} className="text-white" />
                                            </button>
                                        </form>
                                        <div className="mt-1.5 flex justify-between text-[9.5px] text-slate-400 px-1">
                                            <span>😊 Icon</span>
                                            <span>Nhấn Enter để gửi tin nhắn</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                                    <MessageSquare size={44} className="mb-3 text-blue-100" />
                                    <h4 className="font-bold text-slate-600 text-xs">Tin nhắn trực tiếp với nhà tuyển dụng</h4>
                                    <p className="text-[11px] max-w-xs mt-1">Chọn một cuộc trò chuyện từ cột bên trái để trao đổi trực tiếp, nhận lời mời phỏng vấn và phản hồi nhanh chóng.</p>
                                </div>
                            )}
                        </section>

                        <aside className="w-[280px] border-l border-blue-50 bg-white h-full overflow-y-auto flex-shrink-0 p-5">
                            {activePartner && activePartner.CompanyName ? (
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold mx-auto shadow-sm">
                                            {getInitials(activePartner.CompanyName)}
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-800 mt-3.5 leading-snug">{activePartner.CompanyName}</h4>
                                        <p className="text-blue-600 text-[10.5px] font-bold mt-1 uppercase tracking-wider">Hồ sơ công ty</p>
                                    </div>

                                    <div className="border-t border-slate-100 pt-5 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                                                <MapPin size={13} /> Địa điểm
                                            </div>
                                            <p className="text-slate-600 text-[11.5px] font-medium leading-relaxed">{activePartner.PartnerAddress || "Chưa cập nhật"}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                                                <Globe size={13} /> Email liên hệ
                                            </div>
                                            <p className="text-slate-600 text-[11.5px] font-medium break-all">{activePartner.PartnerEmail}</p>
                                        </div>

                                        {activePartner.PartnerPhone && (
                                            <div>
                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-1">
                                                    <Phone size={13} /> Hotline
                                                </div>
                                                <p className="text-slate-600 text-[11.5px] font-medium">{activePartner.PartnerPhone}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100 pt-5 text-center">
                                        <p className="text-[10px] text-slate-400 mb-2.5">Tìm hiểu thêm về doanh nghiệp này</p>
                                        <button
                                            onClick={() => showToast("Đang kết nối hồ sơ...")}
                                            className="w-full py-2 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-100 transition"
                                        >
                                            Xem trang công ty
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 text-slate-400 text-xs">
                                    {activePartner ? "Không có thông tin hồ sơ chi tiết." : "Chọn cuộc trò chuyện để xem chi tiết."}
                                </div>
                            )}
                        </aside>

                    </div>
                </main>
            </div>

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
