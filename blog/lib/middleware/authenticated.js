const User = require('../user_async');

module.exports = (req, res, next) => {

    if (req.remoteUser) {
        res.locals.user = req.remoteUser;
    }
    let uid = req.session.uid;
    if (!uid) return next();
    User.getById(uid).then(user => {
        req.user = res.locals.user = user;
        next();
    }).catch(err => next(err));
};

