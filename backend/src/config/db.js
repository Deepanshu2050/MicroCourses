const mongoose = require('mongoose');

async function connect(uri) {
  mongoose.set('strictQuery', true);
  return mongoose.connect(uri);
}

module.exports = { connect };


