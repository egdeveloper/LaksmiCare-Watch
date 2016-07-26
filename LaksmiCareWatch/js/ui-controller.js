var pagePos = 0;
var pageCount = 3;
$(document).ready(function(){
	document.addEventListener("rotarydetent", function(e){
		if(e.detail.direction == "CW"){
			$("#page" + pagePos).removeClass("ui-page-active");
			pagePos = (++pagePos) % pageCount;
			$("#page" + pagePos).addClass("ui-page-active");
		}
		else if(e.detail.direction == "CCW"){
			$("#page" + pagePos).removeClass("ui-page-active");
			pagePos = pagePos != 0 ? (--pagePos) % pageCount : pageCount - 1;
			$("#page" + pagePos).addClass("ui-page-active");
		}
	}, false);
});