/*
	1.1.1
	js图片上传组件
	高京
	2017-04-21

	this = {
		window_height_px: 窗口高度，setStyle时获取，不监听resize,
		opt: {
            z_index: 弹层的z - index。 内容层为z_index + 1。 默认400
            useLibrary: 使用"我的图库功能"，默认 true
            LayerShow: LayerShow对象，必须有且无默认值
            JRoll: JRoll对象，必须有且无默认值
            callback_before: 执行前回调，function，无默认
            callback_error: 报错时回调，function(err)，无默认
            callback_success: 弹层成功回调,function,无默认
            callback_upload:  上传成功回调，function(filepath)，无默认
            callback_close: 关闭后回调，function，无默认
		},
		doms: {
			wrapper: 最外盒,
			tags_ul: 标签行,
			tags_li_0: 标签-图片上传,
			tags_li_1: 标签-我的图库,
			input_file: 文件域,
			button_upload_box: 上传按钮外盒
			button_upload: 上传按钮
		}
	}
*/

var js_UploadImg = {
    // 显示弹层
    show: function(opt) {
        var that = this;

        var opt_default = {
            z_index: 400, // 弹层的z - index。 内容层为z_index + 1。 默认400
            useLibrary: true, // 使用"我的图库功能"，默认 true
            LayerShow: null, // LayerShow对象，必须有且无默认值
            JRoll: null, // JRoll对象，必须有且无默认值
            callback_before: null, // 执行前回调，function，无默认
            callback_error: null, // 报错时回调，function(err)，无默认
            callback_success: null, // 弹层成功回调，function，无默认
            callback_upload: null, // 上传成功回调，function(filepath)，无默认
            callback_close: null // 关闭后回调，function，无默认
        };
        that.opt = $.extend(opt_default, opt);

        // 创建dom
        if (!that.doms) {
            that.create_dom.apply(that);
        }

        // 弹层
        var layershow = new that.opt.LayerShow();

        // 显示
        var _opt = {
            z_index: that.opt.z_index,
            showKind: 2,
            info_content: that.doms.wrapper.html(),
            // info_box_width_per: showKind = 2 时有效， 内容盒宽度百分比。 默认80
            // info_box_height_per: showKind = 2 时有效， 内容盒高度百分比。 默认90
            // info_box_radius: showKind = 2 时有效， 内容盒是否圆角。 默认true
            // info_box_bg: showKind = 2 时有效， 内容盒背景。 默认 "#ffffff"
            info_box_padding_px: 0, // showKind = 2 时有效， 内容盒padding。 默认20
            // info_box_fontSize: showKind = 2 时有效， 内容盒字体大小。 默认 "14px"
            // info_box_fontColor: showKind = 2 时有效， 内容盒字体颜色。 默认 "#333"
            // info_box_lineHeight: showKind = 2 时有效， 内容盒行间距。 默认 "30px"
            // info_box_use_JRoll: showKind = 2 时有效， 内容盒使用JRoll滚动（ 建议移动端使用， web端不用。 IE7、 8 不兼容） 如使用， 则需要依赖或引用jroll.js。 默认true
            JRoll_obj: that.opt.JRoll, // JRoll对象。 不使用JRoll做内容盒滚动， 可不传。
            // Pics_close_show: true / false。 显示关闭按钮。 默认true
            // Pics_close_path: 关闭按钮图片路径。 默认 / inc / LayerShow_close.png。
            callback_before: that.opt.callback_before, // 弹层前回调。 如显示loading层。 无默认
            callback_success: function() {

                // 设置交互样式
                that.setHoverStyle.apply(that);

                // 监听上传按钮
                that.button_upload_Listener.apply(that);

                if (typeof that.opt.callback_success === "function")
                    that.opt.callback_success();
            }, // 弹层成功———— 此时只加载了第一章图片———— 回调function(li)。 li为showKind = 1 时加载的第一且是唯一一张图片的li盒。 如关闭loading层。 无默认
            callback_close: that.opt.callback_close // 关闭弹层后的回调。 没想好如什么。 无默认
        };
        layershow.show(_opt);
    },
    // 创建dom
    create_dom: function() {
        var that = this;

        that.doms = {};

        // 最外盒
        that.doms.wrapper = $(document.createElement("div"));

        // 标签行
        that.doms.tags_ul = $(document.createElement("ul")).addClass("js_UploadImg_tags_ul").appendTo(that.doms.wrapper);

        // 标签-图片上传
        that.doms.tags_li_0 = $(document.createElement("li"));
        that.doms.tags_li_0.addClass("js_UploadImg_tags_li")
            .addClass("js_UploadImg_tags_0")
            .addClass("js_UploadImg_tags_now")
            .text("图片上传")
            .appendTo(that.doms.tags_ul);

        // 标签-我的图库
        if (that.opt.useLibrary) {
            that.doms.tags_li_1 = $(document.createElement("li"));
            that.doms.tags_li_1.addClass("js_UploadImg_tags_li")
                .addClass("js_UploadImg_tags_1")
                .text("我的图库")
                .appendTo(that.doms.tags_ul);
        }

        // 文件域
        that.doms.input_file = $(document.createElement("input"));
        that.doms.input_file.attr("type", "file")
            .addClass("js_UploadImg_input_file")
            .appendTo(that.doms.wrapper);

        // 上传按钮外盒
        that.doms.button_upload_box = $(document.createElement("div"));
        that.doms.button_upload_box.addClass("js_UploadImg_button_upload_box")
            .appendTo(that.doms.wrapper);

        // 上传按钮
        that.doms.button_upload = $(document.createElement("div"));
        that.doms.button_upload.addClass("js_UploadImg_button_upload")
            .text("上 传")
            .appendTo(that.doms.button_upload_box);

        // 继而设置样式
        that.setStyle.apply(that);
    },
    // 设置样式
    setStyle: function() {
        var that = this;

        // 获得窗口高度
        that.window_height_px = $(window).height();

        // 顶部标签
        that.doms.tags_ul.css({
            "text-align": "center",
            "list-style": "none",
            "padding": "0",
            "margin": "0",
            "border-bottom": "solid 1px #333"
        });
        that.doms.tags_ul.find("li").css({
            "box-sizing": "border-box",
            "display": "inline-block",
            "width": "50%",
            "height": "40px",
            "line-height": "40px",
            "color": "#999"
        });
        that.doms.tags_ul.find(".js_UploadImg_tags_now").css({
            "font-weight": "bold",
            "background-color": "#fafafa",
            "color": "#000"
        });
        if (that.opt.useLibrary) {
            that.doms.tags_li_1.css({
                "border-left": "solid 1px #333",
                "cursor": "pointer"
            });
        }

        // 文本域
        that.doms.input_file.css({
            "width": "40%",
            "margin-top": that.window_height_px * 0.9 * 0.3 + "px",
            "margin-left": "30%",
            "padding": "5px",
            "border": "dotted 1px #999"
        });

        // 上传按钮外盒
        that.doms.button_upload_box.css({
            "text-align": "center"
        });

        // 上传按钮
        that.doms.button_upload.css({
            "width": "100px",
            "margin-top": that.window_height_px * 0.9 * 0.3 + "px",
            "border": "solid 1px #999",
            "border-radius": "5px",
            "display": "inline-block",
            "cursor": "pointer"
        });
    },
    // 设置悬停交互样式
    setHoverStyle: function() {

        // 标签
        $(".js_UploadImg_tags_li:not(.js_UploadImg_tags_now)").unbind()
            .hover(function() {
                $(this).css("color", "#000");
            }, function() {
                $(this).css("color", "#999");
            });

        // 上传
        $(".js_UploadImg_button_upload").unbind()
            .hover(function() {
                $(this).css({
                    "color": "#fff",
                    "background-color": "#999"
                });
            }, function() {
                $(this).css({
                    "color": "#333",
                    "background-color": ""
                });
            });
    },
    // 监听上传按钮的点击
    button_upload_Listener: function() {
        var that = this;
        $(".js_UploadImg_button_upload").unbind()
            .on("click", function() {
                // 获得文件域的值
                var input_file = $(".js_UploadImg_input_file");
                var file = input_file[0].files[0] || "";

                // 判断是否为图片
                if (file === "" || !file.type.match(/^image\/.+/)) {
                    that.errorExecFunc("请选择图片");
                    return;
                }

                // ajax执行上传
                that.dealUploadImg.apply(that, [file]);
            });
    },
    // ajax执行上传
    // file: 文本域提交的文件对象
    dealUploadImg: function(file) {
        var that = this;
        if (!window.FormData) {
            that.errorExecFunc("您的浏览器不支持此操作，请使用最新版chrome、safari、firefox、360极速或ie9以上等主流浏览器访问");
            return;
        }

        var formData = new FormData();
        formData.append("img1", file);

        var xhr = new XMLHttpRequest();
        xhr.open("post", "/deal_uploadImg");
        xhr.onload = function() {
            if (typeof that.opt.callback_upload === "function")
                that.opt.callback_upload(xhr.response);
        };
        xhr.send(formData);
    },
    // 执行报错回调
    // err: 报错信息
    errorExecFunc: function(err) {
        var that = this;
        if (that.opt.callback_error)
            that.opt.callback_error(err);
    }
};

if (typeof define === "function" && define.amd) {
    define(function() {
        return js_UploadImg;
    });
}
