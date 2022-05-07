$(function () {
  let form = layui.form;
  let layer = layui.layer;
  //自定义表单验证规则
  form.verify({
    nickname: function (value) {
      if (value.length > 6) return "昵称长度必须在1~6个字符之间！";
    },
  });

  initUserInfo();
  //   定义一个初始化用户信息的函数
  function initUserInfo() {
    //发起ajax请求初始化用户信息
    $.ajax({
      url: "/my/userinfo",
      method: "GET",
      success: function (res) {
        if (res.status !== 0) return layer.msg("数据请求失败");

        //调用form.val(),快速给表单赋值
        form.val("formUserInfo", res.data);
      },
    });
  }

  //实现表单重置效果
  $("#resetBtn").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  // 监听表单的提交事件
  $(".layui-form").on("submit", function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 发起 ajax 数据请求
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败！");
        }
        layer.msg("更新用户信息成功！");
        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
      },
    });
    window.parent.getUserInfo();
  });
});
