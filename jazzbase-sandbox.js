// missão: comunicação eficiente entre node e casper orquestrado via node clustering
// 
// FIRST RULE: ALWAYS VALID JSON, anything else is considered error
// 
// INPUT/OUTPUT JSON, else THROW
// 
// - carrega o site
// - e aguarda instruções para executar no ambiente casper ou no site
// 
// 
// - entra no site
// - identifica o captcha
// - disponibiliza para resolução
// - ouve até receber resposta, via node_modules
// 
// Cada peça do casperjs precisa

var casper = require('casper').create();
var args = casper.cli.args;
var jazzbase = require("./jazzbase.js")('sandbox');

jazzbase.push('CHAVE', Math.random() + ' :)');

console.log("O_O", jazzbase.get('CHAVE'));

console.log("--->>> ", args);