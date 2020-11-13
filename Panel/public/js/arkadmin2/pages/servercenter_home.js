/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */
loadActionLog();
setInterval(() => {
    loadActionLog();
}, 2000);

function loadActionLog() {
    $.get(`/json/serveraction/action_${vars.cfg}.log`)
        .done(function(data) {
            let convLog = ``;
            if(data.includes('ArkAdmin ::')) {
                let convLog = vars.lang_arr.logger.notFound;
                if($('#actionLogs').html() !== convLog) $('#actionLogs').html(convLog);
            }
            else {
                $.get(`/json/steamAPI/mods.json`)
                    .done(function(json) {
                        data.split('\n').forEach((val) => {
                            if(val !== ""){
                                let response = json.response.publishedfiledetails;
                                if(isNaN(val)) {
                                    convLog += `${val.replace("[CMD]", "<b>[CMD]</b>")}<br />`;
                                }
                                else {
                                    let i = response.find(p => p.publishedfileid == val);
                                    convLog += i.title === undefined ? `${val}<br />` : `<b>[${val}]</b> ${i.title}<br />`;
                                }
                            }
                        });
                        if($('#actionLogs').html() !== convLog) $('#actionLogs').html(convLog);
                    })
                    .fail(function() {
                        data.split('\n').forEach((val) => {
                            if(val !== ""){
                                convLog += `${val}<br />`;
                            }
                        });
                        if($('#actionLogs').html() !== convLog) $('#actionLogs').html(convLog);
                    });
            }
        })
        .fail(function() {
            let convLog = vars.lang_arr.logger.notFound;
            if($('#actionLogs').html() !== convLog) $('#actionLogs').html(convLog);
        });
}