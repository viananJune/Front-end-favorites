1、dialog
 hisDialogMaps: {
        view: {
          title: '',
          slotName: 'hisTrack',
          width: '48vw'
        }
      }


 <v-dialog ref="trace"
              :dialog-maps="hisDialogMaps"
              :title="busNumber"
              :append-to-body="true">
      <template #hisTrack>
        <his-track :bus-no="busNo"
                   :hisprops="hisprops"></his-track>
      </template>
    </v-dialog>



1、form下拉框

{
            label: "状态",
            prop: "stateId",
            itemType: 'select',
            options: [
              { value: 0, label: '空闲' },
              { value: 1, label: '预约' },
              { value: 2, label: '已连接' },
              { value: 5, label: '正在充电' },
              { value: 6, label: '停止充电' },
              { value: 7, label: '故障' },
              { value: 8, label: '离线' },
            ]
          },
          {
            label: "厂商",
            prop: "opchargerId",
            itemType: 'select',
            selectUrl: '/api/equipproductinfos/getList',
            selectParams: { type: 1 },
            labelKey: 'productName',
            valueKey: 'id'

          }
2、dialog 下拉框

select：（）=>{
return [
{id:'value',
name:'label'}]}





