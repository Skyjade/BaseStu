new Vue({
	el: "#processes",
	data: function() {
		return {
			processesList: [],
			total_count: 0,
			currentPage: 1,
			size: 10,
			processesName: "",
			createProcessDialog: false,
			model: {
				modelName: "",
				modelKey: "",
				description: ""
			},
			rules: {
				modelName: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				modelKey: [{
					required: true,
					message: "",
					trigger: 'blur'
				}]
			},
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			This.getProcessesList();
		});
	},
	methods: {
		/**
		 * 进入详情界面
		 * @param {Object} row
		 */
		openDetail: function(row) {
			window.location.href = encodeURI("processesDetail.html?processesId=" + row.id);
		},
		searchBtn: function() {
			this.getProcessesList(this.processesName);
		},
		/**
		 * 打开create弹出框
		 */
		createBtn: function() {
			this.createProcessDialog = true;
		},
		/**
		 * 创建model
		 */
		createModel: function() {
			var httpUrl = "/uap-bpm/app/rest/models";
			var data = {};
			data.name = this.model.modelName;
			data.key = this.model.modelKey;
			data.modelType = 0;
			data.description = this.model.description;
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.getProcessesList(This.processesName);
				This.createProcessDialog = false;
			}, function(error) {
				This.createProcessDialog = false;
			});
		},
		/**
		 * 获取Processes列表
		 */
		getProcessesList: function(processesName) {
			var httpUrl = "/uap-bpm/app/rest/models?filter=processes&modelType=0";
			if(processesName != undefined) {
				httpUrl = httpUrl + "&filterText=" + processesName;
			}
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.processesList = res.data;
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