jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000000;
const DIDResolver = require('did-resolver').Resolver;
const EvResolver = require('../lib/index');
// const host = 'https://api-gateway-dev.demo.kaytrust.id/backend/ms-besu-service';
// const host = 'http://localhost:8545';
const host = 'http://127.0.0.1:4543'
const abiIM = [{'inputs':[],'payable':false,'stateMutability':'nonpayable','type':'constructor'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'},{'indexed':false,'internalType':'address','name':'newUser','type':'address'}],'name':'AccountRecovered','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'identity','type':'address'},{'indexed':false,'internalType':'address','name':'device','type':'address'},{'indexed':false,'internalType':'string','name':'cap','type':'string'},{'indexed':false,'internalType':'uint256','name':'start_date','type':'uint256'},{'indexed':false,'internalType':'uint256','name':'end_date','type':'uint256'}],'name':'CapSet','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'}],'name':'IdentityCreated','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'}],'name':'IdentityRegistered','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'proxy','type':'address'}],'name':'IdentityUnregistered','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'string','name':'username','type':'string'},{'indexed':false,'internalType':'address','name':'from','type':'address'}],'name':'MnemonicSet','type':'event'},{'anonymous':false,'inputs':[{'indexed':false,'internalType':'address','name':'oldIdentityManager','type':'address'},{'indexed':false,'internalType':'address','name':'newIdentityManager','type':'address'}],'name':'Upgraded','type':'event'},{'constant':false,'inputs':[{'internalType':'bytes16','name':'keyMnemonic','type':'bytes16'},{'internalType':'bytes16','name':'keyProfile','type':'bytes16'},{'internalType':'string','name':'urlProfile','type':'string'},{'internalType':'string','name':'username','type':'string'},{'internalType':'string','name':'salt','type':'string'}],'name':'createIdentity','outputs':[{'internalType':'address','name':'','type':'address'}],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'destination','type':'address'},{'internalType':'uint256','name':'value','type':'uint256'},{'internalType':'bytes','name':'data','type':'bytes'}],'name':'forwardTo','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'device','type':'address'},{'internalType':'string','name':'cap','type':'string'}],'name':'hasCap','outputs':[{'internalType':'bool','name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'owner','type':'address'}],'name':'registerIdentity','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':true,'inputs':[{'internalType':'address','name':'','type':'address'}],'name':'registered_identities','outputs':[{'internalType':'bool','name':'','type':'bool'}],'payable':false,'stateMutability':'view','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'device','type':'address'},{'internalType':'string','name':'cap','type':'string'},{'internalType':'uint256','name':'start_date','type':'uint256'},{'internalType':'uint256','name':'end_date','type':'uint256'}],'name':'setCap','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'address','name':'device','type':'address'},{'internalType':'uint256','name':'start_date','type':'uint256'},{'internalType':'uint256','name':'end_date','type':'uint256'}],'name':'setDevice','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'}],'name':'unregisterIdentity','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'},{'constant':false,'inputs':[{'internalType':'contract Proxy','name':'identity','type':'address'},{'internalType':'contract IdentityManager','name':'newIdentityManager','type':'address'}],'name':'upgrade','outputs':[],'payable':false,'stateMutability':'nonpayable','type':'function'}];
const abiProxy = [{"inputs":[{"internalType":"address","name":"firstOwner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"destination","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Forwarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"formerOwner","type":"address"}],"name":"OwnerRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Received","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"addOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"destination","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"forward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"owners","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounce","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}];
const addressIM = '0xa6b4540a2bfbe8663caa78027c83d0dcb1b7c837';
const headers = [{ name: 'Authorization', value: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI4OXp2WUZMZkJuREZwc2d2Rk1GQV9iMTc1M2Zma2dZV3hHZFpvajVueUFFIn0.eyJleHAiOjE2NTcxNTI1NTMsImlhdCI6MTY1NzExNjU1NCwiYXV0aF90aW1lIjoxNjU3MTE2NTUzLCJqdGkiOiJmMDk3MDQ2My04MGU0LTRlMDctOGRkNC0zMjk1NTk0ODQxMDQiLCJpc3MiOiJodHRwczovL2F1dGgtZGV2LmRlbW8ua2F5dHJ1c3QuaWQvYXV0aC9yZWFsbXMvUHJvdmlkZXItVGVzdCIsImF1ZCI6WyJrdFByb3ZpZGVyU2hlbGwiLCJhY2NvdW50Il0sInN1YiI6IjdlNGQyYjQxLThiOTYtNGNhYS1iYWJkLTRjYmVkOTg5ZGYyMiIsInR5cCI6IkJlYXJlciIsImF6cCI6IndhbGxldENsaWVudCIsIm5vbmNlIjoiMkVnNndHZklGT012d0pBcmtvWDN1USIsInNlc3Npb25fc3RhdGUiOiIxY2NmMDEwNS01YWNhLTRlMWEtOGZkMC01YTA1YmY5YWVkODIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtcHJvdmlkZXItdGVzdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJrdFByb3ZpZGVyU2hlbGwiOnsicm9sZXMiOlsibW9kdWxlOjppZGVudGl0eSIsIm1vZHVsZTo6cHJlc2VudGF0aW9uIiwibW9kdWxlOjpjcmVkZW50aWFsIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsInNpZCI6IjFjY2YwMTA1LTVhY2EtNGUxYS04ZmQwLTVhMDViZjlhZWQ4MiJ9.HOVswev2CVlcmV1cbAUWQfcjLonVo1aQCLp3Pi8MpJKG6CqTRH4tHlJvVzJL69LUHLSocbpCOa9iTFxLRglqBj5Pejz3HvyJW8MHndTfiE44lFwrNyPh9_jiw2m-YnbyYrTZC6gpRv2a2VBSm6t5vR60ccG4LRWs2W06P4VMNrj6CfbeSF7D0NT0hVT4sD7a4ge2avPLCkmIH6vlKs16HlXNeEee9wQUAP8kleCEVb73d3XgfzGTHlZBb1nO-Zxi9sZs4mCX04SJTWw6FV65USPW9K2Su3FhzSNtl9rHhxA4tqm5Z3AXK3Xrq7gJX7OYwRLnzzqDdobFovpI1Uxlrw' }];

describe("EV Resolver", () => {

	let resolver;

	beforeAll(() => {
		const evResolver = EvResolver.getResolver();
		resolver = new DIDResolver(evResolver);
	});

    // it('DIDResolver return a document', () => {
	// 	const options = {
	// 		host,
	// 		abiIM,
	// 		abiProxy,
	// 		addressIM,
	// 		headers
	// 	}
	// 	return resolver.resolve('did:ev:cwMLAqQCguxLzd1biFQH4xpy2M7BZXvvcXKZ7', options)
	// 	.then(doc => {
	// 		console.log(doc);
	// 		expect(doc).not.toBeNull();
	// 	});
	// });

	it('DIDResolver return a document with options', () => {
		const options = {
			host,
			abiIM,
			abiProxy,
			addressIM,
			headers,
			findEvents: true,
			keys: ['0x2FD3a895C728652FFe586b0B9e07B47edfC6e3FD']
		}
		return resolver.resolve('did:ev:cwMLAqQCguxLzd1biFQH4xpy2M7BZXvvcXKZ7', options)
		.then(doc => {
			console.log(doc);
			expect(doc).not.toBeNull();
		});
	});
});