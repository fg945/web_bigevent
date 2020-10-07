/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-06 16:42:34
 * @LastEditTime: 2020-10-06 19:22:52
 * @LastEditors: fg
 */
$(function () {
    // 修改表单验证
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 7) {
                return '昵称长度必须在1~7字符之间';
            }
        }
    });

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                // 调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        });
    }
    initUserInfo();

    // 实现重置表单数据
    $('#btnReset').on('click', function (e) {
        // 阻止默认重置表单行为
        e.preventDefault();
        initUserInfo();
    });
    
    // 实现更新用户信息功能
    $('#userInfo_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message);
                // 调用父页面中的方法，重新渲染用户信息
               window.parent.getUserInfo();
            }
        });
    });
})