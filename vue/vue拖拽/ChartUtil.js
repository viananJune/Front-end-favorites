import EleResize from "./ele-resize.js";
class ChartUtil {
  constructor() {
    this.progessOptions = this.progessOptions.bind(this);
    this.progessLegend = this.progessLegend.bind(this);
    this.progessSeries = this.progessSeries.bind(this);
    this.drawChart = this.drawChart.bind(this);
    this.drawChartNoLegend = this.drawChartNoLegend.bind(this);
    this.drawChartNoXY = this.drawChartNoXY.bind(this);
    this.goDraw = this.goDraw.bind(this);
  }
  progessOptions(titleName, fixLegendVData, seriesNew, xdata, options) {
    options || (options = {});
    const { customattrs = {} } = options;
    let { xrotate } = customattrs;
    if (xrotate !== undefined) {
      if (!options.grid) {
        options.grid = {
          x: 100,
          x2: 80,
          y: 60,
          y2: 50,
        };
      }
    } else {
      if (!options.grid) {
        options.grid = {
          x: 100,
          x2: 80,
          y: 60,
          y2: 50,
        };
      }
      xrotate = -30;
    }
    // console.log('这个' + xrotate)
    // noinspection JSAnnotator
    const option = {
      title: {
        show: "true",
        left: "2%",
        text: titleName,
        textStyle: {
          // 标题内容的样式
          color: "#37474f",
          fontStyle: "normal", // 主标题文字字体风格，默认normal，有italic(斜体),oblique(斜体)
          fontWeight: "normal", // 可选normal(正常)，bold(加粗)，bolder(加粗)，lighter(变细)，100|200|300|400|500...
          fontFamily: "微软雅黑", // 主题文字字体，默认微软雅黑
          fontSize: 16, // 主题文字字体大小，默认为16px
        },
      },
      tooltip: {
        trigger: "axis",
      },
      grid: {
        x: 100,
        x2: 80,
        y2: 80,
      },
      xAxis: [
        {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#777",
            },
          },
          axisLabel: {
            interval: 0,
            rotate: xrotate,
          },
          data: xdata,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],

      legend: fixLegendVData,
      toolbox: {
        show: false,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: {
            show: true,
            type: ["pie", "funnel"],
          },
        },
      },
      calculable: false,
      series: seriesNew,
    };

    return option;
  }
  /**
   *
   * @param legendData
   * @param legendOrient
   * @returns {{orient: string, x: string, y: string}|{orient: string, x: string, y: string}}
   */
  progessLegend(legendData, legendOrient) {
    legendOrient || (legendOrient = ChartUtil.HORIZONTAL);
    let fixLegendVData = {};
    if (legendOrient === ChartUtil.HORIZONTAL) {
      fixLegendVData = {
        orient: ChartUtil.HORIZONTAL,
        x: "center",
        y: "30",
      };
    } else {
      fixLegendVData = {
        orient: ChartUtil.VERTICAL,
        x: "right",
        y: "24px",
      };
    }
    fixLegendVData.data = legendData;
    // console.log(legendOrient)
    return fixLegendVData;
  }

  /**
   * 处理数据表
   * @param series
   * @param xdata
   * @param options
   * @returns {*}
   */
  progessSeries(series, xdata, options) {
    const tooltip = {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    };
    return series.filter((item, index) => {
      const { type, data } = item;
      item.color || (item.color = ChartUtil.COLOR);
      switch (type) {
        case "pie":
          if (options.tooltip) {
            /* cjs修改 */
            item.tooltip = options.tooltip;
          } else {
            item.tooltip = tooltip;
          }
          item.radius || (item.radius = ChartUtil.PIE_RAIDUS);
          // item.radius = ChartUtil.PIE_RAIDUS
          break;
        case "bar":
          if (index < ChartUtil.COLOR.length) {
            if (item.stack === undefined) {
              item.color = ChartUtil.COLOR[index];
            } else {
              item.color = ChartUtil.COLOR[index];
            }
          }
          // eslint-disable-next-line no-case-declarations,prefer-const
          let { allData = {} } = options;
          // eslint-disable-next-line no-case-declarations,prefer-const
          let { convertBar = true, yAxis } = allData;
          if (convertBar) {
            const xAxis = {
              type: "value",
            };
            yAxis = {
              type: "category",
              data: yAxis,
            };
            options.xAxis = xAxis;
            options.yAxis = yAxis;
          }
          item.barGap = 0;
          break;
        case "line":
          // item.symbol = 'none'
          item.smooth = true;
          // eslint-disable-next-line no-case-declarations
          const label1 = {
            normal: {
              show: true,
              position: "top",
            },
          };
          item.label = label1;
          // 多条折线的情况
          if (index < ChartUtil.COLOR.length) {
            item.color = ChartUtil.COLOR[index];
          }
          break;
        case "radar":
          options.tooltip = {};
          //  如果是雷达图则必须有最大值
          if (options.polar === undefined) {
            // eslint-disable-next-line no-throw-literal
            throw (
              "如果图形是雷达图则options选项中必须有 polar 属性 eg." +
              JSON.stringify([
                {
                  indicator: [
                    { text: "成绩", max: 6000 },
                    { text: "早起次数", max: 16000 },
                    { text: "早餐次数", max: 30000 },
                    { text: "图书馆进出次数", max: 38000 },
                    { text: "借阅量", max: 52000 },
                  ],
                },
              ])
            );
          }
          /**
           * @description 下方的ie浏览器无法识别，所以改成如下形式
           * @date 2018-10-22 17:20
           * @author cjs1992
           */
          // for (const key in data) {
          //   if (lineStyle === undefined) {
          //     lineStyle = {}
          //     if (key < ChartUtil.COLOR.length) {
          //       lineStyle.color = ChartUtil.COLOR[key]
          //     }
          //   }
          //   const { color } = lineStyle
          //   options.color || (options.color = [])
          //   options.color.push(color)
          // }
          for (const [key, item] of new Map(data.map((item, i) => [i, item]))) {
            let { lineStyle } = item;
            if (lineStyle === undefined) {
              lineStyle = {};
              if (key < ChartUtil.COLOR.length) {
                lineStyle.color = ChartUtil.COLOR[key];
              }
            }
            const { color } = lineStyle;
            options.color || (options.color = []);
            options.color.push(color);
          }
          break;
        case "scatter": // 如果是地图情景
          // eslint-disable-next-line no-case-declarations
          const { coordinateSystem } = item;
          if (coordinateSystem !== undefined && coordinateSystem === "geo") {
            options.geo = ChartUtil.GEO;
          } else {
            if (item.itemStyle === undefined) {
              item.itemStyle = {};
              item.itemStyle.normal = {};
              if (index < ChartUtil.COLOR.length) {
                item.itemStyle.normal.color = ChartUtil.COLOR[index];
              }
            }
          }
          break;
      }

      return true;
    });
  }
  /**
   *
   * @param continerId
   * @param titleName
   * @param legendData [   ]
   * @param options
   */
  drawChart(
    continerId,
    titleName,
    series,
    targetEl,
    xdata,
    legendData = [],
    legendOrient = ChartUtil.HORIZONTAL,
    hasDATAZOME = false,
    options = {},
    cb = function () {
      console.log("未实现点击事件");
    }
  ) {
    console.log("xdata", xdata);
    // progess legend
    // console.log(legendData, legendOrient)
    const fixLegendVData = this.progessLegend(legendData, legendOrient);
    // progess seriza
    const seriesNew = this.progessSeries(series, xdata, options);
    //  progess options
    const option = this.progessOptions(
      titleName,
      fixLegendVData,
      seriesNew,
      xdata,
      options
    );
    if (hasDATAZOME === true) {
      // let dataZoom = {
      //   show: true,
      //   start: 0,
      //   end: 100,
      //   borderColor: '#5b8fe4'
      // }

      const dataZoom = [
        // 区域缩放
        {
          id: "dataZoomX",
          show: true, // 是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
          backgroundColor: "rgba(47,69,84,0)", // 组件的背景颜色
          type: "slider", // slider表示有滑动块的，inside表示内置的
          dataBackground: {
            // 数据阴影的样式。
          },
          handleColor: "#5b8fe4", // h滑动图标的颜色
          handleStyle: {
            borderColor: "#5b8fe4",
            borderWidth: "1",
            shadowBlur: 2,
            background: "#5b8fe4",
            shadowColor: "#5b8fe4",
          },
          fillerColor: "#ebf1f0", // 选中范围的填充颜色。
          borderColor: "#5b8fe4", // 边框颜色。
          filterMode: "filter", // 'filter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只要有一个维度在数据窗口外，整个数据项就会被过滤掉。
          // 'weakFilter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只有当全部维度都在数据窗口同侧外部，整个数据项才会被过滤掉。
          // 'empty'：当前数据窗口外的数据，被 设置为空。即 不会 影响其他轴的数据范围。
          // 'none': 不过滤数据，只改变数轴范围。
          xAxisIndex: 0, // 设置 dataZoom-inside 组件控制的 x轴,可以用数组表示多个轴
          start: 30, // 数据窗口范围的起始百分比,表示30%
          end: 70, // 数据窗口范围的结束百分比,表示70%
          startValue: 10, // 数据窗口范围的起始数值
          endValue: 100, // 数据窗口范围的结束数值。
          orient: "horizontal", // 布局方式是横还是竖。不仅是布局方式，对于直角坐标系而言，也决定了，缺省情况控制横向数轴还是纵向数轴。'horizontal'：水平。'vertical'：竖直。
          zoomLock: false, // 是否锁定选择区域（或叫做数据窗口）的大小。如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
          throttle: 100, // 设置触发视图刷新的频率。单位为毫秒（ms）。
          zoomOnMouseWheel: true, // 如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
          moveOnMouseMove: true, // 如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移。'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移。'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
          left: "center", // 组件离容器左侧的距离,'left', 'center', 'right','20%'
          top: "auto", // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
          right: "auto", // 组件离容器右侧的距离,'20%'
          bottom: "10", // 组件离容器下侧的距离,'20%'
        },
        {
          id: "dataZoomY",
          type: "inside",
          filterMode: "empty",
          disabled: false, // 是否停止组件的功能。
          xAxisIndex: 0, // 设置 dataZoom-inside 组件控制的 x轴,可以用数组表示多个轴
          start: 30, // 数据窗口范围的起始百分比,表示30%
          end: 70, // 数据窗口范围的结束百分比,表示70%
          startValue: 10, // 数据窗口范围的起始数值
          endValue: 100, // 数据窗口范围的结束数值。
          orient: "horizontal", // 布局方式是横还是竖。不仅是布局方式，对于直角坐标系而言，也决定了，缺省情况控制横向数轴还是纵向数轴。'horizontal'：水平。'vertical'：竖直。
          zoomLock: false, // 是否锁定选择区域（或叫做数据窗口）的大小。如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
          throttle: 100, // 设置触发视图刷新的频率。单位为毫秒（ms）。
          zoomOnMouseWheel: true, // 如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
          moveOnMouseMove: true, // 如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移。'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移。'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
        },
      ];
      if (xdata.length < 10) {
        for (const item of dataZoom) {
          item.start = 0;
          item.end = 100;
        }
      } else {
        for (const item of dataZoom) {
          item.start = 0;
          item.end = (10 / xdata.length) * 100;
        }
      }
      const grid = {
        x: 50,
        y: 80,
        x2: 50,
        y2: 100,
      };
      if (!options.grid) {
        options.grid = grid;
      } else if (options.grid === undefined) {
        options.grid.y2 = 120;
      }
      options.dataZoom = dataZoom;
    }
    //  扩展属性
    Object.assign(option, options);
    return this.goDraw(continerId, option, targetEl, cb);
  }

  /**
   *
   * @param continerId
   * @param titleName
   * @param legendData
   * @param options
   */
  drawChartNoLegend(
    continerId,
    titleName,
    series,
    xdata,
    hasDATAZOME,
    options,
    targetEl,
    cb
  ) {
    // progess seriza
    const seriesNew = this.progessSeries(series, xdata, options);
    //  progess options
    const option = this.progessOptions(
      titleName,
      {},
      seriesNew,
      xdata,
      options
    );
    options.legend = {
      show: false,
    };
    //  扩展属性
    Object.assign(option, options);
    this.drawChart(
      continerId,
      titleName,
      {},
      undefined,
      series,
      xdata,
      hasDATAZOME,
      option,
      targetEl,
      cb
    );
  }

  drawChartNoXY(
    continerId,
    titleName,
    series,
    targetEl,
    xdata = [],
    legendData = [],
    legendOrient = ChartUtil.HORIZONTAL,
    hasDATAZOME = false,
    options = {},
    cb = function () {
      console.log("未实现点击事件");
    }
  ) {
    options.xAxis = [];
    options.yAxis = [];
    return this.drawChart(
      continerId,
      titleName,
      series,
      targetEl,
      xdata,
      legendData,
      legendOrient,
      hasDATAZOME,
      options,
      cb
    );
  }

  drawChartShow(
    continerId,
    titleName,
    legendData,
    legendOrient,
    series,
    xdata,
    hasDATAZOME,
    options,
    targetEl,
    util,
    cb
  ) {
    // progess legend
    // console.log(legendData, legendOrient)
    const fixLegendVData = this.progessLegend(legendData, legendOrient);
    // progess seriza
    const seriesNew = this.progessSeries(series, xdata, options);
    //  progess options
    const option = this.progessOptions(
      titleName,
      fixLegendVData,
      seriesNew,
      xdata,
      options
    );

    if (hasDATAZOME === true) {
      // let dataZoom = {
      //   show: true,
      //   start: 0,
      //   end: 100,
      //   borderColor: '#5b8fe4'
      // }

      const dataZoom = [
        // 区域缩放
        {
          id: "dataZoomX",
          show: true, // 是否显示 组件。如果设置为 false，不会显示，但是数据过滤的功能还存在。
          backgroundColor: "rgba(47,69,84,0)", // 组件的背景颜色
          type: "slider", // slider表示有滑动块的，inside表示内置的
          dataBackground: {
            // 数据阴影的样式。
          },
          handleColor: "#5b8fe4", // h滑动图标的颜色
          handleStyle: {
            borderColor: "#5b8fe4",
            borderWidth: "1",
            shadowBlur: 2,
            background: "#5b8fe4",
            shadowColor: "#5b8fe4",
          },
          fillerColor: "#ebf1f0", // 选中范围的填充颜色。
          borderColor: "#5b8fe4", // 边框颜色。
          filterMode: "filter", // 'filter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只要有一个维度在数据窗口外，整个数据项就会被过滤掉。
          // 'weakFilter'：当前数据窗口外的数据，被 过滤掉。即 会 影响其他轴的数据范围。每个数据项，只有当全部维度都在数据窗口同侧外部，整个数据项才会被过滤掉。
          // 'empty'：当前数据窗口外的数据，被 设置为空。即 不会 影响其他轴的数据范围。
          // 'none': 不过滤数据，只改变数轴范围。
          xAxisIndex: 0, // 设置 dataZoom-inside 组件控制的 x轴,可以用数组表示多个轴
          start: 30, // 数据窗口范围的起始百分比,表示30%
          end: 70, // 数据窗口范围的结束百分比,表示70%
          startValue: 10, // 数据窗口范围的起始数值
          endValue: 100, // 数据窗口范围的结束数值。
          orient: "horizontal", // 布局方式是横还是竖。不仅是布局方式，对于直角坐标系而言，也决定了，缺省情况控制横向数轴还是纵向数轴。'horizontal'：水平。'vertical'：竖直。
          zoomLock: false, // 是否锁定选择区域（或叫做数据窗口）的大小。如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
          throttle: 100, // 设置触发视图刷新的频率。单位为毫秒（ms）。
          zoomOnMouseWheel: true, // 如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
          moveOnMouseMove: true, // 如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移。'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移。'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
          left: "center", // 组件离容器左侧的距离,'left', 'center', 'right','20%'
          top: "auto", // 组件离容器上侧的距离,'top', 'middle', 'bottom','20%'
          right: "auto", // 组件离容器右侧的距离,'20%'
          bottom: "10", // 组件离容器下侧的距离,'20%'
        },
        {
          id: "dataZoomY",
          type: "inside",
          filterMode: "empty",
          disabled: false, // 是否停止组件的功能。
          xAxisIndex: 0, // 设置 dataZoom-inside 组件控制的 x轴,可以用数组表示多个轴
          start: 30, // 数据窗口范围的起始百分比,表示30%
          end: 70, // 数据窗口范围的结束百分比,表示70%
          startValue: 10, // 数据窗口范围的起始数值
          endValue: 100, // 数据窗口范围的结束数值。
          orient: "horizontal", // 布局方式是横还是竖。不仅是布局方式，对于直角坐标系而言，也决定了，缺省情况控制横向数轴还是纵向数轴。'horizontal'：水平。'vertical'：竖直。
          zoomLock: false, // 是否锁定选择区域（或叫做数据窗口）的大小。如果设置为 true 则锁定选择区域的大小，也就是说，只能平移，不能缩放。
          throttle: 100, // 设置触发视图刷新的频率。单位为毫秒（ms）。
          zoomOnMouseWheel: true, // 如何触发缩放。可选值为：true：表示不按任何功能键，鼠标滚轮能触发缩放。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标滚轮能触发缩放。'ctrl'：表示按住 ctrl 和鼠标滚轮能触发缩放。'alt'：表示按住 alt 和鼠标滚轮能触发缩放。
          moveOnMouseMove: true, // 如何触发数据窗口平移。true：表示不按任何功能键，鼠标移动能触发数据窗口平移。false：表示鼠标滚轮不能触发缩放。'shift'：表示按住 shift 和鼠标移动能触发数据窗口平移。'ctrl'：表示按住 ctrl 和鼠标移动能触发数据窗口平移。'alt'：表示按住 alt 和鼠标移动能触发数据窗口平移。
        },
      ];
      if (xdata.length < 10) {
        for (const item of dataZoom) {
          item.start = 0;
          item.end = 100;
        }
      } else {
        for (const item of dataZoom) {
          item.start = 0;
          item.end = (10 / xdata.length) * 100;
        }
      }
      const grid = {
        x: 50,
        y: 80,
        x2: 50,
        y2: 100,
      };
      if (!options.grid) {
        options.grid = grid;
      } else if (options.grid === undefined) {
        options.grid.y2 = 120;
      }
      options.dataZoom = dataZoom;
    }
    //  扩展属性
    Object.assign(option, options);
    option.yAxis = [
      {
        type: "value",
        name: "（" + util + "）",
        axisLabel: {
          textStyle: {
            color: "#fff",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#3d3d3d",
            type: "dashed",
            width: 1,
          },
        },
      },
    ];
    option.tooltip = {
      trigger: "axis",
      // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
      //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      // },
      formatter: "{b}<br/>{c0}" + util,
    };

    option.legend = {
      y: "20",
      data: legendData,
    };
    option.grid = {
      x2: 50,
    };

    option.xAxis = [
      {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#777",
          },
        },
        axisLabel: {
          interval: 0,
          //  rotate: xrotate,
          textStyle: {
            color: "#fff",
          },
        },
        data: xdata,
      },
    ];
    return this.goDraw(continerId, option, targetEl, cb);
  }

  /**
   * 开始绘制
   * @param continerId
   * @param option
   * @param targetEl
   * @returns {Promise<any>}
   */
  goDraw(continerId, option, targetEl, cb) {
    if (
      option.color &&
      Object.prototype.toString.call(option.color) === "[object String]"
    ) {
      /* cjs添加 */
      for (const item of option.series) {
        item.color = option.color;
      }
    }
    cb ||
      (cb = function () {
        console.log(continerId, "暂未实现图表点击事件");
      });
    option || (option = {});
    let first = "";
    let continer = "";
    if (typeof continerId === "string") {
      first = document.getElementById(continerId);
      continer = targetEl.$echarts.init(first);
    } else {
      continer = continerId;
    }
    continer.off("click");
    continer.on("click", cb);
    // continer.clear()
    continer.setOption(option);

    if (first) {
      console.log(continer, "console.log(continer);");
      EleResize.on(first, function () {
        continer.resize();
        console.log("first", first);
      });
    } else {
      EleResize.on(continer._dom, function () {
        continer.resize();
      });
    }
    // first.addEventListener('resize', function () {
    //   continer.resize()
    // })
    // window.addEventListener('resize', function () {
    //   continer.resize()
    // })
    return continer;
  }
  convertData(data) {
    var geoCoordMap = {
      安阳市: [114.352482, 36.103442],
      鹤壁市: [114.295444, 35.748236],
      濮阳市: [115.041299, 35.768234],
      新乡市: [113.883991, 35.302616],
      焦作市: [113.238266, 35.23904],
      济源市: [112.590047, 35.090378],
      三门峡市: [111.194099, 34.777338],
      洛阳市: [112.434468, 34.663041],
      郑州市: [113.665412, 34.757975],
      开封市: [114.341447, 34.797049],
      商丘市: [115.650497, 34.437054],
      许昌市: [113.826063, 34.022956],
      平顶山市: [113.307718, 33.735241],
      漯河市: [114.026405, 33.575855],
      周口市: [114.649653, 33.620357],
      南阳市: [112.540918, 32.999082],
      驻马店市: [114.024736, 32.980169],
      信阳市: [114.075031, 32.123274],
    };
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var geoCoord = geoCoordMap[data[i].name];
      if (geoCoord) {
        res.push({
          name: data[i].name,
          value: geoCoord.concat(data[i].value),
        });
      }
    }
    return res;
  }
}
ChartUtil.VERTICAL = "vertical"; //  垂直的
ChartUtil.HORIZONTAL = "horizontal"; //  水平的
ChartUtil.PIE_RAIDUS = [80, 120]; //  水平的
ChartUtil.COLOR = [
  "#febf8f",
  "#6aa0e6",
  "#6be6c1",
  "#3fb1e3",
  "#a0a7e6",
  "#c4ebad",
  "#96dee8",

  // "#5895e7",
  "#35bea4",
  "#f6bb42",
  "#cf5964",
  "#f37258",
  "#8cc152",
  "#3bafda",
  "#6c6fbf",
  "#ffb980",
  "#d56290",
  "#c4ccd3",
  "#4a89dc",
  // "#5895e7",
  "#35bea4",
  "#f6bb42",
  "#cf5964",
  "#f37258",
  "#8cc152",
  "#3bafda",
  "#6c6fbf",
  "#ffb980",
  "#d56290",
  "#c4ccd3",
];
ChartUtil.RIGHT_TOP = {
  x: "right",
  y: "top",
  left: "87%",
};
ChartUtil.CENTER_TOP = {
  x: "center",
  y: "top",
};
ChartUtil.GEO = {
  map: "china",
  roam: true,
  label: {
    normal: {
      show: true,
      textStyle: {
        color: "rgba(0,0,0,0.4)",
      },
    },
  },
  itemStyle: {
    normal: {
      borderColor: "rgba(0, 0, 0, 0.2)",
    },
    emphasis: {
      areaColor: null,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 20,
      borderWidth: 0,
      shadowColor: "rgba(0, 0, 0, 0.5)",
    },
  },
};
export const ChartUt = ChartUtil;
export const chartUtil = new ChartUtil();
