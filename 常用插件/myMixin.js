import Vue from "vue";
import serverUrl from "@/api/traffic/index";
import format from "date-fns/format";
const coordtransform = require('coordtransform');
import {getAllDict} from "ve-framework/api/dict";
// import menu from "@/router/menu";
// import addDays from "date-fns/add_days";
 (function (win, doc) {
        //rem自适应
        var root = doc.getElementsByTagName("html")[0]; //根元素
        // console.log(root);
        function refresh() {
          var width = doc.documentElement.clientWidth || doc.body.clientWidth;
          var fontSize = width / 100 + "px";
          root.style.fontSize = fontSize;
        }
        win.addEventListener("DOMContentLoaded", refresh, false);
        win.addEventListener("resize", refresh, false);
      })(window, document);
const myMixin = {
	data() {
		return {
			//图片前缀
			imaSrc: location.origin +  "/adas/api/",
			//图片地址前缀
			picSrc: process.env.VUE_APP_BASE_SRC + "/",
			//上传地址
			uploadAddress: process.env.VUE_APP_BASE_API + "/file/upload",
			//serverUrl的全局api对象
			api: serverUrl,
			//分页的初始值
			paging: {
				total: 0,
				pageSize: 20,
				page: 1
			}
		};
	},
	/* created(){
	  if(this.$options&&this.$route){
			if(!this.$options.name){
				this.$options.name = this.$route.name;
			}
		}
	}, */
	methods: {
		/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
 bd09togcj02(bd_lon, bd_lat) {
    var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    var x = bd_lon - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return {lng:gg_lng, lat:gg_lat}
},
		// 国测局j02转wgs84
		gcj02towgs84(lng, lat) {
			var PI = 3.1415926535897932384626;
			var a = 6378245.0;
			var ee = 0.00669342162296594323;
			if (this.out_of_china(lng, lat)) {
				return [lng, lat]
			}
			else {
				var dlat = this.transformlat(lng - 105.0, lat - 35.0);
				var dlng = this.transformlng(lng - 105.0, lat - 35.0);
				var radlat = lat / 180.0 * PI;
				var magic = Math.sin(radlat);
				magic = 1 - ee * magic * magic;
				var sqrtmagic = Math.sqrt(magic);
				dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
				dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
			var	mglat = lat + dlat;
			var mglng = lng + dlng;
				return {lng:lng * 2 - mglng, lat:lat * 2 - mglat}
			}
		},
		/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
 wgs84togcj02(lng, lat) {
	var PI = 3.1415926535897932384626;
	var a = 6378245.0;
	var ee = 0.00669342162296594323;
		if (this.out_of_china(lng, lat)) {
			return [lng, lat]
		}
		else {
			var dlat = this.transformlat(lng - 105.0, lat - 35.0);
			var dlng = this.transformlng(lng - 105.0, lat - 35.0);
			var radlat = lat / 180.0 * PI;
			var magic = Math.sin(radlat);
			magic = 1 - ee * magic * magic;
			var sqrtmagic = Math.sqrt(magic);
			dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
			dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
			var mglat = lat + dlat;
			var mglng = lng + dlng;
			return {lng:mglng, lat:mglat}
		}
	},
	/**
	 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
	 * 即谷歌、高德 转 百度
	 * @param lng
	 * @param lat
	 * @returns {*[]}
	 */
	 gcj02tobd09(lng, lat) {
	 var x_PI = 3.14159265358979324 * 3000.0 / 180.0;

		var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
		var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
		var bd_lng = z * Math.cos(theta) + 0.0065;
		var bd_lat = z * Math.sin(theta) + 0.006;
		return {lng:bd_lng, lat:bd_lat}
	},
	 transformlat(lng, lat) {
	var PI = 3.1415926535897932384626;
		var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
		ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
		ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
		return ret
	},

	 transformlng(lng, lat) {
	var PI = 3.1415926535897932384626;
		var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
		ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
		ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
		ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
		return ret
	},

	/**
	 * 判断是否在国内，不在国内则不做偏移
	 * @param lng
	 * @param lat
	 * @returns {boolean}
	 */
	 out_of_china(lng, lat) {
		return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
	},
	// wgs84转bd09
	   g84Tobd09Object(res){
		   //wgs84转国测局j02
	   let data= this.wgs84togcj02(res.lng,res.lat)
	    //j02转百度bd09
	   let bd= this.gcj02tobd09(data.lng,data.lat)
	   return {lng:bd.lng.toFixed(6),lat:bd.lat.toFixed(6)}
	   },
	   g84Tobd09Arry(res){
		   //wgs84转国测局j02
		   let data= this.wgs84togcj02(res[0],res[1])
		   //j02转百度bd09
		  let bd= this.gcj02tobd09(data.lng,data.lat)
		  return [bd.lng.toFixed(6),bd.lat.toFixed(6)]
	   },
	   	// bd09转wgs84
		   bd09Tog84Object(res){

			//wgs84转国测局j02
		let data= this.bd09togcj02(res.lng,res.lat)

		 //j02转百度bd09
		let bd= this.gcj02towgs84(data.lng,data.lat)
		return {lng:bd.lng.toFixed(6),lat:bd.lat.toFixed(6)}
		},
		refresh() {
			this.$refs.table.$refs.searchForm.searchHandler();
		},
		handleCreate() {
			//1.初始化数据
			this.ruleForm = Object.assign({}, this.ruleFormInit); // copy obj

			//2.显示对话框
			this.dialogStatus = "create";
			this.dialogFormVisible = true;

			//3.渲染完成重置表单 - 移除表单项的校验结果
			this.$nextTick(() => {
				// 这里不能用 resetFields() 方法，否则值不会初始化
				this.$refs["ruleForm"].clearValidate();
			});
		},
		handleView(row) {
			//1.赋值（用row数据）
			this.ruleForm = Object.assign({}, this.ruleFormInit, row); // copy obj

			//2.显示对话框
			this.dialogStatus = "view";
			this.dialogFormVisible = true;

			//3.移除表单项的校验结果
			this.$nextTick(() => {
				this.$refs["ruleForm"].clearValidate();
			});
		},
		handleUpdate(row) {
			//1.赋值（用row数据）
			this.ruleForm = Object.assign({}, this.ruleFormInit, row); // copy obj
			//2.显示对话框
			this.dialogStatus = "update";
			this.dialogFormVisible = true;
			//3.移除表单项的校验结果
			this.$nextTick(() => {
				this.$refs["ruleForm"].clearValidate();
			});
		},
		mapInit() {
			let gis = sessionStorage.getItem("mapCenter");
			if(!gis){
				getAllDict().then(data=>{
					if(Array.isArray(data)){
						data.forEach(item=>{
							if(item.dictType === "MAP_CENTER"){
								if(item.fieldName ==="LNG"){
										this.defaultCenter.lng = item.fieldType;
								}else if(item.fieldName ==="LAT"){
									this.defaultCenter.lat = item.fieldType;
								}
							}
						})
						this.mapOption.center.lng = this.defaultCenter.lng;
						this.mapOption.center.lat = this.defaultCenter.lat;
						sessionStorage.setItem("mapCenter",this.defaultCenter.lng.toString()+','+this.defaultCenter.lat.toString());
					}

				})
			}
			let zoom = sessionStorage.getItem("mapLevel");
			if (gis) {
				this.mapOption.center.lng = parseFloat(gis.split(',')[0]);
				this.mapOption.center.lat = parseFloat(gis.split(',')[1]);
				this.defaultCenter = this.mapOption.center
			}
			if (zoom) {
				this.mapOption.zoom = parseInt(JSON.parse(zoom));
				this.defaultZoom = this.mapOption.zoom
			}
		},
		getfieldList(code) {
			this.$axios({
				url: this.api.setting + "/fieldList/"+code,
				method: "GET",
			}).then(res => {
				if (res) {
					if(res.field){
						var temp = [];
						res.field.forEach(e => {
							var column;
							let b = this.columns.some(item => {
								if (e.fieldName == item.prop) {
									column = item
									column.label = e.fieldLabel
									return true;
								} else {
									return false;
								}
							})
							if (!b) {
								column = {
									label: e.fieldLabel,
									prop: e.fieldName
								}
							}
							if(res.dicts){
								res.dicts.some( d =>{
									if(d.val == column.prop && d.val2 == '1'){
										column =  {
											label: d.name,
											prop: d.val,
											render: row => {
												const  stateType  = row[d.val];
												let vindex
												let have = d.childer.some((v,index) =>{
													if(v.val == stateType){
														vindex = index;
														return true
													}else {
														return false
													}
												})
												if(have){
													return d.childer[vindex].name
												}else {
													return stateType
												}
											}
										}
										return true;
									}else {
										return false;
									}
								})
							}
                            if(e.fmtTxt){
                                column.render= function render(row) {
                                    let val = row[e.fieldName];
                                    let date = new Date(val)
                                    if(date == "Invalid Date") return val
                                    let fmt = e.fmtTxt.replace(/y/g,'Y').replace(/d/g,"D");
                                    return format(date,fmt);
                                }
                            }
                            column.align = "center"
							temp.push(column)
						})
						this.columns = temp
					}
					if(res.dicts){
						let temp = this.formOptions.forms;
						res.dicts.forEach(e => {
						    if(e.val1 == '1'){
                                let b = temp.some(item => {
                                    if (e.val == item.prop ) {
                                        item.label = e.name
                                        item.options = this.selectVal(e)
                                        return true;
                                    } else {
                                        return false;
                                    }
                                })
                                if (!b) {
                                    const form = {
                                        prop: e.val,
										modelValue: e.val,
                                        label: e.name,
                                        itemType: "select",
                                        clearable: true,
                                        options: this.selectVal(e),
                                    };
									temp.push(form)
                                }
                            }
						})
					}
				}
			});
		},
		selectVal(data){
			var opts = [];
			if(data && data.childer.length>0){
				data.childer.forEach(e =>{
					let opt = {
						value: e.val,
						label: e.name
					}
					opts.push(opt)
				})
				return opts;
			}
			return null;
		},
		getDict(pid){
			return this.$axios({
				url: this.api.dict + "/list",
				method: "GET",
				params: {
					pid: pid
				}
			})
		},
		addDict(dict){
			return this.$axios({
				url: this.api.dict,
				method: "POST",
				data: dict
			}).then(res => {
				return res;
			})
		},
		deleteDict(dist){
			return this.$axios({
				url: this.api.dict+"/"+dist.id,
				method: "DELETE",
			})
		},
		handleImportMethod() {
			this.dialogOfImport = false
			this.refresh();
		},
		downloadTemplate() {
			// var url = location.origin + this.baseURL+ "/api/"+ this.exportData.expFilePath     //本地
			debugger;
			var url = location.origin + this.exportData.expFilePath
			// console.log(url)
			var a = document.createElement('a');
			document.body.appendChild(a);
			a.setAttribute('style', 'display:none');
			a.setAttribute('href', url);
			a.setAttribute('download', this.exportData.expFileName);
			a.click();
			a.parentNode.removeChild(a);
		},
		toImport(info) {
			// console.log('iiii',info)
			this.dialogStatus = "import";
			this.dialogOfImport = true;
		},
		toExport(url, table,fileName,par) {
			table.$refs.searchForm.getParams((error, params) => {
				if (!error) {
					let data = Object.assign(params,par);
					this.$axios({
						url: url,
						method: "get",
						data: data,
						responseType: 'blob'
					}).then(res => {
						this.dialogStatus = "export";
						// this.dialogOfExport = true;
						var blob = new Blob([res.data])
						var downloadElement = document.createElement('a');
					　　var href = window.URL.createObjectURL(blob); //创建下载的链接
					　　downloadElement.href = href;
					　　downloadElement.download = fileName+'.xlsx'; //下载后文件名
					　　document.body.appendChild(downloadElement);
					　　downloadElement.click(); //点击下载
					　　document.body.removeChild(downloadElement); //下载完成移除元素
					　　window.URL.revokeObjectURL(href); //释放掉blob对象

						this.exportData = res;
					});
				}
			});
		},
		toExportTask(){
			this.dialogOfExport = false
			this.$router.push({path:'/basicmanagement/exportTask'});
		},
		createDataMethod(url, data) {
			this.$refs["ruleForm"].validate(valid => {
				if (valid) {

					this.$axios({
						url: url,
						method: "post",
						data: data
					}).then(res => {
						// 关闭弹出框
						this.dialogFormVisible = false;
						//成功提示
						this.$message({
							message: "成功",
							type: "success"
						});
						// 刷新下拉
						this.$refs.table.$refs.searchForm.handleSelectRequest(["filaNo", "filaName", "groupNo", "groupName", "lineNo","lineName","busNo","planNo"]);
						// 刷新列表
						this.refresh();
					});
				}
			});
		},
		createDataMethods(url, data) {
					this.$axios({
						url: url,
						method: "post",
						data: data
					}).then(res => {
						// 关闭弹出框
						this.dialogFormVisible = false;
						//成功提示
						this.$message({
							message: "成功",
							type: "success"
						});
						// 刷新下拉
						this.$refs.table.$refs.searchForm.handleSelectRequest(["filaNo", "filaName", "groupNo", "groupName", "lineNo","lineName","busNo","planNo"]);
						// 刷新列表
						this.refresh();
					});


		},
		handleDeleteMethod(url) {
			this.$confirm("确认删除该条记录么?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				this.$axios({
					url: url,
					method: "DELETE"
				}).then(() => {
					//成功提示
					this.$message({
						type: "success",
						message: "删除成功!"
					});
					//刷新下拉
					this.$refs.table.$refs.searchForm.handleSelectRequest(["filaNo", "filaName", "groupNo", "groupName", "lineName","busNo","planNo"]);
					// 刷新列表
					this.refresh();
				});
			});
		},
		updateDataMethod(url, data) {
			this.$refs["ruleForm"].validate(valid => {
				if (valid) {
					this.$axios({
						url: url,
						method: "PUT",
						data: data
					}).then(() => {
						// 关闭弹出框
						this.dialogFormVisible = false;
						//成功提示
						this.$message({
							message: "更新成功",
							type: "success"
						});
						//刷新下拉
						this.$refs.table.$refs.searchForm.handleSelectRequest(["filaNo", "filaName", "groupNo", "groupName", "lineName","busNo","planNo"]);
						// 刷新列表
						this.refresh();
					});
				}
			});
		},
		updateMethods(url, data) {
			this.$refs["ruleForm"].validate(valid => {
				if (valid) {
					this.$axios({
						url: url,
						method: "POST",
						data: data
					}).then(() => {
						// 关闭弹出框
						this.dialogFormVisible = false;
						//成功提示
						this.$message({
							message: "更新成功",
							type: "success"
						});
						//刷新下拉
						this.$refs.table.$refs.searchForm.handleSelectRequest(["filaNo", "filaName", "groupNo", "groupName", "lineName","busNo","planNo"]);
						// 刷新列表
						this.refresh();
					});
				}
			});
		},
		// 方位角转方位名称
		transformDirection(direction) {
			if (direction == 0) return "正北";
			if (direction == 90) return "正东";
			if (direction == 180) return "正南";
			if (direction == 270) return "正西";
			if (direction > 0 && direction < 90) return "东北";
			if (direction > 90 && direction < 180) return "东南";
			if (direction > 180 && direction < 270) return "西南";
			if (direction > 270 && direction < 360) return "西北";
			if (!direction) return "";
		},
		// 坐标转地理位置
		getPosition(item) {
			return this.$axios({
				method: "get",
				url: this.api.coordinateToPosition,
				params: {
					lng: item.lng,
					lat: item.lat
				}
			}).then(res => {
				return res ? res : `${item.lng}, ${item.lat}`;
			});
		},
		// 设备坐标转百度坐标
		wgs84tobd09(lng, lat) {
			let mid = coordtransform.wgs84togcj02(lng, lat);
			return coordtransform.gcj02tobd09(mid[0], mid[1]);
		},
		// 设备坐标转百度坐标对象形式
		wgs84tobd09OfObject(data) {
			// console.log('dasd',data.lng,data.lat)
			let mid = coordtransform.wgs84togcj02(data.lng, data.lat);
			mid = coordtransform.gcj02tobd09(mid[0], mid[1]);
			data.lng = mid[0]
			data.lat = mid[1]
			return data
		},
		// 百度坐标转设备坐标
		bd09towgs84(lng, lat) {
			let mid = coordtransform.bd09togcj02(lng, lat);
			return coordtransform.gcj02towgs84(mid[0], mid[1]);
		},
		// 百度坐标转设备坐标
		bd09towgs84OfObject(data) {
			let mid = coordtransform.bd09togcj02(data.lng, data.lat);
			mid = coordtransform.gcj02towgs84(mid[0], mid[1]);
			data.lng = mid[0]
			data.lat = mid[1]
			return data
		},
		// 隔行添加变色
		tableRowClassName({
			// eslint-disable-next-line
			row,
			rowIndex
		}) {
			if (rowIndex % 2 == 1) {
				return "table-row";
			}
			return "";
		},
		// 分页 - 每页多少条
		// eslint-disable-next-line
		handleSizeChange(size) {
			this.getData();
		},
		// 分页 - 第几页
		// eslint-disable-next-line
		handleCurrentChange(page) {
			// console.log(page);
			this.getData();
		},
		// 使用 async/await 实现异步 - this.paging.total的异步赋值,边界情况及渲染两次的处理
		async handleTotalChange(total) {
			let tempPage = this.paging.page;
			await (this.paging.total = total);
			if (this.paging.page < tempPage) {
				this.getData();
				return true;
			}
		},
		//重置表单
		resetForm(formName) {
			if (this.$refs[formName]) {
				// this.$refs[formName].resetFields();
				this.$refs[formName].clearValidate();
			}
		},
		//picSrc 前缀的动态处理
		prefixSrc(path) {
			if (!path) {
				return "";
			}
			return path.startsWith("http") ? path : this.picSrc + path;
		},
		// dateRange 请求前的格式转换
		dateRangeConvert() {
			let startdate = "";
			let enddate = "";
			if (this.formInline.dateRange === null) {
				this.formInline.dateRange = [];
			}
			if (this.formInline.dateRange.length) {
				startdate = format(this.formInline.dateRange[0], "YYYY-MM-DD");
				//					enddate = format(addDays(this.formInline.dateRange[1], 1), 'YYYY-MM-DD');
				enddate = format(this.formInline.dateRange[1], "YYYY-MM-DD");
			}
			return {
				startdate,
				enddate
			};
		},
		// 表格多选,当选择项发生变化时会触发该事件 - 下载
		handleSelectionChangeDownload(selection) {
			//selection  是一个  [{row},{row},{row}]
			//checkbox只要有选中的，按钮就可以点击。
			if (selection.length) {
				this.isDisabled = false;
			} else {
				this.isDisabled = true;
			}

			let idsArray = [];
			for (const row of selection) {
				idsArray.push(row.id);
			}
			this.ids = idsArray;
		},
		// 手动初始化vue应用中的路由规则，vue-router 中有自己独立的路由规则。
		initRouterRule(dynamicRoute) {
			// router 不是响应式的，所以手动初始化路由规则
			this.$router.options.routes.splice(1);

			// 一.根据动态路由数据渲染动态菜单（菜单的数据结构可以和路由不同，菜单可以是多层的，路由可以是一层的）
			// this.$root.$data 获取到的是 main.js 中 new Vue() 中的data, 全局共享，全局都能改变。
			// this 和 this.$root 不是同一个组件，this 是 Vue 组件，this.$root 是实例化的 Object。
			// /operation  下的 children 部分是左侧菜单的渲染数据
			this.$root.$data.menuData = dynamicRoute[0].children[0].children;

			// 二.合并路由
			// 1.动态路由的处理：路由匹配规则由多维变为一维（递归数组）
			let processedDynamicRoute = [];
			let recursive = menuList => {
				for (const iterator of menuList) {
					if (iterator.children) {
						recursive(iterator.children);
					} else {
						processedDynamicRoute.push(iterator);
					}
				}
			};
			recursive(dynamicRoute[0].children[0].children);

			// 2.静态路由的处理：根据动态路由规则筛选静态路由规则
			let staticRoute = menu.getStaticRoute();
			let processedStaticRoute = [];
			for (const iterator of dynamicRoute[0].children[0].children) {
				for (const element of staticRoute) {
					if (element.name.startsWith(iterator.name)) {
						processedStaticRoute.push(element);
					}
				}
			}

			// 3.合并动态路由规则和静态路由规则
			dynamicRoute[0].children[0].children = [
				...processedDynamicRoute,
				...processedStaticRoute
			];

			// 4.动态添加路由规则
			this.$router.addRoutes(dynamicRoute);

			// 5.router 不是响应式的，所以手动合并路由规则 (es6的扩展运算符实现数组合并)
			this.$router.options.routes = [
				...this.$router.options.routes,
				...dynamicRoute
			];
		}
	}
};

// 插件 - 通过全局 mixin 方法添加一些组件选项
var MyMixinPlugin = {};

MyMixinPlugin.install = function (Vue) {
	Vue.mixin(myMixin);
};

Vue.use(MyMixinPlugin);
