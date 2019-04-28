new Vue({
	el: "#roleManage",
	data: function() {
		return {
			app_id: "",
			addDisabled: true,
			editDisabled: true,
			deleteDisabled: true,
			stateDisabled: true,
			roleListData: [], //角色列表显示
			defaultProps: {
				id: 'id',
				label: 'name',
				children: 'children',
				isLeaf: 'is_leaf',
			},
			//	        multipleSelection: [],  //table中选中的行数组
			multipleSelectionObject: {},
			currentPage: 1, //当前的请求页面。
			total_count: 0,
			pageSize: 10,
			start: 0,
			addRole: false,
			addRoleData: {
				code: '',
				name: '',
				org_name: '',
				type: '',
				extType: '',
				parent_id: '',
				app_id: ''
			},
			editRoleData: {
				code: '',
				name: '',
				type: '',
				parent_id: '',
				app_id: ''

			},

			orgDialog: false,
			code: '',
			name: '',
			org_name: '',
			is_leaf: '1',
			editRole: false,
			searchName: '',
			stateOptions: [], //状态下拉菜单
			chooseState: '',
			highlight: true,
			menuAllTreeData: [], //menu树数据
			menuCheckedList: [], //选中的menu列表
			setCheckedMenu: [], //设置选中的数组
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
				name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}, {
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				type: [{
					required: true,
					message: "",
					trigger: 'blur'
				}]
			},
			typeOptions: [], //角色类型下拉菜单
			typeAllOptions: [], //所有角色类型
			typeExtOptions: [], //角色扩展类型下拉菜单
			parentRoleID: "", //下拉菜单选择的父角色ID
			placeholderSearch: '', //父角色条件查询输入框
			parentRoleOptions: [], //选择父角色下拉菜单
			extTypeDisabled: false, //扩展类型是否禁用
			operateApp: [], //可操作的APP
			searchAppID: "", //下拉选中APPID的值
			assignMenuDisabled:true,    //角色分配菜单提交按钮是否可用
			addRoleType: false, //新增角色时选择类型是否禁用
		}
	},
	created: function() {
		Common.elementLng();
		this.app_id = Common.getUserInfo().app_id;
		var This = this;
		this.international(function() {
			var codeList = ["UAP_COM_STATE", "ROLE_TYPEEXT", "ROLE_TYPE"];
			HTTP.getCodeAndMenus(this, codeList, function(res) {
				This.stateOptions = res.data.codes["UAP_COM_STATE"];
				This.typeExtOptions = res.data.codes["ROLE_TYPEEXT"];
				This.typeAllOptions = res.data.codes["ROLE_TYPE"];
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
					This.getroleList(This.currentPage, This.pageSize);
				}
				//根据用户当前角色显示角色类型
				This.getUserRole();
			});
		});
		this.selectParentRole(true);
		this.searchAppID = Common.getUserInfo().app_id;
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
				This.placeholderSearch = $.t("role.selectParentRole");
				This.rules.code[0].message = $.t("common.inputCode");
				This.rules.name[0].message = $.t("common.inputName");
				This.rules.code[1].message = $.t("common.inputLength");
				This.rules.name[1].message = $.t("common.inputLength");
				This.rules.type[0].message = $.t("common.selectType");
				if(success != undefined) {
					success();
				}
			});
		},
		//获取当前用户的角色
		getUserRole: function() {
			var userID = Common.getUserInfo().id;
			var This = this;
			var httpUrl = "/uap/user/" + userID + "/roles";
			HTTP.httpGet(this, httpUrl, function(res) {
				var data = res.data;
				for(var i = 0; i < data.length; i++) {
					var rowObjitem = data[i];
					if(rowObjitem.uap_role.type == "1") {
						This.typeOptions = This.typeAllOptions;
						break;
					} else {
						var rowObjitem = This.typeAllOptions;
						var rowObj = [];
						for(var i = 0; i < rowObjitem.length; i++) {
							if(rowObjitem[i].code == "0") {
								rowObj.push(rowObjitem[i]);
								break;
							}
						}
						This.typeOptions = rowObj;
					}
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
					if(usermenus[i].code == "STATE") {
						this.stateDisabled = false;
					}
					if(usermenus[i].code == "ASSIGN_MENU") {
						this.assignMenuDisabled = false;
					}
				}
			}
		},
		handleSelectionChange: function(val) { //table行选。 （！table多选）			
			this.multipleSelectionObject = val;
			this.$refs.menuTree.setCheckedKeys([]);
			this.setCheckedMenu = [];
			this.getAllMenuTree();
			this.menuCheckedList = [];
		},
		handleSizeChange: function(val) { //pageSize 改变时会触发
			this.pageSize = val;
			this.getroleList(this.currentPage, this.pageSize);
		},
		handleCurrentChange: function(val) { //currentPage 改变时会触发
			this.currentPage = val;
			this.getroleList(this.currentPage, this.pageSize);
		},
		//根据状态查询角色数据
		selectState: function() {
			this.currentPage = 1;
			this.getroleList(this.currentPage, this.pageSize);
		},

		/**
		 * 角色状态改变  启用/停用
		 * @param {Object} list
		 */
		stateChange: function(list) {
			var state = "";
			if(list.stateNo) {
				state = 1;
			} else {
				state = 0;
			}
			var This = this;
			var httpUrl = '/uap/role/' + list.id + '/state';
			HTTP.httpPut(this, httpUrl, state, function(res) {
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
				This.getroleList(This.currentPage, This.pageSize);
			}, function(error) {
				This.getroleList(This.currentPage, This.pageSize);
			})
		},
		//新增角色
		openNewDialog: function() {
			if(this.$refs.addRoleForm !== undefined) {
				this.$refs.addRoleForm.resetFields();
			}
			this.addRoleData = {
					code: '',
					name: '',
					org_name: '',
					type: '0',
					extType: '1',
					parent_id: '',
					app_id: this.searchAppID,
				},
				this.addRoleType = false;
				this.addRole = true;
			this.extTypeDisabled = false;
		},
		newConfirm: function() {
			var This = this;
			this.$refs.addRoleForm.validate(function(valid) {
				if(valid) {
					var url = '/uap/role';
					var data = {
						code: This.addRoleData.code,
						name: This.addRoleData.name,
						type: This.addRoleData.type,
						type_ext: This.addRoleData.extType,
						is_leaf: This.is_leaf,
						app_id: This.addRoleData.app_id,
						parent_id: This.addRoleData.parent_id,
					};
					HTTP.httpPost(This, url, data, function(res) {
						This.addRole = false;
						This.$message({
							showClose: true,
							message: $.t("common.addSuccess"),
							type: 'success'
						});
						This.currentPage = 1;
						This.getroleList(This.currentPage, This.pageSize);
					});
				} else {
					return false;
				}
			});
		},
		//打开编辑弹框
		openEditDialog: function(index, row) {
			if(this.$refs.editRoleForm !== undefined) {
				this.$refs.editRoleForm.resetFields();
			}
			var This = this;
			var httpUrl = "/uap/role/" + row.id;
			HTTP.httpGet(this, httpUrl, function(res) {
				var rowObjitem = res.data;
				if(rowObjitem.type == "0") {
					rowObjitem.typeName = $.t("role.normalRole");
				} else if(rowObjitem.type == "1") {
					rowObjitem.typeName = $.t("role.adminRole");
				}
				if(rowObjitem.type_ext == "0") {
					rowObjitem.extTypeName = $.t("role.inherit");
				} else if(rowObjitem.type_ext == "1") {
					rowObjitem.extTypeName = $.t("role.extend");
				}
				rowObjitem.parentName = row.parent_name;
				rowObjitem.app_id = This.searchAppID;
				This.editRoleData = rowObjitem;
				This.editRole = true;
			});
		},
		editConfirm: function() {
			var This = this;
			this.$refs.editRoleForm.validate(function(valid) {
				if(valid) {
					var url = '/uap/role/' + This.editRoleData.id;
					var data = {
						code: This.editRoleData.code,
						name: This.editRoleData.name,
						app_id: This.editRoleData.app_id,
						parent_id: This.editRoleData.parent_id,
					};
					HTTP.httpPut(This, url, data, function(res) {
						This.editRole = false;
						This.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
						This.getroleList(This.currentPage, This.pageSize);
					});
				} else {
					return false;
				}
			});
		},
		//根据名称查询角色
		searchRole: function() {
			this.currentPage = 1;
			this.getroleList(this.currentPage, this.pageSize);
		},
		/**
		 * 获取角色列表
		 * pageNum 页码
		 * showNum 一页展示的个数
		 */
		getroleList: function(pageNum, showNum) {
			this.roleListData = [];
			this.multipleSelectionObject = {};
			this.menuAllTreeData = [];
			var This = this;
			var url = '/uap/role/list';
			var data = {};
			data.app_id = this.searchAppID;
			data.limit = showNum;
			data.start = (pageNum - 1) * showNum;
			if(this.chooseState != '99') {
				data.state = this.chooseState;
			}
			if(this.searchName) {
				data.name = this.searchName;
			}
			if(this.parentRoleID != "") {
				data.parent_id = this.parentRoleID;
			}
			HTTP.httpPost(this, url, data, function(res) {
				var data = res.data;
				This.total_count = res.total;
				var rowObj = [];
				for(var i = 0; i < data.length; i++) {
					var rowObjitem = data[i];
					if(rowObjitem.update_time) {
						rowObjitem.update_time = Common.getFormatDateByLong(rowObjitem.update_time);
					}
					if(rowObjitem.state == "1") {
						rowObjitem.stateNo = true;
					} else {
						rowObjitem.stateNo = false;
					}
					if(rowObjitem.type == "0") {
						rowObjitem.typeName = $.t("role.normalRole");
					} else if(rowObjitem.type == "1") {
						rowObjitem.typeName = $.t("role.adminRole");
					}
					if(rowObjitem.type_ext == "0") {
						rowObjitem.extTypeName = $.t("role.inherit");
					} else if(rowObjitem.type_ext == "1") {
						rowObjitem.extTypeName = $.t("role.extend");
					}
					rowObj.push(rowObjitem)
				}
				This.roleListData = rowObj;
			});
		},
		//删除
		deleteRole: function(index, row) {
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var data = {};
						var url = '/uap/role/' + row.id;
						HTTP.httpDelete(This, url, data, function(res) {
							This.$message({
								showClose: true,
								message: $.t("common.deleteSuccess"),
								type: 'success'
							});
							This.currentPage = 1;
							This.getroleList(This.currentPage, This.pageSize);
						});
					}
				}
			});
		},
		/**
		 * 获取menu 静态树
		 */
		getAllMenuTree: function() {
			this.setCheckedMenu = [];
			var This = this;
			var data = {};
			data.app_id = this.app_id;
			data.role_id = this.multipleSelectionObject.id;
			data.state = "1"; //加状态已启用的菜单
			if(this.multipleSelectionObject !== null) {
				data.role_id = this.multipleSelectionObject.id;
			}
			var url = '/uap/role/menus';
			HTTP.httpPost(this, url, data, function(res) {
				var data = res.data;
				var rowObj = [];
				for(var i = 0; i < data.length; i++) {
					var rowObjitem = data[i];
					if(rowObjitem.is_leaf == "1") {
						rowObjitem.is_leaf = true;
					} else {
						rowObjitem.is_leaf = false;
					}

					if(rowObjitem.children.length) {
						This.setChildChecked(rowObjitem.children);
					} else if(rowObjitem.checked == true) {
						This.setCheckedMenu.push(rowObjitem.id)
					}
					rowObj.push(rowObjitem);
				}
				This.menuAllTreeData = rowObj;

			});
		},
		//设置子节点选中
		setChildChecked: function(childRow) {
			for(var j = 0; j < childRow.length; j++) {
				var childRow0 = childRow[j];
				if(childRow0.children.length) {
					this.setChildChecked(childRow0.children);
				} else if(childRow0.checked == true) {
					this.setCheckedMenu.push(childRow0.id);
				}
			}
		},
		//角色分配菜单
		roleMenuConfirm: function() {
			if(this.multipleSelectionObject.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("role.selRoleMessage"),
					type: 'error'
				});
				return;
			} 
			for(var i = 0; i < this.$refs.menuTree.getCheckedNodes().length; i++) {
				var rowObjitem = this.$refs.menuTree.getCheckedNodes()[i];
				this.menuCheckedList.push(rowObjitem.id);
			}
			for(var j = 0; j < this.$refs.menuTree.getHalfCheckedNodes().length; j++) {
				var rowObjitem1 = this.$refs.menuTree.getHalfCheckedNodes()[j];
				this.menuCheckedList.push(rowObjitem1.id);
			}
			this.unique(this.menuCheckedList);
			var This = this;
			var data = {};
			data = {
				menu_ids: this.menuCheckedList,
			};
			var url = '/uap/role/' + this.multipleSelectionObject.id + '/menus';
			HTTP.httpPut(this, url, data, function(res) {
				This.menuCheckedList = [];
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
				This.getAllMenuTree();
			});			
		},
		//遍历删除数组中重复值
		unique: function(array) {
			var duplicateFlag = [];
			for(var k = 0; k < array.length; k++) {
				duplicateFlag[i] = -1; //duplicateFlag 数组中的值全部设为-1
			}

			var singNum = 0;  //将数组每个数与该数前面所有的数比较，确定是否重复
			for(var i = 0; i < array.length; i++) {
				for(var j = 0; j < i; j++) {
					if(array[i] == array[j]) {
						duplicateFlag[i] = -2; //重复就设为 -2
						break;
					}
				}
			}

			var newArray = [];
			//给新数组逐个赋值
			var singNum = 0;
			for(var n = 0; n < duplicateFlag.length; n++) {
				if(duplicateFlag[n] == -1) {
					newArray[singNum] = array[n];
					singNum++;
				}
				return newArray;
			}
		},
		//获取父角色数据
		selectParentRole: function(res) {
			if(res) {
				var This = this;
				var url = '/uap/role/list';
				var data = {};
				data.app_id = this.app_id;
				data.limit = 30;
				data.start = 0;
				data.can_inherit = true;
				data.state = "1";
				HTTP.httpPost(this, url, data, function(res) {
					This.parentRoleOptions = res.data;
				});
			}
		},
		//父角色改变
		parentRoleChange: function(item) {
			if(item !== "") {
				this.addRoleType = true;
				this.extTypeDisabled = true;
				this.addRoleData.extType = "";
				var parentRoleData = {};
			for(var i = 0; i < this.parentRoleOptions.length; i++) {
				var objItem = this.parentRoleOptions[i];
				if(objItem.id == item) {
					parentRoleData = objItem;
					break;
				}
			}
			if(parentRoleData.type == "1") {
				this.addRoleData.type = "1";
			} else if(parentRoleData.type == "0") {
				this.addRoleData.type = "0";
			}
			} else {
				this.addRoleType = false;
				this.addRoleData.type = "0";
				this.extTypeDisabled = false;
				this.addRoleData.extType = "1";
			}
		},
		//权限同步
		Synchronize: function(roleID) {
			var This = this;
			this.$alert($.t("role.permSynMess"), "", {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var data = {};
						var url = '/uap/role/' + roleID + '/subRoles/menus';
						HTTP.httpPut(This, url, data, function(res) {
							This.$message({
								showClose: true,
								message: $.t("common.updateSuccess"),
								type: 'success'
							});
						});
					}
				}
			});

		},
		//根据应用查询角色
		selectAppID: function() {
			this.currentPage = 1;
			this.getroleList(this.currentPage, this.pageSize);
		},
	}
})