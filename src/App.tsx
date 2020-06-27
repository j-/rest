import * as React from 'react';
import { useMachine } from '@xstate/react'
import { StateConfig, AnyEventObject } from 'xstate';
import classNames from 'classnames';
import NoSleep from 'nosleep.js';
import { interval } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';
import { machine, AppContext } from './machine';
import { useNow } from './use-now';
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
  const now = useNow();
  const [current, send, service] = useMachine(machine, {
    devTools: true,
    state: initialState,
    actions: {
      vibrate: () => window.navigator.vibrate(750),
    },
    services: {
      timer: (context) => (
        interval(1000).pipe(
          map(() => Date.now()),
          filter((time) => time >= Number(context.time)),
          first(),
          map(() => ({ type: 'DONE' })),
        )
      ),
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
    <div
      className={classNames('App', {
        'App--idle': isIdle,
        'App--under': isUnder,
        'App--over': isOver,
        'App--long': (
          current.context.time !== null && (
            current.context.time > now ?
              current.context.time - now >= 599000 :
              now - current.context.time >= 600000
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
