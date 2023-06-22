const calculateCf = require('./cf-calculation');

test('calculate the cf of an truck', () => {
  expect(calculateCf(4, 0.2)).toBe(0.8);
});