jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000000;
const DIDResolver = require('did-resolver').Resolver;
const EvResolver = require('../lib/index');
// const host = 'https://api-gateway-dev.demo.kaytrust.id/backend/ms-besu-service';
// const host = 'http://localhost:8545';
const host = 'http://127.0.0.1:4543';
const addressIM = '0xa6b4540a2bfbe8663caa78027c83d0dcb1b7c837';
const headers = [{ name: 'Authorization', value: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI4OXp2WUZMZkJuREZwc2d2Rk1GQV9iMTc1M2Zma2dZV3hHZFpvajVueUFFIn0.eyJleHAiOjE2NTc2MDI0MTAsImlhdCI6MTY1NzU2NjQxMSwiYXV0aF90aW1lIjoxNjU3NTY2NDEwLCJqdGkiOiIzODM0MzFiZi1hNDcyLTRmMTEtOTQ1Yy01OGU5NTRjYTc2ZmQiLCJpc3MiOiJodHRwczovL2F1dGgtZGV2LmRlbW8ua2F5dHJ1c3QuaWQvYXV0aC9yZWFsbXMvUHJvdmlkZXItVGVzdCIsImF1ZCI6WyJrdFByb3ZpZGVyU2hlbGwiLCJhY2NvdW50Il0sInN1YiI6IjdlNGQyYjQxLThiOTYtNGNhYS1iYWJkLTRjYmVkOTg5ZGYyMiIsInR5cCI6IkJlYXJlciIsImF6cCI6IndhbGxldENsaWVudCIsIm5vbmNlIjoiRW9taTNtQ1RJeDVXVGJMYzVlQlR2USIsInNlc3Npb25fc3RhdGUiOiJhY2EwNDBlMC05NDI5LTQ1MzQtYjg2Yi03Njc2M2JiMzcxYTUiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtcHJvdmlkZXItdGVzdCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJrdFByb3ZpZGVyU2hlbGwiOnsicm9sZXMiOlsibW9kdWxlOjppZGVudGl0eSIsIm1vZHVsZTo6cHJlc2VudGF0aW9uIiwibW9kdWxlOjpjcmVkZW50aWFsIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCIsInNpZCI6ImFjYTA0MGUwLTk0MjktNDUzNC1iODZiLTc2NzYzYmIzNzFhNSJ9.I7hz-AeiR3wOJ4d4O0WWonJiLFDWqpQUwyEPB_bCOYSqSYztlfAMhax8ZUYkzTMJpEX0UjXcHx4M8I78ukNfut-SzTvt32uxHvTCcKiGyLUpYTPPwsXbgL7OS5WRCo1sGq31wfI_SRbIqeHmomWUdcOvpwEuCTnqzrKCWuYh5hiL8wErX0xaw9NgpSP6GuA5O6HM1udLEmjOM2yPBw7QnTryhM3s4kzuDDIQ9SWI5YrS_7vWd26vvuzpLwgYwCbvi4oDp35VTrwJJoS5MX4r7RbikCa31J9nXqS2u0LR6wGvxtift1Fpvb2-srg2Fa-IoTsQtOzCMb7ay_ysLQnGCQ' }];

describe("EV Resolver", () => {

	let resolver;

	beforeAll(() => {
		const options = {
			host,
			addressIM,
			headers,
			findEvents: true,
			keys: ['0x2FD3a895C728652FFe586b0B9e07B47edfC6e3FD']
		}
		const evResolver = EvResolver.getResolver(options);
		resolver = new DIDResolver(evResolver);
	});

    // it('DIDResolver return a document', () => {
	// 	const options = {
	// 		host,
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
		return resolver.resolve('did:ev:cwMLAqQCguxLzd1biFQH4xpy2M7BZXvvcXKZ7')
		.then(doc => {
			console.log(doc);
			expect(doc).not.toBeNull();
		});
	});
});