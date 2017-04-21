var router = require('express').Router();
var multer = require('multer')();
var fs = require('fs');
var async = require('async');

router.get("/", function(req, res) {
    res.render("index.html");
});

router.post("/deal_uploadImg", multer.single("img1"), function(req, res) {

    var dirpath = "./uploadfile/";

    // 检查目录是否存在，err为null代表存在
    var checkDir = function(callback) {
        fs.stat(dirpath, function(err) {
            var e = err;
            callback(null, err);
        });
    };

    // 新建目录
    var mkDir = function(err, callback) {
        if (err) {
            fs.mkdir(dirpath, function(err) {
                if (err)
                    res.send(err);
                else
                    callback(null);
            });
        } else
            callback(null);
    };

    // 写入文件
    var writeFile = function() {
        fs.writeFile(dirpath + req.file.originalname, req.file.buffer, function(err) {
            if (err)
                err = "error: " + JSON.stringify(err);
            else
                err = dirpath + req.file.originalname;
            res.send(err);
        });
    };

    async.waterfall([
        checkDir,
        mkDir
    ], function() {
        writeFile();
    });

});

module.exports = router;
