const emailHandlers = require('./email/handlers');

module.exports = function (app) { //need to export for app.js to find it
    app.get('/emailVerification/:token', function (req, res) {
        req.session.success = '';
        req.session.alert = '';
        req.session.error = '';
        return emailHandlers.verifyEmail(req, res);
    });
};
