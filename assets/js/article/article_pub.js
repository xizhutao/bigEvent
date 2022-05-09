$(function () {
  let layer = layui.layer;
  let form = layui.form;
  // 初始化富文本编辑器
  initEditor();
  initCate();
  /**
   * 1 初始化分类数据
   * 2 template()函数渲染数据
   */
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          layer.msg("初始化数据失败");
        }
        let htmlStr = template("tpl_cate", res);
        $("[name=cate_id]").html(htmlStr);
        //通知layui重新渲染页面
        form.render();
      },
    });
  }
  //实现封面裁剪
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //给选择封面按钮绑定鼠标点击事件
  $("#chooseImage_btn").on("click", function () {
    $("#file").click();
  });
  //监听上传文件表单的change事件
  $("#file").on("change", function (e) {
    //拿到用户上传的文件
    let file = e.target.files[0];
    if (file.length === 0) {
      return;
    }
    //根据选择的文件创建一个对应的URL的地址
    let newImgURL = URL.createObjectURL(file);

    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  //定义文章的发布状态
  let article_state = "已发布";
  //给存为草稿按钮绑定鼠标点击事件
  $("#draft_btn").on("click", function () {
    article_state = "草稿";
  });

  //监听表单的 submit事件
  $("#form_pub").on("submit", function (e) {
    //阻止表单默认提交行为
    e.preventDefault();
    //创建FormDate对象
    let fd = new FormData($(this)[0]);
    //将文章发布状态追加到FormData对象中;
    fd.append("state", article_state);
    // 将画布上的图片转换成文件
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //  将裁剪的图片追加到FormDate对象中
        fd.append("cover_img", blob);
        // fd.forEach(function (v, k) {
        //   console.log(k, v);
        // });
        // 发起ajax请求发布文章
        publishArticle(fd);
      });
  });
  /**
   *
   * @param {FormDate对象中保存的要提交的数据} fd
   * 功能:发布文章
   */
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("请求数据失败");
        }
        layer.msg("请求数据成功");
        location.href = "./article_list.html";
      },
    });
  }
});
