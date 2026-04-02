import React, { useState } from "react";

const JobCard = ({
  logoUrl,
  companyName,
  description,
  skills = [],
  jobCount = 0,
  highlight, // "hot" | "new"
}) => {
  const [imgError, setImgError] = useState(false);

  return (

    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
          {!imgError ? (
            <img
              src={logoUrl}
              alt=""
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-xs text-gray-400">Logo</span>
          )}
        </div>

        {highlight && (
          <span className="text-[10px] px-2 py-1 bg-green-100 text-green-600 rounded-full">
            {highlight === "hot" ? "ĐANG TUYỂN MẠNH" : "NỔI BẬT"}
          </span>
        )}
      </div>

      {/* Info */}
      <h3 className="font-semibold text-sm text-gray-900 mb-1">
        {companyName}
      </h3>

      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
        {description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Button */}
      <button className="w-full bg-gray-100 hover:bg-gray-200 text-xs py-2 rounded-md text-[#3BA3F2] font-medium">
        Xem {jobCount} Việc làm
      </button>
    </div>
  );
};

export default JobCard;