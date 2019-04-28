new Vue({
	el: "#definitions",
	data: function() {
		return {
			definitionsList: [],
			total_count: 0,
			currentPage: 1,
			size: 10,
			keySearch: "",
			nameSearch: "",
			deploymentDialog: false,
			deployment: {}
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getDefinitionsList(This.currentPage);
			});
		});
	},
	methods: {
		/**
		 * 进入详情界面
		 * @param {Object} row
		 */
		openDetail: function(index, row) {
			window.location.href = encodeURI("definitionDetail.html?definitionId=" + row.id + '&definitionName=' + row.name);
		},
		handleSizeChange: function(val) {
			this.size = val;
			this.getDefinitionsList(this.currentPage, this.keySearch, this.nameSearch);
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getDefinitionsList(this.currentPage, this.keySearch, this.nameSearch);
		},
		searchBtn: function() {
			this.currentPage = 1;
			this.getDefinitionsList(this.currentPage, this.keySearch, this.nameSearch);
		},
		/**
		 * 打开部署流程弹出框
		 * @param {Object} index
		 * @param {Object} row
		 */
		openDeploymentDialog: function(index, row) {
			this.getDeployment(row.deployment_id);
		},
		getDeployment: function(id) {
			var httpUrl = "/uap-bpm/repository/deployments/" + id;
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				res.data.deploymentTime = moment(res.data.deploymentTime).format("YYYY-MM-DD HH:mm:ss")
				This.deployment = res.data;
				This.deploymentDialog = true;
				This.international();
			});
		},
		/**
		 * 获取Definitions列表
		 */
		getDefinitionsList: function(pageNum, key, name) {
			var start = (pageNum - 1) * this.size;
			var httpUrl = "/uap-bpm/repository/process-definitions?size=" + this.size + '&start=' + start;
			if(key != undefined) {
				httpUrl = httpUrl + "&keyLike=" + key;
			}
			if(key != undefined) {
				httpUrl = httpUrl + "&nameLike=" + name;
			}
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.total_count = res.total;
				This.definitionsList = res.data;
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
				if(success != undefined) {
					success();
				}
			});
		},

	}
});