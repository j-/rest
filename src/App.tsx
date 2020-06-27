import * as React from 'react';
import { useMachine } from '@xstate/react'
import { StateConfig, AnyEventObject, State } from 'xstate';
import classNames from 'classnames';
import NoSleep from 'nosleep.js';
import { interval } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';
import { machine, AppContext } from './machine';
import { useNow } from './use-now';
import { formatTime } from './format-time';
import cross from './cross.svg';
import './App.css';

const nosleep = new NoSleep();

let initialState: StateConfig<AppContext, AnyEventObject> | undefined;

try {
  const state: StateConfig<AppContext, AnyEventObject> = JSON.parse(localStorage.getItem('rest/state') || '');
  State.create(state);
  initialState = state;
} catch (err) {}

const App: React.FC = () => {
  const now = useNow(250);
  const [current, send, service] = useMachine(machine, {
    devTools: true,
    state: initialState,
    actions: {
      vibrate: () => window.navigator.vibrate(750),
    },
    services: {
      timer: (context) => (
        interval(250).pipe(
          map(() => Date.now()),
          filter((time) => time >= Number(context.time)),
          first(),
          map(() => ({ type: 'DONE' })),
        )
      ),
    },
  });
  const diff = current.context.time === null ? null : current.context.time - now;
  const isIdle = current.matches('idle');
  const isUnder = diff === null ? null : diff > 1000;
  const isOver = diff === null ? null : !isUnder;
  React.useEffect(() => {
    const subscription = service.subscribe((state) => {
      try {
        localStorage.setItem('rest/state', JSON.stringify(state));
      } catch (err) {}
    });
    return subscription.unsubscribe;
  }, [service]);
  return (
    <div
      className={classNames('App', {
        'App--idle': isIdle,
        'App--under': isUnder,
        'App--over': isOver,
        'App--long': (
          diff !== null && (
            diff >= 599000 ||
            diff <= -600000
          )
        ),
      })}>
      <div className="App-time-buttons">
        <button
          className="App-time-button"
          type="button"
          onClick={() => {
            try {
              nosleep.enable();
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
            } catch (err) {}
            send('START', { seconds: 60 });
          }}
        >
          <span className="App-time-button-text">{formatTime(60 * 1000)}</span>
        </button>
      </div>
      <div className="App-content">
        {!isIdle && (
          <span className="App-timer">
            {diff !== null && formatTime(diff)}
          </span>
        )}
        <button
          className="App-reset"
          type="button"
          onClick={() => {
            try {
              nosleep.disable();
            } catch (err) {}
            send('STOP');
          }}>
          <img className="App-reset-icon" src={cross} alt="Stop" width="16" height="16" />
        </button>
      </div>
    </div>
  );
};

export default App;
