// Toothpicks
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/126-toothpicks.html
// https://youtu.be/-OL_sw2MiYw

class Toothpick {

    constructor(x, y, d) {
        this.newPick = true;
        if(useHSL){
            colorMode(HSL, 500);
            this.color = color(count,400,200);
        }else{
            colorMode(RGB);
            this.color = color(0);
        }
        this.dir = d;
        if (this.dir == 1) {
            this.ax = x - len / 2;
            this.bx = x + len / 2;
            this.ay = y;
            this.by = y;
        } else {
            this.ax = x;
            this.bx = x;
            this.ay = y - len / 2;
            this.by = y + len / 2;
        }
    }
  
  
    intersects(x,y) {
        if (this.ax == x && this.ay == y) {
                return true;
        } else if (this.bx == x && this.by == y) {
                return true;
        } else {
                return false;
        }
    }
  
  
  
     createA(others) {
        let available = true;
        for (let other of others) {
            if (other != this && other.intersects(this.ax, this.ay)) {
                available = false;
                break;
            }
        }
        if (available) {
            return new Toothpick(this.ax, this.ay, this.dir * -1);
        } else {
            return null;
        }
    }
  
    createB(others) {
        let available = true;
        for (let other of others) {
            if (other != this && other.intersects(this.bx, this.by)) {
                available = false;
                break;
            }
        }
        if (available) {
            return new Toothpick(this.bx, this.by, this.dir * -1);
        } else {
            return null;
        }
    }
  
    show(factor) {
        stroke(this.color);
        if (this.newPick) {
            stroke(255, 0, 0);
        }
        strokeWeight(1 / factor);
        var dx = this.dir==1?2:0;
        var dy = this.dir==1?0:2;
        line(this.ax+dx, this.ay+dy, this.bx-dx, this.by-dy);
    }
}