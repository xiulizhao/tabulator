(function (root, factory) {
  /* CommonJS */
  if (typeof exports == "object") module.exports = factory();
  /* AMD module */
  else if (typeof define == "function" && define.amd) define(factory);

  /* 修改: 将 wwclassName 改为元素标识 */
  else root.wwclassName = factory();
}(this, function () {
  "use strict";

  /* 修改: 将 wwclassName 改为元素标识 */
  var wwclassName = /*INSBEGIN:WWCLSNAME*/
    "tabulator"
    /*INSEND:WWCLSNAME*/
    ;

  // BEGIN: 加载依赖部分
  // 无依赖资源请使用本函数
  // function loadDependence(fncallback) {
  //   if (typeof fncallback === "function") {
  //     fncallback();
  //   }
  // }

  // 有依赖资源使用本函数
  // 使用方式:
  //  - 将"插件名"设置为具体插件标识, 通常就是插件名称, 不可为中文. 如: swiper
  //  - 如libs中无该插件, 则申请添加该插件
  //  - 将"插件路径"设置为具体插件路径, 通常为js文件, 省略路径中, 开头的"/"和结尾的".js". 如: "/libs/qrcodejs/qrcode.js" 应写为 "libs/qrcodejs/qrcode"
  //  - require 函数第一个参数, 传入依赖资源数组. 通常为config中配置的`插件名`. 可能还包括css文件
  //   - css文件的格式, 以"css!"开头, 省略路径开头的"/"和路径结尾的".css". 如: "/libs/noty/lib/noty.css" 应写为 ""css!libs/noty/lib/noty""
  //  - require 函数第二个参数是个回调函数, 该函数可能会传入参数. 参数与前面数组位置对应. 如不清楚, 自行查阅 (requirejs)[http://requirejs.org/] 文档  https://unpkg.com/tabulator-tables@4.2.7/dist/js/tabulator.min.js  css!https://unpkg.com/tabulator-tables@4.2.7/dist/css/tabulator.min.css

  var loadDependence = function (fncallback) {
    // 本模板只支持一个依赖库，如果需要多个依赖库，需要改进。
    if (!window.wwload.tabulator) {
      window.wwload.tabulator = "wait";
      // requirejs.config({
      //   paths: {
      //     "插件名": "插件路径" // 示例: libs/qrcodejs/qrcode
      //   }
      // });
      require(["libs/tabulator/dist/js/tabulator.min", "css!libs/tabulator/dist/css/tabulator.min"], function (Tabulator) {
        window.wwload.tabulator = true;
        window.Tabulator = Tabulator;
        replace();
        fncallback();
      });
    } else if (window.wwload.tabulator === "wait") {
      setTimeout(function () {
        loadDependence(fncallback);
      }, 100);
    } else {
      replace();
      fncallback();
    }

    function replace() {
      loadDependence = function (fncallback) {
        fncallback();
      };
    }
  };

  // END: 加载依赖部分

  /*
  //*/


  // BEGIN: 元素处理类初始化。下方函数只在依赖被加载完毕后，执行一次。后续无论处理多少个元素，不再调用本函数。
  var init = function () {
    // 重写初始化函数
    init = function () {
      return true;
    };
    $.wwclass.addEvtinHandler(wwclassName, evtInHandler);
    $("body").append('<style>[data-wwclass="tabulator"] .dropdown-item{display: block; width: 100%; padding: .25rem 1.5rem; clear: both; font-weight: 400; color: #212529; text-align: inherit;white-space: nowrap; background-color: transparent; border: 0;}li{ list-style: none; }.dropdown-menu{padding: 5px 10px!important;</style>');
    /*如果是逻辑元素，需要监听所有新加元素的时间，请打开下方注释。与process的区别是： process传入的参数一定有wwclass，而checker是更低级的事件处理，如果依赖wwclass，则事件在这里被处理，在process也会被处理。相当于被调用了两次，因此，checker处理的内容，不要包括wwclass，实际上，你可以利用checker构建一个wwclass体系。
     简单来说： 不用wwclass又希望有代码附加在某类(使用特定样式类，特定属性，特定标签等等)元素上，就使用本机制。
    //$newRootElement是新加入的元素。includeSelf指示是否包含$container自身
    function checker($newRootElement, includeSelf){
      //每次有新元素加入时，无论其类型，都会调用本方法。页面的根container($(".container[-fluid]"))
     //下文的例子，用来示例如何探测所有新加入的input并加以处理，类似的可以处理图片等等。
     var $inputElement = includeSelf ? $newRootElement.find("input[data-xxx]").addBack("input") : $newRootElement.find("[input]");
     if($inputElement.length > 0){ //新加入的元素有input。
     }
    }
    $.wwclass.getwwchecker().push(checker);
    //*/

    // 如有初始化动作, 请在下方添加
  };
  // END: 元素首次初始化处理


  /*
   * @description 元素平滑:
   * 1. 页面显示元素时,如果元素出现明显的闪现现象,需要做如下处理:
   *  1. 编辑器: 添加设置项:`禁用平滑加载`.对应属性`data-disabled-smooth`.该属性只允许设置值为true,否则元素删除该属性
   *  2. 编译期: 添加处理:当属性`data-disabled-smooth`值为`非true`时,元素添加平滑处理.平滑处理目的是使得页面元素的加载更加自然.例如swiper1:将图片添加类hide隐藏,只显示第一张图片,去除元素加载闪现现象
   *  3. 运行期: 添加处理:元素初始化完毕之后,即属性`data-x-inited`属性值为true时,平滑处理的相关元素恢复.例如swiper1:将图片hide类删除,恢复图片正常显示
   *  4. 示例元素可查看轮播图(swiper1)元素
   *  5. 类似imagefill等,平滑处理后,只遗留一个空壳,此时添加处理类`转圈`.加载完毕之后,去掉该类.
  //*/
  /*
   * @description 元素加载状态:
   * 页面显示元素时,如果元素出现明显的有无到有现象,需要做如下处理:
   *  1. 编辑器: 添加设置项:`禁用自动添加加载状态`.对应属性`data-noblock`.该属性只允许设置值为true,否则元素删除该属性
   *  2. 编译期: 添加处理:当属性`data-noblock`值为`非true`时,元素添加加载状态.即设置`data-block="true"`
   *  3. 运行期: 添加处理:元素初始化完毕之后,即属性`data-x-inited`属性值为true时,元素放开加载状态.即设置`data-block="false"`
   *  4. 需要处理的元素，类似view、imagefill、qrcode等元素效果
  //*/
  /* @description 错误信息输出格式:
   *   $.wwclass.syslog(message,category,severity,from,opt);
   * 参数解释：
   *   message; // 必填: 日志信息
   *   from // 选填: 日志来源. 默认值为: 当前页地址
   *   category // 选填: category,日志类型(日志分类标识). 默认值为: fe,即 front end
   *   severity //  选填: severity,日志级别. 默认值为: debug.可选值为:emergency,alert,critical,error,warning,notice,info,debug
   *   opt //选填：参数为json格式的字符串
  //*/
  /*
   * @description 初始化每个元素
   * @param {jQuery object} $ele - 需要初始化的元素
   */
  function tabulator_btn($ele) {
    var config = {};

    config.tableid = $ele.attr("data-tableid"); //设置元素的唯一id值
    // config.paginationSize = eval($ele.attr("data-paginationsize") || "8"); //设置默认显示的行数
    config.height = $ele.attr("data-height") || "311px";
    var tabledata = eval($ele.attr("data--tabledata"));
    var datacolumns = eval($ele.attr("data--datacolumns"));
    var movableColumns = eval($ele.attr("data-movablecolumns"));
    var movableRows = eval($ele.attr("data-movablerows"));
    $ele.find(".example-table").attr("id", config.tableid)

    var table = new Tabulator("#" + config.tableid, {
      data: tabledata,           //从数组加载数据
      layout: "fitColumns",      //使列符合表格宽度的
      // responsiveLayout: "hide",  //隐藏列不适合表格
      tooltips: true,            //在单元格上显示工具提示
      // addRowPos: "top",          //添加新行时，将其添加到表
      history: true,             //允许对表执行撤销和重做操作
      pagination: "",       //对数据进行分页
      paginationSize: config.paginationSize,         //每页允许7行数据
      movableColumns: movableColumns,      //允许更改列顺序
      resizableRows: true,       //允许更改行顺序
      movableRows: movableRows,         //允许调整行的顺序
      height: config.height,
      colResizable: false,
      columns: datacolumns,      //表格头部信息
      //该columnMoved当一列已经successfuly移动回调将被触发。
      columnMoved: function (column, columns) {
        //id - the id of the row
        var dataobj = [];
        // console.log(column);
        // console.log(columns);
        for (var i = 0; i < columns.length; i++) {
          var columnsdata = columns[i]._column.definition;
          dataobj.push(columnsdata);

        }
        // console.log(dataobj);
        $.wwclass.helper.updateProp($ele, "data-x-datacolumns", JSON.stringify(dataobj));
        $.wwclass.helper.anijsTrigger($ele, "columnMoved");   //移动整列发生的事件


      },
      //调整表头宽度
      columnResized: function (column) {
        for (var i = 0; i < datacolumns.length; i++) {
          // console.log(datacolumns[i]);
          // console.log(datacolumns[i].field);
          if (datacolumns[i].field == column._column.field) {
            if (datacolumns[i].hasOwnProperty("width")) {
              datacolumns[i].width = column._column.width;
            } else {
              datacolumns[i]['width'] = column._column.width;
            }

          }
        }
        // console.log(column);
        $.wwclass.helper.updateProp($ele, "data-x-datacolumns", JSON.stringify(datacolumns));
        $.wwclass.helper.anijsTrigger($ele, "columnResized");    //调整表格宽度时发生的事件

      },
      //调整表格行高
      rowResized: function (row) {
        //row - row component of the resized row
        // console.log(row);
        // console.log(row._row.height);
      },


      //数据改变时回调函数
      dataChanged: function (data) {

        $.wwclass.helper.updateProp($ele, "data-x-tabledata", JSON.stringify(data));
        $.wwclass.helper.anijsTrigger($ele, "dataChanged");   //数据改变时发生的事件

      },
      //数据加载完毕的回调函数
      dataLoaded: function (data) {
        var firstRow = "false";
        if (firstRow == "true") {
          var firstRow = this.getRows()[0];

          if (firstRow) {
            firstRow.freeze();
          }
        }
        $.wwclass.helper.updateProp($ele, "data-x-tabledata", JSON.stringify(data));
        $.wwclass.helper.anijsTrigger($ele, "dataLoaded");    //数据加载完毕发生的事件

      },

    });


    setTimeout(function () {
      // var xxx = document.getElementsByClassName("ccc");
      var ulList = $ele.find(".ccc")
      var list = "";

      for (var i = 0; i < datacolumns.length; i++) {
        // console.log(datacolumns[i].title);
        // $.wwclass.helper.updateProp($ele, "data-x-activeindex", datacolumns[i].title);
        list += "<li>" + "<input type='checkbox' checked='checked'>" + datacolumns[i].title + "</li>";
        for (var j = 0; j < ulList.length; j++) {
          ulList[j].innerHTML = list;
        }

      }


      //锁定列菜单
      // var lock = document.getElementsByClassName("sss");
      var lock = $ele.find(".sss")
      var locklist = "";
      for (var i = 0; i < datacolumns.length; i++) {
        locklist += "<li>" + "<input type='checkbox'>" + datacolumns[i].title + "</li>";
        for (var j = 0; j < lock.length; j++) {
          lock[j].innerHTML = locklist;
        }

      }

      //显示隐藏单元列
      $ele.find(".ccc  input[type='checkbox']").on("click", function () {
        $ele.find(this).parent().text();

        if ($ele.find(this).is(":checked")) {
          table.showColumn($ele.find(this).parent().text());
        } else {
          table.hideColumn($ele.find(this).parent().text());
        }

      });

      $ele.find(".sss  input[type='checkbox']").on("click", function () {
        var title = $ele.find(this).parent().text();
        // console.log(title);
        if ($ele.find(this).is(":checked")) {
          var title = $ele.find(this).parent().text();
          for (var i = 0; i < datacolumns.length; i++) {
            var d = datacolumns[i];
            if (d.title === title) {
              d.frozen = true;
              table.setColumns(datacolumns);
            }
          }
        } else {
          var title = $ele.find(this).parent().text();
          for (var i = 0; i < datacolumns.length; i++) {
            var d = datacolumns[i];
            if (d.title === title) {
              d.frozen = false;
              table.setColumns(datacolumns);
            }
          }
        }

      });

    }, 1000)

    //列
    $ele.find(".lie").mousemove(function () {
      $ele.find(".ccc").css("display", "block");
    });
    $ele.find(".lie").mouseleave(function () {
      $ele.find(".ccc").css("display", "none");
    });
    //锁
    $ele.find(".suo").mousemove(function () {
      $ele.find(".sss").css("display", "block");
    });
    $ele.find(".suo").mouseleave(function () {
      $ele.find(".sss").css("display", "none");
    });


  }

  function processElement($ele) {
    /* 如果本元素废弃, 请解开此处注释, 并完成代码
    console.error("扩展元素(" + $ele.attr("data--wwclass") + ")已废弃, 找对应产品更换为xxx实现本功能", $ele);
    //*/
    // 对 $ele 元素做对应处理
    /* @TODO:重要提示:在元素初始化完毕时，需要更新属性`data-x-inited`的值为true，初始值(默认)为false，并同时发出事件wwinited
    $.wwclass.helper.updateProp($ele, "data-x-inited", true);
    $.wwclass.helper.anijsTrigger($ele, "wwinited");
    //*/
    /* @TODO:所有正式发布的元素，请认真排查代码:不要带测试输出，只有出现异常，才允许输出错误.需要输出时，请解开此处注释，并完成代码。函数说明请查看上方
    $.wwclass.syslog(message,category,severity,from,opt);
    //*/
    //当需要使用依赖插件时，使用下方代码来获取。主文件只加载最小插件集合。此时，把同步风格的后续代码，改为函数，因此，依赖越多，函数越多。多到一定程度(独立依赖单元大于10)，可以引入when,bluebird等promise库(不推荐)。
    //loadDependence_XXXX(fnCallback);
    setTimeout(function () {
      tabulator_btn($ele);
    }, 100)
  }

  /*
   * @description 析构每个元素, 也就是该元素该删除时的处理代码
   * @param {jQuery object} $ele - 需要处理的元素
   */
  function finalizeElement($ele) {
    // 对 $ele 元素做对应处理
    /*
    @TODO: 销毁元素，destroy
    @TODO: 存入$ele.data()中的值清空。
    $ele.data("存入的键","");
    //*/
  }

  // BEGIN: 监听属性处理
  /*
   * @description 监听函数, 元素的控制属性(data--)改变时处理
   * @param {jQuery object} $ele - 控制属性改变的元素
   * @param {string} attribute - 控制属性的名称
   * @param {string} value - 控制属性改变为何值
   */
  var evtInHandler = function ($ele, attribute, value) {
    switch (attribute) {
      case "data--tabledata":
        // 处理动作
        tabulator_btn($ele);
        break;
      case "data--datacolumns":
        // 处理动作
        tabulator_btn($ele);
        break;
      case "finalize":
        finalizeElement($ele);
        break;
      default:
        console.info("监听到 \"" + $ele.attr("data-wwclass") + "\" 元素的 \"" + attribute + "\" 属性值改变为 \"" + value + "\", 但是无对应处理动作.");
    }
  };
  // END: 监听属性处理

  // 以下部分不需要修改
  if (!$.wwclass) {
    console.error("Can not use without wwclass.js");
    return false;
  }

  var ret = /*INSBEGIN:WWCLSHANDLER*/
    function (set) {
      if (set.length > 0) {
        loadDependence(function () {
          init();
          $(set).each(function (index, targetDom) {
            processElement($(targetDom));
          });
        });
      }
    }
    /*INSEND:WWCLSHANDLER*/
    ;

  return ret;

}));
