const calculateCf = require('./cf-calculation');
const haversineDistance = require('./cf-calculation');


//test('calculate the cf of an truck', () => {
 // expect(calculateCf(4, 0.2)).toBe(0.8);
//});

test('calculate distance', () => {
  expect(haversineDistance(50.4501, 30.5234, 52.2297, 21.0122)).toBe(1072.4479169072167);
});

// Test calculateCf function
describe('calculateCf', () => {
  it('calculates emissions correctly', () => {
    const distance = 100;
    const emissionFactor = 0.2;
    const expectedEmissions = 20;
    const result = calculateCf(distance, emissionFactor);
    expect(result).toBe(expectedEmissions);
  });
});

// Test haversineDistance function
describe('haversineDistance', () => {
  it('calculates distance correctly', () => {
    const lon1 = -73.935242;
    const lat1 = 40.730610;
    const lon2 = -74.006015;
    const lat2 = 40.712776;
    const expectedDistance = 8.1315; // Approximate distance in kilometers
    const result = haversineDistance(lon1, lat1, lon2, lat2);
    expect(result).toBeCloseTo(expectedDistance, 4);
  });
});