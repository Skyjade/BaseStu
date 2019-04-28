new Vue({
	el: "#pageConfiguration",
	data: function() {
		return {
			props: {
				id: 'id',
				label: 'name'
			},
			fieldList: [], //左侧树动态字段
			createFieldGroupDialog: false, //创建动态字段组合弹框
			fieldGroup: {}, //创建动态字段组合弹框数据
			rules: {
				name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				state: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				menu_id: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
			},
			editFieldGroupDialog: false, //编辑动态字段组合弹框
			selNodeData: {}, //左侧选择的树节点数据
			fieldTableList: [], //动态字段表格数据
			addFieldConfigDialog: false, //新增动态字段组合配置
			fieldConfig: {

			}, //新增动态字段组合配置弹框数据
			fieldOptions: [], //所有动态字段数据
			rulesConfig: {
				display_name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				field_id: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				is_form: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				is_search: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				state: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				rank_id: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				width: [{
					required: true,
					message: "",
					trigger: 'blur'
				}]
			},
			editFieldConfigDialog: false, //编辑动态字段组合配置
			internationalDialog: false, //组合配置国际化弹框
			internationalData: [], //国际化数据
			fieldGroupDetailDialog: false, //动态字段组合详情弹框
			fieldGroupDetailData: {}, //动态字段组合详情数据
			i18n: { //国际化
				save: "",
				delete: ""
			},
			selFieldConfigData: {}, //选择的动态字段组合配置单个数据
			menuOptions: [{ //动态字段组合选择菜单时下拉菜单
				value: 1,
				name: ""
			}, {
				value: 2,
				name: ""
			}],
			total_count: 0,
			currentPage: 1,
			size: 10,
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getFieldList();
				This.getDynamicFieldList();
			});
		});
	},
	methods: {
		//国际化
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.name[0].message = $.t("common.inputName");
				This.rules.state[0].message = $.t("common.selectStatus");
				This.rules.menu_id[0].message = $.t("definition.selOneMenu");
				This.rulesConfig.display_name[0].message = $.t("pageConfig.inputDisplayName");
				This.rulesConfig.field_id[0].message = $.t("pageConfig.inputField");
				This.rulesConfig.is_form[0].message = $.t("pageConfig.inputForm");
				This.rulesConfig.is_search[0].message = $.t("pageConfig.inputSearch");
				This.rulesConfig.state[0].message = $.t("common.selectStatus");
				This.rulesConfig.rank_id[0].message = $.t("pageConfig.inputRankID");
				This.rulesConfig.width[0].message = $.t("pageConfig.inputWidth");
				This.menuOptions[0].name = $.t("pageConfig.myTask");
				This.menuOptions[1].name = $.t("pageConfig.hisTask");
				This.i18n.save = $.t("common.save");
				This.i18n.delete = $.t("common.delete");
				if(success != undefined) {
					success();
				}
			});
		},
		//左侧树，获取动态字段列表
		getFieldList: function() {
			var httpUrl = "/uap-bpm/page/config/list";
			var This = this;
			var data = {};
			data.limit = "99"
			HTTP.httpPost(This, httpUrl, data, function(res) {
				This.fieldList = res.data;
			});
		},
		handleNodeClick: function(data) {
			this.selNodeData = data;
			this.currentPage = 1;
			this.getGroupFieldList(data.id);
		},
		//打开创建动态字段组合弹框
		openCreateFieldGroup: function() {
			if(this.$refs.addFieldGroup !== undefined) {
				this.$refs.addFieldGroup.resetFields();
			}
			this.fieldGroup = {};
			this.createFieldGroupDialog = true;
		},
		//创建动态字段组合提交事件
		createFieldGroup: function() {
			var This = this;
			this.$refs.addFieldGroup.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/page/config";
					var data = This.fieldGroup;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.fieldTableList = [];
						This.getFieldList();
						This.createFieldGroupDialog = false;
						This.$message({
							showClose: true,
							message: $.t("common.addSuccess"),
							type: 'success'
						});
					});
				}
			})
		},
		//打开编辑动态字段组合弹框
		openEditFieldGroup: function() {
			if(this.selNodeData.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("pageConfig.selectField"),
					type: 'error'
				});
				return;
			}
			if(this.$refs.editFieldGroup !== undefined) {
				this.$refs.editFieldGroup.resetFields();
			}
			var httpUrl = "/uap-bpm/page/config/" + this.selNodeData.id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.fieldGroup = res.data;
				This.editFieldGroupDialog = true;
			});
		},
		//编辑动态字段组合提交事件
		editFieldGroup: function() {
			var This = this;
			this.$refs.editFieldGroup.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/page/config/" + This.selNodeData.id;
					var data = This.fieldGroup;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.fieldTableList = [];
						This.getFieldList();
						This.editFieldGroupDialog = false;
						This.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
					});
				}
			})
		},
		//删除动态字段组合
		deleteFieldGroup: function() {
			if(this.selNodeData.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("pageConfig.selectField"),
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
						var httpUrl = "/uap-bpm/page/config/" + This.selNodeData.id;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							This.fieldTableList = [];
							This.getFieldList();
							This.$message({
								showClose: true,
								message: $.t("common.deleteSuccess"),
								type: 'success'
							});
						});
					}
				}
			});
		},
		//获取指定组合Id对应字段列表
		getGroupFieldList: function(nodeID) {
			var This = this;
			var httpUrl = "/uap-bpm/page/config/" + nodeID + "/field/list";
			var data = {};
//			data.limit = this.size;
//			data.start = (this.currentPage - 1) * this.size;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var data = res.data;
				var rowObj = [];
				for(var i = 0; i < data.length; i++) {
					var rowObjitem = data[i].uap_page_config_detail;
					if(rowObjitem.state == "0") {
						rowObjitem.stateName = $.t("common.disabled");
					} else if(rowObjitem.state == "1") {
						rowObjitem.stateName = $.t("common.enabled");
					}
					if(rowObjitem.is_form == "0") {
						rowObjitem.isFormName = $.t("pageConfig.no");
					} else if(rowObjitem.is_form == "1") {
						rowObjitem.isFormName = $.t("pageConfig.yes");
					}
					if(rowObjitem.is_search == "0") {
						rowObjitem.isSearchName = $.t("pageConfig.no");
					} else if(rowObjitem.is_search == "1") {
						rowObjitem.isSearchName = $.t("pageConfig.yes");
					}
					rowObj.push(rowObjitem)
				}

				This.fieldTableList = data;

			});
		},
		//每页显示多少条跳转
		handleSizeChange: function(val) {
			this.size = val;
			this.currentPage = 1;
			this.getGroupFieldList(this.selNodeData.id);
		},
		//分页页面跳转 
		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getGroupFieldList(this.selNodeData.id);
		},
		//获取动态字段列表
		getDynamicFieldList: function() {
			var httpUrl = "/uap-bpm/page/field/list";
			var This = this;
			var data = {};
			data.limit = 99;
			data.start = 0;
			HTTP.httpPost(This, httpUrl, data, function(res) {
				This.fieldOptions = res.data;
			});
		},
		//打开新增动态字段组合配置
		openAddConfig: function() {
			if(this.selNodeData.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("pageConfig.selectField"),
					type: 'error'
				});
				return;
			}
			if(this.$refs.addFieldConfig !== undefined) {
				this.$refs.addFieldConfig.resetFields();
			}
			this.fieldConfig = {};
			this.fieldConfig = {
				state: "1",
				is_display: "1",
				is_form: "1",
				is_search: "0",
				is_global: "1",
				rank_id: 1
			};
			this.fieldConfig.groupName = this.selNodeData.name;
			this.addFieldConfigDialog = true;

		},
		//新增动态字段组合配置提交事件
		addFieldConfigClick: function() {
			var This = this;
			this.$refs.addFieldConfig.validate(function(valid) {
				if(valid) {
					if(This.fieldConfig.rank_id == 0) {
						This.$message({
							showClose: true,
							message: $.t("pageConfig.rankIDCannot"),
							type: 'warning'
						});
						return;
					}
					if(This.fieldConfig.width == 0) {
						This.$message({
							showClose: true,
							message: $.t("pageConfig.widthCannot"),
							type: 'warning'
						});
						return;
					}
					var httpUrl = "/uap-bpm/page/config/field";
					var data = {};
					data = This.fieldConfig;
					data.group_id = This.selNodeData.id;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.addFieldConfigDialog = false;
						This.currentPage = 1;
						This.getGroupFieldList(This.selNodeData.id);
						This.$message({
							showClose: true,
							message: $.t("common.addSuccess"),
							type: 'success'
						});
					});
				}
			})
		},
		//打开编辑动态字段组合配置弹框
		openEditConfigDialog: function(index, row) {
			if(this.$refs.editFieldConfig !== undefined) {
				this.$refs.editFieldConfig.resetFields();
			}
			var httpUrl = "/uap-bpm/page/config/detail/" + row.uap_page_config_detail.id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.fieldConfig = res.data;
				This.fieldConfig.groupName = This.selNodeData.name;
				This.fieldConfig.field = row.uap_page_field.field;
				This.editFieldConfigDialog = true;
			});
		},
		//编辑动态字段组合配置提交事件
		editFieldConfig: function() {
			var This = this;
			this.$refs.editFieldConfig.validate(function(valid) {
				if(valid) {
					if(This.fieldConfig.rank_id == 0) {
						This.$message({
							showClose: true,
							message: $.t("pageConfig.rankIDCannot"),
							type: 'warning'
						});
						return;
					}
					if(This.fieldConfig.width == 0) {
						This.$message({
							showClose: true,
							message: $.t("pageConfig.widthCannot"),
							type: 'warning'
						});
						return;
					}
					var httpUrl = "/uap-bpm/page/config/field/" + This.fieldConfig.id;
					var data = This.fieldConfig;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.getGroupFieldList(This.selNodeData.id);
						This.editFieldConfigDialog = false;
						This.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
					});
				}
			})
		},
		//删除动态字段组合配置
		deleteFieldConfig: function(index, row) {
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/page/config/field/" + row.uap_page_config_detail.id;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							This.currentPage = 1;
							This.getGroupFieldList(This.selNodeData.id);
							This.$message({
								showClose: true,
								message: $.t("common.deleteSuccess"),
								type: 'success'
							});
						});
					}
				}
			});
		},
		//查看详情动态字段组合弹框
		openFieldGroupDetail: function() {
			if(this.selNodeData.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("pageConfig.selectField"),
					type: 'error'
				});
				return;
			}
			var httpUrl = "/uap-bpm/page/config/" + this.selNodeData.id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				var data = res.data;
				if(data.state == "1") {
					data.stateName = $.t("common.enabled");
				} else {
					data.stateName = $.t("common.disabled");
				}
				if(data.menu_id == "1") {
					data.menuName = $.t("pageConfig.myTask");
				} else if(data.menu_id == "2") {
					data.menuName = $.t("pageConfig.hisTask");
				}
				This.fieldGroupDetailData = data;
				This.fieldGroupDetailDialog = true;
			});
		},
		//组合配置国际化弹框
		openInterDialog: function(row) {
			this.selFieldConfigData = row.uap_page_config_detail;
			this.getInternationalData(row.uap_page_config_detail.id);
		},
		//根据字段Id查询字段所有国际化信息
		getInternationalData: function(selID) {
			var httpUrl = "/uap-bpm/page/field/" + selID + "/local";
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				var data = res.data;
				This.internationalData = data;
				This.internationalDialog = true;
			});
		},
		//新增国际化框		
		addLanguage: function() {
			var data = {
				local: '',
				display_name: ''
			}
			this.internationalData.push(data);
		},
		// 保存国际化
		saveLacal: function(data) {
			if(data.id == undefined) { //新增国际化
				this.addLocal(this.selFieldConfigData.id, data.local, data.display_name);
			} else { //编辑国际化
				this.editLocal(data.id, data.local, data.display_name);
			}
		},
		//新增国际化
		addLocal: function(configID, local, displayName) {
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
			var This = this;
			var httpUrl = "/uap-bpm/page/field/local";
			var data = {};
			data.detail_id = configID;
			data.local = local;
			data.display_name = displayName;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.getInternationalData(This.selFieldConfigData.id);
				This.$message({
					showClose: true,
					message: $.t("common.addSuccess"),
					type: 'success'
				});
			});
		},
		//编辑国际化
		editLocal: function(configID, local, displayName) {
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
			var This = this;
			var httpUrl = "/uap-bpm/page/field/local/" + configID;
			var data = {};
			data.local = local;
			data.display_name = displayName;
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.getInternationalData(This.selFieldConfigData.id);
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
			});
		},
		//删除国际化
		deleteLocal: function(row) {
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/page/field/local/" + row.id;
						var data = {};
						HTTP.httpDelete(This, httpUrl, data, function(res) {
							This.getInternationalData(This.selFieldConfigData.id);
							This.$message({
								showClose: true,
								message: i18n.t("common.deleteSuccess"),
								type: 'success'
							});
						});
					}
				}
			});
		},

	}
})