const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('../credentials/data.json');

class marketBot{
    constructor() {
        this.alpaca = new Alpaca(dataKey);
        this.client = this.alpaca.websocket;
        //this.setUp();
    }

    // setUp(){
    //     var clients = this.client;
    //     this.client.onConnect(function() {
    //         console.log("Connected")
    //         clients.subscribe(['trade_updates', 'account_updates', 'T.FB', 'Q.AAPL', 'A.FB', 'AM.AAPL'])
    //         setTimeout(() => {
    //           clients.disconnect()
    //         }, 30 * 1000)
    //     });
    //     this.client.onDisconnect(() => {
    //         console.log("Disconnected");
    //     });
    //     this.client.onStateChange(newState => {
    //         console.log(`State changed to ${newState}`);
    //     });
    //     this.client.onOrderUpdate(data => {
    //         console.log(`Order updates: ${JSON.stringify(data)}`);
    //     });
    //     this.client.onAccountUpdate(data => {
    //         console.log(`Account updates: ${JSON.stringify(data)}`);
    //     });
    //     this.client.onStockTrades(function(subject, data) {
    //         console.log(`Stock trades: ${subject}, ${data}`);
    //     });
    //     this.client.onStockQuotes(function(subject, data) {
    //         console.log(`Stock quotes: ${subject}, ${data}`);
    //     });
    //     this.client.onStockAggSec(function(subject, data) {
    //         console.log(`Stock agg sec: ${subject}, ${data}`);
    //     });
    //     this.client.onStockAggMin(function(subject, data) {
    //         console.log(`Stock agg min: ${subject}, ${data}`);
    //     });
    //     this.client.connect();
    // }

    async getPrice(barDuration, symbol, pastDays, dataType) { // barDuration = 'minute' | '1Min' | '5Min' | '15Min' | 'day' | '1D' ______ dataType = "t" | "o" | "h" | "l" | "c" | "v"
        const price = await this.alpaca.getBars(barDuration,symbol,{limit: pastDays});
        const desiredData = await price[symbol];
        var dataArray = [];
        for(var i = 0;i<desiredData.length;i++){
            dataArray.push(desiredData[i][dataType]);
            //console.log(desiredData[i]);
        }
        //console.log(dataArray);
        return dataArray;
    }

    async getShares(symbol){ // getShares("SPY");
        const Position = await this.alpaca.getPosition(symbol)
        return Position 
    }
    async waitForMarketToOpen(){
        while(true){
            const time = await this.alpaca.getClock();
            await this.sleep(10000);
            if(time.is_open){
                console.log('\n',"****** Market is Open ******",'\n');
                break;
            }
            console.log("-- Waiting for market to open --");
        }   
        
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
  
}

module.exports.marketBot = marketBot;