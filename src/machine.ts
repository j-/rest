import { Machine, assign } from 'xstate'
import { interval } from 'rxjs';
import { map, filter, first } from 'rxjs/operators';

interface AppContext {
  time: Date | null;
}

const timerSrc = (context: AppContext) => (
  interval(1000 / 60).pipe(
    map(() => Date.now()),
    filter((time) => time >= Number(context.time)),
    first(),
    map(() => ({ type: 'DONE' })),
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
            DONE: {
              target: 'over',
              actions: 'vibrate',
            },
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
