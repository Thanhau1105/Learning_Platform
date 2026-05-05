# Blockchain Learning Platform (E-Learning dApp)

Dự án website bán khóa học trực tuyến sử dụng công nghệ Blockchain để quản lý giao dịch và quyền sở hữu khóa học. 

---

## Kiến trúc hệ thống (System Architecture)
Hệ thống được vận hành theo mô hình dApp (Decentralized Application): 
- **Frontend:** React.js 
- **Blockchain Bridge:** Ethers.js 
- **Smart Contract:** Solidity 
- **Network:** Ganache (Local Blockchain) 
- **Wallet:** MetaMask 

---

## I. Phân công trách nhiệm (GitHub Flow)

### 1. Blockchain Developer (Smart Contract)
- **File phụ trách:** `smart-contract/Course.sol`
- **Nhiệm vụ:** - Viết logic lưu trữ quyền sở hữu khóa học (mapping address → courses).
  - Viết các hàm: `buyCourse`, `getMyCourses`, `getCoursePrice`.
  - Deploy contract lên Ganache và cung cấp file **ABI (Course.json)** cho Backend.

### 2. Backend Developer (Integration & Logic)
- **File phụ trách:** `frontend/src/utils/`
- **Nhiệm vụ:**
  - Thiết lập kết nối giữa React và Smart Contract qua `Ethers.js`.
  - Quản lý metadata khóa học (tên, mô tả, ảnh) tại file JSON nội bộ.
  - Xây dựng các hàm Service để Frontend chỉ việc gọi: `connectWallet()`, `handlePurchase()`.
  - Xử lý định dạng dữ liệu từ Blockchain trước khi đưa lên UI.

### 3. Frontend Developer (UI/UX)
- **File phụ trách:** `frontend/src/pages/` & `components/`
- **Nhiệm vụ:**
  - Thiết kế giao diện danh sách khóa học và trang cá nhân.
  - Gọi các hàm từ Backend cung cấp để hiển thị trạng thái ví và lịch sử mua.
  - Xử lý hiệu ứng loading, thông báo khi giao dịch thành công/thất bại.

---

## II. Cấu trúc "Database" (Blockchain State)
Vì không sử dụng SQL/MongoDB, dữ liệu được lưu trữ trên Smart Contract như sau:

| Key | Value Type | Ý nghĩa |
| :--- | :--- | :--- |
| `address` | `uint[]` | Mapping địa chỉ ví người dùng với danh sách ID khóa học đã mua. |
| `courseId` | `uint256` | Mã định danh duy nhất cho mỗi khóa học. |
| `price` | `uint256` | Giá khóa học tính theo đơn vị Wei (ETH). |

## Yêu cầu môi trường
1. Cài đặt **Node.js**.
2. Cài đặt extension **MetaMask** trên trình duyệt.
3. Chạy **Ganache** (Cổng mặc định: 7545).
