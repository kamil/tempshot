"use strict";

var express = require('express'),
    app = express(),
    multer = require('multer'),
    redis = require("redis"),
    client = redis.createClient(),
    Shot = require('./lib/shot');


var shot = new Shot({
    db: client
})

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/static'));
app.use(multer({
    dest: './tmp/',
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now();
    }
}));

client.on("error", function (err) {
        console.log("REDIS Error " + err);
});

app.get('/', function(req,res) {
    res.render('index');
});

app.post('/upload', function (req, res) {


    var file = req.files.shot;

    shot.add({
        "path" : file.path,
        "extension" : file.extension,
        "mimetype" : file.originalname 
    },function(err,id) {
        res.redirect(301, '/' + id);
    });

});

app.get('/:id', function(req,res) {

    var eid = req.params.id;

    shot.view({

        id : eid,
        user_id : req.ip
   
    },function(err,counts) {
   
        res.render('shot', {
            shot : '/shot/' + eid,
            viewCount : counts.viewCount,
            userCount : counts.userCount
        });
   
    });
    
});


app.get('/shot/:id', function(req,res) {
    shot.getPath(req.params.id,function(path) {
        res.sendfile(path);
    });
});

app.listen(3000, function () {
    console.log('listening on port %d', this.address().port);
}); 

module.exports = app;