import * as React from 'react';
import { useTimer } from './use-timer';

export interface Props {
  time: number;
}

const Timer: React.FC<Props> = ({ time }) => {
  const timer = useTimer(time);
  return <>{timer}</>;
};

export default Timer;