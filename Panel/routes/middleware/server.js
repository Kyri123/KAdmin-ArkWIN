/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */

const serverInfos    = require('./../../app/src/util_server/infos')

module.exports = {
    /**
     * Prüft ob der Server Exsistent ist (/XXX/:id)
     * @param req
     * @param res
     * @param next
     */
    isServerExsits: (req, res, next) => {
        let servername  = req.params.name;
        if(serverInfos.getConfig(servername).server !== undefined) {
            res.redirect("/home");
        }
        else {
            next();
        }
    }
}