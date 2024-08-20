/** A Particle system to create the explosion effect */
class Particle {
    constructor(ctx, x, y, radius, dx, dy) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.alpha = 1;
    }
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = 'orange';
        /* Begins or reset the path for the arc created */
        this.ctx.beginPath();
        /* Some curve is created*/
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fill();
        /* Restore the recent canvas context*/
        this.ctx.restore();
    }
    update() {
        this.draw();
        this.alpha -= 0.01;
        this.x += this.dx;
        this.y += this.dy;
    }
}

/** A Particle system to create the bloom (misssed) effect */
class Drop {
    constructor(ctx, x, y, radius, dx, dy) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.alpha = 1;
    }
    draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.alpha;
        this.ctx.fillStyle = 'darkblue';
        /* Begins or reset the path for the arc created */
        this.ctx.beginPath();
        /* Some curve is created*/
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fill();
        /* Restore the recent canvas context*/
        this.ctx.restore();
    }
    update() {
        this.draw();
        this.alpha -= 0.01;
        this.x += this.dx;
        this.y += this.dy;
    }
}