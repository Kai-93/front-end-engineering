var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
    /*
     见browserSync在启动文件中的files的配置
     */
    res.render('page1');
});

module.exports = router;