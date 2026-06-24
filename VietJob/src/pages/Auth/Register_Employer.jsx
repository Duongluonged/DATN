import { useState } from "react";
import { User, Mail, Building, Lock, Globe } from "lucide-react";

const C = {
  blue: "#2563EB",
  blueHover: "#1d4ed8",
  blueSoft: "#EFF6FF",
  border: "#E2E8F0",
  bg: "#F8FAFC",
  text: "#0F172A",
  muted: "#64748B",
  placeholder: "#94A3B8",
  inputBg: "#F1F5F9",
  white: "#ffffff",
  error: "#EF4444",
};

function Input({ label, icon, type = "text", placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{label}</label>
      )}
      <div style={{ position: "relative" }}>
        {/* Leading icon */}
        <span style={{
          position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
          fontSize: 15, color: C.placeholder, pointerEvents: "none",
        }}>
          {icon}
        </span>
        <input
          type={isPassword && !show ? "password" : "text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 12px 10px 36px",
            background: C.inputBg,
            border: `1.5px solid ${error ? C.error : C.border}`,
            borderRadius: 8, fontSize: 13, color: C.text,
            outline: "none", transition: "border 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = C.blue}
          onBlur={e => e.target.style.borderColor = error ? C.error : C.border}
        />
        {isPassword && (
          <span
            onClick={() => setShow(!show)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 15, color: C.placeholder }}
          >
            {show ? "🙈" : "👁"}
          </span>
        )}
      </div>
      {error && <span style={{ fontSize: 11, color: C.error }}>{error}</span>}
    </div>
  );
}

function Divider({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 0" }}>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

export default function EmployerSignup() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", password: "", confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Vui lòng nhập họ và tên";
    if (!form.email.includes("@")) e.email = "Email không hợp lệ";
    if (!form.company.trim()) e.company = "Vui lòng nhập tên công ty";
    if (form.password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";
    if (form.confirm !== form.password) e.confirm = "Mật khẩu không khớp";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#E8EEF6", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "24px 16px",
    }}>
      <div style={{
        display: "flex", width: "100%", maxWidth: 860,
        borderRadius: 18, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
        minHeight: 560,
      }}>

        {/* ── LEFT PANEL ─────────────────────────────────────────── */}
        <div style={{
          flex: "0 0 340px", position: "relative", overflow: "hidden",
          background: "linear-gradient(160deg,#0f2460 0%,#1a3a8f 40%,#0e1e55 100%)",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "32px 28px",
        }}>
          {/* Simulated city image overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 60% 30%, rgba(30,80,180,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          {/* Grid / city silhouette effect */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.08,
            backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)",
          }} />
          {/* Building silhouettes */}
          <svg viewBox="0 0 340 320" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", opacity: 0.18 }} fill="none">
            <rect x="0"   y="160" width="30"  height="160" fill="#fff" />
            <rect x="35"  y="120" width="40"  height="200" fill="#fff" />
            <rect x="80"  y="90"  width="25"  height="230" fill="#fff" />
            <rect x="110" y="140" width="20"  height="180" fill="#fff" />
            <rect x="135" y="70"  width="45"  height="250" fill="#fff" />
            <rect x="185" y="110" width="30"  height="210" fill="#fff" />
            <rect x="220" y="50"  width="50"  height="270" fill="#fff" />
            <rect x="275" y="130" width="35"  height="190" fill="#fff" />
            <rect x="315" y="100" width="25"  height="220" fill="#fff" />
          </svg>

          {/* Logo */}
          <div style={{ position: "absolute", top: 24, left: 28, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            TALENT ARC
          </div>

          {/* Main copy */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
              Xây dựng đội ngũ<br />xuất sắc của bạn.
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, margin: "0 0 24px" }}>
              Hệ thống quản trị tài năng hiện đại giúp bạn kết nối với những chuyên gia IT hàng đầu một cách nhanh chóng và chính xác.
            </p>
            {/* Avatars + count */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex" }}>
                {["#4f8ef7","#f97316","#22c55e"].map((bg, i) => (
                  <div key={i} style={{
                    width: 30, height: 30, borderRadius: "50%", background: bg,
                    border: "2px solid rgba(255,255,255,0.4)",
                    marginLeft: i === 0 ? 0 : -8, fontSize: 11, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                  }}>
                    {["A","B","C"][i]}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>500+ doanh nghiệp đã tham gia</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────── */}
        <div style={{ flex: 1, background: C.white, padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>Đăng ký thành công!</h2>
              <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>Chào mừng <strong>{form.name}</strong> đến với Talent Arc.<br />Hãy kiểm tra email để xác minh tài khoản.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name:"",email:"",company:"",password:"",confirm:"" }); }}
                style={{ marginTop: 24, padding: "10px 24px", background: C.blue, color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Quay lại
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.03em", margin: "0 0 6px" }}>
                  Tạo tài khoản Nhà tuyển dụng
                </h1>
                <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>
                  Tham gia cộng đồng Talent Arc để kết nối với hàng ngàn chuyên gia IT hàng đầu.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Input
                  label="Họ và tên"
                  icon={<User size={15} />}
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={set("name")}
                  error={errors.name}
                />
                <Input
                  label="Email công việc"
                  icon={<Mail size={15} />}
                  placeholder="hr@company.com"
                  value={form.email}
                  onChange={set("email")}
                  error={errors.email}
                />
                <Input
                  label="Tên công ty"
                  icon={<Building size={15} />}
                  placeholder="Tên doanh nghiệp của bạn"
                  value={form.company}
                  onChange={set("company")}
                  error={errors.company}
                />

                {/* Password row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input
                    label="Mật khẩu"
                    icon={<Lock size={15} />}
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set("password")}
                    error={errors.password}
                  />
                  <Input
                    label="Xác nhận"
                    icon={<Lock size={15} />}
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={set("confirm")}
                    error={errors.confirm}
                  />
                </div>

                {/* Terms */}
                <p style={{ fontSize: 11, color: C.muted, margin: "0 0 2px", lineHeight: 1.6 }}>
                  Bằng cách đăng ký, bạn đồng ý với{" "}
                  <span style={{ color: C.blue, cursor: "pointer", fontWeight: 600 }}>Điều khoản dịch vụ</span>{" "}
                  và{" "}
                  <span style={{ color: C.blue, cursor: "pointer", fontWeight: 600 }}>Chính sách bảo mật</span>.
                </p>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "11px 0", background: loading ? "#93C5FD" : C.blue,
                    color: "#fff", border: "none", borderRadius: 8, fontSize: 14,
                    fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s", letterSpacing: "0.01em",
                  }}
                >
                  {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
                </button>

                <Divider text="HOẶC THAM GIA VỚI" />

                {/* Google */}
                <button
                  style={{
                    width: "100%", padding: "10px 0",
                    background: C.white, border: `1.5px solid ${C.border}`,
                    borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    color: C.text, transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = C.white}
                >
                  <Globe className="text-blue-500" size={18} />
                  Đăng ký bằng Google
                </button>

                <p style={{ textAlign: "center", fontSize: 13, color: C.muted, margin: 0 }}>
                  Đã có tài khoản?{" "}
                  <span style={{ color: C.blue, fontWeight: 700, cursor: "pointer" }}>Đăng nhập ngay</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}