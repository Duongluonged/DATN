import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText, Plus, Loader2, Briefcase, MapPin, Clock, CheckCircle2,
  XCircle, Eye, AlertCircle, TrendingUp, User
} from 'lucide-react';
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Candidate_c/Sidebar";
import axios from 'axios';

const API = 'http://localhost:5000/api';

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch { return {}; }
};

const STATUS_MAP = {
  'Mới': { label: 'ĐÃ NỘP', cls: 'bg-indigo-100 text-indigo-600' },
  'Đang xem xét': { label: 'ĐANG XEM XÉT', cls: 'bg-blue-100 text-blue-600' },
  'Phỏng vấn': { label: 'PHỎNG VẤN', cls: 'bg-green-100 text-green-600' },
  'Từ chối': { label: 'TỪ CHỐI', cls: 'bg-red-100 text-red-500' },
  'Đã tuyển': { label: 'ĐÃ TUYỂN', cls: 'bg-emerald-100 text-emerald-700' },
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return `${Math.floor(diff / 604800)} tuần trước`;
};

const calcProfileStrength = (user, cvData, applications) => {
  let score = 0;
  if (user?.username || user?.name) score += 20;
  if (user?.email) score += 15;
  if (cvData?.bio) score += 20;
  if (cvData?.skills) score += 20;
  if (cvData?.cvFilePath) score += 15;
  if (applications?.length > 0) score += 10;
  return Math.min(score, 100);
};

const Tongquan = () => {
  const navigate = useNavigate();
  const user = getUserFromStorage();
  const userId = user?.id;
  const userName = user?.username || user?.name || 'Bạn';

  const [applications, setApplications] = useState([]);
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }

    const fetchAll = async () => {
      try {
        const [appRes, cvRes] = await Promise.all([
          axios.get(`${API}/applications/candidate/${userId}`),
          axios.get(`${API}/cv/${userId}`),
        ]);
        setApplications(appRes.data || []);
        setCvData(cvRes.data || null);
      } catch (err) {
        console.error('Lỗi tải dữ liệu Tổng quan:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  const totalApplied = applications.length;
  const interviewCount = applications.filter(a => a.Status === 'Phỏng vấn' || a.Status === 'Đã tuyển').length;
  const profileStrength = calcProfileStrength(user, cvData, applications);

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'buổi sáng' : greetingHour < 18 ? 'buổi chiều' : 'buổi tối';

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex min-h-screen bg-gray-50 items-center justify-center">
          <Loader2 size={40} className="animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50 font-sans text-slate-700"
        style={{ fontFamily: "'Inter', sans-serif" }}>
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="grid grid-cols-3 gap-6">

            <div className="col-span-2 space-y-6">

              <div className="bg-white p-8 rounded-3xl relative overflow-hidden shadow-sm border border-gray-100">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">
                    Chào {greeting}, {userName} 👋
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Chào mừng bạn trở lại! Bạn đã ứng tuyển <strong>{totalApplied}</strong> vị trí và có <strong>{interviewCount}</strong> lời mời phỏng vấn.
                  </p>

                  <div className="flex gap-4">
                    <StatCard
                      label="Đã ứng tuyển"
                      value={totalApplied}
                      trend={totalApplied > 0 ? `${applications.filter(a => {
                        const d = new Date(a.AppliedAt);
                        const weekAgo = new Date(Date.now() - 7 * 86400000);
                        return d > weekAgo;
                      }).length} tuần này` : 'Chưa có'}
                      color="text-green-500"
                    />
                    <StatCard
                      label="Lời mời phỏng vấn"
                      value={interviewCount}
                      trend={interviewCount > 0 ? 'Cần phản hồi' : 'Chưa có'}
                      color="text-teal-500"
                    />
                    <StatCard
                      label="Hoàn thành hồ sơ"
                      value={`${profileStrength}%`}
                      trend={profileStrength < 100 ? 'Cần cập nhật' : 'Đầy đủ ✓'}
                      color={profileStrength >= 80 ? 'text-green-500' : 'text-orange-500'}
                    />
                  </div>
                </div>
                <div className="absolute top-4 right-8 opacity-10">
                  <TrendingUp size={100} className="text-blue-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Hoạt động ứng tuyển mới nhất</h3>
                  <button
                    className="text-blue-600 text-sm font-medium hover:underline"
                    onClick={() => navigate('/candidate/applications')}
                  >
                    Tất cả →
                  </button>
                </div>

                {applications.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center text-center">
                    <Briefcase size={40} className="text-gray-300 mb-3" />
                    <p className="font-semibold text-gray-500">Chưa có đơn ứng tuyển nào</p>
                    <p className="text-sm text-gray-400 mt-1">Hãy tìm kiếm và ứng tuyển vị trí phù hợp với bạn!</p>
                    <button
                      onClick={() => navigate('/jobs')}
                      className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                    >
                      Tìm việc ngay
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.slice(0, 5).map((app) => (
                      <JobRow key={app.ApplicationID} app={app} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">

              <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-200">
                <div className="flex justify-between mb-4">
                  <span className="text-sm opacity-90">Độ mạnh hồ sơ</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${profileStrength >= 80 ? 'bg-green-400' : profileStrength >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}>
                    {profileStrength >= 80 ? 'Tốt' : profileStrength >= 50 ? 'Trung bình' : 'Yếu'}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1 uppercase font-bold">
                    <span>Hoàn thành {profileStrength}%</span>
                  </div>
                  <div className="w-full bg-blue-400 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all duration-700" style={{ width: `${profileStrength}%` }} />
                  </div>
                </div>
                <p className="text-xs opacity-80 mb-6 leading-relaxed">
                  {profileStrength < 100
                    ? 'Cập nhật đầy đủ thông tin để thu hút nhà tuyển dụng tốt hơn.'
                    : 'Hồ sơ của bạn đã hoàn chỉnh. Hãy tiếp tục ứng tuyển!'}
                </p>
                <button
                  className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-50 transition"
                  onClick={() => navigate('/candidate/profile')}
                >
                  Cập nhật hồ sơ
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm">Hồ sơ đính kèm</h3>
                  <button
                    onClick={() => navigate('/candidate/HSo_Dinh_Kem')}
                    className="text-blue-600 cursor-pointer hover:text-blue-800"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {cvData?.cvFilePath ? (
                  <div className="space-y-3">
                    <FileItem
                      name={cvData.cvFileName || 'CV của tôi'}
                      href={cvData.cvFilePath}
                    />
                    <button
                      onClick={() => navigate('/candidate/HSo_Dinh_Kem')}
                      className="w-full text-blue-600 text-xs font-bold mt-4 flex items-center justify-center gap-1 hover:underline"
                    >
                      Quản lý CV →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center py-4">
                    <FileText size={32} className="text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-medium">Chưa có CV đính kèm</p>
                    <button
                      onClick={() => navigate('/candidate/HSo_Dinh_Kem')}
                      className="mt-3 px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 transition"
                    >
                      Tải CV lên
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm mb-4">Thông tin tài khoản</h3>
                <div className="space-y-3">
                  <InfoRow label="Tên" value={userName} />
                  <InfoRow label="Email" value={user?.email || '—'} />
                  <InfoRow label="Vai trò" value="Ứng viên" />
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};


const StatCard = ({ label, value, trend, color }) => (
  <div className="bg-gray-50 p-4 rounded-2xl flex-1 border border-gray-100">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold">{value}</span>
      <span className={`text-[10px] font-bold ${color}`}>{trend}</span>
    </div>
  </div>
);

const JobRow = ({ app }) => {
  const statusInfo = STATUS_MAP[app.Status] || { label: app.Status, cls: 'bg-gray-100 text-gray-600' };
  const initial = (app.CompanyName || 'C')[0].toUpperCase();

  return (
    <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-50 hover:shadow-md transition cursor-pointer">
      <div className="flex items-center gap-4">
        {app.LogoURL ? (
          <img src={app.LogoURL} alt={app.CompanyName} className="w-12 h-12 rounded-lg object-contain border border-gray-100" />
        ) : (
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            {initial}
          </div>
        )}
        <div>
          <h4 className="font-bold text-sm">{app.JobTitle}</h4>
          <p className="text-xs text-gray-400">
            {app.CompanyName}
            {app.Location && <> • <MapPin size={10} className="inline" /> {app.Location}</>}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-[10px] font-bold px-2 py-1 rounded ${statusInfo.cls}`}>
          {statusInfo.label}
        </span>
        <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-end gap-1">
          <Clock size={9} /> {timeAgo(app.AppliedAt)}
        </p>
      </div>
    </div>
  );
};

const FileItem = ({ name, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition group"
  >
    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
      <FileText size={16} />
    </div>
    <div className="overflow-hidden flex-1">
      <p className="text-[11px] font-bold truncate">{name}</p>
      <p className="text-[9px] text-gray-400">Nhấn để xem CV</p>
    </div>
    <Eye size={14} className="text-gray-400 group-hover:text-blue-600 transition shrink-0" />
  </a>
);

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400 text-xs font-semibold uppercase">{label}</span>
    <span className="font-medium text-gray-700 text-xs">{value}</span>
  </div>
);

export default Tongquan;