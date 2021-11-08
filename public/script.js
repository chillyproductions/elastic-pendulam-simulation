var canvas = document.getElementById("canvas");
var shadow = document.getElementById("shadow");
ctx = canvas.getContext('2d');
shadow_ctx = shadow.getContext('2d');
var p;

var actFriction = false;
var double = false;

class pendulum {
    center = [300, 200];
    springSpeed = 0;
    massSpeed = 0;
    g = 9.81;
    dots = [];
    counter = 0;    

    constructor(ang, deltaX, m, k, l0, color ,fps) {
        this.ang = ang * Math.PI / 180;
        this.k = k;
        this.l0 = l0/100;
        this.deltaX = deltaX/100 + m * this.g /k;
        this.m = m;
        this.fps = fps;
        this.color = color;
    }

    draw() {
        let size = 1000;
        ctx.fillStyle = this.color;
        shadow_ctx.fillStyle = this.color;
        //canvas
        if(double){
            if(this.color == "blue")
                ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        else
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        //spring
        ctx.beginPath();
        ctx.moveTo(this.center[0], this.center[1]);
        ctx.lineTo(this.center[0] + (this.l0 + this.deltaX) * size * Math.sin(this.ang), this.center[1] + (this.l0 + this.deltaX) * size * Math.cos(this.ang));
        ctx.stroke();
        //mass
        ctx.beginPath();
        ctx.arc(this.center[0] + (this.l0 + this.deltaX) * size * Math.sin(this.ang), this.center[1] + (this.l0 + this.deltaX) * size * Math.cos(this.ang), 10, 0, 2 * Math.PI);
        ctx.fill();

        //shadow
        shadow_ctx.beginPath();
        shadow_ctx.arc(this.center[0] + (this.l0 + this.deltaX) * size * Math.sin(this.ang), this.center[1] + (this.l0 + this.deltaX) * size * Math.cos(this.ang), 1, 0, 2 * Math.PI);
        shadow_ctx.fill();
    }

    update() {
        let massForce = -this.g * this.m * Math.sin(this.ang);
        if(actFriction){
            var friction = 2 * Math.pow(this.massSpeed, 2);
            massForce += (massForce > 0) ?  -friction : friction;
        }
        this.massAcc = massForce / this.m;
        this.massSpeed += this.massAcc / this.fps;
        let angleSpeed = this.massSpeed / (this.l0 + this.deltaX);
        this.ang += angleSpeed / this.fps;

        let springForce = -this.deltaX * this.k + this.m * this.g * Math.cos(this.ang);
        if(actFriction){
            friction =  2 * Math.pow(this.springSpeed, 2);
            springForce += (springForce > 0) ? friction : -friction;
        }
        let springAcc = springForce / this.m;

        this.springSpeed += springAcc / this.fps;;
        this.deltaX += this.springSpeed / this.fps;;
        
        
        if(this.counter % 100 == 0)
            this.dots.push([this.deltaX,this.ang]);
        
        this.counter++;
    }
}


function start() {
    let ang1 = document.getElementById("ang1").value;
    let dx1 = document.getElementById("dx1").value;
    let m1 = document.getElementById("m1").value;
    let k1 = document.getElementById("k1").value;
    let l1 = document.getElementById("l1").value;
    let ang2 = document.getElementById("ang2").value;
    let dx2 = document.getElementById("dx2").value;
    let m2 = document.getElementById("m2").value;
    let k2 = document.getElementById("k2").value;
    let l2 = document.getElementById("l2").value;

    if(document.getElementById("double").checked == true)
        double = true;

    // ANGLE(deg), DELTAX(cm), MASS(kg), K(N/m), L0(cm)
    let fps = 1000;
    p1 = new pendulum(ang1 , dx1, m1, k1, l1, "blue" ,fps);
    p1.draw();
    if(double){
        p2 = new pendulum(ang2 , dx2, m2, k2, l2, "red" ,fps);
        p2.draw();
    }
    setInterval(() => {
        p1.update();
        p1.draw();
        if(double){
            p2.update();
            p2.draw();
        }
    }, 1000 / fps)
}

function track(){
    console.log(p.dots);
}
