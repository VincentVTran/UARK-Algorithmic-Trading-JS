const { tradingBot } = require('./src/trading_bot');
const { marketBot } = require('./src/market_bot');



var bot = new tradingBot();
bot.submitOrder("1","DAI","buy")