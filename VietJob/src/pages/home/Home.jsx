import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../../components/common/JobCard";

const TopCompaniesSection = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/companies/top-companies");
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
              id={company.CompanyID}
              companyName={company.CompanyName}
              logoUrl={company.LogoURL}
              description={company.Description}
              skills={company.CompanySkills} 
              JobCount={company.JobCount}
              highlight={company.IsHot}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompaniesSection;