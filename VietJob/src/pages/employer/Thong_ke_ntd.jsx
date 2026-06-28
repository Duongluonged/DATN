import { useState, useEffect } from "react";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl.jsx";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl.jsx";
import axios from "axios";
import { 
  BarChart3, Users, Briefcase, FileText, 
  TrendingUp, PieChart, Calendar, RefreshCw, 
  Loader2, ArrowUpRight, ArrowDownLeft, Shield, Star
} from "lucide-react";

export default function Thongke_ntd() {
    const [period, setPeriod] = useState("30 ngày qua");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    let user = null;
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Lỗi parse user từ localStorage:", e);
    }
    const userId = user?.id;

    const fetchStats = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/jobs/employer/${userId}/stats`);
            setStats(res.data);
        } catch (err) {
            console.error("Lỗi lấy thống kê nhà tuyển dụng:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [userId]);

    const totalJobs = stats?.totalJobs ?? 0;
    const totalApplicants = stats?.totalApplicants ?? 0;
    const pendingApplications = stats?.pendingApplications ?? 0;
    const featuredJobs = stats?.featuredJobs ?? [];
    const trendData = stats?.trendData ?? [];
    const industryBreakdown = stats?.industryBreakdown ?? [];

    const maxH = 140;

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f8fafc", color: "#1e293b" }}>
            <Sidebar_empl />

            <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <Topbar_empl />

                <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
                        <div>
                            <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: "#1e3a8a", display: "flex", alignItems: "center", gap: 8 }}>
                                <BarChart3 size={22} style={{ color: "#3b82f6" }} />
                                Thống Kê Tuyển Dụng
                            </h1>
                            <p style={{ fontSize: 12.5, color: "#64748b", margin: "4px 0 0" }}>
                                Báo cáo hiệu quả tuyển dụng và hồ sơ ứng tuyển từ hệ thống cơ sở dữ liệu VietJob.
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <button 
                              onClick={fetchStats}
                              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#ffffff", fontSize: 12.5, color: "#475569", cursor: "pointer", fontWeight: 600 }}
                            >
                                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                                Làm mới
                            </button>
                            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#ffffff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 10px rgba(59, 130, 246, 0.15)" }}>
                                Xuất báo cáo Excel
                            </button>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                        {[
                            { label: "Tổng tin tuyển dụng", value: totalJobs, change: "+12%", up: true, icon: <Briefcase size={20} style={{ color: "#2563eb" }} />, iconBg: "rgba(37, 99, 235, 0.1)" },
                            { label: "Lượt nộp hồ sơ", value: totalApplicants, change: "+8%", up: true, icon: <Users size={20} style={{ color: "#16a34a" }} />, iconBg: "rgba(22, 163, 74, 0.1)" },
                            { label: "Hồ sơ chờ duyệt", value: pendingApplications, change: "Đang xử lý", up: null, icon: <FileText size={20} style={{ color: "#db2777" }} />, iconBg: "rgba(219, 39, 119, 0.1)" },
                        ].map((s, i) => (
                            <div key={i} style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px", position: "relative", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center" }}>{s.icon}</div>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: s.up === true ? "#16a34a" : s.up === false ? "#dc2626" : "#64748b", background: s.up === true ? "#f0fdf4" : s.up === false ? "#fef2f2" : "#f1f5f9", padding: "3px 8px", borderRadius: 20 }}>
                                        {s.up === true ? "↑" : s.up === false ? "↓" : "⏳"} {s.change}
                                    </span>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
                                {loading ? (
                                    <Loader2 size={24} className="animate-spin" style={{ color: "#2563eb" }} />
                                ) : (
                                    <div style={{ fontSize: 30, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>{s.value.toLocaleString()}</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 24 }}>
                        
                        <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 6, color: "#1e3a8a" }}>
                                        <TrendingUp size={16} style={{ color: "#2563eb" }} /> Xu hướng hồ sơ ứng tuyển
                                    </h4>
                                    <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 3 }}>Biểu diễn lượt nộp CV của ứng viên theo tuần</div>
                                </div>
                                <div style={{ display: "flex", gap: 14, fontSize: 11.5, fontWeight: 600, alignItems: "center" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#475569" }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
                                        Thực tế
                                    </span>
                                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8" }}>
                                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e2e8f0", display: "inline-block" }} />
                                        Kỳ trước
                                    </span>
                                </div>
                            </div>

                            {loading ? (
                                <div style={{ height: maxH + 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Loader2 size={24} className="animate-spin" style={{ color: "#2563eb" }} />
                                </div>
                            ) : (
                                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: maxH + 28, paddingTop: 8 }}>
                                    {trendData.map((d, i) => {
                                        const maxVal = Math.max(...trendData.map(item => Math.max(item.cur, item.prev)), 10);
                                        const curHeight = (d.cur / maxVal) * maxH;
                                        const prevHeight = (d.prev / maxVal) * maxH;
                                        
                                        return (
                                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 6 }}>
                                                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: maxH }}>
                                                    <div style={{ width: 16, background: "#2563eb", borderRadius: "4px 4px 0 0", height: curHeight, transition: "height 0.4s" }} />
                                                    <div style={{ width: 16, background: "#e2e8f0", borderRadius: "4px 4px 0 0", height: prevHeight, transition: "height 0.4s" }} />
                                                </div>
                                                <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>{d.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                            <h4 style={{ margin: "0 0 16px 0", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 6, color: "#1e3a8a" }}>
                                <PieChart size={16} style={{ color: "#16a34a" }} /> Phân tích loại hình CV
                            </h4>

                            {loading ? (
                                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Loader2 size={24} className="animate-spin" style={{ color: "#16a34a" }} />
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {industryBreakdown.map((ind, idx) => (
                                        <div key={idx}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                                                <span style={{ color: "#475569" }}>{ind.label}</span>
                                                <span style={{ color: "#1e293b", fontWeight: 700 }}>{ind.pct}%</span>
                                            </div>
                                            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 10, overflow: "hidden" }}>
                                                <div style={{ height: "100%", width: `${ind.pct}%`, background: "linear-gradient(90deg,#2563eb,#8b5cf6)", borderRadius: 10, transition: "width 0.5s" }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.01)" }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h4 style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1e3a8a" }}>Việc làm đang tuyển nổi bật</h4>
                            <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#eff6ff", color: "#2563eb" }}>LIVE DATA</span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "3fr 1.2fr 1.2fr 1.2fr", gap: 12, padding: "10px 20px", background: "#f8fafc", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #f1f5f9" }}>
                            <span>Tên công việc</span>
                            <span>Trạng thái VIP</span>
                            <span>Số lượt ứng tuyển</span>
                            <span>Ngày tạo</span>
                        </div>

                        {loading ? (
                            <div style={{ padding: 40, textAlign: "center" }}>
                                <Loader2 size={24} className="animate-spin" style={{ color: "#2563eb", margin: "0 auto" }} />
                            </div>
                        ) : featuredJobs.length === 0 ? (
                            <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
                                Chưa có tin tuyển dụng nào được tạo.
                            </div>
                        ) : (
                            featuredJobs.map((job, idx) => (
                                <div key={job.JobID} style={{
                                    display: "grid", gridTemplateColumns: "3fr 1.2fr 1.2fr 1.2fr",
                                    gap: 12, padding: "14px 20px", alignItems: "center",
                                    borderBottom: idx < featuredJobs.length - 1 ? "1px solid #f1f5f9" : "none",
                                    transition: "background 0.1s",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#fafbfe"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: 8, background: job.IsHighlighted ? "rgba(234, 179, 8, 0.1)" : "rgba(37, 99, 235, 0.1)", color: job.IsHighlighted ? "#eab308" : "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12 }}>
                                            {job.IsHighlighted ? <Star size={12}/> : <Briefcase size={12}/>}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{job.JobTitle}</div>
                                            <div style={{ fontSize: 11, color: "#64748b" }}>Job ID: #{job.JobID}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: job.IsHighlighted ? "#fef9c3" : "#f1f5f9", color: job.IsHighlighted ? "#a16207" : "#475569", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: job.IsHighlighted ? "#eab308" : "#64748b" }} />
                                            {job.IsHighlighted ? "Nổi bật VIP" : "Thường"}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: 700, color: "#2563eb", fontSize: 12.5 }}>
                                        {job.ApplicantCount.toLocaleString()} lượt nộp
                                    </div>
                                    <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 500 }}>
                                        {new Date(job.CreatedAt).toLocaleDateString("vi-VN")}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <footer style={{ borderTop: "1px solid #e8eaf0", padding: "10px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", fontSize: 11.5, color: "#94a3b8" }}>
                    <span>© 2023 VietJob Portal. Báo cáo thống kê cơ sở dữ liệu thời gian thực.</span>
                    <div style={{ display: "flex", gap: 18 }}>
                        {["Chính sách bảo mật", "Trung tâm hỗ trợ", "Điều khoản"].map((l) => (
                            <span key={l} style={{ cursor: "pointer", color: "#64748b" }}>{l}</span>
                        ))}
                    </div>
                </footer>
            </main>
            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}