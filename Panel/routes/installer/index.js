/*
 * *******************************************************************************************
 * @author:  Oliver Kaufmann (Kyri123)
 * @copyright Copyright (c) 2020, Oliver Kaufmann
 * @license MIT License (LICENSE or https://github.com/Kyri123/ArkadminWIN/blob/main/LICENSE)
 * Github: https://github.com/Kyri123/ArkadminWIN
 * *******************************************************************************************
 */

var express = require('express');
var router = express.Router();

// Login/Reg
router.use('/step/1',           require('./step_1'));                    // RegisterPage                         | Darf nicht eingeloggt sein

router.all('*',            (req, res, next) => {
    res.redirect('/step/1');
});

module.exports = router;
