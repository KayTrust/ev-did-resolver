import { ContractAddressRequired, UnsupportedAbi } from "./errors";

const Web3 = require('web3');

type AbiType = 'Proxy' | 'IdentityManager';
type Event = {
    logIndex: number,
    removed: boolean,
    blockNumber: number,
    blockHash: string,
    transactionHash: string,
    transactionIndex: number,
    address: string,
    id: string,
    returnValues: {[key: string]: any},
    event: string,
    signature: string,
    raw: {[key: string]: any},
}

class Web3Instance {
    private static web3Instance: any;
    private static addressIM: any;
    private static addressProxy: any;
    private static abiIM: any;
    private static abiProxy: any;
    private static contractInstanceIM: any;
    private static contractInstanceProxy: any;
    private static lastBlocks: number = 100000;

    public static setWeb3Instance = (host: string, abiIM: object, addressIM: string, abiProxy: string, headers?: [{ name: string, value: string }]) => {
        Web3Instance.web3Instance = new Web3(new Web3.providers.HttpProvider(host, { timeout: 0, headers }));
        Web3Instance.web3Instance.eth.handleRevert = true;
        Web3Instance.abiIM = abiIM;
        Web3Instance.abiProxy = abiProxy;
        Web3Instance.setContractInstance(addressIM, 'IdentityManager');
    }

    public static setContractInstance = (contractAddress: string, abiType: AbiType) => {
        if (!contractAddress) throw new ContractAddressRequired('a contract address is required');
        if (abiType === 'IdentityManager') {
            Web3Instance.addressIM = contractAddress;
            Web3Instance.contractInstanceIM = new Web3Instance.web3Instance.eth.Contract(Web3Instance.abiIM, contractAddress);
        }
        else if (abiType === 'Proxy') {
            Web3Instance.addressProxy = contractAddress;
            Web3Instance.contractInstanceProxy = new Web3Instance.web3Instance.eth.Contract(Web3Instance.abiProxy, contractAddress);
        }
        else
            throw new UnsupportedAbi();
    }

    public static setLastBlocks = (customLastBlock: number) => {
        Web3Instance.lastBlocks = customLastBlock;
    }

    private static getPastEventFromProxy = async (): Promise<Event | null> => {
        let toBlock = await Web3Instance.web3Instance.eth.getBlockNumber();
        let events: Event | null = null;
        let fromBlock = toBlock - Web3Instance.lastBlocks;
        
        while (true) {
            const params = {
                filter: { newOwner: Web3Instance.addressIM },
                fromBlock: fromBlock < 0 ? 0 : fromBlock,
                toBlock
            }
            const result = await Web3Instance.contractInstanceProxy.getPastEvents('OwnerAdded', params);
            if (fromBlock <= 0) break;
            if (result.length !== 0) {
                events = result[0];
                break;
            }
            fromBlock -= Web3Instance.lastBlocks
            toBlock -= Web3Instance.lastBlocks;
        }

        return events;
    }

    public static getPastEventFromIM = async (): Promise<Array<Event>> => {
        const proxyResult = await Web3Instance.getPastEventFromProxy() as Event;
        const baseBlock = (proxyResult.blockNumber - Web3Instance.lastBlocks);
        let toBlock = await Web3Instance.web3Instance.eth.getBlockNumber();
        let fromBlock = toBlock - Web3Instance.lastBlocks;
        let events: Array<Event> = [];

        while (true) {
            const params = {
                fromBlock: fromBlock < baseBlock ? baseBlock : fromBlock,
                toBlock
            }
            const result = await Web3Instance.contractInstanceIM.getPastEvents('CapSet', params) as Array<Event>;
            if (fromBlock <= baseBlock) break;
            if (result.length !== 0) {
                events = [...events, ...result];
            }
            fromBlock -= Web3Instance.lastBlocks
            toBlock -= Web3Instance.lastBlocks;
        }

        return events;
    };

    public static hasCap = async (identity: string, device: string, capability: string): Promise<boolean> => {
        return await Web3Instance.contractInstanceIM.methods.hasCap(identity, device, capability).call();
    }
}

export default Web3Instance;