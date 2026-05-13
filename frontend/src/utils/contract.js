import { Contract } from 'ethers';
import CourseAbi from './CourseAbi.json';

// YOU NEED TO REPLACE THIS AFTER DEPLOYING ON GANACHE
export const CONTRACT_ADDRESS = "0xa843a6b681A9a15854ad450d245649Cb3016A290"; 

export const getContract = (signer) => {
    return new Contract(CONTRACT_ADDRESS, CourseAbi.abi, signer);
};