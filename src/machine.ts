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
    timer: {},
  },
  on: {
    START: {
      target: 'timer',
      actions: assign({
        time: (_context, event) => Date.now() + event.seconds * 1000 + 700,
      }),
    },
    STOP: {
      target: 'idle',
    },
  },
});
