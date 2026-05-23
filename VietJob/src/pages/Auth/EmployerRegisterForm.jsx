import { useState } from "react";
import axios from "axios";
import Navbar_empl from "../../components/common/Employer_c/Navbar_empl";

const INDUSTRIES = [
  "Công nghệ thông tin",
  "Tài chính – Ngân hàng",
  "Thương mại điện tử",
  "Sản xuất",
  "Giáo dục",
  "Y tế",
  "Bất động sản",
  "Khác",
];

const COMPANY_SIZES = ["1–10 người", "11–50 người", "51–200 người", "200+ người"];

/* ─── icons (inline SVG) ─────────────────────────────────── */
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const BuildingIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="1" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16z" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function EmployerRegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    contactEmail: "",
    website: "",
    phone: "",
    address: "",
    description: "",
    companySize: "1–10 người",
    industry: "Công nghệ thông tin",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = "Vui lòng nhập họ và tên";
    if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.name.trim()) newErrors.name = "Vui lòng nhập tên công ty";
    if (!form.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 8) newErrors.password = "Mật khẩu tối thiểu 8 ký tự";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      await axios.post("http://localhost:5000/api/auth/register/employer", {
        username: form.username,
        email: form.email,
        password: form.password,
        name: form.name,
        contactEmail: form.contactEmail || form.email,
        website: form.website,
        phone: form.phone,
        address: form.address,
        description: form.description,
        companySize: form.companySize,
        industry: form.industry,
      });
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Success screen ─────────────────────────────────────── */
  if (success) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, maxWidth: 440, textAlign: "center", padding: "48px 40px" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>
            Đăng ký thành công!
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: "0 0 24px" }}>
            Hồ sơ của bạn đã được gửi đến admin xét duyệt.
            <br />
            Chúng tôi sẽ thông báo qua email <strong>{form.email}</strong> trong 1–2 ngày làm việc.
          </p>
          <button style={styles.btnOutline} onClick={() => setSuccess(false)}>
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  const c = {
    blue: "#1a56db", blueLt: "#e8f0fe",
    border: "#e5e7eb", bg: "#f5f7fa", white: "#fff",
    text: "#111827", muted: "#6b7280",
  };

  /* ── Main form ──────────────────────────────────────────── */
  return (
    <>
      <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, minheight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
        <Navbar_empl />
        <style>{globalCSS}</style>
        <div style={styles.page}>
          <div style={styles.card}>

            {/* ── LEFT PANEL ── */}
            <div style={styles.leftPanel}>
              {/* overlay gradient */}
              <div style={styles.overlay} />

              {/* content */}
              <div style={styles.leftContent}>

                <div style={{ marginTop: "auto" }}>
                  <h2 style={styles.heroTitle}>
                    Xây dựng đội ngũ<br />xuất sắc của bạn.
                  </h2>
                  <p style={styles.heroSub}>
                    Hệ thống quản trị tài năng hiện đại giúp bạn kết nối với
                    những chuyên gia IT hàng đầu một cách nhanh chóng và chính xác.
                  </p>

                  {/* avatars row */}
                  <div style={styles.avatarRow}>
                    {["👤", "👤", "👤"].map((_, i) => (
                      <div key={i} style={{ ...styles.avatar, marginLeft: i === 0 ? 0 : -10 }}>
                        <span style={{ fontSize: 18 }}>👤</span>
                      </div>
                    ))}
                    <span style={styles.avatarLabel}>500+ doanh nghiệp đã tham gia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={styles.rightPanel}>
              <h1 style={styles.formTitle}>Tạo tài khoản Nhà tuyển dụng</h1>
              <p style={styles.formSub}>
                Tham gia cộng đồng VietJob để kết nối với hàng ngàn chuyên gia IT hàng đầu.
              </p>

              {serverError && (
                <div style={styles.errorBanner}>⚠️ {serverError}</div>
              )}

              <form onSubmit={handleSubmit} noValidate style={{ marginTop: 20 }}>

                {/* ── Section: Thông tin đăng nhập ── */}
                <div style={styles.sectionLabel}>Thông tin đăng nhập</div>

                <InputField
                  label="Họ và tên *"
                  icon={<UserIcon />}
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  error={errors.username}
                />

                <InputField
                  label="Email *"
                  icon={<MailIcon />}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="hr@company.com"
                  error={errors.email}
                />

                <div style={styles.row2}>
                  <InputField
                    label="Mật khẩu *"
                    icon={<LockIcon />}
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Tối thiểu 8 ký tự"
                    error={errors.password}
                  />
                  <InputField
                    label="Xác nhận mật khẩu *"
                    icon={<LockIcon />}
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    error={errors.confirmPassword}
                  />
                </div>

                {/* ── Section: Thông tin công ty ── */}
                <div style={{ ...styles.sectionLabel, marginTop: 8 }}>Thông tin công ty</div>

                <InputField
                  label="Tên công ty *"
                  icon={<BuildingIcon />}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Công ty TNHH ABC"
                  error={errors.name}
                />

                <InputField
                  label="Website"
                  icon={<GlobeIcon />}
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                />

                <InputField
                  label="Địa chỉ"
                  icon={<MapPinIcon />}
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Nguyễn Huệ, Q1, TP.HCM"
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={styles.btnPrimary}
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Đăng ký Ngay"}
                </button>
              </form>

              {/* Divider */}
              <div style={styles.divider}>
                <span style={styles.dividerLine} />
                <span style={styles.dividerText}>HOẶC THAM GIA VỚI</span>
                <span style={styles.dividerLine} />
              </div>

              {/* Google */}
              <button className="btn-google" style={styles.btnGoogle}>
                <GoogleIcon />
                &nbsp; Đăng ký bằng Google
              </button>

              {/* Login link */}
              <p style={styles.loginHint}>
                Đã có tài khoản?{" "}
                <a href="/Login_Employer" style={styles.loginLink}>
                  Đăng nhập ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── InputField helper ────────────────────────────────────── */
function InputField({ label, icon, error, ...inputProps }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={styles.inputIcon}>{icon}</span>
        <input
          className="form-input"
          style={{
            ...styles.input,
            borderColor: error ? "#f87171" : undefined,
          }}
          {...inputProps}
        />
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ── SelectField helper ───────────────────────────────────── */
function SelectField({ label, icon, options, error, ...selectProps }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={styles.inputIcon}>{icon}</span>
        <select
          className="form-input"
          style={{
            ...styles.input,
            appearance: "none",
            cursor: "pointer",
          }}
          {...selectProps}
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ── TextareaField helper ─────────────────────────────────── */
function TextareaField({ label, icon, error, rows = 3, ...textareaProps }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={styles.label}>{label}</label>
      <div style={{ position: "relative" }}>
        <span style={{ ...styles.inputIcon, top: 12, transform: "none" }}>{icon}</span>
        <textarea
          className="form-input"
          rows={rows}
          style={{
            ...styles.input,
            resize: "vertical",
            lineHeight: 1.6,
            paddingTop: 10,
          }}
          {...textareaProps}
        />
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}

/* ── Global CSS (hover states etc.) ──────────────────────── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .form-input {
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus {
    outline: none;
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }

  .btn-primary {
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  }
  .btn-primary:hover:not(:disabled) {
    background: #2563eb !important;
    box-shadow: 0 4px 16px rgba(59,130,246,0.4);
    transform: translateY(-1px);
  }
  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }
  .btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .btn-google {
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  }
  .btn-google:hover {
    background: #f1f5f9 !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transform: translateY(-1px);
  }
`;

/* ── Styles ───────────────────────────────────────────────── */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  card: {
    display: "flex",
    width: "100%",
    maxWidth: 1200,
    minHeight: 600,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },

  /* LEFT */
  leftPanel: {
    flex: "0 0 42%",
    position: "relative",
    background: "linear-gradient(160deg, #0f2051 0%, #1e3a8a 40%, #1d4ed8 100%)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80') center/cover no-repeat",
    opacity: 0.18,
  },

  leftContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "36px 32px 40px",
  },

  brand: {
    fontSize: 15,
    fontWeight: 800,
    letterSpacing: "0.15em",
    color: "rgba(255,255,255,0.9)",
    background: "rgba(255,255,255,0.12)",
    borderRadius: 8,
    padding: "6px 14px",
    display: "inline-block",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,255,255,0.2)",
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.25,
    marginBottom: 14,
    letterSpacing: "-0.3px",
  },

  heroSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 1.75,
    marginBottom: 28,
  },

  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: 0,
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
    border: "2px solid rgba(255,255,255,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
  },

  avatarLabel: {
    marginLeft: 12,
    fontSize: 12,
    fontWeight: 500,
    color: "rgba(255,255,255,0.8)",
  },

  /* RIGHT */
  rightPanel: {
    flex: 1,
    background: "#fff",
    padding: "36px 44px 36px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    maxHeight: "100vh",
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: "1px solid #f1f5f9",
  },

  formTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
  },

  formSub: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.6,
  },

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },

  input: {
    width: "100%",
    padding: "10px 12px 10px 38px",
    fontSize: 14,
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "inherit",
  },

  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },

  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 14px",
  },

  errorText: {
    fontSize: 12,
    color: "#ef4444",
    marginTop: 4,
  },

  errorBanner: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 13,
    color: "#b91c1c",
    marginTop: 16,
  },

  btnPrimary: {
    width: "100%",
    padding: "13px 0",
    fontSize: 15,
    fontWeight: 700,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: "0.02em",
    marginTop: 8,
    fontFamily: "inherit",
  },

  divider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "20px 0",
  },

  dividerLine: {
    flex: 1,
    height: 1,
    background: "#e2e8f0",
  },

  dividerText: {
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
  },

  btnGoogle: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "11px 0",
    fontSize: 14,
    fontWeight: 600,
    background: "#fff",
    color: "#374151",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  loginHint: {
    textAlign: "center",
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 16,
  },

  loginLink: {
    color: "#2563eb",
    fontWeight: 600,
    textDecoration: "none",
  },

  btnOutline: {
    padding: "10px 28px",
    fontSize: 14,
    fontWeight: 600,
    background: "transparent",
    color: "#2563eb",
    border: "1.5px solid #2563eb",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};