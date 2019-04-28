new Vue({
	el: "#log",
	data: function() {
		return {
			logDataList: [], //列表数据
			total_count: 0,
			currentPage: 1,
			page_size: 10,
			deleteDisabled: true,
			selTreeNode: {}, //当前选择的菜单
			searchData: [], //搜索时间
			detailsDialog: false, //查看详情弹框
			param: "", //访问参数
			result: "", //返回参数
			searchInput: "", //模糊搜索输入框
			//日期禁用状态
			pickerOptionsDateLimit: {
				disabledDate: function(time) {
					return time.getTime() > Date.now();
				}
			},
		}
	},
	created: function() {
		Common.elementLng();
		this.international();
		var This = this;
		var codeList = ["UAP_COM_STATE"];
		HTTP.getCodeAndMenus(this, codeList, function(res) {
			This.stateOptions = res.data.codes["UAP_COM_STATE"];
			if(This.stateOptions.length > 0) {
				This.chooseState = "1";
				This.getLogList();

			}
			This.userAuthentication(res.data.functions);
		});
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth();
		var day = date.getDate();
		this.searchData = [new Date(year, month, day, 0, 0).getTime(), new Date(year, month, day, 23, 59, 59).getTime()];
	},
	methods: {
		/**
		 * 根据配置用户菜单权限
		 * @param {Object} usermenus
		 */
		userAuthentication: function(usermenus) {
			if(usermenus.length > 0) {
				for(var i = 0; i < usermenus.length; i++) {
					if(usermenus[i].code == "DELETE") {
						this.deleteDisabled = false;
					}
				}
			}
		},
		handleSizeChange: function(val) {
			this.page_size = val;
			this.getLogList();
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.start = this.page_size * (this.currentPage - 1);
			this.getLogList();
		},
		searchLog: function() {
			this.currentPage = 1;
			this.getLogList();
		},
		/**
		 * 获取应用表格数据
		 */
		getLogList: function() {
			var httpUrl = "/uap/log/list";
			this.appDateList = [];
			var data = {};
			data.start = (this.currentPage - 1) * this.page_size;
			data.limit = this.page_size;
			if(this.searchName !== "") {
				data.name = this.searchName;
			}
			if(this.selTreeNode.id) {
				data.menu_id = this.selTreeNode.id;
			}
			if(this.searchData != null && this.searchData.length > 0) {
				data.access_time = this.searchData[0];
				data.end_time = this.searchData[1];
			}
			if(this.searchInput !== "") {
				data.url = this.searchInput;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var res = res.data;
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					if(rowObjitem.access_time) {
						rowObjitem.access_time = Common.getFormatDateByLong(rowObjitem.access_time, "yyyy-MM-dd hh:mm:ss S");
					}
					if(rowObjitem.end_time) {
						rowObjitem.end_time = Common.getFormatDateByLong(rowObjitem.end_time, "yyyy-MM-dd hh:mm:ss S");
					}
				}
				This.logDataList = res;
			});
		},
		//国际化
		international: function() {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
			});
		},
		//打开查看详情弹框
		openDetailsDialog: function(index, row) {
			this.param = row.param;
			this.result = row.result;
			this.detailsDialog = true;
		},
	},
})