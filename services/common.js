const passport = require("passport")

exports.isAuth = (req, res, done) => {
    return passport.authenticate('jwt');
}

exports.sanitizeUser = (user) => {
    return {
        id: user.id,
        role: user.role
    }
}

exports.cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2JhYjFhZDY1M2MyMThhMTI4NWUxOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE1MTg2NDU4fQ.Z9NYetqKuBWEu7veaKm4t_DYFrFk679nT3eB7phe6cE";
    return token;
};