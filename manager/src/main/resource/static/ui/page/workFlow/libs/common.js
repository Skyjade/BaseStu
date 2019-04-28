/**
 * 公共方法
 */
var Common = {
	/**
	 * 设置用户信息
	 * @param {Object} userInfo
	 */
	setUserInfo: function(userInfo) {
		localStorage.setItem("USER", userInfo);
	},
	/**
	 * 获取登录用户信息
	 */
	getUserInfo: function() {
		var json = eval("(" + localStorage.getItem("USER") + ")");
		return json;
	},
	/**
	 * 获取token
	 */
	getToken: function() {
		if(Common.getUserInfo() == null) {
			return null;
		}
		return Common.getUserInfo().token;
	},
	/**
	 * element 控件国际化
	 */
	elementLng: function() {
		if(localStorage.getItem("LANGUAGE") == "en") {
			ELEMENT.locale(ELEMENT.lang.en)
		} else if(localStorage.getItem("LANGUAGE") == "zh") {
			ELEMENT.locale(ELEMENT.lang.zhCN)
		}
	},
	/**
	 * 检验是否含有特殊字符
	 * @param {Object} s
	 */
	checkReg: function(s) {
		var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im;
		if(!patrn.test(str)) { // 如果包含特殊字符返回false
			return false;
		}
		return true;
	},
	/** 
	 *转换日期对象为日期字符串
	 * @param date 时间
	 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss, 默认为yyyy-MM-dd hh:mm:ss
	 * @return 符合要求的日期字符串
	 */
	getFormatDate: function(date, pattern) {
		try {
			if(date == undefined || date == null) {
				return "";
			}
			if(pattern == undefined || pattern == null) {
				pattern = "yyyy-MM-dd hh:mm:ss";
			}
			return date.format(pattern);
		} catch(e) {
			return date;
		}
	},
	/** 
	 * 转换long值为日期字符串
	 * @param longDate long值时间
	 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
	 * @return 符合要求的日期字符串
	 */
	getFormatDateByLong: function(longDate, pattern) {
		try {
			if(longDate == undefined || longDate == null) {
				return "";
			}
			return this.getFormatDate(new Date(longDate), pattern);
		} catch(e) {}
		return "";
	},
}
//公用时间格式化
Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	}
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}

	return format;
}