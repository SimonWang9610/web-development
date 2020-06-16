const basicAuth = require('express-basic-auth');
const User = require('../lib/user_async');
const Entry = require('../lib/entry');

async function getBoolValue(username, password) {
    let result = await User.authenticate(username, password);
    return Boolean(result);
}
exports.auth = basicAuth({
    authorizer: getBoolValue,

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