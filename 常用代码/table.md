<template>
  <div class="app-container app-container-device">
    <auto-table
      ref="table"
      :methods="methods"
      primaryKey="terminalNo"
      :controls="controls"
      :table="table"
      :dialog="dialog"
    >
      <template #table="{data}">
        <el-table :table="data" border style="width:100%;">
          <el-table-column label="序号" type="index" fixed></el-table-column>
          <el-table-column label="EMEI" prop="terminalNo"></el-table-column>
          <el-table-column label="资产编号" prop="assetNum"></el-table-column>
          <el-table-column label="SN" prop="terminalNo"></el-table-column>
          <el-table-column label="所属组织" prop="org"></el-table-column>
          <el-table-column label="温度" prop="temp"></el-table-column>
          <el-table-column label="当前定位地址" prop="deviceAddr"></el-table-column>
          <el-table-column label="运行状态" prop="status"></el-table-column>
          <el-table-column label="客户绑定状态" prop="terminalNo"></el-table-column>
          <el-table-column label="客户绑定状态" prop="bindStatus"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              <el-button size="mini" @click="handleOpen(scope.$index, scope.row)">点播</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </auto-table>
    <el-dialog title="批量绑定" :visible.sync="bindDialogVisible" width="30%">
      <span>所属组织：</span>
      <el-cascader
        v-model="orgs"
        :options="orgOptions"
        @change="handleChange"
        :props="{ checkStrictly: true }"
      ></el-cascader>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBind">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { terminalPud, terminalAdd, terminalDel } from "@/api/device";
import { batchBind } from "@/api/devicemanage";
import { getToken } from "ve-framework/utils/auth";
import { cusProUnbind } from "@/api/customer";
import dreason from "./dialog/reason";
import sreason from "./dialog/reason";
import { getOrganizationTree } from "@/api/organization";

export default {
  name: "basic-customer",
  data() {
    return {
      orgs: [],
      bindDialogVisible: false,
      orgOptions: [],
      parentCodeOptions: [],
      methods: {
        add: terminalAdd,
        update: terminalPud,
        remove: terminalDel
      },
      checkedItems: [],
      dialog: {
        labelWidth: "120px",
        width: "1100px",
        grid: 3,
        options: [
          {
            id: "terminalNo",
            name: "设备编号",
            maxlength: 30,
            showWordLimit: true,
            required: true
          },
          {
            id: "assetNum",
            name: "资产编号",
            maxlength: 30,
            showWordLimit: true,
            required: true
          },
          {
            id: "simNo",
            name: "SIM卡号",
            maxlength: 30,
            showWordLimit: true,
            required: true
          },

          {
            id: "chipNo",
            name: "芯片号",
            maxlength: 30,
            showWordLimit: true,
            required: true
          },
          {
            id: "plantCode",
            name: "厂家代码",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "deviceAddr",
            name: "设备地址",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },

          {
            id: "producedDateStr",
            name: "生产日期",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "shipmentDateStr",
            name: "发货日期",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },

          {
            id: "snCode",
            name: "产品条码",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "bluetoothNo",
            name: "蓝牙模块号",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "uuid",
            name: "UUID",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "major",
            name: "major",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },

          {
            id: "minor",
            name: "minor",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "controllerModel",
            name: "控制器型号",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "controllerVer",
            name: "控制器版本号",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "orderNum",
            name: "订单号",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "region",
            name: "大区",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "province",
            name: "省区",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "customType",
            name: "客户类型",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "customName",
            name: "客户姓名",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "linkman",
            name: "联系人",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "linkmanPhone",
            name: "联系电话",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "estimatedArrivalDate",
            name: "预计到货日期",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },
          {
            id: "expectedArrivalAddress",
            name: "预计到货地址",
            maxlength: 30,
            showWordLimit: true
            // required: true
          },

          {
            id: "remarks",
            name: "备注",
            maxlength: 30,
            showWordLimit: true
            // required: true
          }
        ]
      },
      controls: [
        {
          name: "模板文件下载",
          command: "download",
          type: "primary",
          url: "/import/download",
          fileName: "模板文件.xls",
          loading: false
        },
        {
          name: "批量导入",
          command: "import",
          token: getToken(),
          type: "info",
          url: "/import/upload",
          field: "file",
          onSuccess: (response, file, fileList) => {
            if (response.returnCode === "-9999") {
              // this.$message.error("非法文件");
              this.$message({
                type: "error",
                message: "非法文件",
                duration: 1000,
                showClose: true
              });
            }
          }
        },
        {
          name: "批量导出",
          command: "export",
          type: "primary",
          url: "/import/export",
          fileName: "设备信息列表.xls",
          loading: false
        },
        {
          name: "批量绑定",
          type: "primary",
          disabled: () => {
            return this.checkedItems.length === 0;
          },
          click: () => {
            let { checkedItems } = this;
            console.log("this.checkedItems", this.checkedItems);
            let flag = checkedItems.some(it => {
              return it.bindStatus === 1;
            });
            if (flag) {
              // this.$message.warning("只能选择没有绑定过的产品");
              this.$message({
                type: "warning",
                message: "只能选择没有绑定过的产品",
                duration: 1000,
                showClose: true
              });
              return;
            }
            this.bindDialogVisible = true;
            this.getOrganizationTree();
            // this.$dialog.open("customerProduct", "bind", {
            //   ele: this.$refs.table,
            //   items: this.checkedItems
            // });
          }
        },
        // {
        //   name: "批量解绑",
        //   type: "warning",
        //   disabled: () => {
        //     return this.checkedItems.length === 0;
        //   },
        //   click: () => {
        //     let { checkedItems } = this;
        //     let flag = checkedItems.some(it => {
        //       return it.bindStatus === 0;
        //     });
        //     if (flag) {
        //       // this.$message.warning("只能选择已经绑定过的产品");
        //       this.$message({
        //         type: "warning",
        //         message: "只能选择已经绑定过的产品",
        //         duration: 1000,
        //         showClose: true
        //       });
        //       return;
        //     }
        //     this.unbind(this.checkedItems);
        //   }
        // },
        {
          name: "添加设备",
          command: "add",
          type: "primary"
        },
        {
          name: "删除",
          type: "danger",
          click: () => {
            this.$dialog.open("devicenew", "dreason", {
              ele: this.$refs.table,
              items: this.checkedItems
            });
          }
        },
        {
          name: "报废",
          type: "danger",
          click: () => {
            this.$dialog.open("devicenew", "sreason", {
              ele: this.$refs.table,
              items: this.checkedItems
            });
          }
        }

        // {
        //   name: "模板文件上传",
        //   command: "import",
        //   token: getToken(),
        //   type: "info",
        //   url: "/import/upload",
        //   field: "file",
        //   onSuccess: (response, file, fileList) => {
        //     if (response.returnCode === "-9999") {
        //       this.$message.error("非法文件");
        //     }
        //   }
        // },
        // {
        //   name: "增加",
        //   command: "add"
        // }
      ],
      table: {
        url: "/coldchain/terminal",
        pagination: "urlParams",
        pageIndexKey: "page",
        pageSizeKey: "size",
        primaryKey: "terminalNo",
        showCheckBox: true, // 复选框
        indexIncrease: true, // 索引递增
        align: "center",
        events: {
          selectionChange: selection => {
            console.log(selection);
            this.checkedItems = selection;
          }
        },
        operation: {
          width: "300px",
          type: "text",
          size: "mini",
          buttons: [
            {
              name: "详情",
              command: "detail",
              type: "primary"
            },
            {
              name: "编辑",
              command: "edit",
              type: "success"
            },
            {
              name: "解除绑定",
              type: "danger",
              command: "unbind"
            },
            {
              name: "基准校验",
              type: "danger",
              command: "bmveri"
            }
            // {
            //   name: "启用",
            //   type: "success",
            //   click: (data, prop) => {
            //     console.log(data, prop);
            //     customerPud({ cusNo: data.cusNo, status: 1 }).then(() => {
            //       this.$refs.table.refresh();
            //     });
            //   },
            //   show: data => {
            //     return data.status === 0;
            //   }
            // },
            // {
            //   name: "禁用",
            //   type: "danger",
            //   click: (data, prop) => {
            //     console.log(data, prop);
            //     this.$confirm("此操作将禁用经销商, 是否继续?", "提示", {
            //       type: "warning"
            //     }).then(() => {
            //       customerPud({ cusNo: data.cusNo, status: 0 }).then(() => {
            //         this.$refs.table.refresh();
            //       });
            //     });
            //   },
            //   show: data => {
            //     return data.status === 1;
            //   }
            // }
          ]
        },
        // columns: [
        //   {
        //     label: "EMEI",
        //     prop: "terminalNo"
        //   },
        //   {
        //     label: "资产编号",
        //     prop: "assetNum"
        //   },
        //   {
        //     label: "SN",
        //     prop: "sn"
        //   },
        //   {
        //     label: "所属组织",
        //     prop: "org"
        //   },
        //   {
        //     label: "温度",
        //     prop: "temp",
        //     render: ({ temp }) => {
        //       return temp + "℃";
        //     }
        //   },
        //   {
        //     label: "当前定位地址",
        //     prop: "deviceAddr"
        //   },
        //   {
        //     label: "运行状态",
        //     prop: "runStatus",
        //     render: ({ runStatus }) => {
        //       if (runStatus === 1) return "正常状态";
        //       if (runStatus === 0) return "离线状态";
        //       if (runStatus === 2) return "报警状态";
        //       if (runStatus === 3) return "停机状态";
        //     }
        //   },
        //   {
        //     label: "客户绑定状态",
        //     prop: "bindStatus",
        //     render: ({ bindStatus }) => {
        //       if (bindStatus === 0) return "未绑定";
        //       if (bindStatus === 1) return "已绑定";
        //     }
        //   }

        //   // {
        //   //   label: "芯片号",
        //   //   prop: "chipNo"
        //   // },
        //   // {
        //   //   label: "厂家代码",
        //   //   prop: "plantCode"
        //   // },
        //   // {
        //   //   label: "SIM卡号",
        //   //   prop: "simNo"
        //   // },

        //   // {
        //   //   label: "生产日期",
        //   //   prop: "producedDateStr"
        //   // },
        //   // {
        //   //   label: "备注",
        //   //   prop: "remarks"
        //   // }
        //   // {
        //   //   label: "状态",
        //   //   prop: "status",
        //   //   render: ({ status }) => {
        //   //     if (status === 0) return "禁用";
        //   //     if (status === 1) return "启用";
        //   //   }
        //   // }
        // ],
        formOptions: {
          inline: true,
          submitBtnText: "查询",
          width: 80,
          forms: [
            {
              prop: "codeType",
              label: "",
              // length:30,
              itemType: "select",
              options: [
                { id: 0, name: "SN" },
                { id: 1, name: "IMEI" },
                { id: 2, name: "资产编号" },
                { id: 3, name: "芯片号" }
              ],
              labelKey: "name",
              valueKey: "id",
              placeholder: "请选择",
              clearable: true
            },
            {
              prop: "params",
              label: "",
              length: 30,
              placeholder: "请输入过滤参数",
              clearable: true
            },
            {
              prop: "runStatus",
              label: "绑定状态",
              // length:30,
              itemType: "select",
              options: [
                { id: 0, name: "未绑定" },
                { id: 1, name: "已绑定" }
              ],
              labelKey: "name",
              valueKey: "id",
              placeholder: "请选择",
              clearable: true
            }
          ]
        }
      }
    };
  },
  methods: {
    batchBind() {
      console.log("this.checkedItems", this.checkedItems);
      console.log("this.s", this.orgs);
      const len = this.orgs.length;
      if (len === 0) {
        this.$message({
          message: "请选择一个所属组织",
          type: "error",
          showClose: true
        });
      } else {
        let relationDatas = [];

        this.checkedItems.forEach(item => {
          let relationObj = {};
          console.log("item.terminalNo", item.terminalNo);
          relationObj.orgId = this.orgs[len - 1];
          // relationObj.rank = len;
          relationObj.rank = 0;
          relationObj.terminalNo = item.terminalNo;
          relationDatas.push(relationObj);
        });
        const relData = {
          relation: relationDatas
        };
        console.log("relData", relData);
        batchBind(JSON.stringify(relData)).then(res => {
          console.log("res", res);
          if (res.returnCode === "0") {
            this.bindDialogVisible = false;
          }
        });
      }
    },
    confirmBind() {
      this.batchBind();
    },
    handleChange(val) {
      console.log("val", val);
    },
    formatTree(datas) {
      //遍历树  获取id数组
      let newitem = [];
      datas.map((item, i) => {
        let newData = {};
        newData.value = item.id;
        newData.label = item.organization;
        if (item.children.length > 0) {
          newData.children = this.formatTree(item.children);
        } //如果还有子集，就再次调用自己
        newitem.push(newData);
      });
      return newitem;
    },
    getOrganizationTree() {
      getOrganizationTree().then(res => {
        this.orgOptions = this.formatTree(res);
      });
    },
    refreshParentCodeOptions() {}
    // unbind(data) {
    //   console.log(data);
    //   if (!Array.isArray(data)) return;
    //   if (data.length === 0) {
    //     // this.$message.wraning("至少选择一个");
    //     this.$message({
    //       type: "warning",
    //       message: "至少选择一个",
    //       duration: 1000,
    //       showClose: true
    //     });
    //     return;
    //   }
    //   let params = data.map(it => {
    //     return {
    //       cusNo: it.cusNo,
    //       productId: it.productId,
    //       remarks: it.remarks
    //     };
    //   });
    //   this.$confirm("此操作将解绑产品, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(() => {
    //     // return;
    //     cusProUnbind(params).then(() => {
    //       this.$message({
    //         type: "success",
    //         message: "解绑成功!",
    //         duration: 1000,
    //         showClose: true
    //       });
    //       this.$refs.table.refresh();
    //     });
    //   });
    // }
  },
  created() {
    this.refreshParentCodeOptions();
  }
};
</script>
<style lang="scss">
.app-container-device .controls .el-button--warning {
  margin-right: 10px;
}
</style>
