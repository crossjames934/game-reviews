'use strict';

const express          = require('express');
const session          = require('express-session');
const bodyParser       = require('body-parser');
const cors             = require('cors');
const auth             = require('./app/auth.js');
const routes           = require('./app/routes.js');
const mongo            = require('mongodb').MongoClient;
const passport         = require('passport');
const cookieParser     = require('cookie-parser');
const helmet           = require('helmet');
const app              = express();
const http             = require('http').Server(app);
const sessionStore     = new session.MemoryStore();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(helmet());
app.use(helmet.xssFilter());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));

// let currentUsers = 0;

mongo.connect(process.env.DATABASE, (err, db) => {
  if(err) console.log('Database error: ' + err);

  auth(app, db);
  routes(app, db);

  http.listen(process.env.PORT || 3000);

});
