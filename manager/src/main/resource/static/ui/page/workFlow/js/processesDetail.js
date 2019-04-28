new Vue({
	el: "#processesDetail",
	data: function() {
		return {
			processesId: "",
			processes: {}, //task详情
			editProcessDialog: false,
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
		this.processesId = theRequest.processesId;
		this.getProcesses(this.processesId);
	},
	methods: {
		openEditorBtn: function() {
			window.open("../../design/index.html#/editor/" + this.processesId, 'editor', 'width:100%;height:100%');
		},
		getProcesses: function(id) {
			var httpUrl = "/uap-bpm/app/rest/models/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				res.data.lastUpdated = moment(res.data.lastUpdated).format("YYYY-MM-DD HH:mm:ss")
				This.processes = res.data;
			});
		},
		/**
		 * 打开编辑弹出框
		 */
		openEditDialog: function() {
			this.editProcessDialog = true;
			this.model.modelName = this.processes.name;
			this.model.modelKey = this.processes.key;
			this.model.description = this.processes.description;
		},
		/**
		 * 更新processes
		 */
		editModelSave: function() {
			var httpUrl = "/uap-bpm/app/rest/models/" + this.processesId;
			var data = {};
			data.name = this.model.modelName;
			data.key = this.model.modelKey;
			data.description = this.model.description;
			var This = this;
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.processes = res.data;
				This.editProcessDialog = false;
			}, function(error) {
				This.editProcessDialog = false;
			});
		},
		/**
		 * 删除
		 */
		deleteBtn: function() {
			var content = $.t("modelManage.deleteProcessMess") + "'" + this.processes.name + "'" + "?"
			var This = this;
			this.$alert(content, 'Delete model', {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/app/rest/models/" + This.processesId;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							location.replace("processes.html");
						});
					}
				}
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
		}

	}
});