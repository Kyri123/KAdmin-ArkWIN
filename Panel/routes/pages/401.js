/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/KAdmin-ArkWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/KAdmin-ArkWIN
 * *******************************************************************************************
 */

const express       = require('express')
const router        = express.Router()

router.route('/')

    .get((req,res)=>{
        res.render('pages/401', {pagename: PANEL_LANG.pagename.err401, page: "home", resp: ""});
    })

    .post((req,res)=>{
        res.render('pages/401', {pagename: PANEL_LANG.pagename.err401, page: "home", resp: ""});
    });

module.exports = router;