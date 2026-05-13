import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Profile = ({ account, showToast }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ displayName: '', bio: '', avatarUrl: '' });

  useEffect(() => {
    if (account) {
      const savedProfile = localStorage.getItem(`profile_${account}`);
      if (savedProfile) {
        setFormData(JSON.parse(savedProfile));
      } else {
        setFormData({
          displayName: `User_${account.substring(2, 6)}`,
          bio: '',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + account
        });
      }
    }
  }, [account]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!account) return;
    localStorage.setItem(`profile_${account}`, JSON.stringify(formData));
    showToast("Profile saved successfully!", "success");
    window.dispatchEvent(new Event("profileUpdated"));
  };

  if (!account) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>{t("profile_connect_prompt")}</h2>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2 style={{ marginBottom: '30px' }}>{t("profile_title")}</h2>
      <form onSubmit={handleSave}>
        <div style={{ textAlign: 'center' }}>
          <img
            src={formData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account}`}
            alt="Avatar"
            className="avatar-preview"
          />
        </div>

        <div className="form-group">
          <label>{t("profile_display_name")}</label>
          <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="form-control" required />
        </div>

        <div className="form-group">
          <label>{t("profile_avatar_url")}</label>
          <input type="url" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="form-control" placeholder="https://example.com/avatar.png" />
        </div>

        <div className="form-group">
          <label>{t("profile_bio")}</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} className="form-control" rows="4" placeholder="Tell us about yourself..."></textarea>
        </div>

        <div className="form-group">
          <label>{t("profile_wallet")}</label>
          <input type="text" value={account} className="form-control" disabled style={{ color: 'var(--text-muted)' }} />
        </div>

        <button type="submit" className="primary-btn" style={{ width: '100%' }}>{t("profile_save")}</button>
      </form>
    </div>
  );
};

export default Profile;
