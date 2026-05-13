const { ethers, JsonRpcProvider, Contract, Wallet } = require('ethers');
const fs = require('fs');
const path = require('path');

// 1. Get the abi
const CourseAbi = require('../src/utils/CourseAbi.json');
const courses = require('../src/utils/courses.json');

async function main() {
    console.log("Setting up prices for courses 5 to 20...");
    const provider = new JsonRpcProvider('http://127.0.0.1:7545');
    
    // Default ganache account 0 private key (from Hardhat/Ganache) 
    // We need the owner account to set prices.
    // The user deployed with the FIRST account in ganache.
    // I don't know the exact private key of the first account, but since we deployed it via hardhat on local network, maybe I can use Hardhat to execute it, or I can just use ethers with Ganache's unlocked accounts.
    
    const accounts = await provider.listAccounts();
    const owner = accounts[0]; 
    console.log("Owner address:", owner.address);

    const signer = await provider.getSigner(owner.address);
    const contractAddress = "0xb798871C32F925b5538F82e5049C71aF7EE76ce2";
    
    const contract = new Contract(contractAddress, CourseAbi.abi, signer);

    for (let i = 5; i <= 20; i++) {
        const course = courses.find(c => c.id === i);
        if (course) {
            const priceWei = ethers.parseEther(course.priceEth);
            try {
                // check if already set
                const currentPrice = await contract.getCoursePrice(i);
                if (currentPrice === 0n) {
                    console.log(`Setting price for course ${i}: ${course.priceEth} ETH`);
                    const tx = await contract.setCoursePrice(i, priceWei);
                    await tx.wait();
                } else {
                    console.log(`Course ${i} price already set.`);
                }
            } catch (err) {
                console.error(`Failed to set price for course ${i}`, err.message);
            }
        }
    }
    console.log("Finished setting prices!");
}

main().catch(console.error);
