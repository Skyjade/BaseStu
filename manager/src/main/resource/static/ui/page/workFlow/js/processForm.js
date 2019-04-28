new Vue({
	el: "#processForm",
	data: function() {
		return {
			i18n: {
				edit: "",
				save: "",
				delete: ""
			},
			app_id: "",
			processFormList: [], //流程表单表格数据
			total_count: 1,
			currentPage: 1,
			pageSize: 10,
			processForm: { //流程表单编辑数据
				name: "",
				procDefName: "",
				taskDefName: "",
				url: ""
			},
			menuTreeDialog: false, //菜单树弹框
			selProcessForm: [], //单选选择的表格数据
			defaultProps: {
				id: 'id',
				label: 'name',
				children: 'children',
				isLeaf: 'is_leaf',
			},
			selProcessTreeNote: {}, //选择的流程树节点
			highlight: true, //是否高亮显示	
			menuAllTreeData: [], //menu树数据	
			isDisabled: true,
			i: 0, //单选菜单树定义i
			selectedMenu: [], //为流程选择的菜单
			getRowKeys(row) { //表格行数据的key
				return row.id;
			},
			expands: [], //设置 Table 目前的展开行
			addProcessFormDialog: false, //新增流程表单弹框
			addProcessForm: { //流程表单新增数据
				name: "",
				procDefId: "",
				procDefName: "",
				taskDefId: "",
				taskDefName: "",
				url: ""
			},
			rules: {
				procDefID: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				taskDefID: [{
					required: true,
					message: "",
					trigger: 'blur'
				}]
			},
		}
	},
	created: function() {
		Common.elementLng();
		this.app_id = Common.getUserInfo().app_id;
		var This = this;
		this.international();
		HTTP.getCodeAndMenus(this, [], function(res) {
			This.getProcessFormList(This.currentPage, This.pageSize);
		});
	},
	methods: {
		//左侧流程树节点展开
		nodeExpand: function(data) {
			this.selProcessTreeNote = data;
			this.processForm = {};
			this.isDisabled = true;
		},
		//左侧树节点点击事件
		handleProcessTreeNodeClick: function(data) {
			this.highlight = true;
			this.selProcessTreeNote = data;
			this.currentPage = 1;
			this.getProcessFormList(this.currentPage, this.pageSize);
			this.processForm = {};
			this.isDisabled = true;
		},

		/**
		 * 获取左侧流程树结构
		 */
		getProcessTree: function(id, success) {
			var httpUrl = "/uap-bpm/app/rest/model/tree?filter=processes";
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				var data = res.data;
				var rowObj = [];
				if(id == '') {
					for(var i = 0; i < data.length; i++) {
						var rowObjitem = data[i];
						if(rowObjitem.appModelDefinitionList == null) {
							rowObjitem.is_leaf = true;
						} else {
							rowObjitem.is_leaf = false;
						}
						rowObj.push(rowObjitem);
					}

				} else {
					for(var i = 0; i < data.length; i++) {
						var rowObjitem = data[i];
						if(id == rowObjitem.id) {
							rowObj = rowObjitem.appModelDefinitionList;
							for(var i = 0; i < rowObj.length; i++) {
								rowObj[i].is_leaf = true;
							}
							break;
						}
					}
				}
				if(success) {
					success(rowObj);
				}
			});
		},
		//左侧树懒加载方法
		loadProcessTreeNode: function(node, resolve) {
			if(node.level === 0) {
				this.getProcessTree('', function(data) {
					return resolve(data);
				});
			} else if(node.level > 0) {
				this.getProcessTree(node.data.id, function(data) {
					return resolve(data);
				});
			}
		},
		//左侧流程树刷新
		clearProcessTree: function() {
			window.location.reload(true);
		},

		/**
		 * 获取menu 静态树
		 */
		getAllMenuTree: function(id, success) {
			var httpUrl = "/uap/menu/sublist";
			var This = this;
			var data = {};
			data.app_id = Common.getUserInfo().app_id;
			data.parent_id = id;
			data.limit_type = 1;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var data = res.data;
				if(data.length > 0) {
					var rowObj = [];
					for(var i = 0; i < data.length; i++) {
						var rowItem = data[i];
						if(rowItem.is_leaf == "1") {
							rowItem.is_leaf = true;
						} else {
							rowItem.is_leaf = false;
						}
						if(rowItem.type == "0") {
							rowItem.disabled = true;
						}
						rowObj.push(rowItem);
					}
					success(rowObj);
				} else {
					success([]);
				}
			});
		},
		//菜单树节点单选点击事件
		handleClick: function(data, checked, node) {
			this.i++;
			if(this.i % 2 == 0) {
				if(checked) {
					this.$refs.menuTree.setCheckedNodes([]);
					this.$refs.menuTree.setCheckedNodes([data]);
					//交叉点击节点
				} else {
					this.$refs.menuTree.setCheckedNodes([]);
					//点击已经选中的节点，置空
				}
			}
			this.selectedMenu = data;
		},
		//菜单树节点加载事件	
		loadMenuTreeNode: function(node, resolve) {
			if(node.level === 0) {
				this.getAllMenuTree("", function(data) {
					return resolve(data);
				});
			}
			if(node.level > 0) {
				this.getAllMenuTree(node.data.id, function(data) {
					return resolve(data);
				});
			}
		},
		//每页多少条处理函数
		handleSizeChange: function(val) {
			this.pageSize = val;
			this.currentPage = 1;
			this.getProcessFormList(this.currentPage, this.pageSize);
		},
		//当前页数据展示
		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getProcessFormList(this.currentPage, this.pageSize);
		},

		/**
		 * 获取流程表单数据列表
		 */
		getProcessFormList: function(pageNum, showNum) {
			var This = this;
			var data = {
				start: (pageNum - 1) * showNum,
				limit: showNum,
				modelId: this.selProcessTreeNote.id
			};
			var httpUrl = "/uap-bpm/bpmcfg/list";
			HTTP.httpPost(this, httpUrl, data, function(res) {
				for(var i = 0; i < res.data.length; i++) {
					var rowObjitem = res.data[i];
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
					} else if(rowObjitem.state == "0") {
						rowObjitem.stateNo = false;
					}
				}
				This.processFormList = res.data;
				This.total_count = res.total;
			});
		},
		//表格展开按钮
		handleSelectionChange: function(val, expandedRows) {
			this.selProcessForm = val;
			this.processForm = val;
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
			this.processForm = row;
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
				procDefId: "",
				procDefName: "",
				taskDefId: "",
				taskDefName: "",
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
						This.currentPage = 1;
						This.getProcessFormList(This.currentPage, This.pageSize);
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
					message: $.t("workFlow.selProcForm"),
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
		//删除
		deleteProcForm: function(index, row) {
			var httpUrl = "/uap-bpm/bpmcfg/" + row.id;
			var This = this;
			HTTP.httpDelete(this, httpUrl, {}, function(res) {
				This.currentPage = 1;
				This.getProcessFormList(This.currentPage, This.pageSize);
				This.processForm = {};
				This.$message({
					showClose: true,
					message: $.t("common.deleteSuccess"),
					type: 'success'
				});
			});

		},
		//流程表单选择菜单
		selectMenu: function() {
			this.menuTreeDialog = true;
			if(this.$refs.menuTree != undefined) {
				this.$refs.menuTree.setCheckedKeys([]);
				for(var i = 0; i < this.$refs.menuTree.store._getAllNodes().length; i++) {
					this.$refs.menuTree.store._getAllNodes()[i].expanded = false;
				}
			}

		},
		//选择菜单树确定按钮
		selectMenuConfirm: function() {
			this.processForm.name = this.selectedMenu.name;
			this.processForm.url = this.selectedMenu.url;
			this.menuTreeDialog = false;
		},
		//保存按钮提交事件
		saveProcessForm: function() {
			var httpUrl = "/uap-bpm/bpmcfg/update/" + this.selProcessForm.id;
			var This = this;
			var data = this.processForm;
			data.app_id = Common.getUserInfo().app_id;
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.currentPage = 1;
				This.isDisabled = true;
				This.getProcessFormList(This.currentPage, This.pageSize);
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
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
				This.currentPage = 1;
				This.getProcessFormList(This.currentPage, This.pageSize);
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
			});
		},
		//国际化
		international: function() {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.i18n.edit = $.t("common.edit");
				This.i18n.save = $.t("common.save");
				This.i18n.delete = $.t("common.delete");
				This.rules.procDefID[0].message = $.t("definition.inputProcDefID");
				This.rules.taskDefID[0].message = $.t("definition.inputTaskDefID");
			});
		},

	}
});