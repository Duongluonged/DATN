
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
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
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
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [suggestedCourses, setSuggestedCourses] = useState([]);

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        if (res.data) {
          const activeCourses = res.data.filter(c => c.status === "Đang bán" || c.status === "Đang mở" || c.status === "Đang hoạt động" || !c.status);
          setCourses(activeCourses);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách khóa học gợi ý:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (job && courses.length > 0) {
      // 1. Gộp toàn bộ văn bản công việc để tìm kỹ năng yêu cầu
      const jobText = `${job.JobTitle} ${job.Description || ""} ${job.Requirements || ""} ${job.NganhNghe || ""}`.toLowerCase();

      // 2. Xác định Chuyên mục phù hợp nhất dựa trên từ khóa công việc
      let matchedCategory = 'web';
      if (jobText.includes('mobile') || jobText.includes('flutter') || jobText.includes('react native') || jobText.includes('android') || jobText.includes('ios')) {
        matchedCategory = 'mobile';
      } else if (jobText.includes('data') || jobText.includes('ai') || jobText.includes('python') || jobText.includes('machine') || jobText.includes('dữ liệu') || jobText.includes('trí tuệ nhân tạo') || jobText.includes('deep learning') || jobText.includes('analyst') || jobText.includes('sql') || jobText.includes('bi')) {
        matchedCategory = 'data-ai';
      } else if (jobText.includes('design') || jobText.includes('game') || jobText.includes('figma') || jobText.includes('unity') || jobText.includes('ux') || jobText.includes('ui') || jobText.includes('blender')) {
        matchedCategory = 'design-gamedev';
      }

      // 3. Danh sách các kỹ năng kỹ thuật & công nghệ cốt lõi
      const skillKeywords = [
        "react", "node", "express", "mongodb", "next.js", "tailwind", "html", "css", "javascript", "typescript", "frontend", "backend", "fullstack",
        "flutter", "dart", "react native", "android", "ios", "swift", "kotlin", "mobile", "app",
        "python", "pandas", "numpy", "machine learning", "deep learning", "ai", "artificial intelligence", "trí tuệ nhân tạo", "tensorflow", "keras", "sql", "database", "data analysis", "khoa học dữ liệu",
        "figma", "ui", "ux", "design", "thiết kế", "prototype", "gamedev", "unity", "c#", "game 3d"
      ];

      // Lọc các kỹ năng có xuất hiện trong thông tin tuyển dụng
      const activeJobSkills = skillKeywords.filter(skill => jobText.includes(skill));

      // 4. Tính điểm độ phù hợp cho từng khóa học
      const scoredCourses = courses.map(course => {
        // Tự động phân loại chuyên mục cho khóa học nếu trong database bị trống/null
        let courseCat = (course.Category || "").toLowerCase();
        const courseTitle = (course.TieuDe || course.name || "").toLowerCase();
        if (!courseCat) {
          if (courseTitle.includes('mobile') || courseTitle.includes('flutter') || courseTitle.includes('react') || courseTitle.includes('android') || courseTitle.includes('ios')) {
            courseCat = 'mobile';
          } else if (courseTitle.includes('data') || courseTitle.includes('ai') || courseTitle.includes('python') || courseTitle.includes('machine') || courseTitle.includes('dữ liệu') || courseTitle.includes('trí tuệ nhân tạo') || courseTitle.includes('deep learning') || courseTitle.includes('thống kê') || courseTitle.includes('analyst')) {
            courseCat = 'data-ai';
          } else if (courseTitle.includes('design') || courseTitle.includes('game') || courseTitle.includes('figma') || courseTitle.includes('unity') || courseTitle.includes('blender')) {
            courseCat = 'design-gamedev';
          } else {
            courseCat = 'web';
          }
        }

        const courseText = `${courseTitle} ${(course.MoTa || "").toLowerCase()} ${courseCat}`.toLowerCase();
        let score = 0;

        // Ưu tiên cao nhất cho khóa học cùng Chuyên mục đã xác định
        if (courseCat === matchedCategory) {
          score += 15;
        }

        // Điểm cộng cho từng kỹ năng cụ thể trùng khớp
        activeJobSkills.forEach(skill => {
          if (courseText.includes(skill)) {
            score += 5;
          }
        });

        // Trả về đối tượng khóa học đã được cập nhật Category sạch sẽ để UI kết xuất chuẩn
        return {
          course: {
            ...course,
            Category: courseCat
          },
          score
        };
      });

      // 5. CHỈ giữ lại các khóa học có điểm độ tương thích cao (tối thiểu là 10 điểm)
      const validSuggestions = scoredCourses.filter(item => item.score >= 10);

      // Sắp xếp giảm dần theo điểm số và lấy ra tối đa 3 khóa học phù hợp nhất
      validSuggestions.sort((a, b) => b.score - a.score);
      const top3 = validSuggestions.slice(0, 3).map(item => item.course);

      setSuggestedCourses(top3);
    }
  }, [job, courses]);


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

  const userObj = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userObj?.id || null;

  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const handleOpenReport = () => {
    const token = localStorage.getItem("user");
    if (!token) {
      navigate("/login");
      return;
    }
    setReportReason("");
    setReportDescription("");
    setReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportReason) {
      alert("Vui lòng chọn lý do báo cáo vi phạm.");
      return;
    }
    setSubmittingReport(true);
    try {
      await axios.post("http://localhost:5000/api/reports", {
        jobId: id,
        userId: userId,
        reason: reportReason,
        description: reportDescription
      });
      alert("Cảm ơn bạn đã gửi phản ánh. VietJob sẽ tiến hành kiểm duyệt và xử lý tin tuyển dụng này trong thời gian sớm nhất!");
      setReportModalOpen(false);
    } catch (err) {
      console.error("Lỗi gửi báo cáo vi phạm:", err);
      alert("Không thể gửi báo cáo. Vui lòng thử lại sau.");
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleChatWithEmployer = () => {
    const token = localStorage.getItem("user");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!job || !job.CompanyID) {
      alert("Không tìm thấy thông tin công ty.");
      return;
    }

    setChatMessage("");
    setChatModalOpen(true);
  };

  const submitChatMessage = async () => {
    if (!userId || !job || !job.CompanyID || !chatMessage.trim()) return;
    setSendingChat(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/employer-of-company/${job.CompanyID}`);
      const employerUserId = res.data.Id;

      await axios.post(`http://localhost:5000/api/messages/send`, {
        senderId: userId,
        receiverId: employerUserId,
        messageContent: chatMessage
      });

      setChatModalOpen(false);
      setChatMessage("");
      navigate(`/candidate/Quan_ly_tin_nhan?partnerId=${employerUserId}`);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn nhanh từ chi tiết công việc:", err);
      alert("Doanh nghiệp này chưa kích hoạt tài khoản nhắn tin tuyển dụng.");
    } finally {
      setSendingChat(false);
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
    page: { fontFamily: "'Be Vietnam Pro','Segoe UI',sans-serif", background: "#f0f4f8", minHeight: "100vh" },
    container: { maxWidth: 1100, margin: "24px auto", padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 },
    left: { display: "flex", flexDirection: "column", gap: 16 },
    right: { display: "flex", flexDirection: "column", gap: 16 },
    card: { background: "#fff", borderRadius: 10, padding: "22px 24px", boxShadow: "0 1px 8px rgba(0,0,0,0.07)" },
    sectionTitle: { fontSize: 15, fontWeight: 700, color: "#0a5c9e", borderLeft: "3px solid #0a5c9e", paddingLeft: 10, marginBottom: 14 },
    applyBtn: { background: "linear-gradient(135deg,#0f6dbf,#0a5c9e)", color: "#fff", border: "none", padding: "11px 24px", borderRadius: 6, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 3px 12px rgba(10,92,158,0.3)", fontFamily: "inherit" },
    saveBtn: { background: "#fff", color: "#0a5c9e", border: "1.5px solid #0a5c9e", padding: "10px 18px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit" },
    hotBadge: { background: "linear-gradient(135deg,#ff4757,#ff6b81)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, letterSpacing: "0.5px" },
    infoRow: { display: "flex", alignItems: "center", gap: 6, color: "#374151", fontSize: 13, marginBottom: 7 },
    reqGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
    reqItem: { background: "#f8fafc", borderRadius: 8, padding: "12px 14px", border: "1px solid #e5e7eb" },
    reqLabel: { fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.8px", marginBottom: 5 },
    reqValue: { fontSize: 13.5, fontWeight: 500, color: "#1f2937" },
    benGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    benCard: (dark) => ({ background: dark ? "linear-gradient(135deg,#0a5c9e,#0f6dbf)" : "#f8fafc", border: dark ? "none" : "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px" }),
    benTitle: (dark) => ({ fontWeight: 700, fontSize: 13.5, color: dark ? "#fff" : "#1f2937" }),
    benDesc: (dark) => ({ fontSize: 12.5, color: dark ? "rgba(255,255,255,0.8)" : "#6b7280", lineHeight: 1.5, marginTop: 4 }),
    coverBox: { background: "linear-gradient(135deg,#0a5c9e,#1e40af,#1d4ed8)", height: 90, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px 10px 0 0", overflow: "hidden" },
    compBody: { padding: "0 18px 18px" },
    tableRow: { borderBottom: "1px solid #f3f4f6" },
    tdLabel: { padding: "9px 0", fontSize: 12.5, color: "#9ca3af", width: "50%" },
    tdValue: { padding: "9px 0", fontSize: 13, color: "#1f2937", fontWeight: 500 },
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
                <button
                  style={{ ...s.saveBtn, background: "linear-gradient(135deg,#16a34a,#10b981)", color: "#fff", border: "none", width: "100%", justifyContent: "center", fontWeight: 700 }}
                  onClick={handleChatWithEmployer}
                >
                  💬 Nhắn tin
                </button>
                <button style={{ ...s.saveBtn, width: "100%", justifyContent: "center" }} onClick={() => setSaved(!saved)}>
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

          {suggestedCourses.length > 0 && (
            <div style={{ ...s.card, background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)", border: "1.5px dashed #bfdbfe" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Gợi ý lộ trình học tập nâng cao năng lực
                </div>
              </div>
              <p style={{ margin: "0 0 16px 0", fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                Dựa trên mô tả vị trí tuyển dụng <strong style={{ color: "#2563eb" }}>{job.JobTitle}</strong>, VietJob đề xuất các lộ trình học tập thực chiến giúp bạn tự tin chinh phục nhà tuyển dụng:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                {suggestedCourses.map((c) => {
                  let catLabel = "Lập trình Web";
                  let catColor = "linear-gradient(135deg, #2563eb, #3b82f6)";
                  if (c.Category === "mobile") {
                    catLabel = "Lập trình Mobile";
                    catColor = "linear-gradient(135deg, #7c3aed, #8b5cf6)";
                  } else if (c.Category === "data-ai") {
                    catLabel = "Dữ liệu & AI";
                    catColor = "linear-gradient(135deg, #059669, #10b981)";
                  } else if (c.Category === "design-gamedev") {
                    catLabel = "Thiết kế & Gamedev";
                    catColor = "linear-gradient(135deg, #e11d48, #f43f5e)";
                  }

                  return (
                    <div
                      key={c.Id}
                      onClick={() => navigate('/courses')}
                      style={{
                        background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
                        display: "flex", flexDirection: "column", overflow: "hidden", cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.08)";
                        e.currentTarget.style.borderColor = "#bfdbfe";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#e2e8f0";
                      }}
                    >
                      <div style={{ background: catColor, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.5px" }}>{catLabel}</span>
                        <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, padding: "2px 6px", borderRadius: 20 }}>🎓 PRO</span>
                      </div>
                      <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {c.TieuDe || c.name}
                          </h4>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "#64748b", marginBottom: 12 }}>
                            <span>⏱️ {c.Duration || "45 giờ"}</span>
                            <span>📚 {c.LecturesCount || 50} bài học</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontSize: 10, textDecoration: "line-through", color: "#94a3b8" }}>{c.OldPrice ? c.OldPrice.toLocaleString() : "3,000,000"}đ</div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: "#2563eb" }}>{c.Price ? c.Price.toLocaleString() : "1,500,000"}đ</div>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", display: "flex", alignItems: "center", gap: 4 }}>
                              Chi tiết ➔
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
            <div style={{ marginTop: 14, borderTop: "1px solid #f3f4f6", paddingTop: 14, textAlign: "center" }}>
              <span
                onClick={handleOpenReport}
                style={{ fontSize: 12.5, fontWeight: 600, color: "#ea580c", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <AlertIcon /> Báo cáo tin tuyển dụng vi phạm
              </span>
            </div>
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

      {chatModalOpen && job && (
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
              Gửi lời chào hoặc câu hỏi đến nhà tuyển dụng công ty <strong style={{ color: "#0a5c9e" }}>{job.CompanyName}</strong>. Tin nhắn sẽ được gửi và hiển thị trong mục Tin nhắn.
            </p>

            {/* Gợi ý tin nhắn mẫu */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Lời chào gợi ý</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "Xin chào, tôi rất quan tâm đến vị trí tuyển dụng này và muốn trao đổi thêm.",
                  "Chào anh/chị tuyển dụng, em đã ứng tuyển và muốn gửi lời chào đến HR.",
                  "Chào công ty, em muốn tìm hiểu thêm về môi trường làm việc của dự án này."
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
              placeholder="Nhập lời nhắn khởi đầu của bạn tại đây..."
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
                  background: "linear-gradient(135deg,#0a5c9e,#1e40af)", color: "#fff",
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

      {reportModalOpen && job && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, backdropFilter: "blur(4px)", animation: "fadeIn 0.2s ease"
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, width: 480, padding: 24,
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
            fontFamily: "'Be Vietnam Pro',sans-serif"
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#e11d48", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span>⚠️</span> Báo cáo tin tuyển dụng vi phạm
            </h3>
            <p style={{ fontSize: 12.5, color: "#64748b", marginBottom: 18 }}>
              Phản ánh của bạn giúp VietJob giữ gìn môi trường tìm việc an toàn, lành mạnh. Chúng tôi cam kết bảo mật danh tính người báo cáo.
            </p>

            {/* Chọn lý do */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 8 }}>
                Vui lòng chọn lý do vi phạm:
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Tin tuyển dụng lừa đảo, giả mạo doanh nghiệp",
                  "Yêu cầu ứng viên đóng phí đặt cọc / mua đồng phục / khóa học",
                  "Nội dung công việc sai lệch hoàn toàn so với mô tả thực tế",
                  "Ngôn từ phản cảm, thô tục hoặc phân biệt đối xử",
                  "Lý do vi phạm khác"
                ].map((reason) => {
                  const isSelected = reportReason === reason;
                  return (
                    <div
                      key={reason}
                      onClick={() => setReportReason(reason)}
                      style={{
                        padding: "10px 14px", borderRadius: 10, border: isSelected ? "1.5px solid #e11d48" : "1.5px solid #e2e8f0",
                        background: isSelected ? "#fff1f2" : "#fff", color: isSelected ? "#9f1239" : "#475569",
                        fontSize: 12.5, fontWeight: isSelected ? 700 : 500, cursor: "pointer", transition: "all 0.15s",
                        display: "flex", alignItems: "center", gap: 10
                      }}
                    >
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => { }}
                        style={{ accentColor: "#e11d48", pointerEvents: "none" }}
                      />
                      <span>{reason}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Giải thích chi tiết */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>
                Mô tả chi tiết vi phạm (nếu có):
              </label>
              <textarea
                placeholder="Nhập thông tin chi tiết hoặc bằng chứng vi phạm để giúp ban quản trị xác thực nhanh chóng hơn..."
                value={reportDescription}
                onChange={e => setReportDescription(e.target.value)}
                style={{
                  width: "100%", height: 90, border: "1.5px solid #cbd5e1", borderRadius: 12,
                  padding: "10px 12px", fontSize: 13, outline: "none", resize: "none",
                  fontFamily: "inherit"
                }}
              />
            </div>

            {/* Điều hướng chân trang */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => { setReportModalOpen(false); }}
                style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", color: "#64748b", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={submittingReport || !reportReason}
                style={{
                  padding: "8px 20px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#e11d48,#be123c)", color: "#fff",
                  fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6, opacity: (submittingReport || !reportReason) ? 0.6 : 1
                }}
              >
                {submittingReport ? "Đang gửi báo cáo..." : "Gửi báo cáo vi phạm"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobDetail;