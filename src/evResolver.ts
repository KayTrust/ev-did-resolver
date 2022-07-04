import { DIDDocument, DIDResolutionOptions, ParsedDID, Resolver } from "did-resolver"
import { InvalidMnid } from "./errors";
import Web3Instance from "./web3"

const mnid = require('mnid');

type ResolverOptions = {
    baseBlocks: number | undefined | null
    lastBlocks: number | undefined | null
    bufferSize: number | undefined | null
}

export const setConfigResolver = (host: string, abiIM: object, address: string, abiProxy: string, headers?: [{ name: string, value: string }], options?: ResolverOptions) => {
    Web3Instance.setWeb3Instance(host, abiIM, address, abiProxy, headers);
    if (options?.baseBlocks) Web3Instance.setBaseBlocks(options.baseBlocks);
    if (options?.lastBlocks) Web3Instance.setBaseBlocks(options.lastBlocks);
    if (options?.bufferSize) Web3Instance.setBaseBlocks(options.bufferSize);
}

export const getResolver = () => {
    const resolve = async (did: string, parsed: ParsedDID, didResolver: Resolver, options: DIDResolutionOptions): Promise<any> => {
        
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
        if (findEvents) keysInfo = (await Web3Instance.getPastEventFromIM()).map(x => x.returnValues);
        if (keys) keysInfo = keysInfo.concat(keys);
        const readKeys: any = [];
        
        let countKey = 1;

        for (const iterator of keysInfo) {
            if (!iterator.identity || !iterator.device || !iterator.cap) continue;
            if (decodeMnid.address.toUpperCase() === iterator.identity.toUpperCase()) {
                if (readKeys.some((x: string) => x === iterator.device)) continue;
                const hasCap = await Web3Instance.hasCap(decodeMnid.address, iterator.device, iterator.cap);
                if (hasCap) {
                    authentication.push({
                        "id": `${iterator.device}#keys-${countKey++}`,
                        "type": "EcdsaSecp256k1RecoveryMethod2020",
                        "blockchainAccountId": `eip155:${decodeMnid.network}:${decodeMnid.address}`
                    });
                    readKeys.push(iterator.device);
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