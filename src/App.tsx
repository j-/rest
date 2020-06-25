import * as React from 'react';
import { useMachine } from '@xstate/react'
import classNames from 'classnames';
import NoSleep from 'nosleep.js';
import { machine } from './machine';
import Timer from './Timer';
import cross from './cross.svg';
import './App.css';

const nosleep = new NoSleep();

const App: React.FC = () => {
  const [current, send] = useMachine(machine, {
    devTools: true,
  });
  const isIdle = current.matches('idle');
  const isUnder = current.matches({ timer: 'under' });
  const isOver = current.matches({ timer: 'over' });
  return (
    <div
      className={classNames('App', {
        'App--idle': isIdle,
        'App--under': isUnder,
        'App--over': isOver,
      })}>
      <div className="App-time-buttons">
        <button
          className="App-time-button"
          type="button"
          onClick={() => {
            nosleep.enable();
            send('START', { seconds: 120 });
          }}
        >
          <span className="App-time-button-text">120</span>
        </button>
        <button
          className="App-time-button"
          type="button"
          onClick={() => {
            nosleep.enable();
            send('START', { seconds: 90 });
          }}
        >
          <span className="App-time-button-text">90</span>
        </button>
        <button
          className="App-time-button"
          type="button"
          onClick={() => {
            nosleep.enable();
            send('START', { seconds: 60 });
          }}
        >
          <span className="App-time-button-text">60</span>
        </button>
      </div>
      <div className="App-content">
        {!isIdle && current.context.time && (
          <span className="App-timer">
            <Timer time={current.context.time} />
          </span>
        )}
        <button
          className="App-reset"
          type="button"
          onClick={() => {
            nosleep.disable();
            send('STOP');
          }}>
          <img className="App-reset-icon" src={cross} alt="Stop" width="16" height="16" />
        </button>
      </div>
    </div>
  );
};

export default App;
