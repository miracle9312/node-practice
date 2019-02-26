const passport = require('passport');
const LocalStrategy = require('passport-local');

const user = {
    name: "miracle",
    pwd: "123456",
    id: 1
};

function findUser(username, done) {
    if(username === user.name) {
        return done(null, user);
    }

    return done(null);
}

passport.serializeUser(function(user, done) {
    done(null, user.name);
});

passport.deserializeUser(function(username, done) {
    findUser(username, done);
});