// listen for JSON input
// store json input
// retrieve JSON input

var fs = require('fs');
var http = require('http');
var url = require('url');

var channels = {store: {}};
var internal = jazzbase("_config_");

if ( ! internal.get("log")) {
    internal.set("log", []);
}

internal.push("log", new Date() + " :: Initing Jazzbase");

function readStores() {
    var files = fs.readdirSync(".");
    var channelsAvailable = [];

    files.forEach(function (item) {
        var channel;
        if (item.indexOf('jazzbase-') > -1 && item.indexOf('.json') > -1) {
            channel = item.substr('jazzbase-'.length, item.length - '.json'.length);
            channelsAvailable.push(channel);
        }
    });

    channelsAvailable.forEach(function (channel) {
        var channelData = fs.readFileSync('jazzbase-' + channel + '.json', 'utf8');
        channels[channel] = JSON.parse(channelData);
    });
}

function readStores() {
    var files = fs.readdirSync(".");
    var channelsAvailable = [];

    files.forEach(function (item) {
        var channel;
        if (item.indexOf('jazzbase-') > -1 && item.indexOf('.json') > -1) {
            channel = item.substr('jazzbase-'.length, item.length - '.json'.length - 'jazzbase-'.length);
            channelsAvailable.push(channel);
        }
    });

    channelsAvailable.forEach(function (channel) {
        var channelData = fs.readFileSync('jazzbase-' + channel + '.json', 'utf8');
        channels[channel] = JSON.parse(channelData);
    });
}

function listenRemote() {
    try {
        http.createServer(function (req, res) {
            var clientIP = getReqIP(req);

            console.log(new Date() + " " + clientIP + " :: Connected");
            internal.push("log", new Date() + " " + clientIP + " :: Connected");

            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });

            var toPush = url.parse(req.url,true).query.push ||  null;

            var channel = url.parse(req.url,true).query.channel ||  null;
            var key = url.parse(req.url,true).query.key ||  null;
            var data = url.parse(req.url,true).query.data ||  null;
            var out = '';

            if (toPush && channel && key) {
                out = jazzbasePush(channel, key, toPush);
            } else if (data && channel && key) {
                out = jazzbaseSet(channel, key, data);
            } else if (channel && key) {
                out = jazzbaseGet(channel, key);
            }

            out = JSON.stringify(out);
            
            console.log(new Date() + " " + " $$$$$$$$$$$$ ", clientIP + " :: Response: " + out);
            internal.push("log", new Date() + " " + clientIP + " :: Response: " + out);

            res.end(out);

        }).listen(1337);
    } catch(e) {
        console.log("@@@@@@@@@", Object.keys(e));
        throw new Error("BOOM!");
    }

    console.log("Listening http://jamaica-miami.codio.io:1337 ...");
}

function getReqIP(req) {
    return req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
}

function updateJazzbase(channel) {
    try {
        fs.writeFileSync(getJazzbaseChannelFile(channel), JSON.stringify(channels[channel]));
        return true;
    } catch (e) {
        return false;
    }
}

function getJazzbaseChannelFile (channel) {
    return './jazzbase-' + (channel || 'store') + '.json';
}

function touchChannel(channel) {
    if ( ! channels[channel]) {
        channels[channel] = {};
    }
}

function jazzbaseGet(channel, key) {
//     console.log(" >>>>> GET");
//     console.log(" >>>>> ", channel);
//     console.log(" >>>>> ", key);
    console.log(" >>>>> GET ", channels[channel][key]);
    return channels[channel][key];
}

function jazzbaseSet(channel, key, data) {
//     console.log(" >>>>> SET", new Error().stack);
//     console.log(" >>>>> ", channel);
//     console.log(" >>>>> ", key);
    console.log(" >>>>> SET ", data);
//     console.log(" >>>>> ", channels[channel][key]);
    
    touchChannel(channel);
    
    try {
        channels[channel][key] = JSON.parse(data);
    } catch (e) {
        channels[channel][key] = data;
    }
    
    return updateJazzbase(channel);
}

function jazzbasePush(channel, key, data) {
//     console.log(" >>>>> PUSH");
//     console.log(" >>>>> ", channel);
//     console.log(" >>>>> ", key);
//     console.log(" >>>>> ", data);
//     console.log(" >>>>> ", channels[channel] && channels[channel][key]);
    
    touchChannel(channel);
    
    var pushed = ( channels[channel][key] || []);
    pushed.push(data);
    return jazzbaseSet(channel, key, pushed);
}

function jazzbase(channel) {
    readStores();
    touchChannel(channel);
    
    return {
        get: function (key) {
            return jazzbaseGet(channel, key);
        },
        set: function (key, data) {
            return jazzbaseSet(channel, key, data);
        },
        push: function (key, data) {
            return jazzbasePush(channel, key, data);
        }
    };
}

module.exports = jazzbase;

listenRemote();









// var http = require('http');
// var fs = require('fs');
// var url = require('url') ;
//var index = fs.readFileSync('index.html');

// var timestamp;

// http.createServer(function (req, res) {
// 	res.writeHead(200, {'Content-Type': 'application/json'});

// 	var toSet = url.parse(req.url,true).query.set; // :1337?set=
// 	var toGet = url.parse(req.url,true).query.get; // :1337?get=

// 	timestamp = (new Date()).valueOf();

// 	if (toSet) {
// 		fs.writeFile(__dirname + "/messages/message" + timestamp + ".txt", message, function(err) {
// 			if(err) {
// 				console.log(err);
// 			} else {
// 				console.log("\nMESSAGE" + timestamp + ": " + message);
// 			}
// 		}); 
// 	}

// 	res.end("* --- EOF (" + new Date() + ") --- * <br><br>" + message);

// }).listen(1337);

// console.log("Listening http://artur.office.stayfilm.com.br:1337?x= ...");