/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020-2021, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const express           = require('express')
const router            = express.Router()
const serverUtilInfos   = require('./../../app/src/util_server/infos');

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

        // Speicher Server
        if(POST.saveServer !== undefined && userHelper.hasPermissions(req.session.uid, "config/arkadmin", POST.cfg)) {
            let cfg = POST.cfg

            delete POST.saveServer;
            delete POST.cfg;

            // Wandel string in
            Object.keys(POST).forEach((key) => {
                if(!isNaN(POST[key])){
                    POST[key] = parseInt(POST[key]);
                }
                else if(POST[key] === 'false'){
                    POST[key] = false;
                }
                else if(POST[key] === 'true'){
                    POST[key] = true;
                }
            });

            if(POST.opt === undefined)      POST.opt    = [];
            if(POST.flags === undefined)    POST.flags  = [];

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(serverUtilInfos.saveConfig(cfg ,POST) ? 1009 : 3).replace("{ini}", "ArkAdminWIN")
                })
            });
        }

        // Speicher Inis
        if(POST.sendini !== undefined) {
            let cfg = POST.cfg
            POST.iniSend = escape(POST.iniSend).replaceAll("/", "");

            if(!userHelper.hasPermissions(req.session.uid, `config/${POST.iniSend}`, cfg)) return true;

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(serverUtilInfos.saveIni(cfg ,POST.iniText , POST.iniSend) ? 1009 : 3).replace("{ini}", POST.iniSend + ".ini")
                })
            });
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // Wenn keine Rechte zum abruf
        if(!userHelper.hasPermissions(req.session.uid, "show", GET.server) || !userHelper.hasPermissions(req.session.uid, "config/show", GET.server)) return true;

        // GET serverInfos
        if(GET.serverInis !== undefined) {
            let serverInfos     = serverUtilInfos.getConfig(GET.server);
            let file            = globalUtil.safeFileReadSync([serverInfos.path, '\\ShooterGame\\Saved\\Config\\WindowsServer\\', `${GET.ini}.ini`]);
            let default_file    = globalUtil.safeFileReadSync([serverInfos.path, '/app/data/ini/', `${GET.ini}.ini`]);

            res.render('ajax/json', {
                data: file !== false ? file : default_file !== false ? default_file : 'failed'
            });
        }
    })

module.exports = router;