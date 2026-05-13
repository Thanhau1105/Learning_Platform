import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'vi' : 'en'));
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    "nav_discovery": "Discovery",
    "nav_my_learning": "My Learning",
    "nav_connect": "Connect Wallet",
    "nav_edit_profile": "Edit Profile",
    "nav_my_courses": "My Courses",
    
    "home_hero_title": "Learn the Future of Web3",
    "home_hero_subtitle": "Discover premium courses in Blockchain, AI, Design, and more. Own your learning forever with decentralized verification.",
    "home_search_placeholder": "Search for courses...",
    "home_all": "All",
    "home_no_courses": "No courses found matching your criteria.",
    
    "card_by": "By",
    "card_overall_progress": "Overall Progress",
    "card_start_learning": "Start Learning",
    "card_continue": "Continue Learning",
    "card_unlock": "Unlock Course",
    
    "detail_instructed_by": "Instructed by",
    "detail_students": "students",
    "detail_course_content": "Course Content",
    "detail_locked_title": "Course Locked",
    "detail_locked_desc": "You need to purchase this course to view the content.",
    "detail_ondemand": "of on-demand video",
    "detail_access": "Access on all devices",
    "detail_cert": "Certificate of completion",
    "detail_lifetime": "Full lifetime access",
    "detail_unlock_now": "Unlock Course Now",
    "detail_money_back": "30-Day Money-Back Guarantee",
    
    "modal_select_payment": "Select Payment Method",
    "modal_unlocking": "Unlocking",
    "modal_crypto_title": "Pay with Crypto (Web3)",
    "modal_crypto_desc": "ETH - On-chain ownership",
    "modal_fiat_title": "Pay with Credit Card / Momo",
    "modal_fiat_desc": "Simulated Fiat Payment",
    "modal_processing": "Processing transaction...",
    
    "my_learning_title": "My Learning Dashboard",
    "my_learning_subtitle": "Track your progress and continue learning your purchased courses.",
    "my_learning_empty": "You haven't purchased any courses yet",
    "my_learning_explore": "Explore Catalog",
    
    "profile_title": "Edit Profile",
    "profile_display_name": "Display Name",
    "profile_avatar_url": "Avatar URL",
    "profile_bio": "Bio",
    "profile_wallet": "Wallet Address",
    "profile_save": "Save Profile",
    "profile_connect_prompt": "Please connect your wallet to view profile",
  },
  vi: {
    "nav_discovery": "Khám Phá",
    "nav_my_learning": "Học Tập",
    "nav_connect": "Kết Nối Ví",
    "nav_edit_profile": "Cập Nhật Hồ Sơ",
    "nav_my_courses": "Khóa Học Của Tôi",
    
    "home_hero_title": "Làm Chủ Tương Lai Web3",
    "home_hero_subtitle": "Khám phá các khóa học chất lượng cao về Blockchain, AI, Thiết kế. Sở hữu vĩnh viễn kiến thức trên chuỗi khối.",
    "home_search_placeholder": "Tìm kiếm khóa học...",
    "home_all": "Tất cả",
    "home_no_courses": "Không tìm thấy khóa học nào phù hợp.",
    
    "card_by": "Bởi",
    "card_overall_progress": "Tiến Độ Hoàn Thành",
    "card_start_learning": "Vào Học",
    "card_continue": "Tiếp Tục Học",
    "card_unlock": "Mở Khóa Khóa Học",
    
    "detail_instructed_by": "Giảng viên",
    "detail_students": "học viên",
    "detail_course_content": "Nội Dung Khóa Học",
    "detail_locked_title": "Khóa Học Bị Khóa",
    "detail_locked_desc": "Bạn cần mua khóa học này để xem nội dung.",
    "detail_ondemand": "video học theo yêu cầu",
    "detail_access": "Truy cập trên mọi thiết bị",
    "detail_cert": "Chứng nhận hoàn thành",
    "detail_lifetime": "Quyền truy cập vĩnh viễn",
    "detail_unlock_now": "Mở Khóa Ngay",
    "detail_money_back": "Đảm bảo hoàn tiền trong 30 ngày",
    
    "modal_select_payment": "Chọn Phương Thức Thanh Toán",
    "modal_unlocking": "Đang mở khóa",
    "modal_crypto_title": "Thanh toán bằng Crypto (Web3)",
    "modal_crypto_desc": "ETH - Sở hữu trên Blockchain",
    "modal_fiat_title": "Thanh toán Thẻ / Momo",
    "modal_fiat_desc": "Mô phỏng thanh toán tiền mặt",
    "modal_processing": "Đang xử lý giao dịch...",
    
    "my_learning_title": "Bảng Điều Khiển Học Tập",
    "my_learning_subtitle": "Theo dõi tiến độ và tiếp tục các khóa học bạn đã mua.",
    "my_learning_empty": "Bạn chưa mua khóa học nào",
    "my_learning_explore": "Khám Phá Khóa Học",
    
    "profile_title": "Cập Nhật Hồ Sơ",
    "profile_display_name": "Tên Hiển Thị",
    "profile_avatar_url": "Đường Dẫn Avatar",
    "profile_bio": "Tiểu sử",
    "profile_wallet": "Địa Chỉ Ví",
    "profile_save": "Lưu Thay Đổi",
    "profile_connect_prompt": "Vui lòng kết nối ví để xem hồ sơ",
  }
};
