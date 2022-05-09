$(function () {
  let layer = layui.layer;
  let form = layui.form;
  getArtileList();
  /**
   * 1、发起ajax请求获取文章分类列表
   * 2、渲染到页面中
   */
  function getArtileList() {
    //发起ajax请求获取文章分类数据;
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        let str = template("template_article", res);
        $("tbody").html(str);
      },
    });
  }

  //   给添加分类按钮绑定鼠标点击事件
  let index = null;
  $("#addCate").on("click", function () {
    index = layer.open({
      type: 1,
      title: "添加文章分类",
      content: $("#add_form").html(),
      area: ["500px", "250px"],
    });
  });

  //通过代理的方式给添加表单绑定submit事件
  $("body").on("submit", "#add_cate", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $("#add_cate").serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("添加分类失败");
        }
        getArtileList();
        layer.msg("添加分类成功");
        layer.close(index);
      },
    });
  });
  //通过代理的方式给编辑按钮绑定click事件
  let indexEdit = null;
  $("tbody").on("click", ".edit_btn", function () {
    indexEdit = layer.open({
      type: 1,
      title: "修改文章分类",
      content: $("#edit_form").html(),
      area: ["500px", "250px"],
    });
    let id = $(this).attr("data-id");
    //根据id获取文章分类数据
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        form.val("edit_cate", res.data);
      },
    });
  });
  //给修改分类的弹出层绑定submit事件
  $("body").on("submit", "#edit_cate", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $("#edit_cate").serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改分类失败");
        }
        getArtileList();
        layer.msg("修改分类成功");
        layer.close(indexEdit);
      },
    });
  });

  //通过代理的方式给编辑按钮绑定click事件
  $("body").on("click", ".btn_delete", function () {
    let id = $(this).attr("deleteBtn-id");
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "GET",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除分类失败");
          }
          layer.msg("删除分类成功");
          getArtileList();
        },
      });
      layer.close(index);
    });
  });
});
