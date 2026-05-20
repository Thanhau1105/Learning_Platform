import { Contract } from 'ethers';
import CourseAbi from './CourseAbi.json';

// YOU NEED TO REPLACE THIS AFTER DEPLOYING ON GANACHE
export const CONTRACT_ADDRESS = "0x70996ee65697D93f06EcA80dF0131DbDf616Baf1"; 

export const getContract = (signer) => {
    return new Contract(CONTRACT_ADDRESS, CourseAbi.abi, signer);
};