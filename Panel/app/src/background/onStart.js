/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const server_util           = require('./server/util');
const server_state          = require('./server/state');
const steamAPI              = require('./steam/steamAPI');
const globalInfos           = require('./../global_infos');
const si                    = require('systeminformation');
const osu                   = require('node-os-utils')
const disk                  = require('check-disk-space');
const AA_util               = require('../util');
const fs                    = require('fs');


module.exports = {
    /**
     * Startet alle Intervalle
     */
    startAll: () => {
        module.exports.removeDefaults();
    },

    /**
     * Startet Intervall > getStateFromServers
     */
    removeDefaults: async () => {
        let serverInfos     = globalInfos.get();

        // Suche Mods zusammen
        if(serverInfos.servers_arr.length > 0) {
            serverInfos.servers_arr.forEach((val) => {
               if(fs.existsSync(`${val[1].pathLogs}.cmd`)) fs.rmSync(`${val[1].pathLogs}.cmd`)
            });
        }
    },
}