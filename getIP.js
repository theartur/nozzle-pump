var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var startTime = new Date();
var requestsWaiting = 0;
var goodProxiesFound = 0;
var failedList = [];
var limitResponseTime = 10000;

var requestMin = limitResponseTime;
var requestMed = 0;
var requestMax = 0;

pluckProxyList(false, rankProxyList);

function getNewIPPort(proxyList) {}

function rankProxyList(proxyList) {
    var rank = [];

    var firstRequest = timeTag();

    proxyList.forEach(function(proxy) {
        // var target = proxy.ip + ":" + proxy.port;
        var target = proxy;

        testProxy(target, function(result) {
            if (result) {
                goodProxiesFound++;

                // append to file
                fs.appendFile('proxy-list.txt', proxy.ip + ":" + proxy.port + "\n", function(err) {
                    if (err) throw err;
                });

                // rank.push({
                // 	proxy: target
                // });
            } else {
                //console.log("PROXY FAILED :(");
                failedList.push(target);
            }
        });
    });

    console.log("- " + proxyList.length + " loaded - requested in " + (timeTag() - firstRequest) + " ms -");
}

function rankProxiesByVelocity(proxyList, callback) {

    return promise;
}

function uniquefyQueue(queue) {
    // body...
    return promise;
}

function fixRank(rank) {
    return promise;
}

function timeTag() {
    return new Date() - startTime;
}

function testProxy(proxy, callback) {
    //console.log("proxy", proxy);

    var startRequest = timeTag(),
        testTarget = {
            url: "http://recuse-embody.codio.io/proof.html",
            encoding: 'binary',
            proxy: 'http://' + proxy.ip + ":" + proxy.port
        };

    requestsWaiting++;
    //console.log("Waiting requests: " + requestsWaiting);

    request(testTarget, function(err, resp, body) {
        // console.log("\n\n\n### BODY ###\n\n\n", body);

        var requestLoadTime = timeTag() - startRequest;

        requestsWaiting--;
        //console.log("\t\t\t" + requestsWaiting + " to go...");

        if (body) {
            var $ = cheerio.load(body, {
                decodeEntities: true
            });


            if ($("div#successful-proxy").length == 1) {
                //console.log(":):):):):) good proxy");


                requestMin = requestLoadTime < requestMin ? requestLoadTime : requestMin;
                requestMed = (requestLoadTime + requestMed) / 2 | 0;
                requestMax = requestLoadTime > requestMax ? requestLoadTime : requestMax;

                console.log(requestLoadTime + " ms\t\t" + proxy.country + "\t\t" + proxy.ip + ":" + proxy.port);

                if (requestLoadTime > limitResponseTime) {
                    console.log("\nmin: " + requestMin + " ");
                    console.log("med: " + requestMed + " ");
                    console.log("max: " + requestMax + " \n");
                    console.log("\n" + goodProxiesFound + " good proxies found.");
                    console.log("\nDone in " + timeTag() + " ms\n");
                    process.exit();
                }

                callback(requestLoadTime);
            } else {
                //console.log(":(:( bad proxy");
                callback(false);
            }

        }

    });
}

function pluckProxyList(withProxy, callback) {
    var proxyList = [],
        proxyListTarget = {
            url: "http://free-proxy-list.net",
            encoding: 'binary'
        };

    if (withProxy) {
        proxyListTarget.proxy = withProxy;
    }

    request(proxyListTarget, function(err, resp, body) {
        var $ = cheerio.load(body, {
            decodeEntities: true
        });

        $("#proxylisttable tbody tr").each(function() {
            // <tr>
            // 	0<td>80.74.118.78</td>
            // 	1<td>8080</td>
            //	2<td>IL</td>
            // 	3<td>Israel</td>
            // 	4<td>elite proxy</td>
            // 	5<td>no</td>
            // 	6<td>no</td>
            // 	7<td>4 seconds ago</td>
            // </tr>
            var $this = $(this),
                data = $this.find("td"),
                proxy = {
                    ip: $(data[0]).text(),
                    port: $(data[1]).text(),
                    countryCode: $(data[2]).text(),
                    country: $(data[3]).text(),
                    type: $(data[4]).text(),
                    google: $(data[5]).text(),
                    https: $(data[6]).text(),
                    lastChecked: $(data[7]).text()
                };

            proxyList.push(proxy);
        });

        callback(proxyList);
    });
}