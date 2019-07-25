
module.exports = {
    /*
    Loads the user's private home if user is going to their home
    Loads public facing home else
    */
    loadHome: function(req, res) {
        let success = req.session.success;
        let alert = req.session.alert;
        let error = req.session.error;
        req.session.success = '';
        req.session.alert = '';
        req.session.error = '';
        userModel.findOne({ where: {username: req.params.name} })
        .then(user => {
            if(user === null) {
                res.send('404', 404);
            }
            if (req.params.name == req.session.name) {
                res.render('pages/userhome', { name: req.session.name, successResp: success, alertResp: alert, errorResp: error });
            } else {
                res.render('pages/user', { name: req.session.name, successResp: success, alertResp: alert, errorResp: error });
            }
        })
        .catch(err => {
            console.log(err);
            req.session.alert = 'User not found';
            return res.send('404', 404);
        })
    },
    
    /*
    Checking if a logged in user is trying to access another's users settings or any private info
    */
    checkUserSettingsPerms: function(req, res) {
        let success = req.session.success;
        let alert = req.session.alert;
        let error = req.session.error;
        if(req.session && req.session.name !== req.params.name) {
        req.session.alert = 'You do not have permission to access that page';
        return res.redirect("/");
        } else {
        res.render('pages/usersettings', { name: req.session.name, successResp: success, alertResp: alert, errorResp: error });
        }

        console.log(req.originalUrl + '============================');
    }
}