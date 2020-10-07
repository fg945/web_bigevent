/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-07 09:16:54
 * @LastEditTime: 2020-10-07 11:43:30
 * @LastEditors: fg
 */
$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image');
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview',
    };

    // 1.3 创建裁剪区域
    $image.cropper(options);

    // 点击选择文件
    $('#btnChooseImg').on('click', function () {
        $('#file').click();
    })

    // 上传头像文件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        let fileList = e.target.files;
        if (fileList.length == 0) {
            return layui.layer.msg('请选择照片');
        }
        // 获取用户选择文件的路径
        let newImgUrl = URL.createObjectURL(fileList[0]);
        // 销毁旧的裁剪区，重新设置图片路径，重新初始化裁剪区
        $image.cropper('destroy').attr('src', newImgUrl).cropper(options);
    })

    // 确定上传头像
    $('#btnUpload').on('click', function () {
        // 1. 拿到用户裁剪之后的图片
        let dataURL = $image.cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        }).toDataURL('image/png');

        // 2. 将图片上传的服务器
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: { avatar: dataURL },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                // 重新渲染用户头像
                window.parent.getUserInfo();
            }
        });
    })
})