const Alpaca = require('@alpacahq/alpaca-trade-api');
const dataKey = require('./data.json');

const alpaca = new Alpaca(dataKey);

alpaca.getAccount().then((account) => {
    console.log('Current Account:', account)
})