import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CourseCard = ({ course, isPurchased, onBuy, loading, progress }) => {
  const { t } = useLanguage();

  return (
    <div className="course-card">
      <div className="course-badge">{course.category}</div>
      <img src={course.image} alt={course.title} className="course-image" />
      
      <div className="course-content">
        <div className="course-meta">
          <span className="course-rating">⭐ {course.rating}</span>
          <span>⏱️ {course.duration}</span>
        </div>
        
        <h3 className="course-title">{course.title}</h3>
        <div className="course-instructor">{t("card_by")} {course.instructor}</div>
        <p className="course-desc">{course.description}</p>
        
        {progress !== undefined && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        {progress !== undefined && (
          <div className="progress-text">
            <span>{t("card_overall_progress")}</span>
            <span>{progress}%</span>
          </div>
        )}
        
        <div className="course-footer" style={{ marginTop: progress !== undefined ? '15px' : 'auto' }}>
          {!isPurchased && (
            <div className="course-price">
              ⟠ {course.priceEth} ETH
            </div>
          )}
          
          {isPurchased ? (
            <Link to={`/course/${course.id}`} className="primary-btn" style={{ background: 'var(--accent-color)', width: '100%' }}>
              {progress !== undefined && progress > 0 ? t("card_continue") : t("card_start_learning")}
            </Link>
          ) : (
            <button 
              className="primary-btn" 
              onClick={() => onBuy(course)}
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? <span className="loader"></span> : t("card_unlock")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
