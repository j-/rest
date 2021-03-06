import { formatTime } from './format-time';

test.each([
  [60000, '1:00'],
  [59800, '1:00'],
  [59200, '1:00'],
  [59000, '0:59'],
  [10000, '0:10'],
  [1000, '0:01'],
  [800, '0:01'],
  [200, '0:01'],
  [0, '0:00'],
])('formatTime(%i, false) === "%s"', (input, expected) => {
  expect(formatTime(input, false)).toBe(expected);
});

test.each([
  [-200, '0:00'],
  [-800, '0:00'],
  [-1000, '0:01'],
  [-10000, '0:10'],
  [-59000, '0:59'],
  [-59200, '0:59'],
  [-59800, '0:59'],
  [-60000, '1:00'],
])('formatTime(%i, true) === "%s"', (input, expected) => {
  expect(formatTime(input, true)).toBe(expected);
});
