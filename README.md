# 🏥 HỆ THỐNG QUẢN LÝ CHẤM CÔNG & CA TRỰC
## BỆNH VIỆN ĐA KHOA KHU VỰC CAI LẬY

Hệ thống quản lý chấm công và ca trực được xây dựng nhằm hỗ trợ quản lý nhân viên y tế, theo dõi thời gian vào ca - hết ca, tình trạng đi trễ, tổng số giờ làm việc và lập báo cáo chấm công.

Hệ thống được triển khai dưới dạng website và sử dụng Supabase làm nền tảng xác thực, cơ sở dữ liệu và bảo mật dữ liệu.

---

## 1. CÔNG NGHỆ SỬ DỤNG

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Supabase Auth
- Supabase PostgreSQL
- Row Level Security (RLS)
- Vercel

---

## 2. CÁC CHỨC NĂNG CHÍNH

### 2.1. Đăng nhập và xác thực

Người dùng đăng nhập bằng tài khoản được cấp.

Hệ thống sử dụng Supabase Auth để:
- Xác thực tài khoản.
- Duy trì phiên đăng nhập.
- Đăng xuất.
- Kiểm soát quyền truy cập.

---

### 2.2. Phân quyền người dùng

Hệ thống gồm 03 vai trò:

#### Admin
- Đăng nhập hệ thống.
- Xem dữ liệu.
- Quản lý danh sách nhân viên.
- Thêm nhân viên.
- Xóa nhân viên.
- Quản lý và theo dõi dữ liệu chấm công.
- Có quyền cao nhất trong hệ thống.

#### Manager
- Đăng nhập hệ thống.
- Xem và theo dõi dữ liệu chấm công.
- Thực hiện các chức năng được phân quyền.
- Không có quyền quản lý danh sách nhân viên.

#### Employee
- Đăng nhập hệ thống.
- Chỉ được thao tác chấm công cho nhân viên được liên kết với tài khoản.
- Không được quản lý nhân viên khác.
- Không được thực hiện các thao tác quản trị.

---

## 3. BẢO MẬT DỮ LIỆU

Hệ thống sử dụng Row Level Security (RLS) của Supabase để bảo vệ dữ liệu tại tầng cơ sở dữ liệu.

Việc ẩn hoặc hiện nút chức năng trên giao diện không phải là cơ chế bảo mật duy nhất.

Supabase RLS tiếp tục kiểm tra quyền đối với các thao tác dữ liệu.

Các nhóm quyền chính:

- Admin: quyền quản trị.
- Manager: quyền quản lý theo phạm vi được phân quyền.
- Employee: chỉ thao tác dữ liệu chấm công của tài khoản được liên kết.

---

## 4. CHỨC NĂNG CHẤM CÔNG

### 4.1. Check-in

Người dùng lựa chọn nhân viên và ca trực, sau đó thực hiện Check-in.

Hệ thống tự động:
- Ghi nhận thời gian vào ca.
- Xác định trạng thái đúng giờ hoặc đi trễ.
- Lưu dữ liệu vào cơ sở dữ liệu Supabase.

### 4.2. Check-out

Khi kết thúc ca, người dùng thực hiện Check-out.

Hệ thống tự động:
- Ghi nhận thời gian ra ca.
- Tính tổng thời gian làm việc.
- Cập nhật trạng thái hoàn thành.
- Cập nhật Dashboard.

### 4.3. Kiểm soát chấm công

Hệ thống kiểm soát:
- Không cho Check-in lần thứ hai khi ca trước chưa kết thúc.
- Không cho Check-out khi chưa Check-in.
- Tính thời gian đối với ca trực qua ngày.

---

## 5. CÁC CA TRỰC

Hệ thống hiện có 05 loại ca:

| Mã ca | Tên ca | Thời gian |
|---|---|---|
| SHIFT_1 | Ca Sáng | 07:00 - 11:30 |
| SHIFT_2 | Ca Chiều | 13:00 - 16:30 |
| SHIFT_3 | Ca Đêm | 18:00 - 07:00 hôm sau |
| SHIFT_24H | Trực Cấp cứu | 24/24 |
| SHIFT_OUT | Khám ngoài giờ | Thứ 7 & Chủ nhật |

Đối với ca đêm và ca qua ngày, hệ thống tự động xử lý thời gian kết thúc vào ngày hôm sau.

---

## 6. DASHBOARD

Dashboard cung cấp các thông tin tổng quan:

- Tổng số nhân viên.
- Số nhân viên đang trong ca.
- Số lượt đi trễ.
- Số ca đã hoàn thành.
- Thống kê theo khoa/phòng.
- Biểu đồ thống kê chấm công.

Các chỉ số được cập nhật sau khi dữ liệu chấm công được ghi nhận.

---

## 7. TÌM KIẾM VÀ LỌC DỮ LIỆU

Hệ thống hỗ trợ:

- Tìm kiếm theo mã nhân viên.
- Tìm kiếm theo họ tên.
- Lọc theo ngày.
- Lọc theo khoa/phòng.
- Lọc theo trạng thái chấm công.

Các trạng thái gồm:
- Đang trực.
- Đúng giờ.
- Đi muộn.
- Đã hoàn thành.

---

## 8. QUẢN LÝ NHÂN VIÊN

Admin có thể quản lý danh sách nhân viên.

Các chức năng:
- Xem danh sách nhân viên.
- Thêm nhân viên.
- Xóa nhân viên.
- Quản lý mã nhân viên.
- Quản lý họ tên.
- Quản lý khoa/phòng.
- Quản lý vị trí/chức vụ.

Dữ liệu nhân viên được lưu trên Supabase PostgreSQL.

Hệ thống hiện có 38 nhân viên, trong đó 35 nhân viên dữ liệu ban đầu và 03 nhân viên được bổ sung để kiểm thử chức năng quản trị.

---

## 9. BÁO CÁO VÀ XUẤT EXCEL

Hệ thống hỗ trợ lập báo cáo chấm công theo khoảng thời gian.

Người dùng có thể lựa chọn:
- Từ ngày.
- Đến ngày.

Báo cáo cung cấp:
- Tổng số lượt chấm công.
- Số lượt đúng giờ.
- Số lượt đi trễ.
- Số ca đã hoàn thành.
- Tổng số giờ làm việc.

Hệ thống hỗ trợ xuất dữ liệu ra Excel để phục vụ lưu trữ và tổng hợp.

---

## 10. CƠ SỞ DỮ LIỆU

Hệ thống sử dụng Supabase PostgreSQL.

Các bảng chính:

### `staff`

Lưu thông tin nhân viên:
- Mã nhân viên.
- Họ tên.
- Khoa/phòng.
- Vị trí/chức vụ.

### `shifts`

Lưu thông tin các ca trực:
- Mã ca.
- Tên ca.
- Thời gian bắt đầu.
- Thời gian kết thúc.
- Thời lượng.

### `attendance_logs`

Lưu dữ liệu chấm công:
- Nhân viên.
- Ngày làm việc.
- Ca trực.
- Thời gian Check-in.
- Thời gian Check-out.
- Trạng thái.
- Tổng số giờ.
- Trạng thái hoàn thành.

### `profiles`

Lưu thông tin tài khoản và phân quyền:
- Tài khoản.
- Email.
- Họ tên.
- Vai trò.
- Nhân viên được liên kết.

---

## 11. CẤU TRÚC PROJECT

```text
HỆ THỐNG CHẤM CÔNG
│
├── index.html
├── script.js
├── style.css
└── README.md

Cập nhật triển khai Vercel.
