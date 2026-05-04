import React, { useState } from "react";
import { Link } from "react-router-dom";

const JobCard = ({
  id,
  logoUrl,
  companyName,
  description,
  skills = [],
  jobCount = 0,
  highlight,
}) => {
  const [imgError, setImgError] = useState(false);
  return (
    <Link 
      to={id ? `/job-detail/${id}` : "#"}
      className="group bg-white rounded-xl border border-gray-100 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
    > 
      {/* Logo & Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-white border border-gray-100 flex items-center justify-center rounded-lg shadow-sm overflow-hidden p-2">
          {!imgError && logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center">
               <span className="text-[10px] text-blue-500 font-bold uppercase">Viet</span>
               <span className="text-[10px] text-gray-400 font-bold uppercase">Jobs</span>
            </div>
          )}
        </div>

        {highlight && (
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase ${
            highlight === "hot" 
              ? "bg-red-50 text-red-500 border border-red-100" 
              : "bg-orange-50 text-orange-500 border border-orange-100"
          }`}>
            {highlight === "hot" ? "Hot New" : "Nổi bật"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-bold text-base text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {companyName}
        </h3>
        <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded font-medium border border-blue-100">
              {skill}
            </span>
          ))}
          {skills.length > 3 && <span className="text-[10px] px-1 py-1 text-gray-400">+{skills.length - 3}</span>}
        </div>
      </div>

      <div className="w-full bg-gray-100 border border-blue-100 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white text-blue-600 text-xs py-2.5 rounded-lg font-bold text-center transition-all duration-200 shadow-sm">
        Xem {jobCount} Việc làm
      </div>
    </Link>
  );
};
  
export default JobCard;