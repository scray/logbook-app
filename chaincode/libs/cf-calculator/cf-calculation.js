// Calculate emissions based on the distance
function calculateCf(distance, emissionFactor) {
    return distance * emissionFactor
}

module.exports = calculateCf;