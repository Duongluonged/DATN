import { Link } from "react-router-dom";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaPaperPlane, 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaPinterestP 
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-white text-[#2a2a4a] mt-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Đường kẻ ngang trên cùng */}
        <div className="border-t-[3px] border-[#2a2a4a] mb-10"></div>

        {/* Bố cục 4 cột (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 text-sm">
          
          {/* Cột 1: Về VietJobs */}
          <div>
            <h3 className="font-semibold text-base mb-4">Về VietJobs</h3>
            <ul className="flex flex-col gap-3 text-gray-600 font-medium">
              <li><Link to="/" className="hover:text-[#2a2a4a] transition-colors">Trang chủ</Link></li>
              <li><Link to="/about" className="hover:text-[#2a2a4a] transition-colors">Về VietJOBS.com</Link></li>
              <li><Link to="/services" className="hover:text-[#2a2a4a] transition-colors">Dịch vụ gợi ý ứng viên</Link></li>
              <li><Link to="/contact" className="hover:text-[#2a2a4a] transition-colors">Liên hệ</Link></li>
              <li><Link to="/jobs" className="hover:text-[#2a2a4a] transition-colors">Việc Làm IT</Link></li>
              <li><Link to="/faq" className="hover:text-[#2a2a4a] transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Cột 2: Chương trình */}
          <div>
            <h3 className="font-semibold text-base mb-4">Chương trình</h3>
            <ul className="flex flex-col gap-3 text-gray-600 font-medium">
              <li><Link to="/story" className="hover:text-[#2a2a4a] transition-colors">Chuyện IT</Link></li>
              <li><Link to="/contest" className="hover:text-[#2a2a4a] transition-colors">Cuộc thi viết</Link></li>
              <li><Link to="/hot-jobs" className="hover:text-[#2a2a4a] transition-colors">Việc làm IT nổi bật</Link></li>
              <li><Link to="/survey" className="hover:text-[#2a2a4a] transition-colors">Khảo sát thường niên</Link></li>
            </ul>
          </div>

          {/* Cột 3: Điều khoản chung */}
          <div>
            <h3 className="font-semibold text-base mb-4">Điều khoản chung</h3>
            <ul className="flex flex-col gap-3 text-gray-600 font-medium">
              <li><Link to="/privacy" className="hover:text-[#2a2a4a] transition-colors">Quy định bảo mật</Link></li>
              <li><Link to="/rules" className="hover:text-[#2a2a4a] transition-colors">Quy chế hoạt động</Link></li>
              <li><Link to="/complaints" className="hover:text-[#2a2a4a] transition-colors">Giải quyết khiếu nại</Link></li>
              <li><Link to="/terms" className="hover:text-[#2a2a4a] transition-colors">Thỏa thuận sử dụng</Link></li>
              <li><Link to="/press" className="hover:text-[#2a2a4a] transition-colors">Thông cáo báo chí</Link></li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="font-semibold text-base mb-4">Liên hệ để đăng tin tuyển dụng tại:</h3>
            <ul className="flex flex-col gap-4 text-gray-600 font-medium">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#2a2a4a] text-lg" />
                <span>Hồ Chí Minh: (+84) 977 460 519</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-[#2a2a4a] text-lg" />
                <span>Hà Nội: (+84) 983 131 315</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-[#2a2a4a] text-lg" />
                <span>Email: love@vietjobs.com</span>
              </li>
              <li className="flex items-center gap-3 mt-2 cursor-pointer hover:text-[#2a2a4a] transition-colors">
                <FaPaperPlane className="text-[#2a2a4a] text-lg" />
                <span>Gửi thông tin liên hệ</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Đường kẻ ngang phía dưới */}
        <div className="border-t-[3px] border-[#2a2a4a] mb-6"></div>

        {/* Phần Bottom: Logo, Slogan và Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center pb-8">
          
          {/* Trái: Logo & Slogan */}
          <div className="flex items-baseline gap-2 mb-4 md:mb-0">
            <span className="text-2xl font-bold">VietJobs</span>
            <span className="text-sm font-medium text-gray-600">Ít nhưng mà chất</span>
          </div>

          {/* Phải: Social Icons & Ngôn ngữ */}
          <div className="flex items-center gap-6 text-[#2a2a4a] text-lg">
            <a href="#" className="hover:opacity-70 transition-opacity"><FaFacebookF /></a>
            <a href="#" className="hover:opacity-70 transition-opacity"><FaInstagram /></a>
            <a href="#" className="hover:opacity-70 transition-opacity"><FaLinkedinIn /></a>
            <a href="#" className="hover:opacity-70 transition-opacity"><FaPinterestP /></a>
            
            {/* Bộ chuyển đổi ngôn ngữ */}
            <div className="flex items-center gap-1 text-sm font-bold ml-4 border-l-2 border-gray-300 pl-4">
              <button className="hover:opacity-70">EN</button>
              <span>|</span>
              <button className="hover:opacity-70">VI</button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;