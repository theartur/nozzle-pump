// Get funds from every front page
// - get url
// - search for possibleFundsPhrase
// - get any numbers after it
// 
// Iterate over founds and nonFounds, because an answer about how to find nonFounds is by teaching immediately
// 
// VALUE OF nonFounds: an answer about how to find nonFounds is found when you look how it's done, and teach

var listToSearch;
var possibleFundsPhrase = ["funds.*?:.*?\\d+", "balance.*?:.*?\\d+"];
var possibleRewardsPhrase = ["every.*?\\d+.*?(minute|hour)s?"];
var possibleReferralPhrase = ["referral.*?(http://)"];

var faucetz = require('nozzle-filtered').results;

var casper = require('casper').create({
    pageSettings: { 
        webSecurityEnabled: false 
    },
    waitTimeout: 60000,
    verbose: true,
    logLevel: "debug"
});

casper.on('page.resource.requested', function(requestData, request) {
    if (requestData.url.indexOf('about:blank') > -1) {
        request.abort();
    }
    
    if (requestData.url.indexOf('winning.com--congrats.info') > -1) {
        request.abort();
    }
});

var successfulReadCount = 0;
var totalFunds = 0;
var idList = [];

function parseFunds(id, match) {
    var value = parseInt((''+match).replace(/[^0-9]/ig, ''), 10);
    idList.push({id:id,value:value});
    if (value) {
        successfulReadCount++;
        totalFunds += value;
    }
}

casper.start().each(faucetz, function(self, link) {
    
    link = link.link;
    
    self.echo("CHAMANDO " + link);
    
    self.thenOpen(link, function() {
        
        this.echo(" -- OK " + link);
        this.echo('\n\n\n---\n (' + successfulReadCount + ') TOTAL: ' + totalFunds + "\n\n---");
        
        var innerText = this.evaluate(function() {
            return document.body.innerText;
        });
        
//         this.echo("\n\n\ninnerText: " + innerText + "\n\n\n");
        
        // get funds
        var foundSomething = [], thisMatch;
        for (var i = 0; i < possibleFundsPhrase.length; i++) {
            thisMatch = innerText.match(new RegExp(possibleFundsPhrase[i], 'i'));
//             thisMatch = innerText.match(new RegExp('balance.*?:.*?\\d+', 'ig'));
            

            
            if (thisMatch) {
                this.echo("\n\n\nthisMatch: " + thisMatch);
                parseFunds(link, thisMatch);
                break;
                //foundSomething.concat(thisMatch);
            } else {
                this.echo("NO MATCH FOR " + possibleFundsPhrase[i] + "\n\n\n");
            }
        }
        
//         this.echo("\n\n\n");
//         this.echo(" >>> FOUND SOMETHING!!! " + foundSomething.length + " >>> " + foundSomething.join(" --@@@-- "));
//         this.echo("\n\n\n");
        
        // get rewards
        // get referral
        
        // this.echo(innerText);
    });
});

casper.run(function() {
    // echo results in some pretty fashion
    this.echo('\n\n\n\n\nALL DONE :)\n\n');
    this.echo('---');
    //this.echo('LIST: ' + JSON.stringify(idList));
    this.echo('TOTAL: ' + totalFunds);
    this.echo('---');
    this.exit();
});