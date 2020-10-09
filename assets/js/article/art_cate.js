/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-07 14:17:06
 * @LastEditTime: 2020-10-08 11:19:35
 * @LastEditors: fg
 */
$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 获取文章分类列表
    function initArticleList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                let htmlStr = template('tpl_tab', res);
                $('#tb').empty().html(htmlStr);
            }
        });
    }
    initArticleList();

    //#region 实现添加类别功能
    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog_add').html(),
            area: ['500px', '300px'],
        });
    });

    // 通过事件委托，为 form_add 添加提交事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('新增文章分类失败');
                }
                initArticleList();
                layer.msg('新增文章分类成功');
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }
        });
    });
    //#endregion

    //#region 实现编辑功能
    // 通过事件委托，实现编辑功能
    let indexEdit = null;
    $('#tb').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog_edit').html(),
            area: ['500px', '300px'],
        });

        let Id = $(this).attr('data-Id');
        // 根据id获取文章类别信息
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + Id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章类别信息失败');
                }
                form.val('form-edit', res.data);
            }
        });
    });

    // 通过事件委托，为 form_edit 添加提交事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('修改文章分类失败');
                }
                initArticleList();
                layer.msg('修改文章分类成功');
                // 根据索引关闭弹出层
                layer.close(indexEdit);
            }
        });
    });
    //#endregion

    //#region 实现删除功能
    $('#tb').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-Id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + Id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章分类失败');
                    }
                    layer.msg('删除文章分类成功');
                    initArticleList();
                }
            });
            layer.close(index);
        });
    });
    //#endregion

});