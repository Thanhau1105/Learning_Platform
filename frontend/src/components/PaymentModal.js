import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PaymentModal = ({ course, onClose, onPayWeb3, onPayFiat, loading }) => {
  const { t } = useLanguage();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <h2 style={{ marginBottom: '10px' }}>{t("modal_select_payment")}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          {t("modal_unlocking")} <strong>{course.title}</strong>
        </p>

        <div className="payment-options">
          <div className="payment-option-btn" onClick={() => !loading && onPayWeb3()} style={{ borderColor: 'var(--primary-color)' }}>
            <div className="payment-icon">🦊</div>
            <div className="payment-text">
              <h4>{t("modal_crypto_title")}</h4>
              <p>{course.priceEth} ETH - {t("modal_crypto_desc")}</p>
            </div>
          </div>

          <div className="payment-option-btn" onClick={() => !loading && onPayFiat()}>
            <div className="payment-icon">💳</div>
            <div className="payment-text">
              <h4>{t("modal_fiat_title")}</h4>
              <p>{t("modal_fiat_desc")}</p>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div className="loader"></div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '10px' }}>
              {t("modal_processing")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
