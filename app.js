const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongodbStore = require("connect-mongodb-session")(session);
const appController = require('./controllers/appController');
const app = express();
const HOST = '127.0.0.1';
const PORT = 3000;
const DB_PATH = 'mongodb://127.0.0.1:27017/clothes_db';
const store = new mongodbStore({
    uri: DB_PATH,
    collection: "sessions",
});
app.use(
    session({
        secret: "secret_app",
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
// set template
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// set css folder
app.use('/css', express.static(__dirname + '/css'));
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to mongoose
mongoose.connect(DB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
// Controller
app.use('', appController);
// Start app
app.listen(PORT, () => {
    console.log(`Server is running at: http://${HOST}:${PORT}`);
});
