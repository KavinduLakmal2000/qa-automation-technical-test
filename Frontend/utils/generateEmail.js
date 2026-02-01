function generateRandomEmail(base = 'user') {
  const timestamp = Date.now(); // current time in ms
  return `${base}${timestamp}@example.com`;
}

module.exports = { generateRandomEmail };
