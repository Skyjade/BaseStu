new Vue({
	el: "#modelManageDetail",
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

			parentId: ""
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
		this.parentId = theRequest.modelId;
		this.getProcesses(this.processesId);
	},
	methods: {
		openEditorBtn: function() {
			window.open("../../design/index.html#/editor/" + this.processesId, 'editor');
		},
		getProcesses: function(id) {
			var httpUrl = "/uap-bpm/app/rest/models/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				res.data.last_updated = moment(res.data.last_updated).format("YYYY-MM-DD HH:mm:ss")
				This.processes = res.data;
			});
		},
		refreshBtn:function(){
			this.getProcesses(this.processesId);
			$('#pic').attr('src', $('#pic').attr('src'));
		},
		/**
		 * 打开编辑弹出框
		 */
		openEditDialog: function() {
			if(this.$refs.model !== undefined) {
				this.$refs.model.resetFields();
			}
			this.editProcessDialog = true;
			this.model.modelName = this.processes.name;
			this.model.modelKey = this.processes.key;
			this.model.description = this.processes.description;
		},
		/**
		 * 更新processes
		 */
		editModelSave: function() {
			var This = this;
			this.$refs.model.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/app/rest/models/" + This.processesId + "?parentId=" + This.parentId;
					var data = {};
					data.name = This.model.modelName;
					data.key = This.model.modelKey;
					data.description = This.model.description;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						res.data.last_updated = moment(res.data.last_updated).format("YYYY-MM-DD HH:mm:ss")
						This.processes = res.data;
						This.editProcessDialog = false;
					}, function(error) {
						This.editProcessDialog = false;
					});
				} else {
					return false;
				}
			});

		},
		/**
		 * 删除
		 */
		deleteBtn: function() {
			var content = $.t("modelManage.deleteProcessMess") + "'" + this.processes.name + "'" + "?"
			var This = this;
			this.$alert(content, $.t("common.delete"), {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/app/rest/models/" + This.processesId + "?parentId=" + This.parentId;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							location.replace("modelManage.html");
						});
					}
				}
			});
		},
		/**
		 * 导出模型
		 */
		downBPMN: function() {
			var httpUrl = "/uap-bpm/app/rest/models/" + this.processesId + "/bpmn20";
			var This = this;
			var Url = Common.getUserInfo().uap_bpm_url;
			var token = Common.getToken();
			$.ajax({
				url: Url + httpUrl,
				type: 'GET',
				beforeSend: function(request) {
					request.setRequestHeader("Authorization", 'Bearer ' + token);
				},
				timeout: 60000,
				success: function(res) {
					//					let blob = new Blob([res], {type: 'text/xml'});
					//		    		console.log(window.URL.createObjectURL(blob))
					//			        // 创建一个a标签用于下载
					//			        var a = document.createElement('a');
					//			        a.download = This.processes.name+".bpmn20.xml";
					//			        a.href = window.URL.createObjectURL(blob);
					//			        $("body").append(a);    // 修复firefox中无法触发click
					//			        a.click();
					//			        $(a).remove();

					// 创建一个a标签用于下载
					var http_url = Common.getUserInfo().uap_bpm_url + "/uap-bpm/app/rest/models/" + This.processesId + "/bpmn20?Authorization=Bearer " + Common.getToken();
					var a = document.createElement('a');
					a.download = This.processes.name + ".bpmn20.xml";
					a.href = http_url;
					$("body").append(a); // 修复firefox中无法触发click
					a.click();
					$(a).remove();
				},
				error: function(error) {
					if(error.responseJSON != undefined) {
						if(error.responseJSON.msg_code != undefined) {
							HTTP.errorDetail(This, error.responseJSON.msg_code, error.responseJSON.message);
						}
					} else {
						HTTP.error(This, error.status, error.statusText);
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
				This.rules.modelName[0].message = $.t("common.inputName");
				This.rules.modelKey[0].message = $.t("common.inputkey");
			});
		}

	}
});

function setId() {
	var url = decodeURI(location.search); //获取url中"?"符后的字串 ('?modFlag=business&role=1')  
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；  
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
		}
	}
	return theRequest.processesId;
}