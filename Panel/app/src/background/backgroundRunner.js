/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */
"use strict"

const server_util           = require('./server/util');
const server_state          = require('./server/state');
const serverCommands        = require('./server/commands');
const serverClass           = require('./../util_server/class');
const globalInfos           = require('./../global_infos');
const si                    = require('systeminformation');
const osu                   = require('node-os-utils')
const disk                  = require('check-disk-space');
const AA_util               = require('../util');
const req                   = require('request');


module.exports = {
    /**
     * Startet alle Intervalle
     */
    startAll: () => {
        setInterval(() => module.exports.getAvailableVersion(),       PANEL_MAIN.interval.getAvailableVersion);   //getAvailableVersion   > Holt verfügbare Version von SteamCMD
        setInterval(() => module.exports.getStateFromServers(),       PANEL_MAIN.interval.getStateFromServers);   //getStateFromServers   > Holt Serverstatus informationen
        setInterval(() => module.exports.getModsFromAPI(),            PANEL_MAIN.interval.getModsFromAPI);        //getModsFromAPI        > Holt Mod Infos von SteamAPI
        setInterval(() => module.exports.getTraffic(),                PANEL_MAIN.interval.getTraffic);            //getTraffic            > Schreibt Traffic Infos
        setInterval(() => module.exports.doServerBackgrounder(),      PANEL_MAIN.interval.doServerBackgrounder);  //doServerBackgrounder  > Führt Hintergrund aktionen aus wie Automatisches Updaten und Backupen
        setInterval(() => module.exports.backgroundUpdater(),         PANEL_MAIN.interval.backgroundUpdater);     //backgroundUpdater     > Schau nach Updates für das Panel
        setInterval(() => module.exports.doReReadConfig(),            PANEL_MAIN.interval.doReReadConfig);        //doReReadConfig        > Liest die Globalen Configurationen
    },

    /**
     * Startet Intervall > getAvailableVersion
     */
    getAvailableVersion: async () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getAvailableVersion`);
        server_util.getAvailableVersion();
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getStateFromServers: () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getStateFromServers`);
        server_state.getStateFromServers();
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getTraffic: async () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getTraffic`);
        osu.cpu.usage().then (cpuPercentage => {
            let disk_path = pathMod.join(globalUtil.safeFileExsistsSync([PANEL_CONFIG.servRoot]) ? PANEL_CONFIG.servRoot : mainDir);
            disk(disk_path).then((info) => {
                si.mem()
                    .then(mem => {
                        let ramPercentage = 100 - (mem.available / mem.total * 100);
                        let memPercentage = 100 - (info.free / info.size * 100);

                        let data = {
                            "cpu" : cpuPercentage.toFixed(2),
                            "ram" : ramPercentage.toFixed(2),
                            "ram_total" : AA_util.convertBytes(mem.total),
                            "ram_availble" : AA_util.convertBytes(mem.total - mem.available),
                            "mem" : memPercentage.toFixed(2),
                            "mem_total" : AA_util.convertBytes(info.size),
                            "mem_availble" : AA_util.convertBytes(info.size - info.free)
                        };

                        globalUtil.safeFileSaveSync([mainDir, '/public/json/serverInfos/', 'auslastung.json'], JSON.stringify(data));
                    });
            });
        });
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getModsFromAPI: async () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getModsFromAPI`);
        let serverInfos     = globalInfos.get();
        let modArray        = [];

        // Suche Mods zusammen
        if(serverInfos.servers_arr.length > 0) {
            serverInfos.servers_arr.forEach((val) => {
                if(val[1].mods !== undefined) if(val[1].mods.length > 0) {
                    if(!modArray.includes(val[1].MapModID) && val[1].MapModID !== 0) modArray.push(val[1].MapModID);
                    if(val[1].MapModID !== 0 && !modArray.includes(val[1].MapModID)) modArray.push(val[1].MapModID);
                    val[1].mods.forEach((modid) => {
                        if(!modArray.includes(modid)) modArray.push(modid);
                    })
                }
            })
        }
    },

    /**
     * Führt hintergrund aktionen von Server aus Bsp.: Automatisches Update
     * @returns {Promise<void>}
     */
    doServerBackgrounder: async () => {
        let serverInfos     = globalInfos.get();

        // Suche Mods zusammen
        if(serverInfos.servers_arr.length > 0) {
            serverInfos.servers_arr.forEach((val) => {
                // Auto Update system
                if(val[1].autoUpdate) {
                    if(Date.now() > val[1].autoUpdateNext) {
                        serverCommands.doUpdateServer(val[0], false, true, true);
                        let serverData  = new serverClass(val[0]);
                        serverData.writeConfig("autoUpdateNext", (Date.now() + val[1].autoUpdateInterval));
                        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > doServerBackgrounder > autoUpdate > ${val[0]}`);
                    }
                }

                // Auto Backup system
                if(val[1].autoBackup) {
                    if(Date.now() > val[1].autoBackupNext) {
                        serverCommands.doBackup(val[0], true);
                        let serverData  = new serverClass(val[0]);
                        serverData.writeConfig("autoBackupNext", (Date.now() + val[1].autoBackupInterval));
                        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > doServerBackgrounder > autoBackup > ${val[0]}`);
                    }
                }

                // soll der Server laufen?
                if(val[1].shouldRun && val[1].is_free && val[1].pid === 0 && !val[1].run) {
                    if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > doServerBackgrounder > Start > ${val[0]}`);
                    if(val[1].is_free) serverCommands.doStart(val[0]);
                }
            })
        }
    },

    /**
     * Liest die Konfigurationen neu ein
     * @returns {Promise<void>}
     */
    doReReadConfig: async () => {
        // Lade Konfigurationen
        let pathConfigDir    = pathMod.join(mainDir, '/app/config/');
        fs.readdirSync(pathConfigDir).forEach(item => {
            if(item.includes(".json")) {
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Reload: ${pathConfigDir + item}`);
                try {
                    if(item === "app.json") {
                        global.PANEL_CONFIG                                 = JSON.parse(fs.readFileSync(pathMod.join(pathConfigDir, item), 'utf8'));
                    }
                    else if(item === "main.json") {
                        global.PANEL_MAIN                                   = JSON.parse(fs.readFileSync(pathMod.join(pathConfigDir, item), 'utf8'));
                    }
                    else {
                        PANEL_CONFIG_OTHER[item.replaceAll(".json")]        = JSON.parse(fs.readFileSync(pathMod.join(pathConfigDir, item), 'utf8'));
                    }
                }
                catch (e) {
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m ${pathConfigDir + item} cannot Loaded`);
                    console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[31m Exit ArkAdminWIN`);
                    process.exit(1)
                }
            }
        });

        // Lade Sprachdatei(en)
        let pathLangDir    = pathMod.join(mainDir, '/lang/', PANEL_CONFIG.lang);
        fs.readdirSync(pathLangDir).forEach(item => {
            if(item.includes(".json")) {
                console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m Reload: ${pathLangDir}\\${item}`)
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
        });
    },

    /**
     * Prüft nach neuer Panel Version
     */
    backgroundUpdater: async () => {
        global.checkIsRunning = undefined;
        var options = {
            url: `https://api.github.com/repos/Kyri123/ArkAdminWin/branches/${panelBranch}`,
            headers: {
                'User-Agent': `ArkAdminWIN-Server AutoUpdater :: FROM: ${ip.address()}`
            },
            json: true
        };

        req.get(options, (err, res, api) => {
            if (err) {
                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[91m${PANEL_LANG.updaterLOG.conErr}`);
            } else if (res.statusCode === 200) {
                // Prüfe SHA mit API
                if(!globalUtil.safeFileExsistsSync([mainDir, '/app/data/', 'sha.txt'])) globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], "false");
                fs.readFile(pathMod.join(mainDir, '/app/data/', 'sha.txt'), 'utf8', (err, data) => {
                    if (err === null) {
                        if (data === api.commit.sha) {
                            // kein Update
                            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[32m${PANEL_LANG.updaterLOG.isUpToDate}`);
                        } else {
                            // Update verfügbar
                            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[36m${PANEL_LANG.updaterLOG.isUpdate}`);
                            global.isUpdate = true;
                            if(checkIsRunning === undefined) {
                                // Prüfe ob alle Aufgaben abgeschlossen sind && ob der Server mit startedWithUpdater gestartet wurde
                                if(process.argv.includes("startedWithUpdater")) checkIsRunning = setInterval(() => {
                                    let ServerInfos = globalInfos.get();
                                    let isFree      = true;

                                    // gehe alle Server durch
                                    if(ServerInfos.servers_arr.length > 0) {
                                        ServerInfos.servers_arr.forEach((val) => {
                                            isFree = val[1].is_free;
                                        })
                                    }

                                    // Wenn alles Frei ist beende den Server (startet durch die CMD sofort neu mit dem Updater
                                    if(isFree) {
                                        process.exit(2);
                                    }
                                }, 5000);
                                globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], api.commit.sha);
                            }
                            globalUtil.safeFileSaveSync([mainDir, '/app/data/', 'sha.txt'], api.commit.sha);
                        }
                    } else {
                        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[91m${PANEL_LANG.updaterLOG.noSha}`);
                    }
                });
            } else {
                // wenn keine verbindung zu Github-API besteht
                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[91m${PANEL_LANG.updaterLOG.conErr}`);
            }
        });
    }
}