<template>
  <div id="content" class="dashboard-editor-container">
    <!--<div>
      <div class="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div v-for="item in layout" :key="item.i" class="layoutItem">
            <b>{{ item.i }}</b>: [{{ item.x }}, {{ item.y }}, {{ item.w }}, {{ item.h }}]
          </div>
        </div>
      </div>
    </div>-->
    <div style="width: 99%;background-color: white;margin:2px 10px 0 10px">
      <el-button v-if="canEditor" @click="save">保存</el-button>
    </div>
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
        <chart-info ref="item" :data="item" :ids="item.i" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
  import { getlayout, getchart, saveLayout } from '@/api/dashboard'
  import VueGridLayout from 'vue-grid-layout'
  const GridLayout = VueGridLayout.GridLayout
  const GridItem = VueGridLayout.GridItem
  import ChartInfo from './components/ChartInfo'
  export default {
    name: 'DashboardAdmin',
    components: {
      GridLayout,
      GridItem,
      ChartInfo
    },
    data () {
      return {
        startTime: 0,
        endTime: 0,
        layout: [],
          canEditor: false
      }
    },
    mounted () {
        if (this.$route.params.id !== undefined) {
            this.canEditor = true
        }
      this.endTime = new Date().valueOf()
      this.getlayout()
    },
    methods: {
        save () {
            saveLayout(JSON.stringify({ id: 1, layoutjson: this.layout })).then(res => {
              if (res.status === 200) {
                console.log('布局保存成功')
              }
            })
        },
      // 获取layout数据
      getlayout () {
        const params = {
          page: 1
        }
        getlayout(params).then((res) => {
          if (res.status === 200) {
            const data = res.message || []
            const arrayInfo = res.message || []
            for (let i = 0; i < data.length; i++) {
              const params = {
                starttm: this.startTime,
                endtm: this.endTime,
                version: 1,
                chartcontent: data[i].statisticcode
              }
              getchart(params).then((res) => {
                if (res.status === 200) {
                  arrayInfo[i].info = res.message
                  if (i === data.length - 1) {
                    this.layout = arrayInfo
                    console.log(this.layout)
                  }
                }
              })
            }
          }
        })
      },
      childMethod (event) {
        for (const item of this.$refs.item) {
          if (item.ids === event) {
            item.$emit('childMethod') // 方法1
          }
        }
      }
    }
  }
</script>

<style scoped>
  #content {
    width: 100%;
  }

  .vue-grid-layout{
    background: #f4f5f9;
  }
  .vue-grid-layout>div {
    position: absolute;
    background: #fff;
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
