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
        
        //While loop that runs every second (micro secound I think honestly not sure)
        while(true){
            console.log("Working")

            /*******************************************************
            Checking to make sure the market is open!
            ********************************************************/
            const time = await this.alpaca.getClock();
            if(time.is_open){
                console.log('\n',"****** Market is currently closed ******",'\n');
                break;
            }

            /*******************************************************
            Gets the Number a Shares of SPY and OrderSize
            ********************************************************/
            const spyPosition = await this.alpaca.getPosition('SPY')
            //Gets Account Information
            const account = await this.alpaca.getAccount();
            //Setting the position Size to 10% of portfolio
            var positionSize = account['portfolio_value'] * .1;
            //Get the current Price of SPY to figure out the amount of shares we need to purchuse
            const currentPrice  = await market_bot.getPrice("minute",'SPY',1);
            var spyCurrentPrice = currentPrice.SPY[0]['o'];
            //Setting the Order Size (Number of shares)
            var shareOrderSize = positionSize / spyCurrentPrice



            /*******************************************************
            Setting the 15 min Moving Average and the 30min Moving Average
            *******************************************************/
            //Part 1 (15 min Average)
            //Calculating the 15min moving average as MA15Avg
            const MA15  = await market_bot.getPrice("minute",'SPY',15);
            var MA15Total = 0;
            var MA15Avg = 0;
            for(var i=0; i< MA15.SPY.length; i++){
                MA15Total += MA15.SPY[i]["o"];
            }
            MA15Avg = MA15Total/MA15.SPY.length;
    
    
            //Part 2 (30 min Average)
            //Calculating the 30min moving average as MA30Avg
            const MA30  = await market_bot.getPrice("minute",'SPY',30);
            var MA30Total = 0;
            var MA30Avg = 0;
            for(var i=0; i< MA30.SPY.length; i++){
                MA30Total += MA30.SPY[i]["o"];
            }
            MA30Avg = MA30Total/MA30.SPY.length;


            /***************************************************
            Buy/Sell logic
            ****************************************************/
            //if there is no postion in SPY we need to open one
            if(spyPosition == 0) { 
                if(MA15Avg>MA30Avg){ //if MA15 greater than MA30 buy 10% of portfolio
                    trading_bot.submitOrder(shareOrderSize,"SPY","buy");
                } else{
                    trading_bot.submitOrder(shareOrderSize,"SPY","sell");
                }

            //If we have a postive number of shares of SPY (Meaning we are alreday long)    
            } else if(spyPosition > 0) { 
                if(MA15Avg<MA30Avg){
                    // 1) Close Current Position
                    trading_bot.sellAllOrders("SPY") // May need to fix this function
                    // 2) Open a Short Position with 10% of portfolio
                    trading_bot.submitOrder(shareOrderSize,"SPY","sell"); 
                }else{
                    //Do nothing just hold
                }

            //If we have a negative number of shares of SPY (Meaning we are alreday short)    
            } else if(spyPosition < 0){ 
                if(MA15Avg>MA30Avg){
                    // 1) Close Current Position
                    trading_bot.sellAllOrders("SPY") // May need to fix this function
                    // 2) Open a Long Position with 10% of portfolio
                    trading_bot.submitOrder(shareOrderSize,"SPY","buy"); 
                }else{
                    //Do nothing just hold
                }
            } 
        }   
    }
}


module.exports.movingAverage = movingAverage;

        
        
        
        
    