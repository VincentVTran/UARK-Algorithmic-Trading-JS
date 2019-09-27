const { tradingBot } = require('./src/trading_bot');
const { marketBot } = require('./src/market_bot');

const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('../credentials/data.json');

//Trading Bot
var trading_bot = new tradingBot();
var market_bot = new marketBot();
//trading_bot.submitOrder("1","FB","buy")

//Market Bot
// market_bot.getPrice('FB',1).then((data) =>{
//     console.log(data.FB[0].c); //Prints out current price
// });
class movingAverage{
    constructor(){
        this.alpaca = new Alpaca(dataKey);
    }

    run(){
        while(this.alpaca)
        async function refreshPrice(){
            
            for(i = 0;i<100;i++){
                data  = await market_bot.getPrice('FB',1);
                console.log("Refresh " + i + ": " +  data.FB[0].c); //Prints out current price      
            }
        }
    }
}
