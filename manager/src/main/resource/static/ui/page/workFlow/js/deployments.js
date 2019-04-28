new Vue({
	el: "#deployments",
	data: function() {
		return {
			deploymentsList: [],
			total_count: 0,
			currentPage: 1,
			size: 10,
			deplomentName: ""
		}
	},
	created: function() {
		Common.elementLng();
		var This = this;
		this.international(function() {
			HTTP.getCodeAndMenus(This, [], function(res) {
				This.getDeploymentsList(This.currentPage);
			});
		});
	},
	methods: {
		/**
		 * 进入详情界面
		 * @param {Object} row
		 */
		openDetail: function(row) {
			window.location.href = encodeURI("deploymentDetail.html?deploymentsId=" + row.id + '&deploymentsName=' + row.name);
		},
		handleSizeChange: function(val) {
			this.size = val;
			this.getDeploymentsList(this.currentPage, this.deplomentName);
		},

		handleCurrentChange: function(val) {
			this.currentPage = val;
			this.getDeploymentsList(this.currentPage, this.deplomentName);
		},
		searchBtn: function() {
			this.currentPage = 1;
			this.getDeploymentsList(this.currentPage, this.deplomentName);
		},
		/**
		 * 获取deployments列表
		 */
		getDeploymentsList: function(pageNum, deplomentName) {
			var start = (pageNum - 1) * this.size;
			var httpUrl = "/uap-bpm/repository/deployments?size=" + this.size + '&start=' + start;

			if(deplomentName != undefined) {
				httpUrl = httpUrl + "&nameLike=" + deplomentName;
			}
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				This.total_count = res.total;
				This.deploymentsList = res.data;
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
				success();
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