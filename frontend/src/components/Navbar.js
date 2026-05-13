import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ account, onConnect }) => {
  const location = useLocation();

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        Web3Learn
      </Link>
      
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          All Courses
        </Link>
        <Link to="/my-courses" className={`nav-link ${location.pathname === '/my-courses' ? 'active' : ''}`}>
          My Courses
        </Link>
      </div>

      <div>
        {account ? (
          <div className="wallet-address">{formatAddress(account)}</div>
        ) : (
          <button className="wallet-btn" onClick={onConnect}>
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
