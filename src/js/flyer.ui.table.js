/***
 *@Name: fiyer v0.1.1 [表格组件]
 *@Author: [Ken]
 *@License：MIT
 ***/
flyer.define("table", function(selector, options) {

    /*
     * 在这里写要实例插件的代码,定义的变量名以实际组件的名称为准
     */
    var Table = function(selector, options) {
        return this.init(selector, options);
    }

    Table.DEFAULTS = {

        //配置列属性
        columns: [],

        //配置静态数据
        data: [],

        //是否可以拖动列宽度
        resizer: false,

        //表格容器的宽度
        width: "auto",

        //表格容器的高度
        height: "auto",

        //表头是否固定
        fixedHeader: true
    }

    //内置列的属性
    Table.COLUMN_DEFAULTS = {
        radio: false,
        checkbox: false,
        checkboxEnabled: true,
        field: undefined,
        title: undefined,
        titleTooltip: undefined,
        styles: {},
        className: undefined,
        sortable: false,
        order: 'asc', // asc, desc
        visible: true,
        formatter: undefined,
        sorter: undefined,
        sortName: undefined
    }

    Table.prototype = {

        //页面加载的实例化入口
        init: function(selector, options) {
            this.options = $.extend(true, {}, Table.DEFAULTS, options);

            this.selector = selector;

            //方法实例化代码
            this.template();
            //this.initHeaderThemes();
            this.initEvents();

            if (this.options.resizer) {
                this.initRgrips();
            }
        },

        //加载表格模版
        template: function() {

            var arryHtml = [
                '<div class="flyer-table" style="width:' + this.options.width + ';height:' + this.options.height + '">',
                '<div class="flyer-table-toolbar">',
                '</div>',
                '<div class="flyer-table-resizer">',
                '</div>',
                '<div class="flyer-table-body">',
                '<table>',
                '<thead>',
                this.initHeader(),
                '</thead>',
                '<tbody>',
                this.initBody(),
                '</tbody>',
                '<tfoot>',
                '</tfoot>',
                '</table>',
                '</div>',
                '<div class="flyer-table-page">',
                '</div>',
                '</div>'
            ]

            this.selector.html(arryHtml.join(""));

            this.$header = this.selector.find("thead");
            this.$body = this.selector.find("tbody");
        },

        //配置样式属性
        initHeaderThemes: function() {
            var _this = this,
                opts = _this.options,
                flagColumns = _this._flagColumns;
            this.$header.find("th").each(function() {
                var $this = $(this),
                    dataIndex = $this.data("index");
                $this.css(flagColumns[dataIndex].styles);
                $this.addClass(flagColumns[dataIndex].className);
            });
        },

        //加载表头
        initHeader: function() {
            var arryHtml = [];
            for (var i = 0, columns = this.options.columns, len = columns.length; i < len; i++) {
                this.options.columns[i] = $.extend(true, {}, Table.COLUMN_DEFAULTS, columns[i]);
            }
            parseColumns(arryHtml, this.options.columns, "th");
            return arryHtml.join("");
            //return this.parseHeader();
        },

        parseHeader: function() {
            var arryHtml = [];
            for (var i = 0, columns = this.options.columns, len = columns.length; i < len; i++) {
                this.options.columns[i] = $.extend(true, {}, Table.COLUMN_DEFAULTS, columns[i]);
                var column = columns[i];
                column._index = i;
                this._flagColumns[i] = column;
            }
            parseColumns(arryHtml, this.options.columns, "th");
            return arryHtml.join("");
        },

        //加载表内容
        initBody: function() {
            var arryHtml = [];
            for (var j = 0, data = this.options.data, jLen = data.length; j < jLen; j++) {
                var arryTd = [];
                arryHtml.push("<tr>");
                for (var i = 0, columns = this.options.columns, len = columns.length; i < len; i++) {
                    var column = columns[i];
                    if (column.visible) {
                        if (column.checkbox) {
                            arryHtml.push("<td data-index=" + column._index + ">" + (typeof column.formatter === "function" ? column.formatter(data[j], data[j][column.field]) : ("<input name='" + column.field + "' type='checkbox'/>")) + "</td>");
                        } else if (column.radio) {
                            arryHtml.push("<td data-index=" + column._index + ">" + (typeof column.formatter === "function" ? column.formatter(data[j], data[j][column.field]) : ("<input name='" + column.field + "' type='radio'/>")) + "</td>");
                        } else {
                            arryTd.push("<td>" + (typeof column.formatter === "function" ? column.formatter(data[j], data[j][column.field]) : data[j][column.field]) + "</td>");
                        }
                    }
                }
                arryHtml.push(arryTd.join(""));
                arryHtml.push("</tr>");
            }

            return arryHtml.join("");
        },

        //加载表页脚
        initFooter: function() {

        },

        //加载事件
        initEvents: function() {
            this.checkAll();
        },

        //设置选中全部
        checkAll: function() {
            var _this = this;
            _this.$header.find("input[type='checkbox']").on("click", function() {
                var ckHead = this;
                _this.selector.find("input[name='" + ckHead.name + "']").each(function() {
                    this.checked = ckHead.checked;
                });
            });
        },

        //列拖动
        columnResizer: function(e) {
            var _this = this,
                $resizerItems = this.selector.find(".flyer-rgrips .flyer-rgrips-resizer"),
                $table = this.selector.find(".flyer-table"),
                tableLeft = $table.offset().left,
                tableWidth = $table.width();
            _this.ismove = false;

            $resizerItems.bind("mousedown", function(e) {
                document.body.onselectstart = function() {
                    return false;
                }
                _this.ismove = true;
                _this.rgripElm = $(this);
                _this.rgripElmLeft = parseInt(_this.rgripElm.css("left") || 0);
                _this.rgripNext = _this.rgripElm.next();
                _this.rgripPrev = _this.rgripElm.prev();
                _this.rgripNextLeft = parseInt(_this.rgripNext.css("left") || 0);
                _this.rgripPrevLeft = parseInt(_this.rgripPrev.css("left") || 0);
                _this.rgripTh = _this.$header.find("th[data-index='" + _this.rgripElm.data("index") + "']");
                _this.rgripNextTh = _this.rgripTh.next();
                _this.rgripPrevTh = _this.rgripTh.prev();

                _this.rgripElm.addClass("flyer-rgrips-drag");
                $table.addClass("user-select-none");
            });
            $(document).mousemove(function(e) {

                if (_this.ismove) {
                    var left = (_this.rgripElm.get(0).offsetWidth + e.clientX) - tableLeft;
                    //console.log(left);
                    //console.log(_this.rgripElm.offset().left + "," + _this.rgripElm.get(0).offsetWidth + "," + e.clientX + "," + tableLeft);
                    if (left < 0) {
                        left = 0;
                    } else if (left > tableWidth) {
                        left = tableWidth;
                    } else if (left > _this.rgripNextLeft) {
                        left = _this.rgripNextLeft;
                    } else if (left < _this.rgripPrevLeft) {
                        left = _this.rgripPrevLeft;
                    }
                    _this.rgripElm.css("left", left);

                }
            });
            $(document).mouseup(function(e) {
                document.body.onselectstart = function() {
                    return true;
                };

                if (_this.ismove) {
                    _this.ismove = false;
                    _this.dragWidth = _this.rgripElmLeft - parseInt(_this.rgripElm.css("left"));
                    _this.dragValue = parseInt(String(_this.dragWidth).replace("-", ""));
                    //_this.rgripTh.css("width", parseInt(_this.rgripTh.css("width")) + _this.dragValue);
                    if (_this.dragWidth < 0) {
                        _this.rgripNext.css("left", (_this.rgripNextLeft - _this.dragValue));
                        _this.rgripTh.css("width", parseInt(_this.rgripTh.css("width")) + _this.dragValue);
                        //_this.rgripNextTh.css("width", parseInt(_this.rgripNextTh.css("width")) + _this.dragValue);
                    } else if (_this.dragWidth > 0) {
                        _this.rgripPrev.css("left", (_this.rgripPrev - _this.dragValue));
                        //_this.rgripPrevTh.css("width", parseInt(_this.rgripPrevTh.css("width")) - _this.dragValue);
                        _this.rgripTh.css("width", parseInt(_this.rgripTh.css("width")) - _this.dragValue);
                    }

                    _this.rgripElm.removeClass("flyer-rgrips-drag");
                    $table.removeClass("user-select-none");
                    //_this._flagColumns[_this.rgripElm.data("index")].styles["width"] =
                    _this.initRgrips();
                }

            });
        },

        //构建可以拖动列宽的结构
        initRgrips: function() {
            var arryRgrips = [],
                $table = this.selector.find(".flyer-table-body table"),
                tableWidth = $table.width(),
                tableHeight = $table.height(),
                tableLeft = $table.offset().left;

            arryRgrips.push("<div class='flyer-rgrips' style='width:" + tableWidth + "px;'>");
            //先将表格的列宽设置好
            this.$header.find("th").each(function() {

                var $this = $(this),
                    left = ($this.offset().left + $this.get(0).offsetWidth) - tableLeft;
                $this.css("width", $this.width());
                arryRgrips.push("<div style='left:" + left + "px;height:" + tableHeight + "px' data-index='" + $this.data("index") + "' class='flyer-rgrips-resizer'></div>")
            });
            $table.css("width", tableWidth);

            arryRgrips.push("</div>");
            this.selector.find(".flyer-table-resizer").html(arryRgrips.join(""));
            this.columnResizer();
        }
    }

    function parseColumns(arryHtmls, columns, tagName) {

        var fields = [];
        arryHtmls.push("<tr>");
        for (var i = 0, len = columns.length; i < len; i++) {

            arryHtmls.push("<" + tagName + ">" + columns[i].title + "</" + tagName + ">");
            if (typeof columns[i].field === "object") {
                fields.push(columns[i].field);
            }
        }
        arryHtmls.push("</tr>");
        if (fields.length > 0) {
            for (var j = 0, jLen = fields.length; j < jLen; j++) {
                parseColumns(arryHtmls, fields[j], tagName);
            }
        }
        return arryHtmls;
    }

    return new Table(selector, options);
});