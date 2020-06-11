const qs = require('querystring');

exports.sendHtml = function(res, html) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
};

exports.parseReceivedData = function(req, cb) {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        let data = qs.parse(body);
        cb(data); //cb is callback
    });
};

exports.actionForm = function(id, path, label) {
    let html = '<form method="POST" action="' + path + '">' +
                '<input type="hidden" name="id" value="' + id + '">' +
                '<input type="submit" value="' + label + '">' + '</form>';
    return html; 
}; // construct customized route '/ROUTE'

exports.add = function(db, req, res) {
    exports.parseReceivedData(req, (work) => {
        db.query(
            'INSERT INTO work (hours, date, description) ' +
            'VALUES (?, ?, ?)',
            [work.hours, work.date, work.description],
            (err) => {
                if (err) throw err;
                exports.show(db, res);
            }
        );
    });
};

exports.delete = function (db, req, res) {
    exports.parseReceivedData(req, (work) => {
        db.query(
            'DELETE FROM work WHERE id=?',
            [work.id],
            (err) => {
                if (err) throw err;
                exports.show(db, res);
            }
        );
    });
};

exports.archive = function(db, req, res) {
    exports.parseReceivedData(req, (work) => {
        db.query(
            'UPDATE work SET archived=1 WHERE id=?',
            [work.id],
            (err) => {
                if (err) throw err;
                exports.show(db, res);
            }
        );
    });
}; // archive only display those records with 'archived=0'

exports.unarchive = function(db, req, res) {
    exports.parseReceivedData(req, (work) =>{
        db.query(
            'UPDATE work SET archived=0 WHERE id=?',
            [work.id],
            (err) => {
                if (err) throw err;
                exports.show(db, res);
            }
        );
    });
};
exports.show = function(db, res, showArchived) {
    let query = 'SELECT * FROM work ' + 'WHERE archived=? ' + 'ORDER BY date DESC';
    let archiveValue = (showArchived) ? 1:0;
    db.query(
        query,
        [archiveValue],
        (err, rows) => {
            if (err) throw err;
            let html = (showArchived) ? '<a href="/return">Return</a><br/>' : '<a href="/archived">Archived Work</a><br/>';
            html += exports.workHitListHtml(rows); // display records in <table>
            html += exports.workFormHtml(); //display input <form>
            exports.sendHtml(res, html);
        }
    );
}; // determine to display those records with 'archived=0||1'

exports.showArchived = function(db, res) {
    exports.show(db, res, true);
}; // only display those records with 'archived=1'

exports.workHitListHtml = function(rows) {
    let html = '<table>';
    for(let i in rows) {
        html += '<tr>';
        html += '<td>' + rows[i].date + '</td>';
        html += '<td>' + rows[i].hours + '</td>';
        html += '<td>' + rows[i].description + '</td>';
        
        if (!rows[i].archived) {
            html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>'; //route '/archive'
        } else {
            html += '<td>' + exports.workArchivedForm(rows[i].id) + '</td>'; //route '/unarchive'
        }
        
        html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    return html;
}; //consturct HTML <table> to display database records

exports.workFormHtml = function() {
    let html = '<form method="POST" action="/">' + 
    '<p> Date:<br/><input name="date" type="text"></p>' +
    '<p> Hours worked:<br/><input name="hours" typre="text"></p>' +
    '<p> Description:<br/>' +
    '<textarea name="description"></textarea></p>' + 
    '<input type="submit" value="Add">' +
    '</form>';
    return html;
}; //construct input <form> 

exports.workArchiveForm = function(id) {
    return exports.actionForm(id, '/archive', 'Archive');
};

exports.workArchivedForm = function(id) {
    return exports.actionForm(id, '/unarchive', 'Unarchive')
}
exports.workDeleteForm = function(id) {
    return exports.actionForm(id, '/delete', 'Delete');
};

