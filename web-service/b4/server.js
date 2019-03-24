const express = require('express');
const morgan = require('morgan');
const nconf = require('nconf');
const pkg = require('../package.json');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');

nconf.argv().env('__');
nconf.defaults({conf: `${__dirname}/config.json`});
nconf.file(nconf.get('conf'));

const app = express();

app.use(morgan('dev'));
app.use(session({
    store: new RedisStore({
        url: process.env.REDIS_STORE_URI
    }),
    secret: process.env.REDIS_STORE_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/version', (req, res) => res.status(200).send(pkg.version));
require('./lib/search.js')(app, nconf.get('es'));
require('./lib/bundle.js')(app, nconf.get('es'));
require('./lib/hit.js')(app, null);

app.listen(nconf.get('port'), ()=>console.log(`app listen at ${nconf.get('port')}`));