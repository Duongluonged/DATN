import React from 'react';

const Stats = () => {
  const statData = [
    { number: "2,400+", label: "VIỆC LÀM MỚI" },
    { number: "850+", label: "DOANH NGHIỆP" },
    { number: "15k+", label: "NGƯỜI DÙNG NGÀY" },
    { number: "$4.5k", label: "LƯƠNG TB" },
  ];

  return (
    <section className="w-full bg-[#f0f2f5] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {statData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Con số nổi bật màu xanh */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#3BA3F2] mb-2 tracking-tight">
                {stat.number}
              </h2>
              {/* Chữ mô tả nhỏ phía dưới */}
              <p className="text-[11px] md:text-xs font-bold text-gray-500 tracking-widest uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;