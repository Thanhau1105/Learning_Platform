import { BrowserProvider } from 'ethers';

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const provider = new BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            return { provider, signer, address };
        } catch (err) {
            console.error("User rejected request or error occurred:", err);
            throw err;
        }
    } else {
        alert("Please install MetaMask!");
        throw new Error("No crypto wallet found");
    }
};
