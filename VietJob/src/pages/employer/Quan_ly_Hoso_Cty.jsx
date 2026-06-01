import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react";
import Sidebar_empl from "../../components/common/Employer_c/Sidebar_empl";
import Topbar_empl from "../../components/common/Employer_c/Topbar_empl";
import axios from "axios";

const API = "http://localhost:5000/api";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) return user.id;
    const token = user?.token;
    if (token) return JSON.parse(atob(token.split('.')[1]))?.id ?? null;
    return null;
  } catch { return null; }
};

export default function Quan_ly_HoSo_Cty() {
  const userId = getUserId();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Dung lượng ảnh phải nhỏ hơn 5MB", "error");
      return;
    }

    try {
      setLogoUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result;
        try {
          const res = await axios.post(`${API}/upload`, {
            base64: base64data,
            fileName: file.name
          });
          if (res.data && res.data.url) {
            handleInputChange("logoURL", res.data.url);
            showToast("Tải ảnh logo lên thành công!", "success");
          }
        } catch (uploadErr) {
          console.error(uploadErr);
          showToast("Tải ảnh lên máy chủ thất bại.", "error");
        } finally {
          setLogoUploading(false);
        }
      };
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra khi đọc tệp tin.", "error");
      setLogoUploading(false);
    }
  };

  const [photos, setPhotos] = useState([
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200"
  ]);
  const [photoUploading, setPhotoUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`Bỏ qua file "${file.name}" vì dung lượng vượt quá 5MB.`, "error");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      setPhotoUploading(true);

      const readAsBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve({ base64: reader.result, fileName: file.name });
          reader.onerror = (err) => reject(err);
        });
      };

      const base64Files = await Promise.all(validFiles.map(readAsBase64));

      const uploadPromises = base64Files.map(async (fileObj) => {
        try {
          const res = await axios.post(`${API}/upload`, {
            base64: fileObj.base64,
            fileName: fileObj.fileName
          });
          return res.data?.url;
        } catch (uploadErr) {
          console.error(`Lỗi tải file ${fileObj.fileName}:`, uploadErr);
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const successfulUrls = uploadedUrls.filter(Boolean);

      if (successfulUrls.length > 0) {
        setPhotos(prev => [...prev, ...successfulUrls]);
        showToast(`Tải lên thành công ${successfulUrls.length} ảnh văn phòng!`, "success");
      } else {
        showToast("Tải ảnh lên máy chủ thất bại.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Có lỗi xảy ra khi xử lý và tải ảnh lên.", "error");
    } finally {
      setPhotoUploading(false);
      e.target.value = "";
    }
  };

  const [form, setForm] = useState({
    companyName: "",
    logoURL: "",
    description: "",
    websiteURL: "",
    location: "",
    industry: "",
    size: "",
    country: "",
    workingTime: "",
    averageSalary: "",
    longDescription: "",
    email: "",
    representativeName: "",
    hotline: ""
  });

  const [benefits, setBenefits] = useState([
    "Bảo hiểm sức khỏe",
    "Lương tháng 13",
    "Du lịch thường niên",
    "Làm việc hybrid",
  ]);
  const [newBenefit, setNewBenefit] = useState("");

  const fetchCompanyProfile = async () => {
    if (!userId) {
      setLoading(false);
      showToast("Vui lòng đăng nhập để thực hiện quản lý hồ sơ", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/companies/employer/${userId}`);
      if (res.data) {
        const d = res.data;
        setForm({
          companyName: d.CompanyName || "",
          logoURL: d.LogoURL || "",
          description: d.Description || "",
          websiteURL: d.WebsiteURL || "",
          location: d.Location || "",
          industry: d.Industry || "",
          size: d.Size || "",
          country: d.Country || "",
          workingTime: d.WorkingTime || "",
          averageSalary: d.AverageSalary || "",
          longDescription: d.LongDescription || "",
          email: d.EmployerEmail || "",
          phone: d.EmployerPhone || "",
          representativeName: d.RepresentativeName || "",
          hotline: d.Hotline || ""
        });

        // Parse benefits if present in database (stored as JSON array or text)
        if (d.Benefits) {
          try {
            const parsed = JSON.parse(d.Benefits);
            if (Array.isArray(parsed)) setBenefits(parsed);
          } catch {
            // Fallback for simple comma separated list
            setBenefits(d.Benefits.split(",").map(b => b.trim()));
          }
        }

        // Parse office photos if present
        if (d.OfficePhotos) {
          try {
            const parsed = JSON.parse(d.OfficePhotos);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setPhotos(parsed);
            }
          } catch (photoErr) {
            console.error(photoErr);
          }
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Lỗi tải thông tin công ty.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyProfile();
  }, [userId]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!userId) return;
    if (!form.companyName.trim()) {
      showToast("Tên công ty không được để trống!", "error");
      return;
    }
    if (!form.email.trim()) {
      showToast("Email liên hệ không được để trống!", "error");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        benefits: JSON.stringify(benefits), // Save benefits as JSON string
        officePhotos: JSON.stringify(photos) // Save office photos as JSON string
      };

      await axios.put(`${API}/companies/employer/${userId}`, payload);
      showToast("Cập nhật thông tin công ty thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Lỗi lưu thông tin.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (indexToRemove) => {
    setBenefits(benefits.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen flex font-sans">
      <Sidebar_empl />

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        <Topbar_empl />

        {/* BODY */}
        <div className="p-8">

          {/* TOAST NOTIFICATION */}
          {toast && (
            <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border transition-all duration-300 ${toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
              }`}>
              {toast.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-semibold">{toast.msg}</span>
            </div>
          )}

          {/* HEADER ROW */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827] m-0">Hồ sơ công ty</h1>
              <p className="text-sm text-gray-500 mt-1">Quản lý và hiển thị thông tin doanh nghiệp trực quan trên VietJob.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchCompanyProfile}
                disabled={loading || saving}
                className="px-5 h-[46px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-[14px] text-gray-700 font-medium transition cursor-pointer"
              >
                Hủy bỏ thay đổi
              </button>
              <button
                onClick={handleSave}
                disabled={loading || saving}
                className="bg-blue-600 hover:bg-blue-700 text-white h-[46px] px-6 rounded-xl text-[14px] font-semibold flex items-center gap-2 shadow-sm transition disabled:opacity-70 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-[28px] p-20 border border-[#edf1f7] flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 size={40} className="text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Đang tải thông tin hồ sơ công ty...</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* BASIC INFO */}
              <div className="bg-white rounded-[28px] p-7 border border-[#edf1f7]">
                <div className="border-b border-[#edf1f7] pb-5 mb-6">
                  <h2 className="font-bold text-lg text-[#111827]">Thông tin cơ bản</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Những thông tin chính hiển thị trên card công ty và trang chi tiết.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
                  {/* LOGO */}
                  <div className="border border-dashed border-gray-200 rounded-3xl h-[220px] bg-[#f8fafc] flex flex-col items-center justify-center p-4">
                    <input
                      type="file"
                      accept="image/*"
                      id="logo-upload-input"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />

                    <div
                      onClick={() => document.getElementById("logo-upload-input").click()}
                      className="cursor-pointer group flex flex-col items-center justify-center w-full h-full"
                    >
                      {logoUploading ? (
                        <div className="w-24 h-24 rounded-2xl bg-white shadow-sm border border-[#edf1f7] flex items-center justify-center">
                          <Loader2 size={30} className="text-blue-600 animate-spin" />
                        </div>
                      ) : form.logoURL ? (
                        <div className="relative w-28 h-28 rounded-2xl bg-white shadow-sm border border-[#edf1f7] flex items-center justify-center overflow-hidden transition-all group-hover:shadow-md">
                          <img src={form.logoURL} alt="Logo" className="w-full h-full object-contain p-2" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-xs text-white font-medium">Thay đổi logo</span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-white shadow-sm border border-[#edf1f7] flex items-center justify-center transition-all group-hover:border-blue-300">
                          <Building2 size={34} className="text-[#9ca3af] group-hover:text-blue-500 transition-colors" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById("logo-upload-input").click();
                        }}
                        className="mt-4 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Chọn ảnh từ máy
                      </button>
                    </div>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Tên công ty"
                      value={form.companyName}
                      onChange={(val) => handleInputChange("companyName", val)}
                    />

                    <Input
                      label="Người đại diện"
                      value={form.representativeName}
                      onChange={(val) => handleInputChange("representativeName", val)}
                    />

                    <Input
                      label="Email nhận hồ sơ"
                      value={form.email}
                      onChange={(val) => handleInputChange("email", val)}
                      icon={<Mail size={16} />}
                    />

                    <Input
                      label="Địa chỉ trụ sở chính"
                      value={form.location}
                      onChange={(val) => handleInputChange("location", val)}
                      icon={<MapPin size={16} />}
                    />

                    <Input
                      label="Website công ty"
                      value={form.websiteURL}
                      onChange={(val) => handleInputChange("websiteURL", val)}
                      icon={<Globe size={16} />}
                    />

                    <Input
                      label="Hotline công ty"
                      value={form.hotline}
                      onChange={(val) => handleInputChange("hotline", val)}
                      icon={<Phone size={16} />}
                    />
                  </div>
                </div>
              </div>

              {/* GALLERY SECTION */}
              <div className="bg-white rounded-[28px] p-7 border border-[#edf1f7]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-lg text-[#111827]">Hình ảnh văn hóa & văn phòng</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Giúp ứng viên hình dung chân thực về môi trường làm việc của bạn.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => document.getElementById("gallery-upload-input").click()}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition cursor-pointer"
                  >
                    Tải thêm ảnh
                  </button>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="gallery-upload-input"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative group rounded-[22px] h-[220px] overflow-hidden border border-[#edf1f7] shadow-sm bg-white">
                      <img
                        src={url}
                        alt={`Văn phòng ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Delete Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setPhotos(prev => prev.filter((_, i) => i !== idx))}
                          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-md cursor-pointer"
                          title="Xóa hình ảnh này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* UPLOADER TRIGGER BOX */}
                  {photoUploading ? (
                    <div className="border border-dashed border-blue-300 rounded-[22px] h-[220px] flex flex-col items-center justify-center bg-blue-50/30 p-4 text-center">
                      <Loader2 size={32} className="text-blue-600 animate-spin" />
                      <p className="text-sm text-blue-600 font-medium mt-3">Đang tải ảnh lên máy chủ...</p>
                    </div>
                  ) : (
                    <div
                      onClick={() => document.getElementById("gallery-upload-input").click()}
                      className="border border-dashed border-[#cbd5e1] hover:border-blue-400 hover:bg-blue-50/20 rounded-[22px] h-[220px] flex flex-col items-center justify-center bg-[#f8fafc] p-4 text-center cursor-pointer transition"
                    >
                      <ImagePlus className="text-[#94a3b8]" size={32} />
                      <p className="text-[14px] text-[#64748b] font-semibold mt-3">Thêm hình ảnh</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Tải tệp tin ảnh JPG, PNG từ thiết bị của bạn.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILED INFORMATION & SIDEBAR */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">

                {/* LEFT COL: EDITOR / TEXTAREA */}
                <div className="space-y-6">
                  {/* SHORT DESCRIPTION */}
                  <div className="bg-white rounded-[28px] p-6 border border-[#edf1f7]">
                    <h3 className="font-bold text-[17px] text-[#111827] mb-3">Mô tả ngắn doanh nghiệp</h3>
                    <p className="text-xs text-gray-400 mb-4">Mô tả ngắn gọn cốt lõi tầm nhìn của công ty (Hiển thị ngoài trang tìm kiếm).</p>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Chúng tôi là công ty công nghệ hàng đầu..."
                      className="w-full resize-none outline-none text-[14px] leading-7 text-[#4b5563] border border-gray-200 rounded-2xl p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>

                  {/* FULL INTRO */}
                  <div className="bg-white rounded-[28px] p-6 border border-[#edf1f7]">
                    <h3 className="font-bold text-[17px] text-[#111827] mb-3">Giới thiệu chi tiết công ty</h3>
                    <p className="text-xs text-gray-400 mb-4">Chia sẻ về lịch sử, sứ mệnh, giá trị cốt lõi và định hướng tương lai.</p>
                    <textarea
                      rows={8}
                      value={form.longDescription}
                      onChange={(e) => handleInputChange("longDescription", e.target.value)}
                      placeholder="Nhập giới thiệu chi tiết công ty..."
                      className="w-full resize-none outline-none text-[14px] leading-7 text-[#4b5563] border border-gray-200 rounded-2xl p-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                {/* RIGHT COL: BENEFITS & METADATA */}
                <div className="space-y-6">

                  {/* BENEFITS */}
                  <div className="bg-white rounded-[28px] p-6 border border-[#edf1f7]">
                    <h3 className="font-bold text-[17px] text-[#111827] mb-1">Phúc lợi công ty</h3>
                    <p className="text-xs text-gray-400 mb-4">Các đặc quyền và ưu đãi công ty cung cấp cho ứng viên.</p>

                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Thêm phúc lợi mới..."
                        className="flex-1 h-[42px] border border-gray-200 rounded-xl px-3 text-sm outline-none focus:border-blue-500"
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddBenefit(); }}
                      />
                      <button
                        onClick={handleAddBenefit}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 rounded-xl text-sm font-semibold transition"
                      >
                        Thêm
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                      {benefits.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-[#f8fafc] border border-gray-100 h-[48px] rounded-2xl px-4 flex items-center justify-between text-[14px] text-[#374151]"
                        >
                          <span className="font-medium">{item}</span>
                          <button
                            onClick={() => handleRemoveBenefit(idx)}
                            className="text-gray-400 hover:text-red-500 transition p-1"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* METADATA FORM FIELDS */}
                  <div className="bg-white rounded-[28px] p-6 border border-[#edf1f7] space-y-4">
                    <h3 className="font-bold text-[17px] text-[#111827] mb-1">Thông tin bổ sung</h3>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold mb-1 block">Lĩnh vực hoạt động</label>
                      <input
                        type="text"
                        value={form.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        placeholder="Phát triển phần mềm, Fintech..."
                        className="w-full h-[46px] bg-[#f8fafc] border border-[#edf1f7] rounded-xl px-4 text-sm text-[#111827] outline-none focus:bg-white focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold mb-1 block">Quy mô nhân sự</label>
                      <input
                        type="text"
                        value={form.size}
                        onChange={(e) => handleInputChange("size", e.target.value)}
                        placeholder="100 - 300 nhân viên"
                        className="w-full h-[46px] bg-[#f8fafc] border border-[#edf1f7] rounded-xl px-4 text-sm text-[#111827] outline-none focus:bg-white focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold mb-1 block">Quốc gia</label>
                      <input
                        type="text"
                        value={form.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="Việt Nam, Singapore..."
                        className="w-full h-[46px] bg-[#f8fafc] border border-[#edf1f7] rounded-xl px-4 text-sm text-[#111827] outline-none focus:bg-white focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold mb-1 block">Thời gian làm việc</label>
                      <input
                        type="text"
                        value={form.workingTime}
                        onChange={(e) => handleInputChange("workingTime", e.target.value)}
                        placeholder="Thứ 2 - Thứ 6 (8:30 - 17:30)"
                        className="w-full h-[46px] bg-[#f8fafc] border border-[#edf1f7] rounded-xl px-4 text-sm text-[#111827] outline-none focus:bg-white focus:border-blue-500 transition"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-semibold mb-1 block">Mức lương trung bình</label>
                      <input
                        type="text"
                        value={form.averageSalary}
                        onChange={(e) => handleInputChange("averageSalary", e.target.value)}
                        placeholder="1,500 - 3,500 USD"
                        className="w-full h-[46px] bg-[#f8fafc] border border-[#edf1f7] rounded-xl px-4 text-sm text-[#111827] outline-none focus:bg-white focus:border-blue-500 transition"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM ACTION FOOTER */}
              <div className="flex justify-end gap-3 bg-white rounded-2xl p-4 border border-[#edf1f7]">
                <button
                  onClick={fetchCompanyProfile}
                  disabled={loading || saving}
                  className="h-[46px] px-6 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-[14px] text-gray-700 font-semibold transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || saving}
                  className="h-[46px] px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-semibold flex items-center gap-2 shadow-sm transition disabled:opacity-70 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Lưu và Cập nhật
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function Input({ label, value, onChange, icon }) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-gray-600 mb-1.5 block">
        {label}
      </label>

      <div className="h-[52px] bg-[#f8fafc] border border-[#edf1f7] rounded-2xl px-4 flex items-center gap-3 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        {icon && <span className="text-[#94a3b8]">{icon}</span>}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Nhập ${label.toLowerCase()}`}
          className="bg-transparent outline-none w-full text-[14px] text-[#111827] font-medium"
        />
      </div>
    </div>
  );
}