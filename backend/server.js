var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var compress = require('compression')
var path = require('path');
var http = require('http');
var app = express();
var passport = require('passport')
var config = require('./config.js')
var session = require('express-session')
var expressValidator = require('express-validator')
var mongoose = require('mongoose');
var UserModel = require('./model/user');
var methodOverride = require('method-override')
var MongoStore = require('connect-mongo')(session)
var logger = require('express-logger');
app.use(logger({path: "logs.txt"}));

mongoose.connect(process.env.MONGO_URI || config.database, {
  keepAlive: true,
  useMongoClient: true
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use(compress())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    name: 'session.id',
    resave: true,
    saveUninitialized: true,
    secret: config.jwt,
    store: new MongoStore({
      url: process.env.MONGO_URI || config.database,
      autoReconnect: true
    })
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', require('./routes/user/user'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

var port = process.env.PORT || config.port;
app.set('port', port);

http.createServer(app).listen(port, () => console.log(`Running on port:${port}`));