$(function () {
  let layer = layui.layer;
  //   1.1 获取裁剪区域的 DOM 元素
  var $image = $("#image");
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: ".img-preview",
  };
  // 1.3 创建裁剪区域
  $image.cropper(options);
  //给上传图片按钮绑定鼠标点击事件
  $("#chooseImage").on("click", () => $("#files").click());

  //给input上传表单元素绑定change事件
  $("#files").on("change", (e) => {
    let fileList = e.target.files.length;
    if (fileList === 0) {
      layer.msg("请选择图片");
    }
    //拿到用户选择的文件
    let file = e.target.files[0];
    //修改URL地址
    let newImgURL = URL.createObjectURL(file);
    //图片处理
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
    // // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // var dataURL = $image
    //   .cropper("getCroppedCanvas", {
    //     // 创建一个 Canvas 画布
    //     width: 100,
    //     height: 100,
    //   })
    //   .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
  });
  //给确认按钮绑定鼠标点击事件
  $("#confirmBtn").on("click", function () {
    //1、获取裁剪后的图片
    var dataURL = $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100,
      })
      .toDataURL("image/png"); // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    //发起ajax请求，将图片存在后台；
    $.ajax({
      method: "POST",
      url: "/my/update/avatar",
      data: { avatar: dataURL },
      success: function (res) {
        if (res.status !== 0) {
          layer.msg("保存图片成功");
        }
        window.parent.getUserInfo();
      },
    });
  });
});
