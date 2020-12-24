/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const express   = require('express')
const router    = express.Router()

router.route('/')

    .all((req,res)=>{
        globalUtil.safeFileCreateSync([pathToInstallerJSON], '{"step1":1,"installed":"false"}')
        try {
            global.installerJson   = globalUtil.safeFileReadSync([pathToInstallerJSON], true);
        }
        catch (e) {
            if(debug) console.log(e);
        }

        let GET         = req.query;
        let POST        = req.body;
        let resp        = "";
        let lang        = PANEL_LANG_OTHER.installer.step1;
        let langAll     = PANEL_LANG_OTHER.installer.langAll;

        // Leite zum Schritt wenn dieser nicht 1 entspricht
        if(installerJson.step !== undefined) {
            if(parseInt(installerJson.step) <= 1) {
                res.redirect(`/step/${installerJson.step}`);
                return false;
            }
        }


















        // Lade Standartseite
        if(POST !== undefined)
            res.render('pages/login', {
                pagename    : lang.pagename,
                lang        : lang,
                langAll     : langAll,
                resp        : resp
            });
    })

module.exports = router;