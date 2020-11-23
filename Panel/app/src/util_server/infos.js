/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const { array_replace_recursive }   = require('locutus/php/array');


module.exports = {
    /**
     * Gibt die Config aus
     * @param server {string} Servername
     * @returns {array}
     */
    getConfig: (server) => {
        if(globalUtil.poisonNull(server)) {
            let file    = globalUtil.safeFileReadSync([mainDir, '/app/json/server/', `${server}.json`], true);
            let cfg = file !== false ? file : {"server": false};

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
        }
        return {"server": false};
    },

    /**
     * Gibt die Serverinfos aus
     * @param server {string} Servername
     * @returns {array}
     */
    getServerInfos: (server) => {
        if(globalUtil.poisonNull(server)) {
            let file    = globalUtil.safeFileReadSync([mainDir, '/public/json/server/', `${server}.json`], true);
            let re      = file !== false ? file : {};
            return re;
        }
        return {};
    },

    /**
     * Schreibe Parameter in den Server
     * @param {string} server Server Name
     * @param {string} key Option
     * @param {string|any[]} value Wert
     * @return {boolean}
     */
    writeConfig: (server, key, value) => {
        if(globalUtil.poisonNull(server)) {
            let config  = module.exports.getConfig(server);
            let file    = `./app/json/server/${server}.json`;
            if(config.server === undefined) {
                config[key] = value;
                try {
                    globalUtil.safeFileSaveSync([mainDir, '/app/json/server/', `${server}.json`], JSON.stringify(config));
                    return true
                }
                catch (e) {
                    if(debug) console.log(e);
                }
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
        if(globalUtil.poisonNull(server)) {
            let config  = module.exports.getConfig(server);
            if(config.server === undefined) {
                try {
                    let saveData    = array_replace_recursive(config, cfg);
                    if(cfg.mods !== undefined)  saveData.mods = cfg.mods;
                    if(cfg.opt !== undefined)   saveData.opt = cfg.opt;
                    if(cfg.flags !== undefined) saveData.flags = cfg.flags;
                    globalUtil.safeFileSaveSync([mainDir, '/app/json/server/', `${server}.json`], JSON.stringify(saveData));
                    return true;
                }
                catch (e) {
                    if(debug) console.log(e);
                }
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
        if(globalUtil.poisonNull(iniName) && globalUtil.poisonNull(server)) {
            let config  = module.exports.getConfig(server);
            let path    = pathMod.join(config.path, '\\ShooterGame\\Saved\\Config\\WindowsServer');
            if(!globalUtil.safeFileExsistsSync([path])) globalUtil.safeFileMkdirSync([path]);
            try {
                globalUtil.safeFileSaveSync([path,`${iniName}.ini`], JSON.stringify(ini));
                return true;
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
    }
}