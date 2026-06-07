import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  Send
} from "lucide-react";

const Facebook = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Linkedin = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Pinterest = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2a10 10 0 0 0-3.5 19.4c0-.9.2-2.3.4-3.3l1.2-5.1s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5 1 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.8a1.6 1.6 0 0 0 1.7 2c2 0 3.6-2.1 3.6-5.2 0-2.7-2-4.6-4.7-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 1 2.7.1.1.1.2.1.3l-.4 1.5c0 .1-.1.2-.3.1-1-.5-1.6-2-1.6-3.2 0-3.5 2.5-6.7 7.3-6.7 3.8 0 6.8 2.7 6.8 6.4 0 3.8-2.4 6.9-5.7 6.9-1.1 0-2.2-.6-2.5-1.2l-.7 2.6c-.3 1-1 2.2-1.5 3a10 10 0 1 0 8.4-.2z" />
  </svg>
);

function Footer() {
  return (
    <footer className="bg-white text-[#146497] mt-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Đường kẻ ngang trên cùng */}
        <div className="border-t-[3px] border-[#146497] mb-10"></div>

        {/* Bố cục 4 cột (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-sm">
          
          {/* Cột 1: Về VietJobs */}
          <div>
            <h3 className="font-semibold text-base mb-4">Về VietJobs</h3>
            <ul className="flex flex-col gap-3 text-gray-600 font-medium">
              <li><Link to="/" className="text-[#146497] transition-colors">Trang chủ</Link></li>
              <li><Link to="/about" className="text-[#146497] transition-colors">Về VietJOBS.com</Link></li>
              <li><Link to="/services" className="text-[#146497] transition-colors">Dịch vụ gợi ý ứng viên</Link></li>
              <li><Link to="/contact" className="text-[#146497] transition-colors">Liên hệ</Link></li>
              <li><Link to="/jobs" className="text-[#146497] transition-colors">Việc Làm IT</Link></li>
              <li><Link to="/faq" className="text-[#146497] transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Cột 2: Chương trình */}
          <div>
            <h3 className="font-semibold text-base mb-4">Chương trình</h3>
            <ul className="flex flex-col gap-3 text-gray-600 font-medium">
              <li><Link to="/story" className="text-[#146497] transition-colors">Chuyện IT</Link></li>
              <li><Link to="/contest" className="text-[#146497] transition-colors">Cuộc thi viết</Link></li>
              <li><Link to="/hot-jobs" className="text-[#146497] transition-colors">Việc làm IT nổi bật</Link></li>
              <li><Link to="/survey" className="text-[#146497] transition-colors">Khảo sát thường niên</Link></li>
            </ul>
          </div>

          {/* Cột 3: Điều khoản chung */}
          <div>
            <h3 className="font-semibold text-base mb-4">Điều khoản chung</h3>
            <ul className="flex flex-col gap-3 text-gray-600 font-medium">
              <li><Link to="/privacy" className="text-[#146497] transition-colors">Quy định bảo mật</Link></li>
              <li><Link to="/rules" className="text-[#146497] transition-colors">Quy chế hoạt động</Link></li>
              <li><Link to="/complaints" className="text-[#146497] transition-colors">Giải quyết khiếu nại</Link></li>
              <li><Link to="/terms" className="text-[#146497] transition-colors">Thỏa thuận sử dụng</Link></li>
              <li><Link to="/press" className="text-[#146497] transition-colors">Thông cáo báo chí</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="font-semibold text-base mb-4">Liên hệ để đăng tin tuyển dụng tại:</h3>
            <ul className="flex flex-col gap-4 text-gray-600 font-medium">
              <li className="flex items-center gap-3">
                <Phone className="text-[#146497] w-5 h-5" />
                <span className="text-[#146497]">Hồ Chí Minh: (+84) 977 460 519</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#146497] w-5 h-5" />
                <span className="text-[#146497]">Hà Nội: (+84) 983 131 315</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#146497] w-5 h-5" />
                <span className="text-[#146497]">Email: love@vietjobs.com</span>
              </li>
              <li className="flex items-center gap-3 mt-2 cursor-pointer text-[#146497] transition-colors">
                <Send className="text-[#146497] w-5 h-5" />
                <span className="text-[#146497]">Gửi thông tin liên hệ</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Đường kẻ ngang phía dưới */}
        <div className="border-t-[3px] border-[#146497] mb-6"></div>

        {/* Phần Bottom: Logo, Slogan và Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-8">
          
          {/* Trái: Logo & Slogan */}
          <div className="flex items-baseline gap-2 mb-4 md:mb-0">
            <span className="text-2xl font-bold">VietJobs</span>
            <span className="text-sm font-medium text-[#146497]">Ít nhưng mà chất</span>
          </div>

          {/* Phải: Social Icons & Ngôn ngữ */}
          <div className="flex items-center gap-6 text-[#146497] text-lg">
            <a href="#" className="opacity-70 transition-opacity"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="opacity-70 transition-opacity"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="opacity-70 transition-opacity"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="opacity-70 transition-opacity"><Pinterest className="w-5 h-5" /></a>
            
            {/* Bộ chuyển đổi ngôn ngữ */}
            <div className="flex items-center gap-1 text-sm font-bold ml-4 border-l-2 border-gray-300 pl-4">
              <button className="opacity-70">EN</button>
              <span>|</span>
              <button className="opacity-70">VI</button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;