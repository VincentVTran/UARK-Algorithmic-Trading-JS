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
        //Defineing time and outputing a booling value to the while loop to test wheather the market is open or not
        const time = await this.alpaca.getClock();
        console.log("Market Open:");
        console.log(time["is_open"]);
        
        //Calculating the 15min moving average as MA15Avg
        const MA15  = await market_bot.getPrice("minute",'SPY',15);
        var MA15Total = 0;
        var MA15Avg = 0;
        for(var i=0; i< MA15.SPY.length; i++){
            MA15Total += MA15.SPY[i]["o"];
            // console.log("Current Open Price:",MA15.SPY[i]["o"]);
            // console.log("Added Total:",MA15Total);
            // console.log("\n");
        }
        MA15Avg = MA15Total/MA15.SPY.length;

        //Calculating the 30min moving average as MA30Avg
        const MA30  = await market_bot.getPrice("minute",'SPY',30);
        var MA30Total = 0;
        var MA30Avg = 0;
        for(var i=0; i< MA30.SPY.length; i++){
            MA30Total += MA30.SPY[i]["o"];
            // console.log("Current Open Price:",MA30.SPY[i]["o"]);
            // console.log("Added Total:",MA30Total);
            // console.log("\n");
        }
        MA30Avg = MA30Total/MA30.SPY.length;



        console.log("\n");
        console.log('15 min Moving Average:',MA15Avg); //Prints 15 min moving Average 
        console.log('30 min Moving Average:',MA30Avg); //Prints 30 min moving Average  
        console.log('MA15 > MA30 =',MA15Avg>MA30Avg);
        console.log("Position = ?");
        console.log("Buy = ",MA15Avg>MA30Avg,' (As long as you are not is a position already)');
        console.log("\n");

        const spyPosition = await this.alpaca.getPosition('SPY')
        console.log(spyPosition);



        //const MA30  = await market_bot.getPrice("minute",'SPY',15);
        
        
        //while(time["is_open"]==false){
            
            // const data  = await market_bot.getPrice("minute",'SPY',1);
            // console.log(data.SPY[0]); //Prints out current price   
            // console.log("\n");

            // const MA_15 = await market_bot.getPrice("minute",'SPY',15);
            
            //trading_bot.submitOrder(100,"SPY","buy")

        //}
        
        
        
        
        
        
        
        // while(true){
        //     const time = await this.alpaca.getClock;
        //     //If market is closed, break out of loop
        //     // if(!time.is_open){
        //     //     console.log("****** Market is currently closed ******");
        //     //     break;
        //     // }
        //     trading_bot.submitOrder(100,"SPY","buy")
            
        //     const data  = await market_bot.getPrice("minute",'FB',1);
        //     console.log(data.FB[0]); //Prints out current price   
        //     console.log("\n");
        // }
    } 
}

module.exports.movingAverage = movingAverage;