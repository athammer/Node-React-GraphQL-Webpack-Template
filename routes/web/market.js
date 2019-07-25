//const marketHandlers = require('./market/handlers');

module.exports = function (app) { //need to export for app.js to find it

    app.get('/market', function (req, res) {
        let success = req.session.success;
        let alert = req.session.alert;
        let error = req.session.error;
        req.session.success = '';
        req.session.alert = '';
        req.session.error = '';
        res.render('pages/marketplace', { name: req.session.name, successResp: success, alertResp: alert, errorResp: error });
    });

};
