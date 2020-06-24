import * as React from 'react';
import { useTimer } from './use-timer';

export interface Props {
  time: Date;
}

const Timer: React.FC<Props> = ({ time }) => {
  const timer = useTimer(time);
  return <div>{timer}</div>;
};

export default Timer;
