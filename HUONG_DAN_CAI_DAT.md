# 📖 Hướng Dẫn Cài Đặt và Chạy Đồ Án VietJob

Tài liệu này hướng dẫn chi tiết cách thiết lập cơ sở dữ liệu, chạy mã nguồn Backend (Node.js/Express) và Frontend (React/Vite) cho hệ thống **VietJob**.

---

## 🛠️ Yêu cầu môi trường hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các phần mềm sau:
1. **Node.js** (Phiên bản v18 trở lên) & **npm** (đi kèm Node.js).
2. **Microsoft SQL Server** (2019 trở lên) & **SQL Server Management Studio (SSMS)**.
3. Một IDE lập trình: **Visual Studio Code (VS Code)**.

---

## 💾 1. Thiết lập Cơ sở dữ liệu (SQL Server)

Hệ thống sử dụng cơ sở dữ liệu Microsoft SQL Server với tên DB là `VietJob_DATN`. Bạn hãy làm theo các bước sau để khởi tạo:

### Bước 1: Khởi tạo database trống
1. Mở **SSMS** và kết nối vào Server của bạn (ví dụ: `localhost`).
2. Nhấp chuột phải vào mục **Databases** -> Chọn **New Database...**
3. Nhập tên database: `VietJob_DATN` và nhấn **OK**.
*(Hoặc chạy script trong file `Data/SQLFile1.sql` để tạo).*

### Bước 2: Chạy Script SQL khởi tạo bảng
Mở file script **`Data/SQLQuery1.sql`** bằng SSMS, nhấn **Execute** (hoặc phím **F5**) để chạy và khởi tạo toàn bộ cấu trúc cơ sở dữ liệu cùng các dữ liệu mẫu dùng thử.


---

## 🖥️ 2. Cấu hình & Chạy Backend (Node.js/Express)

Thư mục Backend nằm tại: `VietJob_njs/backend`

### Bước 1: Cấu hình môi trường kết nối database
Mở file cấu hình kết nối database tại: `VietJob_njs/backend/config/db.js`
Hệ thống hỗ trợ 2 chế độ đăng nhập kết nối database:

* **Chế độ mặc định (Tài khoản SQL Server):**
  Kiểm tra object `configWithAuth` tại dòng 19-28:
  ```javascript
  const configWithAuth = {
      user: "sa",          // Tên đăng nhập SQL Server của bạn (mặc định: sa)
      password: "123",     // Mật khẩu tài khoản (cập nhật lại mật khẩu của máy bạn)
      server: "localhost",
      database: "VietJob_DATN",
      options: {
          encrypt: false,
          trustServerCertificate: true
      }
  };
  ```
  *Hãy thay đổi `user` và `password` trùng với tài khoản SQL Server trên máy của bạn.*

* **Chế độ Windows Authentication (Không cần mật khẩu):**
  Nếu dùng Windows Authentication, chỉnh cấu hình trong `db.js` về object `config` sử dụng driver `msnodesqlv8` (cần cài đặt thêm thư viện này).

### Bước 2: Cài đặt thư viện và chạy Backend
1. Mở Terminal tại thư mục `VietJob_njs/backend`.
2. Chạy lệnh cài đặt các gói phụ thuộc (dependencies):
   ```bash
   npm install
   ```
3. Chạy Server Backend:
   * Chạy trực tiếp:
     ```bash
     node server.js
     ```
   * Hoặc dùng `nodemon` để tự động khởi động lại khi sửa code (nếu có cài):
     ```bash
     npm run dev
     ```
4. Khi chạy thành công, Terminal sẽ hiện dòng chữ:
   ```text
   Kết nối SQL Server thành công!
   Server đang chay tai: http://localhost:5000
   ```

---

## 🎨 3. Cấu hình & Chạy Frontend (React/Vite)

Thư mục Frontend nằm tại: `VietJob`

### Bước 1: Cấu hình API Endpoint và OAuth
Frontend kết nối trực tiếp đến địa chỉ API mặc định: `http://localhost:5000/api`.
* Nếu muốn sử dụng tính năng đăng nhập bằng **Google** hoặc **LinkedIn**, bạn hãy mở file `.env` tại thư mục `VietJob` và điền chính xác thông tin Client ID của bạn.

### Bước 2: Cài đặt thư viện và chạy Frontend
1. Mở Terminal tại thư mục `VietJob`.
2. Chạy lệnh cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Chạy ứng dụng ở chế độ phát triển (Development):
   ```bash
   npm run dev
   ```
4. Mở trình duyệt Web và truy cập vào địa chỉ:
   ```text
   http://localhost:5173
   ```

---

## ⚙️ 4. Lưu ý khi chuẩn bị nộp bài cho Giảng viên

Khi nén dự án để gửi thầy cô, hãy dọn dẹp dự án bằng cách **XÓA các thư mục sau** để giảm dung lượng file nén từ hàng trăm MB xuống chỉ còn vài MB:
* 🗑️ `VietJob/node_modules/`
* 🗑️ `VietJob/dist/` (nếu có)
* 🗑️ `VietJob_njs/backend/node_modules/`
* 🗑️ `VietJob_njs/backend/uploads/` (các file upload thử nghiệm tạm thời, hoặc giữ lại thư mục rỗng)
* 🗑️ Các thư mục ẩn `.git/` hoặc `.vs/` (nếu có).



## 🔑 5. Danh sách tài khoản dùng thử (Test Accounts)

Để thuận tiện cho thầy cô trong quá trình kiểm tra và chạy thử các chức năng phân quyền, bạn có thể sử dụng các tài khoản mẫu dưới đây:

*   **Tài khoản Quản trị viên (Admin)**:
    *   **Email**: `luongduongess@gmail.com`
    *   **Mật khẩu**: `12345`
*   **Tài khoản Nhà tuyển dụng (Employer - Đã được duyệt)**:
    *   **Email**: `thaodo9683@gmail.com`
    *   **Mật khẩu**: `123456789`
*   **Tài khoản Ứng viên (Candidate)**:
    *   **Email**: `nhoai2007@gmail.com`
    *   **Mật khẩu**: `12345`


