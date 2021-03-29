<template>
  <div style="height: 100%;width: 100%">
    <div :id="ids" style="height: 100%;width: 100%">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartInfo',
  props: {
    data: Object, // 图标数据
    chartType: String, // 图标类型
    ids: String
  },
  data () {
    return {
      continer: ''
    }
  },
  watch: {
    data (val) {
      // alert(3)
      this.draw(val)
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.$on('childMethod', function () {
        console.log('监听成功')
        this.continer.resize()
      })
    })
    console.log(this.data)
    if (this.data) {
      this.draw(this.data)
    }
  },
  methods: {
    clickme () {
      // alert(5)
    },
    draw (data) {
        this.$nextTick(() => {
            const series = data.series
            const xdata = data.xdata
            console.log('ids', this.ids)
            this.continer = this.$ChartUtil.drawChart(this.ids + '', '校企合作开发课程门数占开设课程总门数比率变化', series, xdata, this
                , []
                , this.$ChartUt.HORIZONTAL, false, {
                    customattrs: { xrotate: 0 }
                }, (param) => {
                })
        })
    }
  }
}
</script>

<style scoped>

</style>
