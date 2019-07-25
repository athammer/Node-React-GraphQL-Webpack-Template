const userHandlers = require('./user/handlers');

module.exports = function (app) { //need to export for app.js to find it

    app.get('/user/:name', function (req, res) {
        req.session.success = '';
        req.session.alert = '';
        req.session.error = '';
        userHandlers.userHandlersloadHome(req, res) //change name? it looks like we expect a bool but res responds with the page
        // res.render('pages/home', { name: req.session.name });
    });

    app.get('/user/:name/settings', function (req, res) {
        let success = req.session.success;
        let alert = req.session.alert;
        let error = req.session.error;
        req.session.success = '';
        req.session.alert = '';
        req.session.error = '';
        userHandlers.checkUserSettingsPerms(req, res);
    });
};
