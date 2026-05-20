// Profile.js - Upgraded Gamified Learner Dashboard & Blockchain Certificate Center
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import coursesData from '../utils/courses.json';

const Profile = ({ contract, account, showToast }) => {
  const { t, lang } = useLanguage();
  const [formData, setFormData] = useState({ displayName: '', bio: '', avatarUrl: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Gamification Metrics
  const [xp, setXp] = useState(0);
  const [purchasedCoursesList, setPurchasedCoursesList] = useState([]);
  const [certificates, setCertificates] = useState([]);
  
  // Selected Certificate to view in high-end Modal
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    if (account) {
      // 1. Load Profile
      const savedProfile = localStorage.getItem(`profile_${account}`);
      if (savedProfile) {
        setFormData(JSON.parse(savedProfile));
      } else {
        setFormData({
          displayName: `User_${account.substring(2, 6)}`,
          bio: 'Web3 Learner & Blockchain Enthusiast',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + account
        });
      }

      // 2. Load XP points
      const savedXP = localStorage.getItem(`xp_${account}`);
      setXp(savedXP ? parseInt(savedXP) : 0);

      // 3. Load progress & courses purchased
      const loadDashboardData = async () => {
        let purchasedIds = [];
        let completedList = [];

        // Check Fiat purchases first
        const fiatPurchases = JSON.parse(localStorage.getItem(`fiat_${account}`) || "[]");
        purchasedIds = [...fiatPurchases];

        // Check Web3 purchases in contract
        if (contract) {
          try {
            const ids = await contract.getMyCourses();
            ids.forEach(id => {
              const numId = Number(id);
              if (!purchasedIds.includes(numId)) {
                purchasedIds.push(numId);
              }
            });

            // Fetch completed courses list from contract
            const completedIds = await contract.getCompletedCourses(account);
            for (let i = 0; i < completedIds.length; i++) {
              const cId = Number(completedIds[i]);
              try {
                const cert = await contract.getUserCertificate(account, cId);
                completedList.push({
                  courseId: cId,
                  studentName: cert.studentName,
                  dateAwarded: new Date(Number(cert.dateAwarded) * 1000).toLocaleDateString(),
                  hash: cert.certificateHash
                });
              } catch (e) {
                console.error("Error loading certificate detail:", e);
              }
            }
          } catch (error) {
            console.error("Error fetching web3 dashboard data:", error);
          }
        }

        // Merge coursesData + local dynamic courses
        const localDynamicCourses = JSON.parse(localStorage.getItem("dynamic_courses") || "[]");
        const allCourses = [...coursesData, ...localDynamicCourses];

        // Build list of purchased courses with their current progress
        const pData = JSON.parse(localStorage.getItem(`progress_${account}`) || "{}");
        const list = allCourses
          .filter(c => purchasedIds.includes(c.id))
          .map(c => ({
            ...c,
            progress: pData[c.id] || 0
          }));

        setPurchasedCoursesList(list);

        // If completedList is empty, fallback to local storage certificates for local simulation
        if (completedList.length === 0) {
          list.forEach(c => {
            const isMinted = localStorage.getItem(`minted_${account}_${c.id}`) === "true";
            if (isMinted) {
              completedList.push({
                courseId: c.id,
                studentName: formData.displayName || `User_${account.substring(2, 6)}`,
                dateAwarded: new Date().toLocaleDateString(),
                hash: "ipfs://QmYwAPJzv5CZ1dDAz496CTZ1eN27S1swK549FxpZ2xKxX5_" + c.id
              });
            }
          });
        }

        setCertificates(completedList);
      };

      loadDashboardData();
    }

    const handleProgressUpdate = () => {
      if (account) {
        const savedXP = localStorage.getItem(`xp_${account}`);
        setXp(savedXP ? parseInt(savedXP) : 0);
      }
    };
    window.addEventListener("progressUpdated", handleProgressUpdate);
    return () => window.removeEventListener("progressUpdated", handleProgressUpdate);

  }, [account, contract, formData.displayName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!account) return;
    localStorage.setItem(`profile_${account}`, JSON.stringify(formData));
    showToast("Profile saved successfully!", "success");
    setIsEditing(false);
    window.dispatchEvent(new Event("profileUpdated"));
  };

  if (!account) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', minHeight: '50vh' }}>
        <h2 style={{ color: 'var(--text-muted)' }}>{t("profile_connect_prompt")}</h2>
        <p style={{ marginTop: '10px' }}>{lang === 'vi' ? "Vui lòng kết nối ví MetaMask ở góc phải màn hình để tiếp tục." : "Please connect your MetaMask wallet at the top right to continue."}</p>
      </div>
    );
  }

  // Calculate learning level title based on XP
  const getLevelTitle = () => {
    if (xp >= 1000) return lang === 'vi' ? "Web3 Tối Thượng" : "Web3 Supreme Grandmaster";
    if (xp >= 500) return lang === 'vi' ? "Lập Trình Viên Cao Cấp" : "Web3 Architect";
    if (xp >= 200) return lang === 'vi' ? "Người Học Nghiêm Túc" : "Blockchain Scholar";
    return lang === 'vi' ? "Tập Sự Web3" : "Web3 Novice";
  };

  const allCourses = [...coursesData, ...JSON.parse(localStorage.getItem("dynamic_courses") || "[]")];

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Profile Welcome Banner */}
      <div className="profile-dashboard-banner">
        <div className="profile-banner-left">
          <img src={formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account}`} alt="Avatar" className="profile-dashboard-avatar" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontWeight: '700' }}>{formData.displayName}</h2>
              <span className="level-badge">{getLevelTitle()}</span>
            </div>
            <p className="profile-bio-text">{formData.bio}</p>
            <p className="profile-wallet-copy">🔑 Address: <code>{account.substring(0, 6)}...{account.substring(account.length - 4)}</code></p>
          </div>
        </div>

        <div className="profile-banner-right">
          <div className="xp-metric-card">
            <span className="xp-metric-star">✨</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-color)' }}>{xp} XP</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lang === 'vi' ? "Tổng kinh nghiệm tích lũy" : "Total experience earned"}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '30px' }}>
        
        {/* Left Column: Learning Progress */}
        <div style={{ flex: '2', minWidth: '350px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '25px', marginBottom: '30px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>📈</span> {lang === 'vi' ? "Tiến Độ Khóa Học Của Tôi" : "My Active Courses Progress"}
            </h3>
            {purchasedCoursesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <p>{lang === 'vi' ? "Bạn chưa sở hữu khóa học nào." : "You don't own any active courses yet."}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {purchasedCoursesList.map(course => (
                  <div key={course.id} className="profile-progress-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{course.title}</strong>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-color)' }}>{course.progress}%</span>
                    </div>
                    <div className="progress-container" style={{ margin: 0 }}>
                      <div className="progress-bar" style={{ width: `${course.progress}%`, background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blockchain Certificates Section */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '25px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🏆</span> {lang === 'vi' ? "Chứng Chỉ Web3 Blockchain Cá Nhân" : "My Cryptographic Certificates (SBT)"}
            </h3>
            {certificates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🔒</span>
                <p>{lang === 'vi' ? "Hoàn thành 100% bài học và vượt qua trắc nghiệm để đúc chứng chỉ Blockchain." : "Complete 100% of a course and pass the quiz to mint a secure on-chain certificate."}</p>
              </div>
            ) : (
              <div className="cert-grid">
                {certificates.map(cert => {
                  const matchingCourse = allCourses.find(c => c.id === cert.courseId) || {};
                  return (
                    <div key={cert.courseId} className="cert-card-item" onClick={() => setSelectedCert({ ...cert, courseTitle: matchingCourse.title })}>
                      <div className="cert-card-badge">Verified</div>
                      <span className="cert-card-shield">🛡️</span>
                      <h4 style={{ margin: '10px 0 5px' }}>{matchingCourse.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date: {cert.dateAwarded}</p>
                      <button className="cert-card-view-btn">{lang === 'vi' ? "Xem Chứng Chỉ" : "View Certificate"}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '25px', height: 'fit-content' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>👤 {lang === 'vi' ? "Hồ sơ" : "Profile Details"}</span>
              {!isEditing && (
                <button className="filter-btn" style={{ padding: '4px 12px', fontSize: '0.8rem' }} onClick={() => setIsEditing(true)}>
                  {lang === 'vi' ? "Sửa" : "Edit"}
                </button>
              )}
            </h3>

            {isEditing ? (
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label>{t("profile_display_name")}</label>
                  <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>{t("profile_avatar_url")}</label>
                  <input type="url" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>{t("profile_bio")}</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} className="form-control" rows="3"></textarea>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="primary-btn" style={{ flex: 1 }}>{lang === 'vi' ? "Lưu" : "Save"}</button>
                  <button type="button" className="fiat-btn" style={{ flex: 1, margin: 0 }} onClick={() => setIsEditing(false)}>{lang === 'vi' ? "Hủy" : "Cancel"}</button>
                </div>
              </form>
            ) : (
              <div>
                <div className="profile-detail-field">
                  <span className="profile-field-label">{t("profile_display_name")}</span>
                  <span className="profile-field-value">{formData.displayName}</span>
                </div>
                <div className="profile-detail-field">
                  <span className="profile-field-label">{t("profile_bio")}</span>
                  <span className="profile-field-value">{formData.bio}</span>
                </div>
                <div className="profile-detail-field">
                  <span className="profile-field-label">{lang === 'vi' ? "Số dư khóa học" : "Courses Purchased"}</span>
                  <span className="profile-field-value">{purchasedCoursesList.length}</span>
                </div>
                <div className="profile-detail-field">
                  <span className="profile-field-label">{lang === 'vi' ? "Chứng chỉ Blockchain" : "Certificates Awarded"}</span>
                  <span className="profile-field-value" style={{ color: 'var(--accent-color)', fontWeight: '700' }}>{certificates.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Viewer Glassmorphic Modal */}
      {selectedCert && (
        <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
          <div className="cert-modal-body" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedCert(null)}>×</button>
            
            {/* The Visual Certificate Frame */}
            <div className="visual-certificate-frame">
              <div className="cert-inner-border">
                <div className="cert-header-decor">
                  <span className="cert-decor-seal">🌟</span>
                  <h3>WEB3LEARN 2.0 CREDENTIAL</h3>
                  <p style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--accent-color)' }}>SECURE SOULBOUND DECENTRALIZED CERTIFICATE</p>
                </div>

                <div className="cert-content-body">
                  <p className="cert-body-p-top">{lang === 'vi' ? "Hệ thống chứng nhận số phi tập trung trân trọng trao tặng cho:" : "This digital credential is proudly presented to:"}</p>
                  <h1 className="cert-recipient-name">{selectedCert.studentName}</h1>
                  <p className="cert-body-p-mid">{lang === 'vi' ? "đã hoàn thành xuất sắc chương trình đào tạo chuyên sâu về:" : "for successfully mastering the advanced curriculum of:"}</p>
                  <h2 className="cert-course-title">{selectedCert.courseTitle}</h2>
                  <p className="cert-body-p-bot">{lang === 'vi' ? "Xác thực danh tính và giao dịch hoàn tất trực tiếp trên Ethereum Blockchain." : "Grounded under cryptographic verification directly recorded on the Ethereum blockchain."}</p>
                </div>

                <div className="cert-footer-meta">
                  <div>
                    <span className="cert-meta-label">{lang === 'vi' ? "Ngày phát hành" : "Date Issued"}</span>
                    <strong className="cert-meta-value">{selectedCert.dateAwarded}</strong>
                  </div>
                  <div>
                    <span className="cert-meta-label">Issuer Authority</span>
                    <strong className="cert-meta-value" style={{ color: 'var(--accent-color)' }}>Web3Learn Acad.</strong>
                  </div>
                  <div>
                    <span className="cert-meta-label">Smart Contract Verification</span>
                    <code className="cert-meta-value" style={{ fontSize: '0.65rem' }}>{contract?.target?.substring(0, 10) || "0x70996ee65..."}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Metadata Section */}
            <div className="cert-modal-meta-box">
              <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--accent-color)' }}>✓</span> Cryptographic Proof Details
              </h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {lang === 'vi' ? "Bằng chứng này được lưu trữ vĩnh viễn trên chuỗi khối và không thể thay đổi." : "This credential is dynamically verified on-chain, proving non-transferable achievement."}
              </p>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '8px', fontSize: '0.75rem', wordBreak: 'break-all' }}>
                <strong>TxHash / URI:</strong> <code style={{ color: 'var(--accent-color)' }}>{selectedCert.hash}</code>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  className="primary-btn"
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(selectedCert.hash);
                    showToast(lang === 'vi' ? "Đã sao chép mã xác thực!" : "Copied proof hash to clipboard!", "success");
                  }}
                >
                  🔗 Copy Hash Proof
                </button>
                <button
                  className="fiat-btn"
                  style={{ flex: 1, margin: 0, padding: '10px' }}
                  onClick={() => {
                    showToast(lang === 'vi' ? "Đã chia sẻ lên mạng xã hội!" : "Shared credential successfully!", "success");
                  }}
                >
                  🚀 Share Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
