# 🎯 Hướng dẫn: Thay đổi nút Đăng nhập/Đăng xuất thành Avatar

## 📋 Tóm tắt thay đổi

Khi candidate **đăng nhập thành công**, thay vì hiển thị 2 nút "Đăng Nhập" và "Đăng Ký", hệ thống sẽ:
- Hiển thị **avatar** (vòng tròn xanh với chữ cái đầu của username)
- Hiển thị **dropdown menu** với thông tin user (username, email) khi click vào avatar
- Có tùy chọn **Đăng xuất** trong dropdown

---

## 🔧 Các file đã được sửa

### 1️⃣ **Login.jsx** 
**Vị trí:** `src/pages/Auth/Login.jsx`

**Thay đổi:**
- Lưu thêm dữ liệu: `email`, `avatar` 
- Lưu dữ liệu vào `localStorage` dưới dạng JSON:
  ```json
  {
    "token": "xxx...",
    "username": "john_doe",
    "email": "john@example.com",
    "roles": ["Candidate"],
    "avatar": "J"
  }
  ```
- Hỗ trợ tương thích với localStorage keys cũ (`token`, `username`)

### 2️⃣ **Navbar.jsx**
**Vị trí:** `src/components/common/Navbar.jsx`

**Thay đổi:**
- ✅ Đọc dữ liệu từ `localStorage.getItem("user")`
- ✅ Parse JSON và lưu vào state `user`
- ✅ Hiển thị avatar trong Navbar khi đã đăng nhập
- ✅ Dropdown menu hiệu ứng hover, hiệu ứng scale
- ✅ Hiển thị avatar + username + email trong dropdown header
- ✅ Hỗ trợ fallback nếu localStorage data bị lỗi
- ✅ Cập nhật hàm logout để xóa tất cả keys từ localStorage

---

## 🎨 Giao diện UI

### Khi chưa đăng nhập:
```
[Đăng Nhập] [Đăng Ký]
```

### Khi đã đăng nhập:
```
username     [J]  ← Hover để hiển thị dropdown
```

### Dropdown menu:
```
┌─────────────────────────┐
│  [J]  username          │
│       email@example.com │
├─────────────────────────┤
│ 📊 Tổng quan           │
│ 📄 Hồ sơ đính kèm      │
│ 👤 Hồ sơ              │
│ 💼 Việc làm của tôi    │
│ 📧 Lời mời công việc   │
│ 🔔 Thông báo           │
│ ⚙️  Cài đặt            │
├─────────────────────────┤
│ 🚪 Đăng xuất           │
└─────────────────────────┘
```

---

## 🔄 Quy trình hoạt động

1. **Candidate nhập email & password** → Click "Đăng Nhập"
2. **Backend trả về:**
   ```json
   {
     "token": "jwt_token...",
     "username": "john_doe",
     "email": "john@example.com",
     "roles": ["Candidate"],
     "avatar": "J"
   }
   ```
3. **Frontend (Login.jsx):**
   - Lưu vào `localStorage`
   - Chuyển hướng theo role: Candidate → `/candidate/Tong_quan`
4. **Navbar.jsx tự động:**
   - Phát hiện user đã đăng nhập (từ `location` thay đổi)
   - Cập nhật state `user` từ localStorage
   - Ẩn nút "Đăng Nhập/Ký", hiển thị avatar
5. **User click avatar:**
   - Dropdown menu hiện lên
   - Hiển thị thông tin user + menu
6. **User click "Đăng xuất":**
   - Xóa toàn bộ localStorage
   - Về trang chủ công khai

---

## 📦 Backend API Response

Backend cần trả về đủ dữ liệu sau khi login thành công:

```javascript
POST /api/login
Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["Candidate"],
  "avatar": "J"  // Optional - nếu backend không có, frontend sẽ tính từ username
}
```

---

## ✅ Kiểm tra hoạt động

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test đăng nhập:**
   - Mở browser: http://localhost:5173/login
   - Nhập email & password
   - Kiểm tra:
     - ✅ Navbar hiển thị avatar
     - ✅ Tên username hiển thị bên cạnh avatar
     - ✅ Click avatar → Dropdown hiện lên
     - ✅ Dropdown hiển thị username + email
     - ✅ Click "Đăng xuất" → Quay về trang chủ

3. **Test đăng xuất:**
   - Click avatar
   - Click "Đăng xuất"
   - Navbar quay về 2 nút "Đăng Nhập" & "Đăng Ký"

---

## 🐛 Troubleshooting

### ❌ Avatar không hiển thị
**Nguyên nhân:** localStorage không có dữ liệu
**Giải pháp:** 
- Xóa localStorage: `localStorage.clear()`
- Đăng nhập lại

### ❌ Email không hiển thị trong dropdown
**Nguyên nhân:** Backend không trả về `email`
**Giải pháp:** Chắc chắn API login trả về `email` field
```json
{
  "token": "...",
  "username": "...",
  "email": "...",  // ← Bắt buộc
  "roles": [...]
}
```

### ❌ Dropdown không đóng khi click ra ngoài
**Kiểm tra:** `useClickOutside` hook đã được setup đúng chưa
```javascript
useEffect(() => {
  const handleClickOutside = (e) => {
    if (showDropdown && !e.target.closest('.dropdown-container')) {
      setShowDropdown(false);
    }
  };
  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, [showDropdown]);
```

---

## 🎯 File paths

| File | Đường dẫn |
|------|----------|
| Login Page | `src/pages/Auth/Login.jsx` |
| Navbar | `src/components/common/Navbar.jsx` |
| App | `src/App.jsx` |

---

## 📝 Ghi chú quan trọng

- ⚠️ **localStorage không an toàn cho thông tin nhạy cảm** → Nên sử dụng httpOnly cookies
- ⚠️ **Avatar có thể lấy từ Backend hoặc tính từ username** → Hiện tại lấy chữ cái đầu
- ⚠️ **Token JWT cần được xác minh** → Backend nên validate trước khi trả về
