
const mongoose = require("mongoose");
const { msToTime } = require('../utils/ms-to-time.util');
const chalk = require('chalk');
const dbUrl = "mongodb://127.0.0.1:27017/nodeDemoApp";
const mongoUrl = dbUrl;
//const mongoUrl = process.env.DB_URL || dbUrl;

mongoose.Promise = global.Promise;
//mongoose.set("useCreateIndex", true);

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    // useFindAndModify: false
};

const connectWithRetry = () => {
    let delay = 5000;
    return mongoose.connect(mongoUrl, options, (err) => {
        if (err) {
            console.error(`Failed to connect to mongo on startup - retrying in ${msToTime(delay)} \n`, chalk.red(err.message));
            setTimeout(connectWithRetry, delay);
        } else {
            console.log("%s 🚀 Successfully connected to the database", chalk.green('✓'));
        }
    });
};

connectWithRetry();