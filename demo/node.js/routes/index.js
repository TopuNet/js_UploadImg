var router = require('express').Router();
var multer = require('multer')();
var fs = require('fs');
var async = require('async');

// 验证上传目录，没有则创建
var checkUploadDir = {

    DIRPATH: "./uploadfile/",
    // 检查目录是否存在，err为null代表存在
    checkDir: function(callback) {
        fs.stat(checkUploadDir.DIRPATH, function(err) {
            callback(null, err);
        });
    },

    // 新建目录
    mkDir: function(err, callback) {
        if (err) {
            fs.mkdir(checkUploadDir.DIRPATH, function(_err) {
                if (_err)
                    this.res.send(_err);
                else
                    callback(null);
            });
        } else
            callback(null);
    }
};

router.get("/", function(req, res) {
    res.render("index.html");
});

router.post("/deal_uploadImg", multer.single("img1"), function(req, res) {

    this.res = this;

    // 写入文件
    var writeFile = function() {
        fs.writeFile(checkUploadDir.DIRPATH + req.file.originalname, req.file.buffer, function(err) {
            if (err)
                err = "error: " + JSON.stringify(err);
            else
                err = checkUploadDir.DIRPATH + req.file.originalname;
            res.send(err);
        });
    };

    async.waterfall([
        checkUploadDir.checkDir,
        checkUploadDir.mkDir
    ], writeFile);

});

router.get("/getLibrary", function(req, res) {
    this.res = res;

    // 获得所有文件
    var getFiles = function(callback) {
        var Pics = [];
        var files = fs.readdirSync(checkUploadDir.DIRPATH);
        for (f in files) {
            if (files[f].match("(.jpg|.jpeg|.gif|.png|.bmp)"))
                Pics.push({
                    imgPath: checkUploadDir.DIRPATH + files[f],
                    imgSummary: files[f]
                });
        }

        callback(Pics);
    };

    // 输出结果
    var render = function(err, result) {
        if (err)
            res.send(JSON.stringify(err));
        else
            res.send(result);
    };

    async.waterfall([
        checkUploadDir.checkDir,
        checkUploadDir.mkDir,
        getFiles
    ], render);
});

module.exports = router;
