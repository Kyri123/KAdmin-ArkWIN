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

router.route('/')

    .post((req,res)=>{
        let POST        = req.body;
    })

    .get((req,res)=>{
        // DEFAULT AJAX
        let GET         = req.query;
        let sess        = req.session;

        // Userlist
        if(GET.getgrouplist) res.render('ajax/json', {
            data: JSON.stringify({
                grouplist: globalUtil.safeSendSQLSync('SELECT * FROM ArkAdmin_user_group')
            })
        });
    })

module.exports = router;