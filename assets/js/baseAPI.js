/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-05 10:29:22
 * @LastEditTime: 2020-10-05 10:46:20
 * @LastEditors: fg
 */
$(function () {
    // 配置ajax请求的根路径
    $.ajaxPrefilter(function (options) {
        options.url = 'http://ajax.frontend.itheima.net' + options.url;
    })
})