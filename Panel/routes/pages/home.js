/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const express       = require('express')
const router        = express.Router()
const globalinfos   = require('./../../app/src/global_infos');
const helper_user   = require('./../../app/src/sessions/helper');

router.route('/')

    .get((req,res)=>{
        global.user         = helper_user.getinfos(req.session.uid);
        let resp = "";
        res.render('pages/home', {
            icon        : "fas fa-tachometer-alt",
            pagename    : PANEL_LANG.pagename.home,
            page        : "home",
            resp        : resp,
            perm        : helper_user.permissions(req.session.uid),
            sinfos      : globalinfos.get()
        });
    })

    .post((req,res)=>{
        global.user         = helper_user.getinfos(req.session.uid);
        let resp = "";
        res.render('pages/home', {
            icon        : "fas fa-tachometer-alt",
            pagename    : PANEL_LANG.pagename.home,
            page        : "home",
            resp        : resp,
            perm        : helper_user.permissions(req.session.uid),
            sinfos      : globalinfos.get()
        });
    });

module.exports = router;