export const formatTime = (ms: number) => {
  const negative = ms < 0;
  ms = Math.abs(ms);
  let s = negative ? Math.floor(ms / 1000) : Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  s %= 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};
