/*
 *@ 高京
 *@ 20150824
 *@ 全局配置文件，添加属性的话，请先确认没有功能类同的属性存在
 */
var express = require("express");
var multer = require("multer");
var func = require("./functions.js");
var uuid = require('node-uuid');
var config = require('./config.js');
var fs = require('fs'); //文件操作模块，updateMember用



exports.session_secret = "1z4d7r2t5h8m3k6o8a4z5e1g7f5u3a0y"; //session密钥

// exports.cookieName_Member = "TouRongQuan2015_Member"; //登录用的cookie名称
// exports.cookies_key = [2, 5, 6, 8, 9, 10, 11, 15, 16, 17, 18, 19, 20, 22, 25, 29]; //从cookies中取出密码的16位秘钥数组(内部值不能大于32,且从小到大排序)
// exports.cookies_str = "6a8g6k7w2b9h1n8v6a8g6k7w2b9h1n8v"; //定义在cookies中为密码加密的32位随机变量

// exports.ImageDomain = "http://qingfeng.65276588.cn:80"; //数据库中读取的图片的域名前缀  (正式环境)
// exports.host = "qingfeng.65276588.cn"; //接口调用主机地址(正式环境)
// exports.port = 80; //端口号

exports.ImageDomain = "http://192.168.1.58:8130"; //数据库中读取的图片的域名前缀 (测试环境)
exports.host = "192.168.1.58"; //测试环境
exports.port = 8130; //端口号


// 访问接口获得数据方法
/*
    callback:function(err, result)，err===null时为request正常;
    Json_Select: [{
        "cache": 缓存obj，如不需缓存，传null。如需使用上下级连带数据，不要使用缓存。
        "type": "Article",
        "act": "Select_List",
        "para": {
            "params": {
                见wf文档
            },
            "pages": {
                见wf文档
            }
        }
    },
    {}];
    query: req.query;
    validate_k: 1(默认)-签名认证 2-adminUsers的Token认证;
    valid_token_obj:
        validate_k=2时:
        {
            "Auser": "topu.net",
            "token": "0eff33c8631a4b69196a11b6db065b380a5d22c0"
        }
*/
exports.getDataFromRestFul = function(callback, Json_Select, query, validate_k, valid_token_obj) {
    validate_k = validate_k || "1";
    validate_token_obj = valid_token_obj || "";
    query = func.transParameters(query, "");

    // 接口地址
    var RestFul_url = "http://" + config.host + ":" + config.port + "/Handler/Handlers.ashx?" + query;

    // 成功回调
    var finish_deal = function(err, result) {
        callback(err, result);
    };

    var i = 0,
        j = 0,
        len = Json_Select.length,
        cache_obj = null,
        cache_result = [],
        Json_Select_Result = [],
        result = [];

    // 遍历Json_Select，判断缓存，生成签名，组织para
    for (; i < len; i++) {
        cache_obj = Json_Select[i].cache;

        // 清掉cache
        Json_Select[i].cache = "";

        // 如使用缓存且有缓存，则记录缓存数据并跳过
        if (typeof cache_obj === "object" && cache_obj !== null) {
            cache_result[i] = cache_obj;
            continue;
        }
        // 生成签名
        Json_Select[i].para.sign_valid = func.CreateTopuSignatureSync(Json_Select[i].para.params);

        // 拼接最终的查询条件
        Json_Select_Result[j++] = Json_Select[i];
    }

    if (j === 0) { // 无需调用，全部使用缓存
        i = 0;
        len = cache_result.length;
        for (; i < len; i++) {
            result[i] = cache_result[i];
        }
        finish_deal(null, result);
    } else { // 调用接口

        // 调接口参数
        var ajax_para = {
            "validate_k": validate_k,
            "adminUsers": valid_token_obj,
            "params": Json_Select_Result
        };

        var opt = {
            url: RestFul_url,
            method: "post_json",
            PostData: ajax_para
        };

        func.Request(opt, function(data) {

            var i = 0,
                j = 0,
                len = Json_Select.length;

            for (; i < len; i++) {
                if (cache_result[i] === null || cache_result[i] === "" || cache_result[i] === undefined) {
                    result[i] = data.result[j++];
                } else {
                    result[i] = cache_result[i];
                }
            }

            finish_deal(null, result);

        }, function(err) {
            finish_deal(err);
        });
    }
};


//Advertise,Init,Info缓存
exports.CacheData = {
    Advertise: null,
    Init: null,
    Info: null
};

/*
 *@ 陈斌
 *@ 20160301
 *@ 【同步】获得页面公用参数
 *@ 返回：
    {
        seo: {
            ieTitle: '',
            seoKeywords: '',
            seoDescription: ''
        }
    }
 *@ ieTitle_ex：不为空时，seo.ieTitle返回ieTitle_ex - config.CacheData.Init[0].Iinfo + " - " + config.CacheData.Init[2].Iinfo;否则返回config.CacheData.Init[0].Iinfo + " - " + config.CacheData.Init[2].Iinfo;
 *@ seoKeywords：不为空时，返回seoKeywords；否则返回config.CacheData.Init[3].Iinfo;
 *@ seoDescription：不为空时，返回seoDescription；否则返回config.CacheData.Init[4].Iinfo;
 */
exports.GetCommon = function(ieTitle_ex, seoKeywords_ex, seoDescription_ex, num) {
    var ieTitle = config.CacheData.Init.list[0].Iinfo + " - " + config.CacheData.Init.list[2].Iinfo;
    var seoKeywords = config.CacheData.Init.list[3].Iinfo;
    var seoDescription = config.CacheData.Init.list[4].Iinfo;
    var menu = num;

    //版权信息
    var copyright = config.CacheData.Info.list[0].Iinfo;

    if (ieTitle_ex !== undefined && ieTitle_ex !== "")
        ieTitle = ieTitle_ex + " - " + ieTitle;
    if (seoKeywords_ex !== undefined && seoKeywords_ex !== "")
        seoKeywords = seoKeywords_ex;
    if (seoDescription_ex !== undefined && seoDescription_ex !== "")
        seoDescription = seoDescription_ex;

    return {
        seo: {
            ieTitle: ieTitle,
            seoKeywords: seoKeywords,
            seoDescription: seoDescription
        },
        footer: {
            copyright: copyright
        },
        menu: {
            menu: menu
        }
    };
};


/*
 *@ 高京
 *@ 20150911
 *@【同步】设定multer上传目录及规则
 */
exports.multer_diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "UploadFile/temp/");
    },
    filename: function(req, file, cb) {
        var ext = func.GetExtension(file.originalname);
        // var d = new Date().toLocaleDateString().replace(/-/g, "");
        // var r = func.CreateRandomStr(10, 1);
        // cb(null, d + "_" + r + "." + ext);
        var filename = uuid.v4();
        cb(null, filename + "." + ext);
    }
});
/*
 *@高京
 *@20150911
 *@【同步】设定multer文件过滤
 */
exports.multer_fileFilter = function(req, file, cb) {
    var ext = func.GetExtension(file.originalname).toLowerCase();
    if (ext == "jpg" || ext == "jpeg" || ext == "gif" || ext == "png" || ext == "bmp") {
        cb(null, true);
    } else {
        cb(null, false);
    }

};


/*
 *@ 陈斌
 *@ 20150722
 *@ 【异步】更新Advertise,Init,Info
 */
exports.updateCacheData = function(callback_success) {

    var Json_Select = [{
        "cache": config.CacheData.Advertise,
        "type": "Advertise",
        "act": "Select_List",
        "para": {
            "params": {
                "s_Aid": "",
                "s_Total_parameter": "Aid,Atitle,Url,Pic1"
            }
        }
    }, {
        "cache": config.CacheData.Init,
        "type": "Init",
        "act": "Select_List",
        "para": {
            "params": {
                "s_not_Iid": ""
            }
        }
    }, {
        "cache": config.CacheData.Info,
        "type": "Info",
        "act": "Select_List",
        "para": {
            "params": {
                "s_Iid": ""
            }
        }
    }];
    config.getDataFromRestFul(function(err, data) {
        config.CacheData.Advertise = data[0];
        config.CacheData.Init = data[1];
        config.CacheData.Info = data[2];
        callback_success();
    }, Json_Select);

};
