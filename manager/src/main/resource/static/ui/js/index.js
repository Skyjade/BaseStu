/**
 * Index
 * xyc 
 */
new Vue({
	el: '#index',
	data: function() {
		return {
			placeholderSearch: "",
			shortcut: "",
			userName: "",
			appName: "",
			props: {
				id: 'id',
				label: 'name',
				children: 'children',
				//				isLeaf: 'is_leaf'
			},
			menuList: [], //菜单列表
			searchMenu: [],
			searchMenuValue: '',
			favorMenusData: [], //用户已收藏的菜单数据
			imageUrl: '', //用户头像url
			userMessData: [], //当前登录用户信息
		}
	},
	created: function() {
		if(Common.getToken() == null) {
			location.replace("login.html");
			return;
		}
		/**
		 * 界面刷新问题
		 */
		localStorage.removeItem('MENU_ID');
		userName = Common.getUserInfo().name;
		$("#userName").html(userName);
		$("#userName").attr("title", userName);
		this.appName = Common.getUserInfo().app_name;
		$("script[src='../js/libs/contabs.js']").remove();
		this.loadScript("../js/libs/contabs.js"); //加载成功后，并执行回调函数		
		var This = this;
		this.international(function() {
			This.getUserFavorMenus(function() {
				This.getMenuTree(null);
			});
			This.getUserMess();
		});
	},
	methods: {
		querySearch: function(queryString, cb) {
			this.searchMenu = [];
			var This = this;
			if(queryString != "") {
				this.getAllMenus(function() {
					var searchMenu = This.searchMenu;
					var results = queryString ? searchMenu.filter(This.createFilter(queryString)) : searchMenu;
					// 调用 callback 返回建议列表的数据
					cb(results);
				});
			} else {
				this.loadSearchMenu(function() {
					var searchMenu = This.searchMenu;
					var results = queryString ? searchMenu.filter(This.createFilter(queryString)) : searchMenu;
					// 调用 callback 返回建议列表的数据
					cb(results);
				});
			}
		},
		createFilter(queryString) {
			return(restaurant) => {
				return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
			};
		},
		loadSearchMenu: function(success) {
			var This = this;
			this.getUserUseMenus(function(data) {
				var menuData = [];
				if(data.length > 0) {
					for(var i = 0; i < data.length; i++) {
						var row = data[i];
						row.value = row.name;
						menuData.push(row);
					}
				}
				This.searchMenu = menuData;
				success(This.searchMenu)
			});
			//			return This.searchMenu;
		},
		/**
		 * 搜索菜单点击事件
		 * @param {Object} data
		 */
		handleSelect: function(data) {
			this.menuClick(data);
		},
		renderContent: function(h, {
			node,
			data,
			store
		}) {
			return h('div', {
				style: {
					width: '100%'
				}
			}, [
				h('span', {
					class: "indexIconClass " + data.icon,
					style: {
						marginLeft: '20px',
						marginRight: '10px',
						paddingTop: '1px',
						fontSize: "18px",
						color: "#333333",
						width: "18px",
						height: "18px"

					},
					attrs: {
						id: data.no + "icon"
					},
				}),
				h('span', {
					class: "indexTreeTxt",
					style: {
						color: "#333333",
						fontSize: "14px",
						overflow: "hidden"
					},
					domProps: {
						innerHTML: data.name
					},
					attrs: {
						id: data.no
					},
				}),
				h('div', {
					class: "clear",
				})
			]);

		},
		/**
		 * 树节点点击事件
		 * @param {Object} data
		 */
		handleNodeClick: function(data) {
			$(".indexTreeTxt").css("color", "#333333");
			$("#" + data.no).css("color", "#3f9ffe");
			$(".indexIconClass").css("color", "#333333")
			$("#" + data.no + "icon").css("color", "#3f9ffe");
			this.menuClick(data);
		},
		/**
		 * get tree
		 * @param {Object} partentId
		 * @param {Object} type
		 */
		getMenuTree: function(partentId, type, success) {
			var httpUrl = "/uap/user/menus";
			var This = this;
			var data = {};
			data.app_id = Common.getUserInfo().app_id;
			data.synchronize = true;
			data.user_id = Common.getUserInfo().id;
			if(partentId != null) {
				data.parent_id = partentId;
			}
			if(type != undefined) {
				data.limit_type = type; // 菜单
			}

			var kjcd = {};
			kjcd.name = This.shortcut;
			kjcd.icon = "fa fa-search";
			kjcd.children = This.favorMenusData;
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var data = res.data;
				if(type == undefined) {
					data.unshift(kjcd);
					This.menuList = data;
					setTimeout(function() {
						for(var i = 0; i < This.$refs.tree.store._getAllNodes().length; i++) {
							This.$refs.tree.store._getAllNodes()[i].expanded = false;
						}
					}, 100);
				} else {
					This.searchMenu = data;
				}
			});
		},

		/**
		 * get all menus 
		 */
		getAllMenus: function(success) {
			var httpUrl = "/uap/user/menus";
			var This = this;
			var data = {};
			data.app_id = Common.getUserInfo().app_id;
			data.synchronize = true;
			data.user_id = Common.getUserInfo().id;
			data.limit_type = "1"; // 菜单
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var data = res.data;
				var menuData = [];
				if(data.length > 0) {
					for(var i = 0; i < data.length; i++) {
						var row = data[i];
						row.value = row.name;
						menuData.push(row);
					}
				}
				This.searchMenu = menuData;
				success(This.searchMenu)
			});
		},
		/**
		 * 获取用户常用菜单
		 */
		getUserUseMenus: function(success) {
			var httpUrl = "/uap/user/favoritemenus";
			var This = this;
			var data = {};
			data.limit = 10;
			data.start = 0;
			data.type = "1";
			HTTP.httpPost(this, httpUrl, data, function(res) {
				var data = res.data;
				success(data);
			});
		},
		/**
		 * 菜单点击
		 * @param {Object} data 点击的菜单数据
		 */
		menuClick: function(data) {
			var appUrl = data.app_url;
			var o = "";
			if(data.url != undefined) {
				o = data.url.trim();
			}
			var l = data.name;
			var m = data.no;
			var id = data.id;
			var k = true;
			if(o == null || o == undefined || $.trim(o).length == 0) {
				return false
			}

			//上传用
			o = appUrl+o;

			//本地测试用
//			if(data.url.indexOf("ui/page/") >= 0) {
//				var uapHttp = data.url.split("ui/page/");
//				o = uapHttp[1];
//			}

			var This = this;
			localStorage.setItem("MENU_ID", data.id);
			$(".J_menuTab").each(function() {
				if($(this).data("id") == o && data.is_leaf) {
					if(!$(this).hasClass("active")) {
						$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
						This.g(this);
						$(".J_mainContent .J_iframe").each(function() {
							if($(this).data("id") == o) {
								$(this).show().siblings(".J_iframe").hide();
								return false
							}
						})
					}
					k = false;
					return false
				}
			});
			if(data.is_leaf && k) {
				var p = '<a href="javascript:;" class="active J_menuTab" data-id="' + o + '" data-role = "' + id + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
				$(".J_menuTab").removeClass("active");
				var n = '<iframe id="iframe' + id + '" class="J_iframe" name="iframe' + m + '" width="100%" height="100%" src="' + o + '" frameborder="0" data-id="' + o + '" data-role = "' + id + '" seamless></iframe>';
				$(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(n);
				$(".J_menuTabs .page-tabs-content").append(p);
				This.g($(".J_menuTab.active"))
			}
			if(data.type !== 0) {
				$("#favoriteStar").css("color", "#ffffff");
				for(var i = 0; i < this.favorMenusData.length; i++) {
					var rowObjitem = this.favorMenusData[i];
					if(Common.getCurrentMenu() == rowObjitem.id) {
						$("#favoriteStar").css("color", "#ff0000");
						break;
					}
				}
			}
		},
		/**
		 * log out
		 */
		logOut: function() {
			var httpUrl = "/uap/logout"
			HTTP.httpPost(this, httpUrl, {}, function() {
				localStorage.clear();
				location.replace("login.html");
			});
		},

		/**
		 * 全屏
		 */
		screenBigbtn: function() {
			if(this.f_IsFullScreen()) {
				this.exitFull();
			} else {
				var element = document.documentElement;
				this.requestFullScreen(element);
			}
		},

		//判断浏览器是否全屏 
		f_IsFullScreen: function() {
			return(document.body.scrollHeight == window.screen.height)
			//			return(document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);
		},

		// 全屏
		requestFullScreen: function(element) {
			var docElm = document.documentElement;
			if(docElm.requestFullscreen) {
				docElm.requestFullscreen();
			} else if(docElm.msRequestFullscreen) {
				docElm.msRequestFullscreen();
			} else if(docElm.mozRequestFullScreen) {
				docElm.mozRequestFullScreen();
			} else if(docElm.webkitRequestFullScreen) {
				docElm.webkitRequestFullScreen();
			}
		},

		//退出全屏
		exitFull: function() {
			if(document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		},
		/**
		 * 菜单小图标点击事件
		 */
		indexLeftIconBtn: function() {
			$("#leftNavSmall").hide();
			$("#leftNav").show();
			$("#page-wrapper").removeClass("marg50");
		},
		/**
		 * 收缩菜单
		 */
		smoothlyMenu: function() {
			if($("#leftNav").is(":hidden")) {
				$("#leftNavSmall").hide();
				$("#leftNav").show();
				$("#page-wrapper").removeClass("marg50"); //如果元素为隐藏,则将它显现
			} else {
				$("#leftNav").hide();
				$("#leftNavSmall").show();
				$("#page-wrapper").addClass("marg50"); //如果元素为显现,则将其隐藏
			}
		},
		/**
		 * 刷新当前显示的iframe界面
		 */
		refreshBtn: function() {
			var This = this;
			$(".J_mainContent .J_iframe").each(function() {
				if(!$(this).is(":hidden")) {
					//					$(this)[0].contentWindow.location.reload(true);
					var frameId = $(this).attr("id");
					if(frameId != undefined) {
						var o = $('#'+frameId).attr('src'),
							m = $('#'+frameId).data("index"),
							id = $('#'+frameId).data("role");
						$(this)[0].remove();	
						var n = '<iframe id="' + frameId + '" class="J_iframe" name="iframe' + m + '" width="100%" height="100%" src="' + o + '" frameborder="0" data-id="' + o + '" data-role = "' + id + '" seamless></iframe>';
						$(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(n);
						This.g($(".J_menuTab.active"))
//						$(this)[0].contentWindow.location.replace($('#' + frameId).attr('src'));
//						$('#'+frameId).attr('src', $('#'+frameId).attr('src'));
					}
				}
			});
		},
		/**
		 * 操作点击事件
		 * @param {Object} command
		 */
		operateCommand: function(command) {
			if(command == "a") {
				this.g($(".J_menuTab.active"));
			} else if(command == "b") {
				$(".page-tabs-content").children("[data-id]").not(":first").not(".active").each(function() {
					$('.J_iframe[data-id="' + $(this).data("id") + '"]').remove();
					$(this).remove()
				});
				$(".page-tabs-content").css("margin-left", "0")
			} else if(command == "c") {
				$(".page-tabs-content").children("[data-id]").not(":first").each(function() {
					$('.J_iframe[data-id="' + $(this).data("id") + '"]').remove();
					$(this).remove()
				});
				$(".page-tabs-content").children("[data-id]:first").each(function() {
					$('.J_iframe[data-id="' + $(this).data("id") + '"]').show();
					$(this).addClass("active")
				});
				$(".page-tabs-content").css("margin-left", "0")
			}
		},
		/**
		 * tab左移
		 */
		J_tabLeft: function() {
			var o = Math.abs(parseInt($(".page-tabs-content").css("margin-left")));
			var l = this.f($(".content-tabs").children().not(".J_menuTabs"));
			var k = $(".content-tabs").outerWidth(true) - l;
			var p = 0;
			if($(".page-tabs-content").width() < k) {
				return false
			} else {
				var m = $(".J_menuTab:first");
				var n = 0;
				while((n + $(m).outerWidth(true)) <= o) {
					n += $(m).outerWidth(true);
					m = $(m).next()
				}
				n = 0;
				if(this.f($(m).prevAll()) > k) {
					while((n + $(m).outerWidth(true)) < (k) && m.length > 0) {
						n += $(m).outerWidth(true);
						m = $(m).prev()
					}
					p = this.f($(m).prevAll())
				}
			}
			$(".page-tabs-content").animate({
				marginLeft: 0 - p + "px"
			}, "fast")
		},
		/**
		 * tab右移
		 */
		J_tabRight: function() {
			var o = Math.abs(parseInt($(".page-tabs-content").css("margin-left")));
			var l = this.f($(".content-tabs").children().not(".J_menuTabs"));
			var k = $(".content-tabs").outerWidth(true) - l;
			var p = 0;
			if($(".page-tabs-content").width() < k) {
				return false
			} else {
				var m = $(".J_menuTab:first");
				var n = 0;
				while((n + $(m).outerWidth(true)) <= o) {
					n += $(m).outerWidth(true);
					m = $(m).next()
				}
				n = 0;
				while((n + $(m).outerWidth(true)) < (k) && m.length > 0) {
					n += $(m).outerWidth(true);
					m = $(m).next()
				}
				p = this.f($(m).prevAll());
				if(p > 0) {
					$(".page-tabs-content").animate({
						marginLeft: 0 - p + "px"
					}, "fast")
				}
			}
		},
		g: function(n) {
			var o = this.f($(n).prevAll()),
				q = this.f($(n).nextAll());
			var l = this.f($(".content-tabs").children().not(".J_menuTabs"));
			var k = $(".content-tabs").outerWidth(true) - l;
			var p = 0;
			if($(".page-tabs-content").outerWidth() < k) {
				p = 0
			} else {
				if(q <= (k - $(n).outerWidth(true) - $(n).next().outerWidth(true))) {
					if((k - $(n).next().outerWidth(true)) > q) {
						p = o;
						var m = n;
						while((p - $(m).outerWidth()) > ($(".page-tabs-content").outerWidth() - k)) {
							p -= $(m).prev().outerWidth();
							m = $(m).prev()
						}
					}
				} else {
					if(o > (k - $(n).outerWidth(true) - $(n).prev().outerWidth(true))) {
						p = o - $(n).prev().outerWidth(true)
					}
				}
			}
			$(".page-tabs-content").animate({
				marginLeft: 0 - p + "px"
			}, "fast")
		},
		f: function(l) {
			var k = 0;
			$(l).each(function() {
				k += $(this).outerWidth(true)
			});
			return k
		},
		/**
		 * 加载外部js文件
		 * @param {Object} url
		 * @param {Object} callback
		 */
		loadScript: function(url, callback) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			if(typeof(callback) != "undefined") {
				if(script.readyState) {
					script.onreadystatechange = function() {
						if(script.readyState == "loaded" || script.readyState == "complete") {
							script.onreadystatechange = null;
							callback();
						}
					};
				} else {
					script.onload = function() {
						callback();
					};
				}
			};
			script.src = url;
			document.body.appendChild(script);
		},
		//获取用户已收藏的菜单
		getUserFavorMenus: function(success) {
			var This = this;
			var data = {
				type: "0"
			};
			$("#favoriteStar").css("color", "#ffffff");
			var httpUrl = '/uap/user/favoritemenus'
			HTTP.httpPost(this, httpUrl, data, function(res) {
				This.favorMenusData = res.data;
				favorMenusData = res.data;
				success();
			});
		},
		//收藏菜单
		favoriteMenus: function() {
			var selMenu = Common.getCurrentMenu();
			if(selMenu == null) {
				return;
			}
			if($('#favoriteStar').css("color") == "rgb(255, 255, 255)") {
				if(this.favorMenusData.length == Common.favorMenusMax) {
					var message = i18n.t("index.collect") + " " + Common.favorMenusMax + " " + i18n.t("index.numMenus")
					this.$message({
						showClose: true,
						message: message,
						type: 'warning '
					});
					return;
				}
				var This = this;
				var httpUrl = '/uap/user/' + selMenu + '/favoritemenus'
				HTTP.httpPost(this, httpUrl, {}, function(res) {
					This.favorMenusData = res.data;
					favorMenusData = res.data;
					This.getUserFavorMenus(function() {
						var kjcd = {};
						kjcd.name = This.shortcut;
						kjcd.icon = "fa fa-search";
						kjcd.children = This.favorMenusData;
						This.menuList.shift();
						This.menuList.unshift(kjcd);
					});
					$("#favoriteStar").css("color", "#ff0000");
				});
				return;
			}

			if($('#favoriteStar').css("color") == "rgb(255, 0, 0)") {
				var httpUrl = '/uap/user/' + selMenu + '/favoritemenus';
				var This = this;
				HTTP.httpDelete(this, httpUrl, {}, function(res) {
					This.favorMenusData = res.data;
					favorMenusData = res.data;
					This.getUserFavorMenus(function() {
						var kjcd = {};
						kjcd.name = This.shortcut;
						kjcd.icon = "fa fa-search";
						kjcd.children = This.favorMenusData;
						This.menuList.shift();
						This.menuList.unshift(kjcd);
					});
					$("#favoriteStar").css("color", "#ffffff");
				});
			}

		},
		//我的信息
		myMessage: function() {
			$("#myMessage").load('myMessage.html');
		},
		//修改密码
		editPsw: function() {
			$("#editPassword").load('editPassword.html');
		},
		/**
		 * 国际化
		 */
		international: function(success) {
			var This = this;
			$.i18n.init({
				lng: localStorage.getItem("LANGUAGE"),
				resGetPath: '../js/i18next/__lng__/__ns__.json'
			}, function(err, t) {
				$('[data-i18n]').i18n(); // 通过选择器集体翻译
				This.placeholderSearch = $.t("common.inputName");
				This.shortcut = $.t("index.shortcut");
				success();
			});
		},
		//获取用户信息
		getUserMess: function() {
			var httpUrl = "/uap/userSelf";
			var This = this;
			HTTP.httpGet(this, httpUrl, function(res) {
				var data = res.data;
				if(data.state == 3) {
					$("#editPassword").load('editPassword.html');
				}
				This.userMessData = data;
				if(data.photo_id == "" || data.photo_id == undefined) {
					This.imageUrl = "../img/userHead.png";
				} else {
					This.imageUrl = Common.getUserInfo().uap_url + "/uap/file/content/" + This.userMessData.photo_id + "?Authorization=Bearer " + Common.getToken();
				}
			});
		},
	}
});