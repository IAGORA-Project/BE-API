const mongoose = require('mongoose');

function connectDb() {
    const nodeEnv = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/ecom' : process.env.MONGO_URL
    mongoose.connect(nodeEnv, { 
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