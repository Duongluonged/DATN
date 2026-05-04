import React, { useState } from 'react';

// Giữ nguyên mảng provinces và salaryRanges của bạn...
const provinces = ["Tất cả các địa điểm", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", /* ... */];
const salaryRanges = [
  { label: "Mức lương (Tất cả)", value: "all" },
  { label: "Dưới 10 triệu", value: "0-10" },
  { label: "10 - 20 triệu", value: "10-20" },
  { label: "20 - 50 triệu", value: "20-50" },
  { label: "Trên 50 triệu", value: "50-plus" },
  { label: "Thỏa thuận", value: "negotiable" }
];

const trendingTags = ["ReactJS", "Node.js", "Java", "Python", "3D Artist", "Laravel"];

function Banner() {
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(provinces[0]);
  const [selectedSalary, setSelectedSalary] = useState(salaryRanges[0].value);

  const handleSearch = () => {
    console.log("Tìm kiếm:", { keyword, selectedLocation, selectedSalary });
    // Sau này Dương sẽ gọi API hoặc chuyển trang tìm kiếm ở đây
    alert(`Đang tìm kiếm ${keyword} tại ${selectedLocation}`);
  };

  return (
    <section className="w-full relative py-6 px-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80')` }}>
      {/* Lớp phủ màu xám */}
      <div className="absolute inset-0 bg-neutral-900/70"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* 1. Tiêu đề chính - Làm mượt hơn bằng leading */}
        <h1 className="text-1xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
          Kiến Tạo <span className="text-sky-400">Tương Lai</span> Công Nghệ.
        </h1>
        <p className="text-gray-300 mb-10 text-lg italic">
          "Kết nối bạn với những cơ hội hàng đầu tại Việt Nam"
        </p>

        {/* 2. Thanh tìm kiếm chính - Thêm focus-within để đổi màu viền */}
        <div className="flex items-center bg-white rounded-full p-0.2 max-w-8xl shadow-2xl focus-within:ring-4 focus-within:ring-sky-500/30 transition-all">
          <div className="flex-1 flex items-center px-4">
             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
             <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Nhập kỹ năng, vị trí công việc..."
                className="w-full bg-transparent border-none outline-none px-3 py-3 text-gray-800 placeholder-gray-400 font-medium"
             />
          </div>
          
          <button 
            onClick={handleSearch}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-8 py-4 rounded-full transition-all transform active:scale-95 shadow-lg"
          >
            TÌM KIẾM
          </button>
        </div>

        {/* 3. Các bộ lọc & Tags gợi ý */}
        <div className="flex flex-wrap gap-4 mt-6">
          {/* Dropdown Địa điểm */}
          <div className="relative group">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full px-6 py-1.5 text-sm cursor-pointer outline-none appearance-none pr-10 backdrop-blur-md transition-all"
            >
              {provinces.map((p, i) => <option key={i} value={p} className="text-gray-900">{p}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          {/* Dropdown Lương */}
          <div className="relative">
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full px-6 py-1.5 text-sm cursor-pointer outline-none appearance-none pr-10 backdrop-blur-md transition-all"
            >
              {salaryRanges.map((r, i) => <option key={i} value={r.value} className="text-gray-900">{r.label}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        {/* 4. Trending Tags */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-gray-300 text-sm font-medium">Từ khóa phổ biến:</span>
          {trendingTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => setKeyword(tag)}
              className="text-xs bg-white/5 hover:bg-white/20 border border-white/10 text-gray-200 px-3 py-1.5 rounded-md transition-all"
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