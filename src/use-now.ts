import * as React from 'react';

export const useNow = (interval = 1000 / 60) => {
  const [now, setNow] = React.useState(Date.now());

  React.useEffect(() => {
    const clock = setInterval(() => {
      setNow(Date.now());
    }, interval);
    return () => clearInterval(clock);
  }, [interval]);

  return now;
};
