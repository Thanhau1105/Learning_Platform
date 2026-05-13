import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, isPurchased, onBuy, loading }) => {
  return (
    <div className="course-card">
      <img src={course.image} alt={course.title} className="course-image" />
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>
        
        <div className="course-footer">
          <div className="course-price">
            ⟠ {course.priceEth} ETH
          </div>
          
          {isPurchased ? (
            <Link to={`/course/${course.id}`} className="primary-btn" style={{ background: 'var(--accent-color)', textDecoration: 'none' }}>
              Watch Now
            </Link>
          ) : (
            <button 
              className="primary-btn" 
              onClick={() => onBuy(course)}
              disabled={loading}
            >
              {loading ? <span className="loader"></span> : 'Buy Course'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
