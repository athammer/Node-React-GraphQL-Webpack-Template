'use strict';
let sequelize = require('sequelize');
var crypto = require('crypto');
let bcrypt = require('bcrypt');
const saltRounds = 10;
let validator = require('validator');
let get = require('lodash/get');
let db = require('../../../../db/db');
const userModel = db.sequalize.import('./../../../../db/models/users.js')
const { registerEmail } = require('./../../../web/auth/email/handlers');

let userAuthRouteHandlers = {

    login: function (req, res, next) {
        if(req.session.name) {
            return res.status(500).send({ resp: 'You are already logged in.' });
        }
        let email = get(req.body, 'email', '');
        let password = get(req.body, 'password', '');
        let rememberMe = get(req.body, 'rememberMe', '');

        userModel.findOne({ where: { email: email} })
        .then(user => {
            if(user === null) {
                return res.status(500).send({ resp: 'Email not attached to a user, please try again.' });
            }
            bcrypt.compare(password, user.password, function(err, resp) {
                if(err) {
                    console.error(err);
                    return res.status(500).send({ resp: 'An error has occured comparing passwords. Please try again.' });
                }
                if(!resp) {
                    return res.status(500).send({ resp: 'Password was incorrect. Please try again' });
                }
                req.session.save((err) => {
                    if(err) {
                        console.error(err);
                        return res.status(500).send({ resp: 'Trying to create a cookie.' });
                    }
                    if(rememberMe) {
                        req.session.cookie.maxAge = 2592000000 //30 days
                    } else {
                        req.session.cookie.maxAge = 3600000*2; //two hours
                    }
                    req.session.emailVerified = false;
                    req.session.name = user.username;
                    req.session.email = email;
                    req.session.cookie.rolling = true;
                    registerEmail(req, res);
                    return res.status(200).send({ resp: "User logged in" });
                });
            });

        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({ resp: 'An error has occured logging in. Please try again.' });
        })
    },

    register: function (req, res, next) {
        if(req.session.name) {
            return res.status(500).send({ resp: 'You are already logged in.' });
        }
        let token = crypto.randomBytes(34).toString('hex');
        let username = get(req.body, 'username', '');
        let password = get(req.body, 'password', '');
        let passwordConfirm = get(req.body, 'passwordConfirm', '');
        let rememberMe = get(req.body, 'rememberMe', '');
        let email = get(req.body, 'email', '');
        let hash = 'thisShouldNotBeThePassWord';
        if (username.length < 3 || username.length > 16) { //username must be larger then two
            console.error('Please use a username with more then two and less then sixteen characters' );
            return res.status(500).send({ resp: 'Please use a username with more then two and less then sixteen characters' });
        }
        if (!validator.isEmail(email)) {
            console.error('Please use a real email.' );
            return res.status(500).send({ resp: 'Please use a valid email' });
        }
        if (password.length < 8 || password.length > 45) { //password must be larger then 8
            console.error('Please use a password longer then eight and smaller then fourty five characters');
            return res.status(500).send({ resp: 'Please use a password longer then eight and smaller then fourty five characters' });
        }
        if (password === passwordConfirm) {
            hash = bcrypt.hashSync(password, saltRounds);
        } else {
            console.error('Password and confirmation password are not the same');
            return res.status(500).send({ resp: 'Password and confirmation password are not the same' });
        }

        userModel.findOne({ where: {email: email} }).then(user => {
            if(user != null) {
                console.error('User already exist with email' + JSON.stringify(email));
                return res.status(500).send({ resp: 'User already exists with that email' });
            }
            userModel.findOne({ where: {username: username} }).then(user => {
                if(user != null) {
                    console.error('User already exist with name');
                    return res.status(500).send({ resp: 'User already exists with that name' });
                }
                userModel.findOrCreate({where: {
                    username: username,
                    email: email,
                    password: hash,
                    token: token
                }}).spread((user, created) => {
                    if(!created) {
                        console.error('User already exist during creation');
                        return res.status(500).send({ resp: 'User already exists' });
                    }
                    //created new user
                    req.session.save((err) => {
                        if(err) {
                            console.error(err);
                            return res.status(500).send({ resp: 'Trying to create a cookie.' });
                        }
                        if(rememberMe) {
                            req.session.cookie.maxAge = 2592000000 //30 days
                        } else {
                            req.session.cookie.maxAge = 3600000*2; //two hours
                        }
                        req.session.emailVerified = false;
                        req.session.name = username;
                        req.session.token = token;
                        req.session.email = email;
                        req.session.cookie.rolling = true;
                        registerEmail(req, res);
                        return res.status(200).send({ resp: "User registered" })
                    })
                })
                .catch(function (err) {
                    console.error(err);
                    return res.status(500).send({ resp: 'An error has occured, please try again' });
                });
            })
            .catch(function (err) {
                console.error(err);
                return res.status(500).send({ resp: 'An error has occured, please try again' });
            });
        })
        .catch(function (err) {
            console.error(err);
            return res.status(500).send({ resp: 'An error has occured, please try again' });
        });
    },

    restPass: function (req, res, next) {
        if(!req.session.name) {
            return res.status(500).send({ resp: 'You are not logged in to request a password reset.' });
        }
        userModel.findOne({ where: { username: req.session.name} })
        .then(user => {
            if(user === null) {
                return res.status(500).send({ resp: 'Error has occured, username not found in our Database.' });
            }
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({ resp: 'An error has occured logging in. Please try again.' });
        })
    }

}
module.exports = userAuthRouteHandlers;
