/**
 * 获取登录后用户信息
 * 调用window.top.window.getUserInfo()
 */
function getUserInfo(){
	var json = eval("(" + localStorage.getItem("USER") + ")");
	return json;
}

/**
 * 获取当前点击的菜单id
 * 调用window.top.window.getCurrentMenu()
 */
function getCurrentMenu(){
	return parseInt(localStorage.getItem("MENU_ID"));
}

/**
 * 获取当前应用的语言
 * 调用window.top.window.getLanguage()
 */
function getLanguage(){
	return localStorage.getItem("LANGUAGE");
}
