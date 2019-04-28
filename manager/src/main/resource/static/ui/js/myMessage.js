new Vue({
	el: "#myMessageDialog",
	data: function() {
		var checkPhone = function(rule, value, callback) {
			var re = /^\+?[1-9][0-9]*$/;
			if(!value) {
				callback();
			} else {
				if(!re.test(value)) {
					callback(new Error($.t('user.inputNum')));
				} else if(re.test(value)) {
					callback();
				}
			}
		};
		return {
			app_id: "",
			no: "",
			userId: "",
			isshow: false,
			userData: {
				name: "",
				phone: "",
				email: "",
			},
			rules: {
				name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				phone: [{
					validator: checkPhone,
					trigger: 'blur'
				}],
				email: [{
					type: 'email',
					message: "",
					trigger: ['blur', 'change']
				}]
			},
			myMessageDialog: true,
		}
	},
	created: function() {
		this.app_id = Common.getUserInfo().app_id;
		this.no = Common.getUserInfo().no;
		this.userId = Common.getUserInfo().id;
		this.international();
		this.getUserInfo(this.userId);
	},
	methods: {
		//国际化
		international: function() {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译				
				This.rules.name[0].message = $.t("common.inputName");
				This.rules.email[0].message = $.t("user.correctEmail");

			});
		},

		//保存用户信息
		save: function() {
			var This = this;
			this.$refs.myMessageForm.validate(function(valid) {
				if(valid) {
					var httpUrl = '/uap/userSelf';
					var data = {
						name: This.userData.name,
						phone: This.userData.phone,
						email: This.userData.email,
						app_id: This.app_id,
						no: This.no,
					};
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.$message({
							showClose: true,
							message: "success",
							type: 'success'
						});
						This.myMessageDialog = false;
						userName = This.userData.name;
						$("#userName").html(userName);
						$("#userName").attr("title", userName);
					});
				} else {
					return false;
				}
			});
		},
		//获取用户信息
		getUserInfo: function(userId) {
			var This = this;
			var httpUrl = '/uap/userSelf';
			HTTP.httpGet(this, httpUrl, function(res) {
				This.userData = res.data;
			});
		},
	}
});