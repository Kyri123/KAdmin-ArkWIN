/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const express           = require('express')
const router            = express.Router()
const globalinfos       = require('./../../app/src/global_infos');
const serverUtilInfos   = require('./../../app/src/util_server/infos');
const serverCommands    = require('./../../app/src/background/server/commands');
const fs                = require('fs');

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // GET serverInfos
        if(GET.getDir !== undefined && GET.server !== undefined) {
            if(fs.existsSync(serverUtilInfos.getConfig(GET.server).pathBackup)) res.render('ajax/json', {
                data: JSON.stringify(fs.readdirSync(serverUtilInfos.getConfig(GET.server).pathBackup))
            });
        }
    })

module.exports = router;