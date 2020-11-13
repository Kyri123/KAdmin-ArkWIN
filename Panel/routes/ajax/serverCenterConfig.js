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
const serverUtilInfos   = require('./../../app/src/util_server/infos');
const fs                = require('fs');

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

        // Speicher Server
        if(POST.saveServer !== undefined) {
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

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(serverUtilInfos.saveConfig(cfg ,POST) ? 1009 : 3).replace("{ini}", "ArkAdminWIN")
                })
            });
        }

        // Speicher Inis
        if(POST.sendini !== undefined) {
            let cfg = POST.cfg

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert: alerter.rd(serverUtilInfos.saveIni(POST.cfg ,POST.iniText , POST.iniSend) ? 1009 : 3).replace("{ini}", POST.iniSend + ".ini")
                })
            });
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // GET serverInfos
        if(GET.serverInis !== undefined) {
            let serverInfos = serverUtilInfos.getConfig(GET.server);

            res.render('ajax/json', {
                data: fs.existsSync(`${serverInfos.path}\\ShooterGame\\Saved\\Config\\WindowsServer\\${GET.ini}.ini`)     ? fs.readFileSync(`${serverInfos.path}\\ShooterGame\\Saved\\Config\\WindowsServer\\${GET.ini}.ini`, 'utf-8')   : fs.readFileSync('./app/data/ini/${GET.ini}.ini', 'utf-8')
            });
        }
    })

module.exports = router;