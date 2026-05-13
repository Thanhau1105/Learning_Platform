import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coursesData from '../utils/courses.json';
import PaymentModal from '../components/PaymentModal';
import { ethers } from 'ethers';
import { useLanguage } from '../context/LanguageContext';

const CourseDetail = ({ contract, account, showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [course, setCourse] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [activeLesson, setActiveLesson] = useState(0);

  const syllabus = [
    { title: "Introduction & Setup", duration: "45 min" },
    { title: "Core Concepts", duration: "1h 20m" },
    { title: "Advanced Techniques", duration: "2h 15m" },
    { title: "Building the Project", duration: "3h 00m" },
    { title: "Deployment & Conclusion", duration: "50 min" },
  ];

  useEffect(() => {
    const fetchCourse = async () => {
      const foundCourse = coursesData.find(c => c.id === parseInt(id));
      if (!foundCourse) { navigate('/'); return; }
      setCourse(foundCourse);

      if (account) {
        let purchased = false;

        // Check Fiat first
        const fiatPurchases = JSON.parse(localStorage.getItem(`fiat_${account}`) || "[]");
        if (fiatPurchases.includes(foundCourse.id)) {
          purchased = true;
        }
        // BUG FIX: isCoursePurchased(uint _courseId) — uses msg.sender internally
        else if (contract) {
          try {
            purchased = await contract.isCoursePurchased(foundCourse.id);
          } catch (error) {
            console.error("Error checking web3 purchase status:", error);
          }
        }

        setIsPurchased(purchased);

        if (purchased) {
          const pData = JSON.parse(localStorage.getItem(`progress_${account}`) || "{}");
          if (!pData[foundCourse.id]) {
            pData[foundCourse.id] = 10;
            localStorage.setItem(`progress_${account}`, JSON.stringify(pData));
          }
        }
      }
      setLoading(false);
    };
    fetchCourse();
  }, [id, contract, account, navigate]);

  const handleLessonChange = (idx) => {
    if (!isPurchased) return;
    setActiveLesson(idx);
    if (account && course) {
      const pData = JSON.parse(localStorage.getItem(`progress_${account}`) || "{}");
      const current = pData[course.id] || 10;
      pData[course.id] = Math.min(100, current + 20);
      localStorage.setItem(`progress_${account}`, JSON.stringify(pData));
    }
  };

  const executeWeb3Payment = async () => {
    if (!contract || !course) return;
    try {
      setPurchaseLoading(true);
      const priceWei = ethers.parseEther(course.priceEth);
      const tx = await contract.buyCourse(course.id, { value: priceWei });
      showToast("Transaction sent! Waiting for confirmation...", "info");
      await tx.wait();
      showToast("Course purchased successfully via Web3!", "success");
      setIsPurchased(true);
      setPaymentModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast(error.reason || "Transaction failed", "error");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const executeFiatPayment = () => {
    if (!course) return;
    setPurchaseLoading(true);
    setTimeout(() => {
      const fiatPurchases = JSON.parse(localStorage.getItem(`fiat_${account}`) || "[]");
      if (!fiatPurchases.includes(course.id)) {
        fiatPurchases.push(course.id);
        localStorage.setItem(`fiat_${account}`, JSON.stringify(fiatPurchases));
      }
      showToast("Payment successful via Credit Card/Momo!", "success");
      setIsPurchased(true);
      setPaymentModalOpen(false);
      setPurchaseLoading(false);
    }, 2000);
  };

  if (loading || !course) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}><div className="loader"></div></div>;
  }

  return (
    <div>
      <div className="hero" style={{ padding: '20px 0 40px', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <span className="course-badge" style={{ position: 'static' }}>{course.category}</span>
          <span style={{ color: '#fbbf24', fontWeight: '600' }}>⭐ {course.rating}</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>{course.title}</h1>
        <p className="hero-subtitle" style={{ marginLeft: 0, color: 'white', maxWidth: '800px' }}>{course.description}</p>
        <p style={{ color: 'var(--text-muted)' }}>
          {t("detail_instructed_by")} <strong>{course.instructor}</strong> • {course.studentsEnrolled.toLocaleString()} {t("detail_students")}
        </p>
      </div>

      <div className="detail-container">
        <div className="detail-main">
          {isPurchased ? (
            <div>
              <div className="video-container">
                <iframe
                  className="video-player"
                  src={`${course.videoUrl}?autoplay=1`}
                  title="Course Video"
                  allowFullScreen
                ></iframe>
              </div>
              <h2 style={{ marginBottom: '20px' }}>{t("detail_course_content")}</h2>
              <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                {syllabus.map((lesson, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleLessonChange(idx)}
                    style={{
                      padding: '15px 20px',
                      borderBottom: idx < syllabus.length - 1 ? '1px solid var(--glass-border)' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: activeLesson === idx ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: activeLesson === idx ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem'
                      }}>
                        {idx === activeLesson ? '▶' : idx + 1}
                      </span>
                      <span style={{ fontWeight: activeLesson === idx ? '600' : '400', color: activeLesson === idx ? 'var(--primary-color)' : 'white' }}>
                        {lesson.title}
                      </span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="video-container">
              <div className="locked-overlay">
                <div className="locked-icon">🔒</div>
                <h2>{t("detail_locked_title")}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{t("detail_locked_desc")}</p>
              </div>
            </div>
          )}
        </div>

        {!isPurchased && (
          <div className="detail-sidebar">
            <img src={course.image} alt={course.title} style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }} />
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--accent-color)' }}>
              ⟠ {course.priceEth} ETH
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px', color: 'var(--text-muted)' }}>
              <div>⏱️ {course.duration} {t("detail_ondemand")}</div>
              <div>📱 {t("detail_access")}</div>
              <div>🏆 {t("detail_cert")}</div>
              <div>♾️ {t("detail_lifetime")}</div>
            </div>
            <button
              className="buy-hero-btn"
              onClick={() => {
                if (!account) return showToast("Please connect wallet first", "error");
                setPaymentModalOpen(true);
              }}
            >
              {t("detail_unlock_now")}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '15px' }}>
              {t("detail_money_back")}
            </p>
          </div>
        )}
      </div>

      {paymentModalOpen && (
        <PaymentModal
          course={course}
          onClose={() => { if (!purchaseLoading) setPaymentModalOpen(false); }}
          onPayWeb3={executeWeb3Payment}
          onPayFiat={executeFiatPayment}
          loading={purchaseLoading}
        />
      )}
    </div>
  );
};

export default CourseDetail;
