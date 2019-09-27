const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('../credentials/data.json');

class marketBot{
    constructor(){
        this.alpaca = new Alpaca(dataKey);
        this.client = this.alpaca.websocket;
    }

    setUp(){
        this.client.onConnect(function() {
            console.log("Connected")
            this.client.subscribe(['trade_updates', 'account_updates', 'T.FB', 'Q.AAPL', 'A.FB', 'AM.AAPL'])
            setTimeout(() => {
              this.client.disconnect()
            }, 30 * 1000)
        });
        this.client.onDisconnect(() => {
            console.log("Disconnected");
        });
        this.client.onStateChange(newState => {
            console.log(`State changed to ${newState}`);
        });
        this.client.onOrderUpdate(data => {
            console.log(`Order updates: ${JSON.stringify(data)}`);
        });
        this.client.onAccountUpdate(data => {
            console.log(`Account updates: ${JSON.stringify(data)}`);
        });
        this.client.onStockTrades(function(subject, data) {
            console.log(`Stock trades: ${subject}, ${data}`);
        });
        this.client.onStockQuotes(function(subject, data) {
            console.log(`Stock quotes: ${subject}, ${data}`);
        });
        this.client.onStockAggSec(function(subject, data) {
            console.log(`Stock agg sec: ${subject}, ${data}`);
        });
        this.client.onStockAggMin(function(subject, data) {
            console.log(`Stock agg min: ${subject}, ${data}`);
        });
        this.client.connect();
    }
}

module.exports.marketBot = marketBot;