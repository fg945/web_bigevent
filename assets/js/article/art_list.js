/*
 * @charset: UTF-8
 * @Author: fg
 * @Date: 2020-10-08 11:32:16
 * @LastEditTime: 2020-10-09 15:41:49
 * @LastEditors: fg
 */
$(function () {
    // q : 查询数据的参数对象
    let q = {
        pagenum: 1, // 请求页码
        pagesize: 2, // 每页数据条数
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的状态
    };

    let layer = layui.layer;
    let form = layui.form;
    // 初始化页面
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl_tab', res);
                $('#tb').empty().html(htmlStr);

                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }
    initTable();

    // 定义补零方法
    function padZero(n) {
        return n > 9 ? n : `0${n}`;
    }
    // 定义格式化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const PUB_DATE = new Date(date);
        let y = padZero(PUB_DATE.getFullYear());
        let m = padZero(PUB_DATE.getMonth() + 1);
        let d = padZero(PUB_DATE.getDate());
        let hh = padZero(PUB_DATE.getHours());
        let mm = padZero(PUB_DATE.getMinutes());
        let ss = padZero(PUB_DATE.getSeconds());
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    }

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
                form.render('select', 'form-cate');
            }
        });
    }
    initCate();

    // 筛选文章功能
    $('#form_cate').on('submit', function (e) {
        e.preventDefault();
        q.cate_id = $('[name="cate_id"]').val();
        q.state = $('[name="state"]').val();
        initTable();
    });

    // 渲染分页的方法
    function renderPage(total) {
        let laypage = layui.laypage;
        laypage.render({
            elem: 'pager', // 分页容器
            count: total, // 请求数据的条数
            limit: q.pagesize, // 每页数据条数
            curr: q.pagenum, // 当前被选中的分页
            limits: [2, 3, 5, 10],
            prev: '<<',
            next: '>>',
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                // 更新当前页码值
                q.pagenum = obj.curr;
                // 更新每页数据条数
                q.pagesize = obj.limit;
                if (!first) {
                    initTable();
                }
            }
        })
    }

    // 实现删除功能
    $('#tb').on('click', '.btn-delete', function () {
        // 当前页数据条数 === 删除按钮的个数
        let len = $('.btn-delete').length;
        let Id = $(this).attr('data-Id');
        layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    /* 
                     * 当某一页数据被删除时，判断该页是否有剩余数据
                     * 如果有就直接调用 initTable，否则页码值减一，再调用 initTable 
                     */
                    if (len == 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    });

    //#region 实现文章编辑功能
    $('#tb').on('click', '.btn-edit', function () {
        // 获取当前的文章的Id
        let Id = $(this).attr('data-Id');
        location.href = '/article/art_edit.html?Id=' + Id;
    });
    //#endregion

})