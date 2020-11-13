/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const cmd           = require('node-cmd');

module.exports = {
    /**
     * Führt CMD Command aus
     * @param {string} command CMD command
     * @returns {boolean}
     */
    runCMD: (command) => {
        console.log('\x1b[33m%s\x1b[0m', `[${dateFormat(new Date(), "dd.mm.yyyy HH:MM:ss")}]\x1b[36m runCMD > ${command}`);
        cmd.run(command);
        return true;
    },
}