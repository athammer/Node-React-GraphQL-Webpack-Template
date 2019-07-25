var awsParamStore = require('aws-param-store');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var compression = require('compression')
app.use(compression())
var exphbs = require('express-handlebars');
var session = require('express-session');
var cookieParser = require('cookie-parser')
var helmet = require('helmet')
let db = require('./db/db');
var find = require('lodash/find');
var logger = require('./logger');


logger.log('info', "Server started");

// view engine setup
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: null
}));

app.set('view engine', '.hbs');
app.set('trust proxy', 1) // trust first proxy

app.use(helmet())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser())

app.get('/ping', function (req, res) { //for aws healthcheck
  res.send('dong!')
})

//var RedisStore = require('connect-redis')(session);
// let myStore = new RedisStore(db.redisOptions)
let SequelizeStore = require('connect-session-sequelize')(session.Store);
let myStore = new SequelizeStore({
    db: db.sequalize
})
const parameters = awsParamStore.getParametersByPathSync('/', { region: 'us-east-1' })
const SESSION_SECRET = find(parameters, ['Name', 'SESSION_SECRET']).Value
app.use(session({
    name: 'sessionId',
    secret: SESSION_SECRET,
    store: myStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true,
        httpOnly: false,
        domain: 'buypixels.net',
        path: '/',
        expires: new Date((Date.now() + ((60 * 60 /*one hour*/ ) * 24 /*one day*/ ) * 1000) * 5) //
    }
}))


//myStore.sync();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

//web routes
require('./routes/web/auth.js')(app);
require('./routes/web/auth/email')(app);
require('./routes/web/index.js')(app);
require('./routes/web/market.js')(app);
require('./routes/web/user.js')(app);

//routes vars
//user routes vars
var userApiRoutes = require('./routes/api/users');
var userAuthApiRoutes = require('./routes/api/users/auth');
var botsApiRoutes = require('./routes/api/bots');

//routes
//user routes
app.use('/webAPI/users', userApiRoutes);
app.use('/webAPI/usersAuth', userAuthApiRoutes);
//bot routes
app.use('/webAPI/bots', botsApiRoutes);

app.all('*', function (req, res, next) {
    if (req.secure) {
        return next();
    }

    res.redirect('https://' + req.hostname + req.url);
});

//asdf

app.listen(3000);
