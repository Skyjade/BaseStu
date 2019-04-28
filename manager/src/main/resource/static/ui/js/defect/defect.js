new Vue({
	el: "#defect",
	data: function() {
		return {
			addDisabled: true,   //权限按钮
			submitDisabled: true,
			auditDisabled: false,
			addDefectData: {
				equipment_name: "",
				equipment_type: "0",
				equipment_no: "",
				type: "0",
				discoverer: "",
				discover_time: "",
				report_time:"",
				description: "",
				address: ""
			}, //新增缺陷数据
			viewDefectData:{},
			auditDefectData:{},
			stateOptions: [],  //app状态
			chooseState: '',  //选择的状态
			stateOptions: [], //状态下拉菜单
			typeOptions: [],
			typeOptions1: [],
			searchName: '',  //搜搜app名称
			multipleSelection:[],  //表格中选中的行数据
			addDefectDialog:false,
			viewDefectDialog:false,
			auditDefectDialog:false,
			defectDataList: [],//api列表
	        total_count:0,
	        currentPage:1,
	        page_size: 10,
//	        isSelect: false
		}
	},
	created: function() {
		Common.elementLng();
		this.international();
		this.getDefectList();
		var This = this;
		var codeList = ["DEFECT_STATE"];
		HTTP.getCodeAndMenus(this, codeList, function(res) {
			This.stateOptions = res.data.codes["DEFECT_STATE"];
			if(This.stateOptions.length > 0) {
				This.chooseState = "1";
				This.getDefectList();
			}
			This.userAuthentication(res.data.functions);
		}, function(error) {
			This.chooseState = "1";
		});
	},
	methods: {
		/**
		 * 根据配置用户菜单权限
		 * @param {Object} usermenus
		 */
		userAuthentication: function(usermenus) {
			if(usermenus.length > 0) {
				for(var i = 0; i < usermenus.length; i++) {
					if(usermenus[i].code == "ADD") {
						this.addDisabled = false;
					}
					if(usermenus[i].code == "SUBMIT") {
						this.submitDisabled = false;
					}
				}
			}
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
		handleSelectionChange: function(val) { //table多选
			this.multipleSelection = val;
		},
		/**
		 * 打开新增弹出框
		 */
		openAddDialog:function(){
			var This = this;
			var codeList1 = ["EQUIPMENT_TYPE"];
			HTTP.getCodeAndMenus(this, codeList1, function(res) {
				This.typeOptions1 = res.data.codes["EQUIPMENT_TYPE"];
				if(This.typeOptions1.length > 0) {
					This.addDefectData.equipment_type = "0";
				}
			},function(){});
			var codeList = ["DEFECT_TYPE"];
			HTTP.getCodeAndMenus(this, codeList, function(res) {
				This.typeOptions = res.data.codes["DEFECT_TYPE"];
				
				if(This.typeOptions.length > 0) {
					This.addDefectData.type = "0";
				}
			},function(){});
			this.addDefectDialog = true;
			this.addDefectData.equipment_name = "";
			this.addDefectData.equipment_type = "0";
			this.addDefectData.equipment_no = "";
			this.addDefectData.type = "0";
			this.addDefectData.discoverer = "";
			this.addDefectData.discover_time = "";
			this.addDefectData.report_time ="";
			this.addDefectData.description = "";
			this.addDefectData.address = "";
		},
		/**
		 * 新增确认
		 */
		addDefectConfirm:function(){
			var httpUrl = "/uap-demo/defect";
			var discover_time = new Date(this.addDefectData.discover_time).getTime();
			var report_time = new Date(this.addDefectData.report_time).getTime();
			var data = {
			  equipment_name: this.addDefectData.equipment_name,
			  equipment_type: this.addDefectData.equipment_type,
			  equipment_no: this.addDefectData.equipment_no,
			  type: this.addDefectData.type,
			  discoverer: this.addDefectData.discoverer,
			  discover_time: discover_time,
			  report_time: report_time,
			  description: this.addDefectData.description,
			  address: this.addDefectData.address
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res){
				This.addDefectDialog = false;
				This.currentPage = 1;
				This.getDefectList();
			});
		},
		/**
		 * 进入详情界面
		 * @param {Object} row
		 */
		openDetail:function(row){
			window.location.href = encodeURI("defectDetail.html?obj=" + JSON.stringify(row));
		},
		//提交
		submitDefect:function(){
			if(this.multipleSelection.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("defect.selDefect"),
					type: 'warning'
				});
				return;
			}
			if(this.multipleSelection.length > 1) {
				this.$message({
					showClose: true,
					message: $.t("defect.selDefectOne"),
					type: 'warning'
				});
				return;
			}
			if(this.multipleSelection[0].state == 0){
				var data = {};
				data.id = this.multipleSelection[0].id;
				var This = this;
				var httpUrl = '/uap-demo/defect/submit';
				HTTP.httpPut(this, httpUrl, data, function(res) {
					This.$message({
						showClose: true,
						message: $.t("common.submitSuccess"),
						type: 'success'
					});
					This.currentPage = 1;
					This.getDefectList();
				}, function(error) {
					This.currentPage = 1;
					This.getDefectList();
				})
			}else{
				this.$message({
					showClose: true,
					message: $.t("defect.noCommit"),
					type: 'warning'
				});
			}
				
		},
		//审核
		auditDefect: function(){
			if(this.multipleSelection.length == 0) {
				this.$message({
					showClose: true,
					message: $.t("defect.selDefect"),
					type: 'warning'
				});
				return;
			}
			if(this.multipleSelection.length > 1) {
				this.$message({
					showClose: true,
					message: $.t("defect.selDefectOne"),
					type: 'warning'
				});
				return;
			}
			window.location.href = encodeURI("processDefect.html?selDefectID="+ this.multipleSelection[0].id);
		},
		//根据状态查询组织数据
		selectState: function() {
			this.currentPage = 1;
			this.getDefectList();
		},
		/**
		 * 业务组织状态改变
		 * @param {Object} list
		 */
		stateChange: function(list) {
			var state = "";
			if(list.stateNo) {
				state = 1;
			} else {
				state = 0;
			}
			var data = state;
			var This = this;
			var httpUrl = '/uap-demo/defect/' + list.id + '/state';
			HTTP.httpPut(this, httpUrl, data, function(res) {
				This.$message({
					showClose: true,
					message: i18n.t("common.updateSuccess"),
					type: 'success'
				});
				This.getDefectList();
			}, function(error) {
				This.getDefectList();
			})
		},

		handleSizeChange:function(val) {
	        this.page_size = val;
			this.getDefectList();
	    },
	      
	    handleCurrentChange:function(val) {
	        this.currentPage = val;
			this.start = this.page_size * (this.currentPage - 1);
			this.getDefectList();
	    },
		/**
		 * 查看流程图
		 */
//		viewPic:function(){
//			if(this.multipleSelection.length == 0) {
//				this.$message({
//					showClose: true,
//					message: $.t("defect.selDefect"),
//					type: 'warning'
//				});
//				return;
//			}
//			if(this.multipleSelection.length > 1) {
//				this.$message({
//					showClose: true,
//					message: $.t("defect.selDefectOne"),
//					type: 'warning'
//				});
//				return;
//			}
//		},
		
		/**
		 * 获取缺陷表格数据
		 */
		getDefectList: function() {
			var httpUrl = "/uap-demo/defect/list";
			this.defectDataList = [];
			var data = {};
			data.start = (this.currentPage - 1) * this.page_size;
			data.limit = this.page_size;
			if(this.chooseState != undefined && this.chooseState != null && this.chooseState != '') {
				data.state = this.chooseState;
			}
			if(this.searchName !== "") {
				data.name = this.searchName;
			}
			var This = this;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.total_count = res.total;
				var res = res.data;
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					if(rowObjitem.equipment_type == 0) {
						rowObjitem.equipment_type  = $.t('defect.equipmentType0');
					} else if(rowObjitem.equipment_type == 1) {
						rowObjitem.equipment_type  = $.t('defect.equipmentType1');
					}else if(rowObjitem.equipment_type == 2) {
						rowObjitem.equipment_type  = $.t('defect.equipmentType2');
					}
					
					if(rowObjitem.type == 0){
						rowObjitem.type = $.t('defect.type0');
					}else if(rowObjitem.type == 1){
						rowObjitem.type = $.t('defect.type1');
					}
					
					if(rowObjitem.discover_time) {
						rowObjitem.discover_time = Common.getFormatDateByLong(rowObjitem.discover_time);
					}
					if(rowObjitem.report_time) {
						rowObjitem.report_time = Common.getFormatDateByLong(rowObjitem.report_time);
					}
					if(rowObjitem.state == 0){
						rowObjitem.stateNo = $.t('defect.state0');
					}else if(rowObjitem.state == 1){
						rowObjitem.stateNo = $.t('defect.state1');
					}else if(rowObjitem.state == 2){
						rowObjitem.stateNo = $.t('defect.state2');
					}else if(rowObjitem.state == 3){
						rowObjitem.stateNo = $.t('defect.state3');
					}else if(rowObjitem.state == 4){
						rowObjitem.stateNo = $.t('defect.state4');
					}else if(rowObjitem.state == 5){
						rowObjitem.stateNo = $.t('defect.state5');
					}else if(rowObjitem.state == 6){
						rowObjitem.stateNo = $.t('defect.state6');
					}else if(rowObjitem.state == 7){
						rowObjitem.stateNo = $.t('defect.state7');
					}
					
				}
				This.defectDataList = res;
			});
		},

	}
});