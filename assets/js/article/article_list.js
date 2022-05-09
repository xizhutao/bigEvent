$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;

  /**
   *
   * @param {要过滤的日期} date
   * @returns 返回美化后的日期
   */
  template.defaults.imports.dataFormat = function (date) {
    let dt = new Date(date);
    let y = dt.getFullYear();
    let m = addZero(dt.getMonth() + 1);
    let d = addZero(dt.getDate());

    let h = addZero(dt.getHours());
    let mm = addZero(dt.getMinutes());
    let ss = addZero(dt.getSeconds());
    return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + ss;
  };
  /**
   *
   * @param {日期的各个位数的值} n
   * @returns 返回补零的数字
   */
  function addZero(n) {
    return n < 10 ? "0" + n : n;
  }
  //定义一个参数对象，将来用来在请求数据时使用
  let parama = {
    pagenum: 1, //默认的页码
    pagesize: 2, //每页显示几条数据
    cate_id: "", //文章的id号
    state: "", //文章发布的状态
  };
  initTable();
  /**
   * 1、获取文章列表数据
   * 2、调用template函数渲染数据
   */
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: parama,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取列表数据失败");
        }
        let strHtml = template("tpl_articlelist", res);
        $("tbody").html(strHtml);
        renderPage(res.total);
      },
    });
  }
  initCate();
  /**
   * 定义一个初始化筛选分类表单数据的函数
   */
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化分类数据失败");
        }
        let htmlStr = template("tpl_cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render(); //通知layui重新渲染一下表单；
      },
    });
  }

  //给筛选表单绑定一个 submit 事件
  $("#filter_table").on("submit", function () {
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name=state]").val();
    parama.cate_id = cate_id;
    parama.state = state;
    initTable();
  });
  /**
   *
   * @param {接收的数据的总条数} total
   * 功能: 渲染分页结构
   */
  function renderPage(total) {
    laypage.render({
      elem: $(".pageBox"),
      count: total,
      limit: parama.pagesize,
      curr: parama.pagenum,
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 4, 5, 6, 7, 8, 9, 10],
      jump: function (obj, first) {
        //将当前页的页码给pamara的pagenum属性;
        parama.pagenum = obj.curr;
        //将拿到的limt值给parama对象
        parama.pagesize = obj.limit;
        //通过first的值判断,jump回调函数是哪种方式触发;
        if (!first) {
          initTable();
        }
      },
    });
  }

  //给删除按钮不绑定鼠标点击事件(委托给tbody)
  $("tbody").on("click", ".delete_btn", function () {
    let len = $(".delete_btn").length;
    let id = $(this).attr("data_id");
    //询问是否删除数据的弹出层
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      //do something
      //发起ajax请求根据id删除数据
      $.ajax({
        method: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除数据失败");
          }
          layer.msg("删除数据成功");
          if (len === 1) {
            parama.pagenum = parama.pagenum === 1 ? 1 : parama.pagenum - 1;
          }
          initTable();
        },
      });
      layer.close(index);
    });
  });
});
