var jazzbase = require("./jazzbase.js")('sandbox');

jazzbase.push('CHAVE', Math.random() + ' :)');

console.log("O_O", jazzbase.get('CHAVE'));