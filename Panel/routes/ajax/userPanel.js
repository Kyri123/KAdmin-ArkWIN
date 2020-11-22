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
const userHelper   = require('./../../app/src/sessions/helper');

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;

        // Bannen/Entbannen
        if(POST.toggleUser !== undefined) {
            let userInfos = userHelper.getinfos(POST.id);
            userHelper.writeinfos(POST.id, "ban", userInfos.ban === 1 ? 0 : 1);

            res.render('ajax/json', {
                data: JSON.stringify({
                    toggled: true,
                    ban: userInfos.ban === 1 ? 0 : 1,
                    alert: alerter.rd(userInfos.ban === 1 ? 1004 : 1005).replace("{user}", userInfos.username)
                })
            });
        }

        // Benutzer Löschen
        if(POST.deleteuser !== undefined) {
            let userInfos = userHelper.getinfos(POST.uid);
            userHelper.removeUser(POST.uid);

            res.render('ajax/json', {
                data: JSON.stringify({
                    remove: true,
                    ban: userInfos.ban === 1 ? 0 : 1,
                    alert: alerter.rd(1006).replace("{user}", userInfos.username)
                })
            });
        }

        // Code Löschen
        if(POST.removeCode !== undefined) {
            userHelper.removeCode(POST.id);

            res.render('ajax/json', {
                data: JSON.stringify({
                    remove: true,
                    alert: alerter.rd(1007)
                })
            });
        }

        // Code Erzeugen
        if(POST.addCode !== undefined) {
            let code = userHelper.createCode(POST.rank);

            res.render('ajax/json', {
                data: JSON.stringify({
                    added: true,
                    alert: alerter.rd(1008).replace("{code}", code)
                })
            });
        }
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;

        // Userlist
        if(GET.getuserlist) res.render('ajax/json', {
            data: JSON.stringify({
                userlist: globalUtil.safeSendSQLSync('SELECT `id`, `username`, `email`, `lastlogin`, `registerdate`, `rang`, `ban` FROM ArkAdmin_users')
            })
        });

        // Codelist
        if(GET.getcodelist) res.render('ajax/json', {
            data: JSON.stringify({
                codelist: globalUtil.safeSendSQLSync('SELECT * FROM `ArkAdmin_reg_code` WHERE `used`=0')
            })
        });
    })

module.exports = router;