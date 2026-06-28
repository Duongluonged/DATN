import React, { useState, useEffect } from 'react';
import {
    Users, DollarSign, Briefcase, BookOpen,
    TrendingUp, PieChart, Clock, ChevronRight,
    MoreHorizontal, Loader2, RefreshCw, AlertCircle, BarChart3
} from "lucide-react";
import axios from 'axios';
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar';

export default function Statistical() {
    const [activeNav, setActiveNav] = useState("Statistical");
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {

            const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
            setStats(statsRes.data);

            const coursesRes = await axios.get("http://localhost:5000/api/courses");
            setCourses(coursesRes.data);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu thống kê:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const totalUsers = stats?.totalUsers ?? 0;
    const totalJobs = stats?.totalJobs ?? 0;
    const totalCourses = stats?.totalCourses ?? 0;
    const pendingReports = stats?.pendingReports ?? 0;
    const newUsersThisMonth = stats?.newUsersThisMonth ?? 0;
    const trendData = stats?.trend ?? [];
    const latestCourses = courses.slice(0, 3);

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
            <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Topbar />

                <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Báo cáo Thống kê</div>
                            <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>
                                Báo cáo tổng quan về người dùng, công việc, khóa học và hoạt động trong cơ sở dữ liệu hệ thống VietJob.
                            </div>
                        </div>
                        <button
                            onClick={fetchData}
                            style={{
                                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                                background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8,
                                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
                            }}
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Làm mới dữ liệu
                        </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                        {[
                            { label: "Tổng người dùng", value: totalUsers, icon: <Users size={20} style={{ color: "#3b82f6" }} />, trend: `+${newUsersThisMonth} mới`, colorBg: "rgba(59,130,246,0.1)" },
                            { label: "Công việc hoạt động", value: totalJobs, icon: <Briefcase size={20} style={{ color: "#f97316" }} />, trend: "Tin tuyển dụng", colorBg: "rgba(249,115,22,0.1)" },
                            { label: "Khóa học hiện có", value: totalCourses, icon: <BookOpen size={20} style={{ color: "#10b981" }} />, trend: "Hoạt động", colorBg: "rgba(16,185,129,0.1)" },
                            { label: "Báo cáo chờ duyệt", value: pendingReports, icon: <AlertCircle size={20} style={{ color: "#ef4444" }} />, trend: "Cảnh báo vi phạm", colorBg: "rgba(239,68,68,0.1)" },
                        ].map((stat, i) => (
                            <div key={i} style={{ background: "#ffffff", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                    <div style={{ padding: 8, borderRadius: 8, background: stat.colorBg, display: "flex", alignItems: "center" }}>{stat.icon}</div>
                                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "2px 6px", borderRadius: 10, background: "#f1f5f9", color: "#475569" }}>
                                        {stat.trend}
                                    </span>
                                </div>
                                <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", margin: 0 }}>{stat.label}</p>
                                {loading ? (
                                    <Loader2 size={20} className="animate-spin" style={{ color: "#3b82f6", marginTop: 8 }} />
                                ) : (
                                    <h3 style={{ fontSize: 24, fontWeight: 700, margin: "4px 0 0 0", letterSpacing: "-0.02em" }}>{stat.value.toLocaleString()}</h3>
                                )}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>

                        <div style={{ background: "#ffffff", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0", position: "relative" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <h4 style={{ margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                                    <TrendingUp size={16} style={{ color: "#2563eb" }} />
                                    Xu hướng đăng tin tuyển dụng (6 tháng gần nhất)
                                </h4>
                                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>LIVE CHART</span>
                            </div>

                            {loading ? (
                                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Loader2 size={24} className="animate-spin" style={{ color: "#3b82f6" }} />
                                </div>
                            ) : trendData.length === 0 ? (
                                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", border: "1px dashed #e2e8f0", borderRadius: 8 }}>
                                    Chưa có dữ liệu xu hướng đăng tin.
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <div style={{ position: "relative", height: 180, width: "100%" }}>
                                        <svg viewBox="0 0 500 180" style={{ width: "100%", height: "100%", overflow: "visible" }}>

                                            {[0, 45, 90, 135, 180].map((yVal) => (
                                                <line key={yVal} x1="0" y1={yVal} x2="500" y2={yVal} stroke="#f1f5f9" strokeWidth="1" />
                                            ))}


                                            <path
                                                fill="none"
                                                stroke="#2563eb"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d={trendData.map((item, idx) => {
                                                    const x = (idx / (trendData.length - 1)) * 500;
                                                    const maxVal = Math.max(...trendData.map(d => d.value), 5);
                                                    const y = 160 - (item.value / maxVal) * 130;
                                                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                                                }).join(' ')}
                                            />


                                            {trendData.map((item, idx) => {
                                                const x = (idx / (trendData.length - 1)) * 500;
                                                const maxVal = Math.max(...trendData.map(d => d.value), 5);
                                                const y = 160 - (item.value / maxVal) * 130;
                                                return (
                                                    <g key={idx}>
                                                        <circle cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                                                        <text x={x} y={y - 10} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: "#1e3a8a" }}>
                                                            {item.value}
                                                        </text>
                                                    </g>
                                                );
                                            })}
                                        </svg>
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px" }}>
                                        {trendData.map((item, idx) => (
                                            <span key={idx} style={{ fontSize: 10, fontWeight: 600, color: "#64748b" }}>{item.month}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>


                        <div style={{ background: "#ffffff", padding: 24, borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <h4 style={{ margin: "0 0 20px 0", fontWeight: 700, width: "100%", display: "flex", alignItems: "center", gap: 6 }}>
                                <PieChart size={16} style={{ color: "#10b981" }} />
                                Ngành nghề trọng tâm
                            </h4>

                            <div style={{ position: "relative", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                                    <circle cx="65" cy="65" r="55" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                                    <circle cx="65" cy="65" r="55" stroke="#2563eb" strokeWidth="10" fill="transparent" strokeDasharray="345" strokeDashoffset="86" style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }} />
                                </svg>
                                <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>75%</span>
                                    <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Công nghệ</span>
                                </div>
                            </div>

                            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    { name: "Công nghệ thông tin (IT)", pct: "75%", color: "#2563eb" },
                                    { name: "Kinh doanh / Marketing", pct: "15%", color: "#f97316" },
                                    { name: "Khác / Dịch vụ", pct: "10%", color: "#64748b" }
                                ].map((job, idx) => (
                                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 600 }}>
                                        <span style={{ color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: job.color }}></span>
                                            {job.name}
                                        </span>
                                        <span style={{ color: "#1e293b" }}>{job.pct}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>

                        <div style={{ background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h4 style={{ margin: 0, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                                    <BookOpen size={16} style={{ color: "#3b82f6" }} />
                                    Khóa học mới nhất trong hệ thống
                                </h4>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {loading ? (
                                    <div style={{ padding: 40, textAlign: "center" }}>
                                        <Loader2 size={20} className="animate-spin" style={{ color: "#3b82f6", margin: "0 auto" }} />
                                    </div>
                                ) : latestCourses.length === 0 ? (
                                    <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
                                        Không có khóa học nào được hiển thị.
                                    </div>
                                ) : (
                                    latestCourses.map((course, i) => (
                                        <div key={course.Id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < latestCourses.length - 1 ? "1px solid #f1f5f9" : "none", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fcfdfe"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                            <div style={{ width: 36, height: 36, background: "rgba(59,130,246,0.1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#3b82f6", fontSize: 13, flexShrink: 0 }}>
                                                {course.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h5 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{course.name}</h5>
                                                <p style={{ margin: "2px 0 0 0", fontSize: 11, color: "#94a3b8" }}>Nhà cung cấp: <b>{course.provider || "Đối tác VietJob"}</b></p>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 10, background: course.status?.toLowerCase() === "đang mở" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: course.status?.toLowerCase() === "đang mở" ? "#16a34a" : "#d97706" }}>
                                                    {course.status || "Chờ duyệt"}
                                                </span>
                                                <p style={{ margin: "4px 0 0 0", fontSize: 10.5, color: "#64748b" }}>
                                                    {course.CreationTime ? new Date(course.CreationTime).toLocaleDateString("vi-VN") : "---"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>


                        <div style={{ background: "#ffffff", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
                            <h4 style={{ margin: "0 0 20px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                                <Clock size={16} style={{ color: "#3b82f6" }} />
                                Hoạt động hệ thống
                            </h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
                                <div style={{ position: "absolute", left: 6, top: 4, bottom: 4, width: 1.5, background: "#f1f5f9" }} />
                                {[
                                    { user: "Dương Lương (Admin)", action: "đã cập nhật danh sách người dùng", time: "Vừa xong", color: "#3b82f6" },
                                    { user: "Đội ngũ Support", action: "đăng ký đối tác đào tạo mới", time: "2 giờ trước", color: "#10b981" },
                                    { user: "Hệ thống tự động", action: "đã tối ưu hóa cơ sở dữ liệu SQL", time: "1 ngày trước", color: "#f97316" }
                                ].map((act, i) => (
                                    <div key={i} style={{ position: "relative", paddingLeft: 22 }}>
                                        <div style={{ position: "absolute", left: 2, top: 4, width: 9, height: 9, borderRadius: "50%", background: act.color, border: "2px solid #ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
                                        <p style={{ margin: 0, fontSize: 12, color: "#1a1d27", lineHeight: 1.4 }}>
                                            <b>{act.user}</b> {act.action}
                                        </p>
                                        <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{act.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <style>{`
        .animate-spin { animation: spin 1.2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}