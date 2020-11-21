/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
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
const fs                              = require('fs');
const helmet                          = require("helmet");
global.ip                             = require('ip');
global.alerter                        = require('./app/src/alert.js');
global.md5                            = require('md5');
global.htmlspecialchars               = require('htmlspecialchars');
global.availableVersion_public        = 0;
global.availableVersion_activeevent   = 0;
global.mode                           = "dev";
global.dateFormat                     = require('dateformat');
global.panelVersion                   = "0.0.3";
global.mainDir                        = __dirname;
global.mysql                          = require('mysql');
global.isUpdate                       = false;
global.globalUtil                     = require('./app/src/util');

require('./app/main/main_loader.js');
global.debug                          = PANEL_MAIN.useDebug;

// lese Changelog
try {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ./app/json/changelog.json`)
  global.changelog                    = JSON.parse(fs.readFileSync(`./app/json/changelog.json`));
  changelog.reverse();
}
catch (e) {
  if(debug) console.log(e);
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ./app/json/changelog.json not found`);
  process.exit(1);
}

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
app.use(express.urlencoded({extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());

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

app.listen(PANEL_CONFIG.port, "0.0.0.0", ()=>{
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m http://${ip.address()}:${PANEL_CONFIG.port}/`);
});

module.exports = app;

// Starte Intverall aufgaben
backgroundRunner.startAll();

// Führe Start parameter aus und fehler zu vermeiden
//onStart.startAll(); // wurde durch ein neues System ersetzt 0.0.2