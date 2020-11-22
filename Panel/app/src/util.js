/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

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
            let file     = module.exports.safeFileReadSync([logPath]);
            if(file !== false) {
                let rawFile  = file.toString();
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
                let file     = module.exports.safeFileReadSync([logPath]);
                if(file !== false) {
                    let rawFile  = file.toString();
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
            }
            return resolve(false);
        });
    },

    /**
     * Prüft string auf unzulässige Zeichen (Pfad)
     * @param {string|any[]} paths Pfade
     * @return {boolean|array}
     */
    poisonNull(paths) {
        let bool = true;
        if(Array.isArray()) {
            paths.forEach((val) => {
               if(val.indexOf('\0') !== -1) bool = false;
            });
        }
        else {
            bool = paths.indexOf('\0') === -1;
        }
        return bool;
    },

    /**
     * Speichert sicher eine Datei
     * @param {string[]} paths Pfade zur Datei
     * @param {string} data Daten die Gespeichert werden sollen
     * @param {string} codierung File Codierung (Standart: utf-8)
     * @return {boolean}
     */
    safeFileSaveSync(paths, data, codierung = 'utf8') {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths);
            let continueSave    =
                filePath.indexOf(PANEL_CONFIG.servRoot) === 0 ||
                filePath.indexOf(PANEL_CONFIG.logRoot) === 0 ||
                filePath.indexOf(PANEL_CONFIG.pathBackup) === 0 ||
                filePath.indexOf(PANEL_CONFIG.steamCMDRoot) === 0 ||
                filePath.indexOf(`${mainDir}\\public`) === 0 ||
                filePath.indexOf(`${mainDir}\\app\\json`) === 0 ||
                filePath.indexOf(`${mainDir}\\app\\data`) === 0 ||
                filePath.indexOf(`${mainDir}\\app\\cmd`) === 0
            ;

            if(continueSave === true) {
                // Datei Speichern
                try {
                    if(!fs.existsSync(pathMod.dirname(filePath))) fs.mkdirSync(pathMod.dirname(filePath), {recursive: true});
                    fs.writeFileSync(filePath, data, codierung);
                    return true;
                }
                catch (e) {
                    if(debug) console.log(e);
                }
            }
        }
        return false;
    },

    /**
     * Speichert sicher eine Datei
     * @param {string[]} paths Pfade zur Datei
     * @param {boolean} json soll die Datei direkt zur JSON umgewandelt werden?
     * @param {string} codierung File Codierung (Standart: utf-8)
     * @return {boolean}
     */
    safeFileReadSync(paths, json = false, codierung = 'utf8') {
        // Prüfe Pfad
        if(module.exports.poisonNull(paths)) {
            // Lege Pfad fest
            let filePath        = pathMod.join(...paths);
            let continueSave    =
                filePath.indexOf(PANEL_CONFIG.servRoot) === 0 ||
                filePath.indexOf(PANEL_CONFIG.logRoot) === 0 ||
                filePath.indexOf(PANEL_CONFIG.pathBackup) === 0 ||
                filePath.indexOf(PANEL_CONFIG.steamCMDRoot) === 0 ||
                filePath.indexOf(mainDir) === 0 ||
                filePath.indexOf(`${mainDir}\\app\\config\\mysql.json`) !== 0
            ;

            if(continueSave === true && fs.existsSync(filePath)) {
                // Datei Speichern
                try {
                    return json ? JSON.parse(fs.readFileSync(filePath, codierung)) : fs.readFileSync(filePath, codierung);
                }
                catch (e) {
                    if(debug) console.log(e);
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
    safeSendSQLSync(sql) {
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