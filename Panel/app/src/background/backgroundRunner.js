/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const server_util           = require('./server/util');
const server_state          = require('./server/state');
const serverCommands        = require('./server/commands');
const serverUtil            = require('./../util_server/infos');
const steamAPI              = require('./steam/steamAPI');
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
        module.exports.getAvailableVersion();                               //getAvailableVersion   > Holt verfügbare Version von SteamCMD
        module.exports.getStateFromServers();                               //getStateFromServers   > Holt Serverstatus informationen
        module.exports.getModsFromAPI();                                    //getStateFromServers   > Holt Mod Infos von SteamAPI
        module.exports.getTraffic();                                        //getTraffic            > Schreibt Traffic Infos
        module.exports.doServerBackgrounder();                              //doServerBackgrounder  > Führt Hintergrund aktionen aus wie Automatisches Updaten und Backupen
        module.exports.doReReadConfig(PANEL_MAIN.doReReadConfig);           //doReReadConfig        > Liest die Globalen Configurationen
        module.exports.backgroundUpdater();                                 //backgroundUpdater     > Schau nach Updates für das Panel
    },

    /**
     * Startet Intervall > getAvailableVersion
     */
    getAvailableVersion: async () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getAvailableVersion`);
        await server_util.getAvailableVersion();
        setInterval(() => {
            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getAvailableVersion`);
            server_util.getAvailableVersion();
        }, (PANEL_MAIN.interval.getAvailableVersion + 20000));
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getStateFromServers: async () => {
        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getStateFromServers`);
        await server_state.getStateFromServers();
        setInterval(() => {
            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getStateFromServers`);
            server_state.getStateFromServers();
        }, PANEL_MAIN.interval.getStateFromServers);
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getTraffic: async () => {
        async function getTraffic() {
            osu.cpu.usage().then (cpuPercentage => {
                let disk_path = pathMod.join(fs.existsSync(pathMod.join(PANEL_CONFIG.servRoot)) ? PANEL_CONFIG.servRoot : mainDir);
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
        }

        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getTraffic`);
        await getTraffic()
        setInterval(() => {
            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getTraffic`);
            getTraffic()
        }, PANEL_MAIN.interval.getTraffic);
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    getModsFromAPI: async () => {
        async function getModsFromAPI() {
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

            steamAPI.getModList(modArray);
        }

        if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getModsFromAPI`);
        await getModsFromAPI()
        setInterval(() => {
            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > getModsFromAPI`);
            getModsFromAPI()
        }, PANEL_MAIN.interval.getModsFromAPI);
    },

    /**
     * Führt hintergrund aktionen von Server aus Bsp.: Automatisches Update
     * @returns {Promise<void>}
     */
    doServerBackgrounder: async () => {
        async function doServerBackgrounder() {
            let serverInfos     = globalInfos.get();

            // Suche Mods zusammen
            if(serverInfos.servers_arr.length > 0) {
                serverInfos.servers_arr.forEach((val) => {
                    if(!fs.existsSync(`${val[0].pathLogs}.cmd`)) {
                        // Auto Update system
                        if(val[1].autoUpdate) {
                            if(Date.now() > val[1].autoUpdateNext && val[1].is_free) {
                                serverCommands.doUpdateServer(val[0], false, true, true);
                                serverUtil.writeConfig(val[0], "autoUpdateNext", (Date.now() + val[1].autoUpdateInterval));
                                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > doServerBackgrounder > autoUpdate > ${val[0]}`);
                            }
                        }

                        // Auto Backup system
                        if(val[1].autoBackup) {
                            if(Date.now() > val[1].autoBackupNext && val[1].is_free) {
                                serverCommands.doBackup(val[0], true);
                                serverUtil.writeConfig(val[0], "autoBackupNext", (Date.now() + val[1].autoBackupInterval));
                                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > doServerBackgrounder > autoBackup > ${val[0]}`);
                            }
                        }

                        // soll der Server laufen?
                        if(val[1].shouldRun && val[1].is_free && val[1].pid === 0 && !val[1].run) {
                            if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m run > doServerBackgrounder > Start > ${val[0]}`);
                            if(val[1].is_free) serverCommands.doStart(val[0]);
                        }
                    }
                })
            }
        }


        setInterval(() => {
            doServerBackgrounder();
        }, PANEL_MAIN.interval.doServerBackgrounder);
    },

    /**
     * Liest die Konfigurationen neu ein
     * @returns {Promise<void>}
     */
    doReReadConfig: async (time) => {
        async function doReReadConfig() {
            // Lade Konfiguration
            if(fs.existsSync(pathMod.join(mainDir, '/app/config/', 'app.json'))) {
                global.PANEL_CONFIG = globalUtil.safeFileReadSync([mainDir, '/app/config/', 'app.json'], true);
            }
            else {
                process.exit(1);
            }

            if(fs.existsSync(pathMod.join(mainDir, '/app/config/', 'main.json'))) {
                global.PANEL_MAIN = globalUtil.safeFileReadSync([mainDir, '/app/config/', 'main.json'], true);
            }
            else {
                process.exit(1);
            }

            // Lade Sprachdatei(en)
            if(fs.existsSync(pathMod.join(mainDir, '/lang/', PANEL_CONFIG.lang, 'lang.json'))) {
                global.PANEL_LANG = globalUtil.safeFileReadSync([mainDir, '/lang/', PANEL_CONFIG.lang, 'lang.json'], true);
            }
            else {
               process.exit(1);
            }

            if(fs.existsSync(pathMod.join(mainDir, '/lang/', PANEL_CONFIG.lang, 'alert.json'))) {
                global.PANEL_LANG_ALERT = globalUtil.safeFileReadSync([mainDir, '/lang/', PANEL_CONFIG.lang, 'alert.json'], true);
            }
            else {
                process.exit(1);
            }
        }

        setInterval(() => {
            doReReadConfig();
        }, time);
    },

    /**
     * Prüft nach neuer Panel Version
     */
    backgroundUpdater: async () => {
        global.checkIsRunning = undefined;
        async function backgroundUpdater() {
            var options = {
                url: `https://api.github.com/repos/Kyri123/ArkAdminWin/branches/${PANEL_MAIN.panelBranch}`,
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
                    fs.readFile(pathMod.join(mainDir, '/app/data/', 'sha.txt'), (err, data) => {
                        if (err === null) {
                            if (data === api.commit.sha) {
                                // kein Update
                                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[32m${PANEL_LANG.updaterLOG.isUpToDate}`);
                            } else {
                                // Update verfügbar
                                if(debug) console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss")}] Auto-Updater: \x1b[36m${PANEL_LANG.updaterLOG.isUpdate}`);
                                global.isUpdate = true;
                                let args = process.argv.slice(2);
                                if(args[0] !== undefined && checkIsRunning === undefined) {
                                    // Prüfe ob alle Aufgaben abgeschlossen sind && ob der Server mit startedWithUpdater gestartet wurde
                                    if(args[0] === "startedWithUpdater") checkIsRunning = setInterval(() => {
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


        backgroundUpdater();
        setInterval(() => {
            backgroundUpdater();
        }, PANEL_MAIN.interval.backgroundUpdater);
    }
}