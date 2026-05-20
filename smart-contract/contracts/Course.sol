// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CourseContract {
    address public owner;
    
    // Mapping from user address to their purchased course IDs (both static and dynamic)
    mapping(address => uint[]) public userCourses;
    
    // Fast lookup for purchased courses
    mapping(address => mapping(uint => bool)) public hasPurchased;

    // Mapping from course ID to price (in wei) for static courses
    mapping(uint => uint) public coursePrices;

    struct Certificate {
        uint courseId;
        string studentName;
        uint dateAwarded;
        string certificateHash;
    }

    // Mapping from user address => courseId => Certificate info
    mapping(address => mapping(uint => Certificate)) public userCertificates;
    // Track which courses a user has completed
    mapping(address => uint[]) public completedCourses;

    // Dynamic courses created by instructors
    struct DynamicCourse {
        uint id;
        address payable instructor;
        string title;
        string description;
        uint price; // in wei
        string image;
        string category;
    }

    DynamicCourse[] public dynamicCourses;

    event CoursePurchased(address buyer, uint courseId);
    event CertificateMinted(address indexed student, uint indexed courseId, string studentName, string certificateHash);
    event CourseCreated(uint indexed id, address indexed instructor, string title, uint price);

    constructor() {
        owner = msg.sender;
        // Initialize some dummy course prices (e.g. 0.01 ETH)
        coursePrices[1] = 0.01 ether;
        coursePrices[2] = 0.015 ether;
        coursePrices[3] = 0.02 ether;
        coursePrices[4] = 0.025 ether;
        coursePrices[5] = 0.03 ether;
        coursePrices[6] = 0.012 ether;
        coursePrices[7] = 0.01 ether;
        coursePrices[8] = 0.04 ether;
        coursePrices[9] = 0.025 ether;
        coursePrices[10] = 0.018 ether;
        coursePrices[11] = 0.008 ether;
        coursePrices[12] = 0.03 ether;
        coursePrices[13] = 0.035 ether;
        coursePrices[14] = 0.015 ether;
        coursePrices[15] = 0.02 ether;
        coursePrices[16] = 0.025 ether;
        coursePrices[17] = 0.018 ether;
        coursePrices[18] = 0.04 ether;
        coursePrices[19] = 0.01 ether;
        coursePrices[20] = 0.022 ether;
    }

    function setCoursePrice(uint _courseId, uint _price) external {
        require(msg.sender == owner, "Only owner can set price");
        coursePrices[_courseId] = _price;
    }

    function getCoursePrice(uint _courseId) public view returns (uint) {
        if (_courseId <= 20) {
            return coursePrices[_courseId];
        } else {
            // Lookup dynamic course price
            for (uint i = 0; i < dynamicCourses.length; i++) {
                if (dynamicCourses[i].id == _courseId) {
                    return dynamicCourses[i].price;
                }
            }
        }
        return 0;
    }

    function isCoursePurchased(uint _courseId) public view returns (bool) {
        return hasPurchased[msg.sender][_courseId];
    }

    function buyCourse(uint _courseId) external payable {
        uint price = getCoursePrice(_courseId);
        require(price > 0, "Course does not exist");
        require(msg.value >= price, "Insufficient ETH sent");
        require(!hasPurchased[msg.sender][_courseId], "Course already purchased");

        hasPurchased[msg.sender][_courseId] = true;
        userCourses[msg.sender].push(_courseId);

        // If it's a dynamic course, transfer ETH directly to the instructor
        if (_courseId > 20) {
            for (uint i = 0; i < dynamicCourses.length; i++) {
                if (dynamicCourses[i].id == _courseId) {
                    dynamicCourses[i].instructor.transfer(msg.value);
                    break;
                }
            }
        }

        emit CoursePurchased(msg.sender, _courseId);
    }

    function getMyCourses() external view returns (uint[] memory) {
        return userCourses[msg.sender];
    }

    // Certificate Minting
    function mintCertificate(uint _courseId, string memory _studentName, string memory _certificateHash) external {
        require(hasPurchased[msg.sender][_courseId], "Course not purchased");
        require(userCertificates[msg.sender][_courseId].courseId == 0, "Certificate already minted");

        userCertificates[msg.sender][_courseId] = Certificate({
            courseId: _courseId,
            studentName: _studentName,
            dateAwarded: block.timestamp,
            certificateHash: _certificateHash
        });
        completedCourses[msg.sender].push(_courseId);

        emit CertificateMinted(msg.sender, _courseId, _studentName, _certificateHash);
    }

    function getUserCertificate(address _user, uint _courseId) external view returns (Certificate memory) {
        return userCertificates[_user][_courseId];
    }

    function getCompletedCourses(address _user) external view returns (uint[] memory) {
        return completedCourses[_user];
    }

    // Dynamic Course Creation (Creator Mode)
    function createCourse(
        uint _id,
        string memory _title,
        string memory _description,
        uint _price,
        string memory _image,
        string memory _category
    ) external {
        require(_id > 20, "ID must be greater than 20");
        
        dynamicCourses.push(DynamicCourse({
            id: _id,
            instructor: payable(msg.sender),
            title: _title,
            description: _description,
            price: _price,
            image: _image,
            category: _category
        }));

        emit CourseCreated(_id, msg.sender, _title, _price);
    }

    function getDynamicCourses() external view returns (DynamicCourse[] memory) {
        return dynamicCourses;
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }
}
