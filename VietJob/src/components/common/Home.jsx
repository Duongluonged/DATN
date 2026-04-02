import React from 'react';
import JobCard from './JobCard';


const mockJobs = [
  {
    id: 1,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 2,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", // Thay bằng logo chữ B vàng
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 3,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 4,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Lazada_Logo.png",
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 5,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 6,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 7,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg", // Thay bằng logo tròn xanh
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 8,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg",
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  },
  {
    id: 9,
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Viettel_logo_2021.svg",
    companyName: "ANDPAD VietNam Co., Ltd",
    skills: ["Ruby", "Golang", "QA QC", "MySQL", "AWS"],
    languages: ["Japanese"],
    location: "TP Hồ Chí Minh - Hà Nội",
    jobCount: 5
  }
];

const Home = () => {
  return (
    
    <div className="bg-gray-50 flex justify-left w-full">
       <div className="max-w-5xl mx-auto px-4">

        {/* 🔥 HEADER */}
        <div className="flex justify-between items-left mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Nhà Tuyển Dụng Hàng Đầu
            </h2>
            <p className="text-sm text-gray-500">
              Đồng hành cùng những công ty hàng đầu
            </p>
          </div>

          <button className="text-blue-500 text-sm hover:underline">
            Xem tất cả công ty →
          </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
        {mockJobs.map((job) => (
          <JobCard
            key={job.id}
            logoUrl={job.logoUrl}
            companyName={job.companyName}
            skills={job.skills}
            languages={job.languages}
            location={job.location}
            jobCount={job.jobCount} 
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default Home;