new Vue({
	el: "#myTaskDetail",
	data: function() {
		return {
			table_head: [], //表头
			defectShow: true,
			taskPicShow: false,
			histroyFlowShow: false,
			taskObj: {},
			taskFormUrl: "",
			flowChartSrc: "",
			hisTroyFlowSrc: "",
			taskList: []
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
		this.taskObj = JSON.parse(theRequest.obj);
		this.taskFormUrl = this.taskObj.business_url + "?Id=" + this.taskObj.id + '&businessKey=' + this.taskObj.business_key; //this.taskObj.businessUrl;"../defect/processDefect.html"
		this.flowChartSrc = "common/flowChart.html?processInstanceId=" + this.taskObj.process_instance_id + '&processDefinitionId=' + this.taskObj.process_definition_id;
		//		this.flowChartSrc = "common/flowChart.html?obj=" + theRequest.obj;
	},
	methods: {
		formBtnTab: function() {
			$(".formTab").addClass("tabActivity");
			$(".picTab").removeClass("tabActivity");
			$(".histroyTab").removeClass("tabActivity");
			this.defectShow = true;
			this.taskPicShow = false;
			this.histroyFlowShow = false;
		},
		picBtnTab: function() {
			$(".formTab").removeClass("tabActivity");
			$(".picTab").addClass("tabActivity");
			$(".histroyTab").removeClass("tabActivity");
			this.defectShow = false;
			this.taskPicShow = true;
			this.histroyFlowShow = false;
		},
		histroyBtnTab: function() {
			$(".formTab").removeClass("tabActivity");
			$(".picTab").removeClass("tabActivity");
			$(".histroyTab").addClass("tabActivity");
			this.defectShow = false;
			this.taskPicShow = false;
			this.histroyFlowShow = true;
			this.getHistroyFlow();
		},

		getHistroyFlow: function() {
			this.taskList = [];
			var httpUrl = "/uap-bpm/app/bpm/task/history"
			var This = this;
			var data = {};
			data.finished = true;
			data.start = 0;
			data.limit = 99999999;
			data.by_role = false;
			data.process_instance_id = this.taskObj.process_instance_id;
			data.menu_id = 2;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				//				This.taskList = res.data;
				This.table_head = res.data.form_info;
				var timeList = [];
				if(This.table_head.length > 0) {
					for(var i = 0; i < res.data.form_info.length; i++) {
						if(res.data.form_info[i].uap_page_field.type == "time") {
							timeList.push(res.data.form_info[i].uap_page_field.field);
						}
					}
					for(var j = 0; j < res.data.task_custom_info_list.length; j++) {
						var keys = Object.keys(res.data.task_custom_info_list[j]);
						for(var m = 0; m < keys.length; m++) {
							for(var n = 0; n < timeList.length; n++) {
								if(keys[m] == timeList[n]) {
									res.data.task_custom_info_list[j][keys[m]] = moment(res.data.task_custom_info_list[j][keys[m]]).format("YYYY-MM-DD HH:mm:ss");
								}
							}
						}
					}
					This.taskList = res.data.task_custom_info_list;
				}
			});
		},
		openDetail: function(index, row) {
			//			this.hisTroyFlowSrc = row.businessUrl;
			var detailUrl = row.business_url + "?Id=" + row.id + '&businessKey=' + row.business_key;
			window.open(detailUrl, "HISTROY_TASK", 'width:100%;height:100%');
		},
		back: function() {
			location.href = "myTask.html";
		},
		//国际化
		international: function() {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
			});
		}

	}
});
