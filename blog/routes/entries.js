const Entry = require('../lib/entry');

exports.list = async function(req, res, next) {
    let page = req.page;
    let rows = await Entry.getRange(page.from, page.to);
    res.render('entries', {
        title: 'Entries',
        entries: rows
    });
};

// exports.form = function(req, res) {
//     res.render('post', {title: 'Post'});
// };

exports.
submit = function(req, res, next) {
    let data = req.body.row;
    if(!data.body) {
        // res.error('Post content required')
        res.redirect('/');
        return;
    }
    let time = new Date();
    let date = time.getFullYear() + '-' + 
    time.getMonth() + '-' + time.getDay() + ' ' + 
    time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    
    let row = new Entry({
        'username': res.locals.user.name,
        'title': data.title,
        'date': date,
        'body': data.body
    });

    row.save().then(() => {
        console.log('redirecting!')
        if (req.remoteUser) {
            res.json({message: 'Entry added.'})
        } else {
            res.redirect('/');
        }
    }).catch(err => next(err));

};

