/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */
// Header
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`);
console.log('\x1b[33m%s\x1b[0m', `                    [ ArkAdminWIN ] `);
console.log('\x1b[33m%s\x1b[0m', `                    Version: \x1b[36m${panelVersion}`);
console.log('\x1b[33m%s\x1b[0m', `                  Entwickler: \x1b[36mKyri123`);
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`);
console.log('\x1b[33m%s\x1b[0m', `    Github: \x1b[36mhttps://github.com/Kyri123/ArkadminWIN`);
console.log('\x1b[33m%s\x1b[0m', `    Discord: \x1b[36mhttps://discord.gg/uXxsqXD`);
console.log('\x1b[33m%s\x1b[0m', `    Trello: \x1b[36mhttps://trello.com/b/HZFtQ2DZ/arkadminwin`);
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`);

// Module
var fs = require("fs");
var mysql = require("mysql");
var MySql = require('sync-mysql');

// Lade Konfiguration
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ./app/config/app.json`)
if(fs.existsSync('./app/config/app.json')) {
    global.PANEL_CONFIG = JSON.parse(fs.readFileSync('./app/config/app.json'));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ./app/config/app.json not found`);
    process.exit(1)
}

console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ./app/config/main.json`)
if(fs.existsSync('./app/config/main.json')) {
    global.PANEL_MAIN = JSON.parse(fs.readFileSync('./app/config/main.json'));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ./app/config/main.json not found`);
    process.exit(1)
}

// Lade Sprachdatei(en)
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ./lang/${PANEL_CONFIG.lang}/lang.json`)
if(fs.existsSync(`./lang/${PANEL_CONFIG.lang}/lang.json`)) {
    global.PANEL_LANG = JSON.parse(fs.readFileSync(`./lang/${PANEL_CONFIG.lang}/lang.json`));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ./lang/${PANEL_CONFIG.lang}/lang.json not found`);
    process.exit(1)
}

console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ./lang/${PANEL_CONFIG.lang}/alert.json`)
if(fs.existsSync(`./lang/${PANEL_CONFIG.lang}/alert.json`)) {
    global.PANEL_LANG_ALERT = JSON.parse(fs.readFileSync(`./lang/${PANEL_CONFIG.lang}/alert.json`));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ./lang/${PANEL_CONFIG.lang}/alert.json not found`);
    process.exit(1)
}

// Lade MySQL
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ./app/config/mysql.json`);
if(fs.existsSync('./app/config/mysql.json')) {
    var mysql_config = JSON.parse(fs.readFileSync(`./app/config/mysql.json`));

    global.con = mysql.createConnection({
        host: mysql_config.dbhost,
        user: mysql_config.dbuser,
        password: mysql_config.dbpass,
        database: mysql_config.dbbase
    });

    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m MySQL connecting...`);
    con.connect((err) => {
        if (err) {
            if(debug) console.log(err);
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m cannot connect to MariaDB`);
            process.exit(1)
        }
    });

    global.synccon = new MySql({
        host: mysql_config.dbhost,
        user: mysql_config.dbuser,
        password: mysql_config.dbpass,
        database: mysql_config.dbbase
    });
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ./app/config/mysql.json not found`);
    process.exit(1)
}