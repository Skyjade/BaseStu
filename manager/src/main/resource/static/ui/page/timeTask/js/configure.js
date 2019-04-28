new Vue({
	el: "#configure",
	data: function() {
		return {
			jobGroupList: [], //job分组列表
			props: {
				id: 'id',
				label: 'group_name'
			},
			//新建分组
			addJobGroupDialog: false,
			addGroupData: {
				name: "",
				description: ""
			},
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
				description: [{
					max: 255,
					message: "",
					trigger: 'blur'
				}]
			},
			//编辑分组
			editJobGroupDialog: false,
			editGroupData: {
				group_name: "",
				description: ""
			},
			editRules: {
				description: [{
					max: 255,
					message: "",
					trigger: 'blur'
				}]
			},
			selGroup: {},
			viewJobGroupDialog: false,
			jobList: [], //job列表
			//新建job
			addJobDialog: false, //job弹出框是否显示
			addJobData: {
				job_name: "",
				exec_host_ip: "",
				restApi: "",
				description: "",
				restParam: "",
				restApiID: ""
			},
			rulesJob: {
				job_name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}, {
					max: 32,
					message: "",
					trigger: 'blur'
				}],
				restApi: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				description: [{
					max: 255,
					message: "",
					trigger: 'blur'
				}]
			},
			//编辑job
			editJobDialog: false,
			editJobData: {
				exec_host_ip: "",
				restApi: "",
				description: "",
				restParam: "",
				restApiID: ""
			},
			selJob: {},
			jobOperate: "",
			//api
			apiDialog: false,
			searchApiName: "",
			total_count: 0,
			currentPage: 1,
			page_size: 10,
			appList: [],
			apiList: [],
			searchAppID: "",
			selApiList: [],
			selApi: {},
			hostIp: [] //配置的主机IP
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getGroupList();
			});
		});
	},
	methods: {
		/**
		 * 树节点点击事件
		 * @param {Object} data
		 */
		handleNodeClick: function(data) {
			data.insert_time = moment(data.insert_time).format("YYYY-MM-DD HH:mm:ss");
			this.selGroup = data;
			this.getJobList(data.id);
		},
		/**
		 * 查看
		 */
		viewGroupBtn: function() {
			if(this.selGroup.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selGroup"),
					type: 'warning'
				});
				return;
			}
			this.viewJobGroupDialog = true;
		},
		/**
		 * 打开新建分组弹出框
		 */
		openJobGroupBtn: function() {
			if(this.$refs.addGroupData != undefined) {
				this.$refs.addGroupData.resetFields();
			}
			this.addJobGroupDialog = true;
		},
		/**
		 * 新建分组
		 */
		addJobGroupConfirm: function() {
			var This = this;
			var httpUrl = "/uap-schedule/jobGroup";
			this.$refs.addGroupData.validate(function(valid) {
				if(valid) {
					var data = {};
					data.group_name = This.addGroupData.name;
					data.description = This.addGroupData.description;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.addJobGroupDialog = false;
						This.getGroupList();
						This.selGroup=[];
						This.jobList=[];
					}, function() {
						This.addJobGroupDialog = false;
					});
				} else {
					return false;
				}
			});
		},
		/**
		 * 获取分组列表数据
		 */
		getGroupList: function() {
			var This = this;
			var httpUrl = "/uap-schedule/jobGroup";
			HTTP.httpGet(this, httpUrl, function(res) {
				This.jobGroupList = res.data;
			})
		},
		/**
		 * 打开编辑分组弹出框
		 */
		editGroupBtn: function() {
			if(this.selGroup.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selGroup"),
					type: 'warning'
				});
				return;
			}
			this.editGroupData.group_name = this.selGroup.group_name;
			this.editGroupData.description = this.selGroup.description;
			this.editJobGroupDialog = true;
		},
		/**
		 * 编辑任务分组
		 */
		editJobGroupConfirm: function() {
			var httpUrl = "/uap-schedule/jobGroup/" + this.selGroup.id;
			var This = this;
			this.$refs.editGroupData.validate(function(valid) {
				if(valid) {
					var data = {};
					data.description = This.editGroupData.description;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.editJobGroupDialog = false;
						This.getGroupList();
						This.selGroup=[];
						This.jobList=[];
					}, function() {
						This.editJobGroupDialog = false;
					});
				} else {
					return false;
				}
			});
		},
		/**
		 * 删除分组
		 */
		deleteGroupBtn: function() {
			if(this.selGroup.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selGroup"),
					type: 'warning'
				});
				return;
			}
			var This = this;
			var httpUrl = "/uap-schedule/jobGroup/" + this.selGroup.id;
			HTTP.httpDelete(This, httpUrl, {}, function(res) {
				This.getGroupList();
				This.jobList = [];
			});
		},
		/**
		 * 打开job新建弹出框
		 */
		openJobAddDialog: function() {
			if(this.selGroup.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selGroup"),
					type: 'warning'
				});
				return;
			}
			if(this.$refs.addJobData != undefined) {
				this.$refs.addJobData.resetFields();
			}
			this.selApi = {};
			this.getJobHostIp();
			this.addJobDialog = true;
			this.jobOperate = "Add";
		},
		/**
		 * 新建job
		 */
		addJobConfirm: function() {
			var This = this;
			var httpUrl = "/uap-schedule/job";
			this.$refs.addJobData.validate(function(valid) {
				if(valid) {
					var data = {};
					data.group_id = This.selGroup.id;
					data.job_name = This.addJobData.job_name;
					data.exec_host_ip = This.addJobData.exec_host_ip;
					data.description = This.addJobData.description;
					data.rest_api_id = This.selApi.id;
					data.rest_param = This.addJobData.restParam;
					if(This.addJobData.restParam != "" && This.addJobData.restParam.trim().length > 0){
						if(!This.isJSON(This.addJobData.restParam)) {
							This.$message({
								showClose: true,
								message: $.t("timeTask.inputJson"),
								type: 'warning'
							});
							return;
						}
					}
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.addJobDialog = false;
						This.getJobList(This.selGroup.id);
					}, function() {
						This.addJobDialog = false;
					});
				} else {
					return false;
				}
			});
		},
		/**
		 * 打开job编辑弹出框
		 */
		editJob: function(index, row) {
			if(this.$refs.editJobData != undefined) {
				this.$refs.editJobData.resetFields();
			}
			this.selJob = row;
			this.editJobData.job_name = row.job_name;
			this.editJobData.exec_host_ip = row.exec_host_ip;
			this.editJobData.description = row.description;
			if(row.uap_rest_api != undefined) {
				this.selApi = row.uap_rest_api;
				this.editJobData.restApi = row.uap_rest_api.name;
				this.editJobData.restApiID = row.uap_rest_api.id;
			}
			this.editJobData.restParam = row.rest_param;
			this.editJobDialog = true;
			this.jobOperate = "Edit";
			this.getJobHostIp();
		},
		/**
		 * 编辑job
		 */
		editJobConfirm: function() {
			var httpUrl = "/uap-schedule/job/" + this.selJob.id;
			var This = this;
			this.$refs.editJobData.validate(function(valid) {
				if(valid) {
					var data = {};
					data.exec_host_ip = This.editJobData.exec_host_ip;
					data.description = This.editJobData.description;
					data.exec_host_ip = This.editJobData.exec_host_ip;
					data.description = This.editJobData.description;
					data.rest_api_id = This.selApi.id;
					data.rest_param = This.editJobData.restParam;
					if(This.editJobData.restParam != "" && This.editJobData.restParam.trim().length > 0){
						if(!This.isJSON(This.addJobData.restParam)) {
							This.$message({
								showClose: true,
								message: $.t("timeTask.inputJson"),
								type: 'warning'
							});
							return;
						}
					}
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.editJobDialog = false;
						This.getJobList(This.selGroup.id);
					}, function() {
						This.editJobDialog = false;
					});
				} else {
					return false;
				}
			});
		},
		/**
		 * 删除job
		 */
		deleteJob: function(index, row) {
			var This = this;
			var httpUrl = "/uap-schedule/job/" + row.id;
			HTTP.httpDelete(This, httpUrl, {}, function(res) {
				This.getJobList(This.selGroup.id);
			});
		},
		/**
		 * 获取job
		 */
		getJobList: function(groupId) {
			this.jobList = [];
			var This = this;
			var httpUrl = "/uap-schedule/job/" + groupId;
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.length > 0) {
					for(var i = 0; i < res.data.length; i++) {
						res.data[i].insert_time = moment(res.data[i].insert_time).format("YYYY-MM-DD HH:mm:ss");
					}
					This.jobList = res.data;
				}
			})
		},
		/**
		 * 获取配置的主机IP
		 */
		getJobHostIp: function() {
			this.hostIp = [];
			var This = this;
			var httpUrl = "/uap-schedule/job/execHostIp";
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.length > 0) {
					This.hostIp = res.data;
				}
			})
		},

		openApiDialog: function() {
			this.international();
			this.apiDialog = true;
			this.searchApiName = "";
			this.total_count = 0;
			this.currentPage = 1;
			this.page_size = 10;
			this.appList = [];
			this.apiList = [];
			this.searchAppID = "";
			this.selApiList = [];
			this.selApi = {};
			this.getApp();
		},
		/**
		 * 选择api
		 * @param {Object} val
		 */
		handleSelectionChange: function(val) {
			this.selApiList = val;
		},
		/**
		 * 选择api确认
		 */
		apiConfirm: function() {
			if(this.selApiList.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selApi"),
					type: 'warning'
				});
				return;
			}
			if(this.selApiList.length > 1) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selApiOne"),
					type: 'warning'
				});
				return;
			}

			this.selApi = this.selApiList[0];
			if(this.jobOperate == "Add") {
				this.addJobData.restApi = this.selApi.name;
				this.addJobData.restApiID = this.selApi.id;
				this.$refs.addJobData.validate(function(valid) {
					if(valid) {} else {
						return false;
					}
				});
			} else {
				this.editJobData.restApi = this.selApi.name;
				this.editJobData.restApiID = this.selApi.id;
				this.$refs.editJobData.validate(function(valid) {
					if(valid) {} else {
						return false;
					}
				});
			}
			this.apiDialog = false;
		},
		//app选择
		selectApp: function() {
			this.currentPage = 1;
			this.getApiList();
		},

		//根据名称查询APP
		searchApi: function() {
			this.currentPage = 1;
			this.getApiList();
		},

		//获取所有应用
		getApp: function() {
			var This = this;
			var httpUrl = "/uap/app/list";
			var data = {};
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.appList = res.data;
				This.searchAppID = Common.getUserInfo().app_id;
				This.getApiList();
			});
		},
		/**
		 * 获取应用表格数据
		 */
		getApiList: function() {
			var httpUrl = "/uap/restApi/list";
			this.apiList = [];
			var data = {};
			data.start = (this.currentPage - 1) * this.page_size;
			data.limit = this.page_size;
			data.app_id = this.searchAppID;
			data.type = "1";
			if(this.searchApiName !== "") {
				data.name = this.searchApiName;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var res = res.data;
				This.apiList = res;
			});
		},
		handleSizeChange: function(val) {
			this.page_size = val;
			this.getApiList();
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.start = this.page_size * (this.currentPage - 1);
			this.getApiList();
		},
		//国际化
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.name[0].message = $.t("common.inputName");
				This.rules.name[1].message = $.t("common.inputLength");
				This.rules.description[0].message = $.t("common.descriptionLength");
				This.editRules.description[0].message = $.t("common.descriptionLength");
				This.rulesJob.job_name[0].message = $.t("common.inputName");
				This.rulesJob.job_name[1].message = $.t("common.inputLength");
				This.rulesJob.description[0].message = $.t("common.descriptionLength");
				This.rulesJob.restApi[0].message = $.t("timeTask.selApi");
				if(success != undefined) {
					success();
				}
			});
		},
		//测试job配置的rest api
		testApi: function(restApi, restParam) {
			if(restApi == "") {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selApi"),
					type: 'warning'
				});
				return;
			} else {
				var This = this;
				var httpUrl = "/uap-schedule/job/test";
				var data = {};
				data.rest_api_id = restApi;
				data.rest_param = restParam;
				HTTP.httpPost(this, httpUrl, data, function(res) {
					This.$message({
						showClose: true,
						message: res.message,
						type: 'warning'
					});

				});
			}
		},
		/**
		 * 判断字符串是否为JSON格式
		 * @param {Object} str
		 */
		isJSON: function(str) {
			if(typeof str == 'string') {
				try {
					var obj = JSON.parse(str);
					if(typeof obj == 'object' && obj) {
						return true;
					} else {
						return false;
					}

				} catch(e) {
					return false;
				}
			}
		}
	}
});