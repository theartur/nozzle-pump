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

function readChannel(channel) {
    var defer = defer();

    var channelData = fs.readFile('jazzbase-' + channel + '.json', 'utf8', function (err, data) {
        if (err) {
            defer.resolve(null);
        }
        
        defer.resolve(JSON.parse(data));
    });
    
    return defer;
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

            if (!data && toPush && channel && key) {
                out = jazzbasePush(channel, key, toPush);
            } else if (!toPush && data && channel && key) {
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

function writeChannel(channel, key, data, push) {
    var defer = defer();
    
    readChannel(channel).then(function (db) {
        db = db || {};
        
        if (push) {
            db[key].push(data);
        } else {
            db[key] = data;
        }

        try {
            var strDB = JSON.stringify(db);

            fs.writeFile(getJazzbaseChannelFile(channel), strDB, function (err) {
                defer.resolve(err);
            });
        } catch (e) {
            defer.resolve(e);
        }
    });
    
    return defer;
}

function getJazzbaseChannelFile (channel) {
    return './jazzbase-' + (channel || 'store') + '.json';
}

function jazzbaseGet(channel, key) {
    var defer = defer();
    
    readChannel(channel).then(function(db){
        if (db) {
            defer.resolve(db[key]);
        } else {
            defer.resolve(null);
        }
    });
    
    return defer;
}

function jazzbaseSet(channel, key, data) {
    var defer = defer();
    
    writeChannel(channel, key, data).then(function (err) {
        defer.resolve(err);
    });
    
    return defer;
}

function jazzbasePush(channel, key, data) {
    var defer = defer();
    
    writeChannel(channel, key, data, true).then(function (err) {
        defer.resolve(err);
    });
    
    return defer;
}

function defer() {
    return {
        then: function (callback) {
            this.resolve = callback;
        }
    };
}

function jazzbase(channel) {
    return {
        get: function (key) {
            var defer = defer();
            
            jazzbaseGet(channel, key).then(function (data) {
                defer.resolve(data);
            });
            
            return defer;
        },
        set: function (key, data) {
            var defer = defer();
            
            jazzbaseSet(channel, key, data).then(function (err) {
                defer.resolve(err);
            });
            
            return defer;
        },
        push: function (key, data) {
            var defer = defer();
            
            jazzbasePush(channel, key, data).then(function (err) {
                defer.resolve(err);
            });
            
            return defer;
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