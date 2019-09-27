    async function submitOrder(quantity,stock,side) {
        var prom = new Promise(async (resolve,reject) => {
          if(quantity > 0){
            await this.alpaca.createOrder({
              symbol: stock,
              qty: quantity,
              side: side,
              type: 'market',
              time_in_force: 'day',
            }).then(() => {
              console.log("Market order of | " + quantity + " " + stock + " " + side + " | completed.");
              resolve(true);
            }).catch((err) => {
                console.log(err);
              console.log("Order of | " + quantity + " " + stock + " " + side + " | did not go through.");
              resolve(false);
            });
          }
          else {
            console.log("Quantity is <=0, order of | " + quantity + " " + stock + " " + side + " | not sent.");
            resolve(true);
          }
        });
        return prom;
    }

    module.exports.submitOrder = this.submitOrder;