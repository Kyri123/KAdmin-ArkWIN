/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const cmd           = require('node-cmd');
const fs            = require('fs');


module.exports = {
    /**
     * Führt steamCMD Command aus
     * @param {string} command CMD command
     * @param {boolean} doLog soll gelogt werden?
     * @param {string} doFile Pfad zum Log
     * @param {boolean} useCMDWindow Soll ein Fenster geöffnet werden oder nicht
     * @returns {boolean}
     */
    runCMD: (command, doLog = false, logFile = '', useCMDWindow = true) => {
        let steamCMDPath    = `${PANEL_CONFIG.steamCMDRoot}\\steamcmd.exe`;
        if(fs.existsSync(steamCMDPath)) {
            let doThis = useCMDWindow ?
                `start ${steamCMDPath} +login anonymous ${command} +exit${!doLog ? '' : ` > ${logFile}`}` :
                `${steamCMDPath} +login anonymous ${command} +exit${!doLog ? '' : ` > ${logFile}`}`;
            console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runSteamCMD > ${doThis}`);
            cmd.run(doThis);
            return true;
        }
        return false;
    },
}