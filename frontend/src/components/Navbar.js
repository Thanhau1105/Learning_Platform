import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ account, onConnect }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState({ displayName: '', avatarUrl: '' });

  const loadProfile = () => {
    if (account) {
      const saved = localStorage.getItem(`profile_${account}`);
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        setProfile({
          displayName: `${account.substring(0, 6)}...${account.substring(account.length - 4)}`,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account}`
        });
      }
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    return () => window.removeEventListener('profileUpdated', loadProfile);
  }, [account]);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        Web3Learn 2.0
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          {t("nav_discovery")}
        </Link>
        {account && (
          <Link to="/my-courses" className={`nav-link ${location.pathname === '/my-courses' ? 'active' : ''}`}>
            {t("nav_my_learning")}
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button 
          onClick={toggleLanguage} 
          style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
        >
          {lang === 'en' ? 'EN' : 'VN'}
        </button>

        {account ? (
          <div className="user-profile-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={profile.avatarUrl} alt="Avatar" className="avatar-small" />
            <span className="user-name">{profile.displayName}</span>
            <span style={{marginLeft: '5px', fontSize: '0.8rem'}}>▼</span>
            
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => navigate('/profile')}>
                  {t("nav_edit_profile")}
                </div>
                <div className="dropdown-item" onClick={() => navigate('/my-courses')}>
                  {t("nav_my_courses")}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="wallet-btn" onClick={onConnect}>
            {t("nav_connect")}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
