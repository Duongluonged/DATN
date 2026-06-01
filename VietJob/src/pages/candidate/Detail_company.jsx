import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { Factory, Users, Wallet, Globe, Clock, Banknote, Briefcase, MapPin } from "lucide-react";
import axios from "axios";



export default function Detail_company() {
  const { id } = useParams();
  const [following, setFollowing] = useState(false);
  const navigate = useNavigate();
  const [company, setCompanyDetail] = useState(null);
  const [job, setJob] = useState(null); // Mảng chứa công việc từ database
  const [loading, setLoading] = useState(true);
  const [assess, setAssess] = useState();

  const handleAssess = () => {
    const token = localStorage.getItem("user");
    if (token) {
      setAssess(true);
      navigate(`/candidate/Assess/${id}`);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Phải có đầy đủ /api/companies/ trước biến ${id}
        const companyRes = await axios.get(`http://localhost:5000/api/companies/${id}`);
        setCompanyDetail(companyRes.data);

        // 2. Phải có đầy đủ /api/companies/ trước ${id}/jobs
        const jobsRes = await axios.get(`http://localhost:5000/api/companies/${id}/jobs`);
        setJob(jobsRes.data);

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;

  const getOfficePhotos = () => {
    if (!company || !company.OfficePhotos) return [];
    try {
      if (company.OfficePhotos.startsWith('[') && company.OfficePhotos.endsWith(']')) {
        return JSON.parse(company.OfficePhotos);
      }
    } catch (e) { }
    return company.OfficePhotos.split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);
  };
  const officePhotos = getOfficePhotos();


  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f5f6fa", minHeight: "100vh", color: "#1a1a2e" }}>
      {/* Google Font import via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f6fa; }
        .nav-link { cursor: pointer; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 500; color: #555; transition: all 0.2s; }
        .nav-link:hover { background: #f0f0f0; color: #111; }
        .nav-link.active { background: #e8f0fe; color: #1a73e8; font-weight: 600; }
        .follow-btn { border: 1.5px solid #1a73e8; color: #1a73e8; background: white; padding: 7px 20px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .follow-btn:hover { background: #e8f0fe; }
        .follow-btn.following { background: #1a73e8; color: white; }
        .post-job-btn { background: #1a73e8; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .post-job-btn:hover { background: #1557b0; }
        .job-card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; border: 1.5px solid #e8ecf0; transition: box-shadow 0.2s, border-color 0.2s; cursor: pointer; }
        .job-card:hover { box-shadow: 0 4px 18px rgba(26,115,232,0.10); border-color: #b3ccf5; }
        .tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; display: inline-block; letter-spacing: 0.03em; }
        .apply-btn { background: #1a73e8; color: white; border: none; padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .apply-btn:hover { background: #1557b0; }
        .section-tab { font-size: 13px; font-weight: 700; color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 4px; display: inline-block; margin-bottom: 14px; letter-spacing: 0.04em; }
        .info-chip { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #444; background: #f5f6fa; border-radius: 8px; padding: 7px 12px; }
        .more-jobs-link { color: #1a73e8; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; display: block; margin-top: 8px; }
        .more-jobs-link:hover { text-decoration: underline; }
      `}</style>

      <Navbar />

      {/* Hero / Company Banner */}
      <div style={{ maxWidth: 1600, margin: "28px auto 0", padding: "0 24px" }}>
        <div style={{ background: "white", borderRadius: 16, border: "1.5px dashed #b3ccf5", overflow: "hidden", boxShadow: "0 2px 16px rgba(26,115,232,0.06)" }}>

          {/* Company info row */}
          <div style={{ padding: "0 28px 20px", display: "flex", alignItems: "flex-end", gap: 20, marginTop: -40 }}>
            {/* Logo */}
            <div style={{ width: 80, height: 80, background: "white", borderRadius: 16, border: "3px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {company.LogoURL}
            </div>
            <div style={{ flex: 1, paddingBottom: 4, marginTop: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", fontFamily: "'Be Vietnam Pro', sans-serif" }}>{company.CompanyName}</h1>
              </div>
              <p style={{ color: "#666", fontSize: 13, marginTop: 2 }}>{company.WebsiteURL}</p>
            </div>
            <div style={{ display: "flex", gap: 10, paddingBottom: 4, marginTop: 44 }}>
              <button className={`follow-btn${following ? " following" : ""}`} onClick={() => setFollowing(!following)}>
                {following ? "✓ Đang theo dõi" : "+ Theo dõi"}
              </button>
              <button style={{ background: "#f5f6fa", color: "#333", border: "1.5px solid #e0e0e0", padding: "7px 20px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer" }} onClick={handleAssess}>
                Viết đánh giá</button>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ borderTop: "1px solid #f0f0f0", padding: "12px 28px", display: "flex", gap: 40 }}>
            {[[company.ReviewCount || "0+", "Đánh giá"], [company.Rating || "0★", "Điểm TB"], [company.AverageSalary || "86 US$", "Lương TB"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#1a1a2e" }}>{val}</div>
                <div style={{ fontSize: 16, color: "#888", marginTop: 1 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, marginTop: 24 }}>
          {/* Left column */}
          <div>
            {/* Company Info chips */}
            <div style={{ background: "white", borderRadius: 14, border: "1px solid #e8ecf0", padding: "18px 22px", marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div className="info-chip">
                <span><Factory /></span>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>LĨNH VỰC</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{company.Industry || "Chưa xác định"}</div>
                </div>
              </div>
              <div className="info-chip">
                <span><Users /></span>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>QUY MÔ</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{company.Size || "Chưa xác định"}</div>
                </div>
              </div>
              <div className="info-chip">
                <span><Wallet /></span>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>MỨC LƯƠNG</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{company.AverageSalary || "Chưa xác định"}</div>
                </div>
              </div>
              <div className="info-chip">
                <span><Globe /></span>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>QUỐC GIA</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{company.Country || "Chưa xác định"}</div>
                </div>
              </div>
              <div className="info-chip" style={{ gridColumn: "span 2" }}>
                <span><Clock /></span>
                <div>
                  <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>THỜI GIAN LÀM VIỆC</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{company.WorkingTime || "Chưa xác định"}</div>
                </div>
              </div>
            </div>

            {/* About section */}
            <div style={{ background: "white", borderRadius: 14, border: "1px solid #e8ecf0", padding: "20px 22px", marginBottom: 20 }}>
              <div className="section-tab">VỀ {company.CompanyName}</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "#444" }}>
                {company.LongDescription || "Chưa có mô tả cho công ty này."}
              </p>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "#444", marginTop: 10 }}>
                Với đội ngũ hơn 200 nhân sự, chúng tôi không ngừng tìm kiếm những tài năng xuất sắc có đam mê đổi mới và sáng tạo. Chúng tôi cam kết mang lại môi trường làm việc chuyên nghiệp, năng động và đầy cơ hội phát triển bản thân.
              </p>
              {/* Product preview mockup */}
              <div style={{ marginTop: 16, background: "#f5f6fa", borderRadius: 10, padding: 16, border: "1px solid #e8ecf0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["#ff6b6b", "#ffd93d", "#6bcb77"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  {officePhotos.length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#1a73e8", background: "#e8f0fe", padding: "2px 8px", borderRadius: 12 }}>
                      Hình ảnh văn phòng thực tế ({officePhotos.length})
                    </span>
                  )}
                </div>

                {officePhotos.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                    {officePhotos.map((photoUrl, idx) => (
                      <div key={idx} style={{ position: "relative", borderRadius: 8, overflow: "hidden", height: 110, border: "1px solid #e2e8f0", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", background: "#fff" }}>
                        <img
                          src={photoUrl.startsWith("http") || photoUrl.startsWith("data:") ? photoUrl : `http://localhost:5000${photoUrl}`}
                          alt={`Văn phòng ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                    <div>
                      <div style={{ height: 60, background: "#e0e8ff", borderRadius: 6, marginBottom: 6 }} />
                      <div style={{ height: 40, background: "#e8f4fd", borderRadius: 6 }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ height: 20, background: "#e0e8ff", borderRadius: 4 }} />
                      <div style={{ height: 14, background: "#f0f0f0", borderRadius: 4, width: "70%" }} />
                      <div style={{ height: 14, background: "#f0f0f0", borderRadius: 4, width: "90%" }} />
                      <div style={{ height: 14, background: "#f0f0f0", borderRadius: 4, width: "60%" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Job listings */}
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px", color: "#111" }}>
              {company.JobCount} Việc làm đang tuyển dụng
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "800px", overflowY: "auto", paddingRight: "4px" }}>
              {job.map((job) => (
                <div
                  key={job.JobID || job.id}
                  onClick={() => {
                    navigate(`/job-detail/${job.JobID}`); // Viết thường chữ n ở đây
                  }}
                  className="job-card"
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    border: "1px solid #eee",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    flexShrink: 0,

                    // 2. Chuyển con trỏ chuột thành dạng bàn tay
                    cursor: "pointer",

                    // 3. Hiệu ứng chuyển cảnh mượt mà
                    transition: "all 0.2s ease-in-out",
                  }}
                  // 4. Thêm hiệu ứng Hover trực tiếp bằng inline style (hoặc dùng CSS class)
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#1a73e8";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(26,115,232,0.12)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#eee";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Thời gian đăng tin */}
                  <div style={{ fontSize: "13px", color: "#999", marginBottom: "12px" }}>
                    Đăng 15 ngày trước
                  </div>

                  {/* Tiêu đề công việc */}
                  <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111", marginBottom: "16px" }}>
                    {job.JobTitle || "Chưa có tiêu đề công việc"}
                  </h3>

                  {/* Logo và Tên công ty */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", border: "1px solid #eee", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px" }}>
                      <div style={{ background: "#1a1a2e", borderRadius: "50%", width: "24px", height: "24px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px" }}>{company.LogoURL}</div>
                    </div>
                    <span style={{ fontSize: "15px", color: "#555" }}>{company.CompanyName || "Chưa có tên công ty"}</span>
                  </div>

                  {/* Mức lương / Quyền lợi */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#28a745", fontWeight: "600", fontSize: "15px", marginBottom: "16px", borderBottom: "1px dashed #eee", paddingBottom: "16px" }}>
                    <div style={{ background: "#28a745", borderRadius: "50%", padding: "2px" }}>
                      <Banknote size={14} color="white" />
                    </div>
                    {job.SalaryRange || "Mức lương chưa được công bố"}
                  </div>

                  {/* Thông tin chi tiết: Ngành nghề & Địa điểm */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#666", fontSize: "14px" }}>
                      <Briefcase size={16} />
                      <span style={{ textDecoration: "underline", textDecorationStyle: "dotted" }}>{job.JobCategory || "Chưa có ngành nghề"}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#666", fontSize: "14px" }}>
                      <MapPin size={16} />
                      <span>{job.WorkLocation || "Chưa có địa điểm làm việc"}</span>
                      <span style={{ color: "#ccc" }}>•</span>
                      <span>{company.Location || "Chưa có địa điểm công ty"}</span>
                    </div>
                  </div>

                  {/* Tags kỹ năng */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {/* 1. Kiểm tra Skills tồn tại, 2. Split chuỗi thành mảng, 3. Map qua từng phần tử */}
                    {job.Skills?.split(",").map((tag, index) => (
                      <span
                        key={`${job.id}-${tag}-${index}`} // Tạo key duy nhất kết hợp với index
                        style={{
                          background: "#f8f9fa",
                          color: "#666",
                          padding: "4px 14px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          border: "1px solid #eee"
                        }}
                      >
                        {tag.trim()} {/* Dùng .trim() để xóa khoảng trắng dư thừa */}
                      </span>
                    ))}

                    {/* Chỉ hiển thị +2 nếu cần thiết, hoặc có thể ẩn đi nếu đã map hết */}
                    <span style={{ background: "#f8f9fa", color: "#666", padding: "4px 10px", borderRadius: "20px", fontSize: "13px", border: "1px solid #eee" }}>
                      +2
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}