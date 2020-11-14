/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const steamCMD              = require('./../steam/steamCMD');
const util                  = require('./../../util');
const serverUtilInfos       = require('./../../util_server/infos');
const fs                    = require('fs');
const steamAPI              = require('./../steam/steamAPI')

module.exports = {
    /**
     * Gibt die Versionsnummer aus (Vom Server)
     * @param {int|string} uid Benutzer ID
     * @returns {boolean}
     */
    getCurrentVersion: (server) => {
        let servConfig = serverUtilInfos.getConfig(server);
        if(servConfig.server === undefined) {
            let serverPath          = servConfig.path;
            let manifestFile        = `${serverPath}\\steamapps\\appmanifest_${PANEL_CONFIG.appID_server}.acf`;
            let manifestArray       = util.toAcfToArraySync(manifestFile);
            return manifestArray    !== false ? manifestArray.AppState.buildid : false;
        }
        return false;
    },

    /**
     * Schreib Global die verfügbaren Versionen
     * @param {string} branch Ark Brach
     * @returns {Promise<void>}
     */
    // läuft aller 5 Min im Background
    getAvailableVersion: async () => {
        let logPath     = `${PANEL_CONFIG.steamCMDRoot}\\appcache\\infolog.log`;

        // Wandel acf to array
        util.toAcfToArray(logPath)
            .then((acfArray) => {
                // SteamCMD infoupdate
                steamCMD.runCMD(`+app_info_update 1 +app_info_print ${PANEL_CONFIG.appID_server}`, true, logPath, false);

                // schreibe Global
                global.availableVersion_public          = acfArray !== false && acfArray[PANEL_CONFIG.appID_server] !== undefined ? acfArray[PANEL_CONFIG.appID_server].depots.branches["public"].buildid : false;
                global.availableVersion_activeevent     = acfArray !== false && acfArray[PANEL_CONFIG.appID_server] !== undefined ? acfArray[PANEL_CONFIG.appID_server].depots.branches["activeevent"].buildid : false;
                fs.writeFileSync('./public/json/steamAPI/version.json', JSON.stringify({availableVersion_public:availableVersion_public,availableVersion_activeevent:availableVersion_activeevent}))
            })
    },

    /**
     * Prüft ob der Server ein Update braucht (true = brauch Update)
     * @param {string} server Server Name
     * @returns {boolean}
     */
    checkSeverUpdate: (server) => {
        let servConfig = serverUtilInfos.getConfig(server);
        if(servConfig.server === undefined && availableVersion_activeevent !== 0 && availableVersion_public !== 0) {
            return module.exports.getCurrentVersion(server) < (servConfig.branch === "activeevent" ? availableVersion_activeevent : availableVersion_public);
        }
        return false;
    },

    /**
     * Prüfe alle Mods ob diese ein Update brauchen
     * @param {string} server Server Name
     * @returns {array|boolean} mods die ein Update brauchen
     */
    checkModUpdates: (server) => {
        let servConfig = serverUtilInfos.getConfig(server);

        if(servConfig.server === undefined) {
            let modsNeedUpdate      = [];
            let workshopPath        = `${servConfig.path}\\steamapps\\workshop\\appworkshop_${PANEL_CONFIG.appID}.acf`;
            let WorkshopACF         = util.toAcfToArraySync(workshopPath);
            WorkshopACF             = WorkshopACF === false ? false : (WorkshopACF.AppWorkshop !== undefined ? (WorkshopACF.AppWorkshop.WorkshopItemsInstalled !== undefined ? WorkshopACF.AppWorkshop.WorkshopItemsInstalled : true) : true);
            let API                 = false;
            try {
                API                 = fs.existsSync('./public/json/steamAPI/mods.json') ? JSON.parse(fs.readFileSync('./public/json/steamAPI/mods.json')).response.publishedfiledetails : false;
            }
            catch (e) {
                if(debug) console.log(e);
            }

            if(servConfig.MapModID !== 0) servConfig.mods.push(MapModID);

            if(API !== false && servConfig.mods.length > 0) {
                servConfig.mods.forEach((modid) => {
                    let KEY = false;
                    API.forEach((val, key) => {
                        if(parseInt(val.publishedfileid) === parseInt(modid)) KEY = key;
                    })

                    if(KEY !== false || !fs.existsSync(`${servConfig.path}\\ShooterGame\\Content\\Mods\\${modid}`)) {
                        let API_UPDATE  = API[KEY].time_updated;
                        let ACF_UPDATE  = WorkshopACF[modid] !== undefined ? WorkshopACF[modid].timeupdated : 0;
                        if(API_UPDATE > ACF_UPDATE) modsNeedUpdate.push(modid);
                    }
                });

                return modsNeedUpdate.length > 0 ? modsNeedUpdate : false;
            }
        }

        return false;
    }
}