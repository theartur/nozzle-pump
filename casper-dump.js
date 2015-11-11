var casper = require('casper').create();
var url = casper.cli.args;
console.log(url);
casper.exit();