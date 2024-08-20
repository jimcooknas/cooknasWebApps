class ParticlePeak{
    constructor(numHor, numVer, centerIdx, radiusX, radiusZ, energy, velX, velZ){
        this.horizontal = numHor;
        this.scale = 1.0;
        this.updown = -1;
        this.step = Math.random()/20;
        this.vel = new THREE.Vector3(velX/10, 0, velZ/10);
        this.indices = [];
        this.energies = [];
        var energyVer = energy/radiusZ/2;
        var energyHor=energy/radiusX;
        var i=0;
        var pos = new THREE.Vector3(100*Math.random(), 0, 100*Math.random());
        this.points=[];
        
        //for(var i=-radiusX;i<=radiusX;i++){
            for(var j=-Math.PI;j<=Math.PI;j+=0.01){
                //this.indices.push(centerIdx+numHor*i+j);
                //pos = centerIdx+numHor*i+j
                var p = new THREE.Vector3(pos.x+2*Math.sin(j),pos.y+2*Math.cos(j), pos.z+2*j);
                this.points.push(p);
            }
            //console.log(this.points);
        //}
        //var shape = new THREE.Shape(this.points);
        //shape.autoClose = true;
        var geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        //var geometry = new THREE.BufferGeometry().setFromPoints(this.points);
        this.line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color:0xff0000}));
    }

    update(){
        for(var i=0;i<this.indices.length;i++){
            this.indices[i] += this.vel.x + this.horizontal * this.vel.z;
        }
    }
}