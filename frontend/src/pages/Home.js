import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';
import coursesData from '../utils/courses.json';
import { useLanguage } from '../context/LanguageContext';

const Home = ({ contract, account, showToast }) => {
  const { t } = useLanguage();
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = ['All', ...new Set(coursesData.map(c => c.category))];

  useEffect(() => {
    const fetchPurchased = async () => {
      if (contract && account) {
        try {
          const ids = await contract.getMyCourses();
          setPurchasedIds(ids.map(id => Number(id)));
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      } else {
        setPurchasedIds([]);
      }
    };
    fetchPurchased();
  }, [contract, account]);

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
      const priceWei = ethers.parseEther(selectedCourse.priceEth);
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

  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="hero">
        <h1 className="hero-title">{t("home_hero_title")}</h1>
        <p className="hero-subtitle">{t("home_hero_subtitle")}</p>
      </div>
      
      <div className="discovery-tools">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder={t("home_search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
      
      <div className="courses-grid">
        {filteredCourses.map(course => {
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
        {filteredCourses.length === 0 && (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
            {t("home_no_courses")}
          </div>
        )}
      </div>

      {paymentModalOpen && selectedCourse && (
        <PaymentModal
          course={selectedCourse}
          onClose={() => { if(!loadingId) setPaymentModalOpen(false); }}
          onPayWeb3={executeWeb3Payment}
          onPayFiat={executeFiatPayment}
          loading={loadingId === selectedCourse.id}
        />
      )}
    </div>
  );
};

export default Home;
