new Vue({
	el: "#jobLog",
	data: function() {
		return {
			props: {
				id: 'no',
				label: 'name',
				isLeaf: 'is_leaf'
			},
			jobLogList: [],
			currentPage: 1, //当前页
			pageSize: 10, //每页显示多少条
			total: 0, //总条数
			selGroup: {},
			selJob: {},
			logState: "99",
			listLoading: false
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getJobLogList(This.currentPage, This.pageSize);
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
			if(data.no.indexOf("group") >= 0) { //点击的是分组
				this.selGroup = data;
				this.selJob = {};
			}
			if(data.no.indexOf("job") >= 0) { //点击的是job
				this.selJob = data;
			}
			this.getJobLogList(this.currentPage, this.pageSize);
		},
		//每页多少条处理函数
		handleSizeChange: function(val) {
			this.pageSize = val;
			this.currentPage = 1;
			this.getJobLogList(this.currentPage, this.pageSize);
		},
		//当前页数据展示
		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getJobLogList(this.currentPage, this.pageSize);
		},
		/**
		 * 日志结果选择过滤
		 */
		selectState: function() {
			this.currentPage = 1;
			this.getJobLogList(this.currentPage, this.pageSize);
		},
		/**
		 * 刷新
		 */
		refreshBtn: function() {
			this.currentPage = 1;
			this.getJobLogList(this.currentPage, this.pageSize);
		},
		/**
		 * 获取日志列表
		 * @param {Object} pageNum
		 * @param {Object} showNum
		 */
		getJobLogList: function(pageNum, showNum) {
			var httpUrl = "/uap-schedule/jobLog";
			this.jobLogList = [];
			var data = {};
			if(this.selGroup.group_name != undefined) {
				data.job_group = this.selGroup.group_name;
			}
			if(this.selJob.job_name != undefined) {
				data.job_name = this.selJob.job_name;
			}
			if(this.logState != "99") {
				data.exec_result = this.logState;
			}
			data.start = (pageNum - 1) * showNum;
			data.limit = showNum;
			var This = this;
			this.listLoading = true;
			HTTP.httpPost(This, httpUrl, data, function(res) {
				This.total = res.total;
				var res = res.data;
				var row = [];
				for(var i = 0; i < res.length; i++) {
					var item = res[i];
					if(item.exec_result == "F") {
						item.exec_result_no = $.t("timeTask.fail");;
					} else if(item.exec_result == "S") {
						item.exec_result_no = $.t("timeTask.success");;
					} else if(item.exec_result == "M") {
						item.exec_result_no = $.t("timeTask.miss");;
					}
					item.exec_time = moment(item.exec_time).format("YYYY-MM-DD HH:mm:ss")
					row.push(item);
				}
				This.jobLogList = row;
				This.listLoading = false;
			}, function(error) {
				This.listLoading = false;
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
				if(success != undefined) {
					success();
				}
			});
		}
	}
});