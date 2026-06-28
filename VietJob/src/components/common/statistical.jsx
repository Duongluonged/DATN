import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatNumber = (n) => {
  if (!n || n === 0) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return n.toString();
};

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('Lỗi lấy stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const statData = [
    {
      number: stats ? formatNumber(stats.totalJobs) + '+' : '...',
      label: 'VIỆC LÀM MỚI',
    },
    {
      number: stats ? formatNumber(stats.totalCompanies) + '+' : '...',
      label: 'DOANH NGHIỆP',
    },
    {
      number: stats ? formatNumber(stats.totalUsers) + '+' : '...',
      label: 'NGƯỜI DÙNG',
    },
    {
      number: stats ? formatNumber(stats.totalCourses) + '+' : '...',
      label: 'KHOÁ HỌC',
    },
  ];


  return (
    <section className="w-full bg-[#f0f2f5] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {statData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <h2 className={`text-3xl md:text-4xl font-extrabold text-[#3BA3F2] mb-2 tracking-tight transition-all duration-500 ${loading ? 'opacity-40 animate-pulse' : 'opacity-100'}`}>
                {stat.number}
              </h2>
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