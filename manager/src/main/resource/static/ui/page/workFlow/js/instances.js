new Vue({
	el: "#instances",
	data: function() {
		return {
			ProcessDefinitionsList: [],
			instancesList: [],
			total_count: 0,
			currentPage: 1,
			size: 10,
			status: "0",
			endtimeA: "",
			endtimeB: "",
			createtimeA: "",
			createtimeB: ""
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getProcessDefinitionsList(function() {
					This.getInstancesList(This.currentPage, This.status);
				});
			});
		});
	},
	methods: {
		/**
		 * 进入详情界面
		 * @param {Object} row
		 */
		openDetail: function(row) {
			window.location.href = encodeURI("instanceDetail.html?instanceId=" + row.id);
		},
		handleSizeChange: function(val) {
			this.size = val;
			this.getInstancesList(this.currentPage, this.status)
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getInstancesList(this.currentPage, this.status)
		},
		/**
		 * 状态选择
		 */
		selectStatus: function() {
			this.currentPage = 1;
			this.getInstancesList(this.currentPage, this.status)
		},

		searchBtn: function() {
			this.getInstancesList(this.currentPage, this.status);
		},
		/**
		 * 获取Definitions列表
		 */
		getInstancesList: function(pageNum, finished) {
			var start = (pageNum - 1) * this.size;
			var httpUrl = "/uap-bpm/query/historic-process-instances";
			var This = this;
			var data = {}
			data.size = this.size;
			data.start = start;
			if(finished != undefined) {
				switch(finished) {
					case "1":
						data.finished = false;
						break;
					case "2":
						data.finished = true;
						break;
				}
			}
			if(this.endtimeA != "" && this.endtimeA != 0 && this.endtimeA != null) {
				data.finished_after = new Date(this.endtimeA).getTime();
			}
			if(this.endtimeB != "" && this.endtimeB != 0 && this.endtimeB != null) {
				data.finished_before = new Date(this.endtimeB).getTime();
			}

			if(this.createtimeA != "" && this.createtimeA != 0 && this.createtimeA != null) {
				data.started_after = new Date(this.createtimeA).getTime();
			}
			if(this.createtimeB != "" && this.createtimeB != 0 && this.createtimeB != null) {
				data.started_before = new Date(this.createtimeB).getTime();
			}
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var row = [];
				if(res.data.length > 0) {
					for(var i = 0; i < res.data.length; i++) {
						var rowObj = res.data[i];
						for(var j = 0; j < This.ProcessDefinitionsList.length; j++) {
							if(rowObj.process_definition_id == This.ProcessDefinitionsList[j].id) {
								rowObj.process_definition = This.ProcessDefinitionsList[j].name;
							}
						}
						row.push(rowObj);
					}
				}
				This.instancesList = row;
			});
		},

		/**
		 * 获取ProcessDefinitions列表
		 */
		getProcessDefinitionsList: function(success) {
			var httpUrl = "/uap-bpm/repository/process-definitions?size=100000000"
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.ProcessDefinitionsList = res.data;
				success()
			});
		},
		//国际化
		international: function(success) {
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
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
		}
	}
});