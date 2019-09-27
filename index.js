const { tradingBot } = require('./src/trading_bot');
const { marketBot } = require('./src/market_bot');


//Trading Bot
var trading_bot = new tradingBot();
//trading_bot.submitOrder("1","FB","buy")

//Market Bot
var market_bot = new marketBot();
// market_bot.getPrice('FB',1).then((data) =>{
//     console.log(data.FB[0].c); //Prints out current price
// });
async function refreshPrice(){
    
    for(i = 0;i<100;i++){
        data  = await market_bot.getPrice('FB',1);
        console.log("Refresh " + i + ": " +  data.FB[0].c); //Prints out current price      
    }
}

refreshPrice().then((data)=>{
    //console.log(data);
});



