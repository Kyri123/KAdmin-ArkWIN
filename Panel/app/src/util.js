/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const fs                            = require('fs')

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
     * Kovertiert ACF datei von Steam zu einem Array
     * @param path {string} Pfad zur Datei
     * @returns {boolean|array}
     */
    acfToArray: (path) => {
        if(fs.existsSync(path)) {
            let rawAcf  = `{${fs.readFileSync(path)}}`;
            rawAcf      = rawAcf.replace(/\n/g, '');
            rawAcf      = rawAcf.replace(/\r/g, '');
            rawAcf      = rawAcf.replace(/\t/g, '-t-');
            rawAcf      = rawAcf.replace(/"-t--t-"/g, '":"');
            rawAcf      = rawAcf.replace(/-t-/g, '');
            rawAcf      = rawAcf.replace(/""/g, '","');
            rawAcf      = rawAcf.replace(/}"/g, '},"');
            rawAcf      = rawAcf.replace(/"{/g, '":{');
            try {
                return JSON.parse(rawAcf);
            }
            catch (e) {
                if(debug) console.log(e);
            }
        }
        return false;
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
     *
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
    }
}