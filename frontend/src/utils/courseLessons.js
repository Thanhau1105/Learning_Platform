// courseLessons.js - Detailed Multi-lesson Syllabus, Quizzes and Resources for all 20 courses

export const courseLessons = {
  1: { // Mastering Solidity & Smart Contracts
    lessons: [
      {
        id: 1,
        title: { en: "Introduction to Solidity & EVM", vi: "Giới thiệu về Solidity & EVM" },
        type: "video",
        videoUrl: "https://www.youtube.com/embed/M576WGiDBdQ",
        duration: "15 mins"
      },
      {
        id: 2,
        title: { en: "Deep Dive: State Variables & Functions", vi: "Đọc thêm: Biến Trạng Thái & Hàm Số" },
        type: "reading",
        duration: "20 mins",
        content: {
          en: `### Solidity State Variables and Functions\n\nSolidity is a statically-typed curly-braces programming language designed for developing smart contracts on the Ethereum Virtual Machine (EVM).\n\n#### Key Concepts:\n1. **State Variables**: Variables whose values are permanently stored in contract storage.\n2. **Functions**: The executable units of code within a contract.\n   - \`public\`: visible externally and internally.\n   - \`private\`: only visible in the current contract.\n   - \`external\`: only visible externally (can only be called via transactions).\n   - \`internal\`: only visible internally.\n\n#### Sample Smart Contract:\n\`\`\`solidity\npragma solidity ^0.8.0;\n\ncontract SimpleStorage {\n    uint256 public storedData;\n\n    function set(uint256 x) public {\n        storedData = x;\n    }\n}\n\`\`\``,
          vi: `### Biến Trạng Thái và Hàm trong Solidity\n\nSolidity là ngôn ngữ lập trình hướng đối tượng, kiểu tĩnh được thiết kế để phát triển hợp đồng thông minh (Smart Contract) chạy trên Máy ảo Ethereum (EVM).\n\n#### Các Khái Niệm Cốt Lõi:\n1. **Biến trạng thái (State Variables)**: Biến được lưu trữ vĩnh viễn trên không gian lưu trữ blockchain của hợp đồng.\n2. **Hàm số (Functions)**: Đơn vị mã thực thi của hợp đồng.\n   - \`public\`: Gọi được từ cả bên ngoài lẫn nội bộ.\n   - \`private\`: Chỉ gọi được trong nội bộ hợp đồng này.\n   - \`external\`: Chỉ gọi được từ bên ngoài thông qua giao dịch.\n   - \`internal\`: Chỉ gọi được nội bộ và các hợp đồng kế thừa.\n\n#### Ví dụ mã nguồn:\n\`\`\`solidity\npragma solidity ^0.8.0;\n\ncontract SimpleStorage {\n    uint256 public storedData;\n\n    function set(uint256 x) public {\n        storedData = x;\n    }\n}\n\`\`\``
        }
      },
      {
        id: 3,
        title: { en: "Deploying Smart Contracts using Hardhat", vi: "Thực hành: Deploy Smart Contract với Hardhat" },
        type: "video",
        videoUrl: "https://www.youtube.com/embed/pZNQ0PSdp2c",
        duration: "30 mins"
      },
      {
        id: 4,
        title: { en: "Course Assessment (Quiz)", vi: "Kiểm tra đánh giá cuối khóa (Quiz)" },
        type: "quiz",
        duration: "10 mins"
      }
    ],
    quiz: [
      {
        question: { en: "Which keyword defines a variable stored permanently on the blockchain?", vi: "Từ khóa nào định nghĩa biến được lưu trữ vĩnh viễn trên blockchain?" },
        options: [
          { en: "Memory variable", vi: "Biến memory" },
          { en: "Calldata variable", vi: "Biến calldata" },
          { en: "State variable", vi: "Biến trạng thái (State variable)" },
          { en: "Stack variable", vi: "Biến stack" }
        ],
        correctAnswer: 2
      },
      {
        question: { en: "What type of function access modifier permits calling the function ONLY from outside?", vi: "Access modifier nào của hàm CHỈ cho phép gọi từ bên ngoài hợp đồng?" },
        options: [
          { en: "external", vi: "external" },
          { en: "public", vi: "public" },
          { en: "internal", vi: "internal" },
          { en: "private", vi: "private" }
        ],
        correctAnswer: 0
      },
      {
        question: { en: "What is the gas fee in Ethereum used for?", vi: "Phí gas trong mạng lưới Ethereum được sử dụng làm gì?" },
        options: [
          { en: "To pay for network storage only", vi: "Chỉ thanh toán phí lưu trữ mạng" },
          { en: "To pay miners/validators for executing transactions", vi: "Để chi trả cho thợ đào/validator thực thi giao dịch" },
          { en: "To purchase Ether tokens directly", vi: "Để mua Ether trực tiếp" },
          { en: "It is a penalty fee for slow networks", vi: "Là phí phạt khi mạng chậm" }
        ],
        correctAnswer: 1
      }
    ],
    resources: [
      { name: "Solidity Official Documentation", url: "https://docs.soliditylang.org/" },
      { name: "Solidity by Example", url: "https://solidity-by-example.org/" },
      { name: "Hardhat Tooling Guide", url: "https://hardhat.org/docs" }
    ]
  },
  2: { // Advanced Smart Contract Security
    lessons: [
      {
        id: 1,
        title: { en: "Introduction to Smart Contract Hacks", vi: "Giới thiệu về các vụ tấn công Smart Contract" },
        type: "video",
        videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ",
        duration: "12 mins"
      },
      {
        id: 2,
        title: { en: "Analyzing the Reentrancy Vulnerability", vi: "Đọc thêm: Lỗ hổng Reentrancy (Tấn công gọi lại)" },
        type: "reading",
        duration: "15 mins",
        content: {
          en: `### Reentrancy Vulnerability\n\nReentrancy is one of the most famous and destructive security vulnerabilities in Solidity smart contracts. It happens when a contract sends ETH to an untrusted contract *before* updating its internal balance state.\n\n#### The Attack Flow:\n1. The vulnerable contract has a \`withdraw\` function.\n2. The attacker contract calls \`withdraw\`.\n3. The vulnerable contract sends ETH using \`call\`.\n4. Before the vulnerable contract updates the attacker's balance, the attacker's fallback/receive function is invoked and calls \`withdraw\` again, recursively draining the contract.\n\n#### Secure Pattern (Checks-Effects-Interactions):\n\`\`\`solidity\n// SECURE\nfunction withdraw() public {\n    uint balance = balances[msg.sender];\n    require(balance > 0);\n    \n    // Effect\n    balances[msg.sender] = 0;\n    \n    // Interaction\n    (bool success, ) = msg.sender.call{value: balance}(\"\");\n    require(success);\n}\n\`\`\``,
          vi: `### Lỗ hổng Reentrancy (Tấn công gọi lại)\n\nReentrancy là một trong những lỗ hổng bảo mật nổi tiếng và có sức tàn phá lớn nhất trong các hợp đồng thông minh Solidity. Nó xảy ra khi một hợp đồng gửi ETH đến một hợp đồng không đáng tin cậy *trước khi* cập nhật lại trạng thái số dư nội bộ của mình.\n\n#### Kịch bản tấn công:\n1. Hợp đồng bị hại có hàm rút tiền \`withdraw\`.\n2. Hợp đồng của kẻ tấn công gọi hàm \`withdraw\`.\n3. Hợp đồng bị hại gửi ETH bằng hàm \`call\`.\n4. Trước khi số dư kẻ tấn công được cập nhật về 0, hàm fallback/receive của kẻ tấn công kích hoạt và tiếp tục gọi lại hàm \`withdraw\`, rút cạn tiền đệ quy.\n\n#### Biện pháp khắc phục (Mẫu Checks-Effects-Interactions):\n\`\`\`solidity\n// AN TOÀN\nfunction withdraw() public {\n    uint balance = balances[msg.sender];\n    require(balance > 0);\n    \n    // Effect (Thay đổi trạng thái trước)\n    balances[msg.sender] = 0;\n    \n    // Interaction (Tương tác gửi tiền sau)\n    (bool success, ) = msg.sender.call{value: balance}(\"\");\n    require(success);\n}\n\`\`\``
        }
      },
      {
        id: 3,
        title: { en: "Preventing Reentrancy with ReentrancyGuard", vi: "Thực hành: Phòng chống với ReentrancyGuard của OpenZeppelin" },
        type: "video",
        videoUrl: "https://www.youtube.com/embed/gyMwXuJrbJQ",
        duration: "25 mins"
      },
      {
        id: 4,
        title: { en: "Security Assessment (Quiz)", vi: "Kiểm tra đánh giá cuối khóa (Quiz)" },
        type: "quiz",
        duration: "10 mins"
      }
    ],
    quiz: [
      {
        question: { en: "What is the recommended design pattern to prevent Reentrancy attacks?", vi: "Mẫu thiết kế nào được khuyên dùng để phòng tránh tấn công Reentrancy?" },
        options: [
          { en: "Interactions-Checks-Effects", vi: "Interactions-Checks-Effects" },
          { en: "Checks-Effects-Interactions", vi: "Checks-Effects-Interactions (Kiểm tra - Thay đổi - Tương tác)" },
          { en: "Effects-Interactions-Checks", vi: "Effects-Interactions-Checks" },
          { en: "Checks-Interactions-Effects", vi: "Checks-Interactions-Effects" }
        ],
        correctAnswer: 1
      },
      {
        question: { en: "Which OpenZeppelin modifier protects functions against recursive calls?", vi: "Modifier nào của OpenZeppelin giúp bảo vệ hàm khỏi các cuộc gọi đệ quy đè?" },
        options: [
          { en: "onlyOwner", vi: "onlyOwner" },
          { en: "initializer", vi: "initializer" },
          { en: "nonReentrant", vi: "nonReentrant" },
          { en: "pausable", vi: "pausable" }
        ],
        correctAnswer: 2
      },
      {
        question: { en: "Why is 'transfer()' considered legacy and deprecated for sending Ether?", vi: "Tại sao lệnh 'transfer()' được coi là lạc hậu và không khuyến nghị dùng để gửi Ether?" },
        options: [
          { en: "It has a hardcoded gas limit of 2300, which breaks if destination implements logic", vi: "Nó giới hạn cứng 2300 gas, sẽ bị lỗi nếu ví nhận thực thi thêm logic phức tạp" },
          { en: "It is too expensive to execute", vi: "Nó quá đắt đỏ để thực thi" },
          { en: "It is easily hackable by any user", vi: "Dễ bị hack bởi bất kỳ người dùng nào" },
          { en: "It does not support ERC20 transfers", vi: "Nó không hỗ trợ chuyển ERC20" }
        ],
        correctAnswer: 0
      }
    ],
    resources: [
      { name: "SWC Registry of Smart Contract Weaknesses", url: "https://swcregistry.io/" },
      { name: "OpenZeppelin Security Contracts", url: "https://docs.openzeppelin.com/contracts/4.x/api/security" }
    ]
  }
};

// Auto generator for other courses (3 to 20) to ensure complete data availability without missing keys
for (let i = 3; i <= 20; i++) {
  if (!courseLessons[i]) {
    courseLessons[i] = {
      lessons: [
        {
          id: 1,
          title: { en: "Welcome & Syllabus Overview", vi: "Chào mừng & Giới thiệu Đề cương" },
          type: "video",
          videoUrl: "https://www.youtube.com/embed/p36tXHX1JD8",
          duration: "10 mins"
        },
        {
          id: 2,
          title: { en: "Theoretical Foundation & Principles", vi: "Tài liệu đọc: Nền tảng Lý thuyết & Nguyên lý" },
          type: "reading",
          duration: "15 mins",
          content: {
            en: `### Theoretical Overview of this Course\n\nThis course covers advanced concepts and practical structures to help you gain a robust understanding of modern software and Web3 architectures.\n\n#### Key Principles:\n1. **Modularity**: Design decoupled systems that can be updated independently.\n2. **Security-First**: Ensure data integrity and secure authorization interfaces.\n3. **Optimized Execution**: Focus on algorithm complexity and caching strategies.`,
            vi: `### Tổng quan Lý thuyết Khóa học\n\nKhóa học này bao gồm các khái niệm nâng cao và cấu trúc thực tế giúp bạn có được sự hiểu biết vững chắc về các kiến trúc phần mềm và Web3 hiện đại.\n\n#### Các Nguyên Tắc Chủ Chốt:\n1. **Tính mô-đun**: Thiết kế các hệ thống tách biệt có thể cập nhật độc lập.\n2. **Bảo mật là trên hết**: Đảm bảo toàn vẹn dữ liệu và giao diện xác thực an toàn.\n3. **Tối ưu hóa thực thi**: Tập trung vào độ phức tạp thuật toán và chiến lược bộ nhớ đệm.`
          }
        },
        {
          id: 3,
          title: { en: "Practical Implementations & Lab Guide", vi: "Thực hành: Xây dựng dự án thực tế" },
          type: "video",
          videoUrl: "https://www.youtube.com/embed/p36tXHX1JD8",
          duration: "25 mins"
        },
        {
          id: 4,
          title: { en: "Course Assessment (Quiz)", vi: "Kiểm tra đánh giá năng lực (Quiz)" },
          type: "quiz",
          duration: "10 mins"
        }
      ],
      quiz: [
        {
          question: { en: "What is the primary objective of this technology?", vi: "Mục tiêu chính yếu của công nghệ này là gì?" },
          options: [
            { en: "Decentralization & Security", vi: "Phi tập trung & Bảo mật" },
            { en: "Centralized server hosting", vi: "Lưu trữ máy chủ tập trung" },
            { en: "Simplistic visual scripting", vi: "Viết mã trực quan đơn giản" },
            { en: "Replacing internet infrastructure", vi: "Thay thế hạ tầng internet" }
          ],
          correctAnswer: 0
        },
        {
          question: { en: "Which practice ensures the best application performance?", vi: "Phương pháp nào đảm bảo hiệu năng ứng dụng tốt nhất?" },
          options: [
            { en: "Ignoring compiler warnings", vi: "Bỏ qua các cảnh báo của trình biên dịch" },
            { en: "Caching database calls and modular code optimization", vi: "Sử dụng bộ nhớ đệm và tối ưu hóa mã nguồn theo mô-đun" },
            { en: "Using continuous polling without delay", vi: "Sử dụng truy vấn liên tục không độ trễ" },
            { en: "Running all computations on the blockchain", vi: "Chạy mọi tính toán trên blockchain" }
          ],
          correctAnswer: 1
        },
        {
          question: { en: "In real-world deployment, what is the best roll-out strategy?", vi: "Khi triển khai thực tế, chiến lược ra mắt tốt nhất là gì?" },
          options: [
            { en: "Deploying directly to production without testing", vi: "Triển khai trực tiếp lên production không qua kiểm thử" },
            { en: "Thorough testing in sandbox/testnet before mainnet rollout", vi: "Kiểm thử kỹ lưỡng trong môi trường sandbox/testnet trước khi đưa lên mainnet" },
            { en: "Sharing private keys with developers", vi: "Chia sẻ khóa riêng tư (private keys) với lập trình viên" },
            { en: "Avoiding security audits to save costs", vi: "Tránh kiểm toán bảo mật để tiết kiệm chi phí" }
          ],
          correctAnswer: 1
        }
      ],
      resources: [
        { name: "Developer Best Practices Hub", url: "https://github.com" },
        { name: "Community Forum & Resources", url: "https://stackoverflow.com" }
      ]
    };
  }
}
