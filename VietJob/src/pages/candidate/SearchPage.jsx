import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';
import BannerSearch from '../../components/common/Candidate_c/Banner_search';
import { Ban, Clock, DollarSign, MapPin , Building, Briefcase} from 'lucide-react';

const salaryRanges = [
  { label: "Tất cả mức lương", value: "all" },
  { label: "Dưới 10 triệu", value: "under10" },
  { label: "10 - 20 triệu", value: "10-20" },
  { label: "20 - 50 triệu", value: "20-50" },
  { label: "Trên 50 triệu", value: "50+" },
];

const jobTypes = [
  { label: "Tất cả loại hình", value: "all" },
  { label: "Toàn thời gian", value: "full-time" },
  { label: "Bán thời gian", value: "part-time" },
  { label: "Thực tập", value: "internship" },
  { label: "Hợp đồng", value: "contract" },
];

const provinces = [
  "Tất cả các địa điểm", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng",
  "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Huế", "Nha Trang"
];

// Format lương
const formatSalary = (salary) => {
  if (!salary) return "Thỏa thuận";
  if (salary >= 1000000) return `${(salary / 1000000).toFixed(0)} triệu`;
  return salary.toLocaleString('vi-VN') + ' đ';
};


// Badge loại hình
const JobTypeBadge = ({ type }) => {
  const map = {
    'full-time': { label: 'Toàn thời gian', color: 'bg-green-50 text-green-600 border-green-100' },
    'part-time': { label: 'Bán thời gian', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    'internship': { label: 'Thực tập', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    'contract': { label: 'Hợp đồng', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  };
  const info = map[type] || { label: type, color: 'bg-gray-50 text-gray-500 border-gray-100' };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${info.color}`}>
      {info.label}
    </span>
  );
};

// Card 1 job
const JobResultCard = ({ job }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/job-detail/${job.JobID}`}
      className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex gap-4"
    >
      {/* Logo */}
      <div className="w-14 h-14 shrink-0 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center overflow-hidden p-1.5">
        {!imgError && job.LogoURL ? (
          <img src={job.LogoURL} alt={job.CompanyName} className="w-full h-full object-contain" onError={() => setImgError(true)} />
        ) : (
          <div className="text-center">
            <div className="text-[9px] font-bold text-sky-500">Viet</div>
            <div className="text-[9px] font-bold text-gray-400">Jobs</div>
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-sky-600 transition-colors line-clamp-1">
              {job.JobTitle}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">{job.CompanyName}</p>
          </div>
          {Number(job.IsHot) === 1 && (
            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-500 border border-red-100">
              HOT
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {/* Địa điểm */}
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.Location || 'Chưa cập nhật'}
          </span>

          {/* Lương */}
          <span className="flex items-center gap-1 text-xs font-semibold text-sky-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.SalaryRange || "Thỏa thuận"}
          </span>

          {/* Loại hình */}
          {job.JobType && <JobTypeBadge type={job.JobType} />}
        </div>

        {/* Skills */}
        {job.Skills && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.Skills.split(',').slice(0, 4).map((skill, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 bg-sky-50 text-sky-600 rounded border border-sky-100">
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

// ===== TRANG CHÍNH =====
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
    const [applied, setApplied] = useState(false);

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

  useEffect(() => {
    if (jobs.length > 0) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);


  // Áp dụng bộ lọc → cập nhật URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location !== 'Tất cả các địa điểm') params.set('location', location);
    if (salary !== 'all') params.set('salary', salary);
    if (jobType !== 'all') params.set('jobType', jobType);
    setSearchParams(params);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') applyFilters();
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('Tất cả các địa điểm');
    setSalary('all');
    setJobType('all');
    setSearchParams(new URLSearchParams());
  };

  const handleApply = () => {
    const token = localStorage.getItem("user");
    if (token) {
      setApplied(true); 
      navigate("/candidate/ApplyJob", { 
        state: { 
        jobId: selectedJob.JobID,          
        jobTitle: selectedJob.JobTitle,    
        companyName: selectedJob.CompanyName,
        jobLocation: selectedJob.Location,
        jobType: selectedJob.JobType,
      } 
    });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <BannerSearch />


      {/* Kết quả */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tiêu đề kết quả */}
        {!loading && !error && (
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600 text-xl">
              Tìm thấy <span className="font-bold text-gray-800">{jobs.length}</span> việc làm
              {searchParams.get('keyword') && (
                <> cho <span className="font-bold text-sky-600">"{searchParams.get('keyword')}"</span></>
              )}
            </p>
          </div>
        )}

        
      
        <div className="max-w-7xl mx-auto px-4 pb-6">

            {loading ? (

              <div className="flex justify-center py-32">
                <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
              </div>

            ) : error ? (

              <div className="bg-white rounded-2xl p-10 text-center">
                <p className="text-red-500 font-medium">{error}</p>

                <button
                  onClick={applyFilters}
                  className="mt-4 bg-sky-600 text-white px-6 py-2 rounded-lg"
                >
                  Thử lại
                </button>
              </div>

            ) : jobs.length === 0 ? (

              <div className="bg-white rounded-2xl p-16 text-center">
                <div className="text-6xl mb-3">🔍</div>
                <p className="text-xl font-semibold text-gray-700">
                  Không tìm thấy việc làm
                </p>
              </div>

            ) : (

              <div className="grid grid-cols-12 gap-5">

                {/* LEFT JOB LIST */}
                <div className="col-span-5 flex flex-col gap-4">

                  {jobs.map((job, index) => (

                    <div
                      key={job.JobID}
                      onClick={() => setSelectedJob(job)}
                      className={`
                        bg-[#fffaf5]
                        rounded-2xl
                        border
                        cursor-pointer
                        transition-all
                        overflow-hidden
                        hover:shadow-md
                        ${
                          selectedJob?.JobID === job.JobID
                            ? "border-sky-600"
                            : "border-sky-200"
                        }
                      `}
                    >

                      {/* TOP */}
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-gray-400">
                            3 giờ trước
                          </p>
                          <div className="bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                            🔥 NỔI BẬT
                          </div>
                        </div>

                        <h2 className="text-[24px] font-bold mt-3 leading-snug">
                          {job.JobTitle}
                        </h2>

                        <div className="flex items-center gap-4">
                          <img
                            src={job.LogoURL}
                            alt="Logo"
                            className="w-16 h-16 object-contain border border-gray-200 rounded-md bg-white p-1"
                          />
                          <div>
                            <p className="font-semibold text-gray-700 text-lg uppercase tracking-wide">
                              {job.CompanyName}
                            </p>
                            <div className="flex items-center gap-1 text-green-600 font-bold text-lg mt-1">
                              <span className="text-xl">$</span>
                              <span>{job.SalaryRange || "You'll love it"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 mt-5 pt-4">
                          {/* Chuyên môn / Cấp bậc */}
                          <div className="flex items-center gap-2 text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="underline decoration-dotted cursor-help">{job.JobLevel}</span>
                          </div>

                          {/* Địa điểm */}
                          <div className="flex items-center gap-2 text-gray-600 text-[15px] mb-4">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>Tại văn phòng • {job.Location}</span>
                          </div>

                          {/* Kỹ năng (Tags) */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {job.Skills ? (
                              (() => {
                                // Chuyển chuỗi "UI/UX, Figma" thành mảng ["UI/UX", "Figma"]
                                const skillsArray = typeof job.Skills === 'string' 
                                  ? job.Skills.split(',').map(s => s.trim()) 
                                  : job.Skills;

                                if (skillsArray.length > 0) {
                                  return (
                                    <>
                                      {skillsArray.slice(0, 5).map((skill, index) => (
                                        <span
                                          key={index}
                                          className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-600 hover:border-gray-800 cursor-pointer"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                      {skillsArray.length > 5 && (
                                        <span className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-600">
                                          +{skillsArray.length - 5}
                                        </span>
                                      )}
                                    </>
                                  );
                                }
                                return <span className="text-gray-400 text-sm">Không có kỹ năng</span>;
                              })()
                            ) : (
                              <span className="text-gray-400 text-sm">Không có kỹ năng</span>
                            )}
                          </div>
                          
                          {/* Danh sách quyền lợi */}                     
                          <div className="flex flex-col gap-[10px]">
                                      {job?.Benefits ? (
                                          job.Benefits.split('•').map((item, i) => (
                                              item.trim() && ( 
                                                  <div key={i} className="flex gap-[12px] items-start">
                                                    <svg 
                                                        className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                      <span className="text-[14px] text-gray-700 font-medium leading-[1.6]">
                                                          {item.trim()}
                                                      </span>
                                                  </div>
                                              )
                                          ))
                                      ) : (
                                          <div className="text-[13.5px] text-gray-400 italic">
                                              Chưa có thông tin phúc lợi cụ thể.
                                          </div>
                                      )}
                              </div>
                          </div>
                        
                      </div>

                        {/* TAGS */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.Tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    
                  ))}

                </div>

                {/* RIGHT DETAIL */}
                <div className="col-span-7 ">
                    <div className="bg-white rounded-2xl p-6 sticky top-5 border border-gray-200">
                    {selectedJob && (
                      <>
                        <div className="flex gap-5">
                          <img
                            src={selectedJob.LogoURL}
                            alt=""
                            className="w-24 h-24 object-contain border rounded-xl"
                          />
                          <div className="flex-1">
                            <h1 className="text-3xl font-bold leading-snug">
                              {selectedJob.JobTitle}
                            </h1>
                            <p className="mt-3 text-lg font-medium">
                              {selectedJob.CompanyName}
                            </p>
                            <div className="flex items-center gap-1 text-green-600 font-semibold mt-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{selectedJob.SalaryRange}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                          <button className="flex-1 bg-sky-600 hover:bg-sky-700 text-white py-4 rounded-lg font-bold text-lg" onClick={handleApply}>
                            Ứng tuyển
                          </button>
                          <button className="w-14 h-14 border rounded-xl text-2xl">
                            ♡
                          </button>
                        </div>

                        {/* Info */}
                        <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                          <div className="border-t mt-6 pt-5 space-y-3 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {selectedJob.Location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              Tại văn phòng
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              3 giờ trước
                            </p>
                          </div>

                          {/* Skills */}
                          <div className="border-t mt-6 pt-5 space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-700 w-24">Kỹ năng:</span>
                              <div className="flex flex-wrap gap-2">
                                {selectedJob.Skills?.split(',').map((s, i) => (
                                  <span key={i} className="border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-xs">
                                    {s.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-700 w-24">Cấp bậc:</span>
                              <span className="border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-xs">
                                {selectedJob.JobLevel}
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="border-t mt-6 pt-5">
                            <h3 className="font-bold text-lg mb-4">Mô tả công việc</h3>
                            <div className="text-gray-700 leading-8 text-sm">
                              {selectedJob.Description}
                            </div>
                          </div>

                          {/* Requirements */}
                          <div className="border-t mt-6 pt-5">
                            <h3 className="font-bold text-lg mb-4">Yêu cầu công việc</h3>
                            <div className="flex flex-col gap-3">
                              {selectedJob.Requirements ? (
                                selectedJob.Requirements
                                  .split('•')
                                  .filter(item => item.trim())
                                  .map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span>{item.trim()}</span>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-gray-400 italic text-sm">Chưa có thông tin yêu cầu.</p>
                              )}
                            </div>
                          </div>

                          {/* Benefits */}
                          <div className="border-t mt-6 pt-5">
                            <h3 className="font-bold text-lg mb-4">Phúc lợi dành cho bạn</h3>
                            <div className="flex flex-col gap-3">
                              {selectedJob.Benefits ? (
                                selectedJob.Benefits
                                  .split('•')
                                  .filter(item => item.trim())
                                  .map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span>{item.trim()}</span>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-gray-400 italic text-sm">Chưa có thông tin phúc lợi.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  </div>
                  </div>
                  )}
                </div>
            </div>
            </div>
        );
      }

export default SearchPage;