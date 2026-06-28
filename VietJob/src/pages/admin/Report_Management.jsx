import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Search, Filter, FileText,
  ChevronLeft, ChevronRight, Gavel, Mail,
  CheckCircle, ShieldAlert, Plus, HelpCircle, LogOut, RefreshCw
} from "lucide-react";
import Sidebar from '../../components/common/admin_c/sidebar.jsx';
import Topbar from '../../components/common/admin_c/topbar';
import axios from 'axios';

const Report_Management = () => {
  const [activeTab, setActiveTab] = useState("TẤT CẢ");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [viewingJobModalOpen, setViewingJobModalOpen] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);

  const handleViewJob = async (jobId) => {
    setSelectedJob(null);
    setViewingJobModalOpen(true);
    setFetchingJob(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/companies/jobs/${jobId}`);
      setSelectedJob(res.data);
    } catch (err) {
      console.error("Lỗi lấy chi tiết công việc:", err);
      alert("Không thể tải thông tin chi tiết công việc.");
      setViewingJobModalOpen(false);
    } finally {
      setFetchingJob(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/reports");
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách báo cáo vi phạm:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, status) => {
    if (!window.confirm(`Xác nhận chuyển trạng thái báo cáo này thành "${status === 'Resolved' ? 'Đã giải quyết' : 'Đã bỏ qua'}"?`)) {
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/reports/${reportId}`, { status });
      alert("Cập nhật trạng thái khiếu nại thành công!");
      fetchReports();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái khiếu nại:", err);
      alert("Không thể cập nhật trạng thái.");
    }
  };


  const filteredReports = reports.filter(r => {
    if (activeTab === "KHẨN CẤP") {
      return r.Reason.includes("lừa đảo") || r.Reason.includes("phí") || r.Status === "Pending";
    }
    return true;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "'Be Vietnam Pro', 'Segoe UI', sans-serif", color: "#1a1d27", fontSize: 13 }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <main style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <div className="flex justify-between items-end mb-6">
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Quản lý khiếu nại & Vi phạm</div>
              <div style={{ color: "#888", fontSize: 12, maxWidth: 460, lineHeight: 1.5 }}>
                Xử lý các báo cáo từ cộng đồng ứng viên về tin tuyển dụng không trung thực, lừa đảo hoặc vi phạm quy tắc nền tảng.
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchReports}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-all"
              >
                <RefreshCw size={16} /> Làm mới
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Chưa xử lý", value: String(reports.filter(r => r.Status === 'Pending').length).padStart(2, '0'), color: "border-red-500", textColor: "text-red-500" },
              { label: "Đã giải quyết", value: String(reports.filter(r => r.Status === 'Resolved').length).padStart(2, '0'), color: "border-green-500", textColor: "text-green-500" },
              { label: "Đã bỏ qua", value: String(reports.filter(r => r.Status === 'Ignored').length).padStart(2, '0'), color: "border-gray-500", textColor: "text-gray-500" },
              { label: "Tổng khiếu nại", value: String(reports.length).padStart(2, '0'), color: "border-blue-500", textColor: "text-blue-500" },
            ].map((item, i) => (
              <div key={i} className={`bg-white p-5 rounded-xl border-b-4 ${item.color} shadow-sm`}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</p>
                <h3 className="text-3xl font-black mt-1 tracking-tight">{item.value}</h3>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Danh sách khiếu nại mới nhất</h3>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {["TẤT CẢ", "KHẨN CẤP"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-[10px] font-bold rounded-md transition-all ${activeTab === tab ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
                <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: 8 }} />
                <div>Đang tải dữ liệu báo cáo...</div>
              </div>
            ) : filteredReports.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
                Không có báo cáo nào phù hợp.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                    <th className="px-6 py-4">Người báo cáo</th>
                    <th className="px-6 py-4">Tin tuyển dụng bị khiếu nại</th>
                    <th className="px-6 py-4">Lý do & Chi tiết</th>
                    <th className="px-6 py-4">Thời gian</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px]">
                  {filteredReports.map((r) => {
                    const isPending = r.Status === "Pending";
                    const isResolved = r.Status === "Resolved";
                    const isIgnored = r.Status === "Ignored";

                    return (
                      <tr key={r.ReportID} className={`hover:bg-gray-50/50 transition-all ${isPending ? "bg-red-50/20" : ""}`}>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-[11px]">
                              {(r.ReporterName || "AD").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{r.ReporterName || "Thành viên ẩn danh"}</p>
                              <p className="text-[11px] text-gray-400">{r.ReporterEmail || "Không có Email"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-700">{r.JobTitle}</p>
                          <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase mt-1 inline-block border border-blue-100">
                            {r.CompanyName}
                          </span>
                        </td>
                        <td className="px-6 py-5 max-w-xs">
                          <p className="font-bold text-red-600">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={14} /> {r.Reason}</span>
                          </p>
                          {r.Description && (
                            <p className="text-gray-500 text-[11px] mt-1 font-medium leading-relaxed">{r.Description}</p>
                          )}
                        </td>
                        <td className="px-6 py-5 text-gray-500 font-medium whitespace-nowrap">
                          {new Date(r.CreatedAt).toLocaleDateString("vi-VN")} <br />
                          <span className="text-[10px] text-gray-400">
                            {new Date(r.CreatedAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {isPending && <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full font-bold text-[10px]">CHƯA XỬ LÝ</span>}
                          {isResolved && <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-bold text-[10px]">ĐÃ GIẢI QUYẾT</span>}
                          {isIgnored && <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-bold text-[10px]">ĐÃ BỎ QUA</span>}
                        </td>
                        <td className="px-6 py-5">
                          {isPending ? (
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleViewJob(r.JobID)}
                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md font-bold text-[10px] hover:bg-blue-100 transition-all"
                              >
                                XEM TIN
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.ReportID, "Resolved")}
                                className="px-3 py-1.5 bg-green-50 text-green-600 rounded-md font-bold text-[10px] hover:bg-green-100 transition-all"
                              >
                                GIẢI QUYẾT
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.ReportID, "Ignored")}
                                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md font-bold text-[10px] hover:bg-gray-200 transition-all"
                              >
                                BỎ QUA
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5">
                              <span style={{ color: "#9ca3af", fontStyle: "italic", fontSize: 11 }}>Đã xử lý</span>
                              <button
                                onClick={() => handleViewJob(r.JobID)}
                                className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md font-bold text-[9px] hover:bg-gray-200 transition-all"
                              >
                                XEM TIN
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <div className="p-6 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
              <p className="text-[11px] text-gray-400 font-medium">Hiển thị {filteredReports.length} khiếu nại của hệ thống VietJob</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
            <div className="lg:col-span-2">
              <h4 className="font-black text-gray-900 flex items-center gap-2 mb-6 uppercase tracking-wider text-sm border-l-4 border-blue-600 pl-3">
                Quy trình xử lý vi phạm chuẩn
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "XÁC MINH", desc: "Kiểm tra tính xác thực của người báo cáo và đối chiếu nội dung tin tuyển dụng bị phản ánh." },
                  { step: "2", title: "KHÓA TIN/CẢNH BÁO", desc: "Tạm ẩn tin tuyển dụng vi phạm và gửi email cảnh báo tự động yêu cầu HR giải trình." },
                  { step: "3", title: "XỬ LÝ TÀI KHOẢN", desc: "Gỡ bỏ tin tuyển dụng vĩnh viễn hoặc khóa tài khoản doanh nghiệp vi phạm nghiêm trọng." },
                ].map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                    <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black mb-4">{s.step}</span>
                    <h5 className="font-black text-xs text-gray-800 mb-2">{s.title}</h5>
                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-700 p-8 rounded-3xl text-white relative shadow-2xl shadow-blue-200 flex flex-col justify-between overflow-hidden group">
              <div className="relative z-10">
                <ShieldAlert size={40} className="mb-6 opacity-80 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-black mb-3 leading-tight">Yêu cầu hỗ trợ pháp lý?</h4>
                <p className="text-xs text-blue-100 font-medium leading-relaxed opacity-80">
                  Đối với các vụ việc lừa đảo có tổ chức tinh vi hoặc chiếm đoạt tài sản quy mô lớn, hãy chuyển hồ sơ chứng cứ cho ban Pháp chế xử lý.
                </p>
              </div>
              <button className="relative z-10 w-full mt-10 py-3 bg-white text-blue-700 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-50 transition-all active:scale-95">
                Kết nối pháp chế
              </button>

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
            </div>
          </div>

        </main>
      </div>

      {viewingJobModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease"
        }}>
          <div style={{
            background: "#fff", borderRadius: 24, width: 750, maxWidth: "90%", maxHeight: "85vh",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column",
            fontFamily: "'Be Vietnam Pro',sans-serif"
          }}>
            <div style={{
              background: "linear-gradient(135deg,#1e3a8a,#3b82f6)", padding: "20px 24px",
              color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative"
            }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
                  {fetchingJob ? "Đang tải dữ liệu..." : selectedJob?.JobTitle || "Chi tiết tin tuyển dụng"}
                </h3>
                {!fetchingJob && selectedJob && (
                  <p style={{ fontSize: 12, margin: "4px 0 0 0", opacity: 0.9, fontWeight: 500 }}>
                    Doanh nghiệp: {selectedJob.CompanyName}
                  </p>
                )}
              </div>
              <button
                onClick={() => setViewingJobModalOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
                  width: 32, height: 32, borderRadius: "50%", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 14,
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: 24, overflowY: "auto", flex: 1, background: "#f8fafc" }}>
              {fetchingJob ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#64748b" }}>
                  <RefreshCw size={36} style={{ animation: "spin 1.5s linear infinite", marginBottom: 12, color: "#3b82f6", display: "inline-block" }} />
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Đang truy xuất thông tin chi tiết tin tuyển dụng...</div>
                </div>
              ) : !selectedJob ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#dc2626", fontWeight: 600 }}>
                  ❌ Không tìm thấy thông tin tin tuyển dụng này hoặc tin đã bị gỡ bỏ.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12,
                    background: "#fff", padding: 16, borderRadius: 16, border: "1px solid #e2e8f0"
                  }}>
                    {[
                      ["Mức lương", selectedJob.SalaryRange, "#10b981", "#ecfdf5"],
                      ["Địa điểm", selectedJob.Location, "#3b82f6", "#eff6ff"],
                      ["Hình thức", selectedJob.JobType, "#ea580c", "#fff7ed"],
                      ["Cấp bậc", selectedJob.JobLevel, "#8b5cf6", "#f5f3ff"]
                    ].map(([lbl, val, clr, bgClr]) => (
                      <div key={lbl} style={{ background: bgClr, padding: "10px 12px", borderRadius: 12, textAlign: "center" }}>
                        <div style={{ fontSize: 10.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{lbl}</div>
                        <div style={{ fontSize: 12, color: clr, fontWeight: 800 }}>{val || "Chưa cập nhật"}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1e293b", borderLeft: "4px solid #3b82f6", paddingLeft: 10, marginBottom: 10 }}>
                      MÔ TẢ CÔNG VIỆC
                    </h4>
                    <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                      {selectedJob.Description || "Chưa có thông tin mô tả."}
                    </div>
                  </div>

                  <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1e293b", borderLeft: "4px solid #3b82f6", paddingLeft: 10, marginBottom: 10 }}>
                      YÊU CẦU ỨNG VIÊN
                    </h4>
                    <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                      {selectedJob.Requirements || "Chưa có thông tin yêu cầu."}
                    </div>
                  </div>

                  <div style={{ background: "#fff", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0" }}>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: "#1e293b", borderLeft: "4px solid #3b82f6", paddingLeft: 10, marginBottom: 10 }}>
                      QUYỀN LỢI ĐƯỢC HƯỞNG
                    </h4>
                    <div style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                      {selectedJob.Benefits || "Chưa có thông tin quyền lợi."}
                    </div>
                  </div>

                  <div style={{
                    background: "#fff", padding: 16, borderRadius: 16, border: "1px solid #e2e8f0",
                    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16
                  }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block" }}>HẠN NỘP HỒ SƠ</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>
                        {selectedJob.Deadline ? new Date(selectedJob.Deadline).toLocaleDateString("vi-VN") : "Chưa có"}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", display: "block" }}>QUY MÔ DOANH NGHIỆP</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e293b" }}>{selectedJob.Size || "Chưa có"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              padding: "16px 24px", background: "#fff", borderTop: "1px solid #e2e8f0",
              display: "flex", justifyContent: "flex-end"
            }}>
              <button
                onClick={() => setViewingJobModalOpen(false)}
                style={{
                  padding: "8px 24px", borderRadius: 10, border: "none",
                  background: "#1e293b", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#0f172a"}
                onMouseLeave={e => e.currentTarget.style.background = "#1e293b"}
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Report_Management;