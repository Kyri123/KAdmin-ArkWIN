/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

$.get('/ajax/serverCenterConfig' , {
    serverInis  : true,
    ini         : "GameUserSettings",
    server      : vars.cfg
}, (data) => {
    $('#GameUserSettings').text(data);
});

$.get('/ajax/serverCenterConfig' , {
    serverInis  : true,
    ini         : "Game",
    server      : vars.cfg
}, (data) => {
    $('#Game').text(data);
});

$.get('/ajax/serverCenterConfig' , {
    serverInis  : true,
    ini         : "Engine",
    server      : vars.cfg
}, (data) => {
    $('#Engine').text(data);
});

function saveCfg() {
    $.post('/ajax/serverCenterConfig' , $('#pills-server').serialize(), (data) => {
        try {
            data    = JSON.parse(data);
            if(data.alert !== undefined) $('#all_resp').append(data.alert);
        }
        catch (e) {
            console.log(e);
        }
    });
    return false;
}

function saveIni(htmlID, ini, cfg) {
    $.post('/ajax/serverCenterConfig' , {
        iniSend : ini,
        iniText : $(htmlID).val(),
        cfg     : cfg,
        sendini : true
    }, (data) => {
        try {
            data    = JSON.parse(data);
            if(data.alert !== undefined) $('#all_resp').append(data.alert);
        }
        catch (e) {
            console.log(e);
        }
    });
    return false;
}