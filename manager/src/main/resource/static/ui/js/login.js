/**
 * Login
 * xyc 
 */
new Vue({
	el: '#login',
	data: function() {
		return {
			lan: "0", //语言value
			ruleForm: {
				userName: "", //登录名
				pwd: "" //登录密码
			},
			rules: {
				userName: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				pwd: [{
					required: true,
					message: "",
					trigger: 'blur'
				}]
			},
			loading: false
		}
	},
	created: function() {
		this.setLngBySys();
		var This = this;
		$(document).keyup(function(e) {
			var keyCode = window.event ? e.keyCode : e.which;
			if(keyCode == 13) {
				This.login();
			}
		});
	},
	methods: {
		/**
		 * 登录
		 */
		login: function() {
			var This = this;
			this.$refs.ruleForm.validate(function(valid) {
				if(valid) {
					This.loading = true;
//				var httpUrl = "http://192.168.15.35:8080/uap/login";
					var httpUrl = "/uap/login";
					var data = {};
					data.user_no = This.ruleForm.userName;
					data.password = hex_md5(This.ruleForm.pwd);
					data.language = localStorage.getItem("LANGUAGE");
					HTTP.login(This, httpUrl, data, function(res) {
						This.loading = false;
						var data = res.data;
						if(data.apps.length > 0){
							for(var i = 0;i < data.apps.length;i++){
								var uapHttp = data.apps[i].url.split("/u");
								if(data.apps[i].code == "uap"){
									data.uap_url = uapHttp[0];
								}
								if(data.apps[i].code == "uap_bpm"){
									data.uap_bpm_url = uapHttp[0];
								}
								if(data.apps[i].code == "uap_schedule"){
									data.uap_schedule_url = uapHttp[0];
								}
							}
						}
						Common.setUserInfo(JSON.stringify(data));
						location.replace("index.html")
					}, function(res) {
						This.loading = false;
					});
				} else {
					return false;
				}
			});
		},
		/**
		 * 选择语言
		 */
		selectLng: function() {
			switch(this.lan) {
				case "0":
					localStorage.setItem("LANGUAGE", "zh");
					break;
				case "1":
					localStorage.setItem("LANGUAGE", "en");
					break;
			}
			var This = this;
			this.international(function(){
				This.$refs.ruleForm.validate(function(valid) {
					if(valid) {
					
					} else {
						return false;
					}
				});
			});
		},
		/**
		 * 根据系统浏览器语言设置界面语言
		 */
		setLngBySys: function() {
			var language = "";
			if(navigator.language) {
				language = navigator.language;
			} else {
				language = navigator.browserLanguage;
			}
			if(language.indexOf('en') > -1) {
				localStorage.setItem("LANGUAGE", "en");
				this.lan = "1";
			}
			if(language.indexOf('zh') > -1) {
				localStorage.setItem("LANGUAGE", "zh");
				this.lan = "0";
			}
			this.international();
		},
		/**
		 * 国际化
		 */
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.userName[0].message = $.t("login.inputUser");
				This.rules.pwd[0].message = $.t("login.inputPwd");
				if(success != undefined){
					success();
				}
			});
		},
	}
});