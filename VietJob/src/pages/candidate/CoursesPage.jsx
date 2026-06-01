import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { 
  BookOpen, Code, Cpu, Smartphone, Palette, Sparkles, 
  Star, Clock, BookOpenCheck, User, Search, Award, Filter, ArrowRight,
  CreditCard, AlertCircle, X, Mail, CheckCircle2, Loader2
} from 'lucide-react';

const mockCourses = [
  // Lập trình Web
  {
    id: 'web-1',
    title: 'Lập trình Web Fullstack với React & Node.js',
    desc: 'Chương trình đào tạo chuyên sâu từ Zero đến Hero. Nắm vững HTML5, CSS3, ES6+, React, Node.js, Express và MongoDB.',
    category: 'web',
    rating: 4.9,
    reviews: 145,
    duration: '64 giờ',
    lectures: 96,
    level: 'Mọi trình độ',
    price: 2490000,
    oldPrice: 4990000,
    instructor: 'Nguyễn Văn Minh',
    instRole: 'Tech Lead tại FPT Software',
    bgGradient: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'web-2',
    title: 'Phát triển ứng dụng Web hiện đại với Next.js & Tailwind CSS',
    desc: 'Tối ưu SEO, Server-side Rendering, Static Site Generation và xây dựng UI/UX cực kỳ đẹp mắt với Tailwind CSS.',
    category: 'web',
    rating: 4.8,
    reviews: 86,
    duration: '32 giờ',
    lectures: 48,
    level: 'Trung cấp',
    price: 1890000,
    oldPrice: 3200000,
    instructor: 'Trần Hoàng Long',
    instRole: 'Senior Frontend Developer',
    bgGradient: 'from-sky-600 to-indigo-500'
  },
  
  // Lập trình Mobile
  {
    id: 'mobile-1',
    title: 'Lập trình Flutter đa nền tảng cho iOS & Android',
    desc: 'Xây dựng ứng dụng di động mượt mà bằng Dart & Flutter. Quản lý trạng thái nâng cao với Bloc và Provider.',
    category: 'mobile',
    rating: 4.9,
    reviews: 112,
    duration: '48 giờ',
    lectures: 74,
    level: 'Mọi trình độ',
    price: 2200000,
    oldPrice: 4200000,
    instructor: 'Phạm Minh Đức',
    instRole: 'Mobile Architect',
    bgGradient: 'from-violet-600 to-purple-500'
  },
  {
    id: 'mobile-2',
    title: 'Lập trình React Native - Xây dựng ứng dụng thực tế',
    desc: 'Tận dụng kỹ năng JavaScript/React để tạo các ứng dụng mobile native. Tích hợp bản đồ, camera và đẩy thông báo.',
    category: 'mobile',
    rating: 4.7,
    reviews: 64,
    duration: '40 giờ',
    lectures: 60,
    level: 'Trung cấp',
    price: 1990000,
    oldPrice: 3500000,
    instructor: 'Lê Hồng Sơn',
    instRole: 'Senior React Native Developer',
    bgGradient: 'from-indigo-600 to-purple-500'
  },

  // Dữ liệu & AI
  {
    id: 'data-ai-1',
    title: 'Khoa học dữ liệu (Data Science) với Python thực chiến',
    desc: 'Phân tích dữ liệu, trực quan hoá dữ liệu với Pandas, NumPy, Seaborn. Học thống kê ứng dụng và kỹ thuật Feature Engineering.',
    category: 'data-ai',
    rating: 4.9,
    reviews: 210,
    duration: '60 giờ',
    lectures: 88,
    level: 'Mọi trình độ',
    price: 2990000,
    oldPrice: 5990000,
    instructor: 'Dr. Vũ Đăng Khoa',
    instRole: 'AI Research Director',
    bgGradient: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'data-ai-2',
    title: 'Kỹ sư Trí tuệ nhân tạo (AI) & Machine Learning ứng dụng',
    desc: 'Xây dựng mô hình học máy và học sâu với TensorFlow, Keras. Tích hợp AI vào ứng dụng web/mobile thực tế.',
    category: 'data-ai',
    rating: 4.8,
    reviews: 95,
    duration: '54 giờ',
    lectures: 80,
    level: 'Nâng cao',
    price: 3490000,
    oldPrice: 6500000,
    instructor: 'Hoàng Anh Tuấn',
    instRole: 'Senior Machine Learning Engineer',
    bgGradient: 'from-teal-600 to-cyan-500'
  },

  // Thiết kế & Gamedev
  {
    id: 'design-gamedev-1',
    title: 'Thiết kế UI/UX Chuyên nghiệp với Figma',
    desc: 'Học tư duy thiết kế, trải nghiệm người dùng, thiết kế responsive, tạo prototype tương tác và thiết kế Design System.',
    category: 'design-gamedev',
    rating: 4.9,
    reviews: 180,
    duration: '36 giờ',
    lectures: 52,
    level: 'Mọi trình độ',
    price: 1590000,
    oldPrice: 3000000,
    instructor: 'Mai Phương Thảo',
    instRole: 'Product Design Lead tại VinGroup',
    bgGradient: 'from-rose-600 to-pink-500'
  },
  {
    id: 'design-gamedev-2',
    title: 'Lập trình Game 3D với Unity & C#',
    desc: 'Tự làm game 3D từ con số 0. Nắm vững vật lý Unity, hoạt hoạ, AI cho quái vật và xuất bản game lên Steam/Mobile.',
    category: 'design-gamedev',
    rating: 4.8,
    reviews: 73,
    duration: '50 giờ',
    lectures: 78,
    level: 'Mọi trình độ',
    price: 2150000,
    oldPrice: 4000000,
    instructor: 'Đỗ Tiến Đạt',
    instRole: 'Indie Game Developer & Consultant',
    bgGradient: 'from-orange-600 to-rose-500'
  }
];

const categoriesMap = {
  'all': { label: 'Tất cả khoá học', icon: <BookOpen className="w-4 h-4" /> },
  'web': { label: 'Lập trình Web', icon: <Code className="w-4 h-4" /> },
  'mobile': { label: 'Lập trình Mobile', icon: <Smartphone className="w-4 h-4" /> },
  'data-ai': { label: 'Dữ liệu & AI', icon: <Cpu className="w-4 h-4" /> },
  'design-gamedev': { label: 'Thiết kế & Gamedev', icon: <Palette className="w-4 h-4" /> }
};

export default function CoursesPage() {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // States for user learning paths & checkout
  const [user, setUser] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedCourseForCheckout, setSelectedCourseForCheckout] = useState(null);
  const [candidateBalance, setCandidateBalance] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // Dynamic VietQR & Webhook mock states
  const [currentTxnId, setCurrentTxnId] = useState('');
  const [copiedField, setCopiedField] = useState(null); // 'stk' | 'noidung' | null
  const [paymentStep, setPaymentStep] = useState('checkout'); // 'checkout' | 'verifying' | 'success'
  const [countdown, setCountdown] = useState(5);

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3500);
  };

  const checkAuth = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      return parsed;
    }
    return null;
  };

  const fetchUserCourses = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user-courses/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUserCourses(data);
      }
    } catch (err) {
      console.error("Lỗi lấy lộ trình học tập của người dùng:", err);
    }
  };

  // Sync URL parameter to active tab state
  useEffect(() => {
    if (urlCategory && categoriesMap[urlCategory]) {
      setActiveTab(urlCategory);
    } else {
      setActiveTab('all');
    }
  }, [urlCategory]);

  // Fetch courses and check user authentication
  useEffect(() => {
    const parsedUser = checkAuth();
    if (parsedUser && parsedUser.id) {
      fetchUserCourses(parsedUser.id);
    }

    const fetchDBCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/courses');
        if (res.ok) {
          const dbData = await res.json();
          const activeDBCourses = dbData.filter(c => c.status === 'Đang bán' || c.status === 'Đang mở' || c.status === 'Đang hoạt động' || !c.status);
          
          const mappedDBCourses = activeDBCourses.map((c, index) => {
            const title = c.name || c.TieuDe || '';
            const desc = c.MoTa || c.moTa || 'Chương trình đào tạo công nghệ chất lượng cao, trang bị kiến thức thực tế giúp bạn nhanh chóng gia nhập thị trường việc làm.';
            
            let cat = 'web';
            const titleLower = title.toLowerCase();
            if (titleLower.includes('mobile') || titleLower.includes('flutter') || titleLower.includes('react native') || titleLower.includes('android') || titleLower.includes('ios')) {
              cat = 'mobile';
            } else if (titleLower.includes('data') || titleLower.includes('ai') || titleLower.includes('python') || titleLower.includes('machine') || titleLower.includes('deep') || titleLower.includes('dữ liệu') || titleLower.includes('trí tuệ')) {
              cat = 'data-ai';
            } else if (titleLower.includes('design') || titleLower.includes('game') || titleLower.includes('figma') || titleLower.includes('thiết kế') || titleLower.includes('unity') || titleLower.includes('gamedev')) {
              cat = 'design-gamedev';
            }

            let gradient = 'from-blue-600 to-cyan-500';
            if (cat === 'mobile') gradient = 'from-violet-600 to-purple-500';
            if (cat === 'data-ai') gradient = 'from-emerald-600 to-teal-500';
            if (cat === 'design-gamedev') gradient = 'from-rose-600 to-pink-500';

            return {
              id: c.Id ? String(c.Id) : `db-${index}`,
              title,
              desc,
              category: c.Category || cat,
              rating: c.Rating || 4.8,
              reviews: c.ReviewsCount || (24 + (index * 7) % 50),
              duration: c.Duration || '45 giờ',
              lectures: c.LecturesCount || 50,
              level: c.Level || 'Mọi trình độ',
              price: c.Price || 1500000,
              oldPrice: c.OldPrice || 3000000,
              instructor: c.InstructorName || c.provider || 'Giảng viên chuyên gia',
              instRole: c.InstructorRole || 'Đối tác Đào tạo VietJob',
              bgGradient: gradient,
              isFromDB: true
            };
          });

          setCourses(mappedDBCourses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy khoá học từ DB:', err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDBCourses();
  }, []);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === 'all') {
      navigate('/courses');
    } else {
      navigate(`/courses/${tabKey}`);
    }
  };

  // Add/remove from wishlist (Danh sách quan tâm)
  const handleWishlist = async (courseId) => {
    const parsedUser = checkAuth();
    if (!parsedUser) {
      showToast("Vui lòng đăng nhập để lưu lộ trình quan tâm!", false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const currentRecord = userCourses.find(uc => String(uc.CourseId) === String(courseId));
    if (currentRecord) {
      if (currentRecord.Status === 'Đang theo học') {
        showToast("Bạn đã đăng ký theo học khóa học này rồi!", true);
        return;
      }
      
      // Remove from wishlist
      try {
        const res = await fetch('http://localhost:5000/api/user-courses/remove', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: parsedUser.id, courseId: String(courseId) })
        });
        if (res.ok) {
          showToast("Đã gỡ khóa học khỏi lộ trình quan tâm của bạn.");
          fetchUserCourses(parsedUser.id);
        } else {
          showToast("Có lỗi xảy ra khi gỡ khóa học.", false);
        }
      } catch (err) {
        showToast("Lỗi kết nối máy chủ.", false);
      }
    } else {
      // Add to wishlist
      try {
        const res = await fetch('http://localhost:5000/api/user-courses/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: parsedUser.id, courseId: String(courseId) })
        });
        if (res.ok) {
          showToast("Đã thêm vào lộ trình học tập quan tâm thành công! ❤️");
          fetchUserCourses(parsedUser.id);
        } else {
          const errData = await res.json();
          showToast(errData.message || "Lỗi khi lưu khóa học.", false);
        }
      } catch (err) {
        showToast("Lỗi kết nối máy chủ.", false);
      }
    }
  };

  // Open checkout modal and fetch balance
  const handleEnroll = async (course) => {
    const parsedUser = checkAuth();
    if (!parsedUser) {
      showToast("Vui lòng đăng nhập để đăng ký học lộ trình này!", false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    const currentRecord = userCourses.find(uc => String(uc.CourseId) === String(course.id));
    if (currentRecord && currentRecord.Status === 'Đang theo học') {
      showToast("Bạn đang theo học khóa học này rồi! 📚");
      navigate('/candidate/MyLearningPath');
      return;
    }

    // Generate unique 6-digit transaction ID & reset states
    const txnId = String(Math.floor(100000 + Math.random() * 900000));
    setCurrentTxnId(txnId);
    setPaymentStep('checkout');
    setCountdown(5);

    // Fetch user's current wallet balance
    try {
      const res = await fetch(`http://localhost:5000/api/wallet/info/${parsedUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setCandidateBalance(data.balance || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin ví cá nhân:", err);
    }

    setSelectedCourseForCheckout(course);
  };

  // Confirm payment and enroll with simulated bank transfer Webhook
  const confirmCheckout = async () => {
    if (!user || !selectedCourseForCheckout) return;

    setPaymentStep('verifying');
    setCheckoutLoading(true);

    // Start 5-second countdown verification animation
    let currentCountdown = 5;
    const interval = setInterval(() => {
      currentCountdown -= 1;
      setCountdown(currentCountdown);
      if (currentCountdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    try {
      // Call API triggering payment checkout and nạp tiền simulation via isBankTransfer
      const res = await fetch('http://localhost:5000/api/user-courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user.id, 
          courseId: String(selectedCourseForCheckout.id),
          isBankTransfer: true,
          txnId: currentTxnId
        })
      });
      const data = await res.json();

      // Wait for the full 5 seconds to complete for high-fidelity webhook simulation
      setTimeout(() => {
        clearInterval(interval);
        setCheckoutLoading(false);
        if (res.ok) {
          setPaymentStep('success');
          showToast("🎉 Khớp lệnh ngân hàng thành công! Đã kích hoạt khóa học.");
          fetchUserCourses(user.id);
        } else {
          setPaymentStep('checkout');
          showToast(data.message || "Lỗi xử lý khớp lệnh chuyển khoản.", false);
        }
      }, 5000);

    } catch (err) {
      clearInterval(interval);
      setCheckoutLoading(false);
      setPaymentStep('checkout');
      showToast("Lỗi kết nối máy chủ khi xử lý giao dịch.", false);
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Filter courses based on activeTab and searchQuery
  const filteredCourses = courses.filter(c => {
    const matchesTab = activeTab === 'all' || c.category === activeTab;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const formatPrice = (num) => {
    return num.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white py-16 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400 rounded-full opacity-10 blur-3xl" />
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/20 text-xs font-semibold text-blue-200 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Nâng cấp Kỹ năng - Nâng tầm Sự nghiệp
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Học Công nghệ <br />
              <span className="bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Chuẩn Thị Trường Việc Làm
              </span>
            </h1>
            <p className="text-gray-300 max-w-xl text-base md:text-lg leading-relaxed">
              Tuyển tập các chương trình đào tạo chất lượng cao đồng hành cùng VietJob, giúp bạn rèn luyện kiến thức thực chiến và kết nối trực tiếp với nhà tuyển dụng hàng đầu.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 bg-white/10 px-3.5 py-2 rounded-lg backdrop-blur-sm">
                <Award className="w-4 h-4 text-cyan-300" />
                Chứng nhận đối tác
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 bg-white/10 px-3.5 py-2 rounded-lg backdrop-blur-sm">
                <BookOpenCheck className="w-4 h-4 text-emerald-300" />
                Học thực chiến 100%
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-md shrink-0 bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-md shadow-2xl relative">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg font-bold transform rotate-12 text-white">
              NEW
            </div>
            <div className="space-y-4">
              <div className="h-44 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
                <div className="text-center space-y-2">
                  <Cpu className="w-12 h-12 mx-auto text-white animate-pulse" />
                  <span className="block font-bold text-lg text-white">Trí tuệ nhân tạo & AI</span>
                  <span className="text-xs text-indigo-200">Đang tuyển sinh tháng này</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="block font-bold text-white text-base">Học bổng VietJob Tech</span>
                  <span className="text-xs text-gray-300">Hỗ trợ 50% học phí</span>
                </div>
                <button 
                  onClick={() => handleTabChange('data-ai')} 
                  className="px-4 py-2 bg-white text-indigo-900 rounded-xl font-bold text-xs hover:bg-indigo-50 transition-colors"
                >
                  Khám phá
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Navigation & Filter Panel */}
      <section className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-[72px] z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {Object.keys(categoriesMap).map((key) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95
                  ${activeTab === key 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {categoriesMap[key].icon}
                <span>{categoriesMap[key].label}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm khoá học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

        </div>
      </section>

      {/* Course List Layout */}
      <main className="max-w-6xl w-full mx-auto px-4 py-12 flex-grow">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              {categoriesMap[activeTab]?.label || 'Tất cả khoá học'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Hiển thị <span className="font-bold text-gray-700">{filteredCourses.length}</span> khoá học phù hợp
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-100 px-3.5 py-1.5 rounded-lg">
            <Filter className="w-3.5 h-3.5" />
            Lọc & Sắp xếp
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 max-w-xl mx-auto mt-8">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-bold text-gray-700">Không tìm thấy khoá học nào</h3>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
              Không tìm thấy khoá học nào khớp với từ khoá tìm kiếm của bạn hoặc mục này tạm thời chưa được đăng tải.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); handleTabChange('all'); }} 
              className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
            >
              Xem tất cả khoá học
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((c) => {
              const learningRecord = userCourses.find(uc => String(uc.CourseId) === String(c.id));
              const isWishlisted = learningRecord && learningRecord.Status === 'Đang quan tâm';
              const isEnrolled = learningRecord && learningRecord.Status === 'Đang theo học';

              return (
                <div 
                  key={c.id}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Course Header Banner / Visual Gradient */}
                  <div className={`h-40 bg-gradient-to-br ${c.bgGradient} relative p-6 flex flex-col justify-between shrink-0`}>
                    
                    <div className="flex justify-between items-start w-full">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-white/20 text-white backdrop-blur-sm">
                        {categoriesMap[c.category]?.label}
                      </span>
                      
                      {/* Heart Wishlist icon */}
                      <button
                        onClick={(e) => { e.preventDefault(); handleWishlist(c.id); }}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 border border-white/10 flex items-center justify-center text-white transition-all backdrop-blur-sm active:scale-90"
                        title={isWishlisted ? "Gỡ khỏi lộ trình quan tâm" : "Thêm vào lộ trình quan tâm"}
                        disabled={isEnrolled}
                      >
                        <svg 
                          className={`w-4.5 h-4.5 transition-colors ${
                            isWishlisted ? 'fill-red-500 text-red-500' : isEnrolled ? 'fill-emerald-400 text-emerald-400 opacity-60' : 'text-white hover:text-red-300'
                          }`}
                          fill={isWishlisted || isEnrolled ? 'currentColor' : 'none'}
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="absolute right-6 bottom-4 opacity-15 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {c.category === 'web' && <Code className="w-24 h-24 text-white" />}
                      {c.category === 'mobile' && <Smartphone className="w-24 h-24 text-white" />}
                      {c.category === 'data-ai' && <Cpu className="w-24 h-24 text-white" />}
                      {c.category === 'design-gamedev' && <Palette className="w-24 h-24 text-white" />}
                    </div>

                    <div>
                      <h4 className="text-white font-extrabold text-lg leading-snug line-clamp-2">
                        {c.title}
                      </h4>
                    </div>
                  </div>

                  {/* Course Content Details */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Reviews & Star Rating */}
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-3">
                      <span className="flex items-center text-amber-500 gap-0.5 bg-amber-50 px-2 py-0.5 rounded font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {c.rating}
                      </span>
                      <span>({c.reviews} đánh giá)</span>
                      {c.isFromDB && (
                        <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-bold uppercase">
                          DOANH NGHIỆP
                        </span>
                      )}
                    </div>

                    {/* Course Description */}
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {c.desc}
                    </p>

                    {/* Metadata fields (duration, lectures, level) */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 text-center mb-6 shrink-0">
                      <div className="space-y-0.5">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Thời lượng</span>
                        <span className="text-xs font-bold text-gray-700 flex items-center justify-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {c.duration}
                        </span>
                      </div>
                      <div className="space-y-0.5 border-l border-r border-gray-100">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bài học</span>
                        <span className="text-xs font-bold text-gray-700 flex items-center justify-center gap-1">
                          <BookOpenCheck className="w-3.5 h-3.5 text-emerald-500" />
                          {c.lectures} bài
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trình độ</span>
                        <span className="text-xs font-bold text-gray-700 block truncate">{c.level}</span>
                      </div>
                    </div>

                    {/* Instructor Details */}
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 border border-blue-200">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-gray-700 truncate">{c.instructor}</span>
                        <span className="block text-[10px] text-gray-400 truncate">{c.instRole}</span>
                      </div>
                    </div>

                    {/* Course Pricing and Register Action button */}
                    <div className="flex items-end justify-between mt-auto shrink-0 pt-4 border-t border-gray-50">
                      <div>
                        {c.oldPrice && (
                          <span className="block text-xs text-gray-400 line-through mb-0.5">
                            {formatPrice(c.oldPrice)}
                          </span>
                        )}
                        <span className="block text-lg font-black text-blue-600">
                          {formatPrice(c.price)}
                        </span>
                      </div>

                      <button 
                        onClick={() => handleEnroll(c)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 group-hover:shadow-lg ${
                          isEnrolled 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/15'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/15'
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            Đang theo học
                            <BookOpenCheck className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            Đăng ký học ngay
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Trust Badges Footer Area */}
      <section className="w-full bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mx-auto md:mx-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base">Chứng chỉ chất lượng</h4>
              <p className="text-gray-500 text-sm mt-1">Được cấp sau khi hoàn thành khóa học và được các doanh nghiệp tuyển dụng công nhận.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 border-y md:border-y-0 md:border-x border-gray-100 py-6 md:py-0 md:px-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mx-auto md:mx-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base">Bảo trợ việc làm</h4>
              <p className="text-gray-500 text-sm mt-1">Hỗ trợ giới thiệu trực tiếp hồ sơ của các học viên xuất sắc tới các NTD đối tác trên VietJob.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 shrink-0 mx-auto md:mx-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-base">Đội ngũ Mentor tận tâm</h4>
              <p className="text-gray-500 text-sm mt-1">Được hỗ trợ giải đáp thắc mắc trực tuyến 1-1 từ các chuyên gia đang làm việc tại doanh nghiệp lớn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Toast Alert */}
      {toast && (
        <div className={`fixed bottom-8 right-8 text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-2xl z-[9999] flex items-center gap-2 animate-bounce ${
          toast.success ? 'bg-emerald-600' : 'bg-red-600'
        }`}>
          {toast.success ? '✅' : '⚠️'}
          <span>{toast.message}</span>
        </div>
      )}

      {/* CHECKOUT PAYMENT CONFIRMATION MODAL */}
      {selectedCourseForCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className={`bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative transition-all duration-300 ${
            paymentStep === 'checkout' ? 'max-w-4xl w-full' : 'max-w-md w-full'
          }`}>
            
            {/* Close button (only visible in checkout step) */}
            {paymentStep === 'checkout' && (
              <button 
                onClick={() => setSelectedCourseForCheckout(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full z-10"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 p-6 text-white text-center md:text-left">
              <span className="inline-block text-[10px] font-bold tracking-widest uppercase bg-blue-500/30 border border-blue-400/20 px-3 py-1 rounded-full text-blue-200 mb-2">
                Hệ thống Khớp lệnh chuyển khoản tự động
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">Thanh Toán Khóa Học</h3>
              <p className="text-xs text-blue-200/80 mt-1">Quét mã QR động để kích hoạt tài liệu học tập ngay lập tức</p>
            </div>

            {/* STEP 1: QR & INFO CHECKOUT */}
            {paymentStep === 'checkout' && (
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
                
                {/* Left Column: Bank QR Code Sheet */}
                <div className="flex-1 p-6 md:p-8 bg-slate-50/50 flex flex-col items-center justify-center space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Mã QR Thanh Toán (VietQR)</span>
                    
                    {/* Simulated mobile card for QR */}
                    <div className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 relative group max-w-[260px] mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />
                      
                      {/* MB Bank Badge on QR */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black text-blue-800 tracking-wider">MB BANK</span>
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">VietQR</span>
                      </div>

                      {/* Generates high-fidelity QR image including Bank STK and transfer details */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                          `Ngân hàng: MB Bank\nSTK: 0987654321\nTên: VIETJOB ACADEMY\nSố tiền: ${selectedCourseForCheckout.price}\nNội dung: USER_${user?.id}_TXN_${currentTxnId}`
                        )}`}
                        alt="Mã QR Chuyển Khoản"
                        className="w-48 h-48 mx-auto rounded-xl border border-gray-50 relative z-10"
                      />
                      
                      <div className="text-[10px] text-slate-400 font-bold mt-3">Quét mã bằng App Ngân hàng bất kỳ</div>
                    </div>
                  </div>

                  {/* Bank info grid with Copy action buttons */}
                  <div className="w-full space-y-3 bg-white rounded-2xl p-4 border border-gray-100 text-sm">
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 font-semibold text-xs">Ngân hàng thụ hưởng:</span>
                      <span className="text-slate-800 font-extrabold text-xs">MB BANK (Quân Đội)</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-t border-gray-50 pt-2">
                      <span className="text-gray-400 font-semibold text-xs">Số tài khoản:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-extrabold text-xs font-mono">0987654321</span>
                        <button
                          onClick={() => handleCopy("0987654321", "stk")}
                          className="text-[10px] bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded font-bold transition-all active:scale-95"
                        >
                          {copiedField === 'stk' ? 'Đã sao chép! ✓' : 'Sao chép'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-t border-gray-50 pt-2">
                      <span className="text-gray-400 font-semibold text-xs">Chủ tài khoản:</span>
                      <span className="text-slate-800 font-extrabold text-xs uppercase">VIETJOB ACADEMY</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-t border-gray-50 pt-2">
                      <span className="text-gray-400 font-semibold text-xs">Số tiền chuyển:</span>
                      <span className="text-red-600 font-extrabold text-xs">{formatPrice(selectedCourseForCheckout.price)}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 border-t border-gray-50 pt-2 bg-yellow-50/50 p-2 rounded-xl border border-yellow-100/50">
                      <span className="text-amber-800 font-bold text-xs">Nội dung (Bắt buộc):</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-900 font-black text-xs font-mono bg-yellow-100 px-2 py-0.5 rounded border border-yellow-200">
                          {`USER_${user?.id}_TXN_${currentTxnId}`}
                        </span>
                        <button
                          onClick={() => handleCopy(`USER_${user?.id}_TXN_${currentTxnId}`, "noidung")}
                          className="text-[10px] bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded font-bold transition-all active:scale-95"
                        >
                          {copiedField === 'noidung' ? 'Đã copy! ✓' : 'Copy'}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Right Column: Checkout Instruction & Summary */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-4">
                    {/* Course Summary Item */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">Khóa học đăng ký</span>
                      <h4 className="text-base font-extrabold text-gray-800 leading-snug">
                        {selectedCourseForCheckout.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold mt-2">
                        <span>Giảng viên: <strong>{selectedCourseForCheckout.instructor}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span>{selectedCourseForCheckout.duration}</span>
                      </div>
                    </div>

                    {/* Step Guideline */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Các bước thực hiện:</h5>
                      
                      <div className="flex gap-2.5 items-start text-xs text-gray-600 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                        <p>Mở ứng dụng ngân hàng di động bất kỳ trên điện thoại của bạn.</p>
                      </div>
                      
                      <div className="flex gap-2.5 items-start text-xs text-gray-600 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                        <p>Chọn chức năng <strong>Quét mã QR</strong> và quét ảnh QR ở cột bên trái.</p>
                      </div>

                      <div className="flex gap-2.5 items-start text-xs text-gray-600 leading-relaxed">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                        <p>Kiểm tra thông tin số tài khoản & số tiền chuyển. <strong className="text-amber-700">Đảm bảo giữ nguyên phần nội dung chuyển khoản mẫu</strong>.</p>
                      </div>

                      <div className="flex gap-2.5 items-start text-xs text-gray-600 leading-relaxed bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                        <p className="text-blue-800">
                          Sau khi nhấn Chuyển khoản thành công trên app ngân hàng, quý khách vui lòng bấm nút <strong>"Tôi đã chuyển khoản"</strong> bên dưới.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Actions */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={confirmCheckout}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 active:scale-98 cursor-pointer animate-pulse"
                    >
                      <CreditCard className="w-4 h-4" />
                      Tôi đã chuyển khoản thành công
                    </button>

                    <button
                      onClick={() => setSelectedCourseForCheckout(null)}
                      className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-2xl font-bold text-xs transition-all active:scale-98 cursor-pointer text-center"
                    >
                      Hủy giao dịch
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 2: VERIFYING MOCK BANK WEBHOOK (5-SECOND COUNTDOWN) */}
            {paymentStep === 'verifying' && (
              <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center">
                
                {/* Visual loading ring */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                  
                  {/* Countdown number indicator */}
                  <div className="text-3xl font-black text-blue-600 animate-pulse">
                    {countdown}s
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-extrabold text-gray-800">Đang lắng nghe tín hiệu Webhook...</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Hệ thống API VietJob đang lắng nghe tín hiệu biến động số dư tài khoản MB Bank đối tác. Giao dịch sẽ tự động khớp lệnh sau khi nhận được Webhook.
                  </p>
                </div>

                {/* Simulated matching transaction badge */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 w-full font-mono text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trạng thái:</span>
                    <span className="text-amber-600 font-bold flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                      Đang khớp lệnh
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-1.5 mt-1.5">
                    <span className="text-slate-400">Khớp mã:</span>
                    <span className="font-bold text-slate-800">{`USER_${user?.id}_TXN_${currentTxnId}`}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-medium">
                  Vui lòng không đóng cửa sổ thanh toán này!
                </div>

              </div>
            )}

            {/* STEP 3: TRANSACTION SUCCESS & CONFETTI TICKET */}
            {paymentStep === 'success' && (
              <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center">
                
                {/* Success Animation Tick */}
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/10 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
                    Giao dịch hoàn tất
                  </span>
                  <h4 className="text-xl font-extrabold text-gray-800 mt-2">🎉 Đăng Ký Thành Công!</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Khớp lệnh thành công! Khóa học đã được kích hoạt vĩnh viễn trong lộ trình học tập của bạn. Biên lai giao dịch kèm link Google Drive bài giảng đã được gửi tới email đăng ký của bạn.
                  </p>
                </div>

                {/* Email details card */}
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 w-full text-xs text-emerald-800 flex items-start gap-3 text-left">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Biên lai & Tài liệu học tập đã gửi tới:</span>
                    <span className="font-medium text-emerald-600 block mt-0.5 font-mono">{user?.email}</span>
                    <span className="text-[10px] text-emerald-500 block mt-1">Vui lòng kiểm tra kỹ cả thư mục Hộp thư đến (Inbox) và Thư rác (Spam).</span>
                  </div>
                </div>

                {/* Final redirection button */}
                <button
                  onClick={() => {
                    setSelectedCourseForCheckout(null);
                    navigate('/candidate/MyLearningPath');
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/10 active:scale-98 cursor-pointer"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  Bắt đầu học tập ngay
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
