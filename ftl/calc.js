//constants for all cases
const gravityConst = 1.03;  //in ly
const c = 1.0;              //speed of light in ly/y

//hyperbolic functions
//Sinh
function sh(x){
    return Math.sinh(x);
}

//Cosh
function ch(x){
    return Math.cosh(x);
}

//Tanh
function th(x){
    return Math.tanh(x);
}

//Inverse Sinh
function ish(x){
    return Math.asinh(x);
}

//Inverse Cosh
function ich(x){
    return Math.acosh(x);
}

//Proper Time from distance 
function getProperTime(d){
    return (c/(gravityConst*acc))*ich(gravityConst*acc*d/(c*c)+1);
}

function getProperTimeStop(d){
    return (2*c/(gravityConst*acc))*ich(gravityConst*acc*d/(2*c*c)+1);
}

//Distance from Proper Time
function getDistance(proper){
    return (c*c/(gravityConst*acc))*(ch(gravityConst*acc*proper/c)-1);
}

//Velocity from Proper Time
function getVelocity(proper, maxProp){
    if(maxProp!=undefined){
        if(proper<=maxProp/2){
            return c*th(gravityConst*acc*proper/c);
        }else{
            return c*th(gravityConst*acc*(maxProp-proper)/c);
        }
    }else{
        return c*th(gravityConst*acc*proper/c);
    }
}

//Lorentz factor from Proper Time
function getGamma(proper){
    return ch(gravityConst*acc*proper/c);
}

//Earth Time from Proper Time
function getEarthTime(proper){
    return (c/(gravityConst*acc))*sh(gravityConst*acc*proper/c);
}

//Fuel needed for trip (in kg/kg paylod)
function getFuel(proper){
    return Math.exp(gravityConst*acc*proper/c)-1;
}
