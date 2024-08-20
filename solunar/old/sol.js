/*
 *      Translated from sol.c to javascript by Cooknas (sol.js)
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


function sol_get_minor1 ( /*double*/ moonrise) //as string[2]
{
    var mnst1, mnsp1; //char[6]
    var minorstart1, minorstop1; //double
    minorstart1 = moonrise - 1.0;
    minorstop1 = moonrise + 1.0;
    mnst1 = convert_time_to_string(minorstart1);
    mnsp1 = convert_time_to_string(minorstop1);
    return [mnst1, mnsp1];
}
//******************************************************************************

function sol_get_minor2 (/*double*/ moonset)  //as string[2]
{
    var mnst2, mnsp2///string[6]
    var minorstart2, minorstop2; //double
    minorstart2 = moonset - 1.0;
    minorstop2 = moonset + 1.0;
    mnst2 = convert_time_to_string(minorstart2);
    mnsp2 = convert_time_to_string( minorstop2);
    return [mnst2, mnsp2];
}
//******************************************************************************

function sol_get_major1(/*double*/ moontransit)
{
    var mjst1, mjsp1 //string[6]
    var majorstart1, majorstop1; //double
    majorstart1 = moontransit - 1.5;
    majorstop1 = moontransit + 1.5;
    mjst1 = convert_time_to_string( majorstart1);
    mjsp1 = convert_time_to_string(majorstop1);
    return [mjst1, mjsp1];
}
//******************************************************************************


function sol_get_major2(/*double*/ moontransit)
{
    var mjst2, mjsp2; //as string[6]
    var majorstart2, majorstop2; //double
    majorstart2 = moontransit - 1.5;
    majorstop2 = moontransit + 1.5;
    mjst2 = convert_time_to_string(majorstart2);
    mjsp2 = convert_time_to_string(majorstop2);
    return [mjst2, mjsp2];
}

//******************************************************************************

function sol_display_majors (/*char[6]*/ mjst1, /*char[6]*/ mjsp1, /*char[6]*/ mjst2, /*char[6]*/ mjsp2, /*double*/ moontransit, /*double*/ moonunder)
{
    //console.log("\n\n");
    console.log("Major Times");
    infoHours += "Major Times<br>"
    /*display earlier major time first*/
    if (moontransit < moonunder){
        console.log("" + mjst1 +" - " + mjsp1);
        console.log("" + mjst2 +" - " + mjsp2);
        if(mjst1!="00:00" || mjsp1!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mjst1 +" - " + mjsp1 + "</b><br></p>";
        if(mjst2!="00:00" || mjsp2!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mjst2 +" - " + mjsp2 + "</b><br></p>";
    } else {
        console.log("" + mjst2 + " - " + mjsp2);
        console.log("" + mjst1 + " - " + mjsp1);
        if(mjst1!="00:00" || mjsp1!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mjst2 +" - " + mjsp2 + "</b><br></p>";
        if(mjst2!="00:00" || mjsp2!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mjst1 +" - " + mjsp1 + "</b><br></p>";
    }
    return;
}
//******************************************************************************

function convert_time_to_string (/*double*/ doubletime) //as string
{
    var stringtime; //char[6]       
    var i, d; //double
    /*split the time into hours (i) and minutes (d)*/
    [i, d] = modf(doubletime);
    d = d * 60;
    if (d >= 59.5) {
        i = i + 1;
        d = 0;
    }
    /*convert times to a string*/
    stringtime = (i < 9.5 ? "0":"") + i.toFixed(0) + (d < 9.5 ? ":0" : ":") + d.toFixed(0);
    return stringtime;
}
//******************************************************************************

function sol_display_minors (/*char[6]*/ mnst1, /*char[6]*/ mnsp1, /*char[6]*/ mnst2,
            /*char[6]*/ mnsp2, /*double*/ moonrise, /*double*/ moonset)
{
    //console.log("\n");
    console.log("Minor Times");
    infoHours += "Minor Times<br>"
    /*display earlier minor time first*/
    if (moonrise < moonset){
        console.log("" + mnst1 + " - " + mnsp1);
        console.log("" + mnst2 + " - " + mnsp2);
        if(mnst1!="00:00" || mnsp1!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mnst1 + " - " + mnsp1 + "</b><br></p>";
        if(mnst2!="00:00" || mnsp2!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mnst2 + " - " + mnsp2 + "</b><br></p>";
    } else {
        console.log("" + mnst2 + " - " + mnsp2);
        console.log("" + mnst1 + " - " + mnsp1);
        if(mnst2!="00:00" || mnsp2!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mnst2 + " - " + mnsp2 + "</b><br></p>";
        if(mnst1!="00:00" || mnsp1!="00:00")
            infoHours += "<p style='text-align: center'><b>" + mnst1 + " - " + mnsp1 + "</b><br></p>";
    }
    return;
}
//******************************************************************************

function phase_day_scale (/*double*/ moonphase) //as int
{
    var scale = 0; //int
    if( Math.abs(moonphase) <  0.9 ) {		//new
        scale = 3;
    } else if( Math.abs(moonphase) <  6.0 ) {
        scale = 2;
    } else if( Math.abs(moonphase) <  9.9 ) {
        scale = 1;
    } else if( Math.abs(moonphase) > 99 ) {		//full
        scale = 3;
    } else if( Math.abs(moonphase) > 94 ) {
        scale = 2;
    } else if( Math.abs(moonphase) > 90.1 ) {
        scale = 1;
    } else {
        scale = 0;
    }
    return scale;
}
//******************************************************************************

function sol_get_dayscale (/*double*/ moonrise, /*double*/ moonset, /*double*/ moontransit,
            /*double*/ moonunder, /*double*/ sunrise, /*double*/ sunset) //as int
{
    var locsoldayscale = 0; //int
    //check minor1 and sunrise
    if ((sunrise >= (moonrise - 1.0)) && (sunrise <= (moonrise + 1.0))){
        locsoldayscale++;
    }
    //check minor1 and sunset
    if ((sunset >= (moonrise - 1.0)) && (sunset <= (moonrise + 1.0))){
        locsoldayscale++;
    }
    //check minor2 and sunrise
    if ((sunrise >= (moonset - 1.0)) && (sunrise <= (moonset + 1.0))){
        locsoldayscale++;
    }
    //check minor2 and sunset
    if ((sunset >= (moonset - 1.0)) && (sunset <= (moonset + 1.0))){
        locsoldayscale++;
    }
    //check major1 and sunrise
    if ((sunrise >= (moontransit - 2.0)) && (sunrise <= (moontransit + 2.0))){
        locsoldayscale++;
    }
    //check major1 and sunset
    if ((sunset >= (moontransit - 2.0)) && (sunset <= (moontransit + 2.0))){
        locsoldayscale++;
    }
    //check major2 and sunrise
    if ((sunrise >= (moonunder - 2.0)) && (sunrise <= (moonunder + 2.0))){
        locsoldayscale++;
    }
    //check major2 and sunset
    if ((sunset >= (moonunder - 2.0)) && (sunset <= (moonunder + 2.0))){
        locsoldayscale++;
    }

    //catch a >2 scale, tho this shouldn't happen.
    if (locsoldayscale > 2) {
        locsoldayscale = 2;
    }

    return locsoldayscale;
}
/*********************************************************************/

function sol_display_dayscale (/*int*/ soldayscale, /*int*/ phasedayscale)
{
    var dayscale; //int
    //printf ("\nphase scale = %d", phasedayscale);
    //printf ("\nsol scale = %d", soldayscale);
    dayscale = (soldayscale + phasedayscale);
    console.log("Todays action is rated a " + dayscale + " (scale is 0 thru 5, 5 is the best)");
    return dayscale;
}
