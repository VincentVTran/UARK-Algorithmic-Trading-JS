const { tradingBot } = require('../src/trading_bot');
const { marketBot } = require('../src/market_bot');

var trading_bot = new tradingBot();
//var market_bot = new marketBot();

trading_bot.sellOrder('FB');