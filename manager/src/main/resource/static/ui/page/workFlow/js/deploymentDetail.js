new Vue({
	el: "#deploymentDetail",
	data: function() {
		return {
			processDefinitionsList: [],
			deploymentsId: "",
			deploymentsName: "",
			title: "",
			deployment: {} //deployment详情
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
		this.deploymentsId = theRequest.deploymentsId;
		this.deploymentsName = theRequest.deploymentsName;
		this.title = this.deploymentsName + " - " + this.deploymentsId;
		this.getDeployment(this.deploymentsId);
		this.getProcessDefinitionsList(this.deploymentsId);
	},
	methods: {
		getDeployment: function(id) {
			var httpUrl = "/uap-bpm/repository/deployments/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				res.data.deploymentTime = moment(res.data.deploymentTime).format("YYYY-MM-DD HH:mm:ss")
				This.deployment = res.data;
			});
		},
		/**
		 * 获取deployment Definitions列表
		 */
		getProcessDefinitionsList: function(id) {
			var httpUrl = "/uap-bpm/repository/process-definitions?deploymentId=" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.processDefinitionsList = res.data;
			});
		},
		/**
		 * 删除
		 */
		deleteBtn: function() {
			var httpUrl = "/uap-bpm/repository/deployments/" + this.deploymentsId + "?cascade=false"
			var data = {};
			HTTP.httpDelete(this, httpUrl, data, function(res) {
				location.replace("deployments.html");
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