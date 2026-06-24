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

import { User, Mail, Building, Lock, Phone, Globe, MapPin, Users, Tag, FileText, AlertTriangle } from "lucide-react";

/* ─── icons (inline SVG) ─────────────────────────────────── */
const iconProps = { size: 16, color: "#94a3b8" };
const UserIcon = () => <User {...iconProps} />;
const MailIcon = () => <Mail {...iconProps} />;
const BuildingIcon = () => <Building {...iconProps} />;
const LockIcon = () => <Lock {...iconProps} />;
const PhoneIcon = () => <Phone {...iconProps} />;
const GlobeIcon = () => <Globe {...iconProps} />;
const MapPinIcon = () => <MapPin {...iconProps} />;
const UsersIcon = () => <Users {...iconProps} />;
const TagIcon = () => <Tag {...iconProps} />;
const FileTextIcon = () => <FileText {...iconProps} />;
const GoogleIcon = () => <Globe size={18} color="#4285F4" />;

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
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: c.border, border: `2px solid ${c.white}`, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: i > 0 ? -12 : 0, zIndex: 3 - i }}>
                        <UsersIcon size={18} color={c.blue} />
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
                <div style={styles.errorBanner}><span style={{display: 'flex', alignItems: 'center', gap: 4}}><AlertTriangle size={14}/> {serverError}</span></div>
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