new Vue({
	el: "#modelManage",
	data: function() {
		return {
			i18n: {
				uploadFile: ''
			},
			modelList: [],
			appsName: "",
			createAppsDialog: false,
			props: {
				id: 'id',
				label: 'name'
			},
			add: {
				appName: "",
				appKey: "",
				description: ""
			},
			editAppsDialog: false,
			edit: {
				modelName: "",
				modelKey: "",
				description: ""
			},
			rules: {
				appName: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				appKey: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
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
			model: {}, //模型详情
			selModel: {},
			BPMNModelsList: [],

			glModel: {
				modelName: "",
				modelKey: "",
				description: ""
			},
			rules1: {
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
			createProcessDialog: false,
			functionDisabled: true,
			fileProcessUpload: false,
			fileAppUpload: false
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getModelList();
			});
		});
	},
	methods: {
		/**
		 * 进入详情界面
		 * @param {Object} row
		 */
		openDetail: function(row) {
			window.location.href = encodeURI("modelManageDetail.html?processesId=" + row.id + '&modelId=' + this.selModel.id);
		},
		/**
		 * 打开create弹出框
		 */
		createBtn: function() {
			if(this.$refs.add !== undefined) {
				this.$refs.add.resetFields();
			}
			this.add.appName = "";
			this.add.appKey = "";
			this.add.description = "";
			this.createAppsDialog = true;
		},
		/**
		 * 创建app
		 */
		createApp: function() {
			var This = this;
			this.$refs.add.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/app/rest/models/group";
					var data = {};
					data.name = This.add.appName;
					data.key = This.add.appKey;
					data.model_type = 3;
					data.description = This.add.description;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.getModelList(This.appsName);
						This.createAppsDialog = false;
					}, function(error) {
						This.createAppsDialog = false;
					});
				} else {
					return false;
				}
			});
		},

		/**
		 * 打开编辑弹出框
		 */
		openEditDialog: function() {
			if(this.$refs.edit !== undefined) {
				this.$refs.edit.resetFields();
			}
			this.editAppsDialog = true;
			this.edit.modelName = this.model.name;
			this.edit.modelKey = this.model.key;
			this.edit.description = this.model.description;
		},
		/**
		 * 更新
		 */
		editModelSave: function() {
			var This = this;
			this.$refs.edit.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/app/rest/models/" + This.selModel.id;
					var data = {};
					data.name = This.edit.modelName;
					data.key = This.edit.modelKey;
					data.description = This.edit.description;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						res.data.last_updated = moment(res.data.last_updated).format("YYYY-MM-DD HH:mm:ss")
						This.model = res.data;
						This.editAppsDialog = false;
						This.getModelList();
					}, function(error) {
						This.editAppsDialog = false;
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
			var content = $.t("modelManage.deleteModelMess") + "'" + this.selModel.name + "'" + "?"
			var This = this;
			this.$alert(content, $.t("common.delete"), {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/app/rest/models/" + This.selModel.id;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							This.getModelList();
							This.model = {};
							This.BPMNModelsList = [];
						});
					}
				}
			});
		},

		/**
		 * 发布
		 */
		publishBtn: function() {
			if(this.BPMNModelsList.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("modelManage.noProcess"),
					type: 'warning'
				});
				return;
			}
			var content = $.t("modelManage.publishAppMess") + "'" + this.selModel.name + "'" + "?"
			var This = this;
			this.$alert(content, $.t("modelManage.publishAppDefinition"), {
				confirmButtonText: i18n.t('common.confirm'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/app/rest/app-definitions/" + This.selModel.id + "/publish";
						var data = {};
						data.comment = "";
						HTTP.httpPost(This, httpUrl, data, function(res) {
							This.getModelDetail(This.selModel.id);
							This.getBPMNModelsList(This.selModel.id);
						});
					}
				}
			});
		},
		/**
		 * 树节点点击事件
		 * @param {Object} data
		 */
		handleNodeClick: function(data) {
			this.functionDisabled = false;
			this.selModel = data;
			this.getModelDetail(data.id);
			this.getBPMNModelsList(data.id);
		},
		/**
		 * 获取模型列表
		 */
		getModelList: function(appsName) {
			var httpUrl = "/uap-bpm/app/rest/models?filter=processes&modelType=3";
			if(appsName != undefined) {
				httpUrl = httpUrl + "&filterText=" + appsName;
			}
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.modelList = res.data;
			});
		},

		/**
		 * 获取详情
		 * @param {Object} id
		 */
		getModelDetail: function(id) {
			var httpUrl = "/uap-bpm/app/rest/models/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				res.data.last_updated = moment(res.data.last_updated).format("YYYY-MM-DD HH:mm:ss")
				This.model = res.data;
			});
		},

		getBPMNModelsList: function(id) {
			this.BPMNModelsList = [];
			var httpUrl = "/uap-bpm/app/rest/app-definitions/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				if(res.data.definition.models != undefined) {
					This.BPMNModelsList = res.data.definition.models;
				} else {
					This.BPMNModelsList = [];
				}
			});
		},

		/**
		 * 打开创建关联流程弹出框
		 */
		createProceeBtn: function() {
			if(this.$refs.glModel !== undefined) {
				this.$refs.glModel.resetFields();
			}
			this.glModel.modelName = "";
			this.glModel.modelKey = "";
			this.glModel.description = "";
			this.createProcessDialog = true;
		},
		/**
		 * 创建关联流程
		 */
		createModel: function() {
			var This = this;
			this.$refs.glModel.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/app/rest/models?modelId=" + This.selModel.id;
					var data = {};
					data.name = This.glModel.modelName;
					data.key = This.glModel.modelKey;
					data.model_type = 0;
					data.description = This.glModel.description;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						if(res.data.app_definition.definition.models != undefined) {
							This.BPMNModelsList = res.data.app_definition.definition.models;
						} else {
							This.BPMNModelsList = [];
						}
						This.createProcessDialog = false;
					}, function(error) {
						This.createProcessDialog = false;
					});
				} else {
					return false;
				}
			});
		},
		fileUploadBtn: function() {
			var file = $("#fileProcess");
			// 对当前input标签进行clone并插入其下方
			file.after(file.clone().val(""));
			// 删除原有的input标签
			file.remove();
			$("#fileProcessName").hide();
			this.fileProcessUpload = true;
		},
		/**
		 * 导入流程
		 */
		uploadProcess: function() {
			var This = this;
			var httpUrl = "/uap-bpm/app/rest/import-process-model?parentModelId=" + This.selModel.id;
			var option = {　　
				url: Common.getUserInfo().uap_bpm_url + httpUrl,
				　　type: 'POST',
				　　dataType: 'json',
				　　headers: {
					"Authorization": 'Bearer ' + Common.getToken()
				},
				beforeSubmit: function(res) {
					if(res[0].value.type != "text/xml") {
						This.$message({
							showClose: true,
							message: $.t("modelManage.xmlFiles"),
							type: 'error'
						});
						return false;
					}
				},
				　　success: function(res) {
					if(res.msg_code == "operate.success") {
						This.fileProcessUpload = false;
						This.getBPMNModelsList(This.selModel.id);
					} else {
						HTTP.errorDetail(This, res.msg_code, res.message);
					}
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
			};
			$("#uploadProcess").ajaxSubmit(option);
			return false;
		},

		uploadAppBtn: function() {
			var file = $("#fileApp");
			// 对当前input标签进行clone并插入其下方
			file.after(file.clone().val(""));
			// 删除原有的input标签
			file.remove();
			$("#fileAppName").hide();
			this.fileAppUpload = true;
		},
		/**
		 * 导入流程分组
		 */
		uploadApp: function() {
			var This = this;
			var httpUrl = "/uap-bpm/app/rest/app-definitions/import";
			var option = {　　
				url: Common.getUserInfo().uap_bpm_url + httpUrl,
				　　type: 'POST',
				　　dataType: 'json',
				　　headers: {
					"Authorization": 'Bearer ' + Common.getToken()
				},
				beforeSubmit: function(res) {
//					if(res[0].value.type != "application/zip") {
//						This.$message({
//							showClose: true,
//							message: $.t("modelManage.zipFiles"),
//							type: 'error'
//						});
//						return false;
//					}

					if(res[0].value.name.substr(res[0].value.name.length-4) != ".zip") {
						This.$message({
							showClose: true,
							message:$.t("modelManage.zipFiles"),
							type: 'error'
						});
						return false;
					}
				},
				　　success: function(res) {
					if(res.msg_code == "operate.success") {
						This.fileAppUpload = false;
						This.getModelList();
					} else {
						HTTP.errorDetail(This, res.msg_code, res.message);
					}
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
			};
			$("#uploadApp").ajaxSubmit(option);
			return false;
		},
		/**
		 * 导出流程分组
		 */
		exportAppBtn: function() {
			var httpUrl = "/uap-bpm/app/rest/app-definitions/" + this.selModel.id + "/export";
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
					//					let blob = new Blob([res], {type: 'application/zip'});
					//		    		console.log(window.URL.createObjectURL(blob))
					//			        // 创建一个a标签用于下载
					//			        var a = document.createElement('a');
					//			        a.download = This.selModel.name+".zip";
					//			        a.href = window.URL.createObjectURL(blob);
					//			        $("body").append(a);    // 修复firefox中无法触发click
					//			        a.click();
					//			        $(a).remove();

					// 创建一个a标签用于下载
					var http_url = Common.getUserInfo().uap_bpm_url + "/uap-bpm/app/rest/app-definitions/" + This.selModel.id + "/export?Authorization=Bearer " + Common.getToken();
					var a = document.createElement('a');
					a.download = This.selModel.name + ".zip";
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
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.modelName[0].message = $.t("common.inputName");
				This.rules.modelKey[0].message = $.t("common.inputkey");
				This.rules1.modelName[0].message = $.t("common.inputName");
				This.rules1.modelKey[0].message = $.t("common.inputkey");
				This.rules.appName[0].message = $.t("common.inputName");
				This.rules.appKey[0].message = $.t("common.inputkey");
				This.i18n.uploadFile = $.t("modelManage.uploadFile");
				if(success != undefined) {
					success();
				}
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