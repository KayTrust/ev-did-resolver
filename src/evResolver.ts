import { DIDDocument, DIDResolutionOptions, ParsedDID, Resolver } from "did-resolver"
import { InvalidMnid } from "./errors";
import Web3Instance from "./web3"

const mnid = require('mnid');

export const setConfigResolver = (host: string, abi: object, contractAddress: string, headers?: [{ name: string, value: string }]) => {
    Web3Instance.setWeb3Instance(host, headers);
    Web3Instance.setContractInstance(abi, contractAddress);
}

export const getResolver = () => {
    const resolve = async (did: string, parsed: ParsedDID, didResolver: Resolver, options: DIDResolutionOptions): Promise<any> => {
        const didParts = did.split(':');
        const mnidToDecode = didParts[2];
        if (!mnid.isMNID(mnidToDecode)) throw new InvalidMnid(`invalid mnid ${mnidToDecode}`);
        const decodeMnid = mnid.decode(mnidToDecode);
        const context = "https://w3id.org/did/v1";
        const id = did;
        const authentication: {[key: string]: any} = [];
        const events = await Web3Instance.getPastEvent(decodeMnid.address);

        let countKey = 1;
        for (const iterator of events) {
            /*
                has cap ????
            */
            authentication.push({
                "id": `${iterator.returnValues.device}#keys-${countKey}`,
                "type": "EcdsaSecp256k1RecoveryMethod2020",
                "blockchainAccountId": `eip155:${decodeMnid.network}:${decodeMnid.address}`
            })
            countKey++;
        }
        return {
            "@context": context,
            "id": id,
            "authentication": authentication
        }
    }
  
    return { ev: resolve }
  }