// @flow

const config = {
  msPerTick: 500,

  commodities: [
    {
      name: 'Bread',
      laborRequired: 0.1,
      laborAssigned: 0,
      price: 2,
      inventory: 0,
      demand: 1,
      demandFn: (game, cost, population) => {
        if (cost <= 5) {
          return 2 * population * (6 - cost);
        }
        return 2 * population;
      },
      unlocked: true,
      numSold: 0,
    },
    {
      name: 'Shirts',
      laborRequired: 1,
      laborAssigned: 0,
      price: 5,
      inventory: 0,
      demand: 1,
      demandFn: (game, cost, population) => {
        let adjCost = cost > 0 ? cost : 0.01;
        return Math.max(1, Math.floor(population / adjCost));
      },
      unlocked: false,
      numSold: 0,
    },
    {
      name: 'Pants',
      laborRequired: 2,
      laborAssigned: 0,
      price: 5,
      inventory: 0,
      demand: 1,
      demandFn: (game, cost, population) => {
        let adjCost = cost > 0 ? cost : 0.01;
        return Math.max(1, Math.floor(population / adjCost));
      },
      unlocked: false,
      numSold: 0,
    },
    {
      name: 'Pocket Watches',
      laborRequired: 10,
      laborAssigned: 0,
      price: 15,
      inventory: 0,
      demand: 1,
      demandFn: (game, cost, population) => {
        return 1;
      },
      unlocked: false,
      numSold: 0,
    },
    {
      name: 'Gold',
      laborRequired: 10,
      laborAssigned: 0,
      price: 0,
      inventory: 0,
      demand: 0,
      demandFn: (game, cost, population) => {
        return 0;
      },
      unlocked: false,
      numSold: 0,
    },
    {
      name: 'Cars',
      laborRequired: 40,
      laborAssigned: 0,
      price: 50,
      inventory: 0,
      demand: 1,
      demandFn: (game, cost, population) => {
        let adjCost = cost > 0 ? cost : 0.01;
        return Math.max(1, Math.floor(2 * population / adjCost));
      },
      unlocked: false,
      numSold: 0,
    },
    {
      name: 'Oil',
      laborRequired: 2,
      laborAssigned: 0,
      price: 5,
      inventory: 0,
      demand: 1,
      demandFn: (game, cost, population) => {
        for (const commodity of game.commodities) {
          if (commodity.name == 'Cars') {
            return commodity.numSold;
          }
        }
      },
      unlocked: false,
      numSold: 0,
    },
    {
      name: 'Research',
      laborRequired: 20,
      laborAssigned: 0,
      price: 0,
      inventory: 0,
      demand: 0,
      demandFn: (game, cost, population) => {
        return 0;
      },
      unlocked: false,
      numSold: 0,
    },
    {
      name: 'Smart Phones',
      laborRequired: 30,
      laborAssigned: 0,
      price: 75,
      inventory: 0,
      demand: 0,
      demandFn: (game, cost, population) => {
        let adjCost = cost > 0 ? cost : 0.01;
        return Math.max(1, Math.floor(5 * population / adjCost));
      },
      unlocked: false,
      numSold: 0,
    },
  ],

  capital: 10000,
  labor: 10,
  laborGrowthRate: (pop, time) => {
    if (time % 10 != 0) {
      return 0;
    }
    return Math.max(1, Math.floor(pop * pop * 0.001))
  },

  wages: 10,
  unrest: 0,
  laborSavings: 500,

  maxTickerLength: 7,
};

module.exports = {
  config,
};
