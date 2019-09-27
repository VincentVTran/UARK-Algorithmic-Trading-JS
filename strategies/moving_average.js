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
            // if(!time.is_open){
            //     console.log("Market is currently closed");
            //     break;
            // }
            const data  = await market_bot.getPrice('FB',1);
            console.log("Current price: "+ data.FB[0].c); //Prints out current price      
            
        }
    }
}

module.exports.movingAverage = movingAverage;