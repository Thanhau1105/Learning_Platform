// CourseDetail.js - Upgraded Interactive Course Classroom with Web3 Certificate Minting, Discussion Q&A, and AI Assistant
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coursesData from '../utils/courses.json';
import PaymentModal from '../components/PaymentModal';
import { ethers } from 'ethers';
import { useLanguage } from '../context/LanguageContext';
import { courseLessons } from '../utils/courseLessons';
import { getAIResponse } from '../components/AIAssistant';

const CourseDetail = ({ contract, account, showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [course, setCourse] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  
  // Classroom Curriculum & Progress States
  const [syllabus, setSyllabus] = useState([]);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  
  // Web3 Certificate States
  const [certName, setCertName] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isMintedOnChain, setIsMintedOnChain] = useState(false);
  const [mintedTxHash, setMintedTxHash] = useState("");

  // Tab Navigation: 'curriculum' | 'discussion' | 'resources' | 'ai_assistant'
  const [activeTab, setActiveTab] = useState('curriculum');

  // Discussions State
  const [discussionList, setDiscussionList] = useState([]);
  const [newComment, setNewComment] = useState("");

  // AI Tab State
  const [aiQuery, setAiQuery] = useState("");
  const [aiAnswers, setAiAnswers] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      // Check static list or fetch dynamic list from localStorage
      let foundCourse = coursesData.find(c => c.id === parseInt(id));
      if (!foundCourse) {
        const localDynamicCourses = JSON.parse(localStorage.getItem("dynamic_courses") || "[]");
        foundCourse = localDynamicCourses.find(c => c.id === parseInt(id));
      }
      
      if (!foundCourse) { navigate('/'); return; }
      setCourse(foundCourse);

      // Load syllabus details
      const syllabusData = courseLessons[foundCourse.id] || courseLessons[3]; // fallback
      setSyllabus(syllabusData.lessons);

      if (account) {
        let purchased = false;

        // Check Fiat first
        const fiatPurchases = JSON.parse(localStorage.getItem(`fiat_${account}`) || "[]");
        if (fiatPurchases.includes(foundCourse.id)) {
          purchased = true;
        }
        // Check Contract
        else if (contract) {
          try {
            purchased = await contract.isCoursePurchased(foundCourse.id);
          } catch (error) {
            console.error("Error checking web3 purchase status:", error);
          }
        }

        setIsPurchased(purchased);

        if (purchased) {
          // Initialize/read progress
          const pData = JSON.parse(localStorage.getItem(`progress_${account}`) || "{}");
          if (!pData[foundCourse.id]) {
            pData[foundCourse.id] = 10;
            localStorage.setItem(`progress_${account}`, JSON.stringify(pData));
          }

          // Check if already minted certificate on-chain
          if (contract) {
            try {
              const onChainCert = await contract.getUserCertificate(account, foundCourse.id);
              if (onChainCert.courseId.toString() !== "0") {
                setIsMintedOnChain(true);
                setCertName(onChainCert.studentName);
                setQuizPassed(true);
                setQuizSubmitted(true);
              }
            } catch (err) {
              console.error("Error fetching on-chain certificate:", err);
            }
          }
        }
      }
      
      // Load initial discussions
      const savedDiscussions = localStorage.getItem(`discussions_${foundCourse.id}`);
      if (savedDiscussions) {
        setDiscussionList(JSON.parse(savedDiscussions));
      } else {
        const dummyDiscussions = [
          {
            id: 1,
            author: "Vitalik_St",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalik",
            date: "2 days ago",
            content: lang === 'vi' ? "Khóa học này thực sự rất thực tế và chi tiết! Phần smart contract được trình bày dễ hiểu." : "This course is incredibly detailed and practical! The smart contract section is explained very cleanly."
          },
          {
            id: 2,
            author: "Satoshi_Dev",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Satoshi",
            date: "1 day ago",
            content: lang === 'vi' ? "Có ai bị lỗi khi deploy Hardhat lên local Ganache không? Hãy nhớ đổi Port sang 7545 nhé!" : "Anyone getting errors deploying Hardhat to local Ganache? Remember to switch your Port config to 7545!"
          }
        ];
        setDiscussionList(dummyDiscussions);
        localStorage.setItem(`discussions_${foundCourse.id}`, JSON.stringify(dummyDiscussions));
      }

      setLoading(false);
    };
    
    fetchCourse();
  }, [id, contract, account, navigate, lang]);

  const handleLessonChange = (idx) => {
    if (!isPurchased) return;
    setActiveLessonIdx(idx);
    
    // Update progress in localStorage
    if (account && course) {
      const pData = JSON.parse(localStorage.getItem(`progress_${account}`) || "{}");
      const current = pData[course.id] || 10;
      
      // Increase progress by 25% per lesson watched, cap at 100%
      const newProgress = Math.min(100, Math.max(current, Math.round(((idx + 1) / syllabus.length) * 100)));
      pData[course.id] = newProgress;
      localStorage.setItem(`progress_${account}`, JSON.stringify(pData));
      
      // Award XP for learning: 50 XP per new progress milestone
      const prevXP = parseInt(localStorage.getItem(`xp_${account}`) || "0");
      if (newProgress > current) {
        const xpEarned = (newProgress - current) * 5;
        localStorage.setItem(`xp_${account}`, (prevXP + xpEarned).toString());
      }
      
      window.dispatchEvent(new Event("progressUpdated"));
    }
  };

  const handleQuizAnswerSelect = (qIdx, optIdx) => {
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    const syllabusData = courseLessons[course.id] || courseLessons[3];
    const quizQuestions = syllabusData.quiz;
    
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    setQuizSubmitted(true);
    
    if (correctCount === quizQuestions.length) {
      setQuizPassed(true);
      showToast(lang === 'vi' ? "Chúc mừng! Bạn đã đạt 100% và mở khóa Chứng chỉ!" : "Congratulations! You scored 100% and unlocked your Certificate!", "success");
      
      // Award 150 XP for passing the quiz
      if (account) {
        const prevXP = parseInt(localStorage.getItem(`xp_${account}`) || "0");
        localStorage.setItem(`xp_${account}`, (prevXP + 150).toString());
        window.dispatchEvent(new Event("progressUpdated"));
      }
    } else {
      setQuizPassed(false);
      showToast(lang === 'vi' ? `Bạn chỉ đạt ${correctCount}/${quizQuestions.length}. Hãy thử lại nhé!` : `You scored ${correctCount}/${quizQuestions.length}. Please try again!`, "error");
    }
  };

  const handleMintCertificate = async (e) => {
    e.preventDefault();
    if (!account) return showToast("Please connect wallet", "error");
    if (!certName.trim()) return showToast("Please enter your name", "error");
    if (!contract) return showToast("Smart Contract not connected", "error");

    try {
      setIsMinting(true);
      const simulatedHash = "ipfs://QmYwAPJzv5CZ1dDAz496CTZ1eN27S1swK549FxpZ2xKxX5_" + course.id;
      
      const tx = await contract.mintCertificate(course.id, certName, simulatedHash);
      showToast(lang === 'vi' ? "Giao dịch đúc chứng chỉ đã gửi! Đang chờ xác nhận..." : "Certificate mint transaction sent! Waiting for confirmation...", "info");
      
      const receipt = await tx.wait();
      setMintedTxHash(receipt.hash);
      setIsMintedOnChain(true);
      showToast(lang === 'vi' ? "Đúc chứng chỉ Blockchain thành công vĩnh viễn!" : "On-chain Blockchain Certificate minted successfully!", "success");
      
      // Save locally
      localStorage.setItem(`minted_${account}_${course.id}`, "true");
      
      // Add extra 200 XP for on-chain minting
      const prevXP = parseInt(localStorage.getItem(`xp_${account}`) || "0");
      localStorage.setItem(`xp_${account}`, (prevXP + 200).toString());
      window.dispatchEvent(new Event("progressUpdated"));

    } catch (error) {
      console.error(error);
      showToast(error.reason || error.message || "Minting failed", "error");
    } finally {
      setIsMinting(false);
    }
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !account) return;

    const userProfile = JSON.parse(localStorage.getItem(`profile_${account}`) || "{}");
    const newCommentObj = {
      id: Date.now(),
      author: userProfile.displayName || `User_${account.substring(2, 6)}`,
      avatar: userProfile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account}`,
      date: lang === 'vi' ? "Vừa xong" : "Just now",
      content: newComment
    };

    const updatedList = [newCommentObj, ...discussionList];
    setDiscussionList(updatedList);
    localStorage.setItem(`discussions_${course.id}`, JSON.stringify(updatedList));
    setNewComment("");
    showToast(lang === 'vi' ? "Đã đăng câu hỏi thành công!" : "Comment posted successfully!", "success");
  };

  const handleAISubmit = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userQ = aiQuery;
    setAiAnswers(prev => [...prev, { sender: 'user', text: userQ }]);
    setAiQuery("");
    setAiTyping(true);

    setTimeout(() => {
      const response = getAIResponse(userQ, lang, course.title);
      setAiAnswers(prev => [...prev, { sender: 'ai', text: response }]);
      setAiTyping(false);
    }, 1000);
  };

  const executeWeb3Payment = async () => {
    if (!contract || !course) return;
    try {
      setPurchaseLoading(true);
      const priceWei = ethers.parseEther(course.priceEth || course.price);
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

  const activeLesson = syllabus[activeLessonIdx] || syllabus[0] || {};
  const currentCourseLessons = courseLessons[course.id] || courseLessons[3];

  return (
    <div>
      {/* Header Banner */}
      <div className="hero" style={{ padding: '20px 0 40px', textAlign: 'left' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <span className="course-badge" style={{ position: 'static' }}>{course.category}</span>
          <span style={{ color: '#fbbf24', fontWeight: '600' }}>⭐ {course.rating}</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>{course.title}</h1>
        <p className="hero-subtitle" style={{ marginLeft: 0, color: 'white', maxWidth: '800px' }}>{course.description}</p>
        <p style={{ color: 'var(--text-muted)' }}>
          {t("detail_instructed_by")} <strong>{course.instructor}</strong> • {(course.studentsEnrolled || 240).toLocaleString()} {t("detail_students")}
        </p>
      </div>

      <div className="detail-container">
        <div className="detail-main">
          {isPurchased ? (
            <div>
              {/* Media Display Area */}
              <div className="video-container" style={{ background: '#111827' }}>
                {activeLesson.type === 'video' && (
                  <iframe
                    className="video-player"
                    src={`${activeLesson.videoUrl || course.videoUrl}?autoplay=1`}
                    title="Course Video"
                    allowFullScreen
                  ></iframe>
                )}

                {activeLesson.type === 'reading' && (
                  <div className="reading-container">
                    <div style={{
                      padding: '30px', color: 'var(--text-color)', height: '100%', overflowY: 'auto',
                      fontFamily: 'Outfit, sans-serif', lineHeight: '1.7'
                    }}>
                      <div className="reading-glow-orb"></div>
                      <div dangerouslySetInnerHTML={{
                        __html: activeLesson.content[lang]
                          .replace(/### (.*?)\n/g, '<h3 class="read-h3">$1</h3>')
                          .replace(/#### (.*?)\n/g, '<h4 class="read-h4">$2</h4>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/```solidity([\s\S]*?)```/g, '<pre class="read-code"><code>$1</code></pre>')
                          .replace(/```rust([\s\S]*?)```/g, '<pre class="read-code"><code>$1</code></pre>')
                          .replace(/\n/g, '<br/>')
                      }} />
                    </div>
                  </div>
                )}

                {activeLesson.type === 'quiz' && (
                  <div className="quiz-panel">
                    <div style={{ padding: '30px', height: '100%', overflowY: 'auto', position: 'relative' }}>
                      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📝</span> {lang === 'vi' ? "Trắc Nghiệm Đánh Giá Khóa Học" : "Final Course Quiz Assessment"}
                      </h3>
                      
                      {currentCourseLessons.quiz.map((q, qIdx) => (
                        <div key={qIdx} className="quiz-q-card">
                          <p className="quiz-question"><strong>Q{qIdx + 1}:</strong> {q.question[lang]}</p>
                          <div className="quiz-options-grid">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[qIdx] === optIdx;
                              let borderStyle = '1px solid var(--glass-border)';
                              let bgStyle = 'rgba(255,255,255,0.02)';
                              
                              if (isSelected) {
                                borderStyle = '1px solid var(--primary-color)';
                                bgStyle = 'rgba(59, 130, 246, 0.15)';
                              }
                              if (quizSubmitted) {
                                if (optIdx === q.correctAnswer) {
                                  borderStyle = '1px solid var(--accent-color)';
                                  bgStyle = 'rgba(16, 185, 129, 0.15)';
                                } else if (isSelected && quizAnswers[qIdx] !== q.correctAnswer) {
                                  borderStyle = '1px solid var(--danger-color)';
                                  bgStyle = 'rgba(239, 68, 68, 0.15)';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  className="quiz-option-btn"
                                  onClick={() => !quizSubmitted && handleQuizAnswerSelect(qIdx, optIdx)}
                                  style={{
                                    border: borderStyle, background: bgStyle,
                                    color: isSelected ? 'white' : 'var(--text-muted)'
                                  }}
                                  disabled={quizSubmitted}
                                >
                                  {opt[lang]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {!quizSubmitted ? (
                        <button
                          className="primary-btn"
                          style={{ width: '100%', marginTop: '20px', padding: '15px' }}
                          onClick={submitQuiz}
                          disabled={Object.keys(quizAnswers).length < currentCourseLessons.quiz.length}
                        >
                          {lang === 'vi' ? "Nộp bài kiểm tra" : "Submit Assessment"}
                        </button>
                      ) : (
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                          {quizPassed ? (
                            <div className="quiz-success-card">
                              <h4>🎉 {lang === 'vi' ? "Tuyệt vời! Bạn đạt điểm tối đa!" : "Awesome! You scored 100%!"}</h4>
                              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '10px 0' }}>
                                {lang === 'vi' ? "Bạn đã mở khóa thành công quyền hạn nhận Chứng chỉ vĩnh viễn trên Blockchain." : "You have successfully unlocked the right to mint your permanent Certificate on the Blockchain."}
                              </p>
                              {!isMintedOnChain ? (
                                <form onSubmit={handleMintCertificate} className="mint-form">
                                  <input
                                    type="text"
                                    placeholder={lang === 'vi' ? "Nhập tên hiển thị trên chứng chỉ..." : "Enter your Full Name..."}
                                    value={certName}
                                    onChange={(e) => setCertName(e.target.value)}
                                    className="form-control"
                                    style={{ marginBottom: '10px', textAlign: 'center' }}
                                    required
                                    disabled={isMinting}
                                  />
                                  <button type="submit" className="buy-hero-btn" style={{ margin: 0 }} disabled={isMinting}>
                                    {isMinting ? <span className="loader"></span> : (lang === 'vi' ? "Mint Chứng Chỉ Blockchain (Web3)" : "Mint Blockchain Certificate (Web3)")}
                                  </button>
                                </form>
                              ) : (
                                <div className="cert-minted-badge">
                                  <span style={{ fontSize: '2rem' }}>🏆</span>
                                  <h4>{lang === 'vi' ? "Chứng Chỉ Đã Được Đúc Trên Chuỗi" : "Certificate Minted On-Chain"}</h4>
                                  <p style={{ fontSize: '0.85rem' }}>Recipient: <strong>{certName}</strong></p>
                                  {mintedTxHash && (
                                    <a
                                      href={`https://etherscan.io/tx/${mintedTxHash}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="tx-hash-link"
                                    >
                                      TxHash: {mintedTxHash.substring(0, 16)}...
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              className="fiat-btn"
                              onClick={() => {
                                setQuizSubmitted(false);
                                setQuizAnswers({});
                              }}
                            >
                              🔄 {lang === 'vi' ? "Làm lại bài kiểm tra" : "Retake Assessment"}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Action Tabs */}
              <div className="classroom-tabs">
                <button
                  className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                  onClick={() => setActiveTab('curriculum')}
                >
                  📖 {lang === 'vi' ? "Nội dung bài học" : "Curriculum"}
                </button>
                <button
                  className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`}
                  onClick={() => setActiveTab('discussion')}
                >
                  💬 {lang === 'vi' ? "Hỏi đáp thảo luận" : "Discussions"}
                </button>
                <button
                  className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resources')}
                >
                  📁 {lang === 'vi' ? "Tài nguyên" : "Resources"}
                </button>
                <button
                  className={`tab-btn ${activeTab === 'ai_assistant' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ai_assistant')}
                  style={{ border: '1px solid rgba(139, 92, 246, 0.3)', color: 'var(--accent-color)' }}
                >
                  🤖 Smart AI Chat
                </button>
              </div>

              <div className="tab-content-panel">
                {/* Tab: Curriculum */}
                {activeTab === 'curriculum' && (
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
                          background: activeLessonIdx === idx ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: activeLessonIdx === idx ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem'
                          }}>
                            {lesson.type === 'quiz' ? '📝' : activeLessonIdx === idx ? '▶' : idx + 1}
                          </span>
                          <span style={{ fontWeight: activeLessonIdx === idx ? '600' : '400', color: activeLessonIdx === idx ? 'var(--primary-color)' : 'white' }}>
                            {lesson.title[lang]}
                          </span>
                          {lesson.type === 'reading' && <span className="type-badge reading">Doc</span>}
                          {lesson.type === 'quiz' && <span className="type-badge quiz">Test</span>}
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab: Discussions */}
                {activeTab === 'discussion' && (
                  <div className="classroom-discussion">
                    <form onSubmit={submitComment} className="comment-form-box">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder={lang === 'vi' ? "Đặt câu hỏi hoặc chia sẻ cảm nghĩ của bạn..." : "Ask a question or share your learning thoughts..."}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                      <button type="submit" className="primary-btn" style={{ marginTop: '10px', alignSelf: 'flex-end' }}>
                        {lang === 'vi' ? "Đăng thảo luận" : "Post Comment"}
                      </button>
                    </form>

                    <div className="comments-list">
                      {discussionList.map(comment => (
                        <div key={comment.id} className="comment-card">
                          <img src={comment.avatar} alt="Avatar" className="comment-avatar" />
                          <div style={{ flexGrow: 1 }}>
                            <div className="comment-meta">
                              <strong>{comment.author}</strong>
                              <span>{comment.date}</span>
                            </div>
                            <p className="comment-text">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Resources */}
                {activeTab === 'resources' && (
                  <div className="classroom-resources">
                    <h4>📂 {lang === 'vi' ? "Tài liệu và Liên kết đính kèm" : "Downloadable Resources & Codebases"}</h4>
                    <div style={{ display: 'grid', gap: '12px', marginTop: '15px' }}>
                      {currentCourseLessons.resources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="resource-item-card"
                        >
                          <div>
                            <strong>{res.name}</strong>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.url}</p>
                          </div>
                          <span style={{ fontSize: '1.2rem' }}>📥</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: AI Assistant inline */}
                {activeTab === 'ai_assistant' && (
                  <div className="classroom-ai-tab">
                    <div className="ai-tab-intro">
                      <h4>🤖 Contextual Learning AI Coach</h4>
                      <p>{lang === 'vi' ? `Bạn đang gặp thắc mắc về bài học? Hãy trò chuyện với AI chuyên gia đồng hành cùng khóa học "${course.title}".` : `Got questions about this lesson? Ask your dynamic AI coach tailored directly for "${course.title}".`}</p>
                    </div>

                    <div className="ai-tab-chat-area">
                      {aiAnswers.map((ans, idx) => (
                        <div key={idx} className={`ai-message-wrapper ${ans.sender}`}>
                          <div className={`ai-message-avatar ${ans.sender === 'ai' ? 'ai-avatar' : 'user-avatar'}`}>
                            {ans.sender === 'ai' ? '🤖' : '👤'}
                          </div>
                          <div className="ai-message-bubble">
                            <div dangerouslySetInnerHTML={{
                              __html: ans.text
                                .replace(/### (.*?)\n/g, '<h4 class="ai-msg-h4">$1</h4>')
                                .replace(/#### (.*?)\n/g, '<h5 class="ai-msg-h5">$1</h5>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/```solidity([\s\S]*?)```/g, '<pre class="ai-code-block"><div class="ai-code-header">SOLIDITY</div><code>$1</code></pre>')
                                .replace(/```rust([\s\S]*?)```/g, '<pre class="ai-code-block"><div class="ai-code-header">RUST</div><code>$1</code></pre>')
                                .replace(/\n/g, '<br/>')
                            }} />
                          </div>
                        </div>
                      ))}
                      {aiTyping && (
                        <div className="ai-message-wrapper ai">
                          <div className="ai-message-avatar ai-avatar">🤖</div>
                          <div className="ai-message-bubble typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleAISubmit} className="ai-tab-input-box">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={lang === 'vi' ? "Hỏi trợ lý AI... (Ví dụ: reentrancy hack là gì?)" : "Ask AI... (e.g. how constant product AMM works?)"}
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        required
                      />
                      <button type="submit" className="primary-btn">{lang === 'vi' ? "Hỏi" : "Ask"}</button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Locked Preview Overlay */
            <div className="video-container">
              <div className="locked-overlay">
                <div className="locked-icon">🔒</div>
                <h2>{t("detail_locked_title")}</h2>
                <p style={{ color: 'var(--text-muted)' }}>{t("detail_locked_desc")}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {!isPurchased && (
          <div className="detail-sidebar">
            <img src={course.image} alt={course.title} style={{ width: '100%', borderRadius: '10px', marginBottom: '20px' }} />
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px', color: 'var(--accent-color)' }}>
              ⟠ {course.priceEth || course.price} ETH
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px', color: 'var(--text-muted)' }}>
              <div>⏱️ {course.duration || "10 hours"} {t("detail_ondemand")}</div>
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
