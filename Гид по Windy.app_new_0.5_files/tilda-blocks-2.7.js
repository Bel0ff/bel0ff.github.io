 
function t121_setHeight(recid){
    var rec = $('#rec' + recid);
    var div=$("#youtubeiframe"+recid);
    var height=div.width() * 0.5625;
    div.height(height);
    div.parent().height(height);
    
    var videoLazy = rec.find('.t-video-lazyload');
    var iframeLazy = videoLazy.find('iframe');
    if (videoLazy != undefined) {
        var heightLazy = videoLazy.width() * 0.5625;
        videoLazy.height(heightLazy);
        iframeLazy.height(heightLazy);
    }
} 
function t142_checkSize(recid){
  var el=$("#rec"+recid).find(".t142__submit");
  if(el.length){
    var btnheight = el.height() + 5;
    var textheight = el[0].scrollHeight;
    if (btnheight < textheight) {
      var btntext = el.text();
      el.addClass("t142__submit-overflowed");
      el.html("<span class=\"t142__text\">" + btntext + "</span>");
    }
  }
} 
function t228_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t228__list_item a[href='"+url+"']").addClass("t-active");
  $(".t228__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t228__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t228__list_item a[href='/"+pathname+"/']").addClass("t-active");
}

function t228_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t228_navLinks = $("#rec" + recid + " .t228__list_item a:not(.tooltipstered)[href*='#']");
        if (t228_navLinks.length > 0) {
            setTimeout(function(){
              t228_catchScroll(t228_navLinks);
            }, 500);
        }
    }
}

function t228_catchScroll(t228_navLinks) {
    var t228_clickedSectionId = null,
        t228_sections = new Array(),
        t228_sectionIdTonavigationLink = [],
        t228_interval = 100,
        t228_lastCall, t228_timeoutId;
    t228_navLinks = $(t228_navLinks.get().reverse());
    t228_navLinks.each(function() {
        var t228_cursection = t228_getSectionByHref($(this));
        if (typeof t228_cursection.attr("id") != "undefined") {
            t228_sections.push(t228_cursection);
        }
        t228_sectionIdTonavigationLink[t228_cursection.attr("id")] = $(this);
    });
		t228_updateSectionsOffsets(t228_sections);
    t228_sections.sort(function(a, b) {
      return b.attr("data-offset-top") - a.attr("data-offset-top");
    });
		$(window).bind('resize', t_throttle(function(){t228_updateSectionsOffsets(t228_sections);}, 200));
		$('.t228').bind('displayChanged',function(){t228_updateSectionsOffsets(t228_sections);});
		setInterval(function(){t228_updateSectionsOffsets(t228_sections);},5000);
    t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);

    t228_navLinks.click(function() {
        var t228_clickedSection = t228_getSectionByHref($(this));
        if (!$(this).hasClass("tooltipstered") && typeof t228_clickedSection.attr("id") != "undefined") {
            t228_navLinks.removeClass('t-active');
            $(this).addClass('t-active');
            t228_clickedSectionId = t228_getSectionByHref($(this)).attr("id");
        }
    });
    $(window).scroll(function() {
        var t228_now = new Date().getTime();
        if (t228_lastCall && t228_now < (t228_lastCall + t228_interval)) {
            clearTimeout(t228_timeoutId);
            t228_timeoutId = setTimeout(function() {
                t228_lastCall = t228_now;
                t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
            }, t228_interval - (t228_now - t228_lastCall));
        } else {
            t228_lastCall = t228_now;
            t228_clickedSectionId = t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId);
        }
    });
}


function t228_updateSectionsOffsets(sections){
	$(sections).each(function(){
		var t228_curSection = $(this);
		t228_curSection.attr("data-offset-top",t228_curSection.offset().top);
	});
}

function t228_getSectionByHref(curlink) {
      var t228_curLinkValue = curlink.attr('href').replace(/\s+/g, '').replace(/.*#/, '');
      if (curlink.is('[href*="#rec"]')) {
          return $(".r[id='" + t228_curLinkValue + "']");
      } else {
          return $(".r[data-record-type='215']").has("a[name='" + t228_curLinkValue + "']");
      }
  }

function t228_highlightNavLinks(t228_navLinks, t228_sections, t228_sectionIdTonavigationLink, t228_clickedSectionId) {
    var t228_scrollPosition = $(window).scrollTop(),
        t228_valueToReturn = t228_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t228_sections.length != 0 && t228_clickedSectionId == null && t228_sections[t228_sections.length-1].attr("data-offset-top") > (t228_scrollPosition + 300)){
      t228_navLinks.removeClass('t-active');
      return null;
    }

    $(t228_sections).each(function(e) {
        var t228_curSection = $(this),
            t228_sectionTop = t228_curSection.attr("data-offset-top"),
            t228_id = t228_curSection.attr('id'),
            t228_navLink = t228_sectionIdTonavigationLink[t228_id];
        if (((t228_scrollPosition + 300) >= t228_sectionTop) || (t228_sections[0].attr("id") == t228_id && t228_scrollPosition >= $(document).height() - $(window).height())) {
            if (t228_clickedSectionId == null && !t228_navLink.hasClass('t-active')) {
                t228_navLinks.removeClass('t-active');
                t228_navLink.addClass('t-active');
                t228_valueToReturn = null;
            } else {
                if (t228_clickedSectionId != null && t228_id == t228_clickedSectionId) {
                    t228_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t228_valueToReturn;
}

function t228_setPath(){
}

function t228_setWidth(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var left_exist=el.find('.t228__leftcontainer').length;
      var left_w=el.find('.t228__leftcontainer').outerWidth(true);
      var max_w=left_w;
      var right_exist=el.find('.t228__rightcontainer').length;
      var right_w=el.find('.t228__rightcontainer').outerWidth(true);
	  var items_align=el.attr('data-menu-items-align');
      if(left_w<right_w)max_w=right_w;
      max_w=Math.ceil(max_w);
      var center_w=0;
      el.find('.t228__centercontainer').find('li').each(function() {
        center_w+=$(this).outerWidth(true);
      });
      var padd_w=40;
      var maincontainer_width=el.find(".t228__maincontainer").outerWidth();
      if(maincontainer_width-max_w*2-padd_w*2>center_w+20){
          //if(left_exist>0 && right_exist>0){
		  if(items_align=="center" || typeof items_align==="undefined"){
            el.find(".t228__leftside").css("min-width",max_w+"px");
            el.find(".t228__rightside").css("min-width",max_w+"px");
            el.find(".t228__list").removeClass("t228__list_hidden");
          }
       }else{
          el.find(".t228__leftside").css("min-width","");
          el.find(".t228__rightside").css("min-width","");  
          
      }
    });
  }
}

function t228_setBg(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      if(el.attr('data-bgcolor-setbyscript')=="yes"){
        var bgcolor=el.attr("data-bgcolor-rgba");
        el.css("background-color",bgcolor);
      }
      });
      }else{
        $(".t228").each(function() {
          var el=$(this);
          var bgcolor=el.attr("data-bgcolor-hex");
          el.css("background-color",bgcolor);
          el.attr("data-bgcolor-setbyscript","yes");
      });
  }
}

function t228_appearMenu(recid) {
      var window_width=$(window).width();
      if(window_width>980){
           $(".t228").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.css('visibility') == 'hidden'){
                                el.finish();
                                el.css("top","-50px");  
                                el.css("visibility","visible");
                                var topoffset = el.data('top-offset');
                                if (topoffset && parseInt(topoffset) > 0) {
                                    el.animate({"opacity": "1","top": topoffset+"px"}, 200,function() {
                                    });
                                    
                                } else {
                                    el.animate({"opacity": "1","top": "0px"}, 200,function() {
                                    });
                                }
                            }
                          }else{
                            el.stop();
                            el.css("visibility","hidden");
							el.css("opacity","0");	
                          }
                  }
           });
      }

}

function t228_changebgopacitymenu(recid) {
  var window_width=$(window).width();
  if(window_width>980){
    $(".t228").each(function() {
      var el=$(this);
      var bgcolor=el.attr("data-bgcolor-rgba");
      var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
      var bgopacityone=el.attr("data-bgopacity");
      var bgopacitytwo=el.attr("data-bgopacity-two");
      var menushadow=el.attr("data-menushadow");
      if(menushadow=='100'){
        var menushadowvalue=menushadow;
      }else{
        var menushadowvalue='0.'+menushadow;
      }
      if ($(window).scrollTop() > 20) {
        el.css("background-color",bgcolor_afterscroll);
        if(bgopacitytwo=='0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }else{
        el.css("background-color",bgcolor);
        if(bgopacityone=='0.0' || (typeof menushadow == "undefined" && menushadow == false)){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }
    });
  }
}

function t228_createMobileMenu(recid){
  var window_width=$(window).width(),
      el=$("#rec"+recid),
      menu=el.find(".t228"),
      burger=el.find(".t228__mobile");
  burger.click(function(e){
    menu.fadeToggle(300);
    $(this).toggleClass("t228_opened")
  })
  $(window).bind('resize', t_throttle(function(){
    window_width=$(window).width();
    if(window_width>980){
      menu.fadeIn(0);
    }
  }, 200));
}
 
function  t431_createTable(recid,tablehead,tabledata,tablecolsize,hastargetblank,btnstyles,t431__tdstyles,t431__thstyles,t431__oddrowstyles,t431__evenrowstyles){
	var t431__arrayColSize = t431_parseData(tablecolsize);
	var t431__arrayHead = t431_parseData(tablehead);
    var t431__arrayData = t431_parseData(tabledata);

	var t431__maxcolnumber = t431__findMaxRowLengthInTable(t431__arrayHead,t431__arrayData);
	var t431__colWidth = t431__setColumnsWidth(t431__arrayColSize,t431__maxcolnumber,recid);
	if (t431__colWidth[0].myText && t431__colWidth[0].myText[t431__colWidth[0].myText.length - 1] == "%") {
		for (var i=0; i<t431__colWidth.length; i++) {
			t431__colWidth[i].myText = t431__colWidth[i].myText.slice(0,-1);
			t431__colWidth[i].myText += "vw";
		}
	}

	var t431__container = $('#rec'+recid+' .t431 .t-container .t431__table');
	var t431__htmlTable = "";
	if (t431__arrayHead) { t431__htmlTable += t431__generateHtml(recid,t431__arrayHead,"th",hastargetblank,t431__colWidth,btnstyles,t431__thstyles,null,null,t431__maxcolnumber);}
	t431__container.append(t431__htmlTable);
	t431__htmlTable = "";
	if (t431__arrayData) { t431__htmlTable += t431__generateHtml(recid,t431__arrayData,"td",hastargetblank,t431__colWidth,btnstyles,t431__tdstyles,t431__oddrowstyles,t431__evenrowstyles,t431__maxcolnumber);}
    t431__container.append(t431__htmlTable);
};


/*add display:block to thead and tbody for vertical scroll, set th width to fix unequal col width*/
function t431_setHeadWidth(recid) {
  if ($(window).width() > 960) {
    var tBody = $('#rec' + recid + ' .t431 .t431__tbody');
    var tHead = $('#rec' + recid + ' .t431 .t431__thead');
    tBody.css("display", "block");
    tHead.css("display", "block");

    var colWidth = $('#rec' + recid + ' .t431 .t431__tbody tr:first').children().map(function() {
      return $(this).width();
    });

    var vBorder = "";
    if ($('#rec' + recid + ' .t431 .t431__tbody tr td:first').css('border-left-width').length >= 3) {
      vBorder = $('#rec' + recid + ' .t431 .t431__tbody tr td:first').css('border-left-width').slice(0, -2);
    }

    $('#rec' + recid + ' .t431 .t431__thead tr').children().each(function(i, el) {
      if ($(el).is(":last-child")) {
        $(el).width(colWidth[i] + (tBody.width() - $('#rec' + recid + ' .t431 .t431__tbody tr:first').width()));
      } else {
        $(el).width(colWidth[i] + (+vBorder));
      }
    });
  }
}

function t431__findMaxRowLengthInTable(arrayHead, arrayData) {
  var headMaxLength = 0;
  var dataMaxLength = 0;
  if (arrayHead) {
    headMaxLength = t431__findMaxRowLengInArray(arrayHead);
  }
  if (arrayData) {
    dataMaxLength = t431__findMaxRowLengInArray(arrayData);
  }
  if (dataMaxLength > headMaxLength) {
    return dataMaxLength;
  } else {
    return headMaxLength;
  }
}

function t431__findMaxRowLengInArray(curArray) {
  var maxLength = 0;
  for (var i = 0; i < curArray.length; i++) {
    if (curArray[i].length > maxLength) {
      maxLength = curArray[i].length;
    }
  }
  return maxLength;
}

function t431__setColumnsWidth(colWidth, colsNumber, recid) {
  if (colWidth) {
    return colWidth[0];
  } else {
    var tableWidth = $('#rec' + recid + ' .t431 .t-container .t-col').width();
    return (tableWidth / colsNumber + "px");
  }
}

function t431__generateHtml(recid,arrayValues,coltag,hastargetblank,colWidth,btnstyles,colstyles,oddrowstyles,evenrowstyles,maxcolnumber) {
	var t431__htmlpart = "";


	if (coltag == "td") {
		var t431__theadorbodytag = "tbody";
	} else {
		var t431__theadorbodytag = "thead";
	}
	t431__htmlpart += "<" + t431__theadorbodytag + " class=\"t431__" + t431__theadorbodytag + "\">";

	/*remove forst body row top border, if table head has bottom border*/
	if($('#rec'+recid+' .t431 .t-container .t431__thead th').length>0 && $('#rec'+recid+' .t431 .t-container .t431__thead th').css("border-bottom-width")[0]!="0") {
		var t431__firstbodyrowstyle = "border-top: 0 !important;";
	}

	for (var i=0; i<arrayValues.length; i++) {

		/*add classes for striped table*/
		if (coltag == "td") {
			if ((i + 1) % 2 > 0) {
				t431__htmlpart += "<tr class=\"t431__oddrow\"" + "style=\"" + oddrowstyles + "\">";
			} else { t431__htmlpart += "<tr class=\"t431__evenrow\"" + "style=\"" + evenrowstyles + "\">";}
		} else {
			t431__htmlpart += "<tr>";
		}

		var t431__addingcols = 0;
		if (arrayValues[i].length<maxcolnumber) {
			t431__addingcols = maxcolnumber - arrayValues[i].length;
        }
		for (var j=0; j<(arrayValues[i].length + t431__addingcols); j++) {
			if (arrayValues[i][j]) {
				/*define col width*/
                if(Array.isArray(colWidth) && colWidth[j]) {
                    var t431__curWidth = colWidth[j].myText;
                } else { var t431__curWidth = colWidth;}

				 if (i==0 && coltag=="td") {
					var t431__colwithattr = "<" + coltag + " class=\"t431__" + coltag + "\" style=\"width:" + t431__curWidth + ";" + colstyles + t431__firstbodyrowstyle + "\">";
				} else {
					var t431__colwithattr = "<" + coltag + " class=\"t431__" + coltag + "\" style=\"width:" + t431__curWidth + ";" + colstyles + "\">";
				}

                if (arrayValues[i][j].myHref) {
                    var t431__tblank = "";
                    if (hastargetblank) {var t431__tblank = "target=\"_blank\"";}
                    /*define link type*/
                    if (arrayValues[i][j].myHrefType == "link") {
                        var t431__linkwithattr = "<a href=\"" + arrayValues[i][j].myHref + "\"" + t431__tblank + ">";
                        var t431__linkclosetag = "</a>";
                    } else {
                        var t431__linkwithattr = "<div class=\"t431__btnwrapper\"><a href=\"" + arrayValues[i][j].myHref + "\"" + t431__tblank + " class=\"t-btn t-btn_sm\" style=\"" + btnstyles + "\"><table style=\"width:100%; height:100%;\"><tr><td>";
                        var t431__linkclosetag = "</td></tr></table></a></div>";
                    }
                    t431__htmlpart += t431__colwithattr + t431__linkwithattr + arrayValues[i][j].myText + t431__linkclosetag + "</" + coltag + ">";
                } else {
                    t431__htmlpart += t431__colwithattr + arrayValues[i][j].myText + "</" + coltag + ">";
                }
			} else {
					t431__htmlpart += "<" + coltag + " class=\"t431__" + coltag + "\" style=\"width:" + t431__curWidth + ";" + colstyles + "\">" + "</" + coltag + ">";
			}
		}
		t431__htmlpart += "</tr>";
	}
	t431__htmlpart += "</" + t431__theadorbodytag + ">";
	return t431__htmlpart;
};

function t431_parseData(data) {
  if (data !== "" && typeof data != "undefined") {
    data = t431__addBrTag(data);
    var arrayTable = [];
    var arrayRow = [];
    var curItem = { myText: "", myHref: "", myHrefType: "" };
    var hasLink = "";
    var hasLinkWithSpace = "";
    var hasBtn = "";
    var hasBtnWithSpace = "";
    var endLine = "";
    for (var i = 0; i < data.length; i++) {
      /*col end and check of special symbols: «>», «<», «&&#187; and « »*/
      if (data[i] == ";" && !(data.slice(i - 4, i) == "&lt;" || data.slice(i - 4, i) == "&gt;" || data.slice(i - 5, i) == "&amp;" || data.slice(i - 6, i) == "&nbsp;")) {
        arrayRow.push(curItem);
        curItem = { myText: "", myHref: "" };
        hasLink = "";
        hasLinkWithSpace = "";
        hasBtn = "";
        hasBtnWithSpace = "";
      } else {
        if (hasLink == "link=" || hasLinkWithSpace == " link=" || hasBtn == "button=" || hasBtnWithSpace == " button=") {
          if (curItem.myHref === "" && hasLink === "link=") {
            curItem.myText = curItem.myText.slice(0, -5);
            curItem.myHrefType = "link";
          } else {
            if (curItem.myHref === "" && hasLinkWithSpace === " link=") {
              curItem.myText = curItem.myText.slice(0, -6);
              curItem.myHrefType = "link";
            } else {
              if (curItem.myHref === "" && hasBtn === "button=") {
                curItem.myText = curItem.myText.slice(0, -7);
                curItem.myHrefType = "btn";
              } else {
                if (curItem.myHref === "" && hasBtnWithSpace === " button=") {
                  curItem.myText = curItem.myText.slice(0, -8);
                  curItem.myHrefType = "btn";
                }
              }
            }
          }
          curItem.myHref += (data[i]);
        } else {
          curItem.myText += (data[i]);
          hasLink = t431__checkSubstr("link=", hasLink, data[i]);
          hasLinkWithSpace = t431__checkSubstr(" link=", hasLinkWithSpace, data[i]);
          hasBtn = t431__checkSubstr("button=", hasBtn, data[i]);
          hasBtnWithSpace = t431__checkSubstr(" button=", hasBtnWithSpace, data[i]);
        }
        endLine = t431__checkSubstr("<br />", endLine, data[i]);
        if (endLine == "<br />") {
          if (curItem.myHref) {
            curItem.myHref = curItem.myHref.slice(0, -6);
          } else {
            curItem.myText = curItem.myText.slice(0, -6);
          }
          arrayRow.push(curItem);
          arrayTable.push(arrayRow);
          curItem = { myText: "", myHref: "" };
          hasLink = "";
          hasLinkWithSpace = "";
          hasBtn = "";
          hasBtnWithSpace = "";
          arrayRow = [];
        }
      }
    }
    if (arrayRow.length > 0 || curItem.myText !== "") {
      if (curItem !== "") {
        arrayRow.push(curItem);
      }
      arrayTable.push(arrayRow);
    }
  }
  return arrayTable;
}

/* checking a step by step combining of t431__targetSubstr*/
function t431__checkSubstr(targetSubstr, curSubstr, curSymbol) {
  if (!curSubstr && curSymbol == targetSubstr[0]) {
    return curSymbol;
  } else {
    if (curSubstr) {
      for (var i = 0; i < (targetSubstr.length - 1); i++) {
        if (curSubstr[curSubstr.length - 1] == targetSubstr[i] && curSymbol == targetSubstr[i + 1]) {
          return (curSubstr += curSymbol);
        }
      }
    }
  }
}

function t431__addBrTag(oldStringItem) {
  var newStringItem = "";
  for (var i = 0; i < oldStringItem.length; i++) {
    if (oldStringItem[i] == "\n" || oldStringItem[i] == "\r") {
      newStringItem += "<br />";
    } else {
      newStringItem += oldStringItem[i];
    }
  }

  return newStringItem;
}
 
function t456_setListMagin(recid,imglogo){
	if($(window).width()>980){		
        var t456__menu = $('#rec'+recid+' .t456');        
        var t456__leftpart=t456__menu.find('.t456__leftwrapper');
        var t456__listpart=t456__menu.find('.t456__list');		
		if (imglogo){
			t456__listpart.css("margin-right",t456__leftpart.width());
		} else {
			t456__listpart.css("margin-right",t456__leftpart.width()+30);        
		}		        
	}
}

function t456_highlight(){
  var url=window.location.href;
  var pathname=window.location.pathname;
  if(url.substr(url.length - 1) == "/"){ url = url.slice(0,-1); }
  if(pathname.substr(pathname.length - 1) == "/"){ pathname = pathname.slice(0,-1); }
  if(pathname.charAt(0) == "/"){ pathname = pathname.slice(1); }
  if(pathname == ""){ pathname = "/"; }
  $(".t456__list_item a[href='"+url+"']").addClass("t-active");
  $(".t456__list_item a[href='"+url+"/']").addClass("t-active");
  $(".t456__list_item a[href='"+pathname+"']").addClass("t-active");
  $(".t456__list_item a[href='/"+pathname+"']").addClass("t-active");
  $(".t456__list_item a[href='"+pathname+"/']").addClass("t-active");
  $(".t456__list_item a[href='/"+pathname+"/']").addClass("t-active");
}


function t456_checkAnchorLinks(recid) {
    if ($(window).width() >= 960) {
        var t456_navLinks = $("#rec" + recid + " .t456__list_item a:not(.tooltipstered)[href*='#']");
        if (t456_navLinks.length > 0) {
            t456_catchScroll(t456_navLinks);
        }
    }
}

function t456_catchScroll(t456_navLinks) {
    var t456_clickedSectionId = null,
        t456_sections = new Array(),
        t456_sectionIdTonavigationLink = [],
        t456_interval = 100,
        t456_lastCall, t456_timeoutId;
    t456_navLinks = $(t456_navLinks.get().reverse());
    t456_navLinks.each(function() {
        var t456_cursection = t456_getSectionByHref($(this));
        if (typeof t456_cursection.attr("id") != "undefined") {
            t456_sections.push(t456_cursection);
        }
        t456_sectionIdTonavigationLink[t456_cursection.attr("id")] = $(this);
    });

		$(window).bind('resize', t_throttle(function(){t456_updateSectionsOffsets(t456_sections);}, 200));
		$('.t456').bind('displayChanged',function(){t456_updateSectionsOffsets(t456_sections);});
		setInterval(function(){t456_updateSectionsOffsets(t456_sections);},5000);
    setTimeout(function(){
			t456_updateSectionsOffsets(t456_sections);
			t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId);
		},1000);

    t456_navLinks.click(function() {
        if (!$(this).hasClass("tooltipstered")) {
            t456_navLinks.removeClass('t-active');
            t456_sectionIdTonavigationLink[t456_getSectionByHref($(this)).attr("id")].addClass('t-active');
            t456_clickedSectionId = t456_getSectionByHref($(this)).attr("id");
        }
    });
    $(window).scroll(function() {
        var t456_now = new Date().getTime();
        if (t456_lastCall && t456_now < (t456_lastCall + t456_interval)) {
            clearTimeout(t456_timeoutId);
            t456_timeoutId = setTimeout(function() {
                t456_lastCall = t456_now;
                t456_clickedSectionId = t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId);
            }, t456_interval - (t456_now - t456_lastCall));
        } else {
            t456_lastCall = t456_now;
            t456_clickedSectionId = t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId);
        }
    });
}


function t456_updateSectionsOffsets(sections){
	$(sections).each(function(){
		var t456_curSection = $(this);
		t456_curSection.attr("data-offset-top",t456_curSection.offset().top);
	});
}


function t456_getSectionByHref(curlink) {
    var t456_curLinkValue = curlink.attr("href").replace(/\s+/g, '');
    if (curlink.is('[href*="#rec"]')) {
        return $(".r[id='" + t456_curLinkValue.substring(1) + "']");
    } else {
        return $(".r[data-record-type='215']").has("a[name='" + t456_curLinkValue.substring(1) + "']");
    }
}

function t456_highlightNavLinks(t456_navLinks, t456_sections, t456_sectionIdTonavigationLink, t456_clickedSectionId) {
    var t456_scrollPosition = $(window).scrollTop(),
        t456_valueToReturn = t456_clickedSectionId;
    /*if first section is not at the page top (under first blocks)*/
    if (t456_sections.length != 0 && t456_clickedSectionId == null && t456_sections[t456_sections.length-1].attr("data-offset-top") > (t456_scrollPosition + 300)){
      t456_navLinks.removeClass('t-active');
      return null;
    }

    $(t456_sections).each(function(e) {
        var t456_curSection = $(this),
            t456_sectionTop = t456_curSection.attr("data-offset-top"),
            t456_id = t456_curSection.attr('id'),
            t456_navLink = t456_sectionIdTonavigationLink[t456_id];
        if (((t456_scrollPosition + 300) >= t456_sectionTop) || (t456_sections[0].attr("id") == t456_id && t456_scrollPosition >= $(document).height() - $(window).height())) {
            if (t456_clickedSectionId == null && !t456_navLink.hasClass('t-active')) {
                t456_navLinks.removeClass('t-active');
                t456_navLink.addClass('t-active');
                t456_valueToReturn = null;
            } else {
                if (t456_clickedSectionId != null && t456_id == t456_clickedSectionId) {
                    t456_valueToReturn = null;
                }
            }
            return false;
        }
    });
    return t456_valueToReturn;
}

function t456_setPath(){
}

function t456_setBg(recid){
  var window_width=$(window).width();
  if(window_width>980){
    $(".t456").each(function() {
      var el=$(this);
      if(el.attr('data-bgcolor-setbyscript')=="yes"){
        var bgcolor=el.attr("data-bgcolor-rgba");
        el.css("background-color",bgcolor);
      }
      });
      }else{
        $(".t456").each(function() {
          var el=$(this);
          var bgcolor=el.attr("data-bgcolor-hex");
          el.css("background-color",bgcolor);
          el.attr("data-bgcolor-setbyscript","yes");
      });
  }
}

function t456_appearMenu(recid) {
      var window_width=$(window).width();
      if(window_width>980){
           $(".t456").each(function() {
                  var el=$(this);
                  var appearoffset=el.attr("data-appearoffset");
                  if(appearoffset!=""){
                          if(appearoffset.indexOf('vh') > -1){
                              appearoffset = Math.floor((window.innerHeight * (parseInt(appearoffset) / 100)));
                          }

                          appearoffset=parseInt(appearoffset, 10);

                          if ($(window).scrollTop() >= appearoffset) {
                            if(el.css('visibility') == 'hidden'){
                                el.finish();
                                el.css("top","-50px");
                                el.css("visibility","visible");
                                el.animate({"opacity": "1","top": "0px"}, 200,function() {
                                });
                            }
                          }else{
                            el.stop();
                            el.css("visibility","hidden");
                          }
                  }
           });
      }

}

function t456_changebgopacitymenu(recid) {
  var window_width=$(window).width();
  if(window_width>980){
    $(".t456").each(function() {
      var el=$(this);
      var bgcolor=el.attr("data-bgcolor-rgba");
      var bgcolor_afterscroll=el.attr("data-bgcolor-rgba-afterscroll");
      var bgopacityone=el.attr("data-bgopacity");
      var bgopacitytwo=el.attr("data-bgopacity-two");
      var menushadow=el.attr("data-menushadow");
      if(menushadow=='100'){
        var menushadowvalue=menushadow;
      }else{
        var menushadowvalue='0.'+menushadow;
      }
      if ($(window).scrollTop() > 20) {
        el.css("background-color",bgcolor_afterscroll);
        if(bgopacitytwo=='0' || menushadow==' '){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }else{
        el.css("background-color",bgcolor);
        if(bgopacityone=='0.0' || menushadow==' '){
          el.css("box-shadow","none");
        }else{
          el.css("box-shadow","0px 1px 3px rgba(0,0,0,"+ menushadowvalue +")");
        }
      }
    });
  }
}

function t456_createMobileMenu(recid){
  var window_width=$(window).width(),
      el=$("#rec"+recid),
      menu=el.find(".t456"),
      burger=el.find(".t456__mobile");
  burger.click(function(e){
    menu.fadeToggle(300);
    $(this).toggleClass("t456_opened")
  });
  $(window).bind('resize', t_throttle(function(){
    window_width=$(window).width();
    if(window_width>980){
      menu.fadeIn(0);
    }
  }, 200));
} 
function t498_unifyHeights(recid) {
    $('#rec'+recid+' .t498 .t-container').each(function() {
        var t498__highestBox = 0;
        $('.t498__col', this).each(function(){
			var t498__curcol=$(this);
			var t498__curcolchild=t498__curcol.find('.t498__col-wrapper');
			if(t498__curcol.height() < t498__curcolchild.height())t498__curcol.height(t498__curcolchild.height());
            if(t498__curcol.height() > t498__highestBox)t498__highestBox = t498__curcol.height();
        });
        if($(window).width()>=960){
        	$('.t498__col',this).css('height', t498__highestBox);
        }else{
	        $('.t498__col',this).css('height', "auto");
        }
    });
};
 
function t533_equalHeight(recid){
  var el = $('#rec'+recid);
  el.find('.t533').css('visibility', 'visible');
  el.find('.t533__textwrapper').css('height','auto');
  $('#rec'+recid+' .t533__row').each(function() {
    var highestBox = 0;
    $('.t533__textwrapper', this).each(function(){
      if($(this).height() > highestBox)highestBox = $(this).height(); 
    });  
    if($(window).width()>=960 && $(this).is(':visible')){
      $('.t533__textwrapper',this).css('height', highestBox); 
    }else{
      $('.t533__textwrapper',this).css('height', "auto");    
    }
  });
}; 
function t569_init(recid){
  var el = $('#rec'+recid),
      line = el.find('.t569__line'),
      blocksnumber = el.find('.t569').attr('data-blocks-count'),
      t569_resize;

  if (blocksnumber=='4') {
    var cirqlenumber = 4;
  } else {
    var cirqlenumber = 8;
  }

  line.each(function() {
    var e = $(this).find('.t569__cirqle');
    for (i = 0; i < cirqlenumber; i++) {
      e.clone().insertAfter(e);
    }
  });
                      
  line.css('max-width', $('.t569__col').width() - $('.t569__bgimg').outerWidth());
                                 
  $(window).resize(function() {
    if (t569_resize) clearTimeout(t569_resize);
    t569_resize = setTimeout(function() {
      line.css('max-width', $('.t569__col').width() - $('.t569__bgimg').outerWidth());
    }, 200);        
  });
} 
function t585_init(recid){
  var el= $('#rec'+recid),
      toggler = el.find(".t585__header");
  
  toggler.click(function(){
    $(this).toggleClass("t585__opened");
    $(this).next().slideToggle();
    if(window.lazy=='y'){t_lazyload_update();}
  });
}
 
function t668_init(recid){
  var el= $('#rec'+recid),
      toggler = el.find(".t668__header");
  
  toggler.click(function(){
    $(this).toggleClass("t668__opened");
    $(this).next().slideToggle();
    if(window.lazy=='y'){t_lazyload_update();}
  });
}
 
function t678_onSuccess(t678_form){
	var t678_inputsWrapper = t678_form.find('.t-form__inputsbox');
    var t678_inputsHeight = t678_inputsWrapper.height();
    var t678_inputsOffset = t678_inputsWrapper.offset().top;
    var t678_inputsBottom = t678_inputsHeight + t678_inputsOffset;
	var t678_targetOffset = t678_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t678_target = t678_targetOffset - 200;
    }	else {
        var t678_target = t678_targetOffset - 100;
    }

    if (t678_targetOffset > $(window).scrollTop() || ($(document).height() - t678_inputsBottom) < ($(window).height() - 100)) {
        t678_inputsWrapper.addClass('t678__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);		
    } else {
        $('html, body').animate({ scrollTop: t678_target}, 400);
        setTimeout(function(){t678_inputsWrapper.addClass('t678__inputsbox_hidden');}, 400);
    }

	var successurl = t678_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }

}

 
function t690_onSuccess(t690_form){
	var t690_inputsWrapper = t690_form.find('.t-form__inputsbox');
    var t690_inputsHeight = t690_inputsWrapper.height();
    var t690_inputsOffset = t690_inputsWrapper.offset().top;
    var t690_inputsBottom = t690_inputsHeight + t690_inputsOffset;
	var t690_targetOffset = t690_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t690_target = t690_targetOffset - 200;
    }	else {
        var t690_target = t690_targetOffset - 100;
    }

    if (t690_targetOffset > $(window).scrollTop() || ($(document).height() - t690_inputsBottom) < ($(window).height()-100)) {
        t690_inputsWrapper.addClass('t690__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);                                                                                                                           
    } else {
        $('html, body').animate({ scrollTop: t690_target}, 400);
        setTimeout(function(){t690_inputsWrapper.addClass('t690__inputsbox_hidden');}, 400);
    }
                                                                                                                           
	var successurl = t690_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }
                                                                                                                           
} 
function t698_fixcontentheight(id){
        /* correct cover height if content more when cover height */
        var el = $("#rec" + id);
        var hcover=el.find(".t-cover").height();
        var hcontent=el.find("div[data-hook-content]").outerHeight();
        if(hcontent>300 && hcover<hcontent){
         var hcontent=hcontent+120;
         if(hcontent>1000){hcontent+=100;}
         console.log('auto correct cover height: '+hcontent);
         el.find(".t-cover").height(hcontent);
         el.find(".t-cover__filter").height(hcontent);
         el.find(".t-cover__carrier").height(hcontent);
         el.find(".t-cover__wrapper").height(hcontent);
         if($isMobile == false){
          setTimeout(function() {
           var divvideo=el.find(".t-cover__carrier");
           if(divvideo.find('iframe').length>0){
            console.log('correct video from cover_fixcontentheight');
      setWidthHeightYoutubeVideo(divvideo, hcontent+'px');
     }
    }, 2000);
   }
        }
 }

function t698_onSuccess(t698_form){
	var t698_inputsWrapper = t698_form.find('.t-form__inputsbox');
    var t698_inputsHeight = t698_inputsWrapper.height();
    var t698_inputsOffset = t698_inputsWrapper.offset().top;
    var t698_inputsBottom = t698_inputsHeight + t698_inputsOffset;
	var t698_targetOffset = t698_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t698_target = t698_targetOffset - 200;
    }	else {
        var t698_target = t698_targetOffset - 100;
    }

    if (t698_targetOffset > $(window).scrollTop() || ($(document).height() - t698_inputsBottom) < ($(window).height() - 100)) {
        t698_inputsWrapper.addClass('t698__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);		
    } else {
        $('html, body').animate({ scrollTop: t698_target}, 400);
        setTimeout(function(){t698_inputsWrapper.addClass('t698__inputsbox_hidden');}, 400);
    }

	var successurl = t698_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }

} 
function t718_onSuccess(t718_form){
	var t718_inputsWrapper = t718_form.find('.t-form__inputsbox');
    var t718_inputsHeight = t718_inputsWrapper.height();
    var t718_inputsOffset = t718_inputsWrapper.offset().top;
    var t718_inputsBottom = t718_inputsHeight + t718_inputsOffset;
	var t718_targetOffset = t718_form.find('.t-form__successbox').offset().top;

    if ($(window).width()>960) {
        var t718_target = t718_targetOffset - 200;
    }	else {
        var t718_target = t718_targetOffset - 100;
    }

    if (t718_targetOffset > $(window).scrollTop() || ($(document).height() - t718_inputsBottom) < ($(window).height() - 100)) {
        t718_inputsWrapper.addClass('t718__inputsbox_hidden');
		setTimeout(function(){
			if ($(window).height() > $('.t-body').height()) {$('.t-tildalabel').animate({ opacity:0 }, 50);}
		}, 300);
    } else {
        $('html, body').animate({ scrollTop: t718_target}, 400);
        setTimeout(function(){t718_inputsWrapper.addClass('t718__inputsbox_hidden');}, 400);
    }

	var successurl = t718_form.data('success-url');
    if(successurl && successurl.length > 0) {
        setTimeout(function(){
            window.location.href= successurl;
        },500);
    }

}
 
function t806__init(recid) {
  tvote__init(recid);
  var testWrap = $('#rec' + recid);
  var testContainer = testWrap.find('.t806');
  var rightAnswersCount;
  var testAnswers = testWrap.find('.t806__answers');
  var testBlock = testWrap.find('.t806__test');
  var testResultWrap = testWrap.find('.t806__result-wrap');
  var shareVK = testWrap.find('.t806__social-btn-vk');
  var shareFB = testWrap.find('.t806__social-btn-fb');
  var shareTwitter = testWrap.find('.t806__social-btn-twitter');
  var rightTestAnswers = [];
  var testImgSrc = [];
  var startTitle = testWrap.find('.t806__start-title').text();
  var startText = testWrap.find('.t806__start-text').text();
  var siteLocation = window.location.href;

  testBlock.addClass('t806__counter');
  testBlock.attr('data-count', 0);

  testResultWrap.each(function(i) {
    if ($(testResultWrap[i]).find('img').attr('src') !== '') {
      testImgSrc.push($(testResultWrap[i]).find('img').attr('src'));
    }
  });

  if (testImgSrc.length == 1) {
    testResultWrap.each(function(i) {
      $(testResultWrap[i]).find('img').attr('src', testImgSrc[0]);
      $(testResultWrap[i]).find('.t806__result-desc').removeClass('t806__result-desc_withoutimg');
      $(testResultWrap[i]).find('.t806__result-count, .t806__result-variant').css('color', '#ffffff');
    });
  }

  testAnswers.each(function() {
    rightTestAnswers.push($(this).attr('data-right-answer'));

    $(this).removeAttr('data-right-answer');
  });

  t806__changeRadio(recid, rightTestAnswers);
  t806__changeTestInput(recid);
  t806__startClickBtn(recid);
  t806__checkClickBtn(recid, rightTestAnswers);
  t806__nextClickBtn(recid);
  t806__resultClickBtn(recid);
  t806__restartClickBtn(recid, rightTestAnswers);

  shareVK.click(function() {t806_shareVK(recid, startTitle, siteLocation)});
  shareFB.click(function() {t806_shareFB(recid, startTitle, startText, siteLocation)});
  shareTwitter.click(function() {t806_shareTwitter(recid, startTitle, siteLocation)});

  t806__clearFormOnBackClick(testWrap);
}


function t806_scrollToTop(testBlock) {
  var topCoordinate = testBlock.offset().top;
  $('html, body').animate({
    scrollTop: topCoordinate
  }, 0);
}


function t806__clearFormOnBackClick(testWrap) {
  window.addEventListener('pagehide', function() {
    testWrap.find('.t806__input').prop('checked' , false);
  });
}


function t806__startClickBtn(test) {
  var testWrap = $('#rec' + test);
  var questionFirst = 1;
  var testBtnStart = testWrap.find('.t806__start-btn');

  testBtnStart.on('click', function (e) {
    var testStart = $(this).parents('.t806__start');

    testStart.hide();
    testStart.next().show();
    t806__showNumber(test, questionFirst);

    t806_fixcontentheight(test);
    t806_scrollToTop(testWrap);

    if (typeof $(".t-records").attr("data-tilda-mode")=="undefined") {
        if(window.lazy=='y'){t_lazyload_update();}
    }

    e.preventDefault();
  });
}


function t806__changeRadio(test, rightansw) {
  var testBlock = $('#rec' + test);
  var testInput = testBlock.find('.t806__input[type="radio"]');
  var lastQuestion = testBlock.find('.t806__question').last();

  lastQuestion.addClass('t806__lastquestion');

  testInput.change(function () {
    var rightAnswersCount = testBlock.find('.t806__counter').attr('data-count');
    var testItem = $(this).parents('#rec' + test + ' .t806__question');
    var testAnswers = $(this).parents('#rec' + test + ' .t806__answers');
    var answerVote = $(this).parents('#rec' + test + ' .t806__answers').find('.t806__answer .t-vote__btn-res');
    var currentRightAnswer = rightansw[testItem.attr('data-question-num') - 1];

    if ($(this).attr('type') === 'radio') {
      var checkedRadio = $(this).val();

      testAnswers.addClass('t806__answers_answered');

      if (testItem.hasClass('t806__lastquestion')) {
        testAnswers.siblings('.t806__btn-wrapper').find('.t806__btn_result').addClass('t806__btn_show');
      } else {
        testAnswers.siblings('.t806__btn-wrapper').find('.t806__btn_next').addClass('t806__btn_show');
      }

      testItem.find('.t806__input').attr('disabled', true);

      if (+checkedRadio === +currentRightAnswer) {
        rightAnswersCount++;
        testBlock.find('.t806__counter').attr('data-count', rightAnswersCount);
      }

      if (+testItem.find('.t806__input:checked').val() !== +currentRightAnswer) {
        testItem.find('.t806__input:checked').parents('.t806__answer').addClass('t806__answer_wrong');
      }
      testItem.find('.t806__input:checked').parent().siblings('.t806__details').show();

      testItem.find('.t806__input[value="' + currentRightAnswer + '"]').parents('.t806__answer').addClass('t806__answer_correct');

      answerVote.addClass('t806__answer-vote_show');

      testItem.find('.t806__input:checked').parents('.t806__answer_correct').addClass('t806__answer_withoutopacity');
      testItem.find('.t806__input[type="radio"]').parents('.t806__answer_correct').addClass('t806__answer_withoutopacity');
    }

    t806_fixcontentheight(test);
  });
}


function t806__changeTestInput(test) {
  var testBlock = $('#rec' + test);
  var testInput = testBlock.find('.t806__input[type="checkbox"]');
  var lastQuestion = testBlock.find('.t806__question').last();
  var checkedAnswerCheck = [];

  testBlock.find('.t806__answers').attr('data-test-checked', '');

  lastQuestion.addClass('t806__lastquestion');

  testInput.change(function () {
    var testAnswers = $(this).parents('#rec' + test + ' .t806__answers');

    if ($(this).attr('type') === 'checkbox') {
      testAnswers.siblings('.t806__btn-wrapper').find('.t806__btn_check').addClass('t806__btn_show');
    }

    if ($(this).attr('type') === 'checkbox' && $(this).is(':checked') && checkedAnswerCheck.indexOf($(this).val()) === -1) {
      checkedAnswerCheck.push($(this).val());
    }

    if ($(this).attr('type') === 'checkbox' && !$(this).is(":checked")) {
      checkedAnswerCheck.splice(checkedAnswerCheck.indexOf($(this).val()), 1);
    }

    testAnswers.attr('data-test-checked', checkedAnswerCheck.join(','));

    t806_fixcontentheight(test);
  });

  return checkedAnswerCheck;
}


function t806__checkClickBtn(test, rightansw) {
  var rightChecked = false;
  var testBlock = $('#rec' + test);
  var testBtnCheck = testBlock.find('.t806__btn_check');
  var testInput = testBlock.find('.t806__input');
  var checkedAnswersTruth = [];

  testBtnCheck.on('click', function (e) {
    var rightAnswersCount = testBlock.find('.t806__counter').attr('data-count');
    var testItem = $(this).parents('#rec' + test + ' .t806__question');
    var testAnswers = $(this).parents('#rec' + test + ' .t806__question').find('.t806__answers');
    var answerVote = $(this).parents('.t806__btn-wrapper').siblings('#rec' + test + ' .t806__answers').find('.t806__answer .t-vote__btn-res');
    var checkboxAnswersArr = [];
    var checkboxAnswers = rightansw[testItem.attr('data-question-num') - 1].split(',');
    var checkedAnswers = testAnswers.attr('data-test-checked').split(',');

    for (var i = 0; i < checkboxAnswers.length; i++) {
      checkboxAnswersArr.push(checkboxAnswers[i]);
    }

    testItem.find(testInput).attr('disabled', true);

    answerVote.addClass('t806__answer-vote_show');

    checkedAnswers.forEach(function (item, i) {
      var checkedCheckboxSort = checkedAnswers.sort();
      var checkboxAnswersArrSort = checkboxAnswersArr.sort();

      if (+checkedCheckboxSort[i] === +checkboxAnswersArrSort[i] && checkedCheckboxSort.length === checkboxAnswersArrSort.length) {
        checkedAnswersTruth.push(1);
      } else {
        checkedAnswersTruth.push(0);
      }
    });

    var rightChecked = checkedAnswersTruth.every(function(item) {
      return item == 1;
    });

    if (testItem.find(testInput).attr('type') === 'checkbox') {
      checkboxAnswersArr.forEach(function (item) {
        testItem.find('.t806__input[value="' + +item + '"]').parents('.t806__answer').addClass('t806__answer_correct');
      });

      checkedAnswers.forEach(function (item) {
        if (checkboxAnswersArr.indexOf(item) === -1) {
          testItem.find('.t806__input[value="' + +item + '"]:checked').parents('.t806__answer').addClass('t806__answer_wrong');
          testItem.find('.t806__input[value="' + +item + '"]').parent().siblings().show();
        }
      });
    }

    testItem.find('.t806__input:checked').parents('.t806__answer_correct').addClass('t806__answer_withoutopacity');

    if (rightChecked) {
      rightAnswersCount++;
      testBlock.find('.t806__counter').attr('data-count', rightAnswersCount);
    }

    checkedAnswersTruth = [];

    $(this).removeClass('t806__btn_show');

    if (testItem.hasClass('t806__lastquestion')) {
      $(this).parents('.t806__question').find('.t806__btn_result').addClass('t806__btn_show');
    } else {
      $(this).parents('.t806__question').find('.t806__btn_next').addClass('t806__btn_show');
    }

    testAnswers.addClass('t806__answers_answered');

    t806_fixcontentheight(test);

    if (typeof $(".t-records").attr("data-tilda-mode")=="undefined") {
        if(window.lazy=='y'){t_lazyload_update();}
    }

    testItem.find('.t806__input:checked').parent().siblings('.t806__details').show();
    t806__changeTestInput(test);

    e.preventDefault();
  });
}


function t806__nextClickBtn(test) {
  var testBlock = $('#rec' + test);
  var testBtnNext = testBlock.find('.t806__btn_next');
  var questionNumber;

  testBtnNext.on('click', function (e) {
    var parentTop = $(this).parents('#rec' + test + ' .t806').offset().top;
    var testItem = $(this).parents('#rec' + test + ' .t806__question');
    questionNumber = testItem.next().attr('data-question-num');

    testItem.hide();
    testItem.next().show();
    t806__showNumber(test, questionNumber);

    t806_fixcontentheight(test);
    t806_scrollToTop(testBlock);

    if (typeof $(".t-records").attr("data-tilda-mode")=="undefined") {
        if(window.lazy=='y'){t_lazyload_update();}
    }

    e.preventDefault();
  });
}


function t806__resultClickBtn(test) {
  var testBtnResult = $('#rec' + test + ' .t806__btn_result');
  var testBlock = $('#rec' + test);

  testBtnResult.on('click', function (e) {
    var parentTop = $(this).parents('#rec' + test + ' .t806__test').offset().top;
    var testItem = $(this).parents('#rec' + test + ' .t806__question');

    testItem.hide();
    t806_scrollToTop(testBlock);
    t806__showResult(test);

    t806_fixcontentheight(test);

    if (typeof $(".t-records").attr("data-tilda-mode")=="undefined") {
        if(window.lazy=='y'){t_lazyload_update();}
    }

    e.preventDefault();
  });
}


function t806__restartClickBtn(test, rightansw) {
  var testBlock = $('#rec' + test);
  var testContainer = testBlock.find('.t806');
  var testRestart = testBlock.find('.t806__btn_restart');
  var testItemAll = testBlock.find('.t806__question');

  testRestart.on('click', function (e) {
    testBlock.find('.t806__start').show();
    testBlock.find('.t806__result').hide();
    testBlock.find('.t806__btn_next').removeClass('t806__btn_show');
    testBlock.find('.t806__btn_result').removeClass('t806__btn_show');
    testBlock.find('.t806__btn_check').removeClass('t806__btn_show');
    testBlock.find('.t806__details').hide();
    testBlock.find('.t806__answers').removeClass('t806__answers_answered');
    testBlock.find('.t806__answers').attr('data-test-checked', '');
    testBlock.find('.t806__answer').removeClass('t806__answer_correct');
    testBlock.find('.t806__answer').removeClass('t806__answer_wrong');
    testBlock.find('.t806__input').parents('.t806__answer').removeClass('t806__answer_withoutopacity');
    testBlock.find('.t806__input').prop('checked' , false);
    testBlock.find('.t806__input').removeAttr('disabled');
    testBlock.find('.t806__answer .t-vote__btn-res').removeClass('t806__answer-vote_show');
    $('#rec' + test + ' .t806__counter').attr('data-count', 0);
    testBlock.find('.t806__number').text(1 + '/' + testItemAll.length);

    t806_fixcontentheight(test);

    if (testContainer.hasClass('t806__test-reload')) {
      document.location.reload(true);
    }

    e.preventDefault();
  });
}


function t806__showResult(test) {
  var testBlock = $('#rec' + test);
  var testContainer = testBlock.find('.t806');
  var fullResult = testBlock.find('.t806__result');
  var startImg = testBlock.find('.t806__start-img img');
  var fullResultLength = fullResult.length;
  var allResult;
  var resultLength = testBlock.find('.t806__result').length;
  var rightAnswersCount = $('#rec' + test).find('.t806__counter').attr('data-count');
  var testItemAll = $('#rec' + test + ' .t806__question');
  var resultCount = $('#rec' + test + ' .t806__result .t806__result-count');
  var resultPercent = rightAnswersCount != 0 ? rightAnswersCount / testItemAll.length * 100 : 0;

  resultCount.text(rightAnswersCount + '/' + testItemAll.length);

  if (resultPercent <= 100 * 1/fullResultLength) {
    testBlock.find('.t806__result_1').show();
  }

  for (var i = 0; i < fullResultLength; i++) {
    if (resultPercent > 100 * (i+1)/fullResultLength && resultPercent <= 100 * (i+2)/fullResultLength) {
      testBlock.find('.t806__result_' + (i + 2)).show();
    }
  }

  if (resultPercent > 100 * (fullResultLength - 1)/fullResultLength) {
    testBlock.find('.t806__result_' + fullResultLength).show();
  }

  var resultData = [];

  fullResult.each(function(i) {
    if ($(fullResult[i]).css('display') == 'block') {
      resultData[0] = $(fullResult[i]).find('.t806__result-variant').text()
      resultData[1] = $(fullResult[i]).find('.t806__result-count').text();

      resultData[2] = '';
      var img = $(fullResult[i]).find('.t806__result-wrap img');

      if (testContainer.hasClass('t806__test-reload')) {
        if (img.length != 0) {
          if (typeof window.lazy !== 'undefined') {
           resultData[2] = img.attr('data-original') || img.attr('src');
         } else {
           resultData[2] = img.attr('src');
         }
        }

        if (img.length == 0 && startImg.length != 0){
          if (typeof window.lazy !== 'undefined') {
           resultData[2] = startImg.attr('data-original') || img.attr('src');
         } else {
           resultData[2] = startImg.attr('src');
         }
        }
      }

      if (!testContainer.hasClass('t806__test-reload')) {
        if (img.length != 0) {
          resultData[2] = img.attr('src');
        }

        if (img.length == 0 && startImg.length != 0){
          resultData[2] = startImg.attr('src');
        }
      }

      resultData[3] = $(fullResult[i]).attr('data-quiz-result-number');
    }
  });

  return resultData;
}


function t806__showNumber(test, number) {
  var testItemNumber = $('#rec' + test + ' .t806__number');
  var testItemAll = $('#rec' + test + ' .t806__question');
  testItemNumber.html('<span>' + number + '</span>' + '<span>/</span>' + '<span>' + testItemAll.length + '</span>');
}


function t806_fixcontentheight(id) {
    /* correct cover height if content more when cover height */
  var el = $("#rec" + id);
  var hcover=el.find(".t-cover").height();
  var hcontent=el.find("div[data-hook-content]").outerHeight();
  if(hcontent>300 && hcover<hcontent){
     var hcontent=hcontent+120;
     if(hcontent>1000){hcontent+=100;}
     el.find(".t-cover").height(hcontent);
     el.find(".t-cover__filter").height(hcontent);
     el.find(".t-cover__carrier").height(hcontent);
     el.find(".t-cover__wrapper").height(hcontent);
     if($isMobile == false){
       setTimeout(function() {
         var divvideo=el.find(".t-cover__carrier");
         if(divvideo.find('iframe').length>0){
            setWidthHeightYoutubeVideo(divvideo, hcontent+'px');
         }
       }, 2000);
    }
  }
}


function t806_changeShareFBUrl(siteLocation, searchUrl) {
  var url = siteLocation.split('?')[0] + '?';
  var searchParametrs = decodeURIComponent(searchUrl.substring(1));
  var params = searchParametrs.split('&');

  params.forEach(function(item) {
    if (item.indexOf('fb_action_ids') == -1 && item.indexOf('fb_action_types')  == -1 && item.indexOf('result') == -1) {
      url = url + item + '&';
    }
  });

  url = url.substring(0, url.length - 1);
  return url;
}


function t806_shareVK(recid, ptitle, purl) {
  var dataForShare = t806__showResult(recid);
  var text = dataForShare[0];
  var count = dataForShare[1];
  var slash = (dataForShare[2] || "").indexOf('/') == 0 ? '' : '/';
  var urlPathname = window.location.pathname.length > 1 ? window.location.pathname : '';
  var img = (dataForShare[2] || "").indexOf('://') != -1 ? dataForShare[2] : window.location.protocol + '//' + window.location.host + urlPathname + slash + dataForShare[2];
  var resultNumber = dataForShare[3];
  var idUrl = recid + resultNumber + 'vk';
  
  var urlValueImg = 'https://vote.tildacdn.com/vote/2/share/index.php?text=' + text;
      urlValueImg += '&result=' + count;
      if ((dataForShare[2] || "").length > 0) {
        urlValueImg += '&url=' + img;
      }
      urlValueImg += '&id=' + idUrl;
      urlValueImg += '&social=vk' + '&name=' + ptitle;
      
  var value = $.ajax({
    url: urlValueImg,
    type: 'GET',
    async: false,
    data: {
      format: 'json'
    },
    error: function(e) {
      console.log('t806 error: ' + e);
    },
    complete: function(data) {
      var urlImg = (data.responseJSON.url || '').replace(/\?.*/, '');
      var shareUrl = window.location.href.indexOf('#') != -1 ? purl.split('#')[0] : purl;
      url = 'http://vkontakte.ru/share.php?url=' + shareUrl + '&title=' + ptitle + '&description=' + ptitle + '&image=' + urlImg + '&noparse=true';
      t806__openPopup(url);
    }
  });
}


function t806_shareFB(recid, ptitle, pdescr, purl) {
  var dataForShare = t806__showResult(recid);
  var text = dataForShare[0];
  var count = dataForShare[1];
  var slash = (dataForShare[2] || "").indexOf('/') == 0 ? '' : '/';
  var urlPathname = window.location.pathname.length > 1 ? window.location.pathname : '';
  var img = (dataForShare[2] || "").indexOf('://') != -1 ? dataForShare[2] : window.location.protocol + '//' + window.location.host + urlPathname + slash + dataForShare[2];
  var resultNumber = dataForShare[3];
  var idUrl = recid + resultNumber + 'fb';
  var param = count.substring(0, count.indexOf('/')) + count.substring(count.indexOf('/') + 1);
  
  var urlValueImg = 'https://vote.tildacdn.com/vote/2/share/index.php?text=' + text;
      urlValueImg += '&result=' + count;
      if ((dataForShare[2] || "").length > 0) {
          urlValueImg += '&url=' + img;
      }
      urlValueImg += '&id=' + idUrl;
      urlValueImg += '&social=fb' + '&name=' + ptitle;
      
  var value = $.ajax({
    url: urlValueImg,
    type: 'GET',
    async: false,
    data: {
      format: 'json'
    },
    error: function(e) {
      console.log('t806 error: ' + e);
    },
    complete: function(data) {
      var urlImg = data.responseJSON.url;
      var searchUrl = window.location.search;
      purl = (searchUrl !== '' ? t806_changeShareFBUrl(purl, searchUrl) : purl) + '?result=' + param;

      FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        action_properties: JSON.stringify({
        object: {
            'og:url': purl
          }
        })
      });
    }
  });
}


function t806_shareTwitter(recid, ptitle, purl) {
  var dataForShare = t806__showResult(recid);
  var testWrap = $('#rec' + recid);
  var testContainer = testWrap.find('.t806');
  var text = dataForShare[0];
  var count = dataForShare[1];
  var img = dataForShare[2];

  var resultCount = count.substring(0, count.indexOf('/'));
  var allCount = count.substring(count.indexOf('/') + 1)

  var result;

  if (testContainer.hasClass('t806__ru')) {
    result = 'Мой результат: ' + resultCount + ' из ' + allCount + '. ' + text;
  }
  if (testContainer.hasClass('t806__en')) {
    result = 'My result: ' + resultCount + ' out of ' + allCount + '. ' + text;
  }
  
  purl = purl.replace(/&/g, '%26');

  url = 'https://twitter.com/share?url=' + purl + '&text=' + result;
  url = encodeURI(url);

  t806__openPopup(url);
}


function t806__openPopup(url) {
  window.open(url,'','toolbar=0,status=0,width=626,height=436');
}
 
function t860_init(recid) {
  var rec = $('#rec' + recid);
  var container = rec.find('.t860');
  var doResize;

  t860_unifyHeights(rec);
  t860_translateBlock(rec);

  $(window).resize(function() {
    clearTimeout(doResize);
    doResize = setTimeout(function() {
      t860_unifyHeights(rec);
      t860_translateBlock(rec);
    }, 200);
  });

  $(window).load(function() {
    t860_unifyHeights(rec);
    t860_translateBlock(rec);
  });

  $('.t860').bind('displayChanged', function() {
    t860_unifyHeights(rec);
    t860_translateBlock(rec);
  });

  if (container.hasClass('t860__previewmode')) {
    setInterval(function() {
      t860_unifyHeights(rec);
      t860_translateBlock(rec);
    }, 5000);
  }
}


function t860_translateBlock(rec) {
  var blockHover = rec.find('.t860__block_hover');
  var wrapMarginBottom = 30;

  if ($(window).width() > 1024) {
    blockHover.each(function() {
      var $this = $(this);
      var colWrapHeight = $this.parents('.t860__inner-col').height();
      var wrapHeight = $this.find('.t860__show').outerHeight();
      var diff = colWrapHeight - 2 * wrapHeight - wrapMarginBottom / 2;
      $this.css('transform', 'translateY(' + diff + 'px)');
    });
  }
}


function t860_unifyHeights(rec) {
  if ($(window).width() >= 960) {
    rec.find('.t860 .t-container .t860__row').each(function() {
      var highestBox = 0;
      var currow = $(this);
      $('.t860__inner-col', this).each(function() {
        var col = $(this);
        var text = col.find('.t860__wrap');
        var colHeight = text.outerHeight();
        if (colHeight > highestBox) {highestBox = colHeight;}
      });
      $('.t860__inner-col', this).css('height', highestBox);
    });
  } else {
    $('.t860__inner-col').css('height', 'auto');
  }
}
