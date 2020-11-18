/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const fs            = require('fs')
const serverInfos   = require('./util_server/infos')
const { array_replace_recursive }   = require('locutus/php/array');

module.exports = {
    /**
     * Gibt eine Arrayliste aller Server wieder
     * @return {array}
     */
    getServerList: () => {
        let serverLocalPath     = `./public/json/server`;
        let dirArray            = fs.readdirSync(serverLocalPath);
        let servers             = new Array();

        dirArray.forEach((ITEM,KEY) => {
            try {
                // Serverliste
                if(fs.existsSync(`./app/json/server/${ITEM}`)){
                    ITEM = ITEM.replace(".json", '');
                    if(fs.existsSync(`${serverLocalPath}/${ITEM}.json`)) {
                        let array = JSON.parse(fs.readFileSync(`${serverLocalPath}/${ITEM}.json`));
                        array = array_replace_recursive(array, serverInfos.getServerInfos(ITEM), serverInfos.getConfig(ITEM));
                        servers[ITEM] = array;
                    }
                }
                else {
                    fs.rmSync(`./public/json/server/${ITEM}`);
                }
            }
            catch (e) {
                if(debug) console.log(e);
            }
        });

        return servers;
    },

    get: () => {
        let infos               = {};
        infos.server_data       = fs.existsSync(`./public/json/serverInfos/auslastung.json`) ? JSON.parse(fs.readFileSync(`./public/json/serverInfos/auslastung.json`)) : {};

        // Erkenne die Server
        infos.servers_arr       = Object.entries(module.exports.getServerList());

        // Zähle Server welche on/off sind
        infos.servercounter         = {};
        infos.servercounter.on      = 0;
        infos.servercounter.off     = 0;
        infos.servercounter.proc    = 0;
        infos.servercounter.total   = infos.servers_arr.length;
        infos.servers_arr.forEach((val) => {
            if(val[1].online) {
                infos.servercounter.on++;
            }
            else if(!val[1].is_free || (!val[1].online && val[1].run)) {
                infos.servercounter.proc++;
            }
            else {
                infos.servercounter.off++;
            }
        })

        return infos;
    }
}