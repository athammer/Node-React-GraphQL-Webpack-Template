//const authHandlers = require('./auth/handlers');

module.exports = function (app) { //need to export for app.js to find it
    app.get('/authentication', function (req, res) {

        if(req.session.name != null) {
            return res.redirect('/user/' + req.session.name);
        }
        let success = req.session.success;
        let alert = req.session.alert;
        let error = req.session.error;
        req.session.success = '';
        req.session.alert = '';
        req.session.error = '';
        res.render('pages/auth', { name: req.session.name, successResp: success, alertResp: alert, errorResp: error });
    });

    app.get('/logout', function (req, res) {
        req.session.destroy(function(err) {
            //what to do on error
            return res.redirect('/');
        })
    });
};
