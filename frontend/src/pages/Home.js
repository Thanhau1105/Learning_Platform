import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CourseCard from '../components/CourseCard';
import coursesData from '../utils/courses.json';

const Home = ({ contract, account, showToast }) => {
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchPurchased = async () => {
      if (contract && account) {
        try {
          const ids = await contract.getMyCourses();
          // ids will be an array of BigInt
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

  const handleBuy = async (course) => {
    if (!contract || !account) {
      showToast("Please connect your wallet first", "error");
      return;
    }

    try {
      setLoadingId(course.id);
      showToast("Initiating transaction...", "info");
      
      const priceWei = ethers.parseEther(course.priceEth);
      const tx = await contract.buyCourse(course.id, { value: priceWei });
      
      showToast("Transaction sent! Waiting for confirmation...", "info");
      await tx.wait();
      
      showToast("Course purchased successfully!", "success");
      setPurchasedIds(prev => [...prev, course.id]);
    } catch (error) {
      console.error(error);
      showToast(error.reason || "Transaction failed", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h1 className="page-title">Explore Web3 Courses</h1>
      <p className="page-subtitle">Master blockchain development and secure your ownership on-chain.</p>
      
      <div className="courses-grid">
        {coursesData.map(course => (
          <CourseCard 
            key={course.id}
            course={course}
            isPurchased={purchasedIds.includes(course.id)}
            onBuy={handleBuy}
            loading={loadingId === course.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
