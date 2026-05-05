# Blockchain Learning Platform (E-Learning dApp)

[cite_start]Dự án website bán khóa học trực tuyến sử dụng công nghệ Blockchain để quản lý giao dịch và quyền sở hữu khóa học. [cite: 1, 2]

---

## Kiến trúc hệ thống (System Architecture)
[cite_start]Hệ thống được vận hành theo mô hình dApp (Decentralized Application): [cite: 21]
- [cite_start]**Frontend:** React.js [cite: 22]
- [cite_start]**Blockchain Bridge:** Ethers.js [cite: 24]
- [cite_start]**Smart Contract:** Solidity [cite: 26]
- [cite_start]**Network:** Ganache (Local Blockchain) [cite: 28]
- [cite_start]**Wallet:** MetaMask [cite: 30]

---

## I. Phân công trách nhiệm (GitHub Flow)

### 1. Blockchain Developer (Smart Contract)
- [cite_start]**File phụ trách:** `smart-contract/Course.sol` [cite: 35]
- [cite_start]**Nhiệm vụ:** - Viết logic lưu trữ quyền sở hữu khóa học (mapping address → courses). [cite: 55]
  - [cite_start]Viết các hàm: `buyCourse`, `getMyCourses`, `getCoursePrice`. [cite: 60, 61, 62, 63]
  - [cite_start]Deploy contract lên Ganache và cung cấp file **ABI (Course.json)** cho Backend. [cite: 79]

### 2. Backend Developer (Integration & Logic) - **VỊ TRÍ CỦA BẠN**
- [cite_start]**File phụ trách:** `frontend/src/utils/` [cite: 47]
- **Nhiệm vụ:**
  - [cite_start]Thiết lập kết nối giữa React và Smart Contract qua `Ethers.js`. [cite: 80, 82]
  - Quản lý metadata khóa học (tên, mô tả, ảnh) tại file JSON nội bộ.
  - [cite_start]Xây dựng các hàm Service để Frontend chỉ việc gọi: `connectWallet()`, `handlePurchase()`. [cite: 4, 13]
  - [cite_start]Xử lý định dạng dữ liệu từ Blockchain trước khi đưa lên UI. [cite: 20]

### 3. Frontend Developer (UI/UX)
- [cite_start]**File phụ trách:** `frontend/src/pages/` & `components/` [cite: 38]
- **Nhiệm vụ:**
  - [cite_start]Thiết kế giao diện danh sách khóa học và trang cá nhân. [cite: 8, 17]
  - [cite_start]Gọi các hàm từ Backend cung cấp để hiển thị trạng thái ví và lịch sử mua. [cite: 7, 20]
  - [cite_start]Xử lý hiệu ứng loading, thông báo khi giao dịch thành công/thất bại. [cite: 16]

---

## II. Cấu trúc "Database" (Blockchain State)
[cite_start]Vì không sử dụng SQL/MongoDB, dữ liệu được lưu trữ trên Smart Contract như sau: [cite: 54]

| Key | Value Type | Ý nghĩa |
| :--- | :--- | :--- |
| `address` | `uint[]` | [cite_start]Mapping địa chỉ ví người dùng với danh sách ID khóa học đã mua. [cite: 55] |
| `courseId` | `uint256` | [cite_start]Mã định danh duy nhất cho mỗi khóa học. [cite: 61] |
| `price` | `uint256` | [cite_start]Giá khóa học tính theo đơn vị Wei (ETH). [cite: 63] |

---

## III. Quy trình chạy Demo (7 Ngày)
- [cite_start]**Day 1-2:** Setup môi trường, viết và deploy Smart Contract. [cite: 65, 71]
- [cite_start]**Day 3:** Backend hoàn thành logic kết nối `contract.js`. [cite: 80, 84]
- [cite_start]**Day 4-5:** Frontend làm giao diện Home và chức năng Mua. [cite: 88, 95]
- [cite_start]**Day 6:** Hoàn thiện trang "My Courses". [cite: 99]
- [cite_start]**Day 7:** Kiểm tra toàn bộ và Demo. [cite: 105]

---

## Yêu cầu môi trường
1. Cài đặt **Node.js**.
2. [cite_start]Cài đặt extension **MetaMask** trên trình duyệt. [cite: 66]
3. [cite_start]Chạy **Ganache** (Cổng mặc định: 7545). [cite: 67]
