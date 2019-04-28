new Vue({
	el: "#instanceDetail",
	data: function() {
		return {
			instanceId: "",
			instanceName: "",
			title: "",
			instance: {}, //definition详情
			isComplete: false
		}
	},
	created: function() {
		Common.elementLng();
		var url = decodeURI(location.search); //获取url中"?"符后的字串 ('?modFlag=business&role=1')  
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；  
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		this.instanceId = theRequest.instanceId;
		//		this.instanceName = theRequest.instanceName;
		this.title = this.instanceId;
		var This = this;
		this.international(function() {
			This.getInstance(This.instanceId);
		});
	},
	methods: {
		getInstance: function(id) {
			var httpUrl = "/uap-bpm/history/historic-process-instances/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.end_time == null) {
					This.isComplete = true;
					res.data.status = "Active";
				} else {
					res.data.status = "Completed";
					This.isComplete = false;
				}
				This.instance = res.data;
			});
		},
		/**
		 * 删除Instances
		 */
		deleteInstances: function() {
			var content = $.t("instance.deleteInstanceMess") + "'" + this.instanceId + "?"
			var title = $.t("common.delete") + "'" + this.instanceId + "'";
			var This = this;
			this.$alert(content, title, {
				confirmButtonText: i18n.t("common.confirm"),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function() {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/history/historic-process-instances/" + This.instanceId;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							location.replace("instances.html");
						});
					}
				}
			});
		},
		terminiteInstances: function() {
			var content = $.t("instance.deleteInstanceMess") + "'" + this.instanceId + "?";
			var title = $.t("common.delete") + "'" + this.instanceId + "'";
			var This = this;
			this.$prompt(content, title, {
				confirmButtonText: i18n.t("common.confirm"),
				cancelButtonText: i18n.t("common.cancel"),
				inputPlaceholder: $.t("instance.deleteReason")
			}).then(function(value) {
				var httpUrl = "/uap-bpm/runtime/process-instances/" + This.instanceId;
				var data = {};
				data.action = "terminate";
				data.delete_reason = value.value;
				HTTP.httpDelete(This, httpUrl, data, function(res) {
					This.getInstance(This.instanceId);
				});
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
		}

	}
});