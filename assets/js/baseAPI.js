/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-05 10:29:22
 * @LastEditTime: 2020-10-08 11:29:18
 * @LastEditors: fg
 */
$(function () {
    // 配置ajax请求的根路径
    $.ajaxPrefilter(function (options) {
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
        // 统一为有权限的接口，设置headers请求头
        if (options.url.indexOf('/my/') != -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || '',
            };
        }

        // 全局挂载 complete 回调函数
        options.complete = function (res) {
            if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
                // 1. 清空 token
                localStorage.removeItem('token');
                // 2. 强制跳转到登录界面
                location.href = '/login.html';
            }
        }
    })


})