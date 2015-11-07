var utils = require('utils');
var json = require('test.json');

utils.dump(json);
utils.dump(json.test); // hello
utils.dump(json["test"]); // hello