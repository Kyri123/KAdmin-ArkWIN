/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const BackgroundUtil        = require('./../background/server/util')
const fs                    = require('fs')


module.exports = {
    /**
     * Prüft ob der Benutzer exsistiert
     * @param {int|string} uid Benutzer ID
     * @returns {boolean}
     */
    user_exsists: (uid) => {
        let result = synccon.query(mysql.format('SELECT * FROM ArkAdmin_users WHERE `id`=?', [uid]));
        if(result.length > 0) {
            return true;
        }
        else {
            return false;
        }
    },
}