import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import coursesData from '../utils/courses.json';

const CourseDetail = ({ contract, account, showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  const course = coursesData.find(c => c.id === Number(id));

  useEffect(() => {
    const checkOwnership = async () => {
      if (!course) return;
      if (contract && account) {
        try {
          const purchased = await contract.isCoursePurchased(course.id);
          setIsPurchased(purchased);
        } catch (error) {
          console.error("Check ownership error:", error);
        }
      } else {
        setIsPurchased(false);
      }
      setLoading(false);
    };
    checkOwnership();
  }, [contract, account, course]);

  const handleBuy = async () => {
    if (!contract || !account) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    try {
      setBuying(true);
      showToast("Initiating transaction...", "info");
      
      const priceWei = ethers.parseEther(course.priceEth);
      const tx = await contract.buyCourse(course.id, { value: priceWei });
      
      showToast("Transaction sent! Waiting for confirmation...", "info");
      await tx.wait();
      
      showToast("Course purchased successfully!", "success");
      setIsPurchased(true);
    } catch (error) {
      console.error(error);
      showToast(error.reason || "Transaction failed", "error");
    } finally {
      setBuying(false);
    }
  };

  if (!course) {
    return <div style={{textAlign: 'center', marginTop: '50px'}}><h2>Course Not Found</h2></div>;
  }

  return (
    <div className="detail-container">
      <button 
        onClick={() => navigate(-1)} 
        style={{background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1rem', width: 'fit-content'}}
      >
        ← Back
      </button>

      <div className="detail-header">
        <h1 className="page-title">{course.title}</h1>
        <p className="page-subtitle" style={{marginBottom: '20px'}}>{course.description}</p>
      </div>

      <div className="video-container">
        {loading ? (
          <div className="locked-overlay">
            <div className="loader"></div>
            <p>Checking ownership...</p>
          </div>
        ) : isPurchased ? (
          <iframe 
            className="video-player"
            src={course.videoUrl} 
            title="Course Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        ) : (
          <div className="locked-overlay">
            <span className="locked-icon">🔒</span>
            <h2>Content Locked</h2>
            <p>Purchase this course to unlock lifetime access on the blockchain.</p>
            <button 
              className="buy-hero-btn" 
              onClick={handleBuy}
              disabled={buying}
            >
              {buying ? <span className="loader"></span> : `Unlock for ${course.priceEth} ETH`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
