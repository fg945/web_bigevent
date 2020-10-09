/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-09-27 16:42:22
 * @LastEditTime: 2020-10-07 16:42:15
 * @LastEditors: fg
 */
$(function () {
    // 点击 “去登陆” 链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击 “去注册” 链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 利用layui实现表单验证
    let form = layui.form;

    // 自定义校验规则
    form.verify({
        username: function (value) {
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
        // 密码校验规则
        pwd: [
            /^[\S]{6,14}$/
            , '密码必须6到14位，且不能出现空格'
        ],
        rpwd: function (value) {
            let password = $('.reg-box [name="password"]').val();
            if (password != value) {
                return '两次密码不一致';
            }
        },
    });

    // 利用layui组件实现表单提交的提示
    let layer = layui.layer;

    // 提交注册表单事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 跳转到登录界面
                $('#link_login').click();
            }
        })
    })

    // 提交登录表单事件
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 将用户的身份表示存储到本地
                localStorage.setItem('token', res.token);
                console.log(res.token);
                // 跳转的后台主页
                location.href = '/index.html';
            }
        })
    })
})