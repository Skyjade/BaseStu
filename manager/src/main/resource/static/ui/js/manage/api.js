new Vue({
	el: "#api",
	data: function() {
		return {
			app_id: "",
			apiDataList: [], //列表数据
			searchName: '', //搜搜api名称
			chooseState: '1', //选择的状态,默认选择已启用
			stateOptions: [], //状态下拉菜单
			total_count: 0,
			currentPage: 1,
			page_size: 10,
			addDisabled: true, //权限按钮
			editDisabled: true,
			deleteDisabled: true,
			stateDisabled: true,
			addDialogShow: false, //弹出框
			editDialogShow: false,
			addform: {
				name: "",
				code: "",
				url: "",
				log_type: "",
				log_state: "",
				tags: "",
				app_id: ""
			},
			editform: {
				name: "",
				code: "",
				url: "",
				log_type: "",
				log_state: "",
				tags: "",
				app_id: ""
			},
			rules: {
				name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}, {
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				url: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				code: [{
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				app_id: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
			},
			logStateOptions: [{
				value: '1',
				text: ''
			}, {
				value: '0',
				text: ''
			}],
			viewConMenuDialog: false, //查看已配置菜单弹框
			menuListData: [], //已配置菜单数据
			SearchLabelList: [], //所属标签
			apiLabel: '', //接口所属标签查询值
			placeholderSearch: '', //所属标签条件查询输入框
			operateApp: [], //可操作的APP
			appOptions: [], //选择应用下拉菜单
			appQueryOptions: [], //检索区域选择应用下拉菜单
			searchAppID: "", //搜索框中的APPID
			typeOptions: [], //类型下拉菜单
			searchType: "" //搜索类型检索条件
		}
	},
	created: function() {
		Common.elementLng();
		this.app_id = Common.getUserInfo().app_id;
		this.international();
		var This = this;
		var codeList = ["UAP_COM_STATE", "API_TYPE"];
		HTTP.getCodeAndMenus(this, codeList, function(res) {
			This.stateOptions = res.data.codes["UAP_COM_STATE"];
			This.typeOptions = res.data.codes["API_TYPE"];
			This.userAuthentication(res.data.functions);
			This.operateApp = res.data.operate_apps;
			This.getApp(); //获取所有APP
		});

	},
	methods: {
		/**
		 * 根据配置用户菜单权限
		 * @param {Object} usermenus
		 */
		userAuthentication: function(usermenus) {
			if(usermenus.length > 0) {
				for(var i = 0; i < usermenus.length; i++) {
					if(usermenus[i].code == "ADD") {
						this.addDisabled = false;
					}
					if(usermenus[i].code == "EDIT") {
						this.editDisabled = false;
					}
					if(usermenus[i].code == "DELETE") {
						this.deleteDisabled = false;
					}
					if(usermenus[i].code == "STATE") {
						this.stateDisabled = false;
					}
				}
			}
		},
		/**
		 * 获取应用表格数据
		 */
		getApiList: function() {
			var httpUrl = "/uap/restApi/list";
			this.appDateList = [];
			var data = {};
			data.start = (this.currentPage - 1) * this.page_size;
			data.limit = this.page_size;
			data.app_id = this.searchAppID;
			data.type = this.searchType;
			if(this.chooseState != 99) {
				data.state = this.chooseState;
			}
			if(this.searchName !== "") {
				data.name = this.searchName;
			}
			if(this.apiLabel !== "") {
				data.tags = this.apiLabel;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var res = res.data;
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					rowObjitem.isOperate = false;
					//判断是否可操作
					for(var j = 0; j < This.operateApp.length; j++) {
						var obj = This.operateApp[j].id;
						if(rowObjitem.uap_app.id == obj) {
							rowObjitem.isOperate = true;
							break;
						} else {
							rowObjitem.isOperate = false;
						}
					};
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
					} else if(rowObjitem.state == "0") {
						rowObjitem.stateNo = false;
					}
					if(This.stateDisabled == false) {
						if(!rowObjitem.isOperate) {
							rowObjitem.isDisuse = true;
						} else {
							rowObjitem.isDisuse = false;
						}
					} else {
						rowObjitem.isDisuse = true;
					}
					if(rowObjitem.type == "1") {
						rowObjitem.typeName = $.t("api.schedule");
					} else if(rowObjitem.type == "0") {
						rowObjitem.typeName = $.t("api.common");
					}
				}
				This.apiDataList = res;
			});
		},
		/**
		 * 打开新增弹出框
		 */
		openAddDialog: function() {
			if(this.$refs['addApiForm'] != undefined) {
				this.$refs.addApiForm.resetFields();
			}
			this.addform = {
				name: "",
				code: "",
				url: "",
				log_type: "",
				log_state: "1",
				tags: "",
				app_id: "",
				type: "0"
			};
			this.addDialogShow = true;
		},
		/**
		 * 新增确认
		 */
		addConfirm: function() {
			if(this.addform.tags == "" || this.editform.tags == undefined) {
				this.$message({
					showClose: true,
					message: $.t("api.inputLabel"),
					type: 'error'
				});
				return;
			}
			var This = this;
			this.$refs.addApiForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/restApi";
					var data = {
						code: This.addform.code,
						name: This.addform.name,
						url: This.addform.url,
						app_id: This.addform.app_id,
						log_state: This.addform.log_state,
						log_type: This.addform.log_type,
						tags: This.addform.tags,
						type: This.addform.type
					}
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.addDialogShow = false;
						This.currentPage = 1;
						This.getApiList();
					});
				}
			});
		},
		/**
		 * 打开编辑弹出框
		 */
		openEditDialog: function(index, row) {
			if(!row.isOperate) {
				this.$message({
					showClose: true,
					message: $.t("common.noPermission"),
					type: 'error'
				});
				return;
			}
			if(this.$refs['editApiForm'] != undefined) {
				this.$refs.editApiForm.resetFields();
			}
			var This = this;
			var httpUrl = "/uap/restApi/" + row.id;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.editform = res.data;
				This.editform.app_id = res.data.uap_app.id;
				This.editDialogShow = true;
			});
		},

		/**
		 * 编辑确认
		 */
		editConfirm: function() {
			if(this.editform.tags == "" || this.editform.tags == undefined) {
				this.$message({
					showClose: true,
					message: $.t("api.inputLabel"),
					type: 'error'
				});
				return;
			}
			var This = this;
			this.$refs.editApiForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/restApi/" + This.editform.id;
					var data = {
						code: This.editform.code,
						name: This.editform.name,
						type: This.editform.type,
						url: This.editform.url,
						app_id: This.editform.app_id,
						log_state: This.editform.log_state,
						log_type: This.editform.log_type,
						tags: This.editform.tags,
						type: This.editform.type
					}
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.editDialogShow = false;
						This.getApiList();
						This.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
					});
				}
			});
		},
		/**
		 * 删除
		 */
		deleteApi: function(index, row) {
			if(!row.isOperate) {
				this.$message({
					showClose: true,
					message: $.t("common.noPermission"),
					type: 'error'
				});
				return;
			}
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton: true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm") {
						var data = {};
						var url = '/uap/restApi/' + row.id;
						HTTP.httpDelete(This, url, data, function(res) {
							This.$message({
								showClose: true,
								message: $.t("common.deleteSuccess"),
								type: 'success'
							});
							This.currentPage = 1;
							This.getApiList();
						});
					}
				}
			});
		},
		//查询API
		searchApi: function() {
			this.currentPage = 1;
			this.getApiList();
		},
		/**
		 * 业务组织状态改变
		 * @param {Object} list
		 */
		stateChange: function(list) {
			var This = this;
			var state = "";
			if(list.stateNo) {
				state = 1;
			} else {
				state = 0;
			}
			var data = state;
			var httpUrl = '/uap/restApi/' + list.id + '/state';
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: i18n.t("common.updateSuccess"),
					type: 'success'
				});
				This.getApiList();
			});
		},
		handleSizeChange: function(val) {
			this.page_size = val;
			this.getApiList();
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.start = this.page_size * (this.currentPage - 1);
			this.getApiList();
		},
		//查看已配置菜单
		viewConMenu: function(index, row) {
			var This = this;
			var httpUrl = "/uap/restApi/" + row.id;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.menuListData = res.data.menu_list;
				This.viewConMenuDialog = true;
			});
		},
		//模糊搜索接口标签
		querySearchLabel: function(queryString, cb) {
			if(this.apiLabel == "") {
				queryString = "";
				this.currentPage = 1;
				this.getApiList();
			}
			var SearchLabelList = [];
			var This = this;
			if(queryString == "" || queryString != "") {
				this.loadAllLabel(function() {
					var SearchLabelList = This.SearchLabelList;
					var results = queryString ? SearchLabelList.filter(This.createFilter(queryString)) : SearchLabelList;
					// 调用 callback 返回建议列表的数据
					cb(results);
				});
			}
		},
		createFilter: function(queryString) {
			return function(SearchLabelList) {
				return(SearchLabelList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		//查询所有接口标签
		loadAllLabel: function(success) {
			var This = this;
			var url = '/uap/restApi/tags';
			var data = {};
			data.app_id = this.app_id;
			HTTP.httpPost(this, url, data, function(res) {
				This.SearchLabelList = res.data;
				success();
			});
		},
		//选择接口标签时调用的方法
		handleSelectLabel: function(item) {
			this.currentPage = 1;
			this.getApiList();
		},
		//获取所有应用
		getApp: function() {
			var This = this;
			var httpUrl = "/uap/app/list";
			var data = {};
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var appOptions = res.data;
				This.appQueryOptions = appOptions;
				if(Common.getUserInfo().app_type != 1) {
					This.appOptions = This.operateApp;
				} else {
					This.appOptions = appOptions;
				}
				This.searchAppID = This.app_id;
				This.getApiList();
			});
		},
		/**
		 * 国际化
		 */
		international: function() {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.name[0].message = $.t("common.inputName");
				This.rules.url[0].message = $.t("api.inputURL");
				This.rules.name[1].message = $.t("common.inputLength");
				This.rules.code[0].message = $.t("common.inputLength");
				This.logStateOptions[0].text = $.t("api.enabled");
				This.logStateOptions[1].text = $.t("api.disabled");
				This.placeholderSearch = $.t("api.inputLabel");
				This.rules.app_id[0].message = $.t("common.selectApp");
				//This.rules.tags[0].message = $.t("api.inputLabel");
			});
		}
	}
});