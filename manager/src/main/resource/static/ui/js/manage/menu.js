/**
 * demo
 * xyc 
 */
new Vue({
	el: '#menuManage',
	data: function() {
		return {
			addDisabled: true,
			editDisabled: true,
			deleteDisabled: true,
			props: {
				label: 'name',
				isLeaf: 'is_leaf'
			},
			selTreeNode: {}, //当前选择的菜单
			stateSel: [],
			selectStateVal: "1",

			form: {
				parentId: "",
				parentName: '',
				name: '',
				type: "0",
				url: '',
				urlType: '',
				icon: '',
				code: '',
				uap_menu_locals: [],
				authType: "2",
				funcType: '',
				state: '1',
				app_id: ''
			}, //菜单基本信息表单

			isDisabled: true,
			operateTitle: "", //当前操作
			activeTab: "first",
			apiData: [],
			rightApi: [],
			leftSelApi: {},
			rightSelApi: {},
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
				code: [{
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				funcType: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				app_id: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
			},
			funcTypeOptions: [], //功能类型下拉菜单
			selMenuListData: [], //选择菜单树节点同级所有菜单
			appOptions: [], //选择应用下拉菜单
			APIDisabled: true, //API禁用状态
			i18n: {
				save: "",
				delete: ""
			},
			operateApp: [], //可操作的APP
			AppID: "", //当前登录用户的APP ID
			allAppOptions: [], //所有应用数据
			operableAppOptions: [], //可操作的应用下拉菜单，编辑新增使用
			currentTab: [], //当前选中的Tab
			searchAppID: "", //下拉选中APPID的值
			searchApiName: "", //搜索API名称
			total_count: 0,
			currentPage: 1,
			page_size: 10,
			searchApiAppID: "", //查询Api时APP条件
			menuTypeOptions: [], //菜单类型下拉菜单
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		var codeList = ["UAP_COM_STATE", "MEMUFUNC_TYPE", "MENUS_TYPE"];
		this.international(function() {
			HTTP.getCodeAndMenus(This, codeList, function(res) {
				This.stateSel = res.data.codes["UAP_COM_STATE"];
				This.funcTypeOptions = res.data.codes["MEMUFUNC_TYPE"]; //获取功能类型Code值		
				This.menuTypeOptions = res.data.codes["MENUS_TYPE"];
				This.userAuthentication(res.data.functions);
				This.operateApp = res.data.operate_apps;
				This.getApp(); //获取所有APP
			});
		});
		this.AppID = Common.getUserInfo().app_id;
		this.searchAppID = Common.getUserInfo().app_id;
		this.searchApiAppID = Common.getUserInfo().app_id;
		this.form.app_id = this.searchAppID;
	},
	methods: {
		getApp: function() {
			var This = this;
			var httpUrl = "/uap/app/list";
			var data = {};
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var appOptions = res.data;
				This.allAppOptions = appOptions;
				This.operableAppOptions = appOptions;
				if(Common.getUserInfo().app_type != 1) {
					This.appOptions = This.operateApp;
				} else {
					This.appOptions = appOptions;
				}
			});
		},
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
				}
			}
		},
		/**
		 * 新增按钮
		 */
		openAddMenu: function() {
			this.clearMenuData();
			var selNodeAppID = "";
			this.form.parentName = this.selTreeNode.name;
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				selNodeAppID = this.searchAppID;
				this.form.parentName = "";
			} else {
				selNodeAppID = this.selTreeNode.uap_app.id;
			}
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(selNodeAppID == obj) {
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
			this.currentOperate = "ADD";
			//			this.international();
			this.operateTitle = i18n.t("common.add");
			this.isDisabled = false;
			var menuLocals = this.form.uap_menu_locals;			
			this.$refs.form.resetFields();
			if(this.selTreeNode.type == 2) {
				this.APIDisabled = false;
			} else {
				this.APIDisabled = true;
			}
			this.operableAppOptions = this.appOptions;
			this.form.app_id = this.searchAppID;
			this.form.auth_type = "2";
			this.form.uap_menu_locals = menuLocals;
		},
		/**
		 * 编辑按钮
		 */
		openEditMenu: function() {
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				this.$message({
					showClose: true,
					message: i18n.t("menus.selMenuMessage"),
					type: 'warning'
				});
				return;
			}
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(this.selTreeNode.uap_app.id == obj) {
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
			this.getMenusDetailByMenuId(this.selTreeNode.id);
			this.currentOperate = "EDIT";
			//			this.international();
			this.operateTitle = i18n.t("common.edit");
			this.isDisabled = false;
			this.$refs.form.resetFields();
			if(this.selTreeNode.type == 2) {
				this.APIDisabled = false;
			} else {
				this.APIDisabled = true;
			}
			this.operableAppOptions = this.appOptions;
		},
		/**
		 * 保存
		 */
		save: function() {
			if(this.currentOperate == "ADD") { //新增保存
				this.addMenuConfirm();
			} else if(this.currentOperate == "EDIT") {
				this.editMenuConfirm();
			}
		},

		/**
		 * 新增国际化框
		 */
		addLanguage: function() {
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				this.$message({
					showClose: true,
					message: i18n.t("menus.selMenuMessage"),
					type: 'warning'
				});
				return;
			}
			var data = {
				local: '',
				display_name: ''
			}
			this.form.uap_menu_locals.push(data);
			//			this.international();
		},

		/**
		 * 清除菜单数据
		 */
		clearMenuData: function() {
			this.form.parentId = "";
			this.form.parentName = "";
			this.form.name = '';
			this.form.type = "0";
			this.form.url = '';
			this.form.urlType = '';
			this.form.icon = '';
			this.form.code = '';
			this.form.uap_menu_locals = [];
			this.form.auth_type = "2";
			this.form.app_id = this.searchAppID;
			this.form.funcType = '';
			this.form.state = '1';
		},
		/**
		 * 保存国际化
		 */
		saveLacal: function(data) {
			if(data.id == undefined) { //新增国际化
				this.addLocal(this.selTreeNode.id, data.local, data.display_name);
			} else { //编辑国际化
				this.editLocal(data.id, data.local, data.display_name);
			}

		},
		/**
		 * 新增国际化
		 */
		addLocal: function(menuId, local, displayName) {
			if(local == "") {
				this.$message({
					showClose: true,
					message: i18n.t("common.selLang"),
					type: 'warning'
				});
				return;
			}
			if(displayName == "") {
				this.$message({
					showClose: true,
					message: i18n.t("common.inputName"),
					type: 'warning'
				});
				return;
			}
			var httpUrl = "/uap/menu/local";
			var data = {
				"display_name": displayName,
				"local": local,
				"menu_id": menuId
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: i18n.t("common.addSuccess"),
					type: 'success'
				});
				This.getAllLocalByMenuId(menuId);
			}, function() {
				This.getAllLocalByMenuId(menuId);
			});
		},
		/**
		 * 编辑国际化
		 */
		editLocal: function(localId, local, displayName) {
			if(local == "") {
				this.$message({
					showClose: true,
					message: i18n.t("common.selLang"),
					type: 'warning'
				});
				return;
			}
			if(displayName == "") {
				this.$message({
					showClose: true,
					message: i18n.t("common.inputName"),
					type: 'warning'
				});
				return;
			}
			var httpUrl = "/uap/menu/local/" + localId;
			var data = {
				"display_name": displayName,
				"local": local
			}
			var This = this;
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: i18n.t("common.updateSuccess"),
					type: 'success'
				});
			});
		},
		/**
		 * 删除国际化
		 * @param {Object} data
		 */
		deleteLocal: function(data) {
			if(data.id == undefined) {
				return;
			}
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap/menu/local/" + data.id;
						HTTP.httpDelete(This, httpUrl, data, function(res) {
							This.$message({
								showClose: true,
								message: i18n.t("common.deleteSuccess"),
								type: 'success'
							});
							This.getAllLocalByMenuId(This.selTreeNode.id);
						});
					}
				}
			});
		},
		/**
		 * 根据菜单Id查询菜单所有国际化信息
		 * menuId
		 */
		getAllLocalByMenuId: function(menuId) {
			var httpUrl = "/uap/menu/" + menuId + "/local";
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.form.uap_menu_locals = res.data;
			});
		},
		/**
		 * 新增menu
		 */
		addMenuConfirm: function() {
			var This = this;
			this.$refs.form.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/menu";
					var data = {};
					if(This.selTreeNode.id !== undefined && This.selTreeNode.id !== 0) {
						data.parent_id = This.selTreeNode.id;
					}
					data.app_id = This.form.app_id;
					data.name = This.form.name;
					data.type = This.form.type;
					data.auth_type = This.form.authType;
					data.func_type = This.form.funcType;
					if(This.form.icon != "") {
						data.icon = This.form.icon;
					}
					if(This.form.url != "") {
						data.url = This.form.url;
					}

					if(This.form.urlType != "") {
						data.url_type = This.form.urlType;
					}

					if(This.form.code != "") {
						data.code = This.form.code;
					}
					data.state = This.form.state;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.$message({
							showClose: true,
							message: i18n.t("common.addSuccess"),
							type: 'success'
						});
						if(This.selTreeNode.id == undefined || This.selTreeNode.id == 0) {
							//							window.location.reload(true);
							This.getChildMenuTreeByParentId("", function(data) {
								This.$refs.tree.updateKeyChildren(0, data);
							});
							This.form = {
								parentId: "",
								parentName: '',
								name: '',
								type: "0",
								url: '',
								urlType: '',
								icon: '',
								code: '',
								uap_menu_locals: [],
								authType: "",
								funcType: '',
								state: '1',
								app_id: This.searchAppID
							}; //菜单基本信息表单
							This.isDisabled = true;
							This.APIDisabled = true;
							This.operateTitle = "";
							This.activeTab = "first";
							This.rightSelApi = {};
							This.$refs.form.resetFields();
							return;
						}
						This.getChildMenuTreeByParentId(This.selTreeNode.id, function(data) {
							This.$refs.tree.updateKeyChildren(This.selTreeNode.id, data);
							This.getMenusDetailByMenuId(This.selTreeNode.id);
						});
					});
				} else {
					return false;
				}
			});
		},

		/**
		 * 编辑确认
		 */
		editMenuConfirm: function() {
			var This = this;
			this.$refs.form.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/menu/" + This.selTreeNode.id;
					var data = {};
					data.parent_id = This.form.parentId;
					data.app_id = This.form.app_id;
					data.name = This.form.name;
					data.type = This.form.type;
					data.auth_type = This.form.authType;
					data.func_type = This.form.funcType;
					if(This.form.icon != "") {
						data.icon = This.form.icon;
					}
					data.url = This.form.url;
					data.code = This.form.code;
					data.state = This.form.state;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.$message({
							showClose: true,
							message: i18n.t("common.updateSuccess"),
							type: 'success'
						});
						if(This.form.parentId == "") {
							This.getChildMenuTreeByParentId("", function(data) {
								This.$refs.tree.updateKeyChildren(0, data);
							});
							This.form = {
								parentId: "",
								parentName: '',
								name: '',
								type: "0",
								url: '',
								urlType: '',
								icon: '',
								code: '',
								uap_menu_locals: [],
								authType: "2",
								funcType: '',
								state: '1',
								app_id: This.searchAppID
							}; //菜单基本信息表单	
							This.isDisabled = true;
							This.APIDisabled = true;
							This.operateTitle = "";
							This.activeTab = "first";
							This.rightSelApi = {};
							This.$refs.form.resetFields();
							return;
						}
						This.getChildMenuTreeByParentId(This.form.parentId, function(data) {
							This.$refs.tree.updateKeyChildren(This.form.parentId, data);
						});
					})
				} else {
					return false;
				}
			});
		},

		/**
		 * 删除菜单
		 */
		deleteMenu: function() {
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				this.$message({
					showClose: true,
					message: i18n.t("menus.selMenuMessage"),
					type: 'warning'
				});
				return;
			}
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(this.selTreeNode.uap_app.id == obj) {
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
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap/menu/" + This.selTreeNode.id;
					    HTTP.httpDelete(This, httpUrl, null, function(res) {
							This.$message({
								showClose: true,
								message: i18n.t("common.deleteSuccess"),
								type: 'success'
							});
							This.clearMenuData();
							This.$refs.tree.remove(This.selTreeNode.id);
							This.selTreeNode = {};
						});
					}
				}
			});
		},
		/**
		 * 清除
		 */
		clearTree: function() {
			if(this.currentOperate == "ADD") { //新增
				this.selTreeNode = {};
				for(var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
					this.$refs.tree.store._getAllNodes()[i].expanded = false;
				}
				this.clearMenuData();
				//				this.currentOperate ="";
				$(".el-tree").removeClass("el-tree--highlight-current");
			}
		},

		/**
		 * 获取单个菜单详情
		 * @param {Object} success
		 */
		getMenusDetailByMenuId: function(menuId) {
			this.isDisabled = true;
			this.APIDisabled = true;
			this.operateTitle = "";
			var httpUrl = "/uap/menu/" + menuId;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.form.name = res.data.name;
				This.form.type = res.data.type;
				This.form.app_id = res.data.uap_app.id;
				This.form.uap_menu_locals = res.data.uap_menu_locals;
				This.form.authType = res.data.auth_type;
				This.form.funcType = res.data.func_type;
				if(res.data.url == null) {
					This.form.url = "";
				} else {
					This.form.url = res.data.url;
				}

				if(res.data.urlType == null) {
					This.form.urlType = "";
				} else {
					This.form.urlType = res.data.urlType;
				}

				if(res.data.icon == null) {
					This.form.icon = "";
				} else {
					This.form.icon = res.data.icon;
				}

				if(res.data.code == null) {
					This.form.code = "";
				} else {
					This.form.code = res.data.code;
				}
				This.form.state = res.data.state;
				var currentMenuParent = This.$refs.tree.getNode(res.data.id).parent.data;
				if(currentMenuParent == undefined || currentMenuParent.id == 0) {
					This.form.parentId = "";
					This.form.parentName = "";
				} else {
					This.form.parentId = currentMenuParent.id;
					This.form.parentName = currentMenuParent.name;
				}

				//				This.international(null);
			});
		},

		handleNodeClick: function(data) {
			this.selTreeNode = data;
			$(".el-tree").addClass("el-tree--highlight-current");
			var This = this;
			this.isDisabled = true;
			this.APIDisabled = true;
			this.operateTitle = "";
			this.activeTab = "first";
			this.rightSelApi = {};
			this.$refs.form.resetFields();
			if(data.id == 0) {
				this.form = {
					parentId: "",
					parentName: '',
					name: '',
					type: "0",
					url: '',
					urlType: '',
					icon: '',
					code: '',
					uap_menu_locals: [],
					authType: "2",
					funcType: '',
					state: '1',
					app_id: this.searchAppID
				}; //菜单基本信息表单		
				return;
			}
			this.getMenusDetailByMenuId(data.id);
			this.operableAppOptions = this.allAppOptions;

		},
		loadNode: function(node, resolve) {
			if(node.level === 0) {
				this.international(function() {
					var data = [];
					var obj = {};
					obj.id = 0;
					obj.is_leaf = false;
					obj.name = i18n.t("common.menus");
					data.push(obj)
					return resolve(data);
				});
			}

			if(node.level == 1) {
				this.getChildMenuTreeByParentId("", function(data) {
					return resolve(data);
				});
			}

			if(node.level > 1) {
				this.getChildMenuTreeByParentId(node.data.id, function(data) {
					return resolve(data);
				});
			}
		},
		/**
		 * 左边根据父节点查子节点
		 * @param {Object} parentId
		 * @param {Object} success
		 */
		getChildMenuTreeByParentId: function(parentId, success) {
			var httpUrl = "/uap/menu/sublist";
			var This = this;
			var data = {};
			data.app_id = this.searchAppID;
			data.parent_id = parentId;
			//			data.state = "1";
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var data = res.data;
				if(data.length > 0) {
					var rowObj = [];
					for(var i = 0; i < data.length; i++) {
						var rowItem = data[i];
						if(rowItem.type != "2") {
							if(rowItem.is_leaf == "1") {
								rowItem.is_leaf = true;
							} else {
								rowItem.is_leaf = false;
							}
						} else {
							rowItem.is_leaf = true;
						}
						rowObj.push(rowItem);
					}
					success(rowObj);
				} else {
					success([]);
				}
			});
		},

		/**
		 * tab点击
		 * @param {Object} data
		 */
		menuTab: function(data) {
			this.currentTab = data;
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				return;
			}
			var This = this;
			if(data.index == "2") { //api tab
				This.rightApi = [];
				This.apiData = [];
				This.rightSelApi = {};			
				This.getApisByMenuId(This.selTreeNode.id, function(data) {
					This.currentPage = 1;
					This.searchApiAppID = Common.getUserInfo().app_id;
					This.searchApiName="";
					This.getAllApis();
				});
			}

		},
		/**
		 * 右边api选择事件
		 * @param {Object} list
		 */
		rightApiSel: function(list) {
			if(this.rightApi.length > 0) {
				var row = [];
				for(var i = 0; i < this.rightApi.length; i++) {
					var rowObj = this.rightApi[i];
					if(rowObj.id == list.id) {
						rowObj.selected = true;
						this.rightSelApi = rowObj;
					} else {
						rowObj.selected = false;
					}
					row.push(rowObj)
				}
				this.rightApi = row;
			}
		},
		/**
		 * 左边api选择确认
		 */
		selLeftApiConfirm: function() {
			if(this.leftSelApi.id == undefined || this.leftSelApi == undefined) {
				this.$message({
					showClose: true,
					message: i18n.t("api.selApi"),
					type: 'warning'
				});
				return;
			}
			if(this.apiData.length > 0) {
				var This = this;
				this.updateMenuApi(this.selTreeNode.id, this.leftSelApi.id, function() {
					This.getApisByMenuId(This.selTreeNode.id, function() {});
				});
				this.$refs.ApiTable.clearSelection();
				this.leftSelApi = {};
			}
		},

		/**
		 * 右边删除
		 */
		selRightApiDelete: function() {
			if(this.rightApi.length > 0) {
				var This = this;
				if(this.rightSelApi.id == undefined) {
					this.$message({
						showClose: true,
						message: i18n.t("api.selApi"),
						type: 'warning'
					});
					return;
				}
				var This = this;
				this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
					confirmButtonText: i18n.t('common.delete'),
					showCancelButton:true,
					type: 'warning',
					showClose: true,
					callback: function(action, instance) {
						if(action == "confirm"){
							This.deleteMenuApi(This.rightSelApi.id, function() {
								This.rightApi = [];
								This.getApisByMenuId(This.selTreeNode.id, function() {
									This.rightSelApi = {};
								});
							});
						}
					}
				});
			}
		},
		/**
		 * 查询应用下的所有接口
		 */
		getAllApis: function() {
			var httpUrl = "/uap/restApi/list";
			this.apiData = [];
			var data = {};
			data.start = (this.currentPage - 1) * this.page_size;
			data.limit = this.page_size;
			data.app_id = this.searchApiAppID;
			if(this.searchApiName !== "") {
				data.name = this.searchApiName;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var res = res.data;
				This.apiData = res;
			});
		},
		/**
		 * 查询菜单需要的API
		 * @param {Object} menuId
		 */
		getApisByMenuId: function(menuId, success) {
			var httpUrl = "/uap/menu/" + menuId + "/apis";
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.length > 0) {
					var row = [];
					for(var i = 0; i < res.data.length; i++) {
						var rowObj = res.data[i];
						rowObj.selected = false;
						row.push(rowObj)
					}
					This.rightApi = row;
				} else {
					This.rightApi = [];
				}

				success(This.rightApi);
			});
		},
		/**
		 * 修改当前菜单API
		 */
		updateMenuApi: function(menuId, api_id, success, fail) {
			var httpUrl = "/uap/menu/" + menuId + "/api/" + api_id;
			var This = this;
			var data = {};
			HTTP.httpPut(this, httpUrl, data, function(res) {
				success();
			}, function() {
				fail();
			});
		},
		/**
		 * 删除api
		 * @param {Object} api_id
		 */
		deleteMenuApi: function(api_id, success) {
			var httpUrl = "/uap/menu/api/" + api_id;
			HTTP.httpDelete(this, httpUrl, {}, function(res) {
				success();
			});
		},
		/**
		 * 国际化
		 */
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.name[0].message = $.t("common.inputName");
				This.rules.name[1].message = $.t("common.inputLength");
				This.rules.code[0].message = $.t("common.inputLength");
				This.rules.funcType[0].message = $.t("menus.funcTypeNotNull");
				This.rules.app_id[0].message = $.t("common.selectApp");
				This.i18n.save = $.t("common.save");
				This.i18n.delete = $.t("common.delete");
				if(success != undefined) {
					success();
				}
			});
		},
		//菜单排序，num=1上移,num=0下移
		rankMove: function(num) {
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				this.$message({
					showClose: true,
					message: i18n.t("menus.selMenuMessage"),
					type: 'warning'
				});
				return;
			}
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(this.selTreeNode.uap_app.id == obj) {
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
			var selNode = this.selTreeNode;
			this.getChildMenuTreeByParentId(selNode.parent_id, function(data) {
				This.selMenuListData = data;
				var orderList = [];
				var m = "";
				var t = "";
				if(num == 1) {
					for(var i = 0; i < This.selMenuListData.length; i++) {
						var rowObjitem = This.selMenuListData[i];
						if(rowObjitem.id == selNode.id) {
							m = i - 1;
							break;
						}
					}
					if(m < 0) {
						This.$message({
							showClose: true,
							message: $.t("org.noMove"),
							type: 'warning'
						});
						return;
					}
					t = This.selMenuListData[m].rank_id;
					This.selMenuListData[m].rank_id = This.selMenuListData[m + 1].rank_id;
					This.selMenuListData[m + 1].rank_id = t;
					orderList.push(This.selMenuListData[m]);
					orderList.push(This.selMenuListData[m + 1]);
				} else if(num == 0) {
					for(var i = 0; i < This.selMenuListData.length; i++) {
						var rowObjitem = This.selMenuListData[i];
						if(rowObjitem.id == selNode.id) {
							m = i + 1;
							break;
						}
					}
					if(m == This.selMenuListData.length) {
						This.$message({
							showClose: true,
							message: $.t("org.noMove"),
							type: 'warning'
						});
						return;
					} else {
						t = This.selMenuListData[m].rank_id;
						This.selMenuListData[m].rank_id = This.selMenuListData[m - 1].rank_id;
						This.selMenuListData[m - 1].rank_id = t;
						orderList.push(This.selMenuListData[m]);
						orderList.push(This.selMenuListData[m - 1]);
					}
				}
				var data = {};
				data.menu_rank_list = orderList;
				var httpUrl = '/uap/menu/order';
				HTTP.httpPut(This, httpUrl, data, function(data) {
					if(This.selTreeNode.parent_id == undefined) {
						This.getChildMenuTreeByParentId("", function(data) {
							This.$refs.tree.updateKeyChildren(0, data);
						});
						This.form = {
							parentId: "",
							parentName: '',
							name: '',
							type: "0",
							url: '',
							urlType: '',
							icon: '',
							code: '',
							uap_menu_locals: [],
							authType: "2",
							funcType: '',
							state: '1',
							app_id: This.searchAppID
						}; //菜单基本信息表单
						return;
					}
					This.getChildMenuTreeByParentId(This.selTreeNode.parent_id, function(data) {
						This.$refs.tree.updateKeyChildren(This.selTreeNode.parent_id, data);
						This.getMenusDetailByMenuId(This.selTreeNode.id);
					});
					This.$message({
						showClose: true,
						message: i18n.t("common.updateSuccess"),
						type: 'success'
					});
				});
			});

		},
		//条件选择APP ID
		selectAppID: function() {
			var This = this;
			this.getChildMenuTreeByParentId("", function(data) {
				This.$refs.tree.updateKeyChildren(0, data);
			});
			this.form = {
				parentId: "",
				parentName: '',
				name: '',
				type: "0",
				url: '',
				urlType: '',
				icon: '',
				code: '',
				uap_menu_locals: [],
				authType: "2",
				funcType: '',
				state: '1',
				app_id: this.searchAppID
			}; //菜单基本信息表单
			this.isDisabled = true;
			this.APIDisabled = true;
			this.operateTitle = "";
			this.activeTab = "first";
			this.rightSelApi = {};
			this.$refs.form.resetFields();
		},
		/**
		 * 选择api，只能单选操作
		 * @param {Object} val
		 */
		handleSelectionChange: function(selection, row) {
			if(selection.length > 1) {
				this.$refs.ApiTable.clearSelection();
				this.$refs.ApiTable.toggleRowSelection(row, true);
			}
			this.leftSelApi = selection[0];
		},
		//禁用全选操作
		checkSelectable: function(val) {
			this.$refs.ApiTable.clearSelection();
			this.leftSelApi = {};
		},
		//分页页面跳转
		handleSizeChange: function(val) {
			this.page_size = val;
			this.getAllApis();
		},
		//分页每页显示多少条跳转
		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getAllApis();
		},
		//条件搜索API
		searchApi: function() {
			this.currentPage = 1;
			this.getAllApis();
		}
	}
});