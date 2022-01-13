const mongoose = require('mongoose');

function connectDb() {
    mongoose.connect(`mongodb://localhost:27017/ecom`, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log('[INFO] Connect to DB success!');
    });
};

module.exports.connectDb = connectDb;