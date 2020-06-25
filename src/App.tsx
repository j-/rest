import * as React from 'react';
import { useMachine } from '@xstate/react'
import classNames from 'classnames';
import { machine } from './machine';
import Timer from './Timer';
import './App.css';

const App: React.FC = () => {
  const [current, send] = useMachine(machine, {
    devTools: true,
  });
  const isIdle = current.matches('idle');
  return (
    <div className={classNames('App', isIdle && 'App--idle')}>
      <div className="App-time-buttons">
        <button
          className="App-time-button"
          type="button"
          onClick={() => send('START', { seconds: 120 })}
        >
          <span className="App-time-button-text">120</span>
        </button>
        <button
          className="App-time-button"
          type="button"
          onClick={() => send('START', { seconds: 90 })}
        >
          <span className="App-time-button-text">90</span>
        </button>
        <button
          className="App-time-button"
          type="button"
          onClick={() => send('START', { seconds: 60 })}
        >
          <span className="App-time-button-text">60</span>
        </button>
      </div>
      <div className="App-content">
        {!isIdle && current.context.time && (
          <Timer time={current.context.time} />
        )}
        <button className="App-reset" type="button" onClick={() => send('STOP')}>&times;</button>
      </div>
    </div>
  );
};

export default App;
