/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */

const serverCmd         = require('./../../app/src/background/server/cmd');
const express           = require('express')
const router            = express.Router()
const globalinfos       = require('./../../app/src/global_infos');
const serverUtilInfos   = require('./../../app/src/util_server/infos');
const serverCommands    = require('./../../app/src/background/server/commands');

router.route('/')

    .post((req,res)=>{
        let POST            = req.body;

        if(POST.remove !== undefined && userHelper.hasPermissions(req.session.uid, "backups/remove", POST.server)) {
            let serverCFG   = serverUtilInfos.getConfig(POST.server);
            let success     = false;
            try {
                if(globalUtil.poisonNull(POST.file)) {
                    globalUtil.safeFileRmSync([serverCFG.pathBackup, POST.file]);
                    success = true;
                }
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

        if(POST.playin !== undefined && userHelper.hasPermissions(req.session.uid, "backups/playin", POST.server)) {
            let success     = false;
            let serverCFG   = serverUtilInfos.getConfig(POST.server);
            let serverINFO  = serverUtilInfos.getServerInfos(POST.server);

            if(serverCFG.server === undefined) {
                let savePath    = pathMod.join(serverCFG.path, '\\ShooterGame\\Saved');
                if(globalUtil.safeFileExsistsSync([savePath]))  globalUtil.safeFileRmSync([savePath]);
                if(!globalUtil.safeFileExsistsSync([savePath])) globalUtil.safeFileMkdirSync([savePath]);
                if(globalUtil.safeFileExsistsSync([savePath]) && serverINFO.pid === 0) {
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

        // Wenn keine Rechte zum abruf
        if(!userHelper.hasPermissions(req.session.uid, "show", GET.server) || !userHelper.hasPermissions(req.session.uid, "backups/show", GET.server)) return true;

        // GET serverInfos
        if(GET.getDir !== undefined && GET.server !== undefined) {
            if(globalUtil.safeFileExsistsSync([serverUtilInfos.getConfig(GET.server).pathBackup])) res.render('ajax/json', {
                data: JSON.stringify(fs.readdirSync(pathMod.join(serverUtilInfos.getConfig(GET.server).pathBackup)))
            });
        }
    })

module.exports = router;