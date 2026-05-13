import { Contract } from 'ethers';
import CourseAbi from './CourseAbi.json';

// YOU NEED TO REPLACE THIS AFTER DEPLOYING ON GANACHE
export const CONTRACT_ADDRESS = "0xb798871C32F925b5538F82e5049C71aF7EE76ce2"; 

export const getContract = (signer) => {
    return new Contract(CONTRACT_ADDRESS, CourseAbi.abi, signer);
};