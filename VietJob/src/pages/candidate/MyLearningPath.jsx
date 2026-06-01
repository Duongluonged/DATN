import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import {
  BookOpen, Trash2, GraduationCap, ChevronRight, PlayCircle,
  Clock, BookOpenCheck, ArrowRight, Star, Heart, Sparkles
} from 'lucide-react';

const mockCourses = [
  {
    id: 'web-1',
    title: 'Lập trình Web Fullstack với React & Node.js',
    category: 'web',
    duration: '64 giờ',
    lectures: 96,
    instructor: 'Nguyễn Văn Minh',
    bgGradient: 'from-blue-600 to-cyan-500'
  },
  {
    id: 'web-2',
    title: 'Phát triển ứng dụng Web hiện đại với Next.js & Tailwind CSS',
    category: 'web',
    duration: '32 giờ',
    lectures: 48,
    instructor: 'Trần Hoàng Long',
    bgGradient: 'from-sky-600 to-indigo-500'
  },
  {
    id: 'mobile-1',
    title: 'Lập trình Flutter đa nền tảng cho iOS & Android',
    category: 'mobile',
    duration: '48 giờ',
    lectures: 74,
    instructor: 'Phạm Minh Đức',
    bgGradient: 'from-violet-600 to-purple-500'
  },
  {
    id: 'mobile-2',
    title: 'Lập trình React Native - Xây dựng ứng dụng thực tế',
    category: 'mobile',
    duration: '40 giờ',
    lectures: 60,
    instructor: 'Lê Hồng Sơn',
    bgGradient: 'from-indigo-600 to-purple-500'
  },
  {
    id: 'data-ai-1',
    title: 'Khoa học dữ liệu (Data Science) với Python thực chiến',
    category: 'data-ai',
    duration: '60 giờ',
    lectures: 88,
    instructor: 'Dr. Vũ Đăng Khoa',
    bgGradient: 'from-emerald-600 to-teal-500'
  },
  {
    id: 'data-ai-2',
    title: 'Kỹ sư Trí tuệ nhân tạo (AI) & Machine Learning ứng dụng',
    category: 'data-ai',
    duration: '54 giờ',
    lectures: 80,
    instructor: 'Hoàng Anh Tuấn',
    bgGradient: 'from-teal-600 to-cyan-500'
  },
  {
    id: 'design-gamedev-1',
    title: 'Thiết kế UI/UX Chuyên nghiệp với Figma',
    category: 'design-gamedev',
    duration: '36 giờ',
    lectures: 52,
    instructor: 'Mai Phương Thảo',
    bgGradient: 'from-rose-600 to-pink-500'
  },
  {
    id: 'design-gamedev-2',
    title: 'Lập trình Game 3D với Unity & C#',
    category: 'design-gamedev',
    duration: '50 giờ',
    lectures: 78,
    instructor: 'Đỗ Tiến Đạt',
    bgGradient: 'from-orange-600 to-rose-500'
  }
];

const categoryLabels = {
  'web': 'Lập trình Web',
  'mobile': 'Lập trình Mobile',
  'data-ai': 'Dữ liệu & AI',
  'design-gamedev': 'Thiết kế & Gamedev'
};

export default function MyLearningPath() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userCourses, setUserCourses] = useState([]);
  const [allDBCourses, setAllDBCourses] = useState([]);
  const [toast, setToast] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('enrolled'); // 'enrolled' | 'wishlist'

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // Initial fetch
    fetchData(parsedUser.id);
  }, []);

  const fetchData = async (userId) => {
    setLoading(true);
    try {
      // 1. Fetch user learning path list
      const resPath = await fetch(`http://localhost:5000/api/user-courses/${userId}`);
      let pathData = [];
      if (resPath.ok) {
        pathData = await resPath.json();
      }

      // 2. Fetch all courses from DB to map details
      const resCourses = await fetch('http://localhost:5000/api/courses');
      let dbCourses = [];
      if (resCourses.ok) {
        dbCourses = await resCourses.json();
        setAllDBCourses(dbCourses);
      }

      // 3. Map details for each user course entry
      const mapped = pathData.map(uc => {
        // Find course details in db
        const dbCourse = dbCourses.find(c => String(c.Id) === String(uc.CourseId));
        let details;
        if (dbCourse) {
          const title = dbCourse.name || dbCourse.TieuDe || 'Khóa học doanh nghiệp';
          let cat = dbCourse.Category || 'web';
          const titleLower = title.toLowerCase();
          if (!dbCourse.Category) {
            if (titleLower.includes('mobile') || titleLower.includes('flutter') || titleLower.includes('react native') || titleLower.includes('android')) cat = 'mobile';
            else if (titleLower.includes('data') || titleLower.includes('ai') || titleLower.includes('python') || titleLower.includes('machine') || titleLower.includes('dữ liệu')) cat = 'data-ai';
            else if (titleLower.includes('design') || titleLower.includes('game') || titleLower.includes('figma') || titleLower.includes('unity')) cat = 'design-gamedev';
          }

          let gradient = 'from-blue-600 to-cyan-500';
          if (cat === 'mobile') gradient = 'from-violet-600 to-purple-500';
          if (cat === 'data-ai') gradient = 'from-emerald-600 to-teal-500';
          if (cat === 'design-gamedev') gradient = 'from-rose-600 to-pink-500';

          details = {
            id: dbCourse.Id,
            title,
            category: cat,
            duration: dbCourse.Duration || '45 giờ',
            lectures: dbCourse.LecturesCount || 50,
            instructor: dbCourse.InstructorName || dbCourse.provider || 'Giảng viên chuyên gia',
            bgGradient: gradient,
            driveLink: dbCourse.DriveLink || 'https://drive.google.com/drive/folders/1VJ-mock-learning-folder-vietjob'
          };
        } else {
          // Fallback if not found in db
          details = {
            id: uc.CourseId,
            title: `Khóa học mã số #${uc.CourseId}`,
            category: 'web',
            duration: '40 giờ',
            lectures: 40,
            instructor: 'Chuyên gia giảng dạy',
            bgGradient: 'from-gray-700 to-gray-500',
            driveLink: 'https://drive.google.com/drive/folders/1VJ-mock-learning-folder-vietjob'
          };
        }

        return {
          ...uc,
          details
        };
      });

      setUserCourses(mapped);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu lộ trình:', err);
      showToast('Có lỗi xảy ra khi tải lộ trình học tập', false);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (courseId) => {
    if (!window.confirm("Bạn có chắc muốn gỡ bỏ khóa học này khỏi lộ trình quan tâm?")) return;

    try {
      const res = await fetch('http://localhost:5000/api/user-courses/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId: String(courseId) })
      });

      if (res.ok) {
        showToast("Đã gỡ khóa học thành công!");
        fetchData(user.id);
      } else {
        showToast("Gỡ khóa học thất bại.", false);
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ.", false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await fetch('http://localhost:5000/api/user-courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId: String(courseId) })
      });

      if (res.ok) {
        showToast("🎉 Đăng ký lộ trình học tập thành công!");
        fetchData(user.id);
      } else {
        showToast("Đăng ký học thất bại.", false);
      }
    } catch (err) {
      showToast("Lỗi kết nối máy chủ.", false);
    }
  };

  const wishlistCourses = userCourses.filter(uc => uc.Status === 'Đang quan tâm');
  const enrolledCourses = userCourses.filter(uc => uc.Status === 'Đang theo học');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-900 text-white py-14 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400 rounded-full opacity-10 blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/20 text-xs font-semibold text-blue-200 tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            Lộ trình học tập của {user?.username || 'tôi'}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Lộ Trình Học Tập Phát Triển Sự Nghiệp
          </h1>
          <p className="text-gray-300 max-w-2xl text-sm md:text-base leading-relaxed">
            Nơi quản lý và theo dõi các khóa học quan tâm cũng như tiến độ học tập thực tế của bạn. Cam kết đồng hành cùng nhà tuyển dụng nâng tầm kiến thức.
          </p>
        </div>
      </section>

      {/* Main Tab Controller & List Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-10 flex-grow">

        {/* Toggle navigation tabs */}
        <div className="flex border-b border-gray-200 mb-8 w-full">
          <button
            onClick={() => setActiveSubTab('enrolled')}
            className={`
              flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-all duration-150
              ${activeSubTab === 'enrolled'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Khóa học đang học ({enrolledCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('wishlist')}
            className={`
              flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-all duration-150
              ${activeSubTab === 'wishlist'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <Heart className="w-4 h-4" />
            <span>Danh sách quan tâm ({wishlistCourses.length})</span>
          </button>
        </div>

        {/* Content displays based on selected tab */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : activeSubTab === 'enrolled' ? (
          /* ================== TAB: ENROLLED COURSES ================== */
          enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 max-w-md mx-auto mt-8 space-y-4">
              <div className="text-5xl text-blue-500">🎓</div>
              <h3 className="text-lg font-bold text-gray-700">Chưa đăng ký khóa học nào</h3>
              <p className="text-gray-500 text-sm">
                Bạn chưa kích hoạt khóa học nào trong lộ trình của mình. Hãy duyệt qua danh mục khoá học để chọn bài học phù hợp nhất!
              </p>
              <button
                onClick={() => navigate('/courses')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Khám phá khoá học
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {enrolledCourses.map((uc) => (
                <div
                  key={uc.UserCourseID}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row h-full"
                >
                  {/* Left visually rich gradient block */}
                  <div className={`w-full md:w-44 bg-gradient-to-br ${uc.details?.bgGradient} shrink-0 p-5 flex flex-col justify-between text-white relative`}>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white/20 self-start backdrop-blur-sm">
                      {categoryLabels[uc.details?.category] || 'Công nghệ'}
                    </span>
                    <GraduationCap className="w-10 h-10 opacity-20 absolute right-4 bottom-4" />
                    <span className="block font-black text-sm leading-snug line-clamp-3">
                      {uc.details?.title}
                    </span>
                  </div>

                  {/* Right description block */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-800 text-base line-clamp-2">
                        {uc.details?.title}
                      </h4>
                      <p className="text-xs text-gray-400">Giảng viên: <span className="font-semibold text-gray-600">{uc.details?.instructor}</span></p>
                    </div>

                    {/* Progress tracking display */}
                    <div className="space-y-1.5 shrink-0">
                      <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase">
                        <span>Tiến độ học tập</span>
                        <span className="text-blue-600">35% hoàn thành</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-[35%]" />
                      </div>
                    </div>

                    {/* Footer metadata and action button */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 shrink-0">
                      <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {uc.details?.duration}
                      </span>
                      <button
                        onClick={() => {
                          const link = uc.details?.driveLink || 'https://drive.google.com';
                          window.open(link, '_blank');
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-blue-600/10 active:scale-95"
                      >
                        Vào học ngay
                        <PlayCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* ================== TAB: WISHLIST (DANH SÁCH QUAN TÂM) ================== */
          wishlistCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 max-w-md mx-auto mt-8 space-y-4">
              <div className="text-5xl text-rose-500">❤️</div>
              <h3 className="text-lg font-bold text-gray-700">Chưa có khóa học quan tâm</h3>
              <p className="text-gray-500 text-sm">
                Không tìm thấy khóa học quan tâm nào trong lộ trình của bạn. Thêm các khóa học ưa thích để theo dõi lộ trình phát triển.
              </p>
              <button
                onClick={() => navigate('/courses')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Khám phá khoá học
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {wishlistCourses.map((uc) => (
                <div
                  key={uc.UserCourseID}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row h-full animate-fadeIn"
                >
                  {/* Left visually rich gradient block */}
                  <div className={`w-full md:w-44 bg-gradient-to-br ${uc.details?.bgGradient} shrink-0 p-5 flex flex-col justify-between text-white relative`}>
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white/20 self-start backdrop-blur-sm">
                      {categoryLabels[uc.details?.category] || 'Công nghệ'}
                    </span>
                    <Heart className="w-10 h-10 opacity-20 absolute right-4 bottom-4" />
                    <span className="block font-black text-sm leading-snug line-clamp-3">
                      {uc.details?.title}
                    </span>
                  </div>

                  {/* Right description block */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-800 text-base line-clamp-2">
                        {uc.details?.title}
                      </h4>
                      <p className="text-xs text-gray-400">Giảng viên: <span className="font-semibold text-gray-600">{uc.details?.instructor}</span></p>
                    </div>

                    {/* Wishlist courses details and action buttons */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-50 shrink-0">
                      <button
                        onClick={() => handleRemove(uc.CourseId)}
                        className="p-2 border border-red-100 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors active:scale-95 flex items-center justify-center"
                        title="Gỡ bỏ khỏi danh sách quan tâm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleEnroll(uc.CourseId)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-blue-600/10 active:scale-95"
                      >
                        Đăng ký học ngay
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </main>

      {/* Floating toast alert */}
      {toast && (
        <div className={`fixed bottom-8 right-8 text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-2xl z-[9999] flex items-center gap-2 animate-bounce ${toast.success ? 'bg-emerald-600' : 'bg-red-600'
          }`}>
          {toast.success ? '✅' : '⚠️'}
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
