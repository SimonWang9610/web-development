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

exports.delete = function(req, res, next) {
    let id = req.params.id;
    Entry.delete(id).then(() => {
        res.redirect('/');
    }).catch(err => next(err));
};

exports.edit = async function(req, res, next) {

    let id = req.params.id;
    let row = await Entry.getMomentsById(id);
    res.render('edit_entries', {
        title: 'Edit your post',
        id: id,
        entry: row,
    });

};

exports.edited = async function(req, res, next) {
    let id = req.params.id;
    let entry = await Entry.getMomentsById(id);
    let data = req.body.row;

    if (data.title == entry.title && data.body == entry.body) {
        res.redirect('/');
        return;
    }
    let time = new Date();
    let date = time.getFullYear() + '-' + 
        time.getMonth() + '-' + time.getDay() + ' ' + 
        time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
    
    Entry.edit(id, data, date).then(() => {
        res.redirect('/');
    }).catch(err => next(err));

}
exports.submit = function(req, res, next) {
    let data = req.body.row;
    if(!data.body) {
        // res.error('Post content required')
        res.redirect('/');
        return;
    }
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

