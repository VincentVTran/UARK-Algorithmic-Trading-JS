const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('../credentials/data.json');

class tradingBot{
    constructor(){
        this.alpaca = new Alpaca(dataKey);
        this.alpaca.getAccount().then((account) => {
            //console.log('Current Account:', account)
        });
    }

    async submitOrder(quantity,company,side) { // 1, "FB", "buy"
        console.log(await this.alpaca.getClock()); //Checks time
        var prom = new Promise(async (resolve,reject) => {
          if(quantity > 0){
            await this.alpaca.createOrder({
              symbol: company,
              qty: quantity,
              side: side,
              type: 'market',
              time_in_force: 'day',
            }).then(() => {
              console.log("Market order of | " + quantity + " " + company + " " + side + " | completed.");
              resolve(true);
            }).catch((err) => {
                console.log(err);
              console.log("Order of | " + quantity + " " + company + " " + side + " | did not go through.");
              resolve(false);
            });
          }
          else {
            console.log("Quantity is <=0, order of | " + quantity + " " + company + " " + side + " | not sent.");
            resolve(true);
          }
        });
        return prom;
    }

    async sellOrder(company){
      await this.alpaca.closePosition(company);
      // console.log("Worked");
      const previousStockInfo = await this.alpaca.getPosition(company);
      console.log(previousStockInfo);
    }
}

module.exports.tradingBot = tradingBot;