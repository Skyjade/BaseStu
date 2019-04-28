new Vue({
	el: '#userManage',
	data: function() {
		//校验再次输入密码框
		var thisForm = this;
		var addUserValidatePass = function(rule, value, callback) {
			if(value === '') {
				callback(new Error($.t('user.passwordAgain')));
			} else if(value !== thisForm.addUserData.pass_word) {
				callback(new Error($.t('user.differentPassword')));
			} else {
				callback();
			}
		};
		var addUserPass = function(rule, value, callback) {
			if(value === '' || value == undefined) {
				thisForm.isshow = false;
				callback(new Error($.t('login.inputPwd')));
			} else {
				callback();
			}
		};
		var checkPhone = function(rule, value, callback) {
			var re = /^\+?[1-9][0-9]*$/;
			if(!value) {
				callback();
			} else {
				if(!re.test(value)) {
					callback(new Error($.t('user.inputNum')));
				} else if(re.test(value)) {
					callback();
				}
			}
		};
		return {
			addDisabled: true,
			editDisabled: true,
			roleChooseDisabled: true,
			stateDisabled: true,
			selBaseOrgNode: "", //选择的基准组织节点
			defaultProps: {
				children: 'children',
				label: 'name',
				isLeaf: 'is_leaf',
				id: 'id',
			},
			userListData: [], //表格中的用户数据
			currentPage: 1, //当前页
			pageSize: 10, //每页显示多少条
			total: 0, //总条数	
			baseOrgID: "", //左侧树节点基准组织ID
			searchInput: "", //条件查询时input输入的内容
			stateValue: "1", //状态值
			addUserDialog: false, //新增用户弹框
			addUserData: { //新增用户数据
				base_org_id: "",
				base_org_name: "",
				email: "",
				name: "",
				no: "",
				pass_word: "",
				confirm_password: "",
				phone: "",
				bindIP: "",
				effective_data: [],
				login_time_start: "",
				login_time_end: ""
			},
			editUserDialog: false, //编辑用户弹框
			editUserData: {},
			effectiveData: {},
			form: {
				effectiveData: {}, //编辑用户数据
			},
			stateSel: [], //状态初始化
			highlight: true, //树高亮显示选中
			rules: {
				base_org_name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				no: [{
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
				pass_word: [{
					required: true,
					validator: addUserPass,
					trigger: 'blur'
				}],
				confirm_password: [{
					required: true,
					validator: addUserValidatePass,
					trigger: 'blur'
				}],
				phone: [{
					validator: checkPhone,
					trigger: 'blur'
				}, {
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				email: [{
					type: 'email',
					message: '',
					trigger: ['blur', 'change']
				}],
			},
			//日期禁用状态
			pickerOptionsDateLimit: {
				disabledDate: function(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			appQueryOptions: [], //检索区域选择应用下拉菜单
			searchAppID: "", //下拉选中APPID的值
			operateApp: [], //可操作的APP
			isshow: false, //是否显示密码校验
			passLevel: 0, //密码校验水平
			randomPWD: "", //用户重置密码产生的随机密码
			resetPWDDialog: false, //重置新密码确认弹框
			allState: [], //所有状态下拉菜单
			tableState: [],
			imageUrl: '',
			imgAction: "",
			myHeaders: {},
			userPhotoID: "", //用户上传照片id
			selUserPhoto: "", //编辑用户时用户头像ID
			

		};
	},
	watch: {
		effectiveData: function(value) { //监听date的变化，并改变form.date的数据
			this.form.effectiveData = value; //划重点
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			var codeList = ["USER_STATE"];
			HTTP.getCodeAndMenus(This, codeList, function(res) {
				This.stateSel = res.data.codes["USER_STATE"];
				if(This.stateSel.length > 0) {
					This.stateValue = "1";
					This.getUsers(This.currentPage, This.pageSize);
				}
				var query = new Array();
				query[0] = {
					code: '',
					text: $.t("common.all")
				}
				This.allState = query.concat(This.stateSel);
				var rowObj = [];
				for(var i = 0; i < This.stateSel.length; i++) {
					var rowObjitem = This.stateSel[i];
					if(rowObjitem.code == "0" || rowObjitem.code == "1") {
						rowObjitem.disabled = false;
					} else {
						rowObjitem.disabled = true;
					}
					rowObj.push(rowObjitem);
				}
				This.tableState = rowObj;
				This.userAuthentication(res.data.functions);
				var operateAppData = res.data.operate_apps;
				var rowObjItem = [];
				for(var i = 0; i < operateAppData.length; i++) {
					if(operateAppData[i].parent_id == undefined) {
						rowObjItem.push(operateAppData[i]);
					}
				}
				This.operateApp = rowObjItem;
			});
		});
		this.searchAppID = Common.getUserInfo().app_id;
		this.imgAction = Common.getUserInfo().uap_url + "/uap/file/upload?uploadPerson=" + Common.getUserInfo().name;
		this.myHeaders = {
			Authorization: "Bearer " + Common.getToken()
		}
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
				This.rules.base_org_name[0].message = $.t("common.inputBaseOrg");
				This.rules.no[0].message = $.t("common.inputNo");
				This.rules.name[0].message = $.t("common.inputName");
				This.rules.name[1].message = $.t("common.inputLength");
				This.rules.pass_word[0].message = $.t("common.inputPassword");
				This.rules.email[0].message = $.t("user.correctEmail");
				This.rules.phone[1].message = $.t("common.inputLength");
				This.rules.no[1].message = $.t("common.inputLength");
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
					if(usermenus[i].code == "USERROLE") {
						this.roleChooseDisabled = false;
					}
					if(usermenus[i].code == "STATE") {
						this.stateDisabled = false;
					}					
				}
			}
		},
		//左侧树懒加载方法
		loadLeftTreeNode: function(node, resolve) {
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
				this.getOrgTree(this.selBaseOrgNode, function(data) {
					return resolve(data);
				});
			}
			if(node.level > 1) {
				this.getOrgTree(node.data, function(data) {
					return resolve(data);
				});
			}
		},
		//左侧树节点点击事件
		handleLeftTreeNodeClick: function(data) {
			this.highlight = true;
			this.getOrgTree(data, function(data) {});
			this.selBaseOrgNode = data;
			this.baseOrgID = data.id;
			this.currentPage = 1;
			this.getUsers(this.currentPage, this.pageSize);
		},
		//刷新树形结构
		clearTree: function() {
			//window.location.reload(true);
			this.selBaseOrgNode = "";
			this.baseOrgID = "";
			this.currentPage = 1;
			this.getUsers(this.currentPage, this.pageSize);
			var This = this;
			this.getOrgTree("", function(data) {
				This.$refs.baseOrgTree.updateKeyChildren(0, data);
			});
			this.highlight = false;
		},
		//节点展开
		nodeExpand: function(data) {
			this.selBaseOrgNode = data;
			this.getOrgTree(data.id, function(data) {

			});
		},
		//树形结构获取组织数据
		getOrgTree: function(selNode, success) {
			var httpUrl = "/uap/org/sublist";
			var tree = [];
			var data = {};
			data.state = "1";
			if(selNode != "") {
				data.parent_id = selNode.id;
			}
			data.app_id = this.searchAppID;
			var This = this;
			HTTP.httpPost(This, httpUrl, data, function(res) {
				var data = res.data;
				var rowObj = [];
				if(data.length > 0) {
					var rowObj = [];
					for(var i = 0; i < data.length; i++) {
						var rowItem = data[i];
						if(rowItem.is_leaf == 1) {
							rowItem.is_leaf = true;
						} else {
							rowItem.is_leaf = false;
						}
						rowObj.push(rowItem);
					}
					tree = rowObj;
				}
				success(tree);
			});
		},

		/**
		 * 获取用户列表
		 * pageNum 页码
		 * showNum 一页展示的个数
		 */
		getUsers: function(pageNum, showNum) {
			var httpUrl = "/uap/user/list";
			this.userListData = [];
			var data = {};
			data.app_id = this.searchAppID;
			data.start = (pageNum - 1) * showNum;
			data.limit = showNum;
			if(this.selBaseOrgNode.id != undefined) {
				data.org_no = this.selBaseOrgNode.no;
			}
			if(this.searchInput != "") {
				data.name = this.searchInput;
			}
			if(this.stateValue != 99) {
				data.state = this.stateValue;
			}
			var This = this;
			HTTP.httpPost(This, httpUrl, data, function(res) {
				This.total = res.total;
				var res = res.data;
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					if(This.stateDisabled == false) {
						if(rowObjitem.id == Common.getUserInfo().id) {
							rowObjitem.isDisuse = true;
						} else {
							rowObjitem.isDisuse = false;
						}
					} else {
						rowObjitem.isDisuse = true;
					}
					//					if(rowObjitem.state == "1") {
					//						rowObjitem.stateNo = true;
					//					} else if(rowObjitem.state == "0") {
					//						rowObjitem.stateNo = false;
					//					}
				}
				This.userListData = res;
				//				This.toggleSelection([This.userListData[1]]);
			}, function(error) {});
		},
		//每页多少条处理函数
		handleSizeChange: function(val) {
			this.pageSize = val;
			this.currentPage = 1;
			this.getUsers(this.currentPage, this.pageSize);
		},
		//当前页数据展示
		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getUsers(this.currentPage, this.pageSize);
		},
		//根据条件查询用户数据
		searchUser: function() {
			this.currentPage = 1;
			this.getUsers(this.currentPage, this.pageSize);
		},
		//根据状态查询用户数据
		selectState: function() {
			this.currentPage = 1;
			this.getUsers(this.currentPage, this.pageSize);
		},
		//启用、停用用户方法
		stateChange: function(list) {
			var state = parseInt(list.state);
			var This = this;
			var httpUrl = "/uap/user/" + list.id + "/state"
			HTTP.httpPut(This, httpUrl, state, function(res) {
				This.$message({
					showClose: true,
					message: $.t("common.updateSuccess"),
					type: 'success'
				});
				This.getUsers(This.currentPage, This.pageSize);
			}, function(error) {
				This.getUsers(This.currentPage, This.pageSize);
			})
		},
		//打开新增用户弹框
		openAddUserDialog: function(done) {
			if(this.selBaseOrgNode == "" || this.selBaseOrgNode.id == 0) {
				this.$message({
					showClose: true,
					message: $.t("org.selOrgMessage"),
					type: 'warning'
				});
				return;
			} else {
				if(this.$refs.addUserForm != undefined) {
					this.$refs.addUserForm.resetFields();
				}
				this.isshow = false;
				this.addUserData.bindIP = "";
				this.addUserData.effective_data = [];
				this.addUserData.effective_time = [new Date(), new Date()];
				this.addUserData.base_org_name = this.selBaseOrgNode.name;
				this.addUserData.base_org_id = this.selBaseOrgNode.id;
				this.imageUrl = "../../img/userHead.png"
				this.addUserDialog = true;
			}
		},
		//新增用户提交事件
		addUserConfirm: function() {
			var This = this;
			this.$refs.addUserForm.validate(function(valid) {
				if(valid) {
					var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
					var strIP = This.addUserData.bindIP;
					if(strIP !== "") {
						if(!re.test(strIP)) {
							This.$message({
								showClose: true,
								message: $.t("user.IpError"),
								type: 'error'
							});
							return;
						}
					}
					if(This.passLevel < 3) {
						This.$message({
							showClose: true,
							message: $.t("user.pswComplexity"),
							type: 'error'
						});
						return;
					}
					var httpUrl = "/uap/user";
					if(This.addUserData.effective_data !== null) {
						var effective_time_start = This.addUserData.effective_data[0];
						var effective_time_end = This.addUserData.effective_data[1];
					} else {
						var effective_time_start = "";
						var effective_time_end = "";
					}
					//					var login_time_start = Common.getFormatDateByLong(This.addUserData.effective_time[0]);
					//					var login_time_end = Common.getFormatDateByLong(This.addUserData.effective_time[1]);
					var data = {
						org_id: This.baseOrgID,
						email: This.addUserData.email,
						name: This.addUserData.name,
						no: This.addUserData.no,
						pass_word: hex_md5(This.addUserData.pass_word),
						phone: This.addUserData.phone,
						bind_ip: strIP,
						effective_time_start: effective_time_start,
						effective_time_end: effective_time_end,
						login_time_start: This.addUserData.login_time_start,
						login_time_end: This.addUserData.login_time_end,
						photo_id: This.userPhotoID
					};
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.addUserDialog = false;
						This.$message({
							showClose: true,
							message: $.t("common.addSuccess"),
							type: 'success'
						});
						This.currentPage = 1;
						This.getUsers(This.currentPage, This.pageSize);
					});
				} else {
					return false;
				}

			});
		},

		//打开编辑用户弹框
		openEditUserDialog: function(index, row) {
			var httpUrl = "/uap/user/" + row.id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.editUserData = res.data;
				This.editUserData.base_org_name = This.editUserData.uap_organization.name; //组织
				This.form.effectiveData = [res.data.effective_time_start, res.data.effective_time_end];
				This.effectiveData = This.form.effectiveData;
				This.selUserPhoto = This.editUserData.photo_id;
				if(This.selUserPhoto == ""||This.selUserPhoto==undefined) {
					This.imageUrl = "../../img/userHead.png";
				} else {
					This.imageUrl = Common.getUserInfo().uap_url + "/uap/file/content/" + This.selUserPhoto + "?Authorization=Bearer " + Common.getToken();
				}
				This.editUserDialog = true;
				if(This.$refs.editUserForm != undefined) {
					This.$refs.editUserForm.resetFields();
				}
			});

		},
		//编辑用户提交事件	
		editUserClick: function(list) {
			var This = this;
			this.$refs.editUserForm.validate(function(valid) {
				if(valid) {
					var re = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
					var strIP = This.editUserData.bind_ip;
					if(strIP !== undefined && strIP !== "") {
						if(!re.test(strIP)) {
							This.$message({
								showClose: true,
								message: $.t("user.IpError"),
								type: 'error'
							});
							return;
						}
					}
					if(This.effectiveData !== null) {
						var effective_time_start = This.effectiveData[0];
						var effective_time_end = This.effectiveData[1];
					} else {
						var effective_time_start = "";
						var effective_time_end = "";
					}
					var userID = This.editUserData.id;
					var httpUrl = "/uap/user/" + userID;
					var userPhotoID = "";
					if((This.userPhotoID == "" && This.selUserPhoto !== "")||(This.userPhotoID == "" && This.selUserPhoto !== undefined)) {
						userPhotoID = This.selUserPhoto;
					} else {
						userPhotoID = This.userPhotoID;
					}
					var data = {
						email: This.editUserData.email,
						name: This.editUserData.name,
						phone: This.editUserData.phone,
						no: This.editUserData.no,
						bind_ip: strIP,
						effective_time_start: effective_time_start,
						effective_time_end: effective_time_end,
						login_time_start: This.editUserData.login_time_start,
						login_time_end: This.editUserData.login_time_end,
						photo_id: userPhotoID
					};
					var This1 = This;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This1.editUserDialog = false;
						This1.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
						This1.getUsers(This1.currentPage, This1.pageSize);
					});
				} else {
					return false;
				}
			});
		},
		//打开用户选择角色弹框
		openRoleDialog: function(index, row) {
			window.location.href = encodeURI("userRole.html?selUserID=" + row.id + '&selUserName=' + row.name);
		},
		//条件选择APP ID
		selectAppID: function() {
			var This = this;
			this.getOrgTree("", function(data) {
				This.$refs.baseOrgTree.updateKeyChildren(0, data);
			});
			this.currentPage = 1;
			this.getUsers(this.currentPage, this.pageSize);
		},
		//密码安全级别显示
		//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色 
		pwStrength: function(pwdValue) {
			this.isshow = true;
			O_color = "#eeeeee";
			L_color = "#FF0000";
			M_color = "#FF9900";
			H_color = "#33CC00";
			if(pwdValue == null || pwdValue == '') {
				Lcolor = Mcolor = Hcolor = O_color;
			} else {
				var S_level = this.checkPassWord(pwdValue);
				this.passLevel = S_level;
				switch(S_level) {
					case 0:
						Lcolor = L_color;
						Mcolor = Hcolor = O_color;
						break;
					case 1:
						Lcolor = L_color;
						Mcolor = Hcolor = O_color;
						break;
					case 2:
						Lcolor = Mcolor = M_color;
						Hcolor = O_color;
						break;
					default:
						Lcolor = Mcolor = Hcolor = H_color;
				}
			}
			document.getElementById("strength_L").style.background = Lcolor;
			document.getElementById("strength_M").style.background = Mcolor;
			document.getElementById("strength_H").style.background = Hcolor;
			return;
		},
		/**
		 * 校验密码
		 * @param {Object} value
		 */
		checkPassWord: function(value) {   // 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
			   // 3： 表示第四个级别 
			  
			var modes = 0;  
			if(value.length < 6) { //最初级别
				   
				return modes;  
			}  
			if(/\d/.test(value)) { //如果用户输入的密码 包含了数字
				   
				modes++;  
			}  
			if(/[a-z]/.test(value) || /[A-Z]/.test(value)) { //如果用户输入的密码 包含了小写的a到z
				   
				modes++;  
			}  
			if(/\W/.test(value)) { //如果是非数字 字母 下划线
				   
				modes++;  
			}  
			switch(modes) {   
				case 1:
					    return 1;    
					break;   
				case 2:
					    return 2;    
					break;   
				case 3:
					    return 3;    
					break;  
			} 
		},
		//密码重置
		openResetDialog: function(row) {
			var This = this;
			this.$alert($.t("user.confirmResetPWD"), $.t("user.resetPWD"), {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var code = "";
						var codeLength = 8; //随机密码的长度   
						var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
							'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'); //随机数   
						for(var i = 0; i < codeLength; i++) {
							//循环操作   
							var index = Math.floor(Math.random() * random.length); //取得随机数的索引
							code += random[index]; //根据索引取得随机数加到code上   
						}
						var data = {};
						data.new_pass_word = hex_md5(code);
						data.pass_word = hex_md5(code);
						This.randomPWD = code;
						var httpUrl = '/uap/user/' + row.id + '/password';
						HTTP.httpPut(This, httpUrl, data, function(res) {
							This.$message({
								showClose: true,
								message: $.t("common.updateSuccess"),
								type: 'success'
							});
							This.resetPWDDialog = true;
							This.currentPage = 1;
							This.getUsers(This.currentPage, This.pageSize);
						});
					}
				}
			});
		},
		//上传成功
		handleAvatarSuccess: function(res, file) {
			this.imageUrl = URL.createObjectURL(file.raw);
			this.userPhotoID = (res.data).substring(5);
		},
	}
});