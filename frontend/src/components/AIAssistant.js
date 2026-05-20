// AIAssistant.js - Premium Web3 AI Learning Assistant Component
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Direct contextual keywords response engine
const getAIResponse = (msg, contextLang, courseTitle = "") => {
  const query = msg.toLowerCase().trim();
  const isVi = contextLang === 'vi';
  
  // Custom response templates
  if (query.includes("solidity") || query.includes("contract") || query.includes("hợp đồng")) {
    return isVi ? 
      `### Hướng Dẫn Về Lập Trình Solidity 🚀\n\nSolidity là ngôn ngữ chính để phát triển Smart Contract trên Ethereum Virtual Machine (EVM). Dưới đây là một mẫu hợp đồng đơn giản để lưu trữ dữ liệu:\n\n\`\`\`solidity\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract Storage {\n    uint256 private number;\n\n    function store(uint256 num) public {\n        number = num;\n    }\n\n    function retrieve() public view returns (uint256) {\n        return number;\n    }\n}\n\`\`\`\n\n💡 **Lời khuyên**: Hãy luôn chú ý đến bảo mật (tránh lỗ hổng Reentrancy) và tối ưu hóa biến lưu trữ (\`storage\` vs \`memory\`) để tiết kiệm phí gas!` :
      `### Solidity Programming Guide 🚀\n\nSolidity is the primary language for developing smart contracts on the Ethereum Virtual Machine (EVM). Here is a simple storage contract to get you started:\n\n\`\`\`solidity\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.20;\n\ncontract Storage {\n    uint256 private number;\n\n    function store(uint256 num) public {\n        number = num;\n    }\n\n    function retrieve() public view returns (uint256) {\n        return number;\n    }\n}\n\`\`\`\n\n💡 **Tip**: Always pay attention to security (avoid Reentrancy) and optimize variables (\`storage\` vs \`memory\`) to save on Gas Fees!`;
  }
  
  if (query.includes("reentrancy") || query.includes("reentrant") || query.includes("gọi lại") || query.includes("hack") || query.includes("audit") || query.includes("security") || query.includes("bảo mật")) {
    return isVi ?
      `### Phòng Chống Lỗ Hổng Reentrancy (Tấn công Gọi Lại) 🛡️\n\nĐây là lỗ hổng nguy hiểm bậc nhất trong Web3. Kẻ tấn công lợi dụng việc gửi ETH trước khi cập nhật số dư để rút tiền đệ quy.\n\n#### Giải pháp tối ưu:\n1. Áp dụng mẫu thiết kế **Checks-Effects-Interactions**.\n2. Sử dụng thư viện \`ReentrancyGuard\` của OpenZeppelin.\n\n\`\`\`solidity\nimport "@openzeppelin/contracts/security/ReentrancyGuard.sol";\n\ncontract SecureWallet is ReentrancyGuard {\n    mapping(address => uint) public balances;\n\n    function withdraw() external nonReentrant {\n        uint amount = balances[msg.sender];\n        require(amount > 0, "No balance");\n        \n        balances[msg.sender] = 0; // Thay đổi trạng thái trước (Effect)\n        payable(msg.sender).transfer(amount); // Tương tác sau (Interaction)\n    }\n}\n\`\`\`` :
      `### Preventing Reentrancy Vulnerability 🛡️\n\nThis is one of the most dangerous vulnerabilities in Web3. The attacker exploits the contract by calling back into the withdraw function before the state changes are written.\n\n#### Best Practice Solutions:\n1. Apply the **Checks-Effects-Interactions** pattern.\n2. Use OpenZeppelin's \`ReentrancyGuard\` library.\n\n\`\`\`solidity\nimport "@openzeppelin/contracts/security/ReentrancyGuard.sol";\n\ncontract SecureWallet is ReentrancyGuard {\n    mapping(address => uint) public balances;\n\n    function withdraw() external nonReentrant {\n        uint amount = balances[msg.sender];\n        require(amount > 0, "No balance");\n        \n        balances[msg.sender] = 0; // State change first (Effect)\n        payable(msg.sender).transfer(amount); // Interaction last (Interaction)\n    }\n}\n\`\`\``;
  }

  if (query.includes("defi") || query.includes("dex") || query.includes("swap") || query.includes("uniswap") || query.includes("finance")) {
    return isVi ?
      `### DeFi & Các sàn Giao Dịch Phi Tập Trung (DEX) 💸\n\nDeFi (Tài chính phi tập trung) loại bỏ bên thứ ba trung gian nhờ Smart Contract. Uniswap hoạt động dựa trên mô hình **AMM (Automated Market Maker)** sử dụng công thức hằng số sản phẩm:\n\n$$\\text{x} \\times \\text{y} = \\text{k}$$\n\n*Trong đó:* \n- \`x\` và \`y\` là số lượng của hai token trong bể thanh khoản (Liquidity Pool).\n- \`k\` là hằng số sản phẩm không đổi.\n\nKhi bạn mua token X, số lượng X trong bể giảm, dẫn đến giá của X tăng lên tương đối so với Y.` :
      `### DeFi & Decentralized Exchanges (DEX) 💸\n\nDeFi (Decentralized Finance) removes central intermediaries using smart contracts. Uniswap functions on the **AMM (Automated Market Maker)** model using the constant product formula:\n\n$$\\text{x} \\times \\text{y} = \\text{k}$$\n\n*Where:* \n- \`x\` and \`y\` are the quantities of two tokens in the Liquidity Pool.\n- \`k\` is the invariant constant.\n\nWhen you buy token X, the pool quantity of X decreases, causing the price of X to increase relative to Y.`;
  }

  if (query.includes("solana") || query.includes("rust") || query.includes("anchor")) {
    return isVi ?
      `### Lập Trình Trên Solana Với Rust & Anchor 🦀\n\nSolana sử dụng cấu trúc lập trình không lưu trạng thái (Stateless), tách biệt hoàn toàn giữa Mã thực thi (Program) và Dữ liệu (Account).\n\nVí dụ định nghĩa cấu trúc trong Framework Anchor:\n\n\`\`\`rust\n#[program]\npub mod hello_solana {\n    use super::*;\n    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {\n        let my_account = &mut ctx.accounts.my_account;\n        my_account.data = data;\n        Ok(())\n    }\n}\n\`\`\`` :
      `### Programming Solana with Rust & Anchor 🦀\n\nSolana uses a stateless program model, fully separating the Executable Code (Program) and Data Storage (Accounts).\n\nAn example of a basic state modification in the Anchor Framework:\n\n\`\`\`rust\n#[program]\npub mod hello_solana {\n    use super::*;\n    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {\n        let my_account = &mut ctx.accounts.my_account;\n        my_account.data = data;\n        Ok(())\n    }\n}\n\`\`\``;
  }

  if (query.includes("ai") || query.includes("machine learning") || query.includes("trí tuệ") || query.includes("llm") || query.includes("gpt")) {
    return isVi ?
      `### AI & Mô Hình Trí Tuệ Nhân Tạo Lớn (LLM) 🤖\n\nTrong phát triển AI hiện đại, kỹ thuật **RAG (Retrieval-Augmented Generation)** là cầu nối thực tế tuyệt vời. RAG kết hợp:\n1. Một mô hình ngôn ngữ lớn (ví dụ: GPT-4).\n2. Một cơ sở dữ liệu Vector để tìm kiếm tài liệu tham khảo theo ngữ cảnh thời gian thực.\n\nĐiều này giúp AI tránh được hiện tượng "ảo giác" (hallucination) và trả lời cực kỳ chính xác dựa trên tài liệu dữ liệu được bạn tải lên!` :
      `### AI & Large Language Models (LLM) 🤖\n\nIn modern AI applications, **RAG (Retrieval-Augmented Generation)** is a stellar real-world architecture. RAG combines:\n1. A powerful Large Language Model (e.g. GPT-4).\n2. A Vector Database to query highly relevant documents in real-time.\n\nThis prevents AI hallucinations and provides pin-point accurate answers grounded directly in your custom data inputs!`;
  }

  if (query.includes("sbt") || query.includes("certificate") || query.includes("chứng chỉ") || query.includes("mint")) {
    return isVi ?
      `### Chứng Chỉ Blockchain & Soulbound Tokens (SBT) 🏆\n\n**SBT (Soulbound Token)** là các tài sản mã hóa đặc biệt, được sinh ra để gắn liền vĩnh viễn với địa chỉ ví của bạn và **không thể mua bán hay chuyển nhượng**.\n\n#### Ứng dụng thực tế:\n- Cấp bằng tốt nghiệp Đại học số.\n- Lưu hồ sơ lý lịch cá nhân (Web3 CV).\n- Chứng nhận khóa học giống như bạn đang trải nghiệm trên nền tảng **Web3Learn 2.0** này!` :
      `### Blockchain Certificates & Soulbound Tokens (SBT) 🏆\n\n**SBT (Soulbound Tokens)** are special cryptographic tokens that are permanently bound to your wallet address and **cannot be transferred, sold, or traded**.\n\n#### Real-world Use Cases:\n- Digital University Degrees.\n- Web3 CVs & professional profiles.\n- Verifiable Course Certificates—exactly like the one you will mint upon passing the quiz on this **Web3Learn 2.0** platform!`;
  }

  // Fallback default message
  const courseContextMsg = courseTitle ? (isVi ? ` liên quan đến khóa học **${courseTitle}**` : ` regarding the course **${courseTitle}**`) : "";
  return isVi ?
    `Chào bạn! Tôi là Trợ lý Học tập AI thông minh của bạn. 🎓\n\nTôi có thể giúp bạn giải đáp mọi thắc mắc${courseContextMsg}. Hãy thử hỏi tôi về:\n- 📝 **Lập trình Solidity** hoặc **Bảo mật Smart Contract (Reentrancy)**\n- 💸 **Công nghệ DeFi (Công thức Uniswap AMM)**\n- 🦀 **Hệ sinh thái Solana (Anchor & Rust)**\n- 🤖 **Kỹ thuật AI (Mô hình LLM & RAG)**\n- 🏆 **Chứng chỉ Blockchain SBT**` :
    `Hello! I am your smart AI Learning Assistant. 🎓\n\nI can help you understand any concepts${courseContextMsg}. Try asking me about:\n- 📝 **Solidity coding** or **Smart Contract Security (Reentrancy)**\n- 💸 **DeFi mechanisms (Uniswap AMM constant product)**\n- 🦀 **Solana development (Anchor & Rust)**\n- 🤖 **AI architectures (LLMs & RAG techniques)**\n- 🏆 **On-chain Soulbound Certificates (SBT)**`;
};

const AIAssistant = ({ courseTitle = "" }) => {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initial welcome message
    const isVi = lang === 'vi';
    const welcomeText = getAIResponse("hello", lang, courseTitle);
    setMessages([
      { id: 1, sender: 'ai', text: welcomeText }
    ]);
  }, [lang, courseTitle]);

  useEffect(() => {
    // Scroll to bottom on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    
    // Simulate AI thinking and typing
    setIsTyping(true);
    setTimeout(() => {
      const aiReplyText = getAIResponse(userMsg.text, lang, courseTitle);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: aiReplyText }]);
      setIsTyping(false);
    }, 1200);
  };

  // Basic markdown-like simple renderer for code blocks
  const renderMessageContent = (text) => {
    const parts = text.split(/(```solidity[\s\S]*?```|```rust[\s\S]*?```|```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const langMatch = part.match(/^```(solidity|rust|javascript)?/);
        const code = part.replace(/^```(solidity|rust|javascript)?/, '').replace(/```$/, '').trim();
        return (
          <pre key={index} className="ai-code-block">
            <div className="ai-code-header">{langMatch ? langMatch[1].toUpperCase() : 'CODE'}</div>
            <code>{code}</code>
          </pre>
        );
      }
      
      // Basic formatting of bold and headers
      let renderedText = part
        .replace(/### (.*?)\n/g, '<h4 class="ai-msg-h4">$1</h4>')
        .replace(/#### (.*?)\n/g, '<h5 class="ai-msg-h5">$1</h5>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/- (.*?)\n/g, '• $1<br/>')
        .replace(/\n/g, '<br/>');

      return <span key={index} dangerouslySetInnerHTML={{ __html: renderedText }} />;
    });
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <div className={`ai-assistant-bubble ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="ai-bubble-icon">🤖</span>
        <div className="ai-bubble-glow"></div>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-assistant-window">
          <div className="ai-window-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="ai-header-status-dot"></span>
              <div>
                <h4 style={{ margin: 0, fontWeight: '700' }}>AI Learning Assistant</h4>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--accent-color)' }}>Online • Contextual Web3 AI</p>
              </div>
            </div>
            <button className="ai-window-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="ai-window-body">
            {messages.map(msg => (
              <div key={msg.id} className={`ai-message-wrapper ${msg.sender}`}>
                <div className={`ai-message-avatar ${msg.sender === 'ai' ? 'ai-avatar' : 'user-avatar'}`}>
                  {msg.sender === 'ai' ? '🤖' : '👤'}
                </div>
                <div className="ai-message-bubble">
                  {renderMessageContent(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="ai-message-wrapper ai">
                <div className="ai-message-avatar ai-avatar">🤖</div>
                <div className="ai-message-bubble typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="ai-window-footer">
            <input
              type="text"
              className="ai-chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={lang === 'vi' ? "Hỏi trợ lý AI về blockchain..." : "Ask AI about blockchain..."}
            />
            <button type="submit" className="ai-chat-send-btn">➔</button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
export { getAIResponse }; // export for direct integration in pages
