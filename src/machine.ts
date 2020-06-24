import { Machine, assign } from 'xstate'
import { interval } from 'rxjs';
import { timeInterval, timeout, mapTo } from 'rxjs/operators';

interface AppContext {
  time: Date | null;
}

const timerSrc = (context: AppContext) => (
  interval(1000 / 60).pipe(
    timeInterval(),
    timeout(context.time!),
    mapTo({ type: 'DONE' }),
  )
);

export const machine = Machine<AppContext>({
  id: 'machine',
  initial: 'idle',
  context: {
    time: null,
  },
  states: {
    idle: {},
    timer: {
      initial: 'under',
      states: {
        under: {
          on: {
            DONE: 'over',
          },
        },
        over: {},
      },
      invoke: {
        src: timerSrc,
      },
    },
  },
  on: {
    START: {
      target: 'timer',
      actions: assign({
        time: (_context, event) => new Date(Date.now() + event.seconds * 1000),
      }),
    },
    STOP: {
      target: 'idle',
    },
  },
});
