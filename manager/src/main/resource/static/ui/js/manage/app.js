new Vue({
	el: "#app",
	data: function() {
		//校验再次输入密码框
		var thisForm = this;
		var addUserValidatePass = function(rule, value, callback) {
			if(value === '') {
				callback(new Error($.t('user.passwordAgain')));
			} else if(value !== thisForm.addform.scret) {
				callback(new Error($.t('user.differentPassword')));
			} else {
				callback();
			}
		};
		return {
			isSelect: false,
			addform: {}, //新增应用弹框数据
			editform: {
				parent_name: "",
				name: "",
				type: "0",
				code: "",
				url: ""
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
				org_name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				user_no: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				type: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				code: [{
					required: true,
					message: "",
					trigger: 'blur'
				}, {
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				scret: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				confirm_password: [{
					required: true,
					validator: addUserValidatePass,
					trigger: 'blur'
				}],
			},
			addDisabled: true, //权限按钮
			editDisabled: true,
			deleteDisabled: true,
			stateDisabled: true,
			stateOptions: [], //app状态
			chooseState: '', //选择的状态
			stateOptions: [], //状态下拉菜单
			typeOptions: [],
			searchName: '', //搜搜app名称
			selAppData: "", //表格中选中的行数据
			addDialogShow: false,
			editDialogShow: false,
			appDataList: [], //api列表
			total_count: 0,
			currentPage: 1,
			page_size: 10,
			operateApp: [], //可操作的APP
			operableAppOptions: [], //可操作的应用下拉菜单，编辑新增使用
			appTypeDisabled: false, //是否可以修改应用类型
		}
	},
	created: function() {
		Common.elementLng();
		this.international();
		var This = this;
		//获取应用状态和类型
		var codeList = ["UAP_COM_STATE", "APP_TYPE"];
		HTTP.getCodeAndMenus(this, codeList, function(res) {
			This.stateOptions = res.data.codes["UAP_COM_STATE"];
			This.typeOptions = res.data.codes["APP_TYPE"];
			This.userAuthentication(res.data.functions);
			This.operateApp = res.data.operate_apps;
			if(This.stateOptions.length > 0) {
				This.chooseState = "1";
				This.getAppList();
			}
			This.getOperableAppOptions();
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
				This.rules.name[1].message = $.t("common.inputLength");
				This.rules.org_name[0].message = $.t("common.inputBaseOrg");
				This.rules.user_no[0].message = $.t("common.inputBaseOrg");
				This.rules.password[0].message = $.t("common.inputPassword");
				This.rules.type[0].message = $.t("common.selectType");
				This.rules.code[0].message = $.t("common.inputCode");
				This.rules.code[1].message = $.t("common.inputLength");
				This.rules.scret[0].message = $.t("common.inputPassword");
			});
		},
		handleSelectionChange: function(val) { //table多选
			this.selAppData = val;
		},
		/**
		 * 打开新增弹出框
		 */
		openAddDialog: function() {
			var This = this;
			if(this.$refs['addAPPForm'] != undefined) {
				this.$refs.addAPPForm.resetFields();
			}
			this.addform = {
				name: "",
				type: "",
				code: "",
				url: "",
				parent_name: "",
				parent_id: "",
				scret: "",
				confirm_password: "",
			};
			if(this.typeOptions.length > 0) {
				this.addform.type = "0";
			}
			this.appTypeDisabled = false;
			this.addDialogShow = true;
		},
		/**
		 * 新增确认
		 */
		addConfirm: function() {
			var This = this;
			this.$refs.addAPPForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/app";

					if(This.addform.scret != "") {
						This.addform.scret = hex_md5(This.addform.scret);
					}
					var data = {
						name: This.addform.name,
						type: This.addform.type,
						code: This.addform.code,
						url: This.addform.url,
						parent_id: This.addform.parent_id,
						scret: This.addform.scret
					};
					var This1 = This;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This1.addDialogShow = false;
						window.location.reload(true);
					});
				}
			})

		},
		/**
		 * 打开编辑弹出框
		 */
		openEditDialog: function(index, row) {
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(row.id == obj) {
					isOperate = true;
					break;
				} else {
					isOperate = false;
				}
			}
			if(!isOperate) {
				this.$message({
					showClose: true,
					message: $.t("common.noPermission"),
					type: 'error'
				});
				return;
			}
			if(this.$refs['editAPPForm'] != undefined) {
				this.$refs.editAPPForm.resetFields();
			}
			this.appTypeDisabled = false;
			var This = this;
			var httpUrl = "/uap/app/" + row.id;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.editform = res.data;
				if(This.editform.parent_name !== undefined) {
					This.appTypeDisabled = true;
				}
				This.editDialogShow = true;
			});
		},

		/**
		 * 编辑确认
		 */
		editConfirm: function() {
			var This = this;
			this.$refs.editAPPForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/app/" + This.editform.id;
					var data = {
						code: This.editform.code,
						name: This.editform.name,
						type: This.editform.type,
						url: This.editform.url
					}
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.getAppList();
						This.editDialogShow = false;
						This.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
					});
				}
			});
		},
		//根据状态查询组织数据
		selectState: function() {
			this.currentPage = 1;
			this.getAppList();
		},
		/**
		 * 业务组织状态改变
		 * @param {Object} list
		 */
		stateChange: function(list) {
			var state = "";
			if(list.stateNo) {
				state = 1;
			} else {
				state = 0;
			}
			var data = state;
			var This = this;
			var httpUrl = '/uap/app/' + list.id + '/state';
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: i18n.t("common.updateSuccess"),
					type: 'success'
				});
				This.getAppList();
			}, function(error) {
				This.getAppList();
			})
		},
		/**
		 * 删除
		 */
		deleteApp: function(index, row) {
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(row.id == obj) {
					isOperate = true;
					break;
				} else {
					isOperate = false;
				}
			}
			if(!isOperate) {
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
						var url = '/uap/app/' + row.id;
						HTTP.httpDelete(This, url, data, function(res) {
							This.$message({
								showClose: true,
								message: $.t("common.deleteSuccess"),
								type: 'success'
							});
							This.currentPage = 1;
							This.getAppList();
						});
					}
				}
			});
		},
		handleSizeChange: function(val) {
			this.page_size = val;
			this.getAppList();
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.start = this.page_size * (this.currentPage - 1);
			this.getAppList();
		},
		//根据名称查询APP
		searchApp: function() {
			this.currentPage = 1;
			this.getAppList();
		},
		/**
		 * 获取应用表格数据
		 */
		getAppList: function() {
			var httpUrl = "/uap/app/list";
			this.appDataList = [];
			var data = {};
			data.start = (this.currentPage - 1) * this.page_size;
			data.limit = this.page_size;
			if(this.chooseState != 99) {
				data.state = this.chooseState;
			}
			if(this.searchName !== "") {
				data.name = this.searchName;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var res = res.data;
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
					} else if(rowObjitem.state == "0") {
						rowObjitem.stateNo = false;
					}
					if(rowObjitem.type == 0) {
						rowObjitem.type = $.t('app.type0');
					} else if(rowObjitem.type == 1) {
						rowObjitem.type = $.t('app.type1');
					}
					if(!This.deleteDisabled) {
						for(var j = 0; j < This.operateApp.length; j++) {
							if(rowObjitem.id == This.operateApp[j].id) {
								rowObjitem.stateDisabled = false;
								break;
							} else {
								rowObjitem.stateDisabled = true;
							}
						}
					} else {
						rowObjitem.stateDisabled = true;
					}
				}
				This.appDataList = res;
			});
		},
		//刷新应用接口
		refreshApp: function(index, row) {
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(row.id == obj) {
					isOperate = true;
					break;
				} else {
					isOperate = false;
				}
			}
			if(!isOperate) {
				this.$message({
					showClose: true,
					message: $.t("common.noPermission"),
					type: 'error'
				});
				return;
			}
			var This = this;
			this.$alert($.t("app.confirmRefApp"), "", {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton: true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm") {
						var data = {};
						var httpUrl = '/uap/app/' + row.id + "/api";
						HTTP.httpPut(This, httpUrl, data, function(res) {
							This.$message({
								showClose: true,
								message: $.t("app.refreshSuccess"),
								type: 'success'
							});
							This.getAppList();
						});
					}
				}
			});
		},
		//获取编辑新增时可操作APP下拉菜单数据
		getOperableAppOptions: function() {
			var rowObj = [];
			for(var i = 0; i < this.operateApp.length; i++) {
				if(this.operateApp[i].parent_id == undefined) {
					rowObj.push(this.operateApp[i]);
				}
			}
			this.operableAppOptions = rowObj;
		},
		//新增编辑时使用，选择上级应用时
		selectOperableApp: function(appID) {
			if(appID != "") {
				var obj = {};
				obj = this.operableAppOptions.find(function(item) { //这里的userList就是上面遍历的数据源
					return item.id === appID; //筛选出匹配数据
				});
				this.selectAppType = obj.type;
				this.appTypeDisabled = true;
				this.addform.type = this.selectAppType;
			} else {
				this.addform.type = "0";
				this.appTypeDisabled = false;
			}
		}
	}
});