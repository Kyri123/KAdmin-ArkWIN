/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const { array_replace_recursive }   = require('locutus/php/array');

/**
 * Informationen für einen Server
 */
class server {

    /**
     * Inizallisiert einen Server
     * @param {string} servername
     */
    constructor(servername) {
        // Erstelle this Vars
        this.exsists            = false;
        this.server             = servername;
        this.cfgPath            = [mainDir, '/app/json/server/', `${this.server}.json`];
        this.defaultCfgPath     = [mainDir, '/app/json/server/template/', `default.json`];
        this.serverInfoPath     = [mainDir, '/public/json/server/', `${this.server}.json`];
        this.cfg                = {};

        if(globalUtil.poisonNull(this.server)) {
            let file        = globalUtil.safeFileReadSync(this.cfgPath, true);
            let dfile       = globalUtil.safeFileReadSync(this.defaultCfgPath, true);
            this.cfg        = file !== false ? (
                  dfile !== false ? array_replace_recursive(dfile, file)
                  : file
               ) : false;
            this.exsists    = this.cfg !== false;
        }
    }

    /**
     * gibt aus ob dieser Server existiert
     * @return {boolean}
     */
    cfgReload() {
        let file        = globalUtil.safeFileReadSync(this.cfgPath, true);
        let dfile       = globalUtil.safeFileReadSync(this.defaultCfgPath, true);
        let reloadCfg   = file !== false ? (
           dfile !== false ? array_replace_recursive(dfile, file)
              : file
        ) : false;
        if(reloadCfg !== false) this.cfg = reloadCfg;
    }

    /**
     * gibt aus ob dieser Server existiert
     * @return {boolean}
     */
    serverExsists() {
        return this.exsists;
    }

    /**
     * gibt die Konfiguration aus
     * @return {object}
     */
    getConfig() {
        if(this.serverExsists()) {
            this.cfgReload();
            return this.cfg;
        }
    }

    /**
     * Bekomme alle Serverinforamtionen von diesen Server
     * @return {object}
     */
    getServerInfos() {
        return globalUtil.safeFileReadSync(this.serverInfoPath, true);
    }

    /**
     * Speichert einen beliebigen Key in der CFG
     * @param {string} key Option
     * @param {any} value Wert
     * @return {boolean}
     */
    writeConfig( key, value) {
        if(this.serverExsists() && typeof this.cfg[key] !== "undefined") {
            this.cfg[key] = value;
            try {
                return globalUtil.safeFileSaveSync(this.cfgPath, JSON.stringify(config));
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
    }

    /**
     * Speichert eine Definierte CFG
     * @param {object} cfg Wert
     * @return {boolean}
     */
    saveConfig(cfg) {
        let config  = this.cfg;
        if(this.serverExsists()) {
            try {
                let saveData    = array_replace_recursive(config, cfg);
                if(cfg.mods     !== undefined)  saveData.mods   = cfg.mods;
                if(cfg.opt      !== undefined)  saveData.opt    = cfg.opt;
                if(cfg.flags    !== undefined)  saveData.flags  = cfg.flags;
                return globalUtil.safeFileSaveSync(this.cfgPath, JSON.stringify(saveData));
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
    }

    /**
     * Speichert eine Ini
     * @param {string} iniName
     * @param {object} ini
     * @return {boolean}
     */
    saveINI(ini, iniName) {
        if(this.serverExsists()) {
            let path    = pathMod.join(this.cfg.path, '\\ShooterGame\\Saved\\Config\\WindowsServer', `${iniName}.ini`);
            if(!globalUtil.safeFileExsistsSync([path])) globalUtil.safeFileCreateSync([path]);
            try {
                return globalUtil.safeFileSaveSync([path,`${iniName}.ini`], JSON.stringify(ini));
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
    }

    /**
     * Speichert eine Ini
     * @param {string} iniName
     * @return {boolean}
     */
    getINI(iniName) {
        if(this.serverExsists()) {
            let file            = globalUtil.safeFileReadSync([this.cfg.path, '\\ShooterGame\\Saved\\Config\\WindowsServer', `${iniName}.ini`]);
            let default_file    = globalUtil.safeFileReadSync([mainDir, '/app/data/ini/', `${GET.ini}.ini`]);
            return file !== false ? file : default_file !== false ? default_file : false;
        }
        return false;
    }
}


module.exports = {
    /**
     * Gibt die Config aus
     * @param server {string} Servername
     * @returns {array}
     */
    getConfig: (server) => {
        if(globalUtil.poisonNull(server)) {
            let file    = globalUtil.safeFileReadSync([mainDir, '/app/json/server/', `${server}.json`], true);
            let dfile   = globalUtil.safeFileReadSync([mainDir, '/app/json/server/template/', `default.json`], true);
            let cfg = file !== false ? (dfile !== false ? array_replace_recursive(dfile, file) : file) : {"server": false};

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