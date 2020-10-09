/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-09 10:13:03
 * @LastEditTime: 2020-10-09 14:05:34
 * @LastEditors: fg
 */
$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // 初始化文章分类选项
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章分类列表失败');
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl_cate', res);
                $('#cate_select').html(htmlStr);
                form.render('select', 'form-pub');
            }
        });
    }
    initCate();

    // 初始化富文本编辑器
    initEditor();

    //#region 实现选择封面功能
    // 1. 初始化图片裁剪器
    let $image = $('#image');

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 4. 弹出选择文件框
    $('#btnChooseImg').on('click', function () {
        $('#coverFile').click();
    })

    // 5. 替换裁剪区的图片
    $('#coverFile').on('change', function (e) {
        let fileList = e.target.files;
        // 判断用户是否选择了文件
        if (fileList.legtn == 0) {
            return;
        }
        // 获取用户选择文件的路径
        let newImgUrl = URL.createObjectURL(fileList[0]);
        // 销毁旧的裁剪区，重新设置图片路径，重新初始化裁剪区
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options);
    })
    //#endregion

    //#region 发表文章
    let art_state = '已发布'; // 定义文章的发布状态
    $('#btnSave').on('click', function () {
        art_state = '草稿';
    });

    // 发布文章的方法
    function publishAriticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注：如果向服务器提交的是 FormData 格式的数据
            // 需要添加以下配置项
            contentType: false,
            processData: false,
            
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章成功');

                // 发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html';
                // window.parent.$('#art_list').click();

            }
        });
    }

    // 获取表单数据
    $('#form_pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);
        // 4. 将裁减后的图片转换为文件
        $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280,
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            // 5. 将文件对象，存储到 fd 中
            fd.append('cover_img', blob);
            // 6. 发起 ajax 数据请求
            publishAriticle(fd);
        });
    });

    //#endregion

})