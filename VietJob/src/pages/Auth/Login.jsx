import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Container chính */}
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[600px]">
        
        {/* Cột trái: Hình ảnh & Thương hiệu (Ẩn trên mobile) */}
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-end">
          {/* Ảnh nền - Bạn thay link ảnh thực tế vào đây */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}
          ></div>
          {/* Lớp phủ gradient xanh lam */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-700 via-blue-600/60 to-transparent mix-blend-multiply"></div>
          
          {/* Nội dung chữ trên nền ảnh */}
          <div className="relative z-10 p-10 text-white">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-green-700 uppercase bg-green-200 rounded-full">
              The Digital Curator
            </span>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
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
            <p className="text-gray-500 text-sm">Đăng nhập để tiếp tục hành trình sự nghiệp của bạn.</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Input Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input 
                type="email" 
                placeholder="name@company.com" 
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
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Đăng Nhập
            </button>
          </form>

          {/* Đường kẻ chia cắt */}
          <div className="mt-8 flex items-center justify-center">
            <div className="w-full h-px bg-gray-200"></div>
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase bg-white absolute">
              Hoặc đăng nhập với
            </span>
          </div>

          {/* Các nút Social Login */}
          <div className="mt-6 flex gap-4">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>

          {/* Link Đăng ký */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Chưa có tài khoản?{' '}
            <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
              Tạo tài khoản ngay
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;