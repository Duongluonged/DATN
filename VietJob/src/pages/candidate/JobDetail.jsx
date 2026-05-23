
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import axios from "axios";
import ApplyJob from "./ApplyJob";


// ─── SVG Icons ───────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
    <circle cx="8" cy="8" r="8" fill="#0a5c9e" />
    <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
const SalaryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v2m0 8v2M9.5 9.5c0-1.1.9-2 2.5-2s2.5.9 2.5 2-.9 2-2.5 2-2.5.9-2.5 2 .9 2 2.5 2 2.5-.9 2.5-2" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
    <rect x="2" y="3" width="20" height="18" rx="1" />
    <path d="M9 21V9h6v12M9 9H5V3h14v6h-4" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const BookmarkIcon = ({ saved }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? "#0a5c9e" : "none"} stroke="#0a5c9e" strokeWidth="2">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ShieldIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a5c9e" strokeWidth="1.8">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" />
    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PlaneIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TrophyIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a5c9e" strokeWidth="1.8">
    <path d="M6 9H4.5a2.5 2.5 0 0 0 0 5H6m12 0h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M8 21h8M12 17v4M7 4h10v8a5 5 0 0 1-10 0V4z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GrowthIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a5c9e" strokeWidth="1.8">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


// ─── Component ────────────────────────────────────────────────────────────────
const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
   const [job, setJob] = useState(null);
   

  const [loading,setLoading] = useState(true);
  

    useEffect(() => {
        if (!id || id === "undefined") return;

      const fetchJob = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/companies/jobs/${id}`);
          setJob(res.data);

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
            setLoading(false);
        }
      };

      fetchJob();
    }, [id]);


  // Hàm xử lý ứng tuyển
  const handleApply = () => {
    const token = localStorage.getItem("user");
    if (token) {
      setApplied(true); 
      navigate("/candidate/ApplyJob", { state: { jobId: id, jobTitle: job.JobTitle } });
    } else {
      navigate("/login");
    }
  };

  if (!job) {
    return (
      <div style={{ padding: 40, color: "#dc2626", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        ❌ Không tìm thấy công việc với ID: {id}
      </div>
    );
  }

  const benefits = [
    { icon: <ShieldIcon />, title: "Bảo hiểm sức khỏe cao cấp", desc: "Gói chăm sóc sức khỏe toàn diện cho cả gia đình.", dark: false },
    { icon: <PlaneIcon />, title: "Du lịch hàng năm", desc: "Chuyến du lịch nước ngoài resort 5★.", dark: true },
    { icon: <TrophyIcon />, title: "Thưởng hiệu quả", desc: "Thưởng hàng quý và cuối năm xứng đáng.", dark: false },
    { icon: <GrowthIcon />, title: "Đào tạo & Phát triển", desc: "Hỗ trợ 100% chi phí khoá học nâng cấp tại nước ngoài.", dark: false },
  ];

  // ── Inline styles ──
  const s = {
    page:      { fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f0f4f8", minHeight: "100vh" },
    container: { maxWidth: 1100, margin: "24px auto", padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 },
    left:      { display: "flex", flexDirection: "column", gap: 16 },
    right:     { display: "flex", flexDirection: "column", gap: 16 },
    card:      { background: "#fff", borderRadius: 10, padding: "22px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.07)" },
    sectionTitle: { fontSize: 15, fontWeight: 700, color: "#0a5c9e", borderLeft: "3px solid #0a5c9e", paddingLeft: 10, marginBottom: 14 },
    applyBtn:  { background: "linear-gradient(135deg,#0f6dbf,#0a5c9e)", color: "#fff", border: "none", padding: "11px 24px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 3px 12px rgba(10,92,158,0.3)", fontFamily: "inherit" },
    saveBtn:   { background: "#fff", color: "#0a5c9e", border: "1.5px solid #0a5c9e", padding: "10px 18px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" },
    hotBadge:  { background: "linear-gradient(135deg,#ff4757,#ff6b81)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, letterSpacing: "0.5px" },
    infoRow:   { display: "flex", alignItems: "center", gap: 6, color: "#374151", fontSize: 13, marginBottom: 7 },
    reqGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    reqItem:   { background: "#f8fafc", borderRadius: 8, padding: "12px 14px", border: "1px solid #e5e7eb" },
    reqLabel:  { fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", marginBottom: 5 },
    reqValue:  { fontSize: 13.5, fontWeight: 500, color: "#1f2937" },
    benGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    benCard:   (dark) => ({ background: dark ? "linear-gradient(135deg,#0a5c9e,#0f6dbf)" : "#f8fafc", border: dark ? "none" : "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px" }),
    benTitle:  (dark) => ({ fontWeight: 700, fontSize: 13.5, color: dark ? "#fff" : "#1f2937" }),
    benDesc:   (dark) => ({ fontSize: 12.5, color: dark ? "rgba(255,255,255,0.8)" : "#6b7280", lineHeight: 1.5, marginTop: 4 }),
    coverBox:  { background: "linear-gradient(135deg,#0a5c9e,#1e40af,#1d4ed8)", height: 90, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px 10px 0 0", overflow: "hidden" },
    compBody:  { padding: "0 18px 18px" },
    tableRow:  { borderBottom: "1px solid #f3f4f6" },
    tdLabel:   { padding: "9px 0", fontSize: 12.5, color: "#9ca3af", width: "50%" },
    tdValue:   { padding: "9px 0", fontSize: 13, color: "#1f2937", fontWeight: 500 },
  };

  console.log("Dữ liệu thực tế từ API:", job);

  return (
    <div style={s.page}>
      <Navbar />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div style={s.container}>
        <div style={s.left}>
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={s.hotBadge}>HOT JOB</span>
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>⏱ Đăng {job.postedAgo}</span>
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.3, marginBottom: 10 }}>{job.JobTitle}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, background: "#0a5c9e", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BuildingIcon />
                  </div>
                  <span style={{ color: "#0a5c9e", fontWeight: 600, fontSize: 13 }}>{job.CompanyName}</span>
                </div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#16a34a", fontWeight: 600, fontSize: 13 }}>
                    <SalaryIcon />{job.SalaryRange}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 13 }}>
                    <LocationIcon />{job.Location}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flexShrink: 0 }}>
                <button style={s.applyBtn} onClick={handleApply}>
                  {applied ? "Đã ứng tuyển ▶" : "Ứng tuyển ngay ▶"}
                </button>
                <button style={s.saveBtn} onClick={() => setSaved(!saved)}>
                  <BookmarkIcon saved={saved} />{saved ? "Đã lưu tin" : "Lưu tin"}
                </button>
              </div>
            </div>
          </div>

          <div style={s.card}>
          <div style={s.sectionTitle} >Mô tả công việc</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>

            {job.Description ? (
           
              job.Description.split('\n').map((item, i) => (
                item.trim() && ( // Chỉ hiển thị nếu dòng đó có chữ
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <CheckIcon />
                    <span style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </div>
                )
              ))
            ) : (
              <div style={{ fontSize: 13.5, color: "#9ca3af" }}>Đang tải mô tả...</div>
            )}
          </div>
        </div>
          <div style={s.card}>
            <div style={s.sectionTitle} >Yêu cầu ứng viên</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {job.Requirements ? (
                      job.Requirements.split('\n').map((item, i) => (
                        item.trim() && ( // Chỉ hiển thị nếu dòng đó có chữ
                          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <CheckIcon />
                            <span style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>
                              {item}
                            </span>
                          </div>
                        )
                      ))
                    ) : (
                      <div style={{ fontSize: 13.5, color: "#9ca3af", fontStyle: "italic" }}>
                        Chưa có yêu cầu cụ thể cho vị trí này.
                      </div>
                    )}
                </div>
          </div>

          <div style={s.card}>
            <div style={s.sectionTitle}>Phúc lợi dành cho bạn</div>
            <div style={s.benGrid}>
              {benefits.map(({ icon, title, desc, dark }) => (
                <div key={title} style={s.benCard(dark)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    {icon}
                    <span style={s.benTitle(dark)}>{title}</span>
                  </div>
                  <p style={s.benDesc(dark)}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={s.right}>
          <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.07)" }}>
            <div style={s.compBody}>
              <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#0a5c9e,#1d4ed8)", borderRadius: 8, border: "3px solid #fff", marginTop: -20, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
                  {job.LogoURL}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1f2937", marginBottom: 2 }}>{job.CompanyName}</div>
              <div style={{ color: "#6b7280", fontSize: 12, fontStyle: "italic", marginBottom: 12 }}>"{job.companySlogan}"</div>
              <div style={s.infoRow}><BuildingIcon />{job.Size}</div>
              <div style={s.infoRow}><GlobeIcon /><span style={{ color: "#0a5c9e" }}>{job.WebsiteURL}</span></div>
              <div style={s.infoRow}><LocationIcon />{job.Location}</div>
            </div>
          </div>

          <div style={{ ...s.card, padding: 18 }}>
            <div style={s.sectionTitle}>Thông tin bổ sung</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Hình thức", job.JobType],
                  ["Cấp bậc", job.JobLevel],
                  ["Giới tính", job.Gender],
                  ["Hạn nộp hồ sơ", job.ApplicationDeadline],
                ].map(([label, value]) => (
                  <tr key={label} style={s.tableRow}>
                    <td style={s.tdLabel}>{label}</td>
                    <td style={{ ...s.tdValue, color: label === "Hạn nộp hồ sơ" ? "#e53e3e" : "#1f2937", fontWeight: label === "Hạn nộp hồ sơ" ? 700 : 500 }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10 }}>
            <button 
                style={{ ...s.applyBtn, width: "100%", justifyContent: "center", padding: 13, fontSize: 15 }} 
                onClick={handleApply}
            >
                {applied ? "BẠN ĐÃ ỨNG TUYỂN" : "ỨNG TUYỂN NGAY"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;