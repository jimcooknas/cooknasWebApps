/*
 *      Translated from main.c to javascript by Cooknas (solunar.js)
 *
 *      Copyright 2008 Douglas Bacon <dugbdev@users.sourceforge.net>
 *
 *      This program is free software; you can redistribute it and/or modify
 *      it under the terms of the GNU General Public License as published by
 *      the Free Software Foundation; either version 2 of the License, or
 *      (at your option) any later version.
 *
 *      This program is distributed in the hope that it will be useful,
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of
 *      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *      GNU General Public License for more details.
 *
 *      You should have received a copy of the GNU General Public License
 *      along with this program; if not, write to the Free Software
 *      Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 *      MA 02110-1301, USA.
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
var monthNames = ["January", "February", "Match", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var currentMonth;
var currentYear;
var currentLat;
var currentLng;

function solunar()
{
	var year, month, day; //int
	var underlong, ourlong, ourlat, zone, JD; //double
	var date; //double	// modified julian date, days since 1858 Nov 17 00:00, 1858 Nov 17 00:00 is JD 2400000.5
	var UT; //double
	var moonrise, moontransit, moonunder, moonset, moonphase, sunrise, suntransit, sunset; //double
	var object = 0;         //1 IS MOON, 0 IS SUN //int
	var soldayscale, phasedayscale; //int
	var minorstart1, minorstop1, minorstart2, minorstop2; //double
	var majorstart1, majorstop1, majorstart2, majorstop2; //double
	var mnst1 = "00:00", mnsp1 = "00:00", mnst2 = "00:00", mnsp2 = "00:00"; //string[6]
	var mjst1 = "00:00", mjsp1 = "00:00", mjst2 = "00:00", mjsp2 = "00:00"; //string[6]
	infoHours = "";
	infoDetails = "";
	bShowDetails = false;
	//******************************************************************************

	//******************************************************************************
	//get date and position from user.

    var dateVal = new Date(document.getElementById("dateVal").value);
    year = parseInt(dateVal.getFullYear());
    month = parseInt(dateVal.getMonth()) + 1;
    day = parseInt(dateVal.getDate());
	currentMonth = month;
	currentYear = year;
    underlong = parseFloat(document.getElementById("lngVal").value);
    ourlat = parseFloat(document.getElementById("latVal").value);
	currentLat = ourlat;
	currentLng = underlong;
	dataOutput.innerHTML="";
    console.log("Solunar data for " + day + "/" + month + "/" + year + " at " + ourlat + ", " + underlong + "");
    tz=2;
	//init some values
    UT = 0.0;
	ourlong = 0.0 - underlong;  //equations use east longitude negative convention
	zone = tz / 24.0;
	JD = get_julian_date(year, month, day, UT);
	date = (JD - 2400000.5 - zone);
	//get rise set times for moon and sun
	object = 1;	//sun
	[sunrise, sunset, suntransit] = get_rst(object, date, ourlong, ourlat);
	object = 0;	//moon
	[moonrise, moonset, moontransit] = get_rst(object, date, ourlong, ourlat);
	//get moon under-foot time
	moonunder = get_underfoot(date, underlong);
	//get moon phase
	moonphase = get_moon_phase (date);
	//get solunar minor periods
	//only calculate if the minor periods do not overlap prev or next days
	if (moonrise >= 1.0 & moonrise <= 23.0) {
		[mnst1, mnsp1] = sol_get_minor1(moonrise);
	}
	if (moonset >= 1.0 & moonset <= 23.0) {
		[mnst2, mnsp2] = sol_get_minor2(moonset);
	}
	sol_display_minors(mnst1, mnsp1, mnst2, mnsp2, moonrise, moonset);
	//get solunar major periods
	//only calculate if the major periods do not overlap prev and next days*/
	if (moontransit >= 1.5 & moontransit <= 22.5) {
		[mjst1, mjsp1] = sol_get_major1(moontransit);
	}
	if (moonunder >= 1.5 & moonunder <= 22.5) {
		[mjst2, mjsp2] = sol_get_major2(moonunder);
	}
	sol_display_majors(mjst1, mjsp1, mjst2, mjsp2, moontransit, moonunder);
	//get day scale
	phasedayscale = phase_day_scale (moonphase);
	soldayscale = sol_get_dayscale (moonrise, moonset, moontransit, moonunder, sunrise, sunset);
	var dayscale = sol_display_dayscale (soldayscale, phasedayscale);
	/*thats it, we are done*/
	if(bShowDetails){
		dataOutput.innerHTML = "<p style='color:var(--primary-dark)'>" + infoDetails + "</p><br>" + infoHours;
	}else{
		dataOutput.innerHTML = infoHours;
	}
    textOutput.textContent = dayscale.toString();
	console.log("\n");
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
	bShowDetails = !bShowDetails;
	if(bShowDetails){
		dataOutput.innerHTML = "<p style='color:var(--primary-dark)'>" + infoDetails + "</p><br>" + infoHours;
	}else{
		dataOutput.innerHTML = infoHours;
	}
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
		prevMonthDays = m == 1 ? monthDays[11] : monthDays[m-2];
		cell.innerHTML = (prevMonthDays-startDay+i+1);//row_nr + "," + col_nr;
		cell.setAttribute("id", "cell_" + row_nr + "_" + col_nr);
		cell.style.background = "var(--greyLight-1)";
		cell.style.textAlign = "center";
		cell.style.width = "3rem";
		cell.style.height = "4rem";
	}
	//add month's days
	for(var i = startDay; i < monthDays[m-1]+startDay; i++){
		col_nr++;
		if (col_nr % row_length == 0) {
			col_nr = 0;
			row_nr++;
			row = table.insertRow(row_nr);
			row.setAttribute("id", "row_" + row_nr);
		}
		var cell = row.insertCell(col_nr);
		var scale = getScale(y, m, i-startDay+1, lat, lng);
		cell.innerHTML = (i-startDay+1) + "<br><b>"+scale+"</b>";//row_nr + "," + col_nr;
		cell.setAttribute("id", "cell_" + row_nr + "_" + col_nr);
		cell.style.background = "var(--color"+scale+")";
		cell.style.textAlign = "center";
		cell.style.width = "3rem";
		cell.style.height = "4rem";
		var createClickHandler = function(cell) {
			return function() {
				var id = cell.innerHTML;
				var dd = id.split('<br>');
				console.log(dd[0]);
				document.getElementById("dateVal").valueAsDate = new Date(y, m-1, parseInt(dd[0])+1);
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

function getScale(year, month, day, lat, lng){
	var sunrise, sunset, suntransit;
	var moonrise, moonset, moontransit;
	var UT = 0.0;
	var ourlong = 0.0 - lng;  //equations use east longitude negative convention
	var zone = tz / 24.0;
	var JD = get_julian_date(year, month, day, UT);
	var date = (JD - 2400000.5 - zone);
	//get rise set times for moon and sun
	var object = 1;	//sun
	[sunrise, sunset, suntransit] = get_rst(object, date, ourlong, lat);
	object = 0;	//moon
	[moonrise, moonset, moontransit] = get_rst(object, date, ourlong, lat);
	//get moon under-foot time
	var moonunder = get_underfoot(date, lng);
	//get moon phase
	var moonphase = get_moon_phase (date);
	//calculate scale
	var phasedayscale = phase_day_scale (moonphase);
	var soldayscale = sol_get_dayscale (moonrise, moonset, moontransit, moonunder, sunrise, sunset);
	var dayscale = sol_display_dayscale (soldayscale, phasedayscale);
	return dayscale;
}

function prevMonth(){
	currentMonth--;
	if(currentMonth==0){
		currentMonth=12;
		currentYear--;
	}
	createMonthPanel(new Date(currentYear,currentMonth-1,1), currentLat, currentLng);
	console.log("prevMonth");
}

function nextMonth(){
	currentMonth++;
	if(currentMonth==13){
		currentMonth=1;
		currentYear++;
	}
	createMonthPanel(new Date(currentYear,currentMonth-1,1), currentLat, currentLng);
	console.log("nextMonth");
}

window.onload = function(){
    document.getElementById('dateVal').valueAsDate = new Date();
	components = document.getElementsByClassName("components")[0];
	monthPanel = document.getElementById("month");
	solunar();
};
