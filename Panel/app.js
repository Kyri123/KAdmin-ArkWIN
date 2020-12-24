/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */
global.dateFormat                     = require('dateformat');
global.panelBranch                    = process.argv.includes("dev") ? "dev" : "master";
if(process.platform !== "win32") {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m OS is not Windows or supported`);
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
  process.exit(1);
}

const createError                     = require('http-errors');
const express                         = require('express');
const session                         = require('express-session');
const bodyParser                      = require('body-parser');
const cookieParser                    = require('cookie-parser');
const logger                          = require('morgan');
const uuid                            = require('uuid');
const helmet                          = require("helmet");
const backgroundRunner = require('./app/src/background/backgroundRunner');
global.userHelper = require('./app/src/sessions/helper');
global.mainDir                        = __dirname;
global.ip                             = require('ip');
global.md5                            = require('md5');
global.htmlspecialchars               = require('htmlspecialchars');
global.mysql                          = require('mysql');
global.pathMod                        = require('path');
global.fs                             = require('fs');
global.availableVersion_public        = 0;
global.availableVersion_activeevent   = 0;
global.mode                           = "dev";
global.panelVersion                   = "0.0.4";
global.buildID                        = "004.000";
global.isUpdate                       = false;
global.globalUtil                     = require('./app/src/util');
global.Installed                      = false;

// Checking Installed
let pathToInstallerJSON    = pathMod.join(mainDir, '/app/json/panel/', 'installer.json');
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m checking Panel is installed`);
try {
  let installer       = globalUtil.safeFileReadSync([pathToInstallerJSON], true);
  global.Installed    = installer.installed !== undefined;
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m ${Installed ? "is Installed... load Panel" : "not Installed... load Installer"}`);
}
catch (e) {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m not Installed... load Installer`);
}
//Installed = false; //(Testing)

// Modulealerter
require('./app/main/main_loader.js');
global.alerter                        = require('./app/src/alert.js');
global.debug                          = PANEL_MAIN.useDebug;

// lese Changelog
let pathFile    = pathMod.join(mainDir, '/app/json/panel/', 'changelog.json');
try {
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`)
  global.changelog                    = globalUtil.safeFileReadSync([pathFile], true);
  changelog.reverse();
}
catch (e) {
  if(debug) console.log(e);
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`);
  console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
  process.exit(1);
}

let app         = express();

// view engine
app.set('views', pathMod.join(__dirname, 'views'));
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
app.use(express.static(pathMod.join(__dirname, 'public')));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.hidePoweredBy());

// Routes
// Main
app.use('/', require(Installed ? './routes/index' : './routes/installer/index'));

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
if(Installed) backgroundRunner.startAll();