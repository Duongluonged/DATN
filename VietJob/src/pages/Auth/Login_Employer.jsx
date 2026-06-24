import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, Mail, Lock, Check, LogIn, Globe, Building2, Users, Zap, AlertTriangle } from "lucide-react";


const C = {
  primary: "#1E3A8A",
  primaryHover: "#1e40af",
  accent: "#3B82F6",
  accentSoft: "#EFF6FF",
  border: "#DBEAFE",
  bg: "#F0F4FF",
  text: "#0F172A",
  muted: "#64748B",
  white: "#ffffff",
  error: "#EF4444",
  inputBg: "#F8FAFF",
  success: "#10B981",
};

function EyeIcon({ open }) {
  return open ? <Eye size={16} /> : <EyeOff size={16} />;
}

function InputField({ label, type = "text", placeholder, value, onChange, error, icon }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: "0.01em" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <span style={{
          position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)",
          color: focused ? C.accent : C.muted, transition: "color 0.2s", pointerEvents: "none",
        }}>
          {icon}
        </span>
        <input
          type={isPassword && !show ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: isPassword ? "12px 42px 12px 40px" : "12px 14px 12px 40px",
            background: focused ? C.white : C.inputBg,
            border: `1.5px solid ${error ? C.error : focused ? C.accent : "#CBD5E1"}`,
            borderRadius: 10, fontSize: 14, color: C.text, outline: "none",
            transition: "all 0.2s",
            boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", color: C.muted,
              display: "flex", alignItems: "center", padding: 0,
            }}
          >
            <EyeIcon open={show} />
          </button>
        )}
      </div>
      {error && <span style={{ fontSize: 12, color: C.error, display: "flex", alignItems: "center", gap: 4 }}>⚠ {error}</span>}
    </div>
  );
}

function ForgotModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
      backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: C.white, borderRadius: 16, padding: "36px 32px", width: 400,
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "#F1F5F9",
          border: "none", borderRadius: 8, width: 32, height: 32,
          fontSize: 16, cursor: "pointer", color: C.muted,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>
        {sent ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📬</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 10px", color: C.text }}>Đã gửi email!</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
              Hướng dẫn đặt lại mật khẩu đã được gửi tới <strong>{email}</strong>.
            </p>
            <button onClick={onClose} style={{
              marginTop: 24, padding: "11px 32px", background: C.primary, color: "#fff",
              border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Đóng</button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px", color: C.text }}>Quên mật khẩu?</h3>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 24px", lineHeight: 1.7 }}>
              Nhập email đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu.
            </p>
            <InputField
              label="Email công ty"
              icon={<Mail size={16} />}
              placeholder="hr@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              onClick={() => email.includes("@") && setSent(true)}
              style={{
                marginTop: 18, width: "100%", padding: "12px 0",
                background: C.primary, color: "#fff", border: "none",
                borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              Gửi hướng dẫn
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function EmployerLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Email không hợp lệ";
    if (form.password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";
    return e;
  };

  const handleLogin = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      const { token, username, roles, id } = res.data;

      // Chỉ cho phép Employer đăng nhập tại trang này
      if (!roles.includes("Employer")) {
        setErrors({ api: "Tài khoản này không phải nhà tuyển dụng. Vui lòng dùng trang đăng nhập dành cho ứng viên." });
        return;
      }

      localStorage.setItem("user", JSON.stringify({ token, username, roles, id }));
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      setLoginSuccess(true);
      setTimeout(() => navigate("/employer/Quan_ly_tin_tuyen_dung"), 1400);
    } catch (err) {
      const msg = err.response?.data?.error || "Đăng nhập thất bại. Vui lòng thử lại.";
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#f8fafc",
      fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif", padding: "24px 16px",
    }}>


      {/* Card */}
      <div style={{
        display: "flex", width: "100%", maxWidth: 900,
        borderRadius: 24, overflow: "hidden",
        boxShadow: "0 8px 40px rgba(30,58,138,0.12)",
        border: "1px solid #E2E8F0",
        minHeight: 560,
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          flex: "0 0 340px", position: "relative", overflow: "hidden",
          background: "linear-gradient(160deg, #1E3A8A 0%, #1e40af 100%)",
          display: "flex", flexDirection: "column",
          padding: "40px 32px",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "auto" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #3B82F6, #6366F1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900, color: "#fff",
              boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
            }}>V</div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              VietJob
            </span>
          </div>

          {/* Center content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(59,130,246,0.2)", border: "1px solid rgba(59,130,246,0.3)",
                borderRadius: 99, padding: "5px 14px", marginBottom: 16,
              }}>
                <Building2 size={12} className="text-blue-200" />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: "0.05em" }}>
                  CỔNG NHÀ TUYỂN DỤNG
                </span>
              </div>
              <h2 style={{
                fontSize: 30, fontWeight: 800, color: "#fff",
                lineHeight: 1.25, letterSpacing: "-0.03em", margin: "0 0 14px",
              }}>
                Tìm kiếm<br />nhân tài<br />
                <span style={{ color: "#93C5FD" }}>xuất sắc.</span>
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                Đăng nhập để quản lý tin tuyển dụng và kết nối với ứng viên tiềm năng.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <Building2 size={24} className="text-blue-300" />, label: "500+", desc: "Doanh nghiệp tin dùng" },
                { icon: <Users size={24} className="text-blue-300" />, label: "12,000+", desc: "Ứng viên chất lượng" },
                { icon: <Zap size={24} className="text-blue-300" />, label: "3x", desc: "Tuyển dụng nhanh hơn" },
              ].map((s, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, padding: "12px 14px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom link */}
          <div style={{ marginTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
              Bạn là ứng viên?{" "}
              <Link to="/login" style={{ color: "#93C5FD", fontWeight: 600, textDecoration: "none" }}>
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          flex: 1, background: C.white,
          padding: "48px 44px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {loginSuccess ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #10B981, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
              }}>
                <Check size={32} color="#fff" strokeWidth={2.5} />
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px", color: C.text }}>
                Đăng nhập thành công!
              </h2>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                Chào mừng trở lại, <strong>{form.email}</strong>.<br />
                Đang chuyển đến Dashboard...
              </p>
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `3px solid ${C.primary}`, borderTopColor: "transparent",
                  animation: "spin 0.8s linear infinite",
                }} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{
                  fontSize: 26, fontWeight: 800, color: C.text,
                  letterSpacing: "-0.03em", margin: "0 0 8px",
                }}>
                  Đăng nhập tài khoản
                </h1>
                <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  Dành riêng cho <strong style={{ color: C.primary }}>Nhà tuyển dụng</strong>. Vui lòng nhập thông tin để tiếp tục.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Email */}
                <InputField
                  label="Email công ty"
                  icon={<Mail size={16} />}
                  placeholder="hr@company.com"
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                />

                {/* Password */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Mật khẩu</label>
                    <span
                      onClick={() => setShowForgot(true)}
                      style={{ fontSize: 13, color: C.accent, fontWeight: 600, cursor: "pointer" }}
                    >
                      Quên mật khẩu?
                    </span>
                  </div>
                  <InputField
                    icon={<Lock size={16} />}
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={form.password}
                    onChange={set("password")}
                    error={errors.password}
                  />
                </div>

                {/* Remember */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    onClick={() => setRemember(!remember)}
                    style={{
                      width: 20, height: 20, borderRadius: 6, cursor: "pointer",
                      border: `2px solid ${remember ? C.primary : "#CBD5E1"}`,
                      background: remember ? C.primary : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s", flexShrink: 0,
                    }}
                  >
                    {remember && (
                      <Check size={11} color="#fff" strokeWidth={2.5} />
                    )}
                  </div>
                  <span
                    style={{ fontSize: 13, color: C.muted, cursor: "pointer" }}
                    onClick={() => setRemember(!remember)}
                  >
                    Ghi nhớ đăng nhập trong 30 ngày
                  </span>
                </div>

                {/* API Error */}
                {errors.api && (
                  <div style={{
                    background: "#FEF2F2", border: "1px solid #FECACA",
                    borderRadius: 10, padding: "12px 16px",
                    fontSize: 13, color: "#B91C1C", lineHeight: 1.5,
                  }}>
                    <span style={{display: 'flex', alignItems: 'center', gap: 4}}><AlertTriangle size={14}/> {errors.api}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "14px 0",
                    background: loading
                      ? "#93C5FD"
                      : `linear-gradient(135deg, ${C.primary}, ${C.accent})`,
                    color: "#fff", border: "none", borderRadius: 12,
                    fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: loading ? "none" : "0 6px 20px rgba(30,58,138,0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: 16, height: 16,
                        border: "2px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#fff", borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      Đang xác thực...
                    </>
                  ) : (
                    <>
                      <LogIn size={16} strokeWidth={2.5} />
                      Đăng Nhập
                    </>
                  )}
                </button>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, whiteSpace: "nowrap" }}>
                    HOẶC TIẾP TỤC VỚI
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
                </div>

                {/* Google */}
                <button
                  style={{
                    width: "100%", padding: "12px 0",
                    background: C.white, border: "1.5px solid #E2E8F0",
                    borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    color: C.text, transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFF"; e.currentTarget.style.borderColor = "#93C5FD"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  <Globe className="text-blue-500" size={18} />
                  Đăng nhập bằng Google
                </button>

                {/* Register link */}
                <p style={{ textAlign: "center", fontSize: 13, color: C.muted, margin: 0 }}>
                  Chưa có tài khoản nhà tuyển dụng?{" "}
                  <Link
                    to="/EmployerRegisterForm"
                    style={{ color: C.primary, fontWeight: 700, textDecoration: "none" }}
                  >
                    Đăng ký ngay →
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}