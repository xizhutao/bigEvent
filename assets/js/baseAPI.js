// // 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// // 会先调用 ajaxPrefilter 这个函数
// // 在这个函数中，可以拿到我们给Ajax提供的配置对象
// $.ajaxPrefilter(function(options) {
//   // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
//   options.url = 'http://ajax.frontend.itheima.net' + options.url
// })
//每次发起ajax请求之前都会调用这个方法，获取ajax请求配置对象
$.ajaxPrefilter(function (options) {
  //拼接根路径
  options.url = "http://www.liulongbin.top:3007" + options.url;
  // 将有权限的请求添加headers配置项
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  }
  //全局挂载complete函数
  options.complete = function (res) {
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      // 1. 强制清空 token
      localStorage.removeItem("token");
      // 2. 强制跳转到登录页面
      location.href = "./login.html";
    }
  };
});
