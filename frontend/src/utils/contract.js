// frontend/src/utils/contract.js

// 1. API giả lập kết nối ví
export const connectWallet = async () => {
    console.log("Đang kết nối ví...");
    return "0x1234567890abcdef1234567890abcdef12345678"; // Trả về địa chỉ ví giả
};

// 2. API lấy danh sách ID khóa học đã mua (Mock API)
export const getMyCourses = async () => {
    // Trả về mảng ID giả định để Frontend render trang My Courses
    return [1, 3]; 
};

// 3. API lấy giá khóa học (Mock API)
export const getCoursePrice = async (courseId) => {
    const prices = {
        1: "0.01", // React Basic
        2: "0.02", // Blockchain Basic
        3: "0.015" // Web Security
    };
    return prices[courseId] || "0";
};

// 4. API giả lập giao dịch mua
export const buyCourse = async (courseId) => {
    console.log("Khởi tạo giao dịch mua cho ID:", courseId);
    // Giả lập độ trễ của Blockchain (2 giây)
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: "success", hash: "0xabc123hash..." };
};

// 5. API kiểm tra sở hữu (Dùng cho logic đổi nút Buy -> View)
export const isCoursePurchased = async (courseId) => {
    const purchased = [1, 3]; // Giả sử đã mua 1 và 3
    return purchased.includes(courseId);
};