const { tradingBot } = require('../src/trading_bot');
const { marketBot } = require('../src/market_bot');

var trading_bot = new tradingBot();
var market_bot = new marketBot();

//trading_bot.buyOrder(1,"FB","sell");
trading_bot.submitOrder(3,"FB","buy");

// market_bot.getPrice('minute','FB','1').then( (data) =>
//     {
//         console.log(data);
//     }
// );
//trading_bot.sellOrders('FB');

//market_bot.getPrice("minute","SPY",10,"o");

