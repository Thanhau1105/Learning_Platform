import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import coursesData from '../utils/courses.json';
import { Link } from 'react-router-dom';

const MyCourses = ({ contract, account }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (contract && account) {
        try {
          const ids = await contract.getMyCourses();
          const purchasedIds = ids.map(id => Number(id));
          
          const filteredCourses = coursesData.filter(c => purchasedIds.includes(c.id));
          setMyCourses(filteredCourses);
        } catch (error) {
          console.error("Error fetching my courses:", error);
        }
      } else {
        setMyCourses([]);
      }
      setLoading(false);
    };
    
    fetchMyCourses();
  }, [contract, account]);

  if (!account) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Please connect your wallet to view your courses</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">My Learning</h1>
      <p className="page-subtitle">Courses you have purchased and own permanently.</p>
      
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
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px', background: 'var(--card-bg)', padding: '50px', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
          <h2 style={{ marginBottom: '20px' }}>You haven't purchased any courses yet</h2>
          <Link to="/" className="primary-btn" style={{ textDecoration: 'none' }}>Browse Courses</Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
