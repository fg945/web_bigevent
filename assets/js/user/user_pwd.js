/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-06 19:29:42
 * @LastEditTime: 2020-10-07 09:13:24
 * @LastEditors: fg
 */
$(function () {
    // 修改密码表单验证
    let form = layui.form;
    form.verify({
        // 密码校验规则
        pwd: [
            /^[\S]{6,14}$/
            , '密码必须6到14位，且不能出现空格'
        ],
        samePwd: function (value) {
            let password = $('#oldPwd').val();
            if (value == password) {
                return '新密码和原密码相同';
            }
        },
        rpwd: function (value) {
            let password = $('#newPwd').val();
            if (password != value) {
                return '两次密码不一致';
            }
        },
    });

    // 实现修改密码功能
    $('#form_pwd').on('submit', function (e) {
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                console.log(res);
                layui.layer.msg(res.message);
                // 重置表单
                $('#form_pwd')[0].reset();
            }
        });
    });
})