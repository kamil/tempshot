var Shot;

var Hashids = require("hashids"),
    hashids = new Hashids("this is my salt", 6)

Shot = (function() {
  
  function Shot(opts) {
    this.db = opts.db;
  }

  Shot.prototype.view = function(opts,cb) {
    var self = this;

    self.db.exists(opts.id,function(err,exists) {

        if (exists == 0) {}

        self.db.incr('views-'+opts.id,function(err, viewCount ) {
            self.db.sadd('users-'+opts.id,opts.user_id,function(err, wyn) {
                self.db.scard('users-'+opts.id,function( err, userCount ) {        
                    
                  cb(null,{
                    viewCount : viewCount,
                    userCount : userCount
                  })

                });
            });
        });
    });

  }

  Shot.prototype.add = function(opts,cb) {

    var self = this;

    this.db.incr('counter',function(err,index) {
       var new_id = hashids.encrypt(index);
       
       self.db.hmset(new_id,{
            "path" : opts.path,
            "extension" : opts.extension,
            "mimetype" : opts.originalname 
       },function() {
          cb(null, new_id)
       });

       console.log('new id',new_id);

    });

  };

  Shot.prototype.getPath = function(id,cb) {
    this.db.hget(id,'path',function(er,path) {
        cb(path)
    });
  };

  return Shot;

})();

module.exports = Shot;