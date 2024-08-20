class Snake {
  
    constructor() {
        this.body = [];
        this.body[0] = createVector(floor(w/2), floor(h/2));
        this.xdir = 0;
        this.ydir = 0;
        this.len = 0;
        this.lastX1 = this.body[0].x + 0.25;
        this.lastY1 = this.body[0].y + 0.5;
        this.lastX2 = this.body[0].x + 0.65;
        this.lastY2 = this.body[0].y + 0.5;
    }
    
    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }
    
    update() {
        let head = this.body[this.body.length-1].copy();
        if(!useEdges){
            if(head.x + this.xdir > w-1 || head.x + this.xdir < 0 || head.y + this.ydir > h-1 || head.y + this.ydir < 0){
                //stop running
            }else{
                this.body.shift();
                head.x += this.xdir;
                head.y += this.ydir;
                this.body.push(head);
            }
        }else{
            this.body.shift();
            head.x += this.xdir;
            head.y += this.ydir;
            this.body.push(head);
        }
    }
    
    grow() {
        let head = this.body[this.body.length-1].copy();
        this.len++;
        this.body.push(head);
    }
    
    endGame() {
        let x = this.body[this.body.length-1].x;
        let y = this.body[this.body.length-1].y;
        if(useEdges){
            if(x > w-1 || x < 0 || y > h-1 || y < 0) {
                return true;
            }
        }
        for(let i = 0; i < this.body.length-1; i++) {
            let part = this.body[i];
            if(part.x == x && part.y == y) {
                return true;
            }
        }
        return false;
    }
    
    eat(pos) {
        let x = this.body[this.body.length-1].x;
        let y = this.body[this.body.length-1].y;
        if(x == pos.x && y == pos.y) {
            this.grow();
            return true;
        }
        return false;
    }
    
    show() {
        if(this.body.length == 1){
            fill(0);
            noStroke();
            circle(this.body[0].x+0.5, this.body[0].y+0.5, 0.8);
            if(this.xdir == 0 && this.ydir != 0){
                fill(255,0,0);
                noStroke();
                circle(this.body[0].x + 0.25, this.body[0].y+0.5, 0.20);
                circle(this.body[0].x + 0.65, this.body[0].y+0.5, 0.20);
            }else if(this.ydir == 0 && this.xdir != 0){
                fill(255,0,0);
                noStroke();
                circle(this.body[0].x+0.5, this.body[0].y + 0.25, 0.20);
                circle(this.body[0].x+0.5, this.body[0].y + 0.65, 0.20);
            }else{
                fill(255,0,0);
                noStroke();
                circle(this.lastX1, this.lastY1, 0.20);
                circle(this.lastX2, this.lastY2, 0.20);
            }
        }else{
            for(let i = 1; i < this.body.length; i++) {
                fill(0);
                stroke("#000000");
                strokeWeight(0.8);
                line(this.body[i-1].x+0.5, this.body[i-1].y+0.5, this.body[i].x+0.5, this.body[i].y+0.5);
                //rect(this.body[i].x, this.body[i].y, 1, 1);
            
                if(i == this.body.length-1){
                    if(this.xdir == 0 && this.ydir != 0){
                        fill(255,0,0);
                        noStroke();
                        circle(this.body[i].x + 0.25, this.body[i].y+0.5, 0.20);
                        circle(this.body[i].x + 0.65, this.body[i].y+0.5, 0.20);
                    }else if(this.ydir == 0 && this.xdir != 0){
                        fill(255,0,0);
                        noStroke();
                        circle(this.body[i].x+0.5, this.body[i].y + 0.25, 0.20);
                        circle(this.body[i].x+0.5, this.body[i].y + 0.65, 0.20);
                    }
                }
            }
        }
    }
  
  }