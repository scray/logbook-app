const calculateCf = require('./cf-calculation');
const haversineDistance = require('./cf-calculation');


//test('calculate the cf of an truck', () => {
 // expect(calculateCf(4, 0.2)).toBe(0.8);
//});

test('calculate distance', () => {
  expect(haversineDistance(50.4501, 30.5234, 52.2297, 21.0122)).toBe(1072.4479169072167);
});