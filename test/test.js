var request = require('supertest'),
    assert = require('assert')
, express = require('express');

var app = require('../app.js');

describe('GET /', function(){
    it('respond with plain text', function(done){
        request(app)
        .get('/')
        .expect(200, done);
    });
});

var shot_id = null;

describe('POST /upload', function() {
    it('receives image', function(done){
        request(app)
        .post('/upload')
        .attach('shot', 'test/fixtures/kitteh_homeboy.gif')
        .expect(301)
        .end(function(err,res) {
            shot_id = res.headers.location;
            done();
        });
    });
});

describe('GET /:id', function() {
   it('respond with plain text', function(done){
        request(app)
        .get(shot_id)
        .expect(200, done);
    });

   it('have 2 views', function(done){
        request(app)
        .get(shot_id)
        .expect(200)
        .end(function(err,res) {
            assert.notEqual(-1, res.text.search(/2 views /i));
            done();
        });
    });
});

describe('GET /shot/:id', function() {
   it('respond with plain text', function(done){
        request(app)
        .get('/shot'+shot_id)
        .expect(200, done);
    });
});
