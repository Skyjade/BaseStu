new Vue({
	el: "#dynamicFieldManage",
	data: function() {
		return {
			total_count: 0,
			currentPage: 1,
			size: 10,
			dynamicFieldList: [], //动态字段表格数据
			fieldData: {}, //新增动态字段弹框数据
			rules: {
				type: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				field: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
				default_name: [{
					required: true,
					message: "",
					trigger: 'blur'
				}],
			},
			addFieldDialog: false, //新增动态字段弹框
			editFieldDialog: false, //编辑动态字段弹框
			editFieldData: {}, //新增动态字段弹框数据
			editDisabled: false, //是否可编辑
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getDynamicFieldList();
			});
		});
	},
	methods: {
		//国际化
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: 'i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.rules.type[0].message = $.t("dynamicFieldManage.inputType");
				This.rules.field[0].message = $.t("dynamicFieldManage.inputField");
				This.rules.default_name[0].message = $.t("dynamicFieldManage.inputDefaultName");
				if(success != undefined) {
					success();
				}
			});
		},
		handleSizeChange: function(val) {
			this.size = val;
			this.currentPage = 1;
			this.getDynamicFieldList();
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getDynamicFieldList();
		},
		//获取动态字段列表
		getDynamicFieldList: function() {
			var httpUrl = "/uap-bpm/page/field/list";
			var This = this;
			var data = {};
			data.limit = this.size;
			data.start = (this.currentPage - 1) * this.size;
			HTTP.httpPost(This, httpUrl, data, function(res) {
				This.total_count = res.total;
				var res = res.data;
				for(var i = 0; i < res.length; i++) {
					var rowObjitem = res[i];
					if(rowObjitem.is_basic == "1") {
						rowObjitem.isDelete = true;
					} else {
						rowObjitem.isDelete = false;
					}
				}
				This.dynamicFieldList = res;
			});
		},
		//打开新增动态字段弹框
		openAddDialog: function() {
			if(this.$refs.addField !== undefined) {
				this.$refs.addField.resetFields();
			}
			this.fieldData = {};
			this.addFieldDialog = true;
		},
		//新增动态字段提交事件
		addDynamicField: function() {
			var This = this;
			this.$refs.addField.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/page/field";
					var data = This.fieldData;
					HTTP.httpPost(This, httpUrl, data, function(res) {
						This.currentPage = 1;
						This.getDynamicFieldList();
						This.addFieldDialog = false;
						This.$message({
							showClose: true,
							message: $.t("common.addSuccess"),
							type: 'success'
						});
					});
				}
			})
		},
		//打开编辑动态字段弹框
		openEditDialog: function(index, row) {
			if(this.$refs.editField !== undefined) {
				this.$refs.editField.resetFields();
			}
			this.editDisabled = false;
			var httpUrl = "/uap-bpm/page/field/" + row.id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.editFieldData = res.data;
				if(row.isDelete) {
					This.editDisabled = true;
				}
				This.editFieldDialog = true;
			});
		},
		//编辑动态字段提交事件
		editDynamicField: function() {
			var This = this;
			this.$refs.editField.validate(function(valid) {
				if(valid) {
					var httpUrl = "/uap-bpm/page/field/" + This.editFieldData.id;
					var data = This.editFieldData;
					HTTP.httpPut(This, httpUrl, data, function(res) {
						This.getDynamicFieldList();
						This.editFieldDialog = false;
						This.$message({
							showClose: true,
							message: $.t("common.updateSuccess"),
							type: 'success'
						});
					});
				}
			});
		},
		//删除
		deleteField: function(index, row) {
			var This = this;
			this.$alert($.t("common.confirmDelete"), $.t("common.delete"), {
				confirmButtonText: i18n.t('common.delete'),
				showCancelButton:true,
				type: 'warning',
				showClose: true,
				callback: function(action, instance) {
					if(action == "confirm"){
						var httpUrl = "/uap-bpm/page/field/" + row.id;
						HTTP.httpDelete(This, httpUrl, {}, function(res) {
							This.currentPage = 1;
							This.getDynamicFieldList();
							This.$message({
								showClose: true,
								message: $.t("common.deleteSuccess"),
								type: 'success'
							});
						});
					}
				}
			});
		},
		testData: function(val) {
			this.editFieldData.type;
		},
	}
})