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

var casper = require('casper').create({
    pageSettings: { 
        webSecurityEnabled: false 
    },
    waitTimeout: 60000,
//     verbose: true,
//     logLevel: "debug"
});

casper.start('http://bluesatoshi.com/', function() {
    
});

var links = [
    'http://bluesatoshi.com/'
];

casper.start().each(links, function(self, link) {
    self.echo("CHAMANDO " + link);
    
    self.thenOpen(link, function() {
        
        this.echo("OK " + link);
        var innerText = this.evaluate(function() {
            return document.body.innerText;
        });
        
        innerText = innerText.trim();
        
        this.echo("\n\n\ninnerText: " + innerText + "\n\n\n");
        
        // get funds
        var foundSomething = [], thisMatch;
        for (var i = 0; i < possibleFundsPhrase.length; i++) {
            thisMatch = innerText.match(new RegExp(possibleFundsPhrase[i], 'ig'));
//             thisMatch = innerText.match(new RegExp('balance.*?:.*?\\d+', 'ig'));
            
            this.echo("\n\n\nthisMatch: " + thisMatch);
            this.echo("thisMatch: " + typeof thisMatch + "\n\n\n");
            
            if (thisMatch) {
                foundSomething.concat(thisMatch);
            } else {
                this.echo("NO MATCH FOR " + possibleFundsPhrase[i] + "\n\n\n");
            }
        }
        
        this.echo("\n\n\n");
        this.echo(" >>> FOUND SOMETHING!!! " + foundSomething.length + " >>> " + foundSomething.join(" --@@@-- "));
        this.echo("\n\n\n");
        
        // get rewards
        // get referral
        
        // this.echo(innerText);
    });
});

casper.run(function() {
    // echo results in some pretty fashion
    this.echo('ALL DONE :)');
    this.exit();
});