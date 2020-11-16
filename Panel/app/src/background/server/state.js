/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

// require Module
const fs            = require('fs');
const Gamedig       = require('gamedig');
const ip            = require("ip");
const serverInfos   = require('./../../util_server/infos');
const findProcess   = require('find-process');


/**
 * Speichert Informationen in einer JSON oder in die MYSQL
 * @param {boolean} mysql_status - Soll die Daten in der Datenbankl gespeichert werden
 * @param {array} data - Daten die gespeichert werden
 * @param {string} name - Bezeichung der gespeicherten Daten (bsp server)
 * @param {array} state - Daten zusätzlich gespeichert werden sollen (array.state)
 * @param {boolean} use_state - Soll state benutzt werden?
 */
function save(data, name, state, use_state = true) {
    // Schreibe in die Datenbank zu weiterverarbeitung
    let query_lf = `SELECT * FROM \`ArkAdmin_statistiken\` WHERE \`server\` = '${name}' ORDER BY \`time\``;
    con.query(query_lf, (error, results) => {
        if(use_state) data.state = state;
        if(!error) {
            // Wenn mehr als 999 Datensätze bestehen Updaten
            if(results.length > 999) {
                var update = `UPDATE \`ArkAdmin_statistiken\` SET \`time\` = '${Math.floor(Date.now() / 1000)}', \`serverinfo_json\` = '${JSON.stringify(data)}' WHERE \`id\` = '${results[0].id}'`;
                con.query(update);
            }
            // Wenn mehr weniger 999 Datensätze bestehen Erstelle neue Datensätze
            else {
                var create = `INSERT INTO \`ArkAdmin_statistiken\` VALUES (null, '${Math.floor(Date.now() / 1000)}', '${JSON.stringify(data)}', '${name}');`;
                con.query(create);
            }
        }
    });
    fs.writeFileSync(`./public/json/server/${name}.json`, JSON.stringify(data));
}

module.exports = {
    getStateFromServers: async () => {
        let serverLocalPath     = `./app/json/server`;
        let dirArray            = fs.readdirSync(serverLocalPath);
        // Scanne Instancen
        dirArray.forEach((ITEM) => {
            // Erstelle Abfrage wenn es eine .cfg Datei ist
            if (ITEM.includes(".json")) {

                if(!fs.existsSync(`./public/json/server/`)) fs.mkdirSync(`./public/json/server/`);
                let name            = ITEM.replace(".json", "");
                let data            = serverInfos.getServerInfos(name);
                let servCFG         = serverInfos.getConfig(name);
                let serverPath      = servCFG.path;
                let serverPathLogs  = servCFG.pathLogs;

                // Lese installierte Mods
                data.installedMods  = [];
                let modPath         = `${servCFG.path}\\ShooterGame\\Content\\Mods`;
                let dirRead         = fs.existsSync(modPath) ? fs.readdirSync(modPath, { withFileTypes: true }) : [];

                if(dirRead.length > 0) {
                    dirRead.forEach((val) => {
                        if(val.isFile() && val.name !== "111111111.mod" && !isNaN(val.name.replace(".mod", ""))) data.installedMods.push(parseInt(val.name));
                    })
                }

                // Default werte
                data.aplayers       = 0;
                data.players        = 0;
                data.listening      = false;
                data.online         = false;
                data.cfg            = name;
                data.ServerMap      = servCFG.serverMap;
                data.ServerName     = servCFG.sessionName;
                data.ARKServers     = `https://arkservers.net/server/${ip.address()}:${servCFG.query}`;
                data.connect        = `steam://connect/${ip.address()}:${servCFG.query}`;
                data.is_installing  = fs.existsSync(`${serverPath}\\steamapps\\appmanifest_${PANEL_CONFIG.appID_server}.acf`);
                let exePath         = `${serverPath}\\ShooterGame\\Binaries\\Win64\\ShooterGameServer.exe`;
                data.is_installed   = fs.existsSync(`${serverPath}\\ShooterGame\\Binaries\\Win64\\ShooterGameServer.exe`);
                data.is_free        = !fs.existsSync(`${serverPathLogs}.cmd`);
                // Runing infos
                data.run            = false;
                data.pid            = 0;
                data.ppid           = 0;
                data.cmd            = "";
                data.bin            = "";
                // More data
                data.aplayers       = 0;
                data.aplayersarr    = [];
                data.ping           = 0;
                data.version        = data.version === undefined ? "" : data.version;

                findProcess('name', `${name}`)
                    .then(function (list) {
                        if (list.length) {
                            data.run    = true;
                            data.pid    = list[0].pid;
                            data.ppid   = list[0].ppid;
                            data.cmd    = list[0].cmd;
                            data.bin    = list[0].bin;

                            Gamedig.query({
                                type: 'arkse',
                                host: ip.address(),
                                port: servCFG.query
                            })
                                .then((state) => {
                                    data.players = state.maxplayers;
                                    data.aplayers = state.players.length;
                                    data.aplayersarr = state.players;
                                    data.listening = 'Yes';
                                    data.online = 'Yes';
                                    data.cfg = name;
                                    data.ServerMap = state.map;
                                    data.ServerName = state.name;
                                    data.ping = state.ping;

                                    // Hole Version
                                    var version_split = state.name.split("-")[1];
                                    version_split = version_split.replace(")", "");
                                    version_split = version_split.replace("(", "");
                                    version_split = version_split.replace(" ", "");
                                    version_split = version_split.replace("v", "");
                                    data.version = version_split;

                                    // Speichern
                                    save(data, name, state);
                                }).catch((error) => {
                                // Speichern
                                    if(error) save(data, name, {});
                                });
                        }
                        else {
                            // Speichern
                            save(data, name, {});
                        }
                    });
            }
        });
    }
};