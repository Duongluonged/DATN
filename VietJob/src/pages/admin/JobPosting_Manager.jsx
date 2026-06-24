import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar.jsx';
import { Search, CheckCircle, XCircle, Hourglass, Eye, Briefcase, PenTool, MapPin, Banknote, Clock } from "lucide-react";

export default function JobListings() {
  const [activeNav, setActiveNav] = useState("Job Listings");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả"); // "Tất cả", "Chờ duyệt", "Đã duyệt"
  const [activePage, setActivePage] = useState(1);

  // Lấy danh sách tin tuyển dụng từ backend
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/admin/all");
      setJobs(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tin tuyển dụng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Thay đổi trạng thái duyệt
  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/admin/status/${jobId}`, {
        isActive: !currentStatus
      });
      fetchJobs();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái tin tuyển dụng.");
    }
  };

  // Tính toán thống kê động từ dữ liệu thực tế
  const pendingCount = jobs.filter(j => !j.IsActive).length;
  const approvedCount = jobs.filter(j => j.IsActive).length;
  const totalCount = jobs.length;

  const STATS = [
    { icon: <Hourglass size={20} color="#b45309" />, label: "Đang chờ duyệt", value: pendingCount, bg: "#fffbeb" },
    { icon: <CheckCircle size={20} color="#15803d" />, label: "Đã phê duyệt",   value: approvedCount, bg: "#f0fdf4" },
    { icon: <Briefcase size={20} color="#3b7efa" />, label: "Tổng số tin tuyển dụng", value: totalCount, bg: "#eff6ff" },
  ];

  // Lọc và Tìm kiếm
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      (job.JobTitle && job.JobTitle.toLowerCase().includes(search.toLowerCase())) || 
      (job.CompanyName && job.CompanyName.toLowerCase().includes(search.toLowerCase())) ||
      (job.Location && job.Location.toLowerCase().includes(search.toLowerCase()));
      
    if (activeTab === "Chờ duyệt") return matchesSearch && !job.IsActive;
    if (activeTab === "Đã duyệt") return matchesSearch && job.IsActive;
    return matchesSearch;
  });

  // Phân trang đơn giản (10 dòng mỗi trang)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const displayedJobs = filteredJobs.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>

          {/* Page Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Quản lý tin tuyển dụng</div>
              <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>Phê duyệt và kiểm soát chất lượng nội dung tuyển dụng trên toàn hệ thống.</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              {["Tất cả", "Chờ duyệt", "Đã duyệt"].map((label) => (
                <button 
                  key={label} 
                  onClick={() => { setActiveTab(label); setActivePage(1); }}
                  style={{
                    border: activeTab === label ? "none" : "1px solid #e8eaf0",
                    background: activeTab === label ? "#3b7efa" : "#fff",
                    color: activeTab === label ? "#fff" : "#8b93a7",
                    borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
            {STATS.map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #e8eaf0", borderRadius: 10, padding: "14px 18px", minWidth: 110, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#8b93a7", marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ background: "#fff", border: "1px solid #e8eaf0", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
            <Search size={16} color="#8b93a7" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề công việc, công ty, địa điểm..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActivePage(1); }}
              style={{ border: "none", outline: "none", width: "100%", fontSize: 13, color: "#1a1d27" }}
            />
          </div>

          {/* Table */}
          <div style={{ background: "#fff", border: "1px solid #e8eaf0", borderRadius: 12, overflow: "hidden" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#8b93a7" }}>
                Đang tải danh sách tin tuyển dụng...
              </div>
            ) : displayedJobs.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#8b93a7" }}>
                Không tìm thấy tin tuyển dụng nào phù hợp.
              </div>
            ) : (
              <>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e8eaf0", background: "#fafbfc" }}>
                      {["THÔNG TIN CÔNG VIỆC", "NHÀ TUYỂN DỤNG", "TRẠNG THÁI", "NGÀY ĐĂNG", "THAO TÁC"].map(h => (
                        <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#8b93a7", textTransform: "uppercase", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedJobs.map((job, idx) => {
                      const formattedDate = job.CreatedAt ? new Date(job.CreatedAt).toLocaleDateString('vi-VN') : "Chưa rõ";
                      return (
                        <tr key={job.JobID} style={{ borderBottom: idx < displayedJobs.length - 1 ? "1px solid #e8eaf0" : "none" }}>
                          {/* Job cell */}
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#eff6ff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Briefcase size={18} color="#3b7efa" />
                              </div>
                              <div>
                                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 3, color: "#1a1d27" }}>{job.JobTitle}</div>
                                <div style={{ fontSize: 11, color: "#8b93a7", display: "flex", gap: 8, flexWrap: "wrap" }}>
                                  <span style={{display: 'flex', alignItems: 'center', gap: 4}}><MapPin size={12}/> {job.Location}</span>
                                  <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Banknote size={12}/> {job.SalaryRange || "Thỏa thuận"}</span>
                                  {job.JobType && <span style={{display: 'flex', alignItems: 'center', gap: 4}}><Clock size={12}/> {job.JobType}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Employer */}
                          <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1a1d27" }}>{job.CompanyName}</div>
                            {job.Skills && <div style={{ fontSize: 11, color: "#8b93a7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }} title={job.Skills}><span style={{display: 'flex', alignItems: 'center', gap: 4}}><PenTool size={12}/> {job.Skills}</span></div>}
                          </td>
                          {/* Status */}
                          <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                            {job.IsActive ? (
                              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, background: "#dcfce7", color: "#15803d", letterSpacing: ".02em" }}>
                                ĐÃ DUYỆT
                              </span>
                            ) : (
                              <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6, background: "#fff3cd", color: "#b45309", letterSpacing: ".02em" }}>
                                CHỜ DUYỆT
                              </span>
                            )}
                          </td>
                          {/* Date */}
                          <td style={{ padding: "12px 14px", verticalAlign: "middle", fontSize: 12, color: "#8b93a7" }}>{formattedDate}</td>
                          {/* Actions */}
                          <td style={{ padding: "12px 14px", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {/* Xem chi tiết */}
                              <div
                                title="Xem chi tiết"
                                style={{ width: 28, height: 28, border: "1px solid #e8eaf0", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff" }}
                              >
                                <Eye size={13} color="#8b93a7" />
                              </div>
                              
                              {/* Duyệt / Huỷ duyệt */}
                              {job.IsActive ? (
                                <button
                                  onClick={() => handleToggleStatus(job.JobID, true)}
                                  title="Tạm dừng / Từ chối duyệt"
                                  style={{ width: 28, height: 28, border: "1px solid #fee2e2", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff", transition: "all 0.15s", outline: "none" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#ef4444"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#fee2e2"; }}
                                >
                                  <XCircle size={13} color="#ef4444" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleToggleStatus(job.JobID, false)}
                                  title="Phê duyệt đăng tin"
                                  style={{ width: 28, height: 28, border: "1px solid #dcfce7", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "#fff", transition: "all 0.15s", outline: "none" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.borderColor = "#22c55e"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#dcfce7"; }}
                                >
                                  <CheckCircle size={13} color="#22c55e" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Footer */}
                {totalPages > 1 && (
                  <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #e8eaf0" }}>
                    <div style={{ fontSize: 11.5, color: "#8b93a7" }}>
                      Hiển thị dòng {(activePage - 1) * itemsPerPage + 1} – {Math.min(activePage * itemsPerPage, filteredJobs.length)} trên tổng số {filteredJobs.length} tin
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                          key={i} 
                          onClick={() => setActivePage(i + 1)} 
                          style={{
                            width: 28, height: 28,
                            background: activePage === i + 1 ? "#3b7efa" : "#fff",
                            border: `1px solid ${activePage === i + 1 ? "#3b7efa" : "#e8eaf0"}`,
                            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
                            color: activePage === i + 1 ? "#fff" : "#8b93a7",
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}