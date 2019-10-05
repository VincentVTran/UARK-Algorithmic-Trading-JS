const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('../credentials/data.json');

class tradingBot{
    constructor(){
        this.alpaca = new Alpaca(dataKey);
        this.alpaca.getAccount().then((account) => {
            //console.log('Current Account:', account)
        });
    }

    //Completes transactions such as buying and selling
    async submitOrder(quantity,company,side) { // Ex. 1, "FB", "buy"
      const time = await this.alpaca.getClock();
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

    //Sells all position for a company
    async sellAllCompanyStocks(company){
      var spyPosition;
      try{
        const currentData = await this.alpaca.getPosition('SPY');
        spyPosition = currentData["qty"];
      }
      catch(err){
          spyPosition = 0;
      }
      await this.submitOrder(spyPosition,company,"sell");
      console.log("***** All of " + company + " stocks have been sold *****");
    }

    //Sells all shares
    async closeAllPositions(){
      await this.alpaca.closeAllPositions();
      console.log("***** All positions have been closed *****");
    }
    async cancelAllPendingOrders(){
      await this.alpaca.cancelAllOrders();
      console.log("***** All pending orders have been canceled *****");
    }
}

module.exports.tradingBot = tradingBot;