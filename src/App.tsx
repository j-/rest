import * as React from 'react';
import { useMachine } from '@xstate/react'
import { StateConfig, AnyEventObject } from 'xstate';
import Fullscreen from 'react-full-screen';
import classNames from 'classnames';
import NoSleep from 'nosleep.js';
import { machine, AppContext } from './machine';
import { formatTime } from './format-time';
import Timer from './Timer';
import cross from './cross.svg';
import './App.css';

const nosleep = new NoSleep();

let initialState: StateConfig<AppContext, AnyEventObject> | undefined = undefined;

try {
  initialState = JSON.parse(localStorage.getItem('rest/state') || '');
} catch (err) {}

const App: React.FC = () => {
  const [isFull, setFull] = React.useState(false);
  const [current, send, service] = useMachine(machine, {
    devTools: true,
    state: initialState,
    actions: {
      vibrate: () => window.navigator.vibrate(750),
    },
  });
  const isIdle = current.matches('idle');
  const isUnder = current.matches({ timer: 'under' });
  const isOver = current.matches({ timer: 'over' });
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      try {
        localStorage.setItem('rest/state', JSON.stringify(state));
      } catch (err) {}
    });
    return subscription.unsubscribe;
  }, [service]);
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
              try {
                nosleep.enable();
                setFull(window.matchMedia('(pointer: coarse)').matches);
              } catch (err) {}
              send('START', { seconds: 120 });
            }}
          >
            <span className="App-time-button-text">{formatTime(120 * 1000)}</span>
          </button>
          <button
            className="App-time-button"
            type="button"
            onClick={() => {
              try {
                nosleep.enable();
                setFull(window.matchMedia('(pointer: coarse)').matches);
              } catch (err) {}
              send('START', { seconds: 90 });
            }}
          >
            <span className="App-time-button-text">{formatTime(90 * 1000)}</span>
          </button>
          <button
            className="App-time-button"
            type="button"
            onClick={() => {
              try {
                nosleep.enable();
                setFull(window.matchMedia('(pointer: coarse)').matches);
              } catch (err) {}
              send('START', { seconds: 60 });
            }}
          >
            <span className="App-time-button-text">{formatTime(60 * 1000)}</span>
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
              try {
                nosleep.disable();
                setFull(false);
              } catch (err) {}
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
