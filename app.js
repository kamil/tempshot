"use strict";

var express = require('express'),
    app = express(),
    multer = require('multer'),
    Hashids = require("hashids"),
    hashids = new Hashids("this is my salt", 6),
    redis = require("redis"),
    client = redis.createClient();

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

    client.incr('counter',function(err,index) {
       var new_id = hashids.encrypt(index);
       
       client.hmset(new_id,{
            "path" : file.path,
            "extension" : file.extension,
            "mimetype" : file.originalname 
       },function() {

        res.redirect(301, '/' + new_id);

       });

       console.log('new id',new_id);



    });


});

app.get('/:id', function(req,res) {

    var eid = req.params.id;

    client.incr('views-'+eid,function(err, viewCount ) {
        
        res.render('shot', {
            shot : '/shot/' + eid,
            viewCount : viewCount
        });
    });
    
});


app.get('/shot/:id', function(req,res) {
    
    client.hget(req.params.id,'path',function(er,c) {
        res.sendfile(c);
    });

});

app.listen(3000, function () {
    console.log('listening on port %d', this.address().port);
}); 

module.exports = app;