import { ContractAddressRequired } from "./errors";

const Web3 = require('web3');

class Web3Instance {
    public static web3Instance: any;
    public static contractInstance: any;

    public static setWeb3Instance = (host: string, headers?: [{ name: string, value: string }]) => {
        Web3Instance.web3Instance = new Web3(new Web3.providers.HttpProvider(host, { timeout: 0, headers }));
        Web3Instance.web3Instance.eth.handleRevert = true;
    }

    public static setContractInstance = (abi: object, contractAddress: string) => {
        if (!contractAddress) throw new ContractAddressRequired('a contract address is required');
        Web3Instance.contractInstance = new Web3Instance.web3Instance.eth.Contract(abi, contractAddress);
    }

    public static getPastEvent = async (identityAddress: string) => {
        // event CapSet(address identity, address device, string cap, uint start_date, uint end_date);
        const params = {
            filter: { identity: identityAddress },
            fromBlock: 41700000, // 41756551
            toBlock: 'latest',
        }
        console.log(await Web3Instance.web3Instance.eth.getBlockNumber());
        return await Web3Instance.contractInstance.getPastEvents('CapSet', params);
    };
}

export default Web3Instance;