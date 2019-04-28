/**
 * code
 * xyc 
 */
new Vue({
	el: '#code',
	data: function() {
		return {
			addDisabled: true,
			editDisabled: true,
			deleteDisabled: true,
			props: {
				label: 'text',
				isLeaf: 'is_leaf'
			},
			selTreeNode: {}, //当前选择的菜单
			selectStateVal: "",
			form: {
				parentId: "",
				parentCode: "",
				parentText: '',
				code: '',
				text: '',
				type: "0",
				state: '1',
				uap_code_locals: [],
				app_id: ""
			}, //编码基本信息表单			
			isDisabled: true,
			operateTitle: "", //当前操作
			i18n: {
				save: "",
				delete: ""
			},
			rules: {
				code: [{
					required: true,
					message: "",
					trigger: 'blur'
				}, {
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				text: [{
					required: true,
					message: "",
					trigger: 'blur'
				}, {
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
			addTrue: false, //判断是否有新增权限
			codeTypeOptions: [], //编码类型下拉菜单
			typeIsTrue: true, //初始化编码类型
			typeDisabled: false, //编码类型是否可编辑
			appOptions: [], //选择应用下拉菜单
			operateApp: [], //可操作的APP
			appQueryOptions: [], //检索区域选择应用下拉菜单
			searchAppID: "", //下拉选中APPID的值
			allAppOptions: [], //所有应用数据
			operableAppOptions: [], //编辑新增可操作的应用下拉菜单
		}
	},
	created: function() {
		Common.elementLng();
		var codeList = ["UAP_COM_STATE"];
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, codeList, function(res) {
				This.userAuthentication(res.data.functions);
				This.operateApp = res.data.operate_apps;
				This.getApp(); //获取所有APP
			});
		});
		this.searchAppID = Common.getUserInfo().app_id;
		this.form.app_id = this.searchAppID;
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
						this.addTrue = true;
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
		openAddCode: function() {
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(this.searchAppID == obj) {
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
			this.operateTitle = i18n.t("common.add");
			this.isDisabled = false;
			this.typeDisabled = false;
			this.clearCodeData();
			this.form.parentCode = this.selTreeNode.code;
			this.form.parentText = this.selTreeNode.text;
			this.$refs.codeForm.resetFields();
			if(this.selTreeNode.id == 0 || this.selTreeNode.id == undefined) {
				this.codeTypeOptions = [{
						value: "0",
						label: $.t("code.codeGroup")
					}, {
						value: "1",
						label: $.t("code.code")
					},
					{
						value: "2",
						label: $.t("code.codeValue")
					}
				];
				this.form.parentCode = "";
				this.form.parentText = "";
			} else if(this.selTreeNode.type == "0") {
				this.codeTypeOptions = [{
					value: "0",
					label: $.t("code.codeGroup")
				}, {
					value: "1",
					label: $.t("code.code")
				}];
			} else if(this.selTreeNode.type == "1") {
				this.codeTypeOptions = [{
					value: "2",
					label: $.t("code.codeValue")
				}];
				this.form.type = "2";
			}
			this.operableAppOptions = this.appOptions;
			this.form.app_id = this.searchAppID;
		},
		/**
		 * 编辑按钮
		 */
		openEditCode: function() {
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(this.searchAppID == obj) {
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
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				this.$message({
					showClose: true,
					message: i18n.t("menus.selCodeMessage"),
					type: 'warning'
				});
				return;
			}
			if(this.selTreeNode.id != undefined) {
				var isOperate = false;
				for(var i = 0; i < this.operateApp.length; i++) {
					var obj = this.operateApp[i].id;
					if(this.searchAppID == obj) {
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
			}
			this.typeDisabled = true;
			this.getCodeDetailByCodeId(this.selTreeNode.id);
			this.currentOperate = "EDIT";
			this.operateTitle = i18n.t("common.edit");
			this.isDisabled = false;
			this.$refs.codeForm.resetFields();
			this.codeTypeOptions = [{
					value: "0",
					label: $.t("code.codeGroup")
				}, {
					value: "1",
					label: $.t("code.code")
				},
				{
					value: "2",
					label: $.t("code.codeValue")
				}
			];
			this.operableAppOptions = this.appOptions;
		},
		/**
		 * 基本信息保存
		 */
		save: function() {
			if(this.currentOperate == "ADD") { //新增保存
				this.addCodeConfirm();
			} else if(this.currentOperate == "EDIT") {
				this.editCodeConfirm();
			}
		},

		/**
		 * 清除菜单数据
		 */
		clearCodeData: function() {
			this.form.parentId = "";
			this.form.parentCode = "";
			this.form.parentText = "";
			this.form.code = '';
			this.form.text = '';
			this.form.type = "0";
			this.form.state = "1";
			this.form.uap_code_locals = [];
		},

		/**
		 * 新增code
		 */
		addCodeConfirm: function() {
			var This = this;
			this.$refs.codeForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/code";
					var data = {};
					data.app_id = This.form.app_id;
					data.code = This.form.code;
					if(This.selTreeNode.id != undefined || This.selTreeNode.id != 0) {
						data.parent_code = This.selTreeNode.code;
					}
					data.state = This.form.state;
					data.text = This.form.text;
					data.type = This.form.type;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.$message({
							showClose: true,
							message: i18n.t("common.addSuccess"),
							type: 'success'
						});
						if(This.selTreeNode.id == undefined || This.selTreeNode.id == 0) {
							//window.location.reload(true);
							This.getChildCodeTreeByParentCode("", function(data) {
								This.$refs.tree.updateKeyChildren(0, data);
								This.$refs.codeForm.resetFields();
							});
							This.form = {
								parentId: "",
								parentCode: "",
								parentText: '',
								code: '',
								text: '',
								type: "0",
								state: '1',
								uap_code_locals: [],
								app_id: This.searchAppID
							}; //编码基本信息表单	
							This.$refs.codeForm.resetFields();
							This.isDisabled = true;
							This.operateTitle = "";
							return;
						}
						This.getChildCodeTreeByParentCode(This.selTreeNode.code, function(data) {
							This.$refs.tree.updateKeyChildren(This.selTreeNode.id, data);
							This.getCodeDetailByCodeId(This.selTreeNode.id);
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
		editCodeConfirm: function() {
			var This = this;
			this.$refs.codeForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/code/" + This.selTreeNode.id;
					var data = {};
					data.app_id = This.form.app_id;
					data.code = This.form.code;
					data.text = This.form.text;
					data.state = This.form.state;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.$message({
							showClose: true,
							message: i18n.t("common.updateSuccess"),
							type: 'success'
						});
						if(This.form.parentCode == "") {
							//window.location.reload(true);
							This.getChildCodeTreeByParentCode("", function(data) {
								This.$refs.tree.updateKeyChildren(0, data);
							});
							This.form = {
								parentId: "",
								parentCode: "",
								parentText: '',
								code: '',
								text: '',
								type: "0",
								state: '1',
								uap_code_locals: [],
								app_id: This.searchAppID
							}; //编码基本信息表单	
							This.$refs.codeForm.resetFields();
							This.isDisabled = true;
							This.operateTitle = "";
							return;
						}
						This.getChildCodeTreeByParentCode(This.form.parentCode, function(data) {
							This.$refs.tree.updateKeyChildren(This.form.parentId, data);
						});
					})
				} else {
					return false;
				}
			});
		},

		/**
		 * 删除编码
		 */
		deleteCode: function() {
			var isOperate = false;
			for(var i = 0; i < this.operateApp.length; i++) {
				var obj = this.operateApp[i].id;
				if(this.searchAppID == obj) {
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
			if(this.selTreeNode.id == undefined || this.selTreeNode.id == 0) {
				this.$message({
					showClose: true,
					message: i18n.t("menus.selCodeMessage"),
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
						var httpUrl = "/uap/code/" + This.selTreeNode.id;
						HTTP.httpDelete(This, httpUrl, null, function(res) {
							This.$message({
								showClose: true,
								message: i18n.t("common.deleteSuccess"),
								type: 'success'
							});
							This.clearCodeData();
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
				this.clearCodeData();
			}
		},
		/**
		 * code节点点击事件
		 * @param {Object} data
		 */
		handleNodeClick: function(data) {
			this.selTreeNode = data;
			this.$refs.codeForm.resetFields();
			this.isDisabled = true;
			this.operateTitle = "";
			if(data.id == 0) {
				this.form = {
					parentId: "",
					parentCode: "",
					parentText: '',
					code: '',
					text: '',
					type: "0",
					state: '1',
					uap_code_locals: [],
					app_id: this.searchAppID,
				}; //编码基本信息表单		
				return;
			}
			this.getCodeDetailByCodeId(data.id);
			if(this.addTrue) {
				if(this.selTreeNode.type == 2) {
					this.addDisabled = true;
				} else {
					this.addDisabled = false;
				}
			}
			this.operableAppOptions = this.allAppOptions;
		},
		loadNode: function(node, resolve) {
			if(node.level === 0) {
				this.international(function() {
					var data = [];
					var obj = {};
					obj.id = 0;
					obj.is_leaf = false;
					obj.text = i18n.t("code.code");
					data.push(obj)
					return resolve(data);
				});
			}

			if(node.level === 1) {
				this.getChildCodeTreeByParentCode("", function(data) {
					return resolve(data);
				});
			}

			if(node.level > 1) {
				this.getChildCodeTreeByParentCode(node.data.code, function(data) {
					return resolve(data);
				});
			}
		},
		/**
		 * 左边根据父节点查子节点
		 * @param {Object} parentCode
		 * @param {Object} success
		 */
		getChildCodeTreeByParentCode: function(parentCode, success) {
			var httpUrl = "/uap/code/sublist";
			var This = this;
			var data = {};
			data.global_search = false;
			data.parent_code = parentCode;
			data.app_id = this.searchAppID;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var data = res.data;
				if(data.length > 0) {
					var rowObj = [];
					for(var i = 0; i < data.length; i++) {
						var rowItem = data[i];
						if(rowItem.type != "2") {
							rowItem.is_leaf = false;
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
		 * 获取单个code详情
		 * @param {Object} success
		 */
		getCodeDetailByCodeId: function(codeId) {
			this.isDisabled = true;
			this.operateTitle = "";
			var httpUrl = "/uap/code/" + codeId;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				var currentCodeParent = This.$refs.tree.getNode(res.data.id).parent.data;
				if(currentCodeParent == undefined || currentCodeParent.id == 0) {
					This.form.parentId = "";
					This.form.parentCode = "";
					This.form.parentText = "";
				} else {
					This.form.parentId = currentCodeParent.id;
					This.form.parentCode = currentCodeParent.code;
					This.form.parentText = currentCodeParent.text;
				}
				This.form.code = res.data.code;
				This.form.text = res.data.text;
				This.form.type = res.data.type;
				This.form.state = res.data.state;
				This.form.uap_code_locals = res.data.uap_code_locals;
				This.form.app_id = res.data.uap_app.id;
				//This.international();

			});
		},

		/**
		 * 新增国际化框
		 */
		addLanguage: function() {
			var data = {
				local: '',
				display_name: ''
			}
			this.form.uap_code_locals.push(data);
			//this.international();
		},

		/**
		 * 保存国际化
		 */
		saveLacal: function(data) {
			debugger
			if(data.id == undefined) { //新增国际化
				this.addLocal(this.selTreeNode.id, data.local, data.display_name);
			} else { //编辑国际化
				this.editLocal(data.id, data.local, data.display_name);
			}

		},
		/**
		 * 新增国际化
		 */
		addLocal: function(codeId, local, displayName) {
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
			var httpUrl = "/uap/code/local";
			var data = {
				"display_name": displayName,
				"local": local,
				"code_id": codeId
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: i18n.t("common.addSuccess"),
					type: 'success'
				});
				This.getAllLocalByCodeId(codeId);
			}, function() {
				This.getAllLocalByCodeId(codeId);
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
			var httpUrl = "/uap/code/local/" + localId;
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
						var httpUrl = "/uap/code/local/" + data.id;
						HTTP.httpDelete(This, httpUrl, data, function(res) {
							This.$message({
								showClose: true,
								message: i18n.t("common.deleteSuccess"),
								type: 'success'
							});
							This.getAllLocalByCodeId(This.selTreeNode.id);
						});
					}
				}
			});
		},
		/**
		 * 根据编码Id查询所有国际化信息
		 * codeId
		 */
		getAllLocalByCodeId: function(codeId) {
			var httpUrl = "/uap/code/" + codeId + "/local";
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.form.uap_code_locals = res.data;
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
				This.rules.code[0].message = $.t("common.inputCode");
				This.rules.text[0].message = $.t("code.inputCodeValue");
				This.rules.code[1].message = $.t("common.inputLength");
				This.rules.text[1].message = $.t("common.inputLength");
				This.rules.app_id[0].message = $.t("common.selectApp");
				This.i18n.save = $.t("common.save");
				This.i18n.delete = $.t("common.delete");
				if(This.typeIsTrue) {
					This.codeTypeOptions = [{
							value: "0",
							label: $.t("code.codeGroup")
						}, {
							value: "1",
							label: $.t("code.code")
						},
						{
							value: "2",
							label: $.t("code.codeValue")
						}
					];
				}
				This.typeIsTrue = false;
				if(success != undefined) {
					success();
				}
			});
		},
		//获取编辑可选应用
		getApp: function() {
			var This = this;
			var httpUrl = "/uap/app/list";
			var data = {};
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var appOptions = res.data;
				This.allAppOptions = appOptions;
				This.appQueryOptions = res.data;
				This.operableAppOptions = appOptions;
				if(Common.getUserInfo().app_type != 1) {
					This.appOptions = This.operateApp;
				} else {
					This.appOptions = appOptions;
				}
			});
		},
		//条件选择APP ID
		selectAppID: function() {
			var This = this;
			this.form = {
				parentId: "",
				parentCode: "",
				parentText: '',
				code: '',
				text: '',
				type: "0",
				state: '1',
				uap_code_locals: [],
				app_id: this.searchAppID
			}; //编码基本信息表单	
			this.getChildCodeTreeByParentCode("", function(data) {
				This.$refs.tree.updateKeyChildren(0, data);
			});
		},
	}
});