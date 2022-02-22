const express = require('express')
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

//app.use(express.json())
//app.use(userRouter);



// const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
// providing a Connect/Express middleware that can be used to enable CORS with various options.
app.use(cors());
// Morgan helps you log the API endpoint
app.use(morgan('dev'));

// db config
require('./src/config/db.config');
// import all routes at once
require('./src/config/routes.config')(app);
// Handling non-existing routes
require('./src/utils/error-handler.util')(app);

app.listen(port,
    () => {
        console.info(`%s 🚀 Server is listening on port ${port}`, chalk.green('✓'));

        // CRON THAT RUNS ON THE FIRST OF EVERY MONTH
        // cron.schedule("* * 1 * *", function async() {
        //     console.log("CRON STARTED FOR PURGING THE MEDIA FROM S3: ");
        // });
    });