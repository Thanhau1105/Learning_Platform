import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import coursesData from '../utils/courses.json';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const MyCourses = ({ contract, account }) => {
  const { t } = useLanguage();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!account) {
        setMyCourses([]);
        setLoading(false);
        return;
      }

      let purchasedIds = [];

      if (contract) {
        try {
          const ids = await contract.getMyCourses();
          purchasedIds = [...purchasedIds, ...ids.map(id => Number(id))];
        } catch (error) {
          console.error("Error fetching web3 courses:", error);
        }
      }

      const fiatPurchases = JSON.parse(localStorage.getItem(`fiat_${account}`) || "[]");
      purchasedIds = [...new Set([...purchasedIds, ...fiatPurchases])];

      const filteredCourses = coursesData.filter(c => purchasedIds.includes(c.id));
      setMyCourses(filteredCourses);

      const pData = JSON.parse(localStorage.getItem(`progress_${account}`) || "{}");
      setProgressData(pData);

      setLoading(false);
    };

    fetchMyCourses();
  }, [contract, account]);

  if (!account) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>{t("profile_connect_prompt")}</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="hero" style={{ padding: '20px 0 40px', textAlign: 'left' }}>
        <h1 className="hero-title">{t("my_learning_title")}</h1>
        <p className="hero-subtitle" style={{ marginLeft: 0 }}>{t("my_learning_subtitle")}</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}><div className="loader"></div></div>
      ) : myCourses.length > 0 ? (
        <div className="courses-grid">
          {myCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isPurchased={true}
              onBuy={() => {}}
              progress={progressData[course.id] || 0}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', background: 'var(--card-bg)', padding: '50px', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
          <h2 style={{ marginBottom: '20px' }}>{t("my_learning_empty")}</h2>
          <Link to="/" className="primary-btn" style={{ textDecoration: 'none' }}>{t("my_learning_explore")}</Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
