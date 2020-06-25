import * as React from 'react';
import { useMachine } from '@xstate/react'
import Fullscreen from 'react-full-screen';
import classNames from 'classnames';
import NoSleep from 'nosleep.js';
import { machine } from './machine';
import Timer from './Timer';
import cross from './cross.svg';
import './App.css';

const nosleep = new NoSleep();

const App: React.FC = () => {
  const [isFull, setFull] = React.useState(false);
  const [current, send] = useMachine(machine, {
    devTools: true,
    actions: {
      vibrate: () => window.navigator.vibrate(750),
      fullScreen: () => setFull(window.matchMedia('(pointer: coarse)').matches),
    },
  });
  const isIdle = current.matches('idle');
  const isUnder = current.matches({ timer: 'under' });
  const isOver = current.matches({ timer: 'over' });
  return (
    <Fullscreen enabled={isFull} onChange={setFull}>
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
    </Fullscreen>
  );
};

export default App;
