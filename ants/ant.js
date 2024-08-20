class Ant{
    constructor(x, y, dir, size){
        this.pos = new Victor(x, y);
        this.state = 1;//0=stopped 1=searching 2=delivery
        this.senseRange = 40;
        this.dir = dir;
        this.speed = 1;
        this.img = new Image();
        this.imgFood = new Image();
        this.img.src = "ant2.png";
        this.imgFood.src = "ant3.png";
        this.size = size;
        this.step = 0;
        this.showSense = false;
    }

    update(){
        this.sense();//changes its direction
        if(this.pos.x >= canvas.width || this.pos.x <= 0)this.dir.invertX();
        if(this.pos.y >= canvas.height || this.pos.y <= 0)this.dir.invertY();
        if(this.state == 1){
            var rand = new Victor(0.05*(Math.random()-0.5), 0.05*(Math.random()-0.5));
            this.dir.add(rand).normalize();
        }
        this.pos.x += this.dir.x * this.speed;
        this.pos.y += this.dir.y * this.speed;
        this.step++;
        if(this.step % 3 == 0){
            var cr = getGridByXY(this.pos.x,this.pos.y);
            if(this.state == 1){
                feroHome[cr.col][cr.row] += 1;
            }else if(this.state == 2){
                feroFood[cr.col][cr.row] += 1;
            }
            this.step=0;
        }
    }

    show(ctx){
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(Math.atan2(this.dir.y, this.dir.x)+PI_2);
        ctx.drawImage(this.state==1?this.img:this.imgFood, -this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
        if(this.showSense){
            var cr = getGridByXY(this.pos.x, this.pos.y);
            var c = cr.col;
            var r = cr.row;
            var prox = 5;
            ctx.beginPath();
            ctx.strokeStyle = "black";
            ctx.rect((c-5)*gridSize, (r-5)*gridSize, 10*gridSize, 10*gridSize);
            ctx.stroke();
        }
    }

    sense(){
        if(this.state == 1){
            for(var i = 0 ; i < food.length; i++){
                if(this.pos.distance(food[i].pos) < 10){
                    this.state = 2;
                    this.dir = nest.clone().subtract(this.pos).normalize();
                    food[i].strength--;
                    //console.log("got food");
                    return;
                }
                if(this.pos.distance(food[i].pos) < this.senseRange){
                    var dir = food[i].pos.clone().subtract(this.pos).direction();
                    if(Math.abs(this.dir.direction()-dir) < PI_3){
                        this.dir = food[i].pos.clone().subtract(this.pos).normalize();
                        //console.log("sense food: "+this.dir);
                        return;
                    }
                }
            }
            //TODO
            var cr = getGridByXY(this.pos.x, this.pos.y);
            var c = cr.col;
            var r = cr.row;
            var prox = 5;//Math.round(this.senseRange / gridSize);
            var minFero = 0;
            var row, col;
            for(var i=-prox; i< prox+1; i++){
                for(var j=-prox; j< prox+1; j++){
                    if(c+i>=0 && c+i<cols && r+j>=0 && r+j<rows){
                        if(feroFood[c+i][r+j]>0 && feroFood[c+i][r+j]<minFero){
                            minFero = feroFood[c+i][r+j];
                            col = c+i;
                            row = r+j;
                        }
                    }
                }
            }
            if(col != undefined && row != undefined){
                var target = new Victor(col * gridSize + gridSize/2, row * gridSize + gridSize/2);
                this.dir = target.subtract(this.pos).normalize();
            }
           
        }
        if(this.state == 2){
            if(nest.distance(this.pos) <= nestRadius){
                this.state = 1;
                nestFood++;
                this.dir.invert();
                return;
            }
            if(nest.distance(this.pos) <= 2 * this.senseRange){
                this.dir = nest.clone().subtract(this.pos).normalize();
                return;
            }
        }
        
    }

}