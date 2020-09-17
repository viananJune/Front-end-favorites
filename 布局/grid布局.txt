 1、在el-form处添加类名
<el-form :inline="true"
             :model="form"
             class="form-wrap"
             ref="form"
             label-width="40%">
添加样式
2、.form-wrap {
  display: grid;
  grid-template-columns: repeat(3, 33.3%);//代表3列，每列宽度是33.3%
  .grid-title {//子项可以单独设置
    grid-column-start: 1;
    grid-column-end: 4;
  }
}

相关文档：http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html