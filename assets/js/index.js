$(function () {
  //获取用户信息
  getUserInfo();
  //实现点击按钮退出功能
  $("#btn_Loginout").on("click", function () {
    layer.confirm("确认退出码?", { icon: 3, title: "提示" }, function (index) {
      //清除本地存储里的token值
      localStorage.removeItem("token");
      //跳转到登录界面
      location.href = "./login.html";
      //关闭提示窗口
      layer.close(index);
    });
  });
});

//定义一个获取用户信息的函数
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      }
      renderAvatar(res.data);
      console.log(res.data);
    },
  });
}
//定义一个渲染用户头像的函数
function renderAvatar(userMessage) {
  let name = user.nickname || user.username;
  //   设置欢迎文本
  $(".welcome").html("欢迎&nbsp;&nbsp" + name.substr(0, 3));
  if (userMessage.user_pic !== null) {
    //渲染用户图片头像
    $(".layui-nav-img").prop("src", userMessage.user_pic).show();
    $(".text_avatar").hide();
  } else {
    //渲染用户文本头像
    let first = name[0].toUpperCase();
    $(".text_avatar").html(first).show();
    $(".layui-nav-img").hide();
  }
}
