const User = require('../user_callback');

module.exports = (req, res, next) => {
    let uid = req.session.uid;
    if (!uid) return next();
    User.getId(uid).then(user => {
        req.user = res.locals.user = user;
        next();
    }).catch(err => next(err));
};

