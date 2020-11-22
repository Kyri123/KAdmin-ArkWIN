/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const steamCMD              = require('./../steam/steamCMD');
const serverUtilInfos       = require('./../../util_server/infos');

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
            let manifestArray       = globalUtil.toAcfToArraySync(manifestFile);
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
        globalUtil.toAcfToArray(logPath)
            .then((acfArray) => {
                // SteamCMD infoupdate
                steamCMD.runCMD(`+app_info_update 1 +app_info_print ${PANEL_CONFIG.appID_server}`, true, logPath, false);

                // schreibe Global
                global.availableVersion_public          = acfArray !== false && acfArray[PANEL_CONFIG.appID_server] !== undefined ? acfArray[PANEL_CONFIG.appID_server].depots.branches["public"].buildid : false;
                global.availableVersion_activeevent     = acfArray !== false && acfArray[PANEL_CONFIG.appID_server] !== undefined ? acfArray[PANEL_CONFIG.appID_server].depots.branches["activeevent"].buildid : false;
                globalUtil.safeFileSaveSync([mainDir, '/public/json/steamAPI/', 'version.json'], JSON.stringify({availableVersion_public:availableVersion_public,availableVersion_activeevent:availableVersion_activeevent}));
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
            let API                 = false;
            try {
                let json             = globalUtil.safeFileReadSync([mainDir, '/public/json/steamAPI/', 'mods.json'], true);
                API                  = json !== false ? json.response.publishedfiledetails : false;
            }
            catch (e) {
                if(debug) console.log(e);
            }

            if(servConfig.MapModID !== 0) servConfig.mods.push(servConfig.MapModID);

            if(servConfig.mods.length > 0) {
                servConfig.mods.forEach((modid) => {
                    let KEY = false;
                    if(API !== false) API.forEach((val, key) => {
                        if(parseInt(val.publishedfileid) === parseInt(modid)) KEY = key;
                    });

                    if(
                        KEY !== false &&
                        fs.existsSync(pathMod.join(servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.modtime`))
                    ) {
                        let modtime     = parseInt(globalUtil.safeFileReadSync([servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.modtime`]));
                        let API_UPDATE  = API[KEY].time_updated;
                        if(API_UPDATE > modtime) modsNeedUpdate.push(modid);
                    }
                    else if(
                        !fs.existsSync(pathMod.join(servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.mod`))      ||
                        !fs.existsSync(pathMod.join(servConfig.path, '\\ShooterGame\\Content\\Mods\\', `${modid}.modtime`))  ||
                        !fs.existsSync(pathMod.join(servConfig.path, '\\ShooterGame\\Content\\Mods\\', modid))
                    ) {
                        modsNeedUpdate.push(modid);
                    }
                });

                return modsNeedUpdate.length > 0 ? modsNeedUpdate : false;
            }
        }

        return false;
    }
}