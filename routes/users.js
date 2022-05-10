var express = require('express');
var restify = require('restify-clients');
var assert = require('assert');
var router = express.Router();

var client = restify.createJsonClient({
  url: 'http://localhost:4000'
});

/* GET users listing. */
router.get('/', function(req, res, next) {

  client.get('/users', (err,request,response,obj)=>{
    assert.ifError(err);

    res.json(obj);
  });
});
// GET user by id
router.get('/:id', function(req, res, next) {

  client.get(`/users/${req.params.id}`, (err,request,response,obj)=>{
    assert.ifError(err);

    res.json(obj);
  });
});
// PUT edit user info
router.put('/:id', function(req, res, next) {

  client.put(`/users/${req.params.id}`,req.body, (err,request,response,obj)=>{
    assert.ifError(err);

    res.json(obj);
  });
});

// DELETE user
router.delete('/:id', function(req, res, next) {

  client.del(`/users/${req.params.id}`, (err,request,response,obj)=>{
    assert.ifError(err);

    res.json(obj);
  });
});

router.post('/', function(req, res, next) {

  client.post(`/users/`,req.body, (err,request,response,obj)=>{
    assert.ifError(err);

    res.json(obj);
  });
});

module.exports = router;
