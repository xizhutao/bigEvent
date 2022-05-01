$(function () {
  // 点击切换到注册界面
  $("#toggleLogin").on("click", function () {
    $(".toggleLogin").hide();
    $(".toggleReg").show();
  });
  // 点击切换到登录界面
  $("#toggleReg").on("click", function () {
    $(".toggleLogin").show();
    $(".toggleReg").hide();
  });
  //自定义校验规则
  let form = layui.form; //用layui对象获取form元素；
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6~12位，且不能有空格"],
    repwd: function (value) {
      let pwd = $("#form_login [name=password]").val();
      if (pwd !== value) return "两次输入的密码不一致";
    },
  });
  //侦听注册表单提交事件
  let layer = layui.layer;
  $("#form_login").on("submit", function (e) {
    e.preventDefault();
    let data = {
      username: $("#form_login [name=username]").val(),
      password: $("#form_login [name=password]").val(),
    };
    $.post("/api/reguser", data, function (res) {
      console.log(res.status);
      if (res.status != 0) {
        return console.log(layer.msg(res.message));
      } else {
        layer.msg("注册成功请登录");
      }
      $("#toggleLogin").click();
    });
  });
  //侦听登录表单提交事件
  $("#form_reg").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status != 0) {
          layer.msg("登录失败");
        } else {
          layer.msg("登录成功");
          localStorage.setItem("token", res.token); //将token数据保存到本地存储
          //跳转主页
          location.href = "./index.html";
        }
      },
    });
  });
});
