var express = require('express');
var router = express.Router();
var fs = require('fs');
var config = require('../config');

var jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/', function(req, res, next) {  
  var identity = req.body.identity;
  var clientId = req.body.clientId;
  var clientSecret = req.body.clientSecret;
  var isAnonymous = req.body.isAnonymous || false;
  var aud = req.body.aud || "https://idproxy.kore.com/authorize";

  var options = {
    "iat": new Date().getTime(),
    "exp": new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime(),
    "aud": aud,
    "iss": clientId,
    "sub": identity,
    "isAnonymous": isAnonymous
  }
	var token = jwt.sign(options, clientSecret);
  res.send({"jwt":token});
});

module.exports = router;
