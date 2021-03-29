<template>
  <div>
    <div>
      <div class="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div v-for="item in layout" :key="item.i" class="layoutItem">
            <b>{{ item.i }}</b>: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div>
      </div>
    </div>
    <div id="content">
      <grid-layout
        :layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="(item,inde) in layout"
          :key="inde"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          @resized="childMethod"
        >
          <chart-info ref="item" :data="item.data" :ids="item.i" />
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import chartInfo from './chartInfo'
const GridLayout = VueGridLayout.GridLayout
const GridItem = VueGridLayout.GridItem

export default {
  name: 'Layoutdemo',
  components: {
    GridLayout,
    chartInfo,
    GridItem
  },
  data () {
    return {
      draggable: true,
      resizable: true,
      index: 0,
      layout: [
        { 'x': 0,
          'y': 0,
          'w': 20,
          'h': 20,
          'i': '0',
          'staticcode': 'abc'
        },
        { 'x': 0,
          'y': 0,
          'w': 2,
          'h': 4,
          'i': '1',
          data: { series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }],
          xdata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }},
        { 'x': 4,
          'y': 0,
          'w': 2,
          'h': 5,
          'i': '2',
          data: { series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }],
          xdata: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }},
        { 'x': 6, 'y': 0, 'w': 2, 'h': 3, 'i': '3' },
        { 'x': 8, 'y': 0, 'w': 2, 'h': 3, 'i': '4' },
        { 'x': 10, 'y': 0, 'w': 2, 'h': 3, 'i': '5' },
        { 'x': 0, 'y': 5, 'w': 2, 'h': 5, 'i': '6' },
        { 'x': 2, 'y': 5, 'w': 2, 'h': 5, 'i': '7' },
        { 'x': 4, 'y': 5, 'w': 2, 'h': 5, 'i': '8' },
        { 'x': 6, 'y': 4, 'w': 2, 'h': 4, 'i': '9' },
        { 'x': 8, 'y': 4, 'w': 2, 'h': 4, 'i': '10' },
        { 'x': 10, 'y': 4, 'w': 2, 'h': 4, 'i': '11' },
        { 'x': 0, 'y': 10, 'w': 2, 'h': 5, 'i': '12' },
        { 'x': 2, 'y': 10, 'w': 2, 'h': 5, 'i': '13' },
        { 'x': 4, 'y': 8, 'w': 2, 'h': 4, 'i': '14' },
        { 'x': 6, 'y': 8, 'w': 2, 'h': 4, 'i': '15' },
        { 'x': 8, 'y': 10, 'w': 2, 'h': 5, 'i': '16' },
        { 'x': 10, 'y': 4, 'w': 2, 'h': 2, 'i': '17' },
        { 'x': 0, 'y': 9, 'w': 2, 'h': 3, 'i': '18' },
        { 'x': 2, 'y': 6, 'w': 2, 'h': 2, 'i': '19' }
      ]
    }
  },
  methods: {
      /*
      * 1 获取布局信息
      * 2 遍历Layout 根据staticcode 获取组成图表的信息   line
      * 3 渲染图标
      * */
      getLayout () {

      },

    childMethod (event) {
      // this.$refs.item.$emit('childMethod') // 方法1
      for (const item of this.$refs.item) {
        if (item.ids === event) {
          item.$emit('childMethod') // 方法1
        }
      }
      console.log(this.$refs)
    }
  }
}
</script>

<style scoped>
  #content {
    width: 100%;
  }

  .vue-grid-layout {
    background: #eee;
  }

  .layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
  }

  .eventsJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
    height: 100px;
    overflow-y: scroll;
  }

  .columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
  }

  .vue-resizable-handle {
    z-index: 5000;
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
    background-position: bottom right;
    padding: 0 3px 3px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: se-resize;
  }

  .vue-grid-item:not(.vue-grid-placeholder) {
    background: #ccc;
    border: 1px solid black;
    background-color: snow;
  }

  .vue-grid-item.resizing {
    opacity: 0.9;
  }

  .vue-grid-item.static {
    background: #cce;
  }

  .vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
  }

  .vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
  }

  .vue-grid-item .minMax {
    font-size: 12px;
  }

  .vue-grid-item .add {
    cursor: pointer;
  }

  .vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
  }
</style>
