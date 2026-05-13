# Hướng Dẫn Cài Đặt Và Chạy Dự Án Blockchain Learning Platform

Tài liệu này sẽ hướng dẫn bạn chi tiết cách khởi chạy toàn bộ dự án từ việc cài đặt môi trường, chạy Smart Contract cho đến việc thiết lập ví MetaMask để kết nối với Frontend.

## Yêu cầu môi trường (Prerequisites)
1. **Node.js**: Phiên bản 18.x hoặc mới hơn (tải tại [nodejs.org](https://nodejs.org/)).
2. **Ganache**: Tải và cài đặt ứng dụng Ganache Desktop (tải tại [trufflesuite.com/ganache](https://trufflesuite.com/ganache/)).
3. **MetaMask**: Tiện ích mở rộng ví tiền điện tử trên trình duyệt Chrome/Edge/Brave.

---

## Bước 1: Khởi động Ganache Local Network
1. Mở ứng dụng **Ganache** trên máy tính của bạn.
2. Chọn **Quickstart** (hoặc tạo Workspace mới).
3. Nhìn lên góc trên cùng, bạn sẽ thấy thông số **RPC SERVER**. Mặc định thường là: `http://127.0.0.1:7545` (Network ID là `5777`).
4. Hãy để Ganache chạy ngầm trong suốt quá trình chạy dự án.

---

## Bước 2: Thiết Lập & Deploy Smart Contract
1. Mở Terminal (Command Prompt / PowerShell) và đi tới thư mục `smart-contract`:
   ```bash
   cd smart-contract
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Biên dịch (Compile) hợp đồng thông minh:
   ```bash
   npx hardhat compile
   ```
4. Triển khai (Deploy) hợp đồng lên Ganache:
   ```bash
   npx hardhat ignition deploy ignition/modules/Course.js --network ganache
   ```
5. Khi hệ thống hỏi "Confirm deploy to network ganache (5777)?", hãy gõ `y` và nhấn Enter.
6. Khi deploy thành công, bạn sẽ nhận được một địa chỉ (ví dụ: `0xa843a...`). **Hãy copy địa chỉ này**.

---

## Bước 3: Cấu hình và Chạy Frontend
1. Mở file `frontend/src/utils/contract.js` bằng trình soạn thảo code (VS Code).
2. Dán địa chỉ bạn vừa copy ở Bước 2 vào biến `CONTRACT_ADDRESS`:
   ```javascript
   export const CONTRACT_ADDRESS = "0x_ĐỊA_CHỈ_CỦA_BẠN"; 
   ```
3. Mở một Terminal MỚI (giữ nguyên Terminal cũ nếu cần), đi tới thư mục `frontend`:
   ```bash
   cd frontend
   ```
4. Cài đặt thư viện:
   ```bash
   npm install
   ```
5. Khởi chạy giao diện người dùng:
   ```bash
   npm start
   ```
6. Trình duyệt sẽ tự động mở địa chỉ `http://localhost:3000`.

---

## Bước 4: Thiết Lập MetaMask với Ganache

Để tương tác (mua khóa học) trên dApp, bạn cần kết nối MetaMask với Ganache và có ETH giả.

### Thêm Mạng Ganache vào MetaMask:
1. Mở tiện ích **MetaMask** trên trình duyệt.
2. Nhấn vào mục chọn mạng (thường hiển thị chữ *Ethereum Mainnet* ở góc trên bên trái).
3. Chọn **Thêm mạng (Add network)**. 
4. Cuộn xuống dưới cùng và chọn **Thêm mạng thủ công (Add a network manually)**.
5. Điền các thông tin sau:
   - **Tên mạng (Network name):** `Ganache Local`
   - **URL RPC mới (New RPC URL):** `http://127.0.0.1:7545`
   - **Mã chuỗi (Chain ID):** `5777`
   - **Ký hiệu tiền tệ (Currency symbol):** `ETH`
6. Nhấn **Lưu (Save)**. MetaMask lúc này sẽ chuyển sang mạng Ganache.

### Nhập Tài Khoản có chứa ETH giả:
1. Mở lại giao diện ứng dụng **Ganache**.
2. Trong danh sách các tài khoản (có 100 ETH), hãy chọn tài khoản **thứ 2** (tài khoản đầu tiên đã bị trừ một ít phí để deploy contract).
3. Nhấp vào biểu tượng **Chìa khóa (Key icon)** ở bên phải của tài khoản đó.
4. Copy đoạn **PRIVATE KEY**.
5. Mở lại MetaMask, nhấp vào tên tài khoản (VD: *Account 1*) ở trên cùng giữa màn hình.
6. Chọn **Thêm tài khoản hoặc ví cứng (Add account or hardware wallet)** -> Chọn **Nhập tài khoản (Import account)**.
7. Dán đoạn Private Key vừa copy vào ô trống và nhấn **Nhập (Import)**.
8. Xong! Tài khoản này bây giờ sẽ có khoảng 100 ETH.

*(Lưu ý: Tuyệt đối không dùng Private Key thật của bạn vào các môi trường test mạng lưới như Ganache).*

---

## Bước 5: Trải Nghiệm Ứng Dụng
1. Quay lại trang web `http://localhost:3000`.
2. Nhấn nút **Connect Wallet** trên góc phải màn hình. MetaMask sẽ hiện lên yêu cầu xác nhận, hãy chọn tài khoản bạn vừa Import có 100 ETH.
3. Bấm vào nút **Buy Course** ở bất kỳ khóa học nào.
4. Xác nhận giao dịch thanh toán trên cửa sổ MetaMask (bạn sẽ bị trừ số ETH tương ứng).
5. Sau khi thanh toán thành công, khóa học sẽ đổi thành nút **Watch Now**, bạn có thể bấm vào để xem nội dung video.
6. Chuyển sang trang **My Courses** để xem các khóa học bạn đã sở hữu vĩnh viễn trên Blockchain!
