import { useNow } from './use-now';
import { formatSeconds } from './format-seconds';

export const useTimer = (time: Date) => {
  const now = useNow();
  const diff = Number(time) - now;
  return formatSeconds(diff);
};
