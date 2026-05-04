import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../components/common/JobCard";

const TopCompaniesSection = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Gọi đến API Node.js của bạn
        const response = await axios.get("http://localhost:5000/api/top-companies");
        setCompanies(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu công ty:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8">Nhà Tuyển Dụng Hàng Đầu</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <JobCard
              key={company.CompanyID}
              id={company.CompanyID} // ID từ DB
              logoUrl={company.LogoURL} // Link ảnh từ DB
              companyName={company.CompanyName} // Tên từ DB
              description={company.Description} // Mô tả từ DB
              // Giả sử Backend chưa có JobCount và Skills, ta để mặc định hoặc bổ sung sau
              jobCount={company.JobCount || 0} 
              skills={company.Skills ? company.Skills.split(',') : []}
              highlight={company.IsHot ? "hot" : null}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompaniesSection;