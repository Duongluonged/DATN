import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';

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

const trendingTags = ["ReactJS", "Node.js", "Java", "Python", "Laravel", "C#"];

function Banner() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(provinces[0]);
  const [selectedSalary, setSelectedSalary] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (selectedLocation !== "Tất cả các địa điểm") params.set("location", selectedLocation);
    if (selectedSalary !== "all") params.set("salary", selectedSalary);
    if (selectedJobType !== "all") params.set("jobType", selectedJobType);

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTagClick = (tag) => {
    setKeyword(tag);
    const params = new URLSearchParams();
    params.set("keyword", tag);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section
      className="w-full relative py-16 px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')` }}
    >
      <div className="absolute inset-0 bg-neutral-900/70"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          Kiến Tạo <span className="text-sky-400">Tương Lai</span> Công Nghệ.
        </h1>
        <p className="text-gray-300 mb-10 text-lg italic">
          "Kết nối bạn với những cơ hội hàng đầu tại Việt Nam"
        </p>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center bg-white rounded-full shadow-2xl focus-within:ring-4 focus-within:ring-sky-500/30 transition-all overflow-hidden">
          <div className="flex-1 flex items-center px-5">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
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
            onClick={handleSearch}
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
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full px-5 py-2 text-sm cursor-pointer outline-none appearance-none pr-9 backdrop-blur-md transition-all"
            >
              {provinces.map((p, i) => <option key={i} value={p} className="text-gray-900">{p}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Mức lương */}
          <div className="relative">
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full px-5 py-2 text-sm cursor-pointer outline-none appearance-none pr-9 backdrop-blur-md transition-all"
            >
              {salaryRanges.map((r, i) => <option key={i} value={r.value} className="text-gray-900">{r.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Loại hình */}
          <div className="relative">
            <select
              value={selectedJobType}
              onChange={(e) => setSelectedJobType(e.target.value)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full px-5 py-2 text-sm cursor-pointer outline-none appearance-none pr-9 backdrop-blur-md transition-all"
            >
              {jobTypes.map((t, i) => <option key={i} value={t.value} className="text-gray-900">{t.label}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="mt-7 flex flex-wrap items-center gap-2">
          <span className="text-gray-300 text-sm font-medium">Từ khóa phổ biến:</span>
          {trendingTags.map((tag, i) => (
            <button
              key={i}
              onClick={() => handleTagClick(tag)}
              className="text-xs bg-white/5 hover:bg-white/20 border border-white/20 text-gray-200 px-3 py-1.5 rounded-md transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Banner;
