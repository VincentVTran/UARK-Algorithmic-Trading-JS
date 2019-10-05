
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
        // trading_bot.submitOrder(1,'SPY','buy')
        //While loop that runs every second (micro secound I think honestly not sure)
        while(true){
            //Waits [waitTime] amount of time before running loop again
            //This is based on millisecond (Ex: 2000 = 2 seconds)
            const waitTime = 2000; 
            await market_bot.sleep(waitTime);

            /*******************************************************
            Checking to make sure the market is open!
            ********************************************************/
            const time = await this.alpaca.getClock();
            if(!time.is_open){
               // await market_bot.waitForMarketToOpen();
            }

            /*******************************************************
            Gets the Number a Shares of SPY and OrderSize
            ********************************************************/
            
            var spyPosition;
            try{
                const currentData = await this.alpaca.getPosition('SPY');
		        spyPosition = currentData["qty"];   
            }
            catch(err){
                spyPosition = 0;
            }
            console.log('SPY Position: ',spyPosition)


            //Gets Account Information
            const account = await this.alpaca.getAccount();
            //Setting the position Size to 10% of portfolio
            const positionSize = account['portfolio_value'] * .1;
            console.log("Position Size: " + positionSize);
            //Get the current Price of SPY to figure out the amount of shares we need to purchuse
            const currentPrice  = await market_bot.getPrice("minute",'SPY',1,"o");
            //Setting the Order Size (Number of shares)
            const shareOrderSize = Math.round(positionSize / currentPrice[0]);
            console.log("Share order size: " + shareOrderSize);



            /*******************************************************
            Setting the 15 min Moving Average and the 30min Moving Average
            *******************************************************/
            //Part 1 (15 min Average)
            //Calculating the 15min moving average as MA15Avg
            const MA15  = await market_bot.getPrice("minute",'SPY',15,"o");
            const MA15Avg = this.getAverage(MA15);
    
            //Part 2 (30 min Average)
            //Calculating the 30min moving average as MA30Avg
            const MA30  = await market_bot.getPrice("minute",'SPY',30,"o");
            const MA30Avg = this.getAverage(MA30);
            console.log("MA15 = ",MA15Avg);
            console.log("MA30 = ",MA30Avg);

            console.log("MA15Avg > MA30Avg: " + MA15Avg>MA30Avg);


            /***************************************************
            Buy/Sell logic
            ****************************************************/
            //if there is no postion in SPY we need to open one
            if(spyPosition == 0) { 
                if(MA15Avg>MA30Avg){ //if MA15 greater than MA30 buy 10% of portfolio
                    trading_bot.submitOrder(shareOrderSize,"SPY","buy");
                } 
                else{
                    trading_bot.submitOrder(shareOrderSize,"SPY","sell");
                }
            }
            //If we have a postive number of shares of SPY (Meaning we are already long)    
            else if(spyPosition > 0) { 
                if(MA15Avg<MA30Avg){
                    // 1) Close Current Position
                    trading_bot.sellAllCompanyStocks("SPY");
                    // 2) Open a Short Position with 10% of portfolio
                    trading_bot.submitOrder(shareOrderSize,"SPY","sell"); 
                }
            }
            //If we have a negative number of shares of SPY (Meaning we are alreday short)    
            else if(spyPosition < 0){ 
                if(MA15Avg>MA30Avg){
                    // 1) Close Current Position
                    trading_bot.sellAllCompanyStocks("SPY");
                    // 2) Open a Long Position with 10% of portfolio
                    trading_bot.submitOrder(shareOrderSize,"SPY","buy"); 
                }
            } 
        }  
    }
    getAverage(dataArray){
        var Total = 0;
        var Avg = 0;
        for(var i=0; i< dataArray.length; i++){
            Total += dataArray[i];
        }
        Avg = (Total/dataArray.length);
        return Avg;
    }
}


module.exports.movingAverage = movingAverage;

        
        
        
        
    
