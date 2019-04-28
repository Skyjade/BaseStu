new Vue({
	el: "#definitionDetail",
	data: function() {
		return {
			i18n: {
				edit: "",
				save: "",
				delete: "",
				add: ""
			},
			definitionId: "",
			definitionName: "",
			title: "",
			definition: {}, //definition详情
			editCategoryTitle: "",
			editCategoryDialog: false,
			category: "",
			processFormDialog: false, //流程表单弹框
			processFormList: [], //流程表单表格数据
			getRowKeys:function(row) { //表格行数据的key
				return row.id;
			},
			expands: [], //设置 Table 目前的展开行
			isDisabled: true,
			selProcessForm: [], //单选选择的表格数据
			processForm: { //流程表单编辑数据
				menuID: "",
				name: "",
				procDefName: "",
				taskDefName: "",
				url: ""
			},
			menuTreeDialog: false, //菜单树弹框
			defaultProps: {
				id: 'id',
				label: 'name',
				children: 'children',
				isLeaf: 'is_leaf',
			},
			addProcessFormDialog: false, //新增流程表单弹框
			addProcessForm: { //流程表单新增数据
				menuID: "",
				name: "",
				procDefId: "",
				procDefName: "",
				taskDefId: "",
				taskDefName: "",
				url: ""
			},
			rules: {
				procDefId: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				taskDefId: [{
					required: true,
					message: "",
					trigger: 'blur'
				}]
			},
			i: 0, //单选菜单树定义i
			selTreeNode: {}, //选择的菜单树节点
			menuDataList: [], //选择的菜单表格数据
			total_count: 1,
			currentPage: 1,
			pageSize: 10,
			searchAppID: "", //条件搜索app
			operateApp: [], //可操作的APP
			selMenuData: [], //表格单选选择的数据
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		var codeList = [];
		this.international(function() {
			HTTP.getCodeAndMenus(This, codeList, function(res) {
				This.operateApp = res.data.operate_apps;
				This.getMenuDataList();
			});
		});
		var url = decodeURI(location.search); //获取url中"?"符后的字串 ('?modFlag=business&role=1')  
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；  
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		this.definitionId = theRequest.definitionId;
		this.definitionName = theRequest.definitionName;
		this.title = this.definitionName + " - " + this.definitionId;
		this.getProcessDefinition();
		this.searchAppID = Common.getUserInfo().app_id;
	},
	methods: {
		/**
		 * 编辑Category
		 */
		editCategory: function() {
			this.editCategoryDialog = true;
			this.editCategoryTitle = $.t("definition.editDefinition") + "'" + this.definitionName + "'"
			this.category = this.definition.category;
		},
		/**
		 * 更新Category
		 */
		updateCategory: function() {
			var httpUrl = "/uap-bpm/repository/process-definitions/" + this.definitionId;
			var data = {};
			data.category = this.category;
			var This = this;
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.definition.category = This.category;
				This.editCategoryDialog = false;
			}, function(error) {
				This.editCategoryDialog = false;
			});
		},

		//打开查看流程表单弹框
		openProcessFormDialog: function() {
			this.processFormDialog = true;
			this.expands = [];
		},
		//获取流程定义数据
		getProcessDefinition: function() {
			var This = this;
			var data = {
				start: (this.currentPage - 1) * this.pageSize,
				limit: this.pageSize,
				pro_defl_id: this.definitionId
			};
			var httpUrl = "/uap-bpm/process/definition/all";
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var formData = res.data.uap_bpm_form_list_data_response.data;
				var defData = res.data.process_definition_response;
				for(var i = 0; i < formData.length; i++) {
					var rowObjitem = formData[i];
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
					} else if(rowObjitem.state == "0") {
						rowObjitem.stateNo = false;
					}
				}
				if(defData.suspended == false) {
					defData.suspended = "No";
				} else {
					defData.suspended = "Yes";
				}
				if(defData.start_form_defined == false) {
					defData.startFormDefined = "No";
				} else {
					defData.startFormDefined = "Yes";
				}
				if(defData.graphical_notation_defined == false) {
					defData.graphicalNotationDefined = "No";
				} else {
					defData.graphicalNotationDefined = "Yes";
				}
				This.definition = defData;
				This.processFormList = formData;
			});
		},
		//流程表单选择菜单		
		selectMenu: function(val) {
			this.currentPage = 1;
			this.getMenuDataList();
			this.menuTreeDialog = true;
			this.selTreeNode = val;
			if(this.$refs.menuTable != undefined) {
				this.$refs.menuTable.clearSelection();
			}
		},
		//选择菜单树确定按钮
		selectMenuConfirm: function() {
			if(this.selMenuData.length > 1) {
				this.$message({
					showClose: true,
					message: $.t("definition.selOneMenu"),
					type: 'error'
				});
				return;
			}
			var selMenuAppURL = "";
			for(var i = 0; i < this.operateApp.length; i++) {
				var app = this.operateApp[i];
				if(this.searchAppID = this.operateApp[i].id) {
					selMenuAppURL = this.operateApp[i].url;
					break;
				}
			}
			if(this.addProcessFormDialog == true) {
				if(this.selMenuData.length == 0) {
					this.addProcessForm.menuID = "";
					this.addProcessForm.name = "";
					this.addProcessForm.url = "";
					this.menuTreeDialog = false;
					return;
				}
				var selMenu = this.selMenuData[0];
				this.$set(this.addProcessForm,'menuID',selMenu.id);
				this.$set(this.addProcessForm,'name',selMenu.name);
				this.$set(this.addProcessForm,'url',selMenuAppURL + selMenu.url);
			} else {
				if(this.selMenuData.length == 0) {
					this.processForm.menuID = "";
					this.processForm.name = "";
					this.processForm.url = "";
					this.menuTreeDialog = false;
					return;
				}
				var selMenu = this.selMenuData[0];
				this.$set(this.processForm,'menuID',selMenu.id);
				this.$set(this.processForm,'name',selMenu.name);
				this.$set(this.processForm,'url',selMenuAppURL + selMenu.url);
			}
			this.menuTreeDialog = false;
		},
		//表格展开按钮
		handleSelectionChange: function(val, expandedRows) {
			this.selProcessForm = val;
			var httpUrl = "/uap-bpm/bpmcfg/" + this.selProcessForm.id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.processForm = res.data;
			});
			this.isDisabled = true;
			//控制只展开当前行
			if(expandedRows.length) {
				this.expands = [];
				if(val) {
					this.expands.push(val.id);
				}
			} else {
				this.expands = [];
			}
		},
		//点击表格某一行展开
		rowExpand: function(row, event, column) {
			this.selProcessForm = row;
			var httpUrl = "/uap-bpm/bpmcfg/" + this.selProcessForm.id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.processForm = res.data;
			});
			this.isDisabled = true;
			Array.prototype.remove = function(val) {
				let index = this.indexOf(val);
				if(index > -1) {
					this.splice(index, 1);
				}
			};
			if(this.expands.indexOf(row.id) < 0) {
				this.expands = [];
				this.expands.push(row.id);
			} else {
				this.expands.remove(row.id);
			}
		},
		//打开新增弹框
		openAddDialog: function() {
			if(this.$refs.addProcessForm !== undefined) {
				this.$refs.addProcessForm.resetFields();
			}
			this.addProcessForm = { //流程表单新增数据
				name: "",
				proc_def_id: this.definitionId,
				proc_def_name: this.definitionName,
				task_def_id: "",
				task_def_name: "",
				url: ""
			};
			this.addProcessFormDialog = true;
		},
		//新增按钮提交事件
		addProcessFormClick: function() {
			var This = this;
			this.$refs.addProcessForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/bpmcfg"
					var data = This.addProcessForm;
					data.app_id = Common.getUserInfo().app_id;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.addProcessFormDialog = false;
						This.getProcessDefinition();
						This.$message({
							showClose: true,
							message: $.t("common.submitSuccess"),
							type: 'success'
						});
					});

				}
			})

		},
		//编辑流程表单
		editProcessForm: function() {
			if(this.selProcessForm.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("definition.selProcForm"),
					type: 'error'
				});
			} else {
				this.isDisabled = false;
				var httpUrl = "/uap-bpm/bpmcfg/" + this.selProcessForm.id;
				var This = this;
				HTTP.httpGet(this, httpUrl, function(res) {
					This.processForm = res.data;
				});
			}
		},
		//保存按钮提交事件
		saveProcessForm: function() {
			var httpUrl = "/uap-bpm/bpmcfg/update/" + this.selProcessForm.id;
			var This = this;
			var data = this.processForm;
			data.app_id = Common.getUserInfo().app_id;
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.isDisabled = true;
				This.getProcessDefinition();
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
			});
		},
		//删除
		deleteProcForm: function(index, row) {
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/bpmcfg/" + row.id;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							This.getProcessDefinition();
							This.processForm = {};
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
		//修改状态
		stateChange: function(list) {
			var httpUrl = "/uap-bpm/bpmcfg/update/" + list.id + "/state";
			var This = this;
			var data = {};
			if(list.stateNo) {
				data.state = 1;
			} else {
				data.state = 0;
			}
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.getProcessDefinition();
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
			});
		},
		//国际化
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.i18n.edit = $.t("common.edit");
				This.i18n.save = $.t("common.save");
				This.i18n.delete = $.t("common.delete");
				This.i18n.add = $.t("common.add");
				if(success != undefined) {
					success();
				}
			});
		},
		//获取菜单表格数据
		getMenuDataList: function() {
			var httpUrl = "/uap/menu/list";
			var This = this;
			var data = {};
			data.app_id = this.searchAppID;
			data.start = (this.currentPage - 1) * this.pageSize;
			data.limit = this.pageSize;
			data.type = "12";
			data.global_search = true;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.menuDataList = res.data;
				This.total_count = res.total;
			});
		},
		//分页页面跳转
		handleSizeChange: function(val) {
			this.pageSize = val;
			this.getMenuDataList();
		},
		//分页每页显示多少条跳转
		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getMenuDataList();
		},
		//处理单选多选按钮事件
		handleSelectionMenuChange: function(val) {
			this.selMenuData = val;
		},
		//根据应用查询菜单数据
		getAppMenuData: function(val) {
			this.currentPage = 1;
			this.getMenuDataList();
		}
	}
});