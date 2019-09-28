//https://github.com/alpacahq/alpaca-trade-api-js
//https://github.com/alpacahq/alpaca-trade-api-python
//https://github.com/Jyang772/alpaca-cpp

const { movingAverage } = require('./strategies/moving_average');

const strategy_moving_average = new movingAverage();
strategy_moving_average.run();

