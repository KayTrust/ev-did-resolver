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
    private static abiIM: any = [{'inputs':[],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'},{'indexed':false,'internalType':'address','name':'newUser','type':'address'}],'name':'AccountRecovered','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'identity','type':'address'},{'indexed':false,'internalType':'address','name':'device','type':'address'},{'indexed':false,'internalType':'string','name':'cap','type':'string'},{'indexed':false,'internalType':'uint256','name':'start_date','type':'uint256'},{'indexed':false,'internalType':'uint256','name':'end_date','type':'uint256'}],'name':'CapSet','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'}],'name':'IdentityCreated','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'}],'name':'IdentityRegistered','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'}],'name':'IdentityUnregistered','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'string','name':'username','type':'string'},{'indexed':false,'internalType':'address','name':'from','type':'address'}],'name':'MnemonicSet','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'oldIdentityManager','type':'address'},{'indexed':false,'internalType':'address','name':'newIdentityManager','type':'address'}],'name':'Upgraded','type':'event'},{'constant':false,'inputs':[{'internalType':'bytes16','name':'keyMnemonic','type':'bytes16'},{'internalType':'bytes16','name':'keyProfile','type':'bytes16'},{'internalType':'string','name':'urlProfile','type':'string'},{'internalType':'string','name':'username','type':'string'},{'internalType':'string','name':'salt','type':'string'}],'name':'createIdentity','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'destination','type':'address'},{'internalType':'uint256','name':'value','type':'uint256'},{'internalType':'bytes','name':'data','type':'bytes'}],'name':'forwardTo','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'device','type':'address'},{'internalType':'string','name':'cap','type':'string'}],'name':'hasCap','outputs':[{'internalType':'bool','name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'owner','type':'address'}],'name':'registerIdentity','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'internalType':'address','name':'','type':'address'}],'name':'registered_identities','outputs':[{'internalType':'bool','name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'device','type':'address'},{'internalType':'string','name':'cap','type':'string'},{'internalType':'uint256','name':'start_date','type':'uint256'},{'internalType':'uint256','name':'end_date','type':'uint256'}],'name':'setCap','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'device','type':'address'},{'internalType':'uint256','name':'start_date','type':'uint256'},{'internalType':'uint256','name':'end_date','type':'uint256'}],'name':'setDevice','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'}],'name':'unregisterIdentity','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'contract IdentityManager','name':'newIdentityManager','type':'address'}],'name':'upgrade','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'}];
    private static abiProxy: any = [{"inputs":[{"internalType":"address","name":"firstOwner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Forwarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"formerOwner","type":"address"}],"name":"OwnerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Received","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"forward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"owners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounce","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
    private static contractInstanceIM: any;
    private static contractInstanceProxy: any;
    private static baseBlocks: number = 30000000;
    private static lastBlocks: number = 0;
    private static bufferSize: number = 100000;
    private static startBlockMargin: number = 100000;

    public static setWeb3Instance = (host: string, addressIM: string, headers?: [{ name: string, value: string }]) => {
        Web3Instance.web3Instance = new Web3(new Web3.providers.HttpProvider(host, { timeout: 0, headers }));
        Web3Instance.web3Instance.eth.handleRevert = true;
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

    public static setBaseBlocks = (customBaseBlocks: number) => {
        Web3Instance.baseBlocks = customBaseBlocks;
    }

    public static setLastBlocks = (customLastBlock: number) => {
        Web3Instance.lastBlocks = customLastBlock;
    }

    public static setBufferSize = (customBufferSize: number) => {
        Web3Instance.bufferSize = customBufferSize;
    }

    public static setStartBlockMargin = (startBlockMargin: number) => {
        Web3Instance.startBlockMargin = startBlockMargin;
    }

    private static getPastEventFromProxy = async (): Promise<Event | null> => {
        let toBlock = await Web3Instance.web3Instance.eth.getBlockNumber();
        let event: Event | null = null;
        let fromBlock = toBlock - Web3Instance.bufferSize;

        while (true) {
            const params = {
                filter: { newOwner: Web3Instance.addressIM },
                fromBlock: fromBlock < 0 ? 0 : fromBlock,
                toBlock
            }
            const result = await Web3Instance.contractInstanceProxy.getPastEvents('OwnerAdded', params);
            if (fromBlock <= 0) break;
            if (result.length !== 0) {
                event = result[0];
                break;
            }
            fromBlock -= Web3Instance.bufferSize
            toBlock -= Web3Instance.bufferSize;
        }

        return event;
    }

    public static getPastEventFromIM = async (): Promise<Array<Event>> => {
        const isOwner = Web3Instance.isOwner();
        if (!isOwner) return [];
        const proxyResult = await Web3Instance.getPastEventFromProxy() as Event;
        const originBlock = (proxyResult.blockNumber - Web3Instance.startBlockMargin);
        const baseBlock = Math.max(Web3Instance.baseBlocks, originBlock);
        let newestBlock = await Web3Instance.web3Instance.eth.getBlockNumber();
        let toBlock = newestBlock - Web3Instance.lastBlocks;
        let fromBlock = toBlock - Web3Instance.bufferSize;
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
            fromBlock -= Web3Instance.bufferSize
            toBlock -= Web3Instance.bufferSize;
        }

        return events;
    };

    public static hasCap = async (identity: string, device: string, capability: string): Promise<boolean> => {
        return await Web3Instance.contractInstanceIM.methods.hasCap(identity, device, capability).call();
    }

    public static isOwner = async (): Promise<boolean> => {
        return await Web3Instance.contractInstanceProxy.methods.isOwner(Web3Instance.addressIM).call();
    }
}

export default Web3Instance;