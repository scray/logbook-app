// Calculate emissions based on the distance
function calculateCf(distance, emissionFactor) {
    return distance * emissionFactor
}

module.exports = calculateCf;

function haversineDistance(lon1, lat1, lon2, lat2) {
// Convert latitude and longitude from degrees to radians
  const lat1Rad = (Math.PI / 180) * lat1;
  const lon1Rad = (Math.PI / 180) * lon1;
  const lat2Rad = (Math.PI / 180) * lat2;
  const lon2Rad = (Math.PI / 180) * lon2;

 // Radius of the Earth in kilometers
  const radius = 6371;

 // Difference between latitude and longitude
  const deltaLat = lat2Rad - lat1Rad;
  const deltaLon = lon2Rad - lon1Rad;

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance between points
  const distance = radius * c;

  return distance;
}

module.exports = haversineDistance;