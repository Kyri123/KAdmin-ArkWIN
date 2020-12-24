/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

// Module
const mysql     = require("mysql");
const MySql     = require('sync-mysql');

// Lade MySQL
if(Installed) {
    if(PANEL_CONFIG_OTHER.mysql !== undefined) {
        let mysql_config = PANEL_CONFIG_OTHER.mysql;

        global.con = mysql.createConnection({
            host:       mysql_config.dbhost,
            user:       mysql_config.dbuser,
            password:   mysql_config.dbpass,
            database:   mysql_config.dbbase
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
            host:       mysql_config.dbhost,
            user:       mysql_config.dbuser,
            password:   mysql_config.dbpass,
            database:   mysql_config.dbbase
        });
    }
    else {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m mysql.json not found or loaded`);
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
        process.exit(1)
    }
}