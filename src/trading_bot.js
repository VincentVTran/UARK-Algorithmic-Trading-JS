const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('../credentials/data.json');

class tradingBot{
    constructor(){
        this.alpaca = new Alpaca(dataKey);
        this.alpaca.getAccount().then((account) => {
            //console.log('Current Account:', account)
        });
    }

    //Completes transactions such as Buying and Selling
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

    sellOrders(company){
      this.alpaca.closePosition(company).then(
        (data) => console.log(data)
      );
    }

    //Sells all shares
    async sellAllOrders(company){
      await this.alpaca.closeAllPositions();
      // console.log("Worked");
      const previousStockInfo = await this.alpaca.getPosition(company);
      console.log(previousStockInfo);
    }
}

module.exports.tradingBot = tradingBot;