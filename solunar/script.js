/*
    Evaluating days for fishing success by cooknas  2023
    getTimesSolunar(date, lat, lng) returns:
        action: number (0-5)
        major[2]: start, end, overhead
        minor[2]: start, end
        moon: phase(.string), paheno, rise, set
        transit[2]: time, overhead 
        sun: dawn, dusk, goldenHour, goldenHourEnd, 
                nadir, nauticalDawn, nauticalDusk, 
                night, nightEnd, solarNoon, sunrise, sunriseEnd,
                sunset, sunsetEnd
*/
var textOutput = document.getElementById("text_output");
var dataOutput = document.getElementById("data_output");
var monthPanel;
var components;
var map;

var initialLat = 40.28;
var initialLng = 23.40;
var initialZoom = 8.0;
var tz; // time zone //int
var infoHours = "";
var infoDetails = "";
var bShowDetails = false;
var bTableCreated = false;
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var currentMonth;
var currentYear;
var currentLat;
var currentLng;

function solunar()
{
    var year, month, day; //int
    var lng, lat; //double

    infoHours = "";
    infoDetails = "";
    bShowDetails = false;
    //******************************************************************************

    //******************************************************************************
    //get date and position from user.
    //console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
    var dateVal = new Date(document.getElementById("dateVal").value);
    year = parseInt(dateVal.getFullYear());
    month = parseInt(dateVal.getMonth()) + 1;
    day = parseInt(dateVal.getDate());
    currentMonth = month;
    currentYear = year;
    lng = parseFloat(document.getElementById("lngVal").value);
    lat = parseFloat(document.getElementById("latVal").value);
    currentLat = lat;
    currentLng = lng;
    dataOutput.innerHTML="";
    /*
    action: number (0-5)
    major[2]: start, end, overhead
    minor[2]: start, end
    moon: phase(.string), rise, set
    transit[2]: time, overhead 
    sun: dawn, dusk, goldenHour, goldenHourEnd, 
            nadir, nauticalDawn, nauticalDusk, 
            night, nightEnd, solarNoon, sunrise, sunriseEnd,
            sunset, sunsetEnd
    */
    var times = getTimesSolunar(dateVal, lat, lng);
    //console.log(dateVal + ": "+ times.action);
    infoHours = "<a class='dark'>Major hours:</a><br>"
    if(times.major[0]!=undefined)
        infoHours += "<b>"+times.major[0].start.toLocaleTimeString('en-GB')+" - "+times.major[0].end.toLocaleTimeString('en-GB')+"</b><br>"
    if(times.major[1]!=undefined)
        infoHours += "<b>"+times.major[1].start.toLocaleTimeString('en-GB')+" - "+times.major[1].end.toLocaleTimeString('en-GB')+"</b><br>";

    infoHours += "<a class='dark'>Minor hours:</a><br>";
    if(times.minor[0]!=undefined)
        infoHours += "<b>"+times.minor[0].start.toLocaleTimeString('en-GB')+" - "+times.minor[0].end.toLocaleTimeString('en-GB')+"</b><br>"
    if(times.minor[1]!=undefined)
        infoHours += "<b>"+times.minor[1].start.toLocaleTimeString('en-GB')+" - "+times.minor[1].end.toLocaleTimeString('en-GB')+"</b><br>";
    infoDetails = "<b>SUN:</b><br>";
    if(times.sun.nauticalDawn!=undefined)
        infoDetails += "<a class='dark'>nautical dawn: </a><b>"+times.sun.nauticalDawn.toLocaleTimeString('en-GB')+"</b><br>";
    if(times.sun.dawn!=undefined)
        infoDetails += "<a class='dark'>dawn: </a><b>"+times.sun.dawn.toLocaleTimeString('en-GB')+"</b><br>";
    if(times.sun.sunrise!=undefined && times.sun.sunriseEnd!=undefined)
        infoDetails += "<a class='dark'>sunrise: </a><b>"+times.sun.sunrise.toLocaleTimeString('en-GB')+" - "+times.sun.sunriseEnd.toLocaleTimeString('en-GB')+"</b><br>";
    if(times.sun.solarNoon!=undefined)
        infoDetails += "<a class='dark'>noon: </a><b>"+times.sun.solarNoon.toLocaleTimeString('en-GB')+"</b><br>";
    if(times.sun.sunset!=undefined)//&& times.sun.sunsetEnd!=undefined
        infoDetails += "<a class='dark'>sunset: </a><b>"+times.sun.sunset.toLocaleTimeString('en-GB')+(times.sun.sunsetEnd!=undefined?" - "+times.sun.sunsetEnd.toLocaleTimeString('en-GB'):"")+"</b><br>";
    if(times.sun.dusk!=undefined)
        infoDetails += "<a class='dark'>dusk: </a><b>"+times.sun.dusk.toLocaleTimeString('en-GB')+"</b><br>";
    if(times.sun.nauticalDusk!=undefined)
        infoDetails += "<a class='dark'>nautical dusk: </a><b>"+times.sun.nauticalDusk.toLocaleTimeString('en-GB')+"</b><br>";
    if(times.sun.night!=undefined && times.sun.nightEnd!=undefined)
        infoDetails += "<a class='dark'>night: </a><b>"+times.sun.night.toLocaleTimeString('en-GB')+" - "+times.sun.nightEnd.toLocaleTimeString('en-GB')+"</b><br>"; 
    if(times.sun.nadir!=undefined)
        infoDetails += "<a class='dark'>nadir: </a><b>"+times.sun.nadir.toLocaleTimeString('en-GB')+"</b><br>";
    infoDetails += "<b>MOON:</b><br>";
    if(times.moon.phase!=undefined)    
        infoDetails += "<a class='dark'>moon phase: </a><b>"+times.moon.phase+"</b><br>";
    if(times.moon.rise!=undefined)  
        infoDetails += "<a class='dark'>moon rise: </a><b>"+times.moon.rise.toLocaleTimeString('en-GB')+"</b><br>";
    if(times.moon.set!=undefined)  
        infoDetails += "<a class='dark'>moon set: </a><b>"+times.moon.set.toLocaleTimeString('en-GB')+"</b><br>";
    /*thats it, we are done*/
    if(bShowDetails){
        dataOutput.innerHTML = "<p style='color:var(--primary-dark)'>" + infoDetails + "</p><br>" + infoHours;
    }else{
        dataOutput.innerHTML = infoHours;
    }
    document.getElementById("output_class").style.background = "var(--color"+times.action+")";
    textOutput.innerHTML = "<b>"+times.action+"</b>";//the score of the date
    //console.log("\n");
    return;
}

function getLatLng(){
    document.getElementById("map").style.display = "block";
    //document.getElementById("map").style.width = "400px";
    //components.style.transform = "translateX(-200px)";
    if(!map){
        map = document.getElementById("map");
        map = L.map('map',{zoomControl: false }).setView([initialLat, initialLng], initialZoom);
        //new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
        
        // custom zoom bar control that includes a Zoom Home function on leaflet
        L.Control.zoomHome = L.Control.extend({
            options: {
                position: 'bottomright',
                zoomInText: '+',
                zoomInTitle: 'Zoom in',
                zoomOutText: '-',
                zoomOutTitle: 'Zoom out',
                zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
                zoomHomeTitle: 'Zoom home'
            },

            onAdd: function (map1) {
                var controlName = 'gin-control-zoom',
                    container1 = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                    options = this.options;
                this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
                controlName + '-in', container1, this._zoomIn);
                this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
                controlName + '-home', container1, this._zoomHome);
                this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
                controlName + '-out', container1, this._zoomOut);
                this._updateDisabled();
                map1.on('zoomend zoomlevelschange', this._updateDisabled, this);
                return container1;
            },

            onRemove: function (_map) {
                _map.off('zoomend zoomlevelschange', this._updateDisabled, this);
            },

            _zoomIn: function (e) {
                this._map.zoomIn(e.shiftKey ? 3 : 1);
            },

            _zoomOut: function (e) {
                this._map.zoomOut(e.shiftKey ? 3 : 1);
            },

            _zoomHome: function (e) {
                this._map.setView([initialLat, initialLng], initialZoom);
            },

            _createButton: function (html, title, className, container, fn) {
                var link = L.DomUtil.create('a', className, container);
                link.innerHTML = html;
                link.href = '#';
                link.title = title;
                L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                    .on(link, 'click', L.DomEvent.stop)
                    .on(link, 'click', fn, this)
                    .on(link, 'click', this._refocusOnMap, this);

                return link;
            },

            _updateDisabled: function () {
                var map1 = this._map,
                    className = 'leaflet-disabled';

                L.DomUtil.removeClass(this._zoomInButton, className);
                L.DomUtil.removeClass(this._zoomOutButton, className);

                if (map1._zoom === map1.getMinZoom()) {
                    L.DomUtil.addClass(this._zoomOutButton, className);
                }
                if (map1._zoom === map1.getMaxZoom()) {
                    L.DomUtil.addClass(this._zoomInButton, className);
                }
            }
        });
        // add the new control to the map
        zoomHome = new L.Control.zoomHome();
        zoomHome.addTo(map);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri,DeLorme,NAVTEQ,TomTom,Intermap,iPC,USGS,FAO,NPS,NRCAN,GeoBase,Kadaster NL,Ordnance Survey,Esri Japan,METI,Esri Hong Kong and GIS User Community'
        }).addTo(map);

        var marker;
        map.on('click', clickMap);

        function clickMap(e){
            if(marker)
                map.removeLayer(marker);
            console.log(e.latlng);
            marker = L.marker(e.latlng).addTo(map);
            var latVal = document.getElementById("latVal");
            var lngVal = document.getElementById("lngVal");
            latVal.value = e.latlng.lat.toFixed(6);
            lngVal.value = e.latlng.lng.toFixed(6);
            document.getElementById("map").style.display = "none";
            solunar();
            //components.style.transform = "translateX(200px)";
        }
    }
}

function showDetails(){
    Swal.fire({
        title: "<strong>Detailed Info</strong>",
        iconHtml: '<div class"icon__info"><i class="fa fa-info-circle" aria-hidden="true"></i></div>', 
        customClass: {
            icon: 'no-border'
        },
        html: infoDetails,
        showCloseButton: true,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> OK',
        footer: '<a href="http://www.cooknas.com/solunar">www.cooknas.com/solunar</a>' 
    });
};

function getMonth(){
    monthPanel.style.display = "block";
    components.style.display = "none";
    createMonthPanel(new Date(document.getElementById("dateVal").value),document.getElementById("latVal").value,document.getElementById("lngVal").value);
}

function createMonthPanel(datemonth, lat, lng){
    if(bTableCreated){
        var rows = document.getElementById("myTable").rows.length;
        for(var i=rows-1;i>0;i--){
            document.getElementById("myTable").deleteRow(i);
        }
        for(var i=6;i>0;i--){
            document.getElementById("row_0").deleteCell(i);
        }
    }
    var m = parseInt(datemonth.getMonth()) + 1;
    var y = parseInt(datemonth.getFullYear());
    currentMonth = m;
    currentYear = y;
    //TODO check for leap year
    document.getElementById("monthName").textContent = monthNames[m-1] + " " + y;
    //width 26rem
    var startDay = (new Date(y,m-1,1)).getDay();
    //console.log("*************"+datemonth + " " + startDay);
    var row_nr = 0;
    var col_nr = 0;
    var row_length = 7;
    var table = document.getElementById("myTable");
    var row = document.getElementById("row_" + row_nr);
    var prevMonthDays;
    //add days SMTWTFS
    for(var i = 1; i < 7 ; i++){
        col_nr++;
        if (col_nr % row_length == 0) {
            col_nr = 0;
            row_nr++;
            row = table.insertRow(row_nr);
            row.setAttribute("id", "row_" + row_nr);
        }
        var cell = row.insertCell(col_nr);
        cell.innerHTML = "<b>" + "SMTWTFS".charAt(i).toString() + "</b>";//row_nr + "," + col_nr;
        cell.setAttribute("id", "cell_" + row_nr + "_" + col_nr);
        //cell.style.background = "var(--greyDark)";
        cell.style.textAlign = "center";
        cell.style.width = "3rem";
        cell.style.height = "2rem";
    }
    //add previous month's last days
    for(var i = 0; i < startDay ; i++){
        col_nr++;
        if (col_nr % row_length == 0) {
            col_nr = 0;
            row_nr++;
            row = table.insertRow(row_nr);
            row.setAttribute("id", "row_" + row_nr);
        }
        var cell = row.insertCell(col_nr);
        prevMonthDays = (m == 1 ? monthDays[11] : monthDays[m-2] + ((m-2 == 1 && isLeapYear(y) ? 1 : 0)));
        cell.innerHTML = (prevMonthDays-startDay+i+1);//row_nr + "," + col_nr;
        cell.setAttribute("id", "cell_" + row_nr + "_" + col_nr);
        cell.style.background = "var(--greyLight-1)";
        cell.style.textAlign = "center";
        cell.style.width = "3rem";
        cell.style.height = "4rem";
    }
    //add month's days
    var times = {};
    var leapY = (m-1 == 1 && isLeapYear(y) ? 1 : 0);
    var today = new Date();
    for(var i = startDay; i < monthDays[m-1] + startDay + leapY; i++){
        col_nr++;
        if (col_nr % row_length == 0) {
            col_nr = 0;
            row_nr++;
            row = table.insertRow(row_nr);
            row.setAttribute("id", "row_" + row_nr);
        }
        var cell = row.insertCell(col_nr);
        var date1 = new Date(y, m-1, i-startDay+1, 2, 0, 0);
        times = getTimesSolunar(date1, lat, lng);
        var scale = times.action.toString();//getScale(y, m, i-startDay+1, lat, lng);
        //console.log(date1 + ": "+scale);
        cell.innerHTML = (i-startDay+1) + "<br><b>"+scale+"</b>";//row_nr + "," + col_nr;
        cell.setAttribute("id", "cell_" + row_nr + "_" + col_nr);

        if(date1.toDateString() === today.toDateString())
            cell.classList.add("cells-border");
        else
            cell.classList.add("cells");
        cell.style.background = "var(--color"+scale+")";
        cell.style.textAlign = "center";
        cell.style.width = "3rem";
        cell.style.height = "4rem";
        var createClickHandler = function(cell) {
            return function() {
                var id = cell.innerHTML;
                var dd = id.split('<br>');
                //console.log(dd[0]);
                document.getElementById("dateVal").valueAsDate = new Date(y, m-1, parseInt(dd[0]), 2, 0, 0);
                monthPanel.style.display = "none";
                components.style.display = "grid";
                solunar();
            };
        };
        cell.onclick = createClickHandler(cell);
    }
    //add next month's first days
    var stD = col_nr;
    for(var i = stD; i < 6 ; i++){
        col_nr++;
        if (col_nr % row_length == 0) {
            col_nr = 0;
            row_nr++;
            row = table.insertRow(row_nr);
            row.setAttribute("id", "row_" + row_nr);
        }
        var cell = row.insertCell(col_nr);
        cell.innerHTML = (i-stD+1);//row_nr + "," + col_nr;
        cell.setAttribute("id", "cell_" + row_nr + "_" + col_nr);
        cell.style.background = "var(--greyLight-1)";
        cell.style.textAlign = "center";
        cell.style.width = "3rem";
        cell.style.height = "4rem";
    }
    bTableCreated=true;
}

function prevMonth(){
    currentMonth--;
    if(currentMonth==0){
        currentMonth=12;
        currentYear--;
    }
    createMonthPanel(new Date(currentYear,currentMonth-1,1,2,0,0), currentLat, currentLng);
    //console.log("prevMonth");
}

function nextMonth(){
    currentMonth++;
    if(currentMonth==13){
        currentMonth=1;
        currentYear++;
    }
    createMonthPanel(new Date(currentYear,currentMonth-1,1,2,0,0), currentLat, currentLng);
    //console.log("nextMonth");
}

function goBack(){
    monthPanel.style.display = "none";
    components.style.display = "grid";
}

function isLeapYear(y){
    if ((0 == y % 4) && (0 != y % 100) || (0 == y % 400)) {
        return true;
    } else {
        return false;
    }
}

function onDateChanged(){
    solunar();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

window.onload = function(){
    document.getElementById('dateVal').valueAsDate = new Date();
    components = document.getElementsByClassName("components")[0];
    monthPanel = document.getElementById("month");
    document.getElementById('dateVal').onchange = function(){solunar();}
    solunar();
};
             