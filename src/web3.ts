import { ContractAddressRequired } from "./errors";

const Web3 = require('web3');
class Web3Instance {
    private static web3Instance: any;
    private static addressIM: any;
    private static abiIM: any;
    private static contractInstanceIM: any;
    private static lastBlocks: number = 5000000;

    public static setWeb3Instance = (host: string, abiIM: object, addressIM: string, headers?: [{ name: string, value: string }]) => {
        Web3Instance.web3Instance = new Web3(new Web3.providers.HttpProvider(host, { timeout: 0, headers }));
        Web3Instance.web3Instance.eth.handleRevert = true;
        Web3Instance.abiIM = abiIM;
        Web3Instance.addressIM = addressIM;
        Web3Instance.setContractInstance(addressIM);
    }

    public static setContractInstance = (contractAddress: string) => {
        if (!contractAddress) throw new ContractAddressRequired('a contract address is required');
        Web3Instance.contractInstanceIM = new Web3Instance.web3Instance.eth.Contract(Web3Instance.abiIM, contractAddress)
    }

    public static getPastEvent = async () => {
        const toBlock = await Web3Instance.web3Instance.eth.getBlockNumber();
        const fromBlock = toBlock - Web3Instance.lastBlocks;
        const params = {
            fromBlock,
            toBlock
        }
        return await Web3Instance.contractInstanceIM.getPastEvents('CapSet', params);
    };

    public static hasCap = async (identity: string, device: string, capability: string): Promise<boolean> => {
        return await Web3Instance.contractInstanceIM.methods.hasCap(identity, device, capability).call();
    }
}

export default Web3Instance;