var express = require('express');
var passport = require('passport');
var router = express.Router();
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.mailpass);


var message = {
    "html": "<p>Classbook.com</p>",
    "text": "Example text content",
    "subject": "Notificação Classbook",
    "from_email": "info@classbook.co",
    "from_name": "Classbook.co",
    "to": [{
            "email": '',
            "name": '',
            "type": "to"
        }],
    "headers": {
        "Reply-To": "info@classbook.co"
    }
};

var mongoose = require('mongoose');
var User = require('../models/User.js');
var Token = require('../models/Token.js');

router.post('/register', function(req, res, next) {
  var password = req.body.password;
  console.log(req.body);
  delete req.body.password;
  User.register(req.body, password, function (err, post) {
    console.log(err);
    if (err) res.status(500).json(err);
    console.log(post);
      message.html = 'Bem vindo ao Classbook! Clique no link abaixo para activar a sua conta.<br/>Use o seu telefone ('+req.body.phone+')<br/><a href="http://www.classbook.co/#/page/activate-account">Restaurar Senha</a>';
      message.text = 'Bem vindo ao Classbook! Active a sua conta usando o telefone ('+req.body.phone+'): http://www.classbook.co/#/page/activate-account';
      message.to[0].email = req.body.email;
      message.to[0].name = req.body.firstname +' '+ req.body.lastname;
      console.log(message);
      

      mandrill_client.messages.send({"message": message, "async": false, "ip_pool": "Main Pool", "send_at": ''}, function(result) {
        console.log(result);
        res.json(post);
      }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  var sanitized = {
    _id: req.user._id,
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    school: req.user.school,
    phone: req.user.phone,
    type: req.user.type
  };
  
  res.status(200).send(sanitized);
  //res.status(200).send(req.user);
});


router.post('/password', function(req, res, next) {

  User.findById(req.user.id, function (err, user) {
    if (err) res.status(500).json(err);
    
    if (user == null) return res.status(404).json({ error: "Resource Not found." });

    user.setPassword(req.body.password, function(){
            user.save();
            return res.status(200).json(user);
        });
  });
});

/* GET /todos listing. */
router.get('/tokens/:id', function(req, res, next) {
  Token.findById(req.params.id, function (err, token) {
    if (err) res.status(500).json(err);
    
    if (token == null) return res.status(404).json(token);
    
    res.json(token);
  });
});

router.post('/reset', function(req, res, next) {

  User.find({phone: req.body.phone},function (err, users) {
    var user = users[0];
    console.log(req.body);
    console.log(users);
    console.log(user);
    if (err) res.status(500).json(err);
    
    Token.create({ user: user._id }, function (err, token) {
      if (err) res.status(500).json(err);
      message.html = 'Clique no link abaixo para restaurar a sua senha: <br/><a href="http://www.classbook.co/#/page/reset/'+token._id+'">Restaurar Senha</a>';
      message.text = 'Clique no link para restaurar a sua senha: http://www.classbook.co/#/page/reset/'+token._id;
      message.to[0].email = user.email;
      message.to[0].name = user.firstname +' '+ user.lastname;
      console.log(message);
      

      mandrill_client.messages.send({"message": message, "async": false, "ip_pool": "Main Pool", "send_at": ''}, function(result) {
        console.log(result);
        res.json(token);
      }, function(e) {
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
      });

  });

  });
});

router.post('/restore', function(req, res, next) {

  Token.findById(req.body.token,function (err, token) {
    if (err) res.status(500).json(err);
    if (token == null) return res.status(404).json({ error: "Resource Not found." });
    
    User.findById(token.user, function (err, user) {
    if (err) res.status(500).json(err);
    if (user == null) return res.status(404).json({ error: "Resource Not found." });

      user.setPassword(req.body.password, function(){
            user.save();

            Token.findByIdAndRemove(req.body.token, function (err, post) {
              if (err) res.status(500).json(err);
                return res.status(200).json(user);
              });
            
        });
  });

  });
});

router.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send("success");
});

router.get('/valid', function(req, res) {
    if (req.isAuthenticated()){
      res.status(200).send(req.user);
    }else{
      res.status(401).send();
    }
    
});


module.exports = router;