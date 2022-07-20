[![npm](https://img.shields.io/npm/dt/ev-did-resolver.svg)](https://www.npmjs.com/package/ev-did-resolver)

# EV DID Resolver

This library is resolve a
[Decentralized Identifiers](https://w3c.github.io/did-core/#identifier) and wrap them in a
[DID Document](https://w3c.github.io/did-core/#did-document-properties)

It supports the proposed [Decentralized Identifiers](https://w3c.github.io/did-core/#identifier) spec from the
[W3C Credentials Community Group](https://w3c-ccg.github.io).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

## DID method

To encode a DID, simply prepend `did:ev:[mnid]`

The mnid is a string that is compliant with the Multi-Network ID format. It refers to the Multi-Network identifier of the identity's Proxy contract. An MNID is an encoding of an (address, networkID) pair, so it's possible to compute a DID from an address and networkID pair, and vice versa. Assuming networkIDs are unique and well known, a DID thus allows to discover the specific Proxy contract behind a given DID, and reciprocally.

eg:

`did:ev:cwMLAqQCguxLzd1biFQH4xpy2M7BZXvvcXKZ7`

## Resolving a DID document

The library presents a `resolve()` function that returns a `Promise` returning the DID document. It is not meant to be
used directly but through the [`did-resolver`](https://github.com/decentralized-identity/did-resolver) aggregator.

You can use the `getResolver(config)` method to produce an entry that can be used with the `Resolver`
constructor:

```javascript
import { Resolver } from 'did-resolver'
import EvResolver from 'ev-did-resolver'

const evResolverConfig = { 
        host: 'http://localhost:8545',
        abiIM: [{...}],
        abiProxy: [{...}],
        addressIM: '0xa6b4540a2bfte8663cba78027c83d0dcb1b7c837',
        headers: []
    };
}

const evResolver = EvResolver.getResolver(evResolverConfig);

const didResolver = new Resolver(evResolver);

const doc = await didResolver.resolve('did:ev:cwMLAqQCguxLzd1biFQH4xpy2M7BZXvvcXKZ7')

// RESULT EXAMPLE
/*
{
    "@context": "https://w3id.org/did/v1",
    "id": "did:ev:cwMLAqQCguxLzd1biFQH4xpy2M7BZXvvcXKZ7",
    "authentication": [
        {
            "id": "0x4C647014a838EcFCADD3ab39Faa61a163862FFD8#keys-1",
            "type": "EcdsaSecp256k1RecoveryMethod2020",
            "blockchainAccountId": "eip155:0x9e551:0x5c244d081d8e0b404116f2dc2a94ff43d1c76931"
        },
        {
            "id": "0x2215638CdA1A665C676105df560a6915eb83cD8E#keys-2",
            "type": "EcdsaSecp256k1RecoveryMethod2020",
            "blockchainAccountId": "eip155:0x9e551:0x5c244d081d8e0b404116f2dc2a94ff43d1c76931"
        },
    ]
}
*/
```

## props

```evResolverConfig``` accepts this props:

|Key   | Description  | 
|---|---|
| host | RPC node url |
| abiIM | abi of identity manager |
| addressIM | address of identity manager |
| abiProxy | abi for proxy |
| headers | aditional headers for node authentication |
| baseBlocks | minimun value for ```fromBlock```. Default ```30000000``` |
| lastBlocks | last blocks to be taken from ```toBlock```. Default ```0``` |
| bufferSize | value to search for slices in the entire from-to range. This to avoid possible timeout problems. Default ```100000``` |
| startBlockMargin | number of blocks as margin for the ```baseBlock```. this to have greater precision in capturing the events. Default ```100000``` |
| findEvents | enable search in events. Default ```true```  |
| keys | list of keys as aditional data for validate capabilities and wrap them in a did document. Eg: ```['0x2FD3a895C728652FFe586b0B9e07B47edfC6e3FD']``` |