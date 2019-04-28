new Vue({
	el: "#userRole",
	data: function() {
		return {
			roleListData: [], //角色列表数据
			currentPage: 1, //当前页
			pageSize: 10, //每页显示多少条
			total: 0, //总条数	
			selRole: [], //角色列表选择数据
			userExistRole: [], //用户已存在的角色	
			selUserName: "", //选择的用户名称
			selUserID: "", //选择的用户ID
			searchRole: "", //模糊搜索角色	        			
			props: {
				id: 'id',
				label: 'name',
				children: 'children',
				isLeaf: 'is_leaf',
			},
			highlight: true, //树高亮显示选中
			height: 0,
			selectOrgDialog: false, //选择组织弹框
			defaultProps: {
				id: 'id',
				label: 'name',
				children: 'children',
				isLeaf: 'is_leaf'
			},
			selOrgTreeNote: {}, //选择的组织树节点
			i: 0, //单选菜单树定义i
			selOrgData: "", //条件筛选选择的组织
			operateApp: [], //可操作的APP
			searchAppID: "", //下拉选中APPID的值
			orgSearchName:"", //搜索框里的组织名称
		}
	},
	created: function() {
		Common.elementLng();
		//		this.selUserName=localStorage.getItem("selUserName");
		//		this.selUserID=localStorage.getItem("selUserID");

		//获取用户name和id
		var url = decodeURI(location.search); //获取url中"?"符后的字串 ('?modFlag=business&role=1')  
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；  
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		this.selUserName = theRequest.selUserName;
		this.selUserID = theRequest.selUserID;
		var This = this;
		this.international();

		if(window.innerHeight) {
			this.height = window.innerHeight - 175;
		} else if((document.body) && (document.body.clientHeight)) {
			this.height = document.body.clientHeight - 175;
		}
		var This = this;
		var height = window.innerHeight;
		//当浏览器的窗口大小被改变时触发
		window.onresize = function() {
			if(height != window.innerHeight) {
				if(window.innerHeight) {
					This.height = window.innerHeight - 155;
				} else if((document.body) && (document.body.clientHeight)) {
					This.height = document.body.clientHeight - 155;
				}
			} else {
				if(window.innerHeight) {
					This.height = window.innerHeight - 175;
				} else if((document.body) && (document.body.clientHeight)) {
					This.height = document.body.clientHeight - 175;
				}
			}
		};
		HTTP.getCodeAndMenus(this, [], function(res) {
			var operateAppData = res.data.operate_apps;
			var rowObjItem = [];
			for(var i = 0; i < operateAppData.length; i++) {
				if(operateAppData[i].parent_id == undefined) {
					rowObjItem.push(operateAppData[i]);
				}
			}
			This.operateApp = rowObjItem;
			This.searchAppID = Common.getUserInfo().app_id;
			This.getRoles(This.currentPage, This.pageSize);
			This.queryUserRole();
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
			});
		},
		/**
		 * 获取角色列表
		 * pageNum 页码
		 * showNum 一页展示的个数
		 */
		getRoles: function(pageNum, showNum) {
			var httpUrl = "/uap/role/list";
			this.roleListData = [];
			var data = {};
			data.start = (pageNum - 1) * showNum;
			data.limit = showNum;
			data.state = "1";
			data.app_id = this.searchAppID;
			if(this.orgSearchName !== "") {
				data.org_id = this.selOrgData.id;
				httpUrl = "/uap/org/role/list";
			}
			if(this.searchRole != "") {
				data.name = this.searchRole;
			}
			var This = this;
			HTTP.httpPost(This, httpUrl, data, function(res) {
				This.total = res.total;
				var exitRole = This.userExistRole;
				var res = res.data;
				var rowObj = [];
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					rowObj.push(rowObjitem);
				}
				This.roleListData = rowObj;
			}, function(error) {

			});
		},
		//表格单选
		handleRoleSelectionChange: function(val) {
			this.selRole = val;
		},
		handleCurrentChange: function(val) { //currentPage 改变时会触发
			this.currentPage = val;
			this.getRoles(this.currentPage, this.pageSize);
		},

		//查询用户已有的角色
		queryUserRole: function() {
			this.userExistRole = [];
			var httpUrl = "/uap/user/" + this.selUserID + '/roles';
			var This = this;
			HTTP.httpGet(This, httpUrl, function(res) {
				var data = res.data;
				for(var i = 0; i < data.length; i++) {
					var objectiem = {};
					objectiem.userRoleId = data[i].id;
					objectiem.name = data[i].uap_role.name;
					This.userExistRole.push(objectiem);
				}
			});
		},
		//模糊搜索用户角色
		searchUserRole: function() {
			this.currentPage = 1;
			this.getRoles(this.currentPage, this.pageSize);
		},
		//删除用户角色
		deleteUserRole: function(list) {
			var deleteUserRoleId = [list.userRoleId];
			var httpUrl = "/uap/user/role/" + deleteUserRoleId;
			var data = {};
			var This = this;
			HTTP.httpDelete(This, httpUrl, data, function(data) {
				This.queryUserRole();
				This.$message({
					showClose: true,
					message: $.t("common.deleteSuccess"),
					type: 'success'
				});
			}, function(error) {

			});

		},
		//增加用户角色
		addUserRole: function(list) {
			var exitRole = this.userExistRole;
			for(var i = 0; i < exitRole.length; i++) {
				if(list.id == exitRole[i].roleId) {
					this.$message({
						showClose: true,
						message: $.t("user.ownRole"),
						type: 'warning'
					});
					return;
				}
			}
			if(exitRole.length >= 10) {
				this.$message({
					showClose: true,
					message: $.t("user.noMoreTen"),
					type: 'warning'
				});
				return;
			}
			var httpUrl = "/uap/user/" + this.selUserID + '/role/' + list.id;
			var This = this;
			var data = {};
			HTTP.httpPut(This, httpUrl, data, function(data) {
				This.queryUserRole();
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
			}, function(error) {

			});

		},
		//角色刷新按钮
		clearUserRole: function() {
			this.queryUserRole();
		},
		//刷新树形结构
		clearTree: function() {
			this.currentPage = 1;
			this.getRoles(this.currentPage, this.pageSize);
		},
		//清除缓存
		//		clearLocalStorage: function() {
		//			localStorage.removeItem('selUserName');
		//			localStorage.removeItem('selUserID');
		//
		//		},
		//选择组织弹框
		selectOrg: function() {
			this.selectOrgDialog = true;
		},
		//组织树懒加载方法
		loadNode: function(node, resolve) {
			if(node.level === 0) {
				this.getOrgTree("", function(data) {
					return resolve(data);
				});
			}
			if(node.level > 0) {
				this.getOrgTree(node.data.id, function(data) {
					return resolve(data);
				});
			}
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
				tree = res.data;
				if(success) {
					success(tree);
				}
			}, function(error) {});

		},
		//组织树节点点击事件
		handleNodeClick: function(data, checked, node) { //树
			this.i++;
			if(this.i % 2 == 0) {
				if(checked) {
					this.$refs.orgTree.setCheckedNodes([]);
					this.$refs.orgTree.setCheckedNodes([data]);
					//交叉点击节点					
				} else {
					this.$refs.orgTree.setCheckedNodes([]);
					//点击已经选中的节点，置空					
				}
			}
			this.selOrgTreeNote = this.$refs.orgTree.getCheckedNodes();

		},
		//选择组织树提交事件
		selectOrgConfirm: function() {
			if(this.selOrgTreeNote.length == 0||this.selOrgTreeNote.length == undefined) {
				this.orgSearchName = "";
			} else {
				this.orgSearchName=this.selOrgTreeNote[0].name;
				this.selOrgData = this.selOrgTreeNote[0];
			}
			this.selectOrgDialog = false;
		},
		//根据应用查询角色
		selectAppID: function() {
			this.currentPage = 1;
			this.getRoles(this.currentPage, this.pageSize);
		},
	}
});