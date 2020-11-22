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
const serverInfos       = require('./../../app/src/util_server/infos');
const serverCommands    = require('./../../app/src/background/server/commands');

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;
        // Erstellen eines neuen Servers
        if(POST.addserver !== undefined) {
            // Erstelle default daten & Servername
            let defaultJSON     = globalUtil.safeFileReadSync([mainDir, '/app/json/server/template/', 'default.json'], true);
            if(defaultJSON !== false) {
                let curr            = fs.readdirSync(pathMod.join(mainDir, '/app/json/server/'));
                let serverName      = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
                let serverNameJSON  = serverName + '.json';
                while (true) {
                    if(curr.includes(serverName)) {
                        serverName = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7) + '.json';
                        serverNameJSON = serverName + '.json';
                    }
                    else {
                        break;
                    }
                }

                // Schreibe Daten
                defaultJSON.path        = defaultJSON.path.replace('{SERVERNAME}', serverName).replace('{SERVROOT}', PANEL_CONFIG.servRoot);
                defaultJSON.pathLogs    = defaultJSON.pathLogs.replace('{SERVERNAME}', serverName).replace('{LOGROOT}', PANEL_CONFIG.logRoot);
                defaultJSON.pathBackup  = defaultJSON.pathBackup.replace('{SERVERNAME}', serverName).replace('{BACKUPROOT}', PANEL_CONFIG.pathBackup);
                defaultJSON.rcon        = POST.port[2];
                defaultJSON.game        = POST.port[0];
                defaultJSON.query       = POST.port[1];

                // Erstelle Server
                try {
                    let bool = globalUtil.safeFileSaveSync([mainDir, '/app/json/server/', serverNameJSON], JSON.stringify(defaultJSON)) !== false;
                    res.render('ajax/json', {
                        data: JSON.stringify({
                            added: bool,
                            alert: alerter.rd(bool ? 1002 : 3)
                        })
                    });
                }
                catch (e) {
                    if(debug) console.log(e);
                    res.render('ajax/json', {
                        data: JSON.stringify({
                            done: false,
                            alert: alerter.rd(3)
                        })
                    });
                }
            }
            else {
                if(debug) console.log(e);
                res.render('ajax/json', {
                    data: JSON.stringify({
                        done: false,
                        alert: alerter.rd(3)
                    })
                });
            }
        }


        // Erstellen eines neuen Servers
        if(POST.deleteserver !== undefined) {
            // Erstelle default daten & Servername
            let serverName              = POST.cfg;
            let serverInformationen     = serverInfos.getServerInfos(serverName);

            // fahre server runter wenn dieser noch online ist
            if(serverInformationen.pid !== 0) serverCommands.doStop(serverName, false,false);

            // lösche alle Informationen
            try {
                if (fs.existsSync(pathMod.join(mainDir, '/app/json/server/', `${serverName}.json`)))                  fs.rmSync(pathMod.join(mainDir, '/app/json/server/', `${serverName}.json`));
                if (fs.existsSync(pathMod.join(mainDir, '/public/json/server/', `${serverName}.json`)))               fs.rmSync(pathMod.join(mainDir, '/public/json/server/', `${serverName}.json`));
                if (fs.existsSync(pathMod.join(mainDir, '/public/json/serveraction/', `action_${serverName}.json`)))  fs.rmSync(pathMod.join(mainDir, '/public/json/serveraction/', `action_${serverName}.json`));

                res.render('ajax/json', {
                    data: JSON.stringify({
                        remove: true,
                        removed: serverName,
                        alert: alerter.rd(1003)
                    })
                });
            }
            catch (e) {
                if(debug) console.log(e);
                res.render('ajax/json', {
                    data: JSON.stringify({
                        done: false,
                        alert: alerter.rd(4)
                    })
                });
            }
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;
        res.render('ajax/json', {
            data: JSON.stringify({
                done: false
            })
        });
    })

module.exports = router;