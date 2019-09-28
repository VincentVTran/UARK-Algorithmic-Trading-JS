const { tradingBot } = require('../src/trading_bot');
const { marketBot } = require('../src/market_bot');

const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('../credentials/data.json');

var trading_bot = new tradingBot();
var market_bot = new marketBot();

class movingAverage{
    constructor(){
        this.alpaca = new Alpaca(dataKey);
    }

    async run(){
        while(true){
            const time = await this.alpaca.getClock;
            //If market is closed, break out of loop
            // if(!time.is_open){
            //     console.log("****** Market is currently closed ******");
            //     break;
            // }
            const data  = await market_bot.getPrice("minute",'FB',1);
            console.log(data.FB[0]); //Prints out current price   
            console.log("\n");
        }
    }
    
}

module.exports.movingAverage = movingAverage;