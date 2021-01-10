/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */
// Header
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`);
console.log('\x1b[33m%s\x1b[0m', `                    [ KAdmin-ArkWIN ] `);
console.log('\x1b[33m%s\x1b[0m', `                    Version: \x1b[36m${panelVersion}`);
console.log('\x1b[33m%s\x1b[0m', `                  Entwickler: \x1b[36mKyri123`);
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`);
console.log('\x1b[33m%s\x1b[0m', `    Github: \x1b[36mhttps://github.com/Kyri123/KAdmin-ArkWIN`);
console.log('\x1b[33m%s\x1b[0m', `    Discord: \x1b[36mhttps://discord.gg/uXxsqXD`);
console.log('\x1b[33m%s\x1b[0m', `    Trello: \x1b[36mhttps://trello.com/b/HZFtQ2DZ/KAdmin-ArkWIN`);
console.log('\x1b[36m%s\x1b[0m', `-----------------------------------------------------------`);

// Module
const fs        = require("fs");
const mysql     = require("mysql");
const MySql     = require('sync-mysql');
let   pathFile  = ``;

// Lade Konfiguration
pathFile    = pathMod.join(mainDir, '/app/config/', 'app.json');
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`);
if(fs.existsSync(pathFile)) {
    global.PANEL_CONFIG = JSON.parse(fs.readFileSync(pathFile, 'utf8'));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`);
    process.exit(1)
}

pathFile    = pathMod.join(mainDir, '/app/config/', 'main.json');
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`);
if(fs.existsSync(pathFile)) {
    global.PANEL_MAIN = JSON.parse(fs.readFileSync(pathFile, 'utf8'));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`);
    process.exit(1)
}

// Lade Sprachdatei(en)
pathFile    = pathMod.join(mainDir, '/lang/', PANEL_CONFIG.lang, 'lang.json');
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`)
if(fs.existsSync(pathFile)) {
    global.PANEL_LANG = JSON.parse(fs.readFileSync(pathFile, 'utf8'));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`);
    process.exit(1)
}

pathFile    = pathMod.join(mainDir, '/lang/', PANEL_CONFIG.lang, 'alert.json');
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`)
if(fs.existsSync(pathFile)) {
    global.PANEL_LANG_ALERT = JSON.parse(fs.readFileSync(pathFile, 'utf8'));
}
else {
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`);
    process.exit(1)
}

// Lade MySQL
pathFile    = pathMod.join(mainDir, '/app/config/', 'mysql.json');
console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathFile}`);
if(pathFile) {
    let mysql_config = JSON.parse(fs.readFileSync(pathFile, "utf8"));

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
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathFile} not found`);
    process.exit(1)
}