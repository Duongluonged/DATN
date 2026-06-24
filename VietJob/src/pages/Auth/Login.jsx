import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../../components/common/Navbar";
import { useGoogleLogin, useLinkedInLogin } from '../../hooks/useSocialLogin';
import { AlertCircle, Loader2, Globe, Briefcase } from 'lucide-react';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'linkedin' | null
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin   = useGoogleLogin();
  const handleLinkedInLogin = useLinkedInLogin();

  const c = {
    blue: "#1a56db", blueLt: "#e8f0fe",
    border: "#e5e7eb", bg: "#f5f7fa",
    white: "#fff", text: "#111827", muted: "#6b7280",
  };

  // ── ĐĂNG NHẬP THƯỜNG ────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, username, roles, id } = res.data;

      const userData = { token, username, roles, id };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      if (roles.includes("Employer")) {
        localStorage.removeItem("user");
        setError("Tài khoản nhà tuyển dụng vui lòng đăng nhập tại trang dành riêng.");
        return;
      } else if (roles.includes("Admin")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  // ── ĐĂNG NHẬP GOOGLE ────────────────────────────────────────
  const onGoogleClick = () => {
    setError("");
    handleGoogleLogin(); // Redirect sang Google OAuth
  };

  // ── ĐĂNG NHẬP LINKEDIN ───────────────────────────────────────
  const onLinkedInClick = () => {
    setError("");
    handleLinkedInLogin(); // Redirect sang LinkedIn OAuth
  };

  return (
    <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", background: c.bg, color: c.text, minheight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 13 }}>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {/* Container chính */}
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[600px] -translate-y-12">

          {/* Cột trái: Hình ảnh & Thương hiệu */}
          <div className="hidden md:flex md:w-1/2 relative flex-col justify-end">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-700 via-blue-600/60 to-transparent mix-blend-multiply"></div>

            <div className="relative z-10 p-10 text-white">
              <h1 className="text-4xl font-bold mb-4 leading-tight text-white">
                Kiến tạo tương lai <br /> của bạn tại đây.
              </h1>
              <p className="text-blue-100 text-sm max-w-sm">
                Khám phá những cơ hội nghề nghiệp hàng đầu trong ngành công nghệ tại Việt Nam.
              </p>
            </div>
          </div>

          {/* Cột phải: Form Đăng nhập */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng trở lại</h2>
              <p className="text-gray-500 text-sm">Dành cho <strong>Ứng viên</strong> và <strong>Quản trị viên</strong>. Nhà tuyển dụng vui lòng dùng trang đăng nhập riêng.</p>
            </div>

            {/* Thông báo lỗi */}
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Gắn hàm handleLogin vào form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Input Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Input Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mật khẩu
                  </label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
                    Quên mật khẩu?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>

              {/* Checkbox Duy trì đăng nhập */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Duy trì đăng nhập
                </label>
              </div>

              {/* Nút Submit */}
              <button
                type="submit"
                disabled={loading || socialLoading !== null}
                className={`w-full py-3 px-4 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
              >
                {loading ? "Đang xác thực..." : "Đăng Nhập"}
              </button>
            </form>

            {/* Đường kẻ chia cắt */}
            <div className="mt-6 flex items-center justify-center">
              <div className="w-full h-px bg-gray-200"></div>
              <span className="px-4 text-xs font-semibold text-gray-400 uppercase bg-white absolute">
                Hoặc đăng nhập với
              </span>
            </div>

            {/* Các nút Social Login */}
            <div className="mt-6 flex gap-4">
              {/* Nút Google */}
              <button
                id="btn-google-login"
                type="button"
                onClick={onGoogleClick}
                disabled={socialLoading !== null || loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                ) : (
                <Globe className="w-5 h-5 text-blue-500" />
                )}
                {socialLoading === 'google' ? 'Đang xử lý...' : 'Google'}
              </button>

              {/* Nút LinkedIn */}
              <button
                id="btn-linkedin-login"
                type="button"
                onClick={onLinkedInClick}
                disabled={socialLoading !== null || loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Briefcase className="w-5 h-5 text-[#0A66C2]" />
                LinkedIn
              </button>
            </div>

            {/* Link Đăng ký */}
            <p className="mt-8 text-center text-sm text-gray-600">
              Chưa có tài khoản ứng viên?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500">
                Đăng ký ngay
              </Link>
            </p>
            <p className="mt-2 text-center text-xs text-gray-400">
              Là nhà tuyển dụng?{' '}
              <Link to="/login-employer" className="font-semibold text-blue-500 hover:text-blue-400">
                Đăng nhập tại đây
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;