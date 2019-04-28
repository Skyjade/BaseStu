new Vue({
	el: '#baseOrgManage',
	data: function() {
		return {
			addDisabled: true,
			editDisabled: true,
			deleteDisabled: true,
			orderDisabled: true,
			stateDisabled: true,
			baseOrgsTreeList: [], //左侧树形结构基准组织数据列表
			selBaseOrgNode: {}, //选择的基准组织节点
			defaultProps: {
				label: 'name',
				isLeaf: 'is_leaf'
			},
			baseOrgListData: [], //表格中的基准组织数据	
			currentPage: 1, //当前页
			pageSize: 10, //每页显示多少条
			total: 0, //总条数				
			searchInput: "", //条件查询时input输入的内容
			stateOptions: [], //状态下拉菜单
			stateValue: "", //状态值
			selBaseOrg: [], //表格单选按钮选择的基准组织
			addBaseOrgDialog: false, //新增基准组织弹框
			addBaseOrgData: { //新增用户数据
				name: "",
				code: "",
				state: 1,
			},
			highlight: true, //树高亮显示选中
			rules: {}, //表单验证规则	
			editBaseOrgDialog: false, //编辑基准组织信息
			editBaseOrgData: [{ //编辑的基准组织数据
				name: "",
				code: "",
			}],
			addBaseOrgFormNum: 0, //新增基准组织表单初始化
			editBaseOrgFormNum: 0, //编辑基准组织表单初始化
			stateSel: [], //状态初始化
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
			}
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international();
		var codeList = ["UAP_COM_STATE"];
		HTTP.getCodeAndMenus(this, codeList, function(res) {
			This.stateSel = res.data.codes["UAP_COM_STATE"];
			This.userAuthentication(res.data.functions);
			if(This.stateSel.length > 0) {
				This.stateValue = "1";
				This.getBaseOrgs(This.currentPage, This.pageSize);
			}
		}, function(error) {
			This.stateSel = [{
					code: '99',
					text: $.t("common.all")
				}, {
					code: '1',
					text: $.t("common.enabled")
				}, {
					code: '0',
					text: $.t("common.disabled")
				}],
				This.stateValue = "1";
		});

	},
	methods: {
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
				This.rules.code[0].message = $.t("common.inputLength");
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
					if(usermenus[i].code == "ORDER") {
						this.orderDisabled = false;
					}
					if(usermenus[i].code == "STATE") {
						this.stateDisabled = false;
					}
					if(usermenus[i].code == "DELETE") {
						this.deleteDisabled = false;
					}
				}
			}
		},

		//左侧树懒加载方法
		loadLeftTreeNode: function(node, resolve) {
			this.currentPage = 1;
			if(node.level === 0) {
				this.getBaseOrgsTreeList("", function(data) {
					return resolve(data);
				});
			}
			if(node.level > 0) {
				this.getBaseOrgsTreeList(node.data.id, function(data) {
					return resolve(data);
				});
			}
		},
		clearTree: function() {
			this.selBaseOrgNode = {};
			this.currentPage = 1;
			this.getBaseOrgs(this.currentPage, this.pageSize, this.selBaseOrgNode);
			for(var i = 0; i < this.$refs.baseOrgTree.store._getAllNodes().length; i++) {
				this.$refs.baseOrgTree.store._getAllNodes()[i].expanded = false;
			}
			this.highlight = false;
		},
		//左侧树节点点击事件
		handleLeftTreeNodeClick: function(data) {
			this.selBaseOrgNode = data;
			this.currentPage = 1;
			this.getBaseOrgs(this.currentPage, this.pageSize, data);
			this.highlight = true;
		},
		//树形结构获取基准组织数据, pageNum 页码,showNum 一页展示的个数
		getBaseOrgsTreeList: function(parentId, success) {
			var httpUrl = "/uap/orgBase/sublist";
			var tree = [];
			var data = {};
			data.parent_id = parentId;
			if(this.stateValue != 99) {
				data.state = this.stateValue;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {

				var data = res.data;
				var rowObj = [];
				if(data.length > 0) {
					var rowObj = [];
					for(var i = 0; i < data.length; i++) {
						var rowItem = data[i];
						//						if(rowItem.is_leaf == "1") {
						//							rowItem.is_leaf = true;
						//						} else {
						rowItem.is_leaf = false;
						//						}
						rowObj.push(rowItem);
					}
					tree = rowObj;
				}
				if(success != null) {
					success(tree);
				}

			});
		},
		/**
		 * 获取基准组织表格数据
		 * pageNum 页码
		 * showNum 一页展示的个数
		 */
		getBaseOrgs: function(pageNum, showNum) {
			var httpUrl = "/uap/orgBase/list";
			this.baseOrgListData = [];
			var data = {};
			data.start = (pageNum - 1) * showNum;
			data.limit = showNum;
			if(this.selBaseOrgNode.id != undefined && this.selBaseOrgNode.id != null) {
				data.parent_id = this.selBaseOrgNode.id;
			}
			if(this.stateValue != 99) {
				data.state = this.stateValue;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total = res.total;
				var res = res.data;
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
					} else if(rowObjitem.state == "0") {
						rowObjitem.stateNo = false;
					}
				}
				This.baseOrgListData = res;
			});
		},

		//表格单选
		handleSelectionChange: function(val) {
			this.selBaseOrg = val;
		},
		//每页多少条处理函数
		handleSizeChange: function(val) {
			this.pageSize = val;
			this.currentPage = 1;
			this.getBaseOrgs(this.currentPage, this.pageSize);
		},
		//当前页数据展示
		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getBaseOrgs(this.currentPage, this.pageSize);
		},
		//根据条件查询用户数据
		searchBaseOrg: function() {
			this.currentPage = 1;
			this.getBaseOrgs(this.currentPage, this.pageSize);
		},
		//根据状态查询用户数据
		selectState: function() {
			this.currentPage = 1;
			this.getBaseOrgs(this.currentPage, this.pageSize);
		},
		//打开新增基准组织弹框
		openAddBaseOrgDialog: function() {
			this.addBaseOrgFormNum++;
			this.addBaseOrgDialog = true;
			if(this.addBaseOrgFormNum > 1) {
				this.$refs.addBaseOrgForm.resetFields();
			}

		},
		//新增基准组织提交事件
		addBaseOrg: function() {
			var This = this;
			this.$refs.addBaseOrgForm.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap/orgBase";
					var data = {};
					data = This.addBaseOrgData;
					if(This.selBaseOrgNode.id != undefined && This.selBaseOrgNode.id != null) {
						data.parent_id = This.selBaseOrgNode.id;
					}
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.addBaseOrgDialog = false;
						This.$message({
							showClose: true,
							message: $.t("common.addSuccess"),
							type: 'success'
						});
						if(This.selBaseOrgNode.id == undefined) {
							window.location.reload(true);
							return;
						}
						This.getBaseOrgsTreeList(This.selBaseOrgNode.id, function(data) {
							This.$refs.baseOrgTree.updateKeyChildren(This.selBaseOrgNode.id, data);
							This.currentPage = 1;
							This.getBaseOrgs(This.currentPage, This.pageSize);
						});
					});
				} else {
					return false;
				}
			});
		},
		//打开编辑基准组织弹框
		openEditBaseOrgDialog: function(index, row) {
			var This = this;
			var httpUrl = "/uap/orgBase/" + row.id;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.editBaseOrgData = res.data;
				This.editBaseOrgFormNum++;
				This.editBaseOrgDialog = true;
				if(This.editBaseOrgFormNum > 1) {
					This.$refs.editBaseOrgForm.resetFields();
				}
			});
		},
		//编辑基准组织数据提交事件
		editBaseOrg: function() {
			var This = this;
			this.$refs.editBaseOrgForm.validate(function(valid) {
				if(valid) {
					var selEditID = This.editBaseOrgData.id;
					var httpUrl = "/uap/orgBase/" + selEditID;
					var data = {};
					data = This.editBaseOrgData;
					data.app_id = This.app_id;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.editBaseOrgDialog = false;
						This.getBaseOrgs(This.currentPage, This.pageSize);
						This.getBaseOrgsTreeList(This.selBaseOrgNode.id, function(data) {
							if(This.$refs.baseOrgTree.getCurrentKey() == null) {
								window.location.reload(true);
							}
							This.$refs.baseOrgTree.updateKeyChildren(This.$refs.baseOrgTree.getCurrentKey(), data);
						});
						This.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
					});
				}
			});
		},
		//启用、停用基准组织
		stateChange: function(list) {
			var data = {};
			if(list.stateNo) {
				data.state = "1";
			} else {
				data.state = "0";
			}
			var This = this;
			var httpUrl = "/uap/orgBase/" + list.id + "/state"
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
				This.getBaseOrgs(This.currentPage, This.pageSize);
			}, function(error) {
				This.getBaseOrgs(This.currentPage, This.pageSize);
			})
		},
		//基准组织排序，num=1上移,num=0下移
		rankMove: function(index, row, num) {
			var baseOrgRankList = [];
			var m = "";
			var t = "";
			if(num == 1) {
				for(var i = 0; i < this.baseOrgListData.length; i++) {
					var rowObjitem = this.baseOrgListData[i];
					if(rowObjitem.id == row.id) {
						m = i - 1;
						break;
					}
				}
				if(m < 0) {
					this.$message({
						showClose: true,
						message: $.t("org.noMove"),
						type: 'warning'
					});
					return;
				}
				t = this.baseOrgListData[m].rank_id;
				this.baseOrgListData[m].rank_id = this.baseOrgListData[m + 1].rank_id;
				this.baseOrgListData[m + 1].rank_id = t;
				baseOrgRankList.push(this.baseOrgListData[m]);
				baseOrgRankList.push(this.baseOrgListData[m + 1]);
			} else if(num == 0) {
				for(var i = 0; i < this.baseOrgListData.length; i++) {
					var rowObjitem = this.baseOrgListData[i];
					if(rowObjitem.id == row.id) {
						m = i + 1;
						break;
					}
				}
				if(m >= this.baseOrgListData.length) {
					this.$message({
						showClose: true,
						message: $.t("org.noMove"),
						type: 'warning'
					});
					return;
				}
				t = this.baseOrgListData[m].rank_id;
				this.baseOrgListData[m].rank_id = this.baseOrgListData[m - 1].rank_id;
				this.baseOrgListData[m - 1].rank_id = t;
				baseOrgRankList.push(this.baseOrgListData[m]);
				baseOrgRankList.push(this.baseOrgListData[m - 1]);
			}
			var data = {};
			data.org_rank_list = baseOrgRankList;
			var This = this;
			var httpUrl = "/uap/orgBase/order"
			HTTP.httpPut(this, httpUrl, data, function(data) {
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
				This.currentPage = 1;
				This.getBaseOrgs(This.currentPage, This.pageSize);
				This.getBaseOrgsTreeList(This.selBaseOrgNode.id, function(data) {
					if(This.selBaseOrgNode.id == undefined) {
						window.location.reload(true);
						return;
					}
					This.$refs.baseOrgTree.updateKeyChildren(This.selBaseOrgNode.id, data);
				});
			});

		},
		//删除基准组织
		deleteBaseOrg: function(row) {
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton: true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm") {
						var data = {};
						var url = '/uap/orgBase/' + row.id;
						HTTP.httpDelete(This, url, data, function(res) {
							This.getBaseOrgsTreeList(This.selBaseOrgNode.id, function(data) {
							if(This.$refs.baseOrgTree.getCurrentKey() == null) {
								window.location.reload(true);
							}
							This.$refs.baseOrgTree.updateKeyChildren(This.$refs.baseOrgTree.getCurrentKey(), data);
						});
							This.currentPage = 1;
							This.getBaseOrgs(This.currentPage, This.pageSize);
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

	}

});