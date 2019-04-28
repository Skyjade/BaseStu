new Vue({
	el: "#tasks",
	data: function() {
		return {
			tasksList: [],
			total_count: 0,
			currentPage: 1,
			size: 10,
			status: "0",
			name: "",
			endtimeA: "",
			endtimeB: "",
			createtimeA: "",
			createtimeB: ""
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international();
		HTTP.getCodeAndMenus(this, [], function(res) {
			This.getTasksList(This.currentPage, This.status, This.name);
		});
	},
	methods: {
		/**
		 * 进入详情界面
		 * @param {Object} row
		 */
		openDetail: function(row) {
			window.location.href = encodeURI("taskDetail.html?taskId=" + row.id + '&taskName=' + row.name);
		},
		handleSizeChange: function(val) {
			this.size = val;
			this.getTasksList(this.currentPage, this.status, this.name)
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getTasksList(this.currentPage, this.status, this.name);
		},
		/**
		 * 状态选择
		 */
		selectStatus: function() {
			this.currentPage = 1;
			this.getTasksList(this.currentPage, this.status, this.name);
		},

		searchBtn: function() {
			this.currentPage = 1;
			this.getTasksList(this.currentPage, this.status, this.name)
		},
		/**
		 * 获取Tasks列表
		 */
		getTasksList: function(pageNum, status, name) {
			var start = (pageNum - 1) * this.size;
			var httpUrl = "/uap-bpm/query/historic-task-instances"
			var This = this;
			var data = {}
			data.size = this.size;
			data.start = start;
			switch(status) {
				case "1":
					data.finished = false;
					break;
				case "2":
					data.finished = true;
					break;
			}
			if(name != "") {
				data.task_name_like = "%" + name + "%";
			}

			if(this.endtimeA != "" && this.endtimeA != 0 && this.endtimeA != null) {
				data.task_completed_after = new Date(this.endtimeA).getTime();
			}
			if(this.endtimeB != "" && this.endtimeB != 0 && this.endtimeB != null) {
				data.task_completed_before = new Date(this.endtimeB).getTime();
			}

			if(this.createtimeA != "" && this.createtimeA != 0 && this.createtimeA != null) {
				data.task_created_after = new Date(this.createtimeA).getTime();
			}
			if(this.createtimeB != "" && this.createtimeB != 0 && this.createtimeB != null) {
				data.task_created_before = new Date(this.createtimeB).getTime();
			}

			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				This.tasksList = res.data;
			});
		},
		//国际化
		international: function() {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
			});
		},
		dateFormat: function(row, column) {
			var date = row[column.property];
			if(date == undefined) {
				return "";
			}
			return moment(date).format("YYYY-MM-DD HH:mm:ss");
		}
	}
});