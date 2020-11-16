/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */
get();
setInterval(() => {
    get();
}, 10000);

function get() {
    $.get('/ajax/serverCenterAny', {
        "getserverinfos": true,
        "server": varser.cfg
    }, (server) => {
        let serverInfos = JSON.parse(server);
        $.get('/ajax/serverCenterBackups', {
            getDir          : true,
            server          : vars.cfg
        }, (server) => {
            server  = JSON.parse(server);
            let list    = ``;
            let ktime   = ``;
            let ktimes  = ``;

            server.forEach((val) => {
                if(val.includes(".zip")) {
                    let timeStamp   = val.replace(".zip", "");
                    let time        = convertTime(parseInt(timeStamp));
                    let cktime      = time.split(" ")[0];

                    if(cktime !== ktime) {
                        ktime   = cktime;
                        ktimes  = timeStamp;
                        if($(`#lc${ktimes}`).html() === undefined) $(`#backupList`).append(`
                        <li class="list-group-item rounded-0">
                            <i class="fa fa-folder pr-2" aria-hidden="true"></i> ${ktime}
                            <div class="right">
                                <button class="btn btn-sm btn-primary" data-toggle="collapse" data-target="#lc${ktimes}" aria-expanded="true"><i class="fa fa-arrow-down pr-1" aria-hidden="true"></i> <span id="lcc${ktimes}">0</span></button>
                                <span class="icon text-white">
                                    <i class="fa fa-trash" aria-hidden="true"></i>
                                </span>
                                </a>
                            </div>
                        </li>
    
                        <ul style="margin-bottom: -1px; background: rgba(0, 0, 0, 0.125);" class="collapse" id="lc${ktimes}"></ul>`);
                    }

                    if($(`#${timeStamp}`).html() === undefined) $(`#lc${ktimes}`).append(`<li class="list-group-item rounded-0" id="${timeStamp}">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td rowspan="2" class="pr-3"><i class="fas fa-file-archive text-lg" aria-hidden="true"></i></td>
                                            <td class="pl-2">${time}</td>
                                        </tr>
                                        <!--<tr>
                                            <td class="pl-2 text-sm">Dateigröße: 128 bit</td>
                                        </tr>-->
                                    </tbody>
                                </table>
                                <div class="right">
    
                                    ${serverInfos.pid === 0 ? `<a href="javascript:void();" class="btn btn-info btn-sm" data-toggle="modal" data-target="#modal00">
                                        <span class="icon text-white">
                                            <i class="fas fa-play" aria-hidden="true"></i>
                                        </span>
                                    </a>` : ""}
    
                                    <a href="javascript:void();" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#delmodal00">
                                        <span class="icon text-white">
                                            <i class="fa fa-trash" aria-hidden="true"></i>
                                        </span>
                                    </a>
                                </div>
                            </li>`);
                    $(`#lcc${ktimes}`).html($(`#lc${ktimes} li`).length);
                }
            });


            if($('#modlist').html() !== list) $('#modlist').html(list);
        });
    });
}
