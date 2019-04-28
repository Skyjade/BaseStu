$(function() {
	function f(l) {
		var k = 0;
		$(l).each(function() {
			k += $(this).outerWidth(true)
		});
		return k
	}

	function g(n) {
		var o = f($(n).prevAll()),
			q = f($(n).nextAll());
		var l = f($(".content-tabs").children().not(".J_menuTabs"));
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
	}
	$(".el-tree-node__content").each(function(k) {
		if(!$(this).attr("data-index")) {
			$(this).attr("data-index", k)
		}
	});

	function c() {
		var o = $(this).attr("href"),
			m = $(this).data("index"),
			l = $.trim($(this).text()),
			id = $(this).data("role"),
			frameId = $(this).attr("id");
			k = true;
		if(o == undefined || $.trim(o).length == 0) {
			return false
		}
		$(".J_menuTab").each(function() {
			if($(this).data("id") == o) {
				if(!$(this).hasClass("active")) {
					$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
					g(this);
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
		if(k) {
			var p = '<a href="javascript:;" class="active J_menuTab" data-id="' + o + '" data-role = "' + id + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
			$(".J_menuTab").removeClass("active");
			var n = '<iframe id="iframe' + frameId + '" class="J_iframe" name="iframe' + m + '" width="100%" height="100%" src="' + o + '" frameborder="0" data-id="' + o + '" data-role = "' + id + '" seamless></iframe>';
			$(".J_mainContent").find("iframe.J_iframe").hide().parents(".J_mainContent").append(n);
			$(".J_menuTabs .page-tabs-content").append(p);
			g($(".J_menuTab.active"))
		}
		return false
	}
	$(".J_menuItem").on("click", c);


	function h() {
		var m = $(this).parents(".J_menuTab").data("id");
		var l = $(this).parents(".J_menuTab").width();
		if($(this).parents(".J_menuTab").hasClass("active")) {
			if($(this).parents(".J_menuTab").next(".J_menuTab").size()) {
				var parentId = $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").data("role");
				localStorage.setItem("MENU_ID", parentId);
				
				var k = $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").data("id");
				$(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").addClass("active");
				$(".J_mainContent .J_iframe").each(function() {
					if($(this).data("id") == k) {
						$(this).show().siblings(".J_iframe").hide();
						return false
					}
				});
				var n = parseInt($(".page-tabs-content").css("margin-left"));
				if(n < 0) {
					$(".page-tabs-content").animate({
						marginLeft: (n + l) + "px"
					}, "fast")
				}
				$(this).parents(".J_menuTab").remove();
				$(".J_mainContent .J_iframe").each(function() {
					if($(this).data("id") == m) {
						$(this).remove();
						return false
					}
				})
			}
			if($(this).parents(".J_menuTab").prev(".J_menuTab").size()) {
				var parentId = $(this).parents(".J_menuTab").prev(".J_menuTab:last").data("role");
				localStorage.setItem("MENU_ID", parentId);
				var k = $(this).parents(".J_menuTab").prev(".J_menuTab:last").data("id");
				$(this).parents(".J_menuTab").prev(".J_menuTab:last").addClass("active");
				g($(".J_menuTab.active"))
				$(".J_mainContent .J_iframe").each(function() {
					if($(this).data("id") == k) {
						$(this).show().siblings(".J_iframe").hide();
						return false
					}
				});
				$(this).parents(".J_menuTab").remove();
				$(".J_mainContent .J_iframe").each(function() {
					if($(this).data("id") == m) {
						$(this).remove();
						return false
					}
				})
			}
		} else {
			$(this).parents(".J_menuTab").remove();
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == m) {
					$(this).remove();
					return false
				}
			});
			g($(".J_menuTab.active"))
		}
		setFavoriteStar();
		return false
	}
	$(".J_menuTabs").on("click", ".J_menuTab i", h);

	function e() {
		if(!$(this).hasClass("active")) {
			var k = $(this).data("id");
			var parentId = $(this).data("role");
			localStorage.setItem("MENU_ID", parentId);
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == k) {
					$(this).show().siblings(".J_iframe").hide();
					return false
				}
			});
			$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
			g(this);
			setFavoriteStar();
		}
	}
	$(".J_menuTabs").on("click", ".J_menuTab", e);

	function d() {
		var l = $('.J_iframe[data-id="' + $(this).data("id") + '"]');
		var k = l.attr("src")
	}
	$(".J_menuTabs").on("dblclick", ".J_menuTab", d);
	
	function setFavoriteStar(){
		$("#favoriteStar").css("color", "#ffffff");
		for(var i = 0; i < favorMenusData.length; i++) {
			var rowObjitem = favorMenusData[i];
			if(Common.getCurrentMenu() == rowObjitem.id) {
				$("#favoriteStar").css("color", "#ff0000");
				break;
			}
		}
	}
});


$(document).ready(function() {
//	onclick = "return false";
	if(screen.width == 1280 && screen.height == 720){
		$("#leftNav").hide();
		$("#leftNavSmall").show();
		$("#page-wrapper").addClass("marg50");
	}else{
		if($(this).width() < 769){
			$("#leftNav").hide();
			$("#leftNavSmall").show();
			$("#page-wrapper").addClass("marg50");
		}else{
			$("#leftNavSmall").hide();
			$("#leftNav").show();
			$("#page-wrapper").removeClass("marg50");
		}
	}
	function e() {
		var e = $("body > #wrapper").height() - 61;
		$(".sidebard-panel").css("min-height", e + "px")
	}
	e(), $(window).bind("load resize click scroll", function() {
		$("body").hasClass("body-small") || e()
	}), $(window).scroll(function() {
		$(window).scrollTop() > 0 && !$("body").hasClass("fixed-nav") ? $("#right-sidebar").addClass("sidebar-top") : $("#right-sidebar").removeClass("sidebar-top")
	})
}), $(window).bind("resize", function() {
	if($(this).width() < 769){
		$("#leftNav").hide();
		$("#leftNavSmall").show();
		$("#page-wrapper").addClass("marg50");
	}else{
		$("#leftNavSmall").hide();
		$("#leftNav").show();
		$("#page-wrapper").removeClass("marg50");
	}
//	$(this).width() < 769 && ($("body").addClass("mini-navbar"), $(".navbar-static-side").fadeIn())
});