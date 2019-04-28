/**
 * 定时任务网络请求公共
 * xyc
 */
var HTTP = {
	httpGet: function(context, url, success, fail) {
		var Url = "";
		if(url.indexOf("/uap_schedule/") > -1) {
			Url = Common.getUserInfo().uap_schedule_url;
		} else {
			Url = Common.getUserInfo().uap_url;
		}
		var token = Common.getToken();
		$.ajax({
			url: Url + url,
			type: 'GET',
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", 'Bearer ' + token);
			},
			dataType: 'JSON',
			timeout: 60000,
			success: function(res) {
				if(res.msg_code == "operate.success") {
					success(res);
				} else {
					HTTP.errorDetail(context, res.msg_code, res.message);
					if(fail != undefined) {
						fail(res);
					}
				}
			},
			error: function(error) {
				if(error.responseJSON != undefined) {
					if(error.responseJSON.msg_code != undefined) {
						HTTP.errorDetail(context, error.responseJSON.msg_code, error.responseJSON.message);
					}
				} else {
					HTTP.error(context, error.status, error.statusText, error.readyState);
				}
				if(fail != undefined) {
					fail();
				}
			}
		});
	},
	httpPost: function(context, url, data, success, fail) {
		var Url = "";
		if(url.indexOf("/uap_schedule/") > -1) {
			Url = Common.getUserInfo().uap_schedule_url;
		} else {
			Url = Common.getUserInfo().uap_url;
		}
		var token = Common.getToken();
		$.ajax({
			url: Url + url,
			type: 'POST',
			data: JSON.stringify(data),
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", 'Bearer ' + token);
			},
			contentType: "application/json",
			dataType: 'JSON',
			timeout: 60000,
			success: function(res) {
				if(res.msg_code == "operate.success") {
					success(res);
				} else {
					HTTP.errorDetail(context, res.msg_code, res.message);
					if(fail != undefined) {
						fail(res);
					}
				}
			},
			error: function(error) {
				if(error.responseJSON != undefined) {
					if(error.responseJSON.msg_code != undefined) {
						HTTP.errorDetail(context, error.responseJSON.msg_code, error.responseJSON.message);
					}
				} else {
					HTTP.error(context, error.status, error.statusText, error.readyState);
				}
				if(fail != undefined) {
					fail();
				}
			}
		});
	},
	httpPut: function(context, url, data, success, fail) {
		var Url = "";
		if(url.indexOf("/uap_schedule/") > -1) {
			Url = Common.getUserInfo().uap_schedule_url;
		} else {
			Url = Common.getUserInfo().uap_url;
		}
		var token = Common.getToken();
		$.ajax({
			url: Url + url,
			type: 'put',
			data: JSON.stringify(data),
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", 'Bearer ' + token);
			},
			contentType: "application/json",
			dataType: 'JSON',
			timeout: 60000,
			success: function(res) {
				if(res.msg_code == "operate.success") {
					success(res);
				} else {
					HTTP.errorDetail(context, res.msg_code, res.message);
					if(fail != undefined) {
						fail(res);
					}
				}
			},
			error: function(error) {
				if(error.responseJSON != undefined) {
					if(error.responseJSON.msg_code != undefined) {
						HTTP.errorDetail(context, error.responseJSON.msg_code, error.responseJSON.message);
					}
				} else {
					HTTP.error(context, error.status, error.statusText, error.readyState);
				}
				if(fail != undefined) {
					fail();
				}
			}
		});
	},
	httpDelete: function(context, url, data, success, fail) {
		context.$alert(i18n.t('common.confirmDelete'), '', {
			confirmButtonText: i18n.t('common.confirm'),
			showCancelButton:true,
			type: 'warning',
			showClose: true,
			callback: function(action, instance) {
				if(action == "confirm"){
					var Url = "";
					if(url.indexOf("/uap_schedule/") > -1) {
						Url = Common.getUserInfo().uap_schedule_url;
					} else {
						Url = Common.getUserInfo().uap_url;
					}
					var token = Common.getToken();
					$.ajax({
						url: Url + url,
						type: 'delete',
						data: JSON.stringify(data),
						beforeSend: function(request) {
							request.setRequestHeader("Authorization", 'Bearer ' + token);
						},
						contentType: "application/json",
						dataType: 'JSON',
						timeout: 60000,
						success: function(res) {
							if(res.msg_code == "operate.success") {
								success(res);
							} else {
								HTTP.errorDetail(context, res.msg_code, res.message);
								if(fail != undefined) {
									fail(res);
								}
							}
						},
						error: function(error) {
							if(error.responseJSON != undefined) {
								if(error.responseJSON.msg_code != undefined) {
									HTTP.errorDetail(context, error.responseJSON.msg_code, error.responseJSON.message);
								}
							} else {
								HTTP.error(context, error.status, error.statusText, error.readyState);
							}
							if(fail != undefined) {
								fail();
							}
	
						}
					});
				}
			}
		});
	},
	/**
	 * 获取下拉框和功能
	 * @param {Object} context
	 * @param {Object} arry
	 * @param {Object} success
	 * @param {Object} fail
	 */
	getCodeAndMenus: function(context, arry, success, fail) {
		var url = "/uap/user/function/code";
		var data = {};
		data.menu_parent_id = parseInt(localStorage.getItem("MENU_ID"));
		data.parent_codes = arry;
		data.app_id = Common.getUserInfo().app_id;
		var token = Common.getToken();
		$.ajax({
			url: Common.getUserInfo().uap_url + url,
			type: 'POST',
			data: JSON.stringify(data),
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", 'Bearer ' + token);
			},
			contentType: "application/json",
			dataType: 'JSON',
			timeout: 60000,
			success: function(res) {
				if(res.msg_code == "operate.success") {
					success(res);
				} else {
					HTTP.errorDetail(context, res.msg_code, res.message);
					if(fail != undefined) {
						fail(res);
					}
				}
			},
			error: function(error) {
				if(error.responseJSON != undefined) {
					if(error.responseJSON.msg_code != undefined) {
						HTTP.errorDetail(context, error.responseJSON.msg_code, error.responseJSON.message);
					}
				} else {
					HTTP.error(context, error.status, error.statusText, error.readyState);
				}
				if(fail != undefined) {
					fail();
				}
			}
		});
	},
	/**
	 * 错误消息共通处理
	 * @param {Object} context
	 * @param {Object} code
	 */
	errorDetail: function(context, code, message) {
		if(code == "token.not.set" || code == "token.expired" || code == "token.invalid") {
			context.$alert(message, 'Error', {
				confirmButtonText: i18n.t('common.reLogin'),
				type: 'warning',
				showClose: false,
				callback: function() {
					localStorage.clear();
					top.location.href = "/uap/ui/index.html";
				}
			});
			return;
		}
		context.$message({
			showClose: true,
			message: message,
			type: 'error'
		});
	},
	error: function(context, status, statusText, readyState) {
		switch(status) {
			case 0:
				if(status == 0 && readyState == 0) {
					context.$alert(i18n.t("common.serviceError"), '', {
						confirmButtonText: i18n.t('common.reLogin'),
						type: 'warning',
						showClose: false,
						callback: function() {
							localStorage.clear();
							top.location.href = "/uap/ui/index.html";
						}
					});
				} else {
					context.$message({
						showClose: true,
						message: statusText,
						type: 'error'
					});
				}
				break;
			case 400:
				context.$message({
					showClose: true,
					message: statusText,
					type: 'error'
				});
				break;
			case 404:
				context.$message({
					showClose: true,
					message: statusText,
					type: 'error'
				});
				break;
			case 500:
				context.$message({
					showClose: true,
					message: statusText,
					type: 'error'
				});
				break;
		}
	}
}