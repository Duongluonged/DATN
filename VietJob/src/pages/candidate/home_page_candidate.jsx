import React from 'react';

const Home_candidate = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Phần chào hỏi */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Chào mừng Dương quay trở lại! 👋</h1>
        <p className="text-gray-600">Hôm nay có 25 công việc mới phù hợp với kỹ năng 3D Artist của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột trái: Danh sách việc làm */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Việc làm gợi ý</h2>
          {/* Dương map danh sách JobCard vào đây */}
          <div className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition">
             {/* Nội dung 1 cái Job */}
             <h3 className="font-bold text-blue-600">3D Game Artist (Senior)</h3>
             <p className="text-sm text-gray-500">Công ty VNG - Lương: $1500 - $2500</p>
          </div>
        </div>

        {/* Cột phải: Thông tin tóm tắt */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2">Hoàn thiện hồ sơ</h3>
            <p className="text-sm text-blue-600 mb-4">Hồ sơ của bạn mới đạt 60%. Thêm Portfolio để tăng 80% cơ hội trúng tuyển.</p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm">Cập nhật ngay</button>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold mb-4">Việc làm đã ứng tuyển</h3>
            <div className="text-center py-4 text-gray-400 text-sm">Bạn chưa ứng tuyển công việc nào.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home_candidate;