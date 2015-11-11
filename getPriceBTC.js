// Get BTC price from btc-e.com

// var price = require('child_process').spawn('sh', ['-c', 'curl --silent "https://btc-e.com" | grep "Last Price" | grep -o \'[\\\\.0-9]\\+\'']);

// var final = '';
// price.stdout.on('data', function (data) {
//     final += data.toString();
// });

// price.stdout.on('end', function () {
//     console.log(parseFloat(final));
// });

function showPrice (price) {
    console.log("CURRENT PRICE: ", price);
}

var getPrice = require('price-btc')(showPrice);