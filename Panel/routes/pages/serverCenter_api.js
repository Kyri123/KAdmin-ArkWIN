/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */

const express           = require('express')
const router            = express.Router()
const globalinfos       = require('./../../app/src/global_infos');
const serverUtilInfos   = require('./../../app/src/util_server/infos');


router.route('/')

    .all((req,res)=>{
        global.user         = userHelper.getinfos(req.session.uid);

        let sess = req.session;
        let serverName  = req.baseUrl.split('/')[2];

        // Leite zu 401 wenn Rechte nicht gesetzt sind
        if(!userHelper.hasPermissions(req.session.uid, "api/show", serverName) || !userHelper.hasPermissions(req.session.uid, "show", serverName)) {
            res.redirect("/401");
            return true;
        }

        // Die eigentl. Seite
        else {
            let resp    = "";
            let servCfg = serverUtilInfos.getConfig(serverName);

            // Render Seite
            res.render('pages/servercenter/serverCenter_backups', {
                icon                    : "fas fa-server",
                pagename                : servCfg.sessionName,
                page                    : "servercenter",
                subpage                 : "api",
                resp                    : resp,
                perm                    : userHelper.permissions(req.session.uid),
                scfg                    : servCfg,
                servinfos               : serverUtilInfos.getServerInfos(serverName),
                sinfos                  : globalinfos.get(),
                sconfig                 : serverUtilInfos.getConfig(serverName),
                serverName              : serverName,
                sercerCenterAny         : globalUtil.safeFileReadSync([mainDir, '/public/json/sites/', 'serverCenterAny.cfg.json'], true),
                sercerCenterActions     : globalUtil.safeFileReadSync([mainDir, '/public/json/sites/', 'serverCenterActions.cfg.json'], true)
            });
        }
    })

module.exports = router;