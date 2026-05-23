import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
        email,
        phone
      });
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container chính - Đồng bộ h-[650px] và shadow-xl */}
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[650px]">

        {/* Cột trái: Hình ảnh & Thương hiệu (Đổi sang bên trái giống Login) */}
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-end">
          {/* Ảnh nền 3D Artist/Tech chuyên nghiệp */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
          ></div>
          {/* Lớp phủ gradient xanh lam đặc trưng */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-700 via-blue-600/60 to-transparent mix-blend-multiply"></div>

          {/* Nội dung chữ trên nền ảnh */}
          <div className="relative z-10 p-10 text-white">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Bắt đầu hành trình <br /> sự nghiệp của bạn.
            </h1>
            <p className="text-blue-100 text-sm max-w-sm">
              Tham gia cộng đồng IT Career VN để tiếp cận hàng ngàn việc làm công nghệ hấp dẫn nhất.
            </p>
          </div>
        </div>

        {/* Cột phải: Form Đăng ký */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Tạo tài khoản mới</h2>
            <p className="text-gray-500 text-xs">Điền thông tin bên dưới để đăng ký thành viên.</p>
          </div>

          <form className="space-y-3.5" onSubmit={handleRegister}>
            {/* Input Họ và tên */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-0.5">Họ và tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                required
              />
            </div>

            {/* Grid Email và Số điện thoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-0.5">Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-0.5">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="080 1234 567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Grid Mật khẩu và Xác nhận */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Nút Submit - Sử dụng loading state */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 py-3 px-4 ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all`}
            >
              {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
            </button>
          </form>

          {/* Đường kẻ chia cắt */}
          <div className="mt-6 relative flex items-center justify-center">
            <div className="w-full h-px bg-gray-200"></div>
            <span className="px-4 text-[10px] font-bold text-gray-400 uppercase bg-white absolute tracking-widest">
              Hoặc tham gia với
            </span>
          </div>

          {/* Nút Google Login (Chỉ giữ lại 1 để cân bằng diện tích) */}
          <div className="mt-6">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Đăng ký bằng Google
            </button>
          </div>

          {/* Link chuyển về Đăng nhập */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Đăng nhập ngay
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;