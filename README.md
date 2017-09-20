# js图片上传弹层组件 v1.2.1
### 安装：npm install topunet-js-uploadimg

文件结构：
-------------

        js_UploadImg.js 放入项目文件夹jq（原生规范）或widget/lib（AMD规范）中

页面引用：
-------------

原生引用：

        1. 页面底端引用最新版 /inc/Jquery.min.js#1.x.x 或 zepto.min.js
        2. 后引用/jq/LayerShow.js#2.2+
        3. 后如需要需要“我的图库”功能，则引用/jq/WaterFall.js#1.1.7+
        4. 后引用 /jq/js_UploadImg.js

requireJS引用：
        
        1. 依赖LayerShow.js#2.2+、WaterFall.js#1.1.7+（如使用“我的图库”功能）、js_UploadImg.js和(jquery.min.js#1.x 或 zepto.min.js)，成功后返回对象js_UploadImg


功能配置及启用：
--------------

显示：

        var js_UploadImg_para = {
            z_index: 弹层的z - index。 内容层为z_index + 1。 默认400
            input_file_width_percent: 文件域的宽度（百分比）。默认40————pc端合适
            Upload_ajaxUrl: 图片上传的提交路径，无默认。表单是以mutipart/form-data的方式提交的，文件域的name为"img1"
            useLibrary: 使用"我的图库"功能，默认 true
            Library_ajaxUrl: useLibrary=true 时有效，获取我的图库的ajax地址。返回内容格式：[{imgPath:"/UploadFile/xxx/yyy.jpg",imgSummary:"yyy"},{imgPath:"/UploadFile/xxx/yyy.jpg",imgSummary:"yyy"}]
            LayerShow: LayerShow对象，必须有且无默认值
            WaterFall: WaterFall对象，useLibrary=true时必须有且无默认值
            WaterFall_item_width: 200, // 项目单元宽度。不包含列间距。默认200
            WaterFall_line_top: 20, // 行 上间距。默认20
            WaterFall_line_first_top: 10, // 第一行 上间距。默认10
            WaterFall_column_left: 10, // 列 左间距。默认10
            WaterFall_column_first_left: 10, // 第一列 左间距。默认10
            WaterFall_unit: "px", // 距离单位。"px"||"vw"。默认"px"
            callback_before: 执行前回调，function，无默认
            callback_error: 报错时回调，function(err)，无默认
            callback_success: 弹层成功回调,function,无默认
            callback_upload:  上传成功回调，function(filepath)，无默认
            callback_close: 关闭后回调，function，无默认
        };

        js_UploadImg.show(js_UploadImg_para);

关闭：
        
        js_UploadImg.close();


功能说明及注意事项：
--------------

        1. pc端支持ie8以上及chrome、safari、Firefox、360极速模式等主流浏览器。

        2. ie8、9不支持"图片上传"，支持"我的图库"。


更新记录：
--------------
v1.2.1

        增加参数：

            WaterFall_item_width: 200, // 项目单元宽度。不包含列间距。默认200
            WaterFall_line_top: 20, // 行 上间距。默认20
            WaterFall_line_first_top: 10, // 第一行 上间距。默认10
            WaterFall_column_left: 10, // 列 左间距。默认10
            WaterFall_column_first_left: 10, // 第一列 左间距。默认10
            WaterFall_unit: "px", // 距离单位。"px"||"vw"。默认"px"

        解决移动端我的图库显示问题。
        经项目考验，移动端算正式ok了。

v1.1.4

        修改移动端zepto hover()报错的bug

v1.1.3

        增加文本域宽度的设置参数。pc端可以默认（默认40%，还是很合适的）

v1.1.2

        增加获取我的图库列表时，返回对象不是JSON对象的过滤

v1.1.1

        创建项目并发布
