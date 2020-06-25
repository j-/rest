export const formatTime = (ms: number) => {
  const negative = ms < 0;
  ms = Math.abs(ms);
  const m = Math.floor(ms / 1000 / 60);
  const s = (negative ? Math.floor(ms / 1000) : Math.ceil(ms / 1000)) % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};
