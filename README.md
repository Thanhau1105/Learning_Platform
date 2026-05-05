# Blockchain Learning Platform (E-Learning dApp)

Hệ thống website học trực tuyến phi tập trung (dApp). Dự án cho phép người dùng kết nối ví MetaMask, thực hiện mua khóa học bằng đồng ETH và xác thực quyền sở hữu vĩnh viễn trên mạng lưới Blockchain.

---

## I. Kiến trúc hệ thống (System Architecture)
Dự án được vận hành theo mô hình 3 lớp tách biệt nhằm tối ưu hóa việc cộng tác qua GitHub:
- **Frontend:** React.js - Giao diện người dùng và trải nghiệm học tập.
- **Blockchain Bridge:** Ethers.js - Thư viện trung gian giúp kết nối logic Web3.
- **Smart Contract:** Solidity - Ngôn ngữ lập trình xử lý logic và lưu trữ trên Blockchain.
- **Local Network:** Ganache - Mạng Blockchain giả lập dùng để triển khai và thử nghiệm.
- **Wallet:** MetaMask - Công cụ quản lý ví và xác thực các giao dịch tài chính.

---

## II. Phân công nhiệm vụ (GitHub Roles)

### 1. Blockchain Developer (Smart Contract)
- **Thư mục quản lý:** `smart-contract/`
- **Nhiệm vụ:** - Lập trình file `Course.sol` để quản lý danh sách khóa học và cơ chế sở hữu.
  - Triển khai các hàm nghiệp vụ: `buyCourse`, `getMyCourses`, `getCoursePrice`.
  - Xuất file **ABI** và địa chỉ Contract sau khi deploy thành công lên Ganache.

### 2. Backend Developer (Integration & Logic)
- **Thư mục quản lý:** `frontend/src/utils/`
- **Nhiệm vụ:**
  - Thiết lập `contract.js` để tạo cầu nối giữa giao diện và Smart Contract.
  - Xây dựng logic `connectWallet.js` để quản lý việc đăng nhập ví người dùng.
  - **Quản lý Metadata:** Xây dựng file `courses.json` để lưu trữ thông tin chi tiết (mô tả, ảnh) nhằm tối ưu hóa chi phí lưu trữ trên Blockchain.
  - **Logic nâng cao:** Thực hiện kiểm tra quyền sở hữu khóa học (`isCoursePurchased`) và thiết lập bộ lắng nghe sự kiện giao dịch (Event Listener).

### 3. Frontend Developer (UI/UX)
- **Thư mục quản lý:** `frontend/src/pages/` & `frontend/src/components/`
- **Nhiệm vụ:**
  - Thiết kế các thành phần giao diện như `Navbar.jsx`, `CourseCard.jsx`.
  - Phát triển trang chủ hiển thị danh sách khóa học và trang `My Courses` cá nhân.
  - Gọi các hàm dịch vụ từ Backend để xử lý hiển thị khi người dùng thực hiện mua hàng.

---

## III. Thiết kế Database trên Blockchain
Hệ thống không sử dụng SQL truyền thống. Dữ liệu được lưu trữ trực tiếp trên trạng thái của Smart Contract:
- **Cấu trúc dữ liệu:** `mapping(address => uint[]) public userCourses;`
- **Nguyên lý:** Mỗi khi một giao dịch mua được xác nhận, ID của khóa học sẽ được thêm vào danh sách tương ứng với địa chỉ ví của người mua.

---

## IV. Chức năng hệ thống (API Interface)

| Tên Hàm / Sự kiện | Loại | Mô tả nhiệm vụ |
| :--- | :--- | :--- |
| `connectWallet()` | Logic | Yêu cầu kết nối MetaMask và trả về địa chỉ ví người dùng. |
| `buyCourse(id)` | Giao dịch | Gửi ETH mua khóa học, kích hoạt popup xác nhận của MetaMask. |
| `getMyCourses()` | Truy vấn | Lấy danh sách ID các khóa học đã sở hữu để hiển thị cho người dùng. |
| `isCoursePurchased`| Kiểm tra | Xác định ví đã mua khóa học chưa để chuyển đổi nút Mua thành Xem nội dung. |
| `withdraw()` | Quản trị | Cho phép chủ sở hữu nền tảng rút tiền ETH thu được về ví cá nhân. |
| `CoursePurchased` | Sự kiện | Tự động thông báo và cập nhật giao diện ngay khi giao dịch hoàn tất. |

---

## V. Kế hoạch triển khai (7 Ngày)
- **Ngày 1-2:** Thiết lập môi trường, lập trình và triển khai Smart Contract lên Ganache.
- **Ngày 3:** Backend hoàn thành kết nối `Ethers.js` và kiểm tra logic gọi dữ liệu.
- **Ngày 4-5:** Frontend hoàn thiện giao diện Trang chủ và tích hợp chức năng Mua.
- **Ngày 6:** Phát triển trang quản lý khóa học cá nhân (My Courses).
- **Ngày 7:** Tổng kiểm thử hệ thống, chuẩn bị tài liệu thuyết trình và video demo.

---

## VI. Hướng dẫn cài đặt nhanh
1. **Sao chép mã nguồn:** `git clone <link-github-cua-nhom>`
2. **Cài đặt thư viện:** Di chuyển vào thư mục `frontend` và chạy lệnh `npm install ethers`.
3. **Môi trường yêu cầu:**
   - Khởi động phần mềm **Ganache** (Cấu hình Port 7545).
   - Tích hợp mạng **Localhost 7545** vào ví **MetaMask**.
   - Đảm bảo Smart Contract đã được deploy và file ABI đã được đặt đúng vị trí trong thư mục `utils`.
