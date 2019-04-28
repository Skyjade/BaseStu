new Vue({
	el: "#org",
	data: function() {
		return {
			addDisabled: true,
			editDisabled: true,
			orderDisabled: true,
			stateDisabled: true,
			orgListData: [], //组织列表	
			orgTreeData: [], //组织树
			selOrgTreeNote: {}, //选择的组织树节点
			defaultProps: {
				id: 'id',
				label: 'name',
				children: 'children',
				isLeaf: 'is_leaf'
			},

			addOrg: false, //新增弹框
			addOrgData: {
				name: '',
				code: '',
				state: '',
				parentName: '',
				time_zone: '',
				app_id: ''
			},
			editOrgData: {
				name: '',
				code: '',
				time_zone: ''
			},
			chooseState: '',
			stateOptions: [], //状态下拉菜单
			searchNameId: '', //搜索框中输入的名称或id 
			editOrg: false, //编辑弹框
			stateOrg: {}, //修改状态时选中的行数据
			showButton: false, //首页上移下移按钮不显示
			currentPage: 1, //当前的请求页面。
			total_count: 0,
			page_size: 10, //每页显示多少条
			start: 0,
			searchNameNo: '',
			highlight: true, //树高亮显示选中
			highlightDoalog: true,
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
				app_id: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
			},
			timeZoneOptions: [], //所属时区下拉菜单
			typeOptions: [], //类型下拉菜单
			appQueryOptions: [], //检索区域选择应用下拉菜单
			searchAppID: "", //下拉选中APPID的值
			operableAppOptions: [], //编辑新增时可操作的应用
			operateApp: [], //可操作的APP
		}
	},
	//
	created: function() {
		Common.elementLng();
		this.searchAppID = Common.getUserInfo().app_id;
		var This = this;
		var height = window.innerHeight;
		this.international(function() {
			var codeList = ["UAP_COM_STATE", "TIME_ZONE", "ORG_TYPE"];
			HTTP.getCodeAndMenus(this, codeList, function(res) {
				This.stateOptions = res.data.codes["UAP_COM_STATE"];
				This.timeZoneOptions = res.data.codes["TIME_ZONE"];
				This.typeOptions = res.data.codes["ORG_TYPE"];
				This.userAuthentication(res.data.functions);
				var operateAppData = res.data.operate_apps;
				var rowObjItem = [];
				for(var i = 0; i < operateAppData.length; i++) {
					if(operateAppData[i].parent_id == undefined) {
						rowObjItem.push(operateAppData[i]);
					}
				}
				This.operateApp = rowObjItem;
				if(This.stateOptions.length > 0) {
					This.chooseState = "1";
					This.getOrgTreeTable();
				}
			});
		});
	},
	methods: {
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
				This.rules.app_id[0].message = $.t("common.selectApp");
				if(success != undefined) {
					success();
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
					if(usermenus[i].code == "ORDER") {
						this.orderDisabled = false;
					}
					if(usermenus[i].code == "STATE") {
						this.stateDisabled = false;
					}
				}
			}
		},

		handleSelectionChange: function(val) {},
		handleSizeChange: function(val) { //pageSize 改变时会触发
			this.page_size = val;
			this.getOrgTreeTable();
			//			this.getOrgList();
		},
		handleCurrentChange: function(val) { //currentPage 改变时会触发
			this.currentPage = val;
			this.start = this.page_size * (this.currentPage - 1);
			this.getOrgTreeTable();
			//			this.getOrgList();
		},
		handleNodeClick: function(data) { //树
			this.selOrgTreeNote = data;
			this.showButton = true;
			//this.getOrgTree(this.selOrgTreeNote.id,null);
			this.getOrgTreeTable();
			this.highlight = true;
		},
		//根据状态查询组织数据
		selectState: function() {
			this.currentPage = 1;
			this.getOrgTreeTable();
		},
		//根据名称或者id查询组织
		searchOrg: function() {
			this.currentPage = 1;
			this.getOrgTreeTable();
		},

		/**
		 * table  组织列表数据
		 */
		getOrgTreeTable: function() {
			var This = this;
			var data = {
				limit: this.page_size,
				start: (this.currentPage - 1) * this.page_size,
			};
			if(this.chooseState != '99') {
				data.state = this.chooseState;
			}
			if(this.searchNameNo != "") {
				data.name = this.searchNameNo;
			}
			if(this.selOrgTreeNote.id != undefined && this.selOrgTreeNote.id != 0) {
				data.parent_id = this.selOrgTreeNote.id;
				data.no = this.selOrgTreeNote.no;
			}
			data.app_id = this.searchAppID;
			var url = '/uap/org/list';
			HTTP.httpPost(this, url, data, function(res) {
				This.total_count = res.total;
				var data = res.data;
				var rowObj = [];
				for(var i = 0; i < data.length; i++) {
					var rowObjitem = data[i];
					if(rowObjitem.in_time) {
						rowObjitem.in_time = Common.getFormatDateByLong(rowObjitem.in_time);
					}
					if(rowObjitem.up_time) {
						rowObjitem.up_time = Common.getFormatDateByLong(rowObjitem.up_time);
					}
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
						rowObjitem.checked = true;
					} else {
						rowObjitem.stateNo = false;
					}
					if(rowObjitem.type == "0") {
						rowObjitem.typeName = $.t("common.nothing");

					}
					rowObj.push(rowObjitem);
				}
				This.orgListData = rowObj;
			}, function(error) {});
		},

		//编辑
		openEditDialog: function(index, row) {
			var This = this;
			var httpUrl = "/uap/org/" + row.id;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.editOrgData = res.data;
				This.editOrgData.app_id = This.searchAppID;
				This.editOrg = true;
				if(This.$refs.editOrgForm !== undefined) {
					This.$refs.editOrgForm.resetFields();
				}
			});
		},
		editConfirm: function() {
			var This = this;
			this.$refs.editOrgForm.validate(function(valid) {
				if(valid) {
					var url = '/uap/org/' + This.editOrgData.id;
					var data = {
						name: This.editOrgData.name,
						code: This.editOrgData.code,
						app_id: This.editOrgData.app_id,
						time_zone: This.editOrgData.time_zone,
						type: This.editOrgData.type,
					};
					var This1 = This;
					HTTP.httpPut(This, url, data, function(res) {
						This1.editOrg = false;
						if(This1.selOrgTreeNote.id == undefined || This1.selOrgTreeNote.id == 0) {
							This1.getOrgTree("", function(data) {
								This1.$refs.tree.updateKeyChildren(0, data);
								This1.getOrgTreeTable();
							});
							return;
						}
						This1.getOrgTreeTable();
						This1.getOrgTree(This1.selOrgTreeNote.id, function(data) {
							This1.$refs.tree.updateKeyChildren(This1.selOrgTreeNote.id, data);
						});
						This1.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
					}, function(error) {});
				} else {
					return false;
				}
			});
		},

		//新建
		openNewDialog: function() {
			if(this.$refs.addOrgForm !== undefined) {
				this.$refs.addOrgForm.resetFields();
			}
			this.addOrg = true;
			this.addOrgData.name = '';
			this.addOrgData.code = '';
			this.addOrgData.state = '';
			this.addOrgData.time_zone = '';
			this.addOrgData.type = '0';
			this.addOrgData.app_id = this.searchAppID;
			if(this.selOrgTreeNote.name && this.selOrgTreeNote.id !== 0) {
				this.addOrgData.parentName = this.selOrgTreeNote.name;
			} else {
				this.addOrgData.parentName = '';
			}
		},
		newConfirm: function() {
			var This = this;
			this.$refs.addOrgForm.validate(function(valid) {
				if(valid) {
					var selOrgTreeNoteID = "";
					if(This.selOrgTreeNote.id !== 0 && This.selOrgTreeNote.id !== undefined) {
						selOrgTreeNoteID = This.selOrgTreeNote.id;
					}
					var url = '/uap/org';
					var data = {
						code: This.addOrgData.code,
						name: This.addOrgData.name,
						parent_id: selOrgTreeNoteID,
						state: 1,
						app_id: This.addOrgData.app_id,
						time_zone: This.addOrgData.time_zone,
						type: This.addOrgData.type,
					};
					HTTP.httpPost(This, url, data, function(res) {
						This.addOrg = false;
						This.$message({
							showClose: true,
							message: $.t("common.addSuccess"),
							type: 'success'
						});
						if(This.selOrgTreeNote.id == undefined || This.selOrgTreeNote.id == 0) {
							This.getOrgTree("", function(data) {
								This.$refs.tree.updateKeyChildren(0, data);
								This.currentPage = 1;
								This.getOrgTreeTable();
							});
							return;
						}
						This.currentPage = 1;
						This.getOrgTreeTable();
						This.getOrgTree(This.selOrgTreeNote.id, function(data) {
							This.$refs.tree.updateKeyChildren(This.selOrgTreeNote.id, data);
						});
					});
				} else {
					return false;
				}
			});
		},

		//左侧树懒加载方法
		loadNode: function(node, resolve) {
			if(node.level === 0) {
				this.international(function() {
					var data = [];
					var obj = {};
					obj.id = 0;
					obj.is_leaf = false;
					obj.name = i18n.t("org.org");
					data.push(obj)
					return resolve(data);
				});
			}
			if(node.level === 1) {
				this.getOrgTree("", function(data) {
					return resolve(data);
				});
			}
			if(node.level > 1) {
				this.getOrgTree(node.data.id, function(data) {
					return resolve(data);
				});
			}
		},
		/**
		 * 业务组织状态改变
		 * @param {Object} list
		 */
		stateChange: function(list) {
			var state = "";
			if(list.stateNo) {
				state = "1";
			} else {
				state = "0";
			}
			var data = {
				state: state,
			};
			var This = this;
			var httpUrl = '/uap/org/' + list.id + '/state';
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
				This.getOrgTreeTable();
			}, function(error) {
				This.getOrgTree(list.parent_id, null);
				This.getOrgTreeTable();
			})
		},
		/**
		 * 获取对应业务组织节点的子节点
		 */
		getOrgTree: function(parentId, success) {
			var tree = [];
			var This = this;
			var data = {};
			data.parent_id = parentId;
			data.app_id = this.searchAppID;
			var url = '/uap/org/sublist';
			HTTP.httpPost(this, url, data, function(res) {
				var data = res.data;
				var rowObj = [];
				for(var i = 0; i < data.length; i++) {
					var rowObjitem = data[i];
					if(rowObjitem.inTime) {
						rowObjitem.inTime = Common.getFormatDateByLong(rowObjitem.inTime);
					}
					if(rowObjitem.upTime) {
						rowObjitem.upTime = Common.getFormatDateByLong(rowObjitem.upTime);
					}
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
					} else {
						rowObjitem.stateNo = false;
					}
					rowObjitem.is_leaf = false;
					rowObj.push(rowObjitem);
				}
				tree = rowObj;
				if(success) {
					success(tree);
				}
			}, function(error) {});

		},

		//组织排序，num=1上移,num=0下移
		rankMove: function(index, row, num) {
			var orderList = [];
			var m = "";
			var t = "";
			if(num == 1) {
				for(var i = 0; i < this.orgListData.length; i++) {
					var rowObjitem = this.orgListData[i];
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
				t = this.orgListData[m].rank_id;
				this.orgListData[m].rank_id = this.orgListData[m + 1].rank_id;
				this.orgListData[m + 1].rank_id = t;
				orderList.push(this.orgListData[m]);
				orderList.push(this.orgListData[m + 1]);
			} else if(num == 0) {
				for(var i = 0; i < this.orgListData.length; i++) {
					var rowObjitem = this.orgListData[i];
					if(rowObjitem.id == row.id) {
						m = i + 1;
						break;
					}
				}
				if(m >= this.orgListData.length) {
					this.$message({
						showClose: true,
						message: $.t("org.noMove"),
						type: 'warning'
					});
					return;
				}
				t = this.orgListData[m].rank_id;
				this.orgListData[m].rank_id = this.orgListData[m - 1].rank_id;
				this.orgListData[m - 1].rank_id = t;
				orderList.push(this.orgListData[m]);
				orderList.push(this.orgListData[m - 1]);
			}
			var data = {};
			data.org_rank_list = orderList;
			var This = this;
			var httpUrl = '/uap/org/order';
			HTTP.httpPut(this, httpUrl, data, function(data) {
				if(This.selOrgTreeNote.id == undefined || This.selOrgTreeNote.id == 0) {
					This.getOrgTree("", function(data) {
						This.$refs.tree.updateKeyChildren(0, data);
						This.currentPage = 1;
						This.getOrgTreeTable();
					});
					return;
				}
				This.getOrgTreeTable();
				This.getOrgTree(This.selOrgTreeNote.id, function(data) {
					This.$refs.tree.updateKeyChildren(This.selOrgTreeNote.id, data);
				});
			});
		},
		clearTree: function() {
			this.selOrgTreeNote = {};
			this.getOrgTreeTable();
			var This = this;
			this.getOrgTree("", function(data) {
				This.$refs.tree.updateKeyChildren(0, data);
			});
			this.highlight = false;
		},
		//获取可选应用
		getApp: function() {
			var This = this;
			var httpUrl = "/uap/app/list";
			var data = {};
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var appOptions = res.data;
				This.appQueryOptions = res.data;
				if(Common.getUserInfo().app_type != 1) {
					This.operableAppOptions = This.operateApp;
				} else {
					This.operableAppOptions = appOptions;
				}
			});
		},
		//条件选择APP ID
		selectAppID: function() {
			var This = this;
			this.getOrgTree("", function(data) {
				This.$refs.tree.updateKeyChildren(0, data);
			});
			this.currentPage = 1;
			this.getOrgTreeTable();
		},

	}
})