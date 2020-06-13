const User = require('../lib/user_callback');

exports.form = function(req, res) {
    res.render('register', {title: 'Register'});
};

exports.submit = (req, res, next) => {
    let data = req.body.user;
    User.getByName(data.name, (err, user) => {
        if (err) return next(err);
        if (user) {
            // res.error('Username already taken!');
            res.redirect('/register');
        } else {
            user = new User({
                name: data.name,
                pass: data.pass
            });
            console.log(user)
            user.save((err) => {
                if (err) return next(err);
                req.session.uid = user.id;
                res.redirect('/');
            });
        }
    });
};
