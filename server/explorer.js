/* vim: set sw=2 ts=2 : */
const http = require('http');
//var fs = require('fs');
const db = require('mysql');

const server = http.createServer((req, res) => {
	// support service entry point
});

server.listen(80, () => {
	console.log('Support server API started.');
});

const crawler = setInterval(() => {
	// crawler entry point
	//console.log('crawling');
}, 1000); // 1 sec interval
console.log('Crawler started.');

function clear(sig) {
	console.log();
	// clearing up
	server.close(() => {
		console.log('Support server API terminated.');
	})
	clearTimeout(crawler);
	// TODO: wait until running crawler is done.
	console.log('Crawler stopped.');
}

process.on('SIGINT', clear)
process.on('SIGTERM', clear)
