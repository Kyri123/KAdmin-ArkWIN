/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

// Modulealerter
const createError                     = require('http-errors');
const express                         = require('express');
const session                         = require('express-session');
const bodyParser                      = require('body-parser');
const path                            = require('path');
const cookieParser                    = require('cookie-parser');
const logger                          = require('morgan');
const uuid                            = require('uuid');
const backgroundRunner                = require('./app/src/background/backgroundRunner');
const onStart                         = require('./app/src/background/onStart');
global.ip                             = require('ip');
global.alerter                        = require('./app/src/alert.js');
global.md5                            = require('md5');
global.htmlspecialchars               = require('htmlspecialchars');
global.availableVersion_public        = 0;
global.availableVersion_activeevent   = 0;
global.mode                           = "dev";
global.dateFormat                     = require('dateformat');
global.panelVersion                   = "0.0.1";
global.mainDir                        = __dirname;
global.mysql                          = require('mysql');
global.isUpdate                       = false;

require('./app/main/main_loader.js');
global.debug                          = PANEL_MAIN.useDebug;

let app           = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  genid: function(req) {
    return uuid.v4()
  },
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(logger(mode));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// Main
app.use('/', require('./routes/index'));

// Error Handlers
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Starte Intverall aufgaben
backgroundRunner.startAll();

// Führe Start parameter aus und fehler zu vermeiden
onStart.startAll();