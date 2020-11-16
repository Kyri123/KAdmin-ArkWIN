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

/**
 * @param {int}     code            Code für den Alert (lang file)
 * @param {string}  custom_style    Style="XXX"
 * @param {int}     mb              Margin-Bottom
 * @param {int}     ml              Margin-Left
 * @param {int}     mr              Margin-Right
 * @param {int}     mt              Margin-Top
 * @returns {string|undefined}      Undefined -> Code nicht vorhanden
 */
function alerter(code, custom_style = "", mb = 3, ml = 0, mr = 0, mt = 0) {
    if(alertlang[code] !== undefined) {
        let color   = code >= 1000 ? (code >= 2000 ? (code >= 3000 ? "info" : "warning") : "success") : "danger";
        let text    = alertlang[code].text;
        let title   = alertlang[code].title;
        let rnd     = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);

        return `<div class="callout callout-${color} mb-${mb} ml-${ml} mr-${mr} mt-${mt}" style="${custom_style}" id="${rnd}"><button type="button" class="close" onclick="$('#${rnd}').fadeOut()"><span aria-hidden="true">&times;</span></button><h5 class="text-${color}"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> ${title}</h5>${text}</div>`;
    }
    return undefined;
}