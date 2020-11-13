/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2019-2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/master/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

getUserList();
getCodeList();
setInterval(() => {
    getUserList();
    getCodeList();
},2000)

function getUserList() {
    $.get('/ajax/userpanel', {
        getuserlist: true
    }, (data) => {
        try {
            let users       = JSON.parse(data).userlist;
            let userlist    = ``;
            let modallist   = ``;
            let htmUserList = $('#userlist');

            users.forEach((val, key) => {
                let rangIDs = JSON.parse(val.rang);
                if(key !== 0) userlist += `<tr>
                                                <td>
                                                    ${val.username}
                                                </td>
                                                <td>
                                                    <span class="text-${rangIDs.includes(1) ? "danger" : "success"}">${rangIDs.includes(1) ? vars.lang_arr.userPanel.modal.admin: vars.lang_arr.userPanel.modal.user}</span>
                                                </td>
                                                <td>
                                                    ${val.email}
                                                </td>
                                                <!--<td>
                                                    val.registerdate
                                                </td>
                                                <td>
                                                    val.lastlogin
                                                </td>-->
                                                <td class="project-actions text-right">
                                                    <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#remove${val.id}">
                                                        <i class="fas fa-trash" aria-hidden="true">
                                                        </i> ${vars.lang_arr.userPanel.remove}
                                                    </a>
                                                    
                                                    <a id="banbtn${val.id}" class="btn btn-${val.ban === 1 ? "danger" : "success"} btn-sm" href="#" onclick="toggleUser('${val.id}', this.id)">
                                                        ${val.ban === 0 ? vars.lang_arr.userPanel.banned: vars.lang_arr.userPanel.free}
                                                    </a>
                                                </td>
                                            </tr>`;

                if($(`#remove${val.id}`).html() === undefined && key !== 0) $('#modallist').append(`<form class="modal fade" method="post" action="#" id="remove${val.id}" tabindex="-1" style="display: none;" aria-hidden="true">
                                    <div class="modal-dialog modal-xl" role="document" style="max-width: 700px">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title">${vars.lang_arr.userPanel.modalDelete.title}</h5>
                                            </div>
                                
                                            <div class="modal-body">
                                                <p>${vars.lang_arr.userPanel.modalDelete.text.replace("{username}", val.username)}</p>
                                                <input name="uid" value="${val.id}" type="hidden">
                                                <input name="deleteuser" value="true" type="hidden">
                                            </div>
                                
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary" data-dismiss="modal">${vars.lang_arr.userPanel.modalDelete.cancel}</button>
                                                <button type="button" class="btn btn-danger" name="del" onclick="removeUser('#remove${val.id}')">${vars.lang_arr.userPanel.modalDelete.remove}</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>`);
            });

            if(htmUserList.html() !== userlist) htmUserList.html(userlist);
        }
        catch (e) {
            console.log(e);
        }
    })
}

function getCodeList() {
    $.get('/ajax/userpanel', {
        getcodelist: true
    }, (data) => {
        try {
            let codes       = JSON.parse(data).codelist;
            let codeList    = ``;
            let codeListID  = $('#codes');

            codes.forEach((val, key) => {
                codeList += `<tr id="code${val.id}">
                                <td style="width:5%">
                                    <span class="text-${val.rang === 1 ? "danger" : "success"}">${val.rang === 1 ? vars.lang_arr.userPanel.modal.admin: vars.lang_arr.userPanel.modal.user}</span>
                                </td>
                                <td style="width:80%">
                                    <div class="input-group">
                                        <input type="text" class="form-control rounded-0" readonly="true" value="${val.code}" id="copy${val.id}">
                                        <span class="input-group-append">
                                            <button onclick="copythis('copy${val.id}')" class="btn btn-primary btn-flat" type="button">
                                                <i class="fas fa-copy" aria-hidden="true"></i>
                                            </button>
                                            <a class="btn btn-danger" href="#" onclick="removeCode('${val.id}', '#code${val.id}')">
                                                <i class="fas fa-trash" aria-hidden="true"></i>
                                            </a>
                                        </span>
                                    </div>
                                </td>
                            </tr>`;
            });

            if(codeListID.html() !== codeList) codeListID.html(codeList);
        }
        catch (e) {
            console.log(e);
        }
    })
}

// Entferne Code
function removeCode(id, htmlID) {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, {
        removeCode  : true,
        id          : id
    }, (data) => {
        try {
            data    = JSON.parse(data);
            if(data.alert !== undefined) $('#global_resp').append(data.alert);
            if (data.remove !== undefined) {
                $(htmlID).remove();
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    return false;
}

// Create Code
function createCode() {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, $("#addserver").serialize(), (data) => {
        try {
            data    = JSON.parse(data);
            if(data.alert !== undefined) $('#global_resp').append(data.alert);
            if (data.added !== undefined) {
                getCodeList();
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    return false;
}

// Create Code
function removeUser(htmlID) {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, $(htmlID).serialize(), (data) => {
        try {
            data    = JSON.parse(data);
            if(data.alert !== undefined) $('#global_resp').append(data.alert);
            if (data.remove !== undefined) {
                $(htmlID).modal('hide').remove();
                $('.modal-backdrop').remove();
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    return false;
}


// Toggle Ban
function toggleUser(id, btnID) {
    // führe Aktion aus
    $.post(`/ajax/userpanel`, {
        toggleUser  : true,
        id          : id
    }, (data) => {
        try {
            data    = JSON.parse(data);
            console.log(btnID)
            if(data.alert !== undefined) $('#global_resp').append(data.alert);
            if (data.toggled !== undefined) {
                $('#' + btnID).html(data.ban === 0 ? vars.lang_arr.userPanel.banned: vars.lang_arr.userPanel.free).toggleClass('btn-danger', data.ban === 1).toggleClass('btn-success', data.ban === 0);
            }
        }
        catch (e) {
            console.log(e);
        }
    });
    return false;
}