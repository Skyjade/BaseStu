new Vue({
	el: "#taskDetail",
	data: function() {
		return {
			taskId: "",
			taskName: "",
			title: "",
			task: {}, //task详情
			editTaskTitle: "",
			editTaskDialog: false,
			editTask: {
				name: "",
				description: "",
				assignee: "",
				owner: "",
				dueDate: "",
				priority: "",
				category: ""
			},

			assignTaskTitle: "",
			assignTaskContent: "",
			assignTaskDialog: false,
			assignee: "",
			isComplete: false, //是否完成
			selUserList: [], //选择的用户
			entrustBtn: true, // 委托确认是否可用
			userList: [], //用户列表数据
			selUserNum: "", //用于判断编辑或者指派时弹出用户
		}
	},
	created: function() {
		Common.elementLng();
		this.international();
		var url = decodeURI(location.search); //获取url中"?"符后的字串 ('?modFlag=business&role=1')  
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；  
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		this.taskId = theRequest.taskId;
		this.getTask(this.taskId);
	},
	methods: {
		getTask: function(id) {
			var httpUrl = "/uap-bpm/history/historic-task-instances/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.endTime == null) {
					This.isComplete = true;
					res.data.status = "Active";
				} else {
					This.isComplete = false;
					res.data.status = "Completed";
				}
				res.data.startTime = moment(res.data.startTime).format("YYYY-MM-DD HH:mm:ss");
				if(res.data.endTime != null) {
					res.data.endTime = moment(res.data.endTime).format("YYYY-MM-DD HH:mm:ss")
				}
				This.task = res.data;
				This.editTaskTitle = $.t("common.edit") + "'" + This.task.name + "'";
				This.taskName = This.task.name;
				This.title = This.task.name + " - " + This.task.id;
			});
		},
		/**
		 * 打开编辑task弹出框
		 */
		openEditTaskDialog: function() {
			this.editTaskDialog = true;
			this.editTaskTitle = $.t("common.edit") + "'" + this.taskName + "'";
			this.editTask.name = this.task.name;
			this.editTask.description = this.task.description;
			this.editTask.assignee = this.task.assignee;
			this.editTask.owner = this.task.owner;
			this.editTask.dueDate = this.task.dueDate;
			this.editTask.priority = this.task.priority;
			this.editTask.category = this.task.category;
		},
		/**
		 * 更新task
		 */
		updateTask: function() {
			var httpUrl = "/uap-bpm/runtime/tasks/" + this.taskId;
			var data = {};
			data.name = this.editTask.name;
			data.description = this.editTask.description;
			data.assignee = this.editTask.assignee;
			data.owner = this.editTask.owner;
			data.due_date = this.editTask.dueDate;
			data.priority = this.editTask.priority;
			data.category = this.editTask.category;
			var This = this;
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.getTask(This.taskId);
				This.editTaskDialog = false;
			}, function(error) {
				This.editTaskDialog = false;
			});
		},
		/**
		 * 打开Assign Task弹出框
		 */
		openAssignTaskDialog: function(val) {
			this.selUserNum = val;
			this.assignTaskDialog = true;
			this.assignTaskTitle = "'" + this.taskName + "'";
			this.assignTaskContent = "'" + this.taskName + "(" + this.taskId + ")" + "'";
			this.selUserList = [];
			this.getUserList();
		},
		/**
		 * 更新Category
		 */
		updateCategory: function() {
			if(this.selUserNum == 1) {
				this.assignee = this.selUserList[0].no;
				var httpUrl = "/uap-bpm/runtime/tasks/" + this.taskId;
				var data = {};
				data.assignee = this.assignee;
				var This = this;
				HTTP.httpPut(this, httpUrl, data, function(res) {
					This.getTask(This.taskId);
					This.assignTaskDialog = false;
				}, function(error) {
					This.assignTaskDialog = false;
				});
			} else if(this.selUserNum == 2) {
				this.editTask.assignee = this.selUserList[0].no;
				this.assignTaskDialog = false;
			} else if(this.selUserNum == 3) {
				this.editTask.owner = this.selUserList[0].no;
				this.assignTaskDialog = false;
			}

		},
		/**
		 * 完成Task
		 */
		completeTask: function() {
			var content = $.t("task.completeTaskMess") + "'" + this.taskName + "'" + "(" + this.taskId + ")" + "?"
			var title = $.t("task.completeTask") + "'" + this.taskName + "'";
			var This = this;
			this.$alert(content, title, {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/runtime/tasks/" + This.taskId;
						var data = {};
						data.action = "complete";
						HTTP.httpPost(This, httpUrl, data, function(res) {
							This.getTask(This.taskId);
						});
					}
				}
			});
		},
		/**
		 * 删除task
		 */
		deleteTask: function() {
			var content = $.t("task.deleteTaskMess") + "'" + this.taskId + "?"
			var title = $.t("task.deleteTask") + "'" + this.taskId + "'";
			var This = this;
			this.$alert(content, title, {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/history/historic-task-instances/" + This.taskId;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							location.replace("tasks.html");
						});
					}
				}
			});
		},
		//国际化
		international: function() {
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
			});
		},
		//获取用户列表
		getUserList: function() {
			this.userList = [];
			var httpUrl = "/uap/user/list";
			var data = {};
			data.app_id = Common.getUserInfo().app_id;
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.userList = res.data;
			});
		},
		//表格单选
		userSelectionChange: function(val) {
			this.selUserList = val;
			if(this.selUserList.length == 1 && this.selUserList[0].no != Common.getUserInfo().no) {
				this.entrustBtn = false;
			} else {
				this.entrustBtn = true;
			}
		},

	}
});