// Defines a complex number and its operations
class Complex {
    // Constructor to create a complex number with real (a) and imaginary (b) parts
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
  
    // All function return the result as a new Complex number
    
    // Adds this complex number with another
    add(other) {
        return new Complex(this.a + other.a, this.b + other.b);
    }
  
    // Subtracts another complex number from this one
    sub(other) {
        return new Complex(this.a - other.a, this.b - other.b);
    }
  
    // Scales this complex number by a real number value
    scale(value) {
        return new Complex(this.a * value, this.b * value);
    }
  
    // Multiplies this complex number with another, using the formula (ac-bd) + (ad+bc)i
    mult(other) {
        let a = this.a * other.a - this.b * other.b;
        let b = this.a * other.b + other.a * this.b;
        return new Complex(a, b);
    }
  
    // Calculates the square root of this complex number
    sqrt() {
        // Convert to polar form
        let m = Math.sqrt(this.a * this.a + this.b * this.b);
        let angle = Math.atan2(this.b, this.a);
        // Calculate square root of magnitude and use half the angle for square root
        m = Math.sqrt(m);
        angle = angle / 2;
        // Back to rectangular form
        return new Complex(m * Math.cos(angle), m * Math.sin(angle));
    }
}
  