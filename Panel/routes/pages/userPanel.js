/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const express       = require('express')
const router        = express.Router()
const globalinfos   = require('./../../app/src/global_infos');
const helper_user   = require('./../../app/src/sessions/helper');

const topBtn    = `<div class="d-sm-inline-block">
                        <a href="#" class="btn btn-outline-success btn-icon-split rounded-0" data-toggle="modal" data-target="#addserver">
                            <span class="icon">
                                <i class="fas fa-plus" aria-hidden="true"></i>
                            </span>
                        </a>
                    </div>`;

router.route('/')

    .all((req,res)=>{
        global.user         = helper_user.getinfos(req.session.uid);
        let resp        = "";

        res.render('pages/userpanel', {
            icon            : "fas fa-user",
            pagename        : PANEL_LANG.pagename.userpanel,
            page            : "userpanel",
            resp            : resp,
            perm            : helper_user.permissions(req.session.uid),
            sinfos          : globalinfos.get(),
            new_email       : false,
            new_username    : false,
            topBtn          : topBtn
        });
    })

module.exports = router;