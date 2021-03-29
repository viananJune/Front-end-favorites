<template>
  <!--card v-if="chartData.info.chartType === 'ICONDATA_CHART'" -->
  <div v-if="chartData.info.chartType !== 'ECHART'" class="card-panel">
    <div class="card-panel-icon-wrapper icon-people">
      <svg-icon icon-class="peoples" class-name="card-panel-icon" />
    </div>
    <div class="card-panel-description">
      <div class="card-panel-text">
        {{ chartData.info.name }}
      </div>
      <count-to :start-val="0" :end-val="chartData.info.statisticnum" :duration="2000" class="card-panel-num" />
    </div>
  </div>
  <!--echart-->
  <div v-else :id="ids" style="height: 100%;width: 100%;" />
</template>

<script>
  import CountTo from 'vue-count-to'
export default {
  name: 'ChartInfo',
  components: {
    CountTo
  },
  props: {
    data: Object, // 图标数据
    ids: Number
  },
  data () {
    return {
      continer: '',
      chartData: {}
    }
  },
  watch: {
    data: {
      immediate: true,
      handler (val) {
        this.chartData = val
        if (val.info.chartType === 'ECHART') {
            this.draw(val)
        }
      }
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.$on('childMethod', function () {
        console.log('监听成功')
        if (this.chartData) {
          this.draw(this.chartData)
        }
        this.continer.resize()
      })
    })
  },
  methods: {
    clickme () {
      // alert(5)
    },
    draw (data) {
      this.$nextTick(() => {
        if (data.info.type === 'pie') {
          const series = [{
            type: data.info.type,
            title: data.info.title,
            name: data.info.name,
            data: data.info.data
          }]
          this.continer = this.$ChartUtil.drawChartNoXY(this.ids + '', data.info.title, series, this)
        } else {
            console.log('series', data.info)
            this.continer = this.$ChartUtil.drawChart(this.ids + '', data.info.title, data.info.series, this, [], data.info.legenddata
              , this.$ChartUt.HORIZONTAL
              , false
              , { allData: data.info })
        }
      })
    },
    childMethod (event) {
      console.log(1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 100%;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: #5B687F;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
  .card-panel .card-panel-description {
    font-weight: 500;

  }
  .card-panel{
    height: 100%;
    cursor: pointer;
    font-size: 14px;
    position: relative;
    color: #666;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight:normal;
  }
  .card-panel .card-panel-description .card-panel-text {
    color: #666;
    font-size: 16px;
  }
  .card-panel .card-panel-description .card-panel-num {
    font-size: 16px;
  }
</style>
