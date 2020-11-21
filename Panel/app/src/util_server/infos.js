/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const { array_replace_recursive }   = require('locutus/php/array');
const fs                            = require('fs')


module.exports = {
    /**
     * Gibt die Config aus
     * @param server {string} Servername
     * @returns {array}
     */
    getConfig: (server) => {
        let cfg = fs.existsSync(`./app/json/server/${server}.json`) ? JSON.parse(fs.readFileSync(`./app/json/server/${server}.json`, 'utf8')) : {"server": false};

        // Erzeuge Standarts (für ergänzte vars)
        if(cfg.server === undefined) {
            if(cfg.MapModID === undefined) cfg.MapModID = 0;

            if(
                cfg.path.indexOf(PANEL_CONFIG.servRoot) !== 0 ||
                cfg.pathLogs.indexOf(PANEL_CONFIG.logRoot) !== 0 ||
                cfg.pathBackup.indexOf(PANEL_CONFIG.pathBackup) !== 0
            ) cfg = {"server": false};
        }

        return cfg;
    },

    /**
     * Gibt die Serverinfos aus
     * @param server {string} Servername
     * @returns {array}
     */
    getServerInfos: (server) => {
        return fs.existsSync(`./public/json/server/${server}.json`) ? JSON.parse(fs.readFileSync(`./public/json/server/${server}.json`, 'utf8')) : {};
    },

    /**
     * Schreibe Parameter in den Server
     * @param {string} server Server Name
     * @param {string} key Option
     * @param {string|any[]} value Wert
     * @return {boolean}
     */
    writeConfig: (server, key, value) => {
        let config  = module.exports.getConfig(server);
        let file    = `./app/json/server/${server}.json`;
        if(config.server === undefined) {
            config[key] = value;
            try {
                globalUtil.safeFileSave(`${mainDir}/app/json/server/`, `${server}.json`, JSON.stringify(config), false);
                return true
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
    },

    /**
     * Speichert Server Konfiguration
     * @param {string} server Server Name
     * @param {any[]} cfg Konfiguration
     * @return {boolean}
     */
    saveConfig: (server, cfg) => {
        let config  = module.exports.getConfig(server);
        let file    = `./app/json/server/${server}.json`;
        if(config.server === undefined) {
            try {
                let saveData    = array_replace_recursive(config, cfg);
                if(cfg.mods !== undefined)  saveData.mods = cfg.mods;
                if(cfg.opt !== undefined)   saveData.opt = cfg.opt;
                if(cfg.flags !== undefined) saveData.flags = cfg.flags;
                globalUtil.safeFileSave(`${mainDir}/app/json/server/`, `${server}.json`, JSON.stringify(saveData), false);
                return true;
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
    },

    /**
     * Speichert Server Ini
     * @param {string} server Server Name
     * @param {string} ini Ini inhalt
     * @param {string} iniName Name der Ini
     * @return {boolean}
     */
    saveIni: (server, ini, iniName) => {
        let config  = module.exports.getConfig(server);
        let path    = `${config.path}\\ShooterGame\\Saved\\Config\\WindowsServer`;
        if(!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true});
        try {
            globalUtil.safeFileSave(`${path}\\`, `${iniName}.ini`, JSON.stringify(ini));
            return true;
        }
        catch (e) {
            if(debug) console.log(e);
        }
        return false;
    }
}