new Vue({
	el: "#defectDetail",
	data: function() {
		return {
			defectId:"",
			process_instance_id:"",
			viewDefectData:{},//task详情
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
		this.defectId = JSON.parse(theRequest.obj).id;
		this.process_instance_id = JSON.parse(theRequest.obj).process_instance_id;
		this.getDefect(this.defectId);
	},
	methods: {
		getDefect:function(id){
			var httpUrl = "/uap/defect/" + this.defectId;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.viewDefectData = res.data;
				if(This.viewDefectData.discover_time) {
					This.viewDefectData.discover_time = Common.getFormatDateByLong(This.viewDefectData.discover_time);
				}
				if(This.viewDefectData.report_time) {
					This.viewDefectData.report_time = Common.getFormatDateByLong(This.viewDefectData.report_time);
				}
				if(This.viewDefectData.equipment_type == 0) {
					This.viewDefectData.equipment_type  = $.t('defect.equipmentType0');
				} else if(This.viewDefectData.equipment_type == 1) {
					This.viewDefectData.equipment_type  = $.t('defect.equipmentType1');
				}else if(This.viewDefectData.equipment_type == 2) {
					This.viewDefectData.equipment_type  = $.t('defect.equipmentType2');
				}
				
				if(This.viewDefectData.type == 0){
					This.viewDefectData.type = $.t('defect.type0');
				}else if(This.viewDefectData.type == 1){
					This.viewDefectData.type = $.t('defect.type1');
				}
			}, function(res) {
				
			});
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