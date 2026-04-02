import React, { useState } from 'react';

// Danh sách 63 tỉnh thành Việt Nam
const provinces = [
  "Tất cả các địa điểm",
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh",
  "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

// Mảng danh sách mức lương (Tách rõ Label và Value)
const salaryRanges = [
  { label: "Mức lương (Tất cả)", value: "all" },
  { label: "Dưới 10 triệu", value: "0-10" },
  { label: "10 - 20 triệu", value: "10-20" },
  { label: "20 - 50 triệu", value: "20-50" },
  { label: "Trên 50 triệu", value: "50-plus" },
  { label: "Thỏa thuận", value: "negotiable" }
];

function Banner() {
  // State lưu trữ địa điểm được chọn
  const [selectedLocation, setSelectedLocation] = useState(provinces[0]);
  const [selectedSalary, setSelectedSalary] = useState(salaryRanges[0]);

  return (
    // Phần nền Gradient từ trái (màu xám đậm) sang phải (màu xanh dương)
    <section className="w-full bg-gradient-to-r from-neutral-800 to-sky-500 py-16 px-4">
      
      {/* Container giới hạn chiều rộng */}
      <div className="max-w-5xl mx-auto">
        
        {/* 1. Tiêu đề chính */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-wide whitespace-nowrap">
            "Bứt phá sự nghiệp với hàng ngàn việc làm IT chất lượng cao"
        </h1>

        {/* 2. Thanh tìm kiếm chính */}
        <div className="flex items-center bg-white rounded-full p-1 max-w-4xl shadow-md">
          <input
            type="text"
            placeholder="Laravel"
            className="flex-1 bg-transparent border-none outline-none px-5 py-2 text-gray-800 placeholder-gray-500"
          />
          {/* Nút tìm kiếm */}
          <button className="bg-[#4b6bfb] hover:bg-blue-600 text-white rounded-full p-2.5 transition-colors mr-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* 3. Các bộ lọc (Dropdowns) */}
        <div className="flex flex-wrap gap-4 mt-4 max-w-4xl">
          
          {/* --- ĐÃ SỬA: Dropdown 1: Địa điểm --- */}
          <div className="relative w-[220px]">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-white rounded-full px-4 py-2.5 text-sm text-gray-700 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors appearance-none outline-none pr-10"
            >
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
            {/* Icon mũi tên (đặt absolute đè lên select, thêm pointer-events-none để không chặn click) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {/* ------------------------------------- */}

          {/* Dropdown 2: Mức lương */}
          <div className="relative w-[220px]">
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="w-full bg-white rounded-full px-4 py-2.5 text-sm text-gray-700 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors appearance-none outline-none pr-10"
            >
              {salaryRanges.map((range, index) => (
                <option key={index} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

           {/* Icon mũi tên (đặt absolute đè lên select, thêm pointer-events-none để không chặn click) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {/* ------------------------------------- */}

          {/* Dropdown 3: Công việc */}
          <div className="bg-white rounded-full px-4 py-2.5 flex items-center justify-between w-[220px] cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-700">Tất cả công việc</span>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
        </div>

      </div>
    </section>
  );
};

export default Banner;