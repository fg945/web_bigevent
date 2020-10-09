$(function () {
    let layer = layui.layer;
    let form = layui.form;

    //#region 编辑页面初始化
    // 2. 根据Id获取文章
    function getArticle() {
        let Id = location.search.slice(4);
        $.ajax({
            type: "GET",
            url: "/my/article/" + Id,
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('获取文章失败');
                }
                // 3. 将数据填充到表单
                let data = res.data;
                form.val('form-edit', {
                    Id: data.Id,
                    title: data.title,
                    cate_id: data.cate_id,
                    content: data.content,
                });

                // 4. 初始化富文本编辑器
                initEditor();

                // 5. 初始化图片裁剪器
                let $image = $('#image');
                // 初始化显示的图片
                $image.attr('src', 'http://ajax.frontend.itheima.net' + data.cover_img);
                // 裁剪选项
                let options = {
                    aspectRatio: 400 / 280,
                    preview: '.img-preview',
                    // 初始化图片裁剪框的大小
                    autoCropArea: .98
                };
                // 初始化裁剪区域
                $image.cropper(options);
                // 6. 弹出选择文件框
                $('#btnChooseImg').on('click', function () {
                    $('#coverFile').click();
                })

                // 7. 替换裁剪区的图片
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
                });

                // 8. 设置文章的发布状态
                let art_state = '已发布';
                $('#btnSave').on('click', function () {
                    art_state = '草稿';
                });

                // 9. 获取表单数据
                $('#form_edit').on('submit', function (e) {
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
            }
        });
    }
    // 10. 发布文章的方法
    function publishAriticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/edit",
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

            }
        });
    }
    
    // 1. 初始化文章分类选项
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
                // 获取文章信息
                getArticle();
            }
        });
    }
    initCate();
    //#endregion

})