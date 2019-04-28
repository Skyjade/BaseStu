new Vue({
	el: "#schedule",
	data: function() {
		return {
			groupAndJobData: [],
			props: {
				id: 'no',
				label: 'name',
				isLeaf: 'is_leaf'
			},
			jobList: [], //任务列表数据
			addTaskData: {
				taskType: "1", //任务类型
				executionTime: "", //任务起始执行时间
				endTime: "", //任务结束时间
				interval: 1, //触发间隔
				intervalUnit: "S", //间隔单位
				exclusionTime: [], //排除日期集合
				description: "", //任务描述
				expression: "", //cron表达式
				misfireTactic: "" //错过处理策略  
			},
			editTaskData: {
				job_name: "",
				job_group: "",
				taskType: "1", //任务类型
				executionTime: "", //任务起始执行时间
				endTime: "", //任务结束时间
				interval: 1, //触发间隔
				intervalUnit: "S", //间隔单位
				exclusionTime: [], //排除日期集合
				description: "", //任务描述
				expression: "", //cron表达式
				misfireTactic: "" //错过处理策略  
			},
			rules: {
				description: [{
					max: 255,
					message: "",
					trigger: 'blur'
				}],
				executionTime: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				interval: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				intervalUnit: [{
					required: true,
					message: "",
					trigger: 'blur'
				}]
			},
			addTaskDialog: false, //新建任务弹出框是否显示
			editTaskDialog: false,
			pickerOptionsDateLimit: {
				disabledDate: function(time) {
					return time.getTime() < Date.now() - 8.64e7;
				}
			},
			isSimpleTask: false, //是否是简单任务
			selList: [], //选择的任务
			jobTitle: "",
			selGroup: {},
			selJob: {},
			listLoading: false,

		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getTaskList();
			});
		});
	},
	methods: {
		loadNode: function(node, resolve) {
			if(node.level === 0) {
				this.getGroupList(function(data) {
					return resolve(data);
				})
			}
			if(node.level > 0) {
				this.getJobList(node.data.id, function(data) {
					return resolve(data);
				});
			}
		},
		/**
		 * 获取分组列表数据
		 */
		getGroupList: function(success) {
			var This = this;
			var httpUrl = "/uap-schedule/jobGroup";
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.length > 0) {
					for(var i = 0; i < res.data.length; i++) {
						res.data[i].is_leaf = false;
						res.data[i].no = "group" + res.data[i].id;
						res.data[i].name = res.data[i].group_name;
					}
					success(res.data);
				} else {
					success([])
				}
			})
		},
		/**
		 * 获取job
		 */
		getJobList: function(groupId, success) {
			this.jobList = [];
			var This = this;
			var httpUrl = "/uap-schedule/job/" + groupId;
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.length > 0) {
					for(var i = 0; i < res.data.length; i++) {
						res.data[i].is_leaf = true;
						res.data[i].no = "job" + res.data[i].id;
						res.data[i].name = res.data[i].job_name;
					}
					success(res.data);
				} else {
					success([])
				}
			})
		},
		/**
		 * 树节点点击事件
		 * @param {Object} data
		 */
		handleNodeClick: function(data) {
			this.jobTitle = "";
			if(data.no.indexOf("group") >= 0) { //点击的是分组
				this.jobTitle = data.name;
				this.selGroup = data;
				this.selJob = {};
			}
			if(data.no.indexOf("job") >= 0) { //点击的是job
				this.jobTitle = this.selGroup.group_name + "/" + data.name;
				this.selJob = data;
			}
			this.getTaskList();
		},
		//表格单选
		handleSelectionChange: function(val) {
			this.selList = val;
			if(this.selList.length > 1) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selTaskOne"),
					type: 'warning'
				});
				return;
			}
		},
		/**
		 * 打开新建任务弹出框
		 */
		openAddTaskDialog: function() {
			if(this.selJob.id == undefined) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selJob"),
					type: 'warning'
				});
				return;
			}
			this.clearAddData();
			this.addTaskDialog = true;
		},
		/**
		 * 新增任务
		 */
		addTaskConfirm: function() {
			var This = this;
			if(this.isSimpleTask) {
				this.$refs.addTaskData.validate(function(valid) {
					if(valid) {
						var httpUrl = "/uap-schedule/task/simple";
						var data = {};
						data.description = This.addTaskData.description;
						data.excluded_date_list = This.addTaskData.exclusionTime;
						data.group_id = This.selJob.group_id;
						data.job_id = This.selJob.id;
						data.trigger_request = {};
						data.trigger_request.repeat_interval = This.addTaskData.interval;
						data.trigger_request.repeat_unit = This.addTaskData.intervalUnit;
						data.trigger_request.start_time = This.addTaskData.executionTime;
						data.misfire_tactic = This.addTaskData.misfireTactic;
						if(This.addTaskData.endTime != "" && This.addTaskData.endTime != 0 && This.addTaskData.endTime != null) {
							data.trigger_request.end_time = This.addTaskData.endTime;
							if(data.trigger_request.end_time <= data.trigger_request.start_time) {
								This.$message({
									showClose: true,
									message: $.t("timeTask.timeMax"),
									type: 'warning'
								});
								return;
							}
						}
						if(data.trigger_request.repeat_interval <= 0) {
							This.$message({
								showClose: true,
								message: $.t("timeTask.intervalLength"),
								type: 'warning'
							});
							return;
						}
						if(data.trigger_request.repeat_interval > 999999999999) {
							This.$message({
								showClose: true,
								message: $.t("timeTask.intervalMax"),
								type: 'warning'
							});
							return;
						}
						HTTP.httpPost(This, httpUrl, data, function(res) {
							This.addTaskDialog = false;
							This.getTaskList();
						}, function() {
							This.addTaskDialog = false;
						});
					} else {
						return false;
					}
				});
			} else {
				if(This.addTaskData.expression.trim() == "") {
					This.$message({
						showClose: true,
						message: $.t("timeTask.cronNotNull"),
						type: 'warning'
					});
					return;
				}
				var httpUrl = "/uap-schedule/task/cron";
				var data = {};
				data.description = This.addTaskData.description;
				data.excluded_date_list = This.addTaskData.exclusionTime;
				data.group_id = This.selJob.group_id;
				data.job_id = This.selJob.id;
				data.cron_expression = This.addTaskData.expression;
				data.misfire_tactic = This.addTaskData.misfireTactic;
				HTTP.httpPost(This, httpUrl, data, function(res) {
					This.addTaskDialog = false;
					This.getTaskList();
				}, function() {
					This.addTaskDialog = false;
				});
			}
		},
		/**
		 * 打开编辑弹出框
		 * @param {Object} index
		 * @param {Object} row
		 */
		editTask: function(index, row) {
			this.editTaskData.job_name = row.job_name;
			this.editTaskData.job_group = row.job_group;
			this.editTaskData.job_id = row.job_id;
			this.editTaskData.group_id = row.group_id;
			this.editTaskData.description = row.description;
			this.editTaskData.exclusionTime = row.excluded_date_list;
			this.editTaskData.misfireTactic = (row.misfire_tactic).toString();
			if(row.cron_expression == undefined) { //简单任务
				this.isSimpleTask = true;
				this.editTaskData.taskType = "0";
				this.editTaskData.executionTime = row.trigger_model.start_time;
				this.editTaskData.endTime = row.trigger_model.end_time;
				this.editTaskData.interval = row.trigger_model.repeat_interval;
				this.editTaskData.intervalUnit = row.trigger_model.repeat_unit;
			} else {
				this.isSimpleTask = false;
				this.editTaskData.taskType = "1";
				this.editTaskData.expression = row.cron_expression;
			}
			this.editTaskDialog = true;
		},
		/**
		 * 编辑任务
		 */
		editTaskConfirm: function() {
			var httpUrl = "";
			var This = this;
			var data = {};
			data.description = This.editTaskData.description;
			data.group_id = This.editTaskData.group_id;
			data.job_id = This.editTaskData.job_id;
			data.excluded_date_list = This.editTaskData.exclusionTime;
			data.misfire_tactic = This.editTaskData.misfireTactic;
			if(this.isSimpleTask) { //简单任务
				this.$refs.editTaskData.validate(function(valid) {
					if(valid) {
						data.trigger_request = {};
						data.trigger_request.repeat_interval = This.editTaskData.interval;
						data.trigger_request.repeat_unit = This.editTaskData.intervalUnit;
						data.trigger_request.start_time = new Date(This.editTaskData.executionTime).getTime();
						if(This.editTaskData.endTime != "" && This.editTaskData.endTime != 0 && This.editTaskData.endTime != null) {
							data.trigger_request.end_time = new Date(This.editTaskData.endTime).getTime();
							if(data.trigger_request.end_time <= data.trigger_request.start_time) {
								This.$message({
									showClose: true,
									message: $.t("timeTask.timeMax"),
									type: 'warning'
								});
								return;
							}
						}
						if(data.trigger_request.repeat_interval <= 0) {
							This.$message({
								showClose: true,
								message: $.t("timeTask.intervalLength"),
								type: 'warning'
							});
							return;
						}
						if(data.trigger_request.repeat_interval > 999999999999) {
							This.$message({
								showClose: true,
								message: $.t("timeTask.intervalMax"),
								type: 'warning'
							});
							return;
						}
						httpUrl = "/uap-schedule/task/updateSmpleTask";
						HTTP.httpPost(This, httpUrl, data, function(res) {
							This.editTaskDialog = false;
							This.getTaskList();
						}, function() {
							This.editTaskDialog = false;
						});
					} else {
						return false;
					}
				});
			} else { //高级任务
				if(This.editTaskData.expression.trim() == "") {
					This.$message({
						showClose: true,
						message: $.t("timeTask.cronNotNull"),
						type: 'warning'
					});
					return;
				}
				data.cron_expression = This.editTaskData.expression;
				httpUrl = "/uap-schedule/task/updateCronTask";
				HTTP.httpPost(This, httpUrl, data, function(res) {
					This.editTaskDialog = false;
					This.getTaskList();
				}, function() {
					This.editTaskDialog = false;
				});
			}
		},
		/**
		 * 删除任务
		 * @param {Object} index
		 * @param {Object} row
		 */
		deleteTask: function(index, row) {
			var httpUrl = "/uap-schedule/task/deleteTask";
			var data = {};
			data.group_id = row.group_id;
			data.job_id = row.job_id;
			var This = this;
			this.$alert(i18n.t('common.confirmDelete'), '', {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						HTTP.httpPost(This, httpUrl, data, function() {
							This.getTaskList();
						});
					}
				}
			});
		},
		/**
		 * 执行任务
		 */
		executeTask: function() {
			if(this.selList.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selTask"),
					type: 'warning'
				});
				return;
			}
			//状态为NONE，PAUSED，BLOCKED的不可执行
			if(this.selList[0].state == "NONE" || this.selList[0].state == "PAUSED" || this.selList[0].state == "BLOCKED") {
				this.$message({
					showClose: true,
					message: $.t("timeTask.taskNo"),
					type: 'warning'
				});
				return;
			}
			var httpUrl = "/uap-schedule/task/execute";
			var data = {};
			data.group_id = this.selList[0].group_id;
			data.job_id = this.selList[0].job_id;
			var This = this;
			HTTP.httpPost(This, httpUrl, data, function() {
				setTimeout(function() {
					This.getTaskList();
				}, 100)
			});
		},

		/**
		 * 暂停任务
		 */
		pauseTask: function() {
			if(this.selList.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selTask"),
					type: 'warning'
				});
				return;
			}
			if(this.selList[0].state == "NONE" || this.selList[0].state == "PAUSED") {
				this.$message({
					showClose: true,
					message: $.t("timeTask.pauseNo"),
					type: 'warning'
				});
				return;
			} //状态为NONE，PAUSED的不可暂停
			var httpUrl = "/uap-schedule/task/pause";
			var data = {};
			data.group_id = this.selList[0].group_id;
			data.job_id = this.selList[0].job_id;
			var This = this;
			HTTP.httpPost(This, httpUrl, data, function() {
				This.getTaskList();
			});
		},

		/**
		 * 恢复任务
		 */
		resumeTask: function() {
			if(this.selList.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("timeTask.selTask"),
					type: 'warning'
				});
				return;
			}
			if(this.selList[0].state != "PAUSED") {
				this.$message({
					showClose: true,
					message: $.t("timeTask.pauseCanResume"),
					type: 'warning'
				});
				return;
			} //只有状态为PAUSED可以恢复
			var httpUrl = "/uap-schedule/task/resume";
			var data = {};
			data.group_id = this.selList[0].group_id;
			data.job_id = this.selList[0].job_id;
			var This = this;
			HTTP.httpPost(This, httpUrl, data, function() {
				This.getTaskList();
			});
		},
		/**
		 * 获取任务列表
		 */
		getTaskList: function() {
			this.jobList = [];
			var httpUrl = "/uap-schedule/task/findTask";
			var This = this;
			var data = {};
			if(this.selGroup.id != undefined) {
				data.group_id = this.selGroup.id;
			}
			if(this.selJob.id != undefined) {
				data.job_id = this.selJob.id;
				data.group_id = this.selJob.group_id;
			}
			this.listLoading = true;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var row = [];
				for(var i = 0; i < res.data.length; i++) {
					var item = res.data[i];
					switch(item.state) {
						case "NONE":
							item.stateNo = $.t("timeTask.status1");
							break;
						case "NORMAL":
							item.stateNo = $.t("timeTask.status2");
							break;
						case "PAUSED":
							item.stateNo = $.t("timeTask.status3");
							break;
						case "COMPLETE":
							item.stateNo = $.t("timeTask.status4");
							break;
						case "ERROR":
							item.stateNo = $.t("timeTask.status5");
							break;
						case "BLOCKED":
							item.stateNo = $.t("timeTask.status6");
							break;
					}
					if(item.cron_expression == undefined) { //简单任务
						if(item.trigger_model != undefined) {
							if(item.trigger_model.end_time == undefined) {
								item.trigger_model.end_time_no = "";
							} else {
								item.trigger_model.end_time_no = moment(item.trigger_model.end_time).format("YYYY-MM-DD HH:mm:ss")
							}
							item.trigger_model.start_time_no = moment(item.trigger_model.start_time).format("YYYY-MM-DD HH:mm:ss")
							switch(item.trigger_model.repeat_unit) {
								case "Y":
									item.trigger_model.repeat_unit_no = $.t("timeTask.year");
									break;
								case "M":
									item.trigger_model.repeat_unit_no = $.t("timeTask.month");
									break;
								case "D":
									item.trigger_model.repeat_unit_no = $.t("timeTask.day");
									break;
								case "H":
									item.trigger_model.repeat_unit_no = $.t("timeTask.hour");
									break;
								case "MI":
									item.trigger_model.repeat_unit_no = $.t("timeTask.minute");
									break;
								case "S":
									item.trigger_model.repeat_unit_no = $.t("timeTask.second");
									break;
								case "W":
									item.trigger_model.repeat_unit_no = $.t("timeTask.week");
									break;
							}
							item.interval = item.trigger_model.repeat_interval + item.trigger_model.repeat_unit_no;
						}
					}
					row.push(item);
				}
				This.jobList = row;
				This.listLoading = false;
			}, function(error) {
				This.listLoading = false;
			})
		},
		/**
		 * 选择新建任务类型
		 */
		selectTaskType: function() {
			if(this.addTaskData.taskType == "0") {
				this.isSimpleTask = true;
			} else {
				this.isSimpleTask = false;
			}
		},
		/**
		 * 清除新增数据
		 */
		clearAddData: function() {
			this.addTaskData.taskType = "1";
			this.addTaskData.name = "";
			this.addTaskData.group = "";
			this.addTaskData.executionTime = "";
			this.addTaskData.endTime = "";
			this.addTaskData.interval = 1;
			this.addTaskData.intervalUnit = "S";
			this.addTaskData.exclusionTime = [];
			this.addTaskData.description = "";
			this.addTaskData.expression = "";
			this.isSimpleTask = false;
		},
		//国际化
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.description[0].message = $.t("common.descriptionLength");
				This.rules.executionTime[0].message = $.t("timeTask.selExecutionTime");
				if(success != undefined) {
					success();
				}
			});
		}
	}
});