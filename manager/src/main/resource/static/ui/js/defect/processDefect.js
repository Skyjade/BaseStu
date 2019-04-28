new Vue({
	el: "#processDefect",
	data: function() {
		return {
//			parentData:"",
			auditDefectData:{},
			task_id:"",
			selDefectID:"",
			submitData:{
				description:"",
				handle_suggestion:"",
				handle_result:""
			},
			detailData:[],
			bhBtnShow:true
		}
	},
	created: function() {
		Common.elementLng();
		//获取缺陷id
//		this.parentData = window.parent.window.setData();
		
		var url = decodeURI(location.search); //获取url中"?"符后的字串 ('?modFlag=business&role=1')  
		var theRequest = new Object();
		if(url.indexOf("?") != -1) {
			var str = url.substr(1); //substr()方法返回从参数值开始到结束的字符串；  
			var strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
			console.log(theRequest); //此时的theRequest就是我们需要的参数；  
		}
		this.task_id = theRequest.Id;
		this.selDefectID = theRequest.businessKey;
		
//		this.selDefectID = JSON.parse(this.parentData).businessKey;
		this.international();
		this.auditDefect();
	},
	methods: {
		/**
		 * 批准或驳回
		 * @param {Object} tag true批准 false驳回
		 */
		submitBtn:function(tag){
			var data = {};
			data.id = this.selDefectID;
			data.task_id = this.task_id;
			data.handle_suggestion = this.submitData.handle_suggestion;
			data.handle_result = this.submitData.handle_result;
			data.result = tag;
			var This = this;
			var httpUrl = '/uap-demo/defect/update';
			HTTP.httpPut(this, httpUrl, data, function(res) {
//				This.auditDefect();
//				This.submitData.handle_suggestion = "";
//				This.submitData.handle_result = "";
 				window.parent.location.href = "../../page/homePage/myTask.html"
			}, function(error) {
			})
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
		},
		//详情
		auditDefect: function(){
			var httpUrl = "/uap-demo/defect/" + this.selDefectID;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				console.log(res)
				This.auditDefectData = res.data;
				if(This.auditDefectData.discover_time) {
					This.auditDefectData.discover_time = Common.getFormatDateByLong(This.auditDefectData.discover_time);
				}
				if(This.auditDefectData.report_time) {
					This.auditDefectData.report_time = Common.getFormatDateByLong(This.auditDefectData.report_time);
				}
				if(This.auditDefectData.equipment_type == 0) {
					This.auditDefectData.equipment_type  = $.t('defect.equipmentType0');
				} else if(This.auditDefectData.equipment_type == 1) {
					This.auditDefectData.equipment_type  = $.t('defect.equipmentType1');
				}else if(This.auditDefectData.equipment_type == 2) {
					This.auditDefectData.equipment_type  = $.t('defect.equipmentType2');
				}
				
				if(This.auditDefectData.type == 0){
					This.auditDefectData.type = $.t('defect.type0');
				}else if(This.auditDefectData.type == 1){
					This.auditDefectData.type = $.t('defect.type1');
				}
				if(res.data.state == "1" || res.data.state == "4"){
					This.bhBtnShow = true;
				}else{
					This.bhBtnShow = false;
				}
				
				if(res.data.defect_histories.length >0){
					var rowObj = [];
					for (var i = 0;i < res.data.defect_histories.length;i++) {
						var obj = res.data.defect_histories[i];
						obj.handle_time = Common.getFormatDateByLong(obj.handle_time);
						switch (obj.state){
							case "0":
								obj.stateNo = "缺陷新建";
								break;
							case "1":
								obj.stateNo = "缺陷审核";
								break;
							case "2":
								obj.stateNo = "任务分配";
								break;
							case "3":
								obj.stateNo = "消缺回填";
								break;
							case "4":
								obj.stateNo = "消缺审核";
								break;
							case "5":
								obj.stateNo = "消缺结束";
								break;
							case "6":
								obj.stateNo = "缺陷审核退回";
								break;
							case "7":
								obj.stateNo = "消缺审核退回";
								break;
						}
						rowObj.push(obj);
					}
					This.detailData = rowObj;
				}
			}, function(res) {
				This.auditDefectData = {};
				This.detailData = [];
				This.international();
				$("#processDefect").hide();
			});
		}
	}
})