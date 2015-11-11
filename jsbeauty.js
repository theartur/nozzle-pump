var input = require("nozzle-list");

function replacer(key, value) {
}

var output = JSON.stringify(input, null, '\t');

require('fs').writeFileSync('./node_modules/nozzle-filtered.js', output, 'utf8');