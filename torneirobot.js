var wallet = '1KLruuKccfWcGwZUVHJsMrYkphfyCKZR17';

var casper = require('casper').create({
    pageSettings: { 
        webSecurityEnabled: false 
    },
    waitTimeout: 60000,
//     verbose: true,
//     logLevel: "debug"
});

casper.start('http://bluesatoshi.com/', function() {
    this.page.injectJs('https://cdn.firebase.com/js/client/2.2.7/firebase.js');
    var fieldName = this.evaluate(function() {
        return document.querySelector('.form-control[placeholder]').name;
    });
    
    var formValue = {};
    formValue[fieldName] = wallet;
    
    this.fill("form[method='post']", formValue, true);
});


// DEBUG INIT
// http://docs.casperjs.org/en/latest/events-filters.html#remote-message
casper.on("remote.message", function(msg) {
    this.echo("Console: " + msg);
});

// http://docs.casperjs.org/en/latest/events-filters.html#page-error
casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg);
    // maybe make it a little fancier with the code from the PhantomJS equivalent
});

// http://docs.casperjs.org/en/latest/events-filters.html#resource-error
casper.on("resource.error", function(resourceError) {
    this.echo("ResourceError: " + JSON.stringify(resourceError, undefined, 4));
});

// http://docs.casperjs.org/en/latest/events-filters.html#page-initialized
casper.on("page.initialized", function(page) {
    // CasperJS doesn't provide `onResourceTimeout`, so it must be set through 
    // the PhantomJS means. This is only possible when the page is initialized
    page.onResourceTimeout = function(request) {
        console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
    };
});
// DEBUG INIT



casper.thenEvaluate(function() {
    // here you must prepare the channels for communication
    
//     console.log((document.title = "Jazzcript Clipboard") + " Loaded");
// 	var clipboard = new Firebase("http://jazzcript-clipboard.firebaseio-demo.com/clipboard"),
//         getClip = function(){ cliptext.value = arguments[0].val() },
//         setClip = function(){ clipboard.set(this.value) };
// 	clipboard.on('value', getClip);
// 	cliptext.addEventListener('keyup', setClip);
    
    
    window.torneiroComm = new Firebase('http://torneiro-comm.firebaseio-demo.com/');
    window.torneiroComm_challengeSolved = [];
    
    window.notifyChallengeAvailable = function () {
        window.torneiroComm.child("challenge-available").set(true);
    };
    
    torneiroComm.child("challenge-available").set(false);
    
    torneiroComm.child("challenge-solved").on('value', function (solution) {
        window.torneiroComm_challengeSolved = solution.val();
    });
}); 

// casper.then(function() {
//     // aggregate results for the 'casperjs' search
//     links = this.evaluate(getLinks);
//     // now search for 'phantomjs' by filling the form again
//     this.fill('form[action="/search"]', { q: 'phantomjs' }, true);
// });

var last;
casper.waitFor(function check() {
    var text = this.evaluate(function() {
        return $("form[method='post'] input[type=submit]").val().trim();
    });
    
    if (last != text) {
        last = text;
        this.echo('SUBMIT: ' + text);
//         this.capture('bluesatoshi-' + text + '.png');
    }
    
    return true || text == "Go!";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
});

casper.wait(2000, function() {
    this.echo("------ I've waited for 2 seconds.");
    
    this.echo(" >>) torneiroComm: " + this.getGlobal('torneiroComm'));
    this.echo(" >>) torneiroComm_challengeSolved: " + this.getGlobal('torneiroComm_challengeSolved'));
    this.echo(" >>) notifyChallengeAvailable: " + this.getGlobal('notifyChallengeAvailable'));
});

// casper.then(function() {
//     this.mouse.click("#my-link");
// });

// function debugDot(x, y) {
//     function placeDot(e){
//         $("<div />")
//             .css({
//                 position:"absolute",
//                 left: e.clientX,
//                 top: e.clientY,
//                 zIndex:1e9,
//                 width:10,
//                 height:10,
//                 background:"red"
//             })
//             .appendTo("body");
//     }
    
//     if (x && y) {
//         placeDot({clientX:x, clientY:y});
//     } else {
//         $(document).click(placeDot);
//     }
// }

function debugDot(x, y) {
    function placeDot(e){
        var el = document.createElement("div");
        el.style.position = "absolute";
        el.style.left = e.clientX + "px";
        el.style.top = e.clientY + "px";
        el.style.zIndex = 1e9;
        el.style.width = "10px";
        el.style.height = "10px";
        el.style.background = "red";
        document.body.appendChild(el);
    }
    
    if (x && y) {
        placeDot({clientX:x, clientY:y});
    } else {
        $(document).click(placeDot);
    }
}


casper.thenEvaluate(function(wallet, debugDot) {
    var offset = $("iframe[title*='recaptcha']").offset();
    var solve = {};
    solve.x = offset.left;
    solve.y = offset.top;

    eval(debugDot);
    
    debugDot(solve.x-10, solve.y-10);
}, wallet, debugDot.toString());

var captchaSolver;
casper.then(function() {
    this.echo(">>>> debugDot: " + debugDot.length);
    var captcha = this.evaluate(function(debugDot) {
        var recap = $("iframe[title*='recaptcha']");
        var offset = recap.offset();
        var solve = {};
        solve.x = offset.left;
        solve.y = offset.top;
        solve.id = recap[0].id;
        solve.width = recap[0].width;
        solve.height = recap[0].height;
        
        eval(debugDot);
        
        window.debugDot = debugDot;
            
        debugDot(solve.x-10, solve.y-10);
        
        return JSON.stringify(solve);
    }, debugDot.toString());
    
    this.echo(".|. solve " + captcha);
    captchaSolver = JSON.parse(captcha);
    this.echo(".|. solve " + captchaSolver);
    
    this.capture('bluesatoshi-CLICKpre.png');
    
    // SOLVE CAPTCHA
    // +28,38
    this.mouse.click(parseInt(captchaSolver.x, 10)+28, parseInt(captchaSolver.y, 10)+38);
    
    this.evaluate(function() {
//         $("body").prepend("<div>WWWWWWWWWWWWWWWWW</div>");
        debugDot(10, 10);
    });

    casper.withFrame(captchaSolver.id, function () {
        var checkbox = this.evaluate(function(id, debugDot) {
            eval(debugDot);

            window.debugDot = debugDot;

            debugDot(28, 38);

            return "ok " + id;
        }, captchaSolver.id, debugDot.toString());
        
// !!!!!!!!!!!!!!! THIS IS THE SOLUTION $ >>> <div class="recaptcha-checkbox-checkmark" role="presentation" style=""></div>
// !!!!!!!!!!!!!!! THIS IS THE SOLUTION $ >>> <div class="recaptcha-checkbox-checkmark" role="presentation" style=""></div>
// !!!!!!!!!!!!!!! THIS IS THE SOLUTION $ >>> <div class="recaptcha-checkbox-checkmark" role="presentation" style=""></div>

        // document.querySelector('.recaptcha-checkbox-checkmark').click();
//         $(".gc-bubbleDefault iframe").parents("div[style*='-10000']")
        // document.querySelectorAll(".rc-imageselect-target td")[0].click()
        // document.querySelector("#recaptcha-verify-button").MOUSEMOVE()
        // document.querySelector("#recaptcha-verify-button").click()
        
        
        
        
        this.click('.recaptcha-checkbox-checkmark');
        this.echo("checkbox: " + checkbox);
        this.click('.recaptcha-checkbox-checkmark'); // !!!
        this.echo("CLICKED INSIDE " + checkbox + "!");
    });
});

casper.wait(5000, function() {
    this.echo("! ! ! ! ! ! SHOULD BE READY TO SOLVE ! I've waited for 5 seconds.");
    this.capture('bluesatoshi-posCLICK-INSIDE.png');
        
    casper.captureSelector('bluesatoshi-challenge.png', ".gc-bubbleDefault iframe");
    this.echo("CHALLENGE READY in PNG..");
});   

var optionList;
casper.waitFor(function () {
    // - neste ponto, precisa avisar o cliente do desafio disponivel
    // - o cliente resolve o desafio, 
    // - devolve a resposta para a torneira executar a ação de click
//         return "ttttttttttttt" || window.torneiroComm_challengeSolved;
    
    this.echo(" o>>>) optionList: " + optionList);
    
    optionList = this.evaluate(function() {
//         window.torneiroComm.child("challenge-available").set(true);
        
        return typeof window.notifyChallengeAvailable;
    });
    
    this.echo(" >>>) optionList: " + optionList);
    
    return optionList.length;
});

casper.then(function(wallet, debugDot) {
    var challenge = this.evaluate(function() {
        return $('.gc-reset iframe')[0].id;
    });
    
    this.echo("challenge: " + challenge);
    
    casper.withFrame(challenge, function () {
//         .parents("div[style*='-10000']")
        var options = this.evaluate(function() {
            var elems = document.querySelectorAll(".rc-imageselect-target td");
//             elems[0].click();
//             WAIT FOR rc-imageselect-tileselected
            
            
//             document.querySelectorAll(".rc-imageselect-target td")[0].click();
            return elems.length
        });
        
        this.click('.rc-imageselect-target td:nth-child(1)');
        
//         this.mouse.move(captchaSolver.x + 204, captchaSolver.y + 248);

//         casper.wait(2000, function() {
//             this.echo("I've waited for 2 seconds.");

//             casper.capture('bluesatoshi-challenge-preOPTION1.png');
//         });
        
//         this.mouse.click(captchaSolver.x + 204, captchaSolver.y + 248);
        this.echo("options (must be 9): " + options);
    });
    
    
    // - test for challenge box
    // - solve challenge
    // - submit challenge
    // - claim satoshi
});

casper.wait(2000, function() {
    this.echo("I've waited for 2 seconds.");
    
    casper.captureSelector('bluesatoshi-challenge-OPTION1.png', ".gc-bubbleDefault iframe");
});

casper.then(function() {
    // SOLVE CAPTCHA
    // +28,38
    
    this.capture('bluesatoshi-preCoords.png');
    var coords = this.evaluate(function(x, y) {
        debugDot(x+28, y);
        debugDot(x, y+38);
        
        return "ok";
    }, captchaSolver.x, captchaSolver.y);
    
    this.echo("coords: " + coords);
    this.capture('bluesatoshi-posCoords.png');
    
    
    this.capture('bluesatoshi-2clickPRE.png');
    this.mouse.click(captchaSolver.x, captchaSolver.y);
    this.capture('bluesatoshi-2clickPOS.png');
    
//     var solve = this.evaluate(function() {
//         var qwe = $("iframe[title*='recaptcha']").offset();
//         var solve = {};
//         solve.x = qwe.left-10;
//         solve.y = qwe.top-10;
//         return solve;
//     });
    
//     this.capture('bluesatoshi-CAPTCHASOLVERpre.png');
//     this.echo(".|.solve" + JSON.stringify(solve));
    
    //     this.mouse.click(400, 300); // !!!!!!!!!
//     this.mouse.click(solve.x, solve.y);
    
});


casper.thenEvaluate(function(wallet) {
//     $("form[method='post']").submit();
    return true;;;;;;;;;;;;;;;;;;;;;;;;;;;;
}, wallet);

casper.wait(3000, function() {
    this.echo("I've waited for 3 seconds.");
    this.capture('bluesatoshi-CLICKpos.png');
});

casper.then(function() {
    // aggregate results for the 'phantomjs' search
    this.capture('bluesatoshi-FINAL.png');
});

casper.run(function() {
    // echo results in some pretty fashion
    this.echo('ALL DONE :)');
    this.exit();
});