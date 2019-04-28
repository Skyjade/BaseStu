new Vue({
	el: "#histroyTask",
	data: function() {
		return {
			table_head: [], //表头
			taskList: [],
			currentPage: 1, //当前页
			pageSize: 10, //每页显示多少条
			total_count: 0, //总条数
			search: {
				processInstanceId: "",
				processDefinitionName: "",
				workName: "",
				linkStartupTime: "",
				linkEndupTime: "",
			},
			selList: [],
			flowChartDialog: false,
			flowChartSrc: "",
			functionBtn: true //功能按钮是否可用
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getTaskList(This.currentPage, This.pageSize);
			});
		});
	},
	methods: {
		viewFlowChart: function() {
			this.flowChartDialog = true;
			this.flowChartSrc = "common/flowChart.html?processInstanceId=" + this.selList[0].process_instance_id + '&processDefinitionId=' + this.selList[0].process_definition_id;
		},
		/**
		 * 处理 进入详情界面
		 */
		//		openDetail: function() {
		//			window.location.href = encodeURI("myTaskDetail.html?obj=" + JSON.stringify(this.selList[0]));
		//		},

		//表格单选
		handleSelectionChange: function(val) {
			this.selList = val;
			if(this.selList.length == 1) {
				this.functionBtn = false;
			} else {
				this.functionBtn = true;
			}
		},

		handleSizeChange: function(val) {
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getTaskList(this.currentPage, this.pageSize);
		},
		searchBtn: function() {
			this.currentPage = 1;
			this.getTaskList(this.currentPage, this.pageSize);
		},
		/**
		 * 获取列表
		 * @param {Object} pageNum
		 * @param {Object} showNum
		 * @param {Object} processInstanceId 流程编号
		 * @param {Object} processDefinitionName 流程名称
		 * @param {Object} workName 工作项名称
		 * @param {Object} linkStartupTime 环节启动时间
		 * @param {Object} linkEndupTime
		 */
		getTaskList: function(pageNum, showNum) {
			this.taskList = [];
			var httpUrl = "/uap-bpm/app/bpm/task/history"
			var This = this;
			var data = {};
			data.finished = true;
			data.start = (pageNum - 1) * showNum;
			data.limit = showNum;
			data.menu_id = 2;
			if(this.search.linkStartupTime != "" && this.search.linkStartupTime != 0 && this.search.linkStartupTime != null) {
				data.created_after = new Date(this.search.linkStartupTime).getTime();
			}
			if(this.search.linkEndupTime != "" && this.search.linkEndupTime != 0 && this.search.linkEndupTime != null) {
				data.created_before = new Date(this.search.linkEndupTime).getTime();
			}
			if(this.search.workName != "") {
				data.name_like = this.search.workName;
			}
			if(this.search.processDefinitionName != "") {
				data.process_definition_name_like = this.search.processDefinitionName;
			}
			if(this.search.processInstanceId != "") {
				data.process_instance_id = this.search.processInstanceId;
			}
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.data.total;
				//				This.taskList = res.data;
				This.table_head = res.data.form_info;
				var timeList = [];
				if(This.table_head.length > 0) {
					for(var i = 0; i < res.data.form_info.length; i++) {
						if(res.data.form_info[i].uap_page_field.type == "time") {
							timeList.push(res.data.form_info[i].uap_page_field.field);
						}
					}
					for(var j = 0; j < res.data.task_custom_info_list.length; j++) {
						var keys = Object.keys(res.data.task_custom_info_list[j]);
						for(var m = 0; m < keys.length; m++) {
							for(var n = 0; n < timeList.length; n++) {
								if(keys[m] == timeList[n]) {
									res.data.task_custom_info_list[j][keys[m]] = moment(res.data.task_custom_info_list[j][keys[m]]).format("YYYY-MM-DD HH:mm:ss");
								}
							}
						}
					}
					This.taskList = res.data.task_custom_info_list;
				}
			}, function(error) {
				This.total_count = 0;
				This.taskList = [];
			});
		},

		//国际化
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				success();
			});
		},
		dateFormat: function(row, column) {
			var date = row[column.property];
			if(date == undefined) {
				return "";
			}
			return moment(date).format("YYYY-MM-DD HH:mm:ss");
		},
		//撤回
		revokeTask: function() {
			var This = this;
			this.$alert($.t("homePage.confirmRevoke"), '', {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-demo/defect/revoke";
						var data = {
							id: This.selList[0].business_key,
							process_instance_id: This.selList[0].process_instance_id
						};
						HTTP.httpPut(This, httpUrl, data, function(res) {
							This.getTaskList(This.currentPage, This.pageSize);
						});
					}
				}
			});
		}
	}
});