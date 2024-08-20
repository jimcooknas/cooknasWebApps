//Pure JS Solunar table calculator by Timon Orawski
//https://github.com/timonorawski/solunar

// minor times = 1 hr at moonrise and moon set
// major times = 2 hrs at moon transits
// daily action:

var ANHOUROFMILLIS = 60*60*1000;

var getMoonTransitTimes = function(date, lat , lng) {
    // TODO: this is brute force, didn't have time to find the right algorithm - implement properly
    var rc = {/*"debug": {}, "debug2": {},"debug3": {}, "debug4": {}, */"transits": []};
    var sign = 1, i, j;
    for (i = 0; i <= 25; i++) {
        var date2 = new Date(date.getTime());
        date2.setHours(i);
        date2.setMinutes(0);
        date2.setSeconds(0);
        date2.setMilliseconds(0);
        var moontimes = SunCalc.getMoonPosition(date2, lat, lng);
        if (i === 0) {
            sign = Math.sign(moontimes.azimuth);
        }
        //rc.debug[date2] = moontimes;
        if (sign != Math.sign(moontimes.azimuth)) {
            //found the changeover hour
            changeover = i;
            break;
        }
    }
    sign = true;
    for (j = 0; j < 60; j++) {
        var date3 = new Date(date.getTime());
        date3.setHours(i-1);
        date3.setMinutes(j);
        date3.setSeconds(0);
        date2.setMilliseconds(0);
        var moontimes = SunCalc.getMoonPosition(date3, lat, lng);
        //rc.debug2[date3] = moontimes;
        if (j === 0) {
            if (moontimes.azimuth < 0) {
                sign = false;
            }
        }
        if (sign != (moontimes.azimuth > 0)) {
            //found the changeover minute
            changeover = j;
            rc.transits.push({'time': date3, 'overhead': (Math.sign(moontimes.altitude) > 0)});
            break;
        }
    }
    var start = i;
    for (; i <= 25; i++) {
        var date2 = new Date(date.getTime());
        date2.setHours(i);
        date2.setMinutes(0);
        date2.setSeconds(0);
        date2.setMilliseconds(0);
        var moontimes = SunCalc.getMoonPosition(date2, lat, lng);
        if (i === start) {
            sign = Math.sign(moontimes.azimuth);
        }
        //rc.debug3[date2] = moontimes;
        if (sign != Math.sign(moontimes.azimuth)) {
            //found the changeover hour
            changeover = i;
            break;
        }
    }
    if (i < 25) {
        sign = true;
        for (var j = 0; j < 60; j++) {
            var date3 = new Date(date.getTime());
            date3.setHours(i-1);
            date3.setMinutes(j);
            date3.setSeconds(0);
            date2.setMilliseconds(0);
            var moontimes = SunCalc.getMoonPosition(date3, lat, lng);
            //rc.debug4[date3] = moontimes;
            if (j === 0) {
                if (moontimes.azimuth < 0) {
                    sign = false;
                }
            }
            if (sign != (moontimes.azimuth > 0)) {
                //found the changeover minute
                changeover = j;
                rc.transits.push({'time': date3, 'overhead': (Math.sign(moontimes.altitude) > 0)});
                break;
            }
        }
    }
    return rc;
};

var getMoonPhase = function(date) {
    var morning = new Date(date.getTime());
    morning.setHours(0);
    morning.setMinutes(0);
    morning.setMilliseconds(0);
    var night = new Date(morning.getTime());
    night.setHours(24);
    var morningphase = SunCalc.getMoonIllumination(morning).phase,
        nightphase = SunCalc.getMoonIllumination(night).phase,
        phase = SunCalc.getMoonIllumination(date);
    if (morningphase > 0.75 && morningphase <= 1 && nightphase >= 0 && nightphase < 0.25) {
        return {"phase": 0, "string": "New Moon", "phaseno":phase.phase};
        //return "New Moon";
    } else if (morningphase <= 0.25 && nightphase >= 0.25) {
        return {"phase": 1, "string": "First Quarter", "phaseno":phase.phase};
        //return "First Quarter";
    } else if (morningphase <= 0.75 && nightphase >= 0.75) {
        return {"phase": 2, "string": "Last Quarter", "phaseno":phase.phase};
    } else if (morningphase <= 0.5 && nightphase >= 0.5) {
        return {"phase": 3, "string": "Full Moon", "phaseno":phase.phase};
    } else if (phase.phase < 0.25) {
        return {"phase": 4, "string": "Waxing Crescent", "phaseno":phase.phase};
    } else if (phase.phase < 0.5) {
        return {"phase": 5, "string": "Waxing Gibbous", "phaseno":phase.phase};
    } else if (phase.phase < 0.75) {
        return {"phase": 6, "string": "Waning Gibbous", "phaseno":phase.phase};
    } else if (phase.phase < 1) {
        return {"phase": 7, "string": "Waning Crescent", "phaseno":phase.phase};
    }
};

//export 
function getTimesSolunar(date, lat, lng) {
    var suntimes = SunCalc.getTimes(date, lat, lng),
        moontimes = SunCalc.getMoonTimes(date, lat, lng),
        weightings = {solar: 0};
    var testPeriod = function(period) {
        if (weightings.solar < 2) {
            if (Math.abs(period.start.getTime() - rc.sun.sunrise.getTime()) < 0.5*ANHOUROFMILLIS) {
                weightings.solar += 1;
                period.important = "start-sunrise";
            } else if (Math.abs(period.start.getTime() - rc.sun.sunset.getTime()) < 0.5*ANHOUROFMILLIS) {
                weightings.solar += 1;
                period.important = "start-sunset";
            }else if (Math.abs(period.end.getTime() - rc.sun.sunrise.getTime()) < 0.5*ANHOUROFMILLIS) {
                weightings.solar += 1;
                period.important = "end-sunrise";
            } else if (Math.abs(period.end.getTime() - rc.sun.sunset.getTime()) < 0.5*ANHOUROFMILLIS) {
                weightings.solar += 1;
                period.important = "end-sunset";
            }
        }
        period.start = period.start;
        period.end = period.end;
    };
    var phase = getMoonPhase(date);
    var rc = {
        "action": 0,
        "moon": {
            "phase": phase.string,
            "phaseno":phase.phaseno,
            "transits": getMoonTransitTimes(date, lat, lng).transits
        },
        "sun": suntimes
    };
    if (!(moontimes.alwaysDown || moontimes.alwaysUp)) {
        // calculate minor times
        rc.minor = [];
        if (moontimes.rise) {
            rc.moon.rise = moontimes.rise;
            var period = {
                start: new Date(moontimes.rise.getTime() - 0.5*ANHOUROFMILLIS),
                end: new Date(moontimes.rise.getTime() + 0.5*ANHOUROFMILLIS)
            };
            testPeriod(period);
            rc.minor.push(period);
        }
        if (moontimes.set) {
            rc.moon.set = moontimes.set;
            var period = {
                start: new Date(moontimes.set.getTime() - 0.5*ANHOUROFMILLIS),
                end: new Date(moontimes.set.getTime() + 0.5*ANHOUROFMILLIS)
            };
            testPeriod(period);
            rc.minor.push(period);
        }
    }
    if (rc.moon.transits.length > 0) {
        rc.major = [];
        for (var i = 0; i < rc.moon.transits.length; i++) {
            var period = {
                start: new Date(rc.moon.transits[i].time.getTime() - ANHOUROFMILLIS),
                end: new Date(rc.moon.transits[i].time.getTime() + ANHOUROFMILLIS),
                overhead: rc.moon.transits[i].overhead
            };
            testPeriod(period);
            rc.major.push(period);
        }
    }
    // calculate action
    if (phase.phase == 0 || phase.phase == 3) {
        rc.action += 3;
    } else {
        if (rc.moon.phaseno > 0.39 && rc.moon.phaseno < 0.61 || ((rc.moon.phaseno + 0.5) % 1) > 0.39 && ((rc.moon.phaseno + 0.5) % 1) < 0.61) {
            rc.action += 1;
        }
        if (rc.moon.phaseno > 0.42 && rc.moon.phaseno < 0.55 || ((rc.moon.phaseno + 0.5) % 1) > 0.42 && ((rc.moon.phaseno + 0.5) % 1) < 0.55) {
            rc.action += 1
        }
    }
    rc.action += weightings.solar;
    //rc.weightings = weightings;
    /*
        Scale is 0-5 with 5 being the best, initially scale is set to 0.
        add 1 for each solunar period that occurs within 30 minutes of sunset or sunrise, max of 2.
        add 1 id day is with in approx 3 days of a new or full moon.
        add 2 if day is with in approx 2 days of a new or full moon.
        add 3 if day is a full or new moon.
    */
    //console.log(rc);
    return rc;
}