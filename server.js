const express = require('express')
const chalk = require('chalk');
const app = express();
// db config
require('./src/config/db.config');
// import all routes at once
//require('./src/config/routes.config')(app);
const userRouter = require('./src/app/routes/user.route')

// const server = require('http').createServer(app);
const port = process.env.PORT || 3000;


app.use(express.json())
app.use(userRouter);

app.listen(port,
    () => {
        console.info(`%s 🚀 Server is listening on port ${port}`, chalk.green('✓'));

        // CRON THAT RUNS ON THE FIRST OF EVERY MONTH
        // cron.schedule("* * 1 * *", function async() {
        //     console.log("CRON STARTED FOR PURGING THE MEDIA FROM S3: ");
        // });
    });