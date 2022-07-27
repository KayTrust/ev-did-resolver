[![npm](https://img.shields.io/npm/dt/@kaytrust/ev-did-resolver.svg)](https://www.npmjs.com/package/@kaytrust/ev-did-resolver)
# EV DID Resolver

This library is a resolver for ["EV" DID Method](https://github.com/KayTrust/did-method-ev).

It supports the proposed [Decentralized Identifiers](https://www.w3.org/TR/did-core/#identifiers) spec from the [W3C Credentials Community Group](https://www.w3.org/) and wrap them in a [DID Document](https://www.w3.org/TR/did-spec-registries/#did-document-properties).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

## Resolving a DID document

The library presents a `resolve()` function that returns a `Promise` returning the DID document. It is not meant to be used directly but through the [`did-resolver`](https://github.com/decentralized-identity/did-resolver) aggregator.

You can use the `getResolver(config)` method to produce an entry that can be used with the `Resolver` constructor:

```javascript
import { Resolver } from 'did-resolver'
import EvResolver from 'ev-did-resolver'

const evResolverConfig = { 
        host: 'http://localhost:8545',
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

|Key   | Description  | Default | Notes
|---|---|---|---
| host | RPC node url | (mandatory)
| addressIM | Address of the Identity Manager contract | (mandatory)
| headers | Additional HTTP headers for JSON-RPC calls to node, such as authentication | No headers
| findEvents | Use Ethereum events as a source for getting the authorized keys. | ```true```  |
| keys | Use an explicit list of keys as a source for getting the authorized keys. E.g.: ```['0x2FD3a895C728652FFe586b0B9e07B47edfC6e3FD']``` | ```[]```
| baseBlocks | Minimun value for ```fromBlock```. | ```30000000``` | Only used when `findEvents` is `true`. 
| lastBlocks | Last blocks to be taken from ```toBlock```. | ```0``` | Only used when `findEvents` is `true`.
| bufferSize | Size of the slices in the event searching. Use greater values to search more efficiently, use lower values to avoid possible timeout problems. |```100000``` | Only used when `findEvents` is `true`.
| startBlockMargin | Web3JS or Besu seem to have a bug where filtering events sometimes ignores events emitted in the early blocks. This setting can be used to work around the issue by starting the filtering on an earlier block number. | ```100000``` | Only used when `findEvents` is `true`.
