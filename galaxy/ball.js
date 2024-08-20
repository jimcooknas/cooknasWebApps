class Balls {
    constructor(radius, pos, vel, scene)
    {
        // physics data 

        this.radius = radius;
        this.pos = pos;
        this.prevPos = pos;
        this.vel = vel;
        this.matrix = new THREE.Matrix4();
        this.numBalls = Math.floor(pos.length / 3);
        this.hash = new Hash(2.0 * radius, this.numBalls);
        this.showCollisions = false;

        this.normal = new Float32Array(3);

        // visual mesh

        var geometry = new THREE.SphereGeometry( radius, 8, 8 );
        var material = new THREE.MeshPhongMaterial();

        this.visMesh = new THREE.InstancedMesh( geometry, material, this.numBalls );
        this.visMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); 

        this.ballColor = new THREE.Color(0xFF0000);
        this.ballCollisionColor = new THREE.Color(0xFF8000);

        var colors = new Float32Array(3 * this.numBalls);
        this.visMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3, false, 1);
        for (var i = 0; i < this.numBalls; i++) 
            this.visMesh.setColorAt(i, this.ballColor);

        threeScene.add(this.visMesh);

        this.updateMesh();
    }

    updateMesh()
    {
        for (var i = 0; i < this.numBalls; i++) {
            this.matrix.makeTranslation(this.pos[3 * i], this.pos[3 * i + 1], this.pos[3 * i + 2]);
            this.visMesh.setMatrixAt(i, this.matrix);
        }
        this.visMesh.instanceMatrix.needsUpdate = true;
        this.visMesh.instanceColor.needsUpdate = true;
    }

    simulate(dt, gravity, worldBounds)
    {
        var minDist = 2.0 * this.radius;
        // integrate
        for (var i = 0; i < this.numBalls; i++) {
            vecAdd(this.vel, i, gravity, 0, dt);
            vecCopy(this.prevPos, i, this.pos, i);
            vecAdd(this.pos, i, this.vel, i, dt);
        }
        this.hash.create(this.pos);
        this.updateMesh();
    }

    
}