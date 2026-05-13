import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import { connectWallet } from './utils/connectWallet';
import { getContract } from './utils/contract';

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConnect = async () => {
    try {
      const { signer, address } = await connectWallet();
      setAccount(address);
      const contractInstance = getContract(signer);
      setContract(contractInstance);
      showToast("Wallet connected successfully!", "success");
    } catch (error) {
      showToast(error.message || "Failed to connect wallet", "error");
    }
  };

  // Re-connect automatically if previously connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(async (accounts) => {
        if (accounts.length > 0) {
          handleConnect();
        }
      });

      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          handleConnect();
        } else {
          setAccount("");
          setContract(null);
        }
      });
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar account={account} onConnect={handleConnect} />
        
        <Routes>
          <Route path="/" element={<Home contract={contract} account={account} showToast={showToast} />} />
          <Route path="/course/:id" element={<CourseDetail contract={contract} account={account} showToast={showToast} />} />
          <Route path="/my-courses" element={<MyCourses contract={contract} account={account} />} />
        </Routes>

        {toast && (
          <div className="toast-container">
            <div className={`toast ${toast.type}`}>
              {toast.message}
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
