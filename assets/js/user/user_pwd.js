$(function () {
  //自定义表单验证
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    pwdlength: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    pwdcompare: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "原密码和新密码不能相同";
      }
    },
    repwd: function (value) {
      if (value !== $("[name=newPwd").val()) {
        return "两次输入的密码不一致";
      }
    },
  });
  //发起ajax请求重置表单
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg("res.message");
        layer.msg("修改密码成功");
        $(".layui-form")[0].reset();
      },
    });
  });
});
