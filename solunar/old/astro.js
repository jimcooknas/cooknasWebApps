/*
 *      translated from astro.c by Cooknas (as astro.js)
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


//Some usefull things
const PI = 3.141592654;
const twoPI = ( 2 * PI );
const RADEG	 = ( 180.0 / PI );
const DEGRAD = ( PI / 180.0 );
function sind(x) { return Math.sin((x)*DEGRAD);}
function cosd(x) { return Math.cos((x)*DEGRAD);}

//get rise, set and transit times of object sun or moon
//returns [0] = vRise, [1] = vSet, [2] = vTransit
function get_rst (/*int*/ object, /*double*/ date, /*double*/ ourlong, /*double*/ ourlat)
{
	var vRise, vSet, vTransit;//double
	var sl;          //sin lat (double)
	var cl;          //cos lat (double)
	var xe, ye, z1, z2; //double
	var riseTime = 0.0, setTime = 0.0, transitTime = 0.0; //double
	var above = 0.0; //double
	var ym = 0.0, y0, yp; //double
	var sinho = [];  //int      //0 IS MOON, 1 IS SUN
	var doesRise = 0, doesSet = 0, doesTransit = 0, hour = 1, check = 0; //int
	var nz = 0; //int
	var eventName; //string[8];
    //******************************************************************************
    // init some values
	sl = sind(ourlat);          //sin of latitude
    cl = cosd(ourlat);          //cos of latitude
	sinho[0] = .002327;         //moonrise - average diameter used
	sinho[1] = -0.014544;       //sunrise - classic value for refraction

	ym = sinalt(object, date, hour - 1, ourlong, cl, sl) - sinho[object];
	if (ym > 0) {
		above = 1;
	}else {
		above = 0;
	}
    //start rise-set loop
	do{
		y0 = sinalt(object, date, hour, ourlong, cl, sl) - sinho[object];
		yp = sinalt(object, date, hour + 1, ourlong, cl, sl) - sinho[object];
		xe = 0;
		ye = 0;
		z1 = 0;
		z2 = 0;
		nz = 0;
		[xe, ye, z1, z2, nz] = quad(ym, y0, yp);
		switch (nz){
			case 0:	//nothing  - go to next time slot
				break;
			case 1:                 //simple rise / set event
				if (ym < 0) {       //must be a rising event
					riseTime = hour + z1;
					doesRise = 1;
				}else {	//must be setting
					setTime = hour + z1;
					doesSet = 1;
				}
				break;
			case 2:                 //rises and sets within interval
				if (ye < 0) {       //minimum - so set then rise
					riseTime = hour + z2;
					setTime = hour + z1;
				}else {    //maximum - so rise then set
					riseTime = hour + z1;
					setTime = hour + z2;
				}
				doesRise = 1;
				doesSet = 1;
				break;
				}

		ym = yp;     //reuse the ordinate in the next interval
		hour = hour + 2;
		check = (doesRise * doesSet);
	}
	while ((hour != 25) && (check != 1));
	// end rise-set loop
    //GET TRANSIT TIME
	hour = 0; //reset hour
	transitTime = get_transit(object, date, hour, ourlong);
	if (transitTime != 0.0) {
		doesTransit = 1;
	}
	if (object == 0){
		console.log(" MOON");
		infoDetails += "<br>MOON:";
	}else {
		console.log(" SUN");
		infoDetails += "SUN:";
	}
	//logic to sort the various rise, transit set states
	// nested if's...sorry
	if ((doesRise == 1) || (doesSet == 1) || (doesTransit == 1)) {   //current object rises, sets or transits today
		if (doesRise == 1) {
			vRise = riseTime;
			eventName = "rise";
			display_event_time(riseTime, eventName);
		}else {
			vRise = 0.0;
			console.log(" does not rise");
		}
		if (doesTransit == 1) {
			vTransit = transitTime;
			eventName = "transit";
			display_event_time(transitTime, eventName);
		}else {
			vTransit = 0.0;
			console.log(" does not transit");
		}
		if (doesSet == 1) {
			vSet = setTime;
			eventName = "set";
			display_event_time(setTime, eventName);
		}else {
			vSet = 0.0;
			console.log(" does not set");
		}
	} else { //current object not so simple
		if (above == 1) {
			console.log(" always above horizon");
		}  else {
			console.log(" always below horizon");
		}
	}
	//thats it were done.
    return [vRise, vSet, vTransit];
}

/******************************************************************************/
function get_julian_date(/*int*/ year, /*int*/ month, /*int*/ day, /*double*/ UT)
{
	var locJD, a, b, c, d, e, f, g; //double
	[a, b] = modf((month + 9)/12);
	[a, c] = modf((7 * (year + b))/4);
	[a, d] = modf((275 * month)/9);
	e = 367 * year - c + d + day + 1721013.5 + UT/24;
	f = (100 * year + month - 190002.5);
	g = f/Math.abs(f);
	locJD = e - 0.5 * g + 0.5;
	return (locJD);
}

//https://insidethediv.com/javascript-get-integer-and-decimal-portion
function modf(x){
    var num = x.toString().split(".");
    return [Number(num[0]), Number("0." + num[1])];
}

/******************************************************************************/
function display_event_time (/*double*/ time, /*char*/ event)
{
	var sTime;
	sTime = convert_time_to_string(time);
	console.log(event + " = " + sTime);
	infoDetails += (event=='transit'?' ':"<br>") + event + ": <b>" + sTime + "</b> ";
return;
}

/******************************************************************************/
function ipart (/*double*/ x)
//returns the true integer part, even for negative numbers
{
	var a;
	if (x != 0) {
	    a = x/Math.abs(x) * Math.floor(Math.abs(x));
	} else {
	    a=0.0;
	}
    return a;
}

/******************************************************************************/
function fpart (/*double*/ x)
//returns fractional part of a number
{
	x = x - Math.floor(x);
	if ( x < 0) {
		x = x + 1;
	}
    return x;
}

/******************************************************************************/
function sinalt (/*int*/ object, /*double*/ mjd0, /*int*/ hour, /*double*/ ourlong, /*double*/ cphi, /*double*/ sphi )
/*
returns (as double) sine of the altitude of either the sun or the moon given the modified
julian day number at midnight UT and the hour of the UT day, the longitude of
the observer, and the sine and cosine of the latitude of the observer
*/
{
	var loc_sinalt;   //sine of the altitude, return value; //double
	var ra = 0.0; //double
	var dec = 0.0; //double
	var instant, t; //double
	var lha;		//hour angle //double
	instant = mjd0 + hour / 24.0;
	t = (instant - 51544.5) / 36525;
	if (object == 0) {
		[ra, dec] = get_moon_pos(t);
	}
	else {
		[ra, dec] = get_sun_pos(t);
	}
	lha = 15.0 * (lmst(instant, ourlong) - ra);    //hour angle of object
	loc_sinalt = sphi * sind(dec) + cphi * cosd(dec) * cosd(lha);
    return (loc_sinalt);
}

/******************************************************************************/
function lmst (/*double*/ mjd, /*double*/ ourlong)
//returns (as double) the local siderial time for the modified julian date and longitude
{
	var value; //double
	var mjd0; //float
	var ut; //double
	var t;  //double
	var gmst; //double
	mjd0 = ipart(mjd);
	ut = (mjd - mjd0) * 24;
	t = (mjd0 - 51544.5) / 36525;
	gmst = 6.697374558 + 1.0027379093 * ut;
	gmst = gmst + (8640184.812866 + (.093104 - .0000062 * t) * t) * t / 3600;
	value = 24.0 * fpart((gmst - ourlong / 15.0) / 24.0);
    return value;
}

/******************************************************************************/
function get_sun_pos (/*double*/ t)
/*
Returns RA and DEC (as list of doubles) of Sun to roughly 1 arcmin for few hundred years either side
of J2000.0
*/
{
    var ra, dec; //double
	var COSEPS = 0.91748; //double
	var SINEPS = 0.39778; //double
	var m, dL, L, rho, sl; //double
	var RA, DEC; //double
	var x, y, z; //double
	m = twoPI * fpart(0.993133 + 99.997361 * t);        //Mean anomaly
	dL = 6893 * Math.sin(m) + 72 * Math.sin(2 * m);          //Eq centre
	L = twoPI * fpart(0.7859453 + m / twoPI + (6191.2 * t + dL) / 1296000);
	sl = Math.sin(L);
	x = Math.cos(L);
	y = COSEPS * sl;
	z = SINEPS * sl;
	rho = Math.sqrt(1 - z * z);
	DEC = (360 / twoPI) * Math.atan2(z , rho);
	RA = (48 / twoPI) * Math.atan2(y , (x + rho));
	if (RA < 0) {
		RA = RA + 24;
	}
	ra = RA;
	dec = DEC;
    return [ra, dec];
}

/******************************************************************************/
function get_moon_pos (/*double*/ t)
/*
returns ra and dec of Moon to 5 arc min (ra) and 1 arc min (dec) for a few
centuries either side of J2000.0 Predicts rise and set times to within minutes
for about 500 years in past - TDT and UT time diference may become significant
for long times
*/
{
    var ra, dec; //double
	var ARC = 206264.8062; //double
	var COSEPS = 0.91748; //double
	var SINEPS = 0.39778; //double
	var L0, L, LS, d, F; //double
	L0 = fpart(.606433 + 1336.855225 * t);    //'mean long Moon in revs
	L = twoPI * fpart(.374897 + 1325.55241 * t); //'mean anomaly of Moon
	LS = twoPI * fpart(.993133 + 99.997361 * t); //'mean anomaly of Sun
	d = twoPI * fpart(.827361 + 1236.853086 * t); //'diff longitude sun and moon
	F = twoPI * fpart(.259086 + 1342.227825 * t); //'mean arg latitude
	//' longitude correction terms
	var dL, h; //double
	dL = 22640 * Math.sin(L) - 4586 * Math.sin(L - 2 * d);
	dL = dL + 2370 * Math.sin(2 * d) + 769 * Math.sin(2 * L);
	dL = dL - 668 * Math.sin(LS) - 412 * Math.sin(2 * F);
	dL = dL - 212 * Math.sin(2 * L - 2 * d) - 206 * Math.sin(L + LS - 2 * d);
	dL = dL + 192 * Math.sin(L + 2 * d) - 165 * Math.sin(LS - 2 * d);
	dL = dL - 125 * Math.sin(d) - 110 * Math.sin(L + LS);
	dL = dL + 148 * Math.sin(L - LS) - 55 * Math.sin(2 * F - 2 * d);
	//' latitude arguments
	var S, N, lmoon, bmoon; //double
	S = F + (dL + 412 * Math.sin(2 * F) + 541 * Math.sin(LS)) / ARC;
	h = F - 2 * d;
	//' latitude correction terms
	N = -526 * Math.sin(h) + 44 * Math.sin(L + h) - 31 * Math.sin(h - L) - 23 * Math.sin(LS + h);
	N = N + 11 * Math.sin(h - LS) - 25 * Math.sin(F - 2 * L) + 21 * Math.sin(F - L);
	lmoon = twoPI * fpart(L0 + dL / 1296000); //  'Lat in rads
	bmoon = (18520 * Math.sin(S) + N) / ARC;  //     'long in rads
	//' convert to equatorial coords using a fixed ecliptic
	var CB, x, V, W, y, Z, rho, DEC, RA; //double
	CB = Math.cos(bmoon);
	x = CB * Math.cos(lmoon);
	V = CB * Math.sin(lmoon);
	W = Math.sin(bmoon);
	y = COSEPS * V - SINEPS * W;
	Z = SINEPS * V + COSEPS * W;
	rho = Math.sqrt(1.0 - Z * Z);
	DEC = (360.0 / twoPI) * Math.atan2(Z , rho);
	RA = (48.0 / twoPI) * Math.atan2(y , (x + rho));
	if (RA < 0) {
		RA = RA + 24.0;
	}
	ra = RA;
	dec = DEC;
    return [ra, dec];
}

/******************************************************************************/
/*  finds a parabola through three points and returns values of coordinates of
    extreme value (xe, ye) and zeros if any (z1, z2) assumes that the x values are
    -1, 0, +1 
    Returns doubles [0] = xe, [1] = ye, [2] = z1, [3] = z2 and int [4] = nz
*/
function quad(/*double*/ ym, /*double*/ y0, /*double*/ yp)
{
    var xe, ye, z1, z2; //double 
    var nz; //int
	var a, b, c, dx, dis, XE, YE, Z1, Z2; //double
	var NZ; //int
	NZ = 0;
	XE = 0;
	YE = 0;
	Z1 = 0;
	Z2 = 0;
	a = .5 * (ym + yp) - y0;
	b = .5 * (yp - ym);
	c = y0;
	XE = (0.0 - b) / (a * 2.0); //      'x coord of symmetry line
	YE = (a * XE + b) * XE + c; //      'extreme value for y in interval
	dis = b * b - 4.0 * a * c;  //      'discriminant
	//more nested if's
	if ( dis > 0.000000 ) {                 //'there are zeros
		dx = (0.5 * Math.sqrt(dis)) / (Math.abs(a));
		Z1 = XE - dx;
		Z2 = XE + dx;
		if (Math.abs(Z1) <= 1) {
			NZ = NZ + 1 ;   // 'This zero is in interval
		}
		if (Math.abs(Z2) <= 1) {
			NZ = NZ + 1  ;   //'This zero is in interval
		}
		if (Z1 < -1) {
			Z1 = Z2;
		}
	}
	xe = XE;
	ye = YE;
	z1 = Z1;
	z2 = Z2;
	nz = NZ;
    return [xe, ye, z1, z2, nz];
}

/******************************************************************************/
function get_moon_phase (/*double*/ date) /* return double*/
{
    var PriPhaseOccurs; //1 = yes, 0 = no //int
    var i = 0; //int
    var ourhour; //double
    var hour = -1; //double
    var ls, lm, diff; //double
    var instant, t, ra, dec; //double
    var phase; //double
    var hourarray = [100]; //double[100]
    var minarray = [119]; //double[119]
    var illumin, age, PriPhaseTime; //double
    var PhaseName;//string[16];
    /*some notes on structure of hourarray[]
    *  increment is 15mins
    * i =  0, hourarray[0] = hour -1, hour 23 of prev day.
    * i =  1, hourarry[1] = hour -0.75, hour 23.15 of prev day.
    * i = 4, hourarray[4] = hour 0 of today.
    * i = 52, hourarray[52] = hour 12 of today.
    * i = 99, hourarray[99] = hour 23.75 of today.
    * i = 100, hourarray[100] = hour 0 of nextday.
    * 
    * to convert i to todays hour = (i/4 -1)
    */

    //find and store illumination for every 1/4 hour in an array
    while (i < 104){
        instant = date + hour / 24.0;
        t = (instant - 51544.5) / 36525;
        lm = get_moon_long (t);
        ls = get_sun_long (t);
        diff = lm - ls;
        phase = (1.0 - cosd(lm - ls))/2;
        phase *=100;
        if (diff < 0) {
            diff += 360;
        }
        if (diff > 180) {
            phase *= -1;
        }
        illumin = Math.abs(phase);
        hourarray[i] = illumin;
        i++;
        hour+= 0.25;
    }
    i = 0;
    while (i < 104){
        ourhour = i;
        ourhour = ((ourhour/4) - 1);
        //check for a new moon
        if ((hourarray[i] < hourarray[i+1]) && (hourarray[i] < 0.001)) {
        break;
        }
        //check for a full moon
        if ( (hourarray[i] > hourarray[i+1]) && (hourarray[i] > 99.9999) ){
            break;
        }
        //check for a first quarter
        if ( (hourarray[i] < hourarray[i+1]) && (hourarray[i] > 50) && (hourarray[i] < 50.5)){
            break;
        }
        //check for a last quarter
        if ( (hourarray[i] > hourarray[i+1]) && (hourarray[i] < 50) && (hourarray[i] > 49.5) ){
            break;
        }
        i++;
    }
    if ( ourhour < 0 || ourhour >= 24 ) {
        PriPhaseOccurs = 0;
    } else {
        PriPhaseOccurs = 1;
    }

    if (PriPhaseOccurs == 1){
        //check every min start with the previous hour
        if (ourhour > 0) {
            hour = ipart(ourhour) - 1;
        } else {
            hour = ipart(ourhour);
        }

        PriPhaseTime = hour;
        i = 0;
        while (i < 120){
            instant = date + hour / 24.0;
            t = (instant - 51544.5) / 36525;
            lm = get_moon_long (t);
            ls = get_sun_long (t);
            diff = lm - ls;
            phase = (1.0 - cosd(lm - ls))/2;
            phase *=100;
            if (diff < 0) {
                diff += 360;
            }
            if (diff > 180) {
                phase *= -1;
            }
            // we are getting age at the wrong time here, maybe for a primary phase
            // we should use a static age, like we do for illumin.        
            //age = fabs(diff/13);
            illumin = Math.abs(phase);
            minarray[i] = illumin;
            hour = hour + 0.016667;
            i++;
        }
        i = 0;
        var ourmin; //int
        while (i < 120){
            ourmin = i;
            //check for a new moon
            if ((minarray[i] < minarray[i+1]) && (minarray[i] < 0.1)) {
                illumin = 0;
                age = 0.0;
                PhaseName = "NEW";
                break;
            }
            //check for a full moon
            if ( (minarray[i] > minarray[i+1]) && (minarray[i] > 99) ){
                illumin = 100;
                age = 14.0;
                PhaseName = "FULL";
                break;
            }
            //check for a first quarter
            if ( (minarray[i] < minarray[i+1]) && (minarray[i] > 50) && (minarray[i] < 51)){
                illumin = 50;
                age = 7.0;
                PhaseName = "First Quarter";
                break;
            }
            //check for a last quarter
            if ( (minarray[i] > minarray[i+1]) && (minarray[i] < 50) && (minarray[i] > 49) ){
                illumin = 50;
                age = 21.0;
                PhaseName = "Last Quarter";
                break;
            }
            PriPhaseTime = PriPhaseTime + 0.016667;
            i++;
        }
    } else {
        //if we didn't find a primary phase, check the phase at noon.
        //    date = (JD - 2400000.5);
        instant = date + .5;//check at noon
        t = (instant - 51544.5) / 36525;
        lm = get_moon_long(t);
        ls = get_sun_long(t);
        diff = lm - ls;
        phase = (1.0 - cosd(lm - ls))/2;
        phase *=100;
        if (diff < 0) {
            diff += 360;
        }
        if (diff > 180) {
            phase *= -1;
        }
        //age = fabs((lm - ls)/13);
        age = Math.abs(diff/13);
        illumin = Math.abs(phase);
        //Get phase type
        if( Math.abs(phase) <  50 && phase < 0 ) {
			PhaseName = "waning crescent";
		}else if( Math.abs(phase) <  50 && phase > 0 ) {
			PhaseName = "waxing crescent";
		}else if( Math.abs(phase) < 100 && phase < 0 ) {
			PhaseName = "waning gibbous";
		}else if( Math.abs(phase) < 100 && phase > 0 ) {
			PhaseName = "waxing gibbous";
		}else {
		    PhaseName = "ERROR, no moon phase was found";
		}
    }
    if (PriPhaseOccurs == 1){
        var sTime; //string[6]
        sTime = convert_time_to_string(PriPhaseTime);
        console.log("  phase is " + PhaseName + " at " + sTime + ", ");
		dataOutput.innerHTML += "<br>phase is <b>" + PhaseName + "</b> at <b>" + sTime + "<br>\n";
    }else{
        console.log("  phase is " + PhaseName + ", ");
		dataOutput.innerHTML += "<br>phase is <b>" + PhaseName + "</b><br>";
    }
    console.log("" + illumin.toFixed(1) + " illuminated, ");
	dataOutput.innerHTML += "<b>" + illumin.toFixed(1) + "</b> illuminated,<br>";
    console.log("" + age.toFixed(1) + " days since new");
	dataOutput.innerHTML += "<b>" + age.toFixed(1) + "</b> days since new<br>";
    return illumin;
}

/******************************************************************************/
function get_transit (/*int*/ object, /*double*/ mjd0, /*int*/ hour, /*double*/ ourlong) /* as double */
{
	var ra = 0.0; //double
	var dec = 0.0;   //not used here but the pos functions return it. //double
	var instant, t; //double
	var lha;			//local hour angle //double
	var loc_transit;	// transit time, return value. //double
	var min = 0; //int
    var hourarray = [24]; //int[24]
    var minarray = [60]; //int[60]
    var LA;  //local angle //double
    var sLA;    //sign of angle //int
    var mintime; //double

    //loop through all 24 hours of the day and store the sign of the angle in an array
    //actually loop through 25 hours if we reach the 25th hour with out a transit then no transit condition today.

	while (hour < 25.0){
		instant = mjd0 + hour / 24.0;
		t = (instant - 51544.5) / 36525;
		if (object == 0) {
			[ra, dec] = get_moon_pos (t);
		}else {
			[ra, dec] = get_sun_pos (t);
		}
		lha = (lmst(instant, ourlong) - ra);
        LA = lha * 15.04107;    //convert hour angle to degrees
        sLA = LA/Math.abs(LA);      //sign of angle
		hourarray[hour] = sLA;
		hour++;
	}
    //search array for the when the angle first goes from negative to positive
    var i = 0; //int
    while (i < 25){
        loc_transit = i;
        if (hourarray[i] - hourarray[i+1] == -2) {
            //we found our hour
            break;
        }
        i++;
    }
    //check for no transit, return zero
    if (loc_transit > 23) {
        // no transit today
        loc_transit = 0.0;
        return loc_transit;
    }

    //loop through all 60 minutes of the hour and store sign of the angle in an array
	mintime = loc_transit;
	while (min < 60){
		instant = mjd0 + mintime / 24.0;
		t = (instant - 51544.5) / 36525;
		if (object == 0) {
			[ra, dec] = get_moon_pos (t);
		} else {
			[ra, dec] = get_sun_pos (t);
		}
		lha = (lmst(instant, ourlong) - ra);
		LA = lha * 15.04107;
        sLA = Math.floor(LA/Math.abs(LA));
        minarray[min] = sLA;
		min++;
        mintime = mintime + 0.016667;		//increment 1 minute
	}

    i = 0;
	while (i < 60){
        if (minarray[i] - minarray[i+1] == -2) {
            //we found our min
            break;
        }
        i++;
        loc_transit = loc_transit + 0.016667;
    }
    return loc_transit;
}

function get_underfoot (/*double*/ date, /*double*/ underlong) //as double
{
	var moonunderTime; //double
	var doesUnderfoot; //int
	var eventName; //string[11]
	moonunderTime = get_transit (0, date, 0, underlong);
	if (moonunderTime != 0.0) {
		eventName = "under foot";
		display_event_time(moonunderTime, eventName);
	} else {
		console.log("Moon does not transit under foot");
	}
	return moonunderTime;
}

/******************************************************************************/
function get_moon_long (/*double*/ t) //as double
{
    //console.log("get_moon_long with t = "+t);
	var ARC = 206264.8062; //double
	var COSEPS = 0.91748; //double
	var SINEPS = 0.39778; //double
	var L0, L, LS, d, F; //double
	var moonlong; //double
	L0 = fpart(.606433 + 1336.855225 * t);    //'mean long Moon in revs
	L = twoPI * fpart(.374897 + 1325.55241 * t); //'mean anomaly of Moon
	LS = twoPI * fpart(.993133 + 99.997361 * t); //'mean anomaly of Sun
	d = twoPI * fpart(.827361 + 1236.853086 * t); //'diff longitude sun and moon
	F = twoPI * fpart(.259086 + 1342.227825 * t); //'mean arg latitude
	//' longitude correction terms
	var dL, h; //double
	dL = 22640 * Math.sin(L) - 4586 * Math.sin(L - 2 * d);
	dL = dL + 2370 * Math.sin(2 * d) + 769 * Math.sin(2 * L);
	dL = dL - 668 * Math.sin(LS) - 412 * Math.sin(2 * F);
	dL = dL - 212 * Math.sin(2 * L - 2 * d) - 206 * Math.sin(L + LS - 2 * d);
	dL = dL + 192 * Math.sin(L + 2 * d) - 165 * Math.sin(LS - 2 * d);
	dL = dL - 125 * Math.sin(d) - 110 * Math.sin(L + LS);
	dL = dL + 148 * Math.sin(L - LS) - 55 * Math.sin(2 * F - 2 * d);
    //console.log("L0="+L0+" dL="+dL);
	//' latitude arguments
	var S, N, lmoon, bmoon; //double
	S = F + (dL + 412 * Math.sin(2 * F) + 541 * Math.sin(LS)) / ARC;
	h = F - 2 * d;
	//' latitude correction terms
	N = -526 * Math.sin(h) + 44 * Math.sin(L + h) - 31 * Math.sin(h - L) - 23 * Math.sin(LS + h);
	N = N + 11 * Math.sin(h - LS) - 25 * Math.sin(F - 2 * L) + 21 * Math.sin(F - L);
	lmoon = twoPI * fpart(L0 + dL / 1296000); //  'Lat in rads
	bmoon = (18520 * Math.sin(S) + N) / ARC;  //  'long in rads
	moonlong = lmoon * RADEG;
    return moonlong;
}

/******************************************************************************/
function get_sun_long (/*double*/ t) //as double
{
	var COSEPS = 0.91748; //double
	var SINEPS = 0.39778; //double
	var m, dL, L, rho, sl; //double
	var RA, DEC; //double
	var x, y, z; //double
	var sunlong; //double
	m = twoPI * fpart(0.993133 + 99.997361 * t);        //Mean anomaly
	dL = 6893 * Math.sin(m) + 72 * Math.sin(2 * m);          //Eq centre
	L = twoPI * fpart(0.7859453 + m / twoPI + (6191.2 * t + dL) / 1296000);
	sunlong = L * RADEG;
	return sunlong;
}


/******************************************************************************/