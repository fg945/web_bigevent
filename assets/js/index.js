/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-06 14:21:30
 * @LastEditTime: 2020-10-06 15:44:05
 * @LastEditors: fg
 */
$(function () {
    getUserInfo();
    // 点击退出按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确认退出吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1. 清空本地存储的token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录界面
            location.href = '/login.html';
            // 关闭弹出的提示框
            layer.close(index);
        });
    });
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers 就是请求头对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg(res.mesage);
            }
            // 调用渲染用户信息方法
            renderAvatar(res.data);
        },
    });
}

// 渲染用户信息
function renderAvatar(user) {
    // 1. 获取用户的名称
    let name = user.nickname || user.username;
    // 2. 设置用户名
    $('#welcome').html('欢迎&emsp;' + name);
    // 3. 按需设置用户头像
    if (user.user_pic != null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    }
    else {
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}