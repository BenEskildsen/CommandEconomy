// @flow

const React = require('react');
const {Button, InfoCard, Plot, plotReducer} = require('bens_ui_components');
const {config} = require('../config');
const {displayMoney} = require('../utils/display');
const {totalPopulation} = require('../selectors/selectors');
const {initGameOverSystem} = require('../systems/gameOverSystem');
const {initEventsSystem} = require('../systems/eventsSystem');
const {useState, useMemo, useEffect, useReducer} = React;

import type {State, Action} from '../types';

type Props = {
  state: State, // Game State
  dispatch: (action: Action) => Action,
};

const PLOT_HEIGHT = 14;
const PLOT_WIDTH = 120;
const PLOT_POINTS = 300;

function Game(props: Props): React.Node {
  const {state, dispatch, store} = props;
  const game = state.game;

  // initializations
  useEffect(() => {
    initGameOverSystem(store);
    initEventsSystem(store);
  }, []);

  const commodities = [];
  for (const commodity of game.commodities) {
    if (commodity.unlocked) {
      commodities.push(
        <Commodity
          key={'commodity_' + commodity.name}
          dispatch={dispatch}
          commodity={commodity} game={game}
        />
      );
    }
  }

  return (
    <div>
      <div
        style={{
          overflow: 'hidden',
          width: '100%',
          marginBottom: 6,
        }}
      >
        <Info game={game} dispatch={dispatch} />
        <Ticker game={game} />
      </div>
      {commodities}
    </div>
  );
}

function Ticker(props): React.Node {
  const {game} = props;
  const messages = [];
  for (let i = 0; i < game.ticker.length; i++) {
    const message = game.ticker[i];
    messages.push(
      <div
        key={"ticker_" + i}
        style={{

        }}
      >
        {message}
      </div>
    );
  }
  return (
    <InfoCard
      style={{
        height: 128,
        padding: 4,
        marginTop: 4,
        marginRight: 4,
        overflow: 'hidden',
        display: 'block',
      }}
    >
      {messages}
    </InfoCard>
  );
}

function Info(props): React.Node {
  const {game, dispatch} = props;

  return (
    <InfoCard
      style={{
        width: 375,
        float: 'left',
        marginTop: 4,
        marginRight: 4,
      }}
    >
      <div>
        Capital: ${game.capital}
        <Plot
          points={[]}
          xAxis={{dimension: 'x', min: 0, max: PLOT_POINTS, hidden: true}}
          yAxis={{dimension: 'y', hidden: true, adaptiveRange: true}}
          watch={game.capital}
          changeOnly={true}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          isLinear={true}
          inline={true}
          canvasID={'capital_plot'}
        />
      </div>
      <div>Unassigned Labor: {game.labor} / {totalPopulation(game)}</div>
      <div>
        Wages: ${game.wages}
        <Button label="Lower" disabled={game.wages <= 0}
          onClick={() => dispatch({type: 'INCREMENT_WAGES', wageChange: -1})} />
        <Button label="Raise"
          onClick={() => dispatch({type: 'INCREMENT_WAGES', wageChange: 1})} />
      </div>
      <div>
        Labor's Savings: ${game.laborSavings}
        <Plot
          points={[]}
          xAxis={{dimension: 'x', min: 0, max: PLOT_POINTS, hidden: true}}
          yAxis={{dimension: 'y', hidden: true, adaptiveRange: true}}
          watch={game.laborSavings}
          changeOnly={true}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          isLinear={true}
          inline={true}
          canvasID={'labor_savings_plot'}
        />
      </div>
      <div>
        Unrest: {game.unrest.toFixed(2)}%
        <Plot
          points={[]}
          xAxis={{dimension: 'x', min: 0, max: PLOT_POINTS, hidden: true}}
          yAxis={{dimension: 'y', hidden: true, min: 0, max: 100}}
          watch={game.unrest}
          changeOnly={true}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          isLinear={true}
          inline={true}
          canvasID={'unrest_plot'}
        />
      </div>
      <Button
        id={game.tickInterval ? '' : 'PLAY'}
        label={game.tickInterval ? 'Pause Simulation' : 'Start Simulation'}
        onClick={() => {
          // dispatch({type: 'TICK'});
          if (game.tickInterval) {
            dispatch({type: 'STOP_TICK'});
          } else {
            dispatch({type: 'START_TICK'});
          }
        }}
      />
    </InfoCard>
  );
}

function Commodity(props): React.Node {
  const {commodity, game, dispatch} = props;
  const {name} = commodity;

  const assignMult = config.popToAssignFn(commodity.laborAssigned);
  const priceMult = config.priceRaiseFn(commodity.price);
  return (
    <InfoCard
      style={{
        width: 375,
      }}
    >
      <div>Commodity: {commodity.name}</div>
      <div>Labor Required: {commodity.laborRequired.toFixed(1)}</div>
      <div>
        Labor Assigned: {commodity.laborAssigned}
        <div style={{display: 'inline-block'}}>
        <Button label={assignMult == 1 ? 'Unassign' : "Unassign x" + assignMult}
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: -1 * assignMult, name})}
          disabled={commodity.laborAssigned <= 0}
        />
        <Button label={assignMult == 1 ? 'Assign' : "Assign x" + assignMult}
          onClick={() => dispatch({type: 'INCREMENT_LABOR', laborChange: 1 * assignMult, name})}
          disabled={game.labor <= 0}
        />
        </div>
      </div>
      <div>
        Price: ${commodity.price}
        <Button label={priceMult == 1 ? "Lower" : "Lower x" + priceMult}
          onClick={() => dispatch({type: 'INCREMENT_PRICE', priceChange: -1 * priceMult, name})}
          disabled={commodity.price <= 0}
        />
        <Button label={priceMult == 1 ? "Raise" : "Raise x" + priceMult}
          onClick={() => dispatch({type: 'INCREMENT_PRICE', priceChange: 1 * priceMult, name})}
        />
      </div>
      <div>
        Inventory: {commodity.inventory}
        <Plot
          points={[]}
          xAxis={{dimension: 'x', min: 0, max: PLOT_POINTS, hidden: true}}
          yAxis={{dimension: 'y', hidden: true, adaptiveRange: true}}
          watch={commodity.inventory}
          changeOnly={true}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          isLinear={true}
          inline={true}
          canvasID={commodity.name + '_inventory'}
        />
      </div>
      <div>
        Demand: {commodity.demand}
        <Plot
          points={[]}
          xAxis={{dimension: 'x', min: 0, max: PLOT_POINTS, hidden: true}}
          yAxis={{dimension: 'y', hidden: true, adaptiveRange: true}}
          watch={commodity.demand}
          changeOnly={true}
          width={PLOT_WIDTH}
          height={PLOT_HEIGHT}
          isLinear={true}
          inline={true}
          canvasID={commodity.name + '_demand'}
        />
      </div>
    </InfoCard>
  );
}

module.exports = Game;
