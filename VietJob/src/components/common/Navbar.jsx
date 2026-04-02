import { Link } from "react-router-dom";


const Navbar = () => {
  return (
    <header className="w-full bg-white border-b-4 border-blue-500 shadow-sm sticky top-0 z-50">
      
      {/* Container chính: Vẫn dùng justify-between để chia 2 phe (Trái - Phải) */}
      <div className="w-full px-4 py-4 flex justify-between items-center">
        
        {/* ========================================== */}
        {/* NHÓM BÊN TRÁI: Gồm Logo và các Menu chính   */}
        {/* ========================================== */}
        {/* Dùng gap-12 để tạo khoảng cách giữa Logo và Menu. Bạn có thể tăng/giảm số 12 này */}
        <div className="flex items-center gap-12">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-black tracking-wide">
            VietJobs
          </Link>

          {/* Cụm Menu (Đã tách nút Đăng nhập ra khỏi đây) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            
            {/* Menu Item 1: Top Công Ty IT */}
            <div className="group relative cursor-pointer py-2">
              <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <span>Top Công Ty IT</span>
                <svg className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2">
                <Link to="/companies/product" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Công ty Product</Link>
                <Link to="/companies/outsource" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors">Công ty Outsource</Link>
              </div>
            </div>

            {/* Menu Item 2: Khoá học */}
            <div className="group relative cursor-pointer py-2">
              <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <span>Khoá học</span>
                <svg className="w-2.5 h-2.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2">
              </div>
            </div>

          </nav>
        </div>


        {/* ========================================== */}
        {/* NHÓM BÊN PHẢI: Chỉ chứa nút Đăng nhập       */}
        {/* ========================================== */}
        <div className="hidden md:flex items-center gap-4">
  
            {/* Nút Đăng Nhập (Trắng, viền xanh) */}
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              Đăng Nhập
            </Link>

            {/* Nút Đăng Ký (Xanh nổi bật) */}
            <Link 
              to="/register" 
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              Đăng Ký
            </Link>
  
        </div>

      </div>
    </header>
  );
};

export default Navbar;