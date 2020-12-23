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
const fs        = require("fs");
const mysql     = require("mysql");
const MySql     = require('sync-mysql');
let   pathFile  = ``;

// Lade Konfigurationen
let pathConfigDir    = pathMod.join(mainDir, '/app/config/');
global.PANEL_CONFIG_OTHER = [];
fs.readdirSync(pathConfigDir).forEach(item => {
    console.log(item);
    if(item.includes(".json")) {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathLangDir}\\${item}`);
        try {
            if(item === "app.json") {
                global.PANEL_CONFIG                                 = JSON.parse(fs.readFileSync(pathMod.join(pathLangDir, item), 'utf8'));
            }
            else if(item === "main.json") {
                global.PANEL_MAIN                                   = JSON.parse(fs.readFileSync(pathMod.join(pathLangDir, item), 'utf8'));
            }
            else {
                PANEL_CONFIG_OTHER[item.replaceAll(".json")]        = JSON.parse(fs.readFileSync(pathMod.join(pathLangDir, item), 'utf8'));
            }
        }
        catch (e) {
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathLangDir}\\${item} cannot Loaded`);
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
            process.exit(1)
        }
    }
})

// Lade Sprachdatei(en)
let pathLangDir    = pathMod.join(mainDir, '/lang/', PANEL_CONFIG.lang);
global.PANEL_LANG_OTHER = [];
fs.readdirSync(pathLangDir).forEach(item => {
    if(item.includes(".json")) {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Load: ${pathLangDir}\\${item}`)
        try {
            if(item === "lang.json") {
                global.PANEL_LANG                                   = JSON.parse(fs.readFileSync(pathMod.join(pathLangDir, item), 'utf8'));
            }
            else if(item === "alert.json") {
                global.PANEL_LANG_ALERT                             = JSON.parse(fs.readFileSync(pathMod.join(pathLangDir, item), 'utf8'));
            }
            else {
                PANEL_LANG_OTHER[item.replaceAll(".json")]          = JSON.parse(fs.readFileSync(pathMod.join(pathLangDir, item), 'utf8'));
            }
        }
        catch (e) {
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathLangDir}\\${item} cannot Loaded`);
            process.exit(1)
        }
    }
})

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
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
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
    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
    process.exit(1)
}