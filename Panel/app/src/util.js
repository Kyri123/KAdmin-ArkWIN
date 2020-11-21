/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const fs                            = require('fs')
const pathMod                       = require('path');

module.exports = {
    /**
     * Konvertiert Bytes in KB/MB/GB/TB
     * @param {int} bytes
     * @returns {string}
     */
    convertBytes: (bytes) => {
        let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "n/a";
        let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return i === 0 ? bytes + " " + sizes[i] : (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i]
    },

    /**
     *
     * Kovertiert ACF datei von Steam zu einem Array
     * @param {string} logPath Pfad zur Datei
     * @return {Promise<array|boolean>}
     */
    toAcfToArraySync: (logPath) => {
        if(fs.existsSync(logPath)) {
            let rawFile  = fs.readFileSync(logPath).toString();
            rawFile      = rawFile.replace(/\n/g, '-n-');
            rawFile      = rawFile.replace(/\r/g, '');
            rawFile      = rawFile.replace(/\t/g, '-t-');
            rawFile      = rawFile.replace(/(.*)"376030"-n-{(.*)/, `"376030"-n-{$2`); // Ark:SE DedServer
            rawFile      = rawFile.replace(/"-t--t-"/g, '":"');
            rawFile      = rawFile.replace(/-n-/g, '');
            rawFile      = rawFile.replace(/(.*)-t--t-}-t-}}(.*)/, '$1-t--t-}-t-}}');
            rawFile      = rawFile.replace(/}"/g, '},"');
            rawFile      = rawFile.replace(/"{/g, '":{');
            rawFile      = rawFile.replace(/-t-/g, '');
            rawFile      = rawFile.replace(/""/g, '","');
            rawFile      = rawFile.replace(/}"/g, '},"');
            rawFile      = rawFile.replace(/"{/g, '":{');
            rawFile      = rawFile.replace(/"description":",""pwdrequired"/g, '"pwdrequired"');
            rawFile      = rawFile.replace(/"description":",""timeupdated"/g, '"timeupdated"');
            rawFile      = rawFile.replace(/(.*)"346110":(.*)/, `"346110":$2`); // Ark:SE DedServer
            rawFile      = rawFile.replace(/(.*)"maxnumfiles":"100"}}(.*)/, `$1"maxnumfiles":"100"}}`);
            try {
                return JSON.parse(`{${rawFile}}`);
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
    },

    /**
     * Kovertiert ACF datei von Steam zu einem Array
     * @param {string} logPath Pfad zur Datei
     * @return {Promise<array|boolean>}
     */
    toAcfToArray: async (logPath) => {
        return new Promise(resolve => {
            if(fs.existsSync(logPath)) {
                let rawFile  = fs.readFileSync(logPath).toString();
                rawFile      = rawFile.replace(/\n/g, '-n-');
                rawFile      = rawFile.replace(/\r/g, '');
                rawFile      = rawFile.replace(/\t/g, '-t-');
                rawFile      = rawFile.replace(/(.*)"376030"-n-{(.*)/, `"376030"-n-{$2`); // Ark:SE DedServer
                rawFile      = rawFile.replace(/"-t--t-"/g, '":"');
                rawFile      = rawFile.replace(/-n-/g, '');
                rawFile      = rawFile.replace(/(.*)-t--t-}-t-}}(.*)/, '$1-t--t-}-t-}}');
                rawFile      = rawFile.replace(/}"/g, '},"');
                rawFile      = rawFile.replace(/"{/g, '":{');
                rawFile      = rawFile.replace(/-t-/g, '');
                rawFile      = rawFile.replace(/""/g, '","');
                rawFile      = rawFile.replace(/}"/g, '},"');
                rawFile      = rawFile.replace(/"{/g, '":{');
                rawFile      = rawFile.replace(/"description":",""pwdrequired"/g, '"pwdrequired"');
                rawFile      = rawFile.replace(/"description":",""timeupdated"/g, '"timeupdated"');
                rawFile      = rawFile.replace(/(.*)"346110":(.*)/, `"346110":$2`); // Ark:SE DedServer
                rawFile      = rawFile.replace(/(.*)"maxnumfiles":"100"}}(.*)/, `$1"maxnumfiles":"100"}}`);
                try {
                    resolve(JSON.parse(`{${rawFile}}`));
                }
                catch (e) {
                    if(debug) console.log(e);
                }
            }
            return resolve(false);
        });
    },

    /**
     * Prüft string auf unzulässige Zeichen (Pfad)
     * @param {string} Pfadname
     * @return {boolean|array}
     */
    poisonNull(string) {
        return string.indexOf('\0') === -1;
    },

    /**
     * Speichert sicher eine Datei
     * @param {string} path Pfad zur Datei
     * @param {string} filename Dateiname
     * @param {string} data Daten die Gespeichert werden sollen
     * @param {string} codierung File Codierung (Standart: utf-8)
     * @param {boolean} isServerPath es ein Serverpfad (Standart: JA)
     * @return {boolean}
     */
    safeFileSave(path, filename, data, isServerPath= true, codierung = 'utf8') {
        // Prüfe Pfad
        if(module.exports.poisonNull(path) && module.exports.poisonNull(filename)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(path, filename);
            let continueSave    = isServerPath ? (
                filename.indexOf(PANEL_CONFIG.servRoot) === 0 ||
                filename.indexOf(PANEL_CONFIG.logRoot) === 0 ||
                filename.indexOf(PANEL_CONFIG.pathBackup) === 0 ||
                filename.indexOf(PANEL_CONFIG.steamCMDRoot) === 0
            ) : true;

            if(continueSave === true) {
                // Datei Speichern
                try {
                    fs.writeFileSync(filePath, data, codierung);
                    return true;
                }
                catch (e) {
                    if(debug) console.log(e); console.log(e);
                }
            }
        }
        return false;
    },

    /**
     * Speichert sicher eine Datei
     * @param {string} sql SQL abfrage
     * @return {boolean|array}
     */
    saveSendSQLSync(sql) {
        let args = [].slice.call(arguments).slice(1);

        // Variablien escape etc.
        if(args.length > 0) {
            sql = mysql.format(sql, args);
        }

        try {
            // Abfrage senden
            return synccon.query(sql);
        }
        catch (e) {
            if(debug) console.log(e);
        }
        return false;
    }
}