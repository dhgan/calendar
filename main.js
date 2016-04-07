(function() {
    var orign = {
            year: 1900,
            mouth: 1,
            date: 1,
            day: 1
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

    function addClass(obj, name) {
        if (obj.className.search(name) == -1) {
            if (obj.className)
                obj.className += " " + name;
            else
                obj.className = name;
        }
    }

    function removeClass(obj, name) {
        if (obj.className) {
            var reg = new RegExp("(\\s|^)" + name + "(\\s|$)")
            obj.className = obj.className.replace(reg, "");
        }
    }
    // 生成年和月的选择和选择本年本月
    (function() {
        var year = document.getElementById("year");
        var month = document.getElementById("month");
        var d = new Date();
        var flag = 0;
        for (var i = 1900; i <= 2050; i++) {
            var option = document.createElement("option")
            option.innerHTML = i + "年"
            if (d.getFullYear() == i) {
                option.selected = true;
                flag = i - 1900;
            }
            year.appendChild(option);
        }
        for (var i = 1; i <= 12; i++) {
            var option = document.createElement("option")
            option.innerHTML = i + "月"
            if (d.getMonth() + 1 == i) {
                option.selected = true;
            }
            month.appendChild(option);
        }
    })();
    //1900.1.1到某天天数
    function orignToDay(y, m, d) {
        var sumDay = 0;
        for (var i = orign.year; i < y; i++) {
            sumDay += 365 + isLeap(i);
        }
        for (var i = 1; i < m; i++) {
            sumDay += monthDay(y, i);
        }
        for (var i = orign.day; i < d; i++) {
            sumDay += 1;
        }
        return sumDay;
    }

    function changeSelected(thisDate) {
        var flag = 1;
        for (var i = 1; i < 7; i++) {
            for (var j = 0; j < 7; j++) {
                var cal = document.getElementById("calendar");
                var calTab = cal.getElementsByTagName("table")[0];
                var c = calTab.children[0].children[i].children[j].children[0];
                removeClass(c, "selected");
                if (c.date == thisDate) {
                    addClass(c, "selected");
                    flag = 0;
                }
            }
        }
        if (flag) {
            var i = thisDate.lastIndexOf("-");
            changeSelected(thisDate.substring(0, i + 1) + 1);
        }
    }

    function addEvent(c) {
        c.onmouseover = function() {
            addClass(this, "active");
        }
        c.onmouseout = function() {
            removeClass(this, "active");
        }
        c.onclick = function() {
            var thisDate = this.date;
            var arr = this.date.split("-");
            if (parseInt(arr[0]) != 2051) {
                var year = document.getElementById("year");
                var month = document.getElementById("month");
                for (var i = 0; i < year.children.length; i++) {
                    if (parseInt(year.children[i].innerHTML) == parseInt(arr[0])) {
                        year.children[i].selected = true;
                        setDate();
                        break;
                    }
                }
                for (var i = 0; i < month.children.length; i++) {
                    if (parseInt(month.children[i].innerHTML) == parseInt(arr[1])) {
                        month.children[i].selected = true;
                        setDate();
                        break;
                    }
                }
            }
            changeSelected(thisDate);
        }
    }
    //更新日历
    function setDate() {
        var year = document.getElementById("year");
        var month = document.getElementById("month");
        var cal = document.getElementById("calendar");
        var calTab = cal.getElementsByTagName("table")[0];
        var indexY = year.selectedIndex;
        var indexM = month.selectedIndex;
        var y = parseInt(year.options[indexY].text);
        var m = parseInt(month.options[indexM].text);
        var sumDay = orignToDay(y, m, 1);
        var nowDay = (sumDay + orign.day) % 7;
        nowDay = nowDay ? nowDay : 7;
        var lastM = (m + 11) % 12;
        lastM = lastM ? lastM : 12;
        var lastY = lastM == 12 ? y - 1 : y;
        var lastMDay = monthDay(lastY, lastM);
        var td = new Date;
        var selectedDate = td.getDate();
        //上月
        for (var i = 0; i < nowDay - 1; i++) {
            var c = calTab.children[0].children[1].children[i].children[0];
            var d = lastMDay + i - nowDay + 2;
            if (c.className.search("selected") > -1) {
                selectedDate = c.date.split("-")[2];
            }
            c.date = lastY + "-" + lastM + "-" + d;
            c.className = "";
            c.children[0].innerHTML = d;
            c.children[0].className = "ntm";
            c.children[1].className = "ntm";
            addEvent(c);
        }
        //本月
        var mDay = monthDay(y, m);
        var p, q, n, f;
        for (p = 1, n = 1, f = nowDay - 1; n <= mDay; p++, f = 0) {
            for (q = f; q < 7 && n <= mDay; q++) {
                var c = calTab.children[0].children[p].children[q].children[0];
                if (c.className.search("selected") > -1) {
                    selectedDate = c.date.split("-")[2];
                }
                c.className = "";
                if (n == td.getDate() && m == td.getMonth() + 1 && td.getFullYear() == y) {
                    c.className = "today";
                }
                c.date = y + "-" + m + "-" + n;
                c.children[0].innerHTML = n++;
                c.children[0].className = "";
                c.children[1].className = "";
                if (q == 5 || q == 6) {
                    c.children[0].className = "red";
                }
                addEvent(c);
            }
        }
        //下月
        var nextM = (m + 1) % 12;
        nextM = nextM ? nextM : 12;
        var nextY = nextM == 1 ? y + 1 : y;
        n = 1;
        for (var i = p - 1, f = q; i <= 6; i++, f = 0) {
            for (var j = f; j < 7; j++) {
                var c = calTab.children[0].children[i].children[j].children[0];
                if (c.className.search("selected") > -1) {
                    selectedDate = c.date.split("-")[2];
                }
                c.className = "";
                c.date = nextY + "-" + nextM + "-" + n;
                c.children[0].innerHTML = n++;
                c.children[0].className = "ntm";
                c.children[1].className = "ntm";
                addEvent(c);
            }
        }
        changeSelected(y + "-" + m + "-" + selectedDate);
    }
    var cal = document.getElementById("calendar");
    var aSel = cal.getElementsByTagName("select");
    /*var table=document.getElementsByTagName("table")[0];
    table.onmouseover=function(e){
        e=e||window.event;
        if(e.target&&e.target.nodeName.toLowerCase()=="td"){
            addClass(e.target,"active");
            e.target.onmouseout=function(){
                removeClass(this,"active");
            }
        }
    }*/
    for (var i = 0; i < aSel.length; i++) {
        aSel[i].onchange = setDate;
    }
    setDate();
})();
