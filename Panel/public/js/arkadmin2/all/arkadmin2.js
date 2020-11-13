/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

/**
 * Wandelt Stamp in String
 * @param {int} stamp Input zeit (mit MS)
 * @param {string} format "d.m.y h:min:s.ms"
 * @return {string}
 */
function convertTime(stamp = 0, format = "d.m.y h:min") {
    // nehme jetztige Zeit wenn nichts anderes angegeben ist
    if(stamp === 0) stamp = Date.now();

    // Splite Zeitstring
    let ms = new Date(stamp).toISOString().split('.')[1].replace("Z", "");
    stamp = new Date(stamp).toISOString().split('.')[0];
    let date = stamp.split('T')[0].split('-');
    let time = stamp.split('T')[1].split(':');

    // Return & Replacer
    return format
        .replace("d", date[2])
        .replace("m", date[1])
        .replace("y", date[0])
        .replace("h", time[0])
        .replace("min", time[1])
        .replace("s", time[2])
        .replace("ms", ms)
}

/**
 * Copiert aus einem input
 * @param {string} id HTML ID (Format JQUERY '#XXX')
 */
function copythis(id) {
    var txt = document.getElementById(id);
    txt.select();
    txt.setSelectionRange(0, 99999);

    // Kopiere
    document.execCommand("copy");
}