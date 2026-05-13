// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CourseContract {
    address public owner;
    
    // Mapping from user address to their purchased course IDs
    mapping(address => uint[]) public userCourses;
    
    // Fast lookup for purchased courses
    mapping(address => mapping(uint => bool)) public hasPurchased;

    // Mapping from course ID to price (in wei)
    mapping(uint => uint) public coursePrices;

    event CoursePurchased(address buyer, uint courseId);

    constructor() {
        owner = msg.sender;
        // Initialize some dummy course prices (e.g. 0.01 ETH)
        coursePrices[1] = 0.01 ether;
        coursePrices[2] = 0.015 ether;
        coursePrices[3] = 0.02 ether;
        coursePrices[4] = 0.025 ether;
    }

    function setCoursePrice(uint _courseId, uint _price) external {
        require(msg.sender == owner, "Only owner can set price");
        coursePrices[_courseId] = _price;
    }

    function getCoursePrice(uint _courseId) public view returns (uint) {
        return coursePrices[_courseId];
    }

    function isCoursePurchased(uint _courseId) public view returns (bool) {
        return hasPurchased[msg.sender][_courseId];
    }

    function buyCourse(uint _courseId) external payable {
        require(coursePrices[_courseId] > 0, "Course does not exist");
        require(msg.value >= coursePrices[_courseId], "Insufficient ETH sent");
        require(!hasPurchased[msg.sender][_courseId], "Course already purchased");

        userCourses[msg.sender].push(_courseId);
        hasPurchased[msg.sender][_courseId] = true;

        emit CoursePurchased(msg.sender, _courseId);
    }

    function getMyCourses() external view returns (uint[] memory) {
        return userCourses[msg.sender];
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }
}
