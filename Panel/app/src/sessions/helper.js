/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const { array_replace_recursive }   = require('locutus/php/array');
const { getServerList }             = require('./../global_infos')
const fs                            = require('fs')


module.exports = {
    /**
     * Prüft ob der Benutzer exsistiert
     * @param {int|string} uid Benutzer ID
     * @returns {boolean}
     */
    user_exsists: (uid) => {
        let sql         = `SELECT * FROM ArkAdmin_users WHERE \`id\`=?`;
        sql             = mysql.format(sql, [uid]);
        let result      = synccon.query(sql);
        if(result.length > 0) {
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * Gibt alle
     * @param {int|string} uid Benutzer ID
     * @returns {{id: number}|*}
     */
    getinfos: (uid) => {
        let sql         = `SELECT * FROM ArkAdmin_users WHERE \`id\`=?`;
        sql             = mysql.format(sql, [uid]);
        let result      = synccon.query(sql);
        if(result.length > 0) {
            return result[0];
        }
        else {
            return {"id":0};
        }
    },

    /**
     * Schreibt informationen in die Datenbank
     * @param {int|string} uid Benutzer ID
     * @param {string} field Feldname
     * @param {int|string} data Information
     * @returns {*}
     */
    writeinfos: (uid, field, data) => {
        let sql         = `UPDATE arkadmin_users SET ?? = ? WHERE \`id\` = ?`;
        sql             = mysql.format(sql, [field, data, uid]);
        return synccon.query(sql);
    },

    /**
     * Gibt den Permission array eines Users aus
     * @param {int} uid Benutzer ID
     * @returns {any|{id: number}}
     */
    permissions: (uid) => {
        let sql         = `SELECT * FROM ArkAdmin_users WHERE \`id\`=?`;
        sql             = mysql.format(sql, [uid]);
        let result      = synccon.query(sql);
        if(result.length > 0) {
            let permissions         = JSON.parse(fs.readFileSync('./app/json/permissions/default.json'));
            let groups              = JSON.parse(result[0].rang);
            let servers             = getServerList();

            for (const [key] of Object.entries(servers)) {
                try {
                    let permissions_servers = JSON.parse(fs.readFileSync('./app/json/permissions/default_server.json'));
                    permissions.server[key] = permissions_servers;
                }
                catch (e) {
                    if(debug) console.log(e);
                }
            };

            groups.forEach((val) => {
                let group_result = synccon.query(mysql.format('SELECT * FROM ArkAdmin_user_group WHERE `id`=?', [val]));
                if(group_result.length > 0) {
                    let groups_perm = JSON.parse(group_result[0].permissions);
                    permissions = array_replace_recursive(permissions, groups_perm);
                }
            });

            return permissions;
        }
        else {
            return {"id":0};
        }
    },

    /**
     *
     * @param {int} uid
     *
     */
    setLoginTime: (uid) => {
        let sql         = `UPDATE arkadmin_users SET \`lastlogin\` = ? WHERE \`id\` = ?`;
        sql             = mysql.format(sql, [Date.now(), uid]);
        return synccon.query(sql);
    },

    /**
     * Entfernt einen User
     * @param {int|string} uid Benutzer ID
     * @returns {*}
     */
    removeUser: (uid) => {
        let sql         = `DELETE FROM arkadmin_users WHERE \`id\` = ?`;
        sql             = mysql.format(sql, [uid]);
        return synccon.query(sql);
    },

    /**
     * Erzeugt einen Register Code
     * @param {int|string} rank Rang (0 === Benutzer | 1 === Admin)
     * @returns {*}
     */
    createCode: (rank) => {
        rank = parseInt(rank);
        let rnd         = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
        let sql         = `INSERT INTO arkadmin_reg_code (code, used, rang) VALUES (?, 0, ?);`;
        sql             = mysql.format(sql, [rnd, rank === 1 ? 1 : 0]);
        synccon.query(sql)
        return rnd;
    },

    /**
     * Entfernt einen Register Code
     * @param {int|string} id ID des Codes
     * @returns {*}
     */
    removeCode: (id) => {
        let sql         = `DELETE FROM arkadmin_reg_code WHERE \`id\` = ?`;
        sql             = mysql.format(sql, [id]);
        return synccon.query(sql);
    },
}