new Vue({
	el: "#editPswDialog",
	data: function() {
		var thisform = this;
		var checkPassword = function(rule, value, callback) {
			if(value === '' || value == undefined) {
				thisform.isshow = false;
				callback(new Error($.t('login.inputPwd')));
			} else {
				//				thisform.pwStrength(thisform.userData.newPwd);
				callback();
			}
		};
		var editUserValidatePass = function(rule, value, callback) {
			if(value === '' || value == undefined) {
				callback(new Error($.t('user.passwordAgain')));
			} else if(value !== thisform.userData.newPwd) {
				callback(new Error($.t('user.differentPassword')));
			} else {
				callback();
			}
		};
		return {
			app_id: "",
			no: "",
			userId: "",
			isshow: false,
			userData: {
				oldPwd: "",
				newPwd: "",
				conPwd: "",
			},
			rules: {
				oldPwd: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				newPwd: [{
					required: true,
					validator: checkPassword,
					trigger: 'blur'
				}],
				conPwd: [{
					required: true,
					validator: editUserValidatePass,
					trigger: 'blur'
				}]
			},
			editPswDialog: true, //编辑密码弹框
			passLevel: 0, //密码校验水平
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
				This.rules.oldPwd[0].message = $.t("login.inputPwd");
			});
		},

		//保存用户信息
		save: function() {
			var This = this;
			this.$refs.editPswForm.validate(function(valid) {
				if(valid) {
					if(This.passLevel < 3) {
						This.$message({
							showClose: true,
							message: $.t("user.pswComplexity"),
							type: 'error'
						});
						return;
					}
					var httpUrl = '/uap/userSelf/password';
					var data = {
						pass_word: hex_md5(This.userData.oldPwd),
						new_pass_word: hex_md5(This.userData.newPwd),
					};
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.$message({
							showClose: true,
							message: "success",
							type: 'success'
						});
						This.editPswDialog = false;
						localStorage.clear();
						location.replace("login.html");
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
		//密码安全级别显示
		//当用户放开键盘或密码输入框失去焦点时,根据不同的级别显示不同的颜色 
		pwStrength: function(pwdValue) {
			this.isshow = true;
			O_color = "#eeeeee";
			L_color = "#FF0000";
			M_color = "#FF9900";
			H_color = "#33CC00";
			if(pwdValue == null || pwdValue == '') {
				Lcolor = Mcolor = Hcolor = O_color;
			} else {
				var S_level = this.checkPassWord(pwdValue);
				this.passLevel = S_level;
				switch(S_level) {
					case 0:
						Lcolor = L_color;
						Mcolor = Hcolor = O_color;
						break;
					case 1:
						Lcolor = L_color;
						Mcolor = Hcolor = O_color;
						break;
					case 2:
						Lcolor = Mcolor = M_color;
						Hcolor = O_color;
						break;
					default:
						Lcolor = Mcolor = Hcolor = H_color;
				}
			}
			document.getElementById("strength_L").style.background = Lcolor;
			document.getElementById("strength_M").style.background = Mcolor;
			document.getElementById("strength_H").style.background = Hcolor;
			return;
		},
		/**
		 * 校验密码
		 * @param {Object} value
		 */
		checkPassWord: function(value) {   
			// 0： 表示第一个级别 1：表示第二个级别 2：表示第三个级别
			// 3： 表示第四个级别 
			var modes = 0;  
			if(value.length < 6) { //最初级别
				return modes;  
			}  
			if(/\d/.test(value)) { //如果用户输入的密码 包含了数字
				modes++;  
			}  
			if(/[a-z]/.test(value) || /[A-Z]/.test(value)) { //如果用户输入的密码 包含了小写的a到z
				modes++;  
			}  
			if(/\W/.test(value)) { //如果是非数字 字母 下划线
				modes++;  
			}  
			switch(modes) {   
				case 1:
				    return 1;    
					break;   
				case 2:
				    return 2;    
					break;   
				case 3:
				    return 3;    
					break;  
			} 
		}
	}
});