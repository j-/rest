import * as React from 'react';
import { useMachine } from '@xstate/react'
import { machine } from './machine';
import Timer from './Timer';
import './App.css';

const App: React.FC = () => {
  const [current, send] = useMachine(machine, {
    devTools: true,
  });
  return (
    <div className="App">
      <div className="App-buttons">
        <button type="button" onClick={() => send('START', { seconds: 120 })}>120 Seconds</button>
        <button type="button" onClick={() => send('START', { seconds: 90 })}>90 Seconds</button>
        <button type="button" onClick={() => send('START', { seconds: 60 })}>60 Seconds</button>
      </div>
      <div className="App-content">
        {!current.matches('idle') && current.context.time && (
          <Timer time={current.context.time} />
        )}
        <button className="App-reset" type="button" onClick={() => send('STOP')}>&times;</button>
      </div>
    </div>
  );
};

export default App;
