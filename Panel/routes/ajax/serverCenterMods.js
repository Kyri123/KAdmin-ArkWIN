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

        // Mod entfernen
        if(POST.remove !== undefined) {
            let serverCfg   = serverUtilInfos.getConfig(POST.cfg);
            if(serverCfg.server === undefined) {
                serverCfg.mods.splice(POST.key, 1);
                res.render('ajax/json', {
                    data: JSON.stringify({
                        alert: alerter.rd(serverUtilInfos.saveConfig(POST.cfg ,serverCfg) ? 1010 : 3).replace("{ini}", POST.iniSend + ".ini")
                    })
                });
            }
        }

        // Mod Hinzufügen
        if(POST.addmod !== undefined) {
            let mods        = serverUtilInfos.getConfig(POST.cfg).mods;
            let modid       = 0;
            if(POST.data !== '' && isNaN(POST.data)) {
                let myURL   = new URL(POST.data);
                if(myURL.searchParams.get("id") !== undefined) modid = myURL.searchParams.get("id");
            }
            else if(POST.data !== '' && !isNaN(POST.data)) {
                modid       = POST.data;
            }
            modid           = parseInt(modid);

            if(modid !== 0) {
                mods.push(modid);

                mods.forEach((val, key) => {
                    mods[key] = parseInt(mods[key]);
                });

                let alertCode   = !serverUtilInfos.getConfig(POST.cfg).mods.includes(modid) ? (serverUtilInfos.writeConfig(POST.cfg, "mods", mods) ? 1011 : 3) : 5;
                res.render('ajax/json', {
                    data: JSON.stringify({
                        alert   : alerter.rd(alertCode, "", 0).replace("{modid}", modid),
                        success : alertCode === 1011
                    })
                });
            }
        }

        // Mod schieben
        if(POST.push !== undefined) {
            let mods        = serverUtilInfos.getConfig(POST.cfg).mods;
            let modS        = mods[POST.key];
            let modB        = 0;

            if(Boolean(POST.up)) {
                // up
                modB                = mods[(POST.key-1)];
                mods[(POST.key-1)]  = modS;
                mods[POST.key]      = modB;
            }
            else {
                // down
                modB                = mods[(POST.key+1)];
                mods[(POST.key+1)]  = modS;
                mods[POST.key]      = modB;
            }

            res.render('ajax/json', {
                data: JSON.stringify({
                    alert   : serverUtilInfos.writeConfig(POST.cfg, "mods", mods) ? "" : alerter.rd(3)
                })
            });
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // GET serverInfos
        if(GET.getmodlist !== undefined) {
            let serverInfos = serverUtilInfos.getConfig(GET.cfg);

            res.render('ajax/json', {
                data: JSON.stringify(serverInfos)
            });
        }
    })

module.exports = router;