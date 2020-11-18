/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

const express           = require('express')
const router            = express.Router()
const serverUtilInfos   = require('./../../app/src/util_server/infos');
const fs                = require('fs');

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

        // Installierte Mod entfernen
        if(POST.removeIstalled !== undefined) {
            let modID       = POST.modID;
            let serverCfg   = serverUtilInfos.getConfig(POST.cfg);
            if(serverCfg.server === undefined) {
                let success = false;
                try {
                    if(fs.existsSync(`${serverCfg.path}\\ShooterGame\\Content\\Mods\\${modID}.mod`))       fs.rmSync(`${serverCfg.path}\\ShooterGame\\Content\\Mods\\${modID}.mod`, {recursive: true})
                    if(fs.existsSync(`${serverCfg.path}\\ShooterGame\\Content\\Mods\\${modID}.modtime`))   fs.rmSync(`${serverCfg.path}\\ShooterGame\\Content\\Mods\\${modID}.modtime`, {recursive: true})
                    if(fs.existsSync(`${serverCfg.path}\\ShooterGame\\Content\\Mods\\${modID}`))           fs.rmSync(`${serverCfg.path}\\ShooterGame\\Content\\Mods\\${modID}`, {recursive: true})
                    success = true;
                }
                catch (e) {
                    if(debug) console.log(e);
                }
                res.render('ajax/json', {
                    data: JSON.stringify({
                        alert: alerter.rd(success ? 1010 : 3).replace("{modid}", modID)
                    })
                });
            }
        }

        // Mod entfernen
        if(POST.remove !== undefined) {
            let serverCfg   = serverUtilInfos.getConfig(POST.cfg);
            if(serverCfg.server === undefined) {
                let modID   = serverCfg.mods[POST.key];
                serverCfg.mods.splice(POST.key, 1);
                res.render('ajax/json', {
                    data: JSON.stringify({
                        alert: alerter.rd(serverUtilInfos.saveConfig(POST.cfg ,serverCfg) ? 1010 : 3).replace("{modid}", modID)
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
            let k           = parseInt(POST.key);
            let k1          = k + 1;
            let k_1         = k - 1;
            let modS        = mods[k];
            let modB        = 0;

            POST.up         = POST.up === "true";

            if(POST.up) {
                // up
                modB        = mods[k_1];
                mods[k_1]   = modS;
                mods[k]     = modB;
            }
            else {
                // down
                modB        = mods[k1];
                mods[k1]    = modS;
                mods[k]     = modB;
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
        if(GET.serverInfos !== undefined) {
            let serverCFG = serverUtilInfos.getConfig(GET.cfg);
            let serverInfos = serverUtilInfos.getServerInfos(GET.cfg);

            res.render('ajax/json', {
                data: JSON.stringify({serverInfos:serverInfos, serverCFG:serverCFG})
            });
        }
    })

module.exports = router;