(function() {
    var orign = {
            year: 1900,
            mouth: 1,
            day: 1,
            date: 1
        }
        //判断是否是闰年
    function isLeap(y) {
        return y % 4 == 0 && y % 100 || y % 400 == 0 ? 1 : 0;
    }
    // 计算该年某月天数
    function monthDay(y, m) {
        switch (m) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 4:
            case 6:
            case 9:
            case 11:
                return 30;
            case 2:
                return 28 + isLeap(y);
        }
    }
    function addClass(obj,name){
        if(obj.className.search(name)==-1){
            if(obj.className)
                obj.className+=" "+name;
            else
                obj.className=name;
        }
    }
    function removeClass(obj,name){
        if(obj.className){
            var reg=new RegExp("(\\s|^)"+name+"(\\s|$)")
            obj.className=obj.className.replace(reg,"");
        } 
    }
    // 生成年的选择和选择今天
    (function(){
    	var year=document.getElementById("year");
    	var month=document.getElementById("month");
    	var d=new Date();
    	for(var i=1900;i<=2050;i++){
    		var option=document.createElement("option")
    		option.innerHTML=i+"年"
    		if(d.getFullYear()==i){
    			option.selected=true;
    		}
    		year.appendChild(option);
    	}
    	for(var i=1;i<=12;i++){
    		var option=document.createElement("option")
    		option.innerHTML=i+"月"
    		if(d.getMonth()+1==i){
    			option.selected=true;
    		}
    		month.appendChild(option);
    	}
    })();
    function setDate() {
        var year = document.getElementById("year");
        var month = document.getElementById("month");
        var cal = document.getElementById("calendar");
        var calTab = cal.getElementsByTagName("table")[0];
        var indexY = year.selectedIndex;
        var indexM = month.selectedIndex;
        var y = parseInt(year.options[indexY].text);
        var m = parseInt(month.options[indexM].text);
        var sumDay = 0;
        for (var i = orign.year; i < y; i++) {
            sumDay += 365 + isLeap(i);
            sumDay %= 7;
        }
        for (var i = 1; i < m; i++) {
            sumDay += monthDay(y, i);
            sumDay %= 7;
        }
        var nowDate = (sumDay + orign.date) % 7;
        nowDate = nowDate ? nowDate : 7;
        var lastM = (m + 11) % 12;
        lastM = lastM ? lastM : 12;
        var lastMDay = monthDay(y, lastM);
        for (var i = 0; i < nowDate; i++) {
        	var c=calTab.children[0].children[1].children[i];
            c.children[0].innerHTML = lastMDay + i - nowDate + 2;
            c.children[0].className="ntm";
            c.children[1].className="ntm";
        }
        var mDay = monthDay(y, m);
        var p, q, n, f;
        for (p = 1, n = 1, f = nowDate - 1; n <= mDay; p++, f = 0) {
            for (q = f; q < 7 && n <= mDay; q++) {
            	var c=calTab.children[0].children[p].children[q];
                c.children[0].innerHTML = n++;
                c.children[0].className="";
            	c.children[1].className="";
            	if(q==5||q==6){
            		c.children[0].className="red";
            	}
            }
        }
        var nextM = (m + 1) % 12;
        var nextMDay = monthDay(y, nextM + 1);
        n = 1;
        for (var i = p - 1, f = q; i <= 6; i++, f = 0) {
            for (var j = f; j < 7; j++) {
            	var c=calTab.children[0].children[i].children[j];
                c.children[0].innerHTML = n++;
                c.children[0].className="ntm";
            	c.children[1].className="ntm";
            }
        }
    }
    var cal = document.getElementById("calendar");
    var aSel = cal.getElementsByTagName("select");
    for (var i = 0; i < aSel.length; i++) {
        aSel[i].onchange = setDate;
    }
    setDate();
})();
