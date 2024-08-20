// Defines a circle in terms of its bend (curvature) and center point
class Circle {
    constructor(bend, x, y) {
        // Center is stored as a Complex number
        this.center = new Complex(x, y);
        this.bend = bend;
        // Radius is derived from the absolute value of the reciprocal of bend
        this.radius = Math.abs(1 / this.bend);
        var r,g,b;
        if(initColor!=undefined){
            r = parseInt(initColor.substring(1,3), 16)*(1-this.radius/initRadius); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
            g = parseInt(initColor.substring(3,5), 16)*(1-this.radius/initRadius);
            b = parseInt(initColor.substring(5,7), 16)*(1-this.radius/initRadius);
        }else{
            r = 255;
            g = 255;
            b = 255;
        }
        this.color = 'rgba('+r+','+g+','+b+', 100)';
    }
  
    show(ctx) {
        //stroke(0);
        //noFill();
        // Draws the circle with its center at (a, b) and diameter of radius * 2
        //circle(this.center.a, this.center.b, this.radius * 2);
        ctx.beginPath();
        ctx.arc(this.center.a, this.center.b, this.radius, 0, 2 * Math.PI, false);
        ctx.lineWidth=1;
        ctx.strokeStyle = '#000000';
        if(useColor){
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        ctx.stroke();
    }
  
    // Computes the distance between this circle and another circle
    dist(other) {
        return dist(this.center.a, this.center.b, other.center.a, other.center.b);
    }
}
  
  