import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AssessCompany() {
  const { id } = useParams(); // lấy companyId từ URL: /company/:id/review
  const [company, setCompany] = useState(null);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(0);
  const [overtime, setOvertime] = useState("");
  const [form, setForm] = useState({
    summary: "",
    overtimeReason: "",
    loveWorking: "",
    suggestion: "",
  });

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5000/api/companies/${id}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setCompany(data);
      })
      .catch(err => console.error("Lỗi lấy thông tin công ty:", err));
  }, [id]);

  const updateForm = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!rating) return alert("Vui lòng chọn đánh giá sao!");
    if (!form.summary.trim()) return alert("Vui lòng nhập tiêu đề đánh giá!");
    if (!overtime) return alert("Vui lòng chọn cảm nhận về chính sách làm thêm giờ!");

    try {
      await axios.post("http://localhost:5000/api/reviews", {
        companyId: id,
        rating,
        summary: form.summary,
        overtimePolicy: overtime,
        overtimeReason: form.overtimeReason,
        loveWorking: form.loveWorking,
        suggestion: form.suggestion,
      });
      alert("Gửi đánh giá thành công!");
    } catch (err) {
      console.error("Lỗi gửi đánh giá:", err);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
         {/* HEADER */}
            <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Quay lại
                </button>

            {/* Logo VietJob */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold text-blue-600">Viet</span>
                <span className="text-xl font-bold text-gray-800">Job</span>
            </div>

            {/* Placeholder để căn giữa logo */}
            <div className="w-16" />
            </div>
      <div className="max-w-5xl mx-auto flex gap-6 items-start">

        {/* LEFT FORM */}
        <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl p-6">
          <h1 className="text-xl font-semibold mb-2">Đánh giá {company?.CompanyName ?? "Đang tải..."}</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Chỉ mất 1 phút để hoàn thành biểu mẫu đánh giá này. Ý kiến của bạn sẽ rất hữu ích
            cho cộng đồng Developer đang tìm kiếm việc làm.
          </p>

          {/* Đánh giá sao */}
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2">
              Đánh giá tổng thể <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="text-3xl transition-colors"
                  style={{ color: star <= (hovered || rating) ? "#EF9F27" : "#d1d5db", background: "none", border: "none", cursor: "pointer" }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Tiêu đề */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tiêu đề đánh giá *"
              value={form.summary}
              onChange={updateForm("summary")}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Chính sách làm thêm giờ */}
          <div className="mb-6">
            <label className="text-sm font-medium block mb-3">
              Bạn cảm thấy thế nào về chính sách làm thêm giờ? <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2.5 mb-3">
              {["satisfied", "unsatisfied"].map((val) => (
                <label key={val} className="flex items-center gap-3 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="overtime"
                    value={val}
                    checked={overtime === val}
                    onChange={() => setOvertime(val)}
                    className="accent-blue-600"
                  />
                  {val === "satisfied" ? "Hài lòng" : "Không hài lòng"}
                </label>
              ))}
            </div>
            <textarea
              placeholder="Nhập lý do của bạn"
              rows={3}
              value={form.overtimeReason}
              onChange={updateForm("overtimeReason")}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">Giới hạn từ 50 đến 140 ký tự</p>
          </div>

          {/* Điều yêu thích */}
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2">
              Điều gì khiến bạn yêu thích khi làm việc ở đây? <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Chia sẻ trải nghiệm của bạn"
              rows={4}
              value={form.loveWorking}
              onChange={updateForm("loveWorking")}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">Giới hạn từ 50 đến 10000 ký tự</p>
          </div>

          {/* Đề xuất cải thiện */}
          <div className="mb-6">
            <label className="text-sm font-medium block mb-2">
              Đề xuất cải thiện <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Nhập đề xuất của bạn"
              rows={4}
              value={form.suggestion}
              onChange={updateForm("suggestion")}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 resize-y"
            />
            <p className="text-xs text-gray-400 mt-1">Giới hạn từ 50 đến 10000 ký tự</p>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            Gửi đánh giá
          </button>
        </div>

      </div>
    </div>
  );
}