import { ParsedDID, Resolver } from "did-resolver"
import { InvalidMnid } from "./errors";
import Web3Instance from "./web3"

const mnid = require('mnid');

export type ResolverOptions = {
    host: string
    abiIM: object
    addressIM: string
    abiProxy: object
    headers?: [{ name: string, value: string }]
    baseBlocks?: number
    lastBlocks?: number
    bufferSize?: number
    searchThreshold?: number
    findEvents?: boolean
    keys?: Array<string>
}

export const getResolver = () => {
    const resolve = async (did: string, parsed: ParsedDID, didResolver: Resolver, options: ResolverOptions): Promise<any> => {
        
        Web3Instance.setWeb3Instance(options.host, options.abiIM, options.addressIM, options.abiProxy, options.headers);
        if (options?.baseBlocks) Web3Instance.setBaseBlocks(options.baseBlocks);
        if (options?.lastBlocks) Web3Instance.setLastBlocks(options.lastBlocks);
        if (options?.bufferSize) Web3Instance.setBufferSize(options.bufferSize);
        if (options?.searchThreshold) Web3Instance.setSearchThreshold(options.searchThreshold);

        let { findEvents = true, keys = [] } = options;

        const didParts = did.split(':');
        const mnidToDecode = didParts[2];
        if (!mnid.isMNID(mnidToDecode)) throw new InvalidMnid(`invalid mnid ${mnidToDecode}`);
        const decodeMnid = mnid.decode(mnidToDecode);
        const context = "https://w3id.org/did/v1";
        const id = did;
        const authentication: {[key: string]: any} = [];

        Web3Instance.setContractInstance(decodeMnid.address, 'Proxy');
        let keysInfo: Array<any> = [];
        if (findEvents) keysInfo = (await Web3Instance.getPastEventFromIM()).filter(x => decodeMnid.address.toUpperCase() === x.returnValues.identity.toUpperCase()).map(x =>  x.returnValues.device );
        if (keys) keysInfo = keysInfo.concat(keys);

        let countKey = 1;
        const readKeys: any = [];
        const caps = ['fw', 'auth', 'devicemanager', 'admin']

        for (const key of keysInfo) {
            if (readKeys.some((x: string) => x === key)) continue;
            let hasCap = false;
            for (let i = 0; i < caps.length; i++) {
                hasCap = await Web3Instance.hasCap(decodeMnid.address, key, caps[i]);
                if (hasCap) {
                    authentication.push({
                        "id": `${key}#keys-${countKey++}`,
                        "type": "EcdsaSecp256k1RecoveryMethod2020",
                        "blockchainAccountId": `eip155:${decodeMnid.network}:${decodeMnid.address}`
                    });
                    readKeys.push(key);
                    break;
                }
            }
        }
        
        return {
            "@context": context,
            "id": id,
            "authentication": authentication
        }
    }
  
    return { ev: resolve }
  }