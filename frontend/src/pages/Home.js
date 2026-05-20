// Home.js - Upgraded Dual-Mode Homepage (Student Portal & Instructor Creator Dashboard)
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';
import SmartSearch from '../components/SmartSearch';
import coursesData from '../utils/courses.json';
import { useLanguage } from '../context/LanguageContext';

const Home = ({ contract, account, showToast }) => {
  const { t, lang } = useLanguage();
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // AI Search state
  const [searchResults, setSearchResults] = useState(null); // null = no search active
  const [searchQuery, setSearchQuery] = useState('');

  // Mode Selection: false = Student Portal, true = Instructor Console
  const [isCreatorMode, setIsCreatorMode] = useState(false);
  
  // Instructor Creator States
  const [dynamicCourses, setDynamicCourses] = useState([]);
  const [creatorForm, setCreatorForm] = useState({
    title: '',
    description: '',
    priceEth: '0.01',
    category: 'Programming',
    videoUrl: 'https://www.youtube.com/embed/M576WGiDBdQ',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4aec4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  });
  const [isPublishing, setIsPublishing] = useState(false);

  // Load merged courses (static catalog + dynamically created)
  const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    // Read dynamic courses created by instructors
    const localDynamic = JSON.parse(localStorage.getItem("dynamic_courses") || "[]");
    setDynamicCourses(localDynamic);
    setAllCourses([...coursesData, ...localDynamic]);
  }, []);

  useEffect(() => {
    const fetchPurchased = async () => {
      if (contract && account) {
        try {
          const ids = await contract.getMyCourses();
          setPurchasedIds(ids.map(id => Number(id)));

          // Fetch dynamic courses from contract to sync with local
          const onChainDynamic = await contract.getDynamicCourses();
          if (onChainDynamic && onChainDynamic.length > 0) {
            const formatted = onChainDynamic.map(c => ({
              id: Number(c.id),
              title: c.title,
              description: c.description,
              priceEth: ethers.formatEther(c.price),
              image: c.image || "https://images.unsplash.com/photo-1639762681485-074b7f4aec4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              category: c.category || "Programming",
              rating: 4.8,
              duration: "8 hours",
              instructor: c.instructor.substring(0, 6) + "...",
              studentsEnrolled: 120,
              videoUrl: "https://www.youtube.com/embed/M576WGiDBdQ"
            }));
            
            // Merge & deduct duplicates
            const localDynamic = JSON.parse(localStorage.getItem("dynamic_courses") || "[]");
            const merged = [...localDynamic];
            formatted.forEach(f => {
              if (!merged.some(m => m.id === f.id)) {
                merged.push(f);
              }
            });
            localStorage.setItem("dynamic_courses", JSON.stringify(merged));
            setDynamicCourses(merged);
            setAllCourses([...coursesData, ...merged]);
          }
        } catch (error) {
          console.error("Error fetching purchases:", error);
        }
      } else {
        setPurchasedIds([]);
      }
    };
    fetchPurchased();
  }, [contract, account]);

  const categories = ['All', ...new Set(allCourses.map(c => c.category))];

  const handleBuyClick = (course) => {
    if (!account) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    setSelectedCourse(course);
    setPaymentModalOpen(true);
  };

  const executeWeb3Payment = async () => {
    if (!contract || !selectedCourse) return;
    try {
      setLoadingId(selectedCourse.id);
      const priceWei = ethers.parseEther(selectedCourse.priceEth || selectedCourse.price);
      const tx = await contract.buyCourse(selectedCourse.id, { value: priceWei });
      showToast("Transaction sent! Waiting for confirmation...", "info");
      await tx.wait();
      showToast("Course purchased successfully via Web3!", "success");
      setPurchasedIds(prev => [...prev, selectedCourse.id]);
      setPaymentModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast(error.reason || "Transaction failed", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const executeFiatPayment = async () => {
    if (!selectedCourse) return;
    setLoadingId(selectedCourse.id);
    setTimeout(() => {
      const fiatPurchases = JSON.parse(localStorage.getItem(`fiat_${account}`) || "[]");
      if (!fiatPurchases.includes(selectedCourse.id)) {
        fiatPurchases.push(selectedCourse.id);
        localStorage.setItem(`fiat_${account}`, JSON.stringify(fiatPurchases));
      }
      showToast("Payment successful via Credit Card/Momo!", "success");
      setPurchasedIds(prev => [...prev, selectedCourse.id]);
      setPaymentModalOpen(false);
      setLoadingId(null);
    }, 2000);
  };

  // Instructor Publish Function
  const handlePublishCourse = async (e) => {
    e.preventDefault();
    if (!account) return showToast("Please connect wallet", "error");
    if (!contract) return showToast("Smart Contract not connected", "error");

    try {
      setIsPublishing(true);
      // Generate a dynamic ID greater than 20
      const nextId = Math.max(21, ...allCourses.map(c => c.id)) + 1;
      const priceWei = ethers.parseEther(creatorForm.priceEth);

      const tx = await contract.createCourse(
        nextId,
        creatorForm.title,
        creatorForm.description,
        priceWei,
        creatorForm.image,
        creatorForm.category
      );
      showToast(lang === 'vi' ? "Đang gửi giao dịch đăng khóa học lên Blockchain..." : "Publish transaction sent to Ethereum network...", "info");
      
      await tx.wait();
      showToast(lang === 'vi' ? "Đăng khóa học lên Blockchain thành công!" : "Course published on-chain successfully!", "success");

      // Save locally
      const localProfile = JSON.parse(localStorage.getItem(`profile_${account}`) || "{}");
      const newCourse = {
        id: nextId,
        title: creatorForm.title,
        description: creatorForm.description,
        priceEth: creatorForm.priceEth,
        image: creatorForm.image,
        category: creatorForm.category,
        rating: 5.0,
        duration: "10 hours",
        instructor: localProfile.displayName || `Instructor_${account.substring(2, 6)}`,
        studentsEnrolled: 0,
        videoUrl: creatorForm.videoUrl
      };

      const updatedDynamic = [...dynamicCourses, newCourse];
      localStorage.setItem("dynamic_courses", JSON.stringify(updatedDynamic));
      setDynamicCourses(updatedDynamic);
      setAllCourses([...coursesData, ...updatedDynamic]);

      // Reset form
      setCreatorForm({
        title: '',
        description: '',
        priceEth: '0.01',
        category: 'Programming',
        videoUrl: 'https://www.youtube.com/embed/M576WGiDBdQ',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f4aec4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      });
      
    } catch (error) {
      console.error(error);
      showToast(error.reason || error.message || "Failed to publish course", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCreatorChange = (e) => {
    setCreatorForm({ ...creatorForm, [e.target.name]: e.target.value });
  };

  // If AI search is active, use those results; otherwise filter by category
  const displayedCourses = (() => {
    let base = searchResults !== null ? searchResults : allCourses;
    if (activeCategory !== 'All') {
      base = base.filter(c => c.category === activeCategory);
    }
    return base;
  })();

  return (
    <div>
      
      {/* Dynamic Mode Switch Controller */}
      <div className="portal-mode-toggle">
        <button
          className={`mode-btn ${!isCreatorMode ? 'active' : ''}`}
          onClick={() => setIsCreatorMode(false)}
        >
          🎓 {lang === 'vi' ? "Học viên (Student Portal)" : "Student Portal"}
        </button>
        <button
          className={`mode-btn ${isCreatorMode ? 'active' : ''}`}
          onClick={() => {
            if (!account) {
              showToast("Please connect your wallet first", "error");
              return;
            }
            setIsCreatorMode(true);
          }}
          style={{ borderLeft: 'none' }}
        >
          🛠️ {lang === 'vi' ? "Giảng viên (Creator Console)" : "Instructor Dashboard"}
        </button>
      </div>

      {!isCreatorMode ? (
        /* ================= STUDENT PORTAL ================= */
        <div>
          <div className="hero">
            <h1 className="hero-title">{t("home_hero_title")}</h1>
            <p className="hero-subtitle">{t("home_hero_subtitle")}</p>
          </div>

          <div className="discovery-tools">
            <SmartSearch
              onResultsChange={setSearchResults}
              onQueryChange={setSearchQuery}
            />

            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'All' ? t("home_all") : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Result Summary */}
          {searchQuery.trim().length >= 2 && searchResults !== null && (
            <div className="search-result-info">
              ✨ Found <strong>{displayedCourses.length}</strong> AI-matched result{displayedCourses.length !== 1 ? 's' : ''} for "<em>{searchQuery}</em>"
            </div>
          )}

          <div className="courses-grid">
            {displayedCourses.map(course => {
              const fiatPurchases = JSON.parse(localStorage.getItem(`fiat_${account}`) || "[]");
              const isPurchased = purchasedIds.includes(course.id) || fiatPurchases.includes(course.id);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isPurchased={isPurchased}
                  onBuy={handleBuyClick}
                  loading={loadingId === course.id}
                />
              );
            })}
            {displayedCourses.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                {t("home_no_courses")}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= INSTRUCTOR CONSOLE ================= */
        <div style={{ paddingBottom: '60px' }}>
          <div className="hero" style={{ padding: '20px 0 40px', textAlign: 'left' }}>
            <h1 className="hero-title" style={{ fontSize: '2.3rem' }}>🛠️ {lang === 'vi' ? "Bảng điều khiển Giảng viên" : "Instructor Console"}</h1>
            <p className="hero-subtitle" style={{ marginLeft: 0, color: 'white', maxWidth: '800px' }}>
              {lang === 'vi' ? "Xuất bản khóa học của bạn trực tiếp lên Ethereum Blockchain và nhận doanh thu ETH ngay lập tức." : "Publish courses directly on the Ethereum blockchain and unlock instant royalty distributions."}
            </p>
          </div>

          {/* Earnings Analytics Banner */}
          <div className="instructor-analytics-grid">
            <div className="instructor-stat-card">
              <span className="stat-card-icon">📚</span>
              <div>
                <h4>{dynamicCourses.length}</h4>
                <p>{lang === 'vi' ? "Khóa học tự xuất bản" : "Dynamic Courses Published"}</p>
              </div>
            </div>
            <div className="instructor-stat-card">
              <span className="stat-card-icon">💎</span>
              <div>
                <h4>⟠ {dynamicCourses.length * 0.05} ETH</h4>
                <p>{lang === 'vi' ? "Doanh thu tích lũy (ETH)" : "Accumulated Royalty Earnings"}</p>
              </div>
            </div>
            <div className="instructor-stat-card">
              <span className="stat-card-icon">👥</span>
              <div>
                <h4>{dynamicCourses.length * 5}</h4>
                <p>{lang === 'vi' ? "Tổng số học viên" : "Total Enrolled Students"}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '35px' }}>
            
            {/* Publish Form */}
            <div style={{ flex: '1.2', minWidth: '350px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>🚀 {lang === 'vi' ? "Xuất bản khóa học mới trên chuỗi khối" : "Publish Dynamic Course on Blockchain"}</h3>
              <form onSubmit={handlePublishCourse} style={{ display: 'grid', gap: '15px' }}>
                <div className="form-group">
                  <label>{lang === 'vi' ? "Tiêu đề khóa học" : "Course Title"}</label>
                  <input type="text" name="title" value={creatorForm.title} onChange={handleCreatorChange} className="form-control" placeholder="e.g. Master DeFi Architect" required />
                </div>

                <div className="form-group">
                  <label>{lang === 'vi' ? "Mô tả tóm tắt" : "Short Description"}</label>
                  <textarea name="description" value={creatorForm.description} onChange={handleCreatorChange} className="form-control" rows="3" placeholder="Explain the dynamic benefits of this course..." required />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>{lang === 'vi' ? "Giá khóa học (ETH)" : "Price (ETH)"}</label>
                    <input type="number" step="0.001" name="priceEth" value={creatorForm.priceEth} onChange={handleCreatorChange} className="form-control" required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>{lang === 'vi' ? "Lĩnh vực" : "Category"}</label>
                    <select name="category" value={creatorForm.category} onChange={handleCreatorChange} className="form-control" style={{ background: '#111827' }}>
                      <option value="Programming">Programming</option>
                      <option value="Security">Security</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>{lang === 'vi' ? "Đường dẫn Video giảng dạy (YouTube Embed)" : "Video URL (YouTube Embed Link)"}</label>
                  <input type="url" name="videoUrl" value={creatorForm.videoUrl} onChange={handleCreatorChange} className="form-control" placeholder="https://www.youtube.com/embed/..." />
                </div>

                <div className="form-group">
                  <label>{lang === 'vi' ? "Ảnh đại diện khóa học (Unsplash URL)" : "Image URL (Unsplash Link)"}</label>
                  <input type="url" name="image" value={creatorForm.image} onChange={handleCreatorChange} className="form-control" />
                </div>

                <button type="submit" className="buy-hero-btn" style={{ margin: '10px 0 0 0' }} disabled={isPublishing}>
                  {isPublishing ? <span className="loader"></span> : (lang === 'vi' ? "Triển khai & Đăng lên Blockchain" : "Deploy & Publish on Ethereum")}
                </button>
              </form>
            </div>

            {/* List of Dynamic Courses Created */}
            <div style={{ flex: '1', minWidth: '300px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '30px', height: 'fit-content' }}>
              <h3 style={{ marginBottom: '20px' }}>📦 {lang === 'vi' ? "Danh sách bài đăng trên chuỗi" : "Your Dynamic On-chain Courses"}</h3>
              {dynamicCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <p>{lang === 'vi' ? "Bạn chưa tạo khóa học nào." : "You have not published any courses on-chain yet."}</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {dynamicCourses.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: '15px', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                      <img src={c.image} alt={c.title} style={{ width: '80px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.95rem' }}>{c.title}</h4>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary-color)' }}>{c.category}</span>
                        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span>⟠ {c.priceEth} ETH</span>
                          <span style={{ color: 'var(--accent-color)' }}>✔ On-chain</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {paymentModalOpen && selectedCourse && (
        <PaymentModal
          course={selectedCourse}
          onClose={() => { if (!loadingId) setPaymentModalOpen(false); }}
          onPayWeb3={executeWeb3Payment}
          onPayFiat={executeFiatPayment}
          loading={loadingId === selectedCourse.id}
        />
      )}
    </div>
  );
};

export default Home;
