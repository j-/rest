import { Machine, assign } from 'xstate'

export interface AppContext {
  time: number | null;
}

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
        src: 'timer',
      },
    },
  },
  on: {
    START: {
      target: 'timer',
      actions: assign({
        time: (_context, event) => Date.now() + event.seconds * 1000 - 100,
      }),
    },
    STOP: {
      target: 'idle',
    },
  },
});
