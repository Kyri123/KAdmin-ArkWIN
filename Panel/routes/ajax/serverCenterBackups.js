/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWINWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWINWIN
 * *******************************************************************************************
 */

const serverCmd         = require('./../../app/src/background/server/cmd');
const express           = require('express')
const router            = express.Router()
const globalinfos       = require('./../../app/src/global_infos');
const serverUtilInfos   = require('./../../app/src/util_server/infos');
const serverCommands    = require('./../../app/src/background/server/commands');
const fs                = require('fs');

router.route('/')

    .post((req,res)=>{
        let POST            = req.body;

        if(POST.remove !== undefined) {
            let serverCFG   = serverUtilInfos.getConfig(POST.server);
            let success     = false;
            try {
                fs.rmSync(`${serverCFG.pathBackup}\\${POST.file}`);
                success = true;
            }
            catch (e) {
                if(debug) console.log(e);
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(success ? 1012 : 3).replace("{file}", POST.file)
                })
            });
        }

        if(POST.playin !== undefined) {
            let success     = false;
            let serverCFG   = serverUtilInfos.getConfig(POST.server);
            let serverINFO  = serverUtilInfos.getServerInfos(POST.server);

            if(serverCFG.server === undefined) {
                if(fs.existsSync(`${serverCFG.path}\\ShooterGame\\Saved`))  fs.rmSync(`${serverCFG.path}\\ShooterGame\\Saved`, {recursive: true});
                if(!fs.existsSync(`${serverCFG.path}\\ShooterGame\\Saved`)) fs.mkdirSync(`${serverCFG.path}\\ShooterGame\\Saved`, {recursive: true});
                if(fs.existsSync(`${serverCFG.pathBackup}\\${POST.file}`) && serverINFO.pid === 0) {
                    serverCmd.runCMD(`powershell -command "Expand-Archive -Force -LiteralPath '${serverCFG.pathBackup}\\${POST.file}' -DestinationPath '${serverCFG.path}\\ShooterGame\\Saved'"`)
                    success = true;
                }
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(success ? 1013 : 3).replace("{file}", POST.file)
                })
            });
        }


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