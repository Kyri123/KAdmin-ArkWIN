/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */
"use strict"

const express       = require('express')
const router        = express.Router()
const globalinfos   = require('./../../app/src/global_infos');
const userHelper   = require('./../../app/src/sessions/helper');

router.route('/')

    .all((req,res)=>{
        global.user         = userHelper.getinfos(req.session.uid);
        let resp        = "";

        if(!userHelper.hasPermissions(req.session.uid, "servercontrolcenter/show")) {
            res.redirect("/401");
            return true;
        }

        res.render('pages/servercontrolcenter', {
            icon            : "fas fa-server",
            pagename        : PANEL_LANG.pagename.usersettings,
            page            : "servercontrolcenter",
            resp            : resp,
            perm            : userHelper.permissions(req.session.uid),
            sinfos          : globalinfos.get(),
            new_email       : false,
            new_username    : false
        });
    })

module.exports = router;