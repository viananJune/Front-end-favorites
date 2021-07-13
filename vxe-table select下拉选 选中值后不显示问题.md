# vxe-table select下拉选 选中值后不显示问题

在使用vxe-table 下拉选时遇到一个问题选中后值不显示(针对这个问题做一下记录)

图:

![img](https://pic3.zhimg.com/80/v2-cdf5177956f065b28bc3903aefb5f04e_720w.jpg)选择前

![img](https://pic1.zhimg.com/80/v2-26566b5cf4ef2f5c7d35ace8af4d4308_720w.jpg)选择后值不显示

代码如下

```html
<vxe-table
        border
        show-overflow
        ref="xTable"
        class="my_table_insert"
        height="300"
        :data="tableData2"
        @cell-click="click"
        :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
      >
<vxe-table-column
          title="是否主职"
          field="isMainJob"
          :edit-render="{
                 name:'$select',
                 options:[{value:true,label:'是'},{value:false,label:'否'}]}"
        ></vxe-table-column>
</vxe-table>
```

解决方法:给下拉选加change事件 在事件触发时使单元格清除激活状态,然后立刻将该单元格设置为激活状态.

```html
<vxe-table
        border
        show-overflow
        ref="xTable"
        class="my_table_insert"
        height="300"
        :data="tableData2"
        @cell-click="click"
        :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
      >
<vxe-table-column
          title="是否主职"
          field="isMainJob"
          :edit-render="{
                 name:'$select',
                 options:[{value:true,label:'是'},{value:false,label:'否'}],
                 events:{change:selectChange}}"
        ></vxe-table-column>
</vxe-table>
```

js代码

```js
selectChange(row){
      this.$refs.xTable.clearActived()//清除单元格激活状态
      this.$refs.xTable.setActiveCell(row.row,row.column.property)//设置单元格为激活状态
    }
```

效果:

![img](https://pic2.zhimg.com/80/v2-5fc552447ee2e69bc0cc5b19bfc1ec59_720w.jpg)选择前

![img](https://pic4.zhimg.com/80/v2-ec0ffea19482be719ecf4da6b51e5bc3_720w.jpg)选择后值显示了