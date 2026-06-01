import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Ban } from 'lucide-react';
const provinces = [
  "Tất cả các địa điểm", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng",
  "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Huế", "Nha Trang"
];

const salaryRanges = [
  { label: "Mức lương (Tất cả)", value: "all" },
  { label: "Dưới 10 triệu", value: "under10" },
  { label: "10 - 20 triệu", value: "10-20" },
  { label: "20 - 50 triệu", value: "20-50" },
  { label: "Trên 50 triệu", value: "50+" },
];

const jobTypes = [
  { label: "Loại hình (Tất cả)", value: "all" },
  { label: "Toàn thời gian", value: "full-time" },
  { label: "Bán thời gian", value: "part-time" },
  { label: "Thực tập", value: "internship" },
  { label: "Hợp đồng", value: "contract" },
];


function BannerSearch() {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(provinces[0]);
  const [selectedSalary, setSelectedSalary] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");


  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State bộ lọc đồng bộ từ URL
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'Tất cả các địa điểm');
  const [salary, setSalary] = useState(searchParams.get('salary') || 'all');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'all');

  // Gọi API mỗi khi URL params thay đổi
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('http://localhost:5000/api/jobs/search', {
          params: {
            keyword: searchParams.get('keyword') || undefined,
            location: searchParams.get('location') || undefined,
            salary: searchParams.get('salary') || undefined,
            jobType: searchParams.get('jobType') || undefined,
          }
        });
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setError('Không thể kết nối server. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  // Áp dụng bộ lọc → cập nhật URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location !== 'Tất cả các địa điểm') params.set('location', location);
    if (salary !== 'all') params.set('salary', salary);
    if (jobType !== 'all') params.set('jobType', jobType);
    setSearchParams(params);
  };


  const clearFilters = () => {
    setKeyword('');
    setLocation('Tất cả các địa điểm');
    setSalary('all');
    setJobType('all');
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = searchParams.toString() !== '';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') applyFilters();
  };



  return (
    <section
      className="w-full relative py-16 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')` }}
    >
      <div className="absolute inset-0 bg-neutral-900/70"></div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Thanh tìm kiếm */}
        <div className="flex items-center bg-white rounded-full shadow-2xl focus-within:ring-4 focus-within:ring-sky-500/30 transition-all overflow-hidden">
          <div className="flex-1 flex items-center px-5">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập kỹ năng, vị trí công việc..."
              className="w-full bg-transparent border-none outline-none px-3 py-4 text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>
          <button
            onClick={applyFilters}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 py-4 transition-all active:scale-95"
          >
            TÌM KIẾM
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-3 mt-5">
          {/* Địa điểm */}
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-sm border border-gray-200 rounded-full px-4 py-1.5 outline-none cursor-pointer bg-white hover:border-sky-400 transition-colors"
            >
              {provinces.map((p, i) => <option key={i} value={p}>{p}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Mức lương */}
          <div className="relative">
            <select
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="text-sm border border-gray-200 rounded-full px-4 py-1.5 outline-none cursor-pointer bg-white hover:border-sky-400 transition-colors"
            >
              {salaryRanges.map((r, i) => <option key={i} value={r.value}>{r.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Loại hình */}
          <div className="relative">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="text-sm border border-gray-200 rounded-full px-4 py-1.5 outline-none cursor-pointer bg-white hover:border-sky-400 transition-colors"
            >
              {jobTypes.map((t, i) => <option key={i} value={t.value}>{t.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-800 hover:text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 hover:border-blue-400 bg-white transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}

        </div>
      </div>
    </section>
  );
}

export default BannerSearch;
