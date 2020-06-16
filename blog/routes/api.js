const basicAuth = require('express-basic-auth');
const User = require('../lib/user_async');
const Entry = require('../lib/entry');

exports.auth = basicAuth({
    authorizer: User.authenticate,

});

exports.user = function(req, res, next) {
    User.getById(req.params.id).then(user => {
        if(!user) return res.send(404);
        res.json(user);
    }).catch(err => next(err));
};

exports.entries = async function(req, res, next) {
    let page = req.page;
    let rows = await Entry.getRange(page.from, page.to);
    res.json(rows);
}