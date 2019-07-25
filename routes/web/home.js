const exampleHandlers = require('./example/handlers');

module.exports = function (app) { //need to export for app.js to find it

    app.get('/', function (req, res) {
        res.render('pages/home', { exampleData: 'toSendToFrontEnd' });
    });

};
