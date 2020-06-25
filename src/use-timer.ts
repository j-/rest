import { useNow } from './use-now';
import { formatTime } from './format-time';

export const useTimer = (time: Date | number) => {
  const now = useNow();
  const diff = Number(time) - now;
  return formatTime(diff);
};
