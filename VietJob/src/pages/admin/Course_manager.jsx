import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, DollarSign, Plus, FileText,
  Search, Filter, MoreHorizontal, ChevronRight,
  Clock, Award, CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw
} from "lucide-react";
import axios from 'axios';
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar';

export default function CourseManage() {
  const [activeNav, setActiveNav] = useState("Courses");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khóa học", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleApprove = async (courseId, title) => {
    if (!window.confirm(`Xác nhận phê duyệt khóa học "${title}"?`)) return;
    try {
      await axios.put(`http://localhost:5000/api/courses/${courseId}/status`, { status: "Đang bán" });
      alert("Đã phê duyệt khóa học thành công!");
      fetchCourses();
    } catch (err) {
      alert("Lỗi phê duyệt: " + (err.response?.data?.message || err.message));
    }
  };


  const handleReject = async (courseId, title) => {
    if (!window.confirm(`Xác nhận đóng/từ chối khóa học "${title}"?`)) return;
    try {
      await axios.put(`http://localhost:5000/api/courses/${courseId}/status`, { status: "Đã ẩn" });
      alert("Đã từ chối/ẩn khóa học thành công!");
      fetchCourses();
    } catch (err) {
      alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredCourses = courses.filter(c => {

    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.provider?.toLowerCase().includes(searchTerm.toLowerCase());


    if (statusFilter !== "all") {
      const dbStatus = c.status?.toLowerCase();
      if (statusFilter === "open" && dbStatus !== "đang mở" && dbStatus !== "active" && dbStatus !== "đang bán") return false;
      if (statusFilter === "pending" && dbStatus !== "chờ duyệt" && dbStatus !== "pending" && dbStatus !== "nháp") return false;
      if (statusFilter === "closed" && dbStatus !== "đã đóng" && dbStatus !== "closed" && dbStatus !== "đã ẩn") return false;
    }

    return matchesSearch;
  });


  const totalCourses = courses.length;
  const openCourses = courses.filter(c => {
    const s = c.status?.toLowerCase();
    return s === "đang mở" || s === "active" || s === "đang bán";
  }).length;
  const pendingCourses = courses.filter(c => {
    const s = c.status?.toLowerCase();
    return s === "chờ duyệt" || s === "pending" || s === "nháp";
  }).length;


  const totalPages = Math.max(Math.ceil(filteredCourses.length / itemsPerPage), 1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Quản lý khóa học</div>
              <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>
                Chào Admin, đây là báo cáo và danh sách khóa học kết nối cơ sở dữ liệu SQL của VietJob.
              </div>
            </div>
            <button
              onClick={fetchCourses}
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
            {[
              { label: "Tổng số khóa học", value: totalCourses, icon: <BookOpen style={{ color: "#3b82f6" }} />, colorBg: "rgba(59,130,246,0.1)" },
              { label: "Khóa học đang hoạt động", value: openCourses, icon: <CheckCircle style={{ color: "#22c55e" }} />, colorBg: "rgba(34,197,94,0.1)" },
              { label: "Yêu cầu chờ duyệt", value: pendingCourses, icon: <AlertCircle style={{ color: "#f59e0b" }} />, colorBg: "rgba(245,158,11,0.1)" },
            ].map((stat, i) => (
              <div key={i} style={{ background: "#ffffff", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>{stat.label}</p>
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" style={{ color: "#3b82f6", marginTop: 8 }} />
                  ) : (
                    <h3 style={{ fontSize: 24, fontWeight: 700, margin: "6px 0 0 0" }}>{stat.value}</h3>
                  )}
                </div>
                <div style={{ padding: 10, background: stat.colorBg, borderRadius: 10, display: "flex", alignItems: "center" }}>{stat.icon}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: 16, borderBottom: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative", width: "100%", maxWidth: 380 }}>
                <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học, nhà cung cấp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px 8px 34px", background: "#f8fafc",
                    border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12.5,
                    fontFamily: "inherit", outline: "none", transition: "all 0.15s"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8,
                    padding: "8px 12px", outline: "none", bg: "#ffffff",
                    fontFamily: "inherit", cursor: "pointer", fontWeight: 500
                  }}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="open">Đang mở</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="closed">Đã đóng</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                    {["Tên khóa học", "Nhà cung cấp", "Thời gian tạo", "Trạng thái", "Thao tác"].map((h) => (
                      <th key={h} style={{ padding: "12px 20px", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ divideY: "1px solid #f1f5f9" }}>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
                        <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 8px auto", color: "#3b82f6" }} />
                        Đang tải danh sách khóa học...
                      </td>
                    </tr>
                  ) : currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
                        Không có khóa học nào phù hợp.
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((course) => {
                      const dbStatus = course.status?.toLowerCase();
                      const isOpen = dbStatus === "đang mở" || dbStatus === "active" || dbStatus === "đang bán";
                      const isPending = dbStatus === "chờ duyệt" || dbStatus === "pending" || dbStatus === "nháp";
                      const isClosed = dbStatus === "đã đóng" || dbStatus === "closed" || dbStatus === "đã ẩn";

                      let statusBadge = (
                        <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: "#f1f5f9", color: "#64748b" }}>
                          {course.status || "Khác"}
                        </span>
                      );

                      if (isOpen) {
                        statusBadge = (
                          <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>
                            Đang mở
                          </span>
                        );
                      } else if (isPending) {
                        statusBadge = (
                          <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: "rgba(245,158,11,0.1)", color: "#d97706" }}>
                            Chờ duyệt
                          </span>
                        );
                      } else if (isClosed) {
                        statusBadge = (
                          <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                            Đã ẩn
                          </span>
                        );
                      }

                      return (
                        <tr key={course.Id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#fafbfe"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                          <td style={{ padding: "14px 20px", fontWeight: 600, fontSize: 12.5, color: "#2563eb" }}>{course.name}</td>
                          <td style={{ padding: "14px 20px", color: "#475569" }}>{course.provider || "Không xác định"}</td>
                          <td style={{ padding: "14px 20px", color: "#64748b" }}>
                            {course.CreationTime ? new Date(course.CreationTime).toLocaleDateString("vi-VN") : "---"}
                          </td>
                          <td style={{ padding: "14px 20px" }}>{statusBadge}</td>
                          <td style={{ padding: "14px 20px" }}>
                            {isPending ? (
                              <div style={{ display: "flex", gap: 6 }}>
                                <button
                                  onClick={() => handleApprove(course.Id, course.name)}
                                  style={{ padding: "4px 8px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => handleReject(course.Id, course.name)}
                                  style={{ padding: "4px 8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                                >
                                  Từ chối
                                </button>
                              </div>
                            ) : isOpen ? (
                              <button
                                onClick={() => handleReject(course.Id, course.name)}
                                style={{ padding: "4px 8px", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                              >
                                Đóng khóa học
                              </button>
                            ) : (
                              <button
                                onClick={() => handleApprove(course.Id, course.name)}
                                style={{ padding: "4px 8px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                              >
                                Mở lại
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", background: "#fcfdfe" }}>
              <div style={{ fontSize: 11.5, color: "#64748b" }}>
                Hiển thị <b>{Math.min(indexOfLastItem, filteredCourses.length)}</b> trên <b>{filteredCourses.length}</b> khóa học
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

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 24 }}>
            <div style={{ background: "#ffffff", padding: 20, borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 16px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <Clock size={16} style={{ color: "#3b82f6" }} />
                Lịch sử hoạt động gần đây
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { text: "Admin đã phê duyệt khóa học ReactJS & TypeScript Mastery", manager: "Nguyễn Lương", time: "10 phút trước" },
                  { text: "Nhà cung cấp CodeGym vừa gửi yêu cầu duyệt khóa học Node.js", manager: "Hệ thống", time: "1 giờ trước" },
                  { text: "Admin đã tạm khóa khóa học Data Engineering do có phản ánh", manager: "Dương Lương", time: "Hôm qua" }
                ].map((act, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 8, borderLeft: "4px solid #3b82f6", background: "rgba(59,130,246,0.03)" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", fontWeight: 700, color: "#3b82f6" }}>AD</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600 }}>{act.text}</p>
                      <p style={{ margin: "2px 0 0 0", fontSize: 11, color: "#94a3b8" }}>{act.time} • Quản trị viên: {act.manager}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#2563eb", padding: 20, borderRadius: 12, color: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h4 style={{ margin: "0 0 14px 0", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  <Award size={16} />
                  Đối tác đào tạo VietJob
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["FPT Academy", "VTI Cloud", "CodeGym Academy"].map(partner => (
                    <div key={partner} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.1)", borderRadius: 8, backdropFilter: "blur(4px)" }}>
                      <span style={{ fontSize: 12, fontWeight: 500 }}>{partner}</span>
                      <span style={{ fontSize: 9.5, background: "rgba(255,255,255,0.15)", padding: "1px 6px", borderRadius: 4 }}>Đối tác Vàng</span>
                    </div>
                  ))}
                </div>
              </div>
              <button style={{ width: "100%", marginTop: 20, padding: "8px 0", background: "#ffffff", color: "#2563eb", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"} onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}>
                Xem tất cả đối tác
              </button>
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