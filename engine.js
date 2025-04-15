///NoLimitsEngine by ANDRES170


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvasData = {
    width: canvas.width,
    height: canvas.height,
    bounds: canvas.getBoundingClientRect()
};
canvas.style.cursor = "none";

//var executionTime = Date.now();
var executionTime = 0;

function radToDeg(angle) {
    return (angle * (180 / Math.PI))
};

function degToRad(angle) {
    return (angle * (Math.PI / 180))
};

function truncatedRounding(value, decimals) {
    if (isNaN(decimals)) {
        return "Decimals amount is invalid"
    };

    decimals = Math.round(parseInt(decimals));
    let point = Math.pow(10, decimals);
    return Math.trunc(value * point) / point;
};

function lerp(a, b, t) {
    return a + t * (b - a);
};

function smoothStep(x) {
    if (x < 0) {
        return 0
    } else if (x > 1) {
        return 1
    };

    return 3 * (x ** 2) - 2 * (x ** 3);
};

function sawtoothWave(x) {
    return 2 * ((x * 0.5) + (0.5) - Math.floor((x * 0.5) + (0.5))) - 1
};

function triangleWave(x) {
    return 4 * Math.abs((x * 0.5) + (0.25) - Math.floor((x * 0.5) + (0.75))) - 1
};

function squareWave(x) {
    return 2 * Math.floor((x * 0.5) - Math.floor(((x * 0.5) - 0.5))) - 1
}

function slopeAngle(x1 = 0, y1 = 0, x2 = 1, y2 = 0) {
    return Math.atan2(y2 - y1, x2 - x1)
};

function randomRange(min = 0, max = 1) {
    return Math.random() * (max - min) + min
}

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    };

    verifyInput(v) {
        if (v instanceof Vector) {
            return true
        } else {
            return false
        };
    };

    newCoords(x, y) {
        this.x = x
        this.y = y
    };

    magnitude() {
        //return Math.sqrt(this.x**2 + this.y**2)
        return Math.hypot(this.x, this.y)
    };

    getAngle() {
        return Math.atan2(this.y, this.x)
    };

    print() {
        return { x: this.x, y: this.y }
    };

    add(v = Vector) {
        return new Vector((this.x + v.x), (this.y + v.y))
    };

    subtract(v = Vector) {
        return new Vector((this.x - v.x), (this.y - v.y))
    };

    scalarMultiply(k = 1) {
        return new Vector((k * this.x), (k * this.y))
    };

    normalize() {
        //return this.scalarMultiply(1 / this.magnitude())
        return new Vector((this.x / Math.hypot(this.x, this.y)), (this.y / Math.hypot(this.x, this.y)))
    };

    dotProduct(v = Vector) {
        return ((this.x * v.x) + (this.y * v.y))
    };

    angleDifference(v = Vector) {
        return Math.acos((this.dotProduct(v)) / (this.magnitude() * v.magnitude()))
    };

    toMatrix() {
        let vec = new Matrix(1, 2);
        vec.setValue(0, 0, this.x);
        vec.setValue(1, 0, this.y);
        return vec;
    };

};

//Matrix Class (matrix rows and columns creation inverted)
class Matrix {
    constructor(cols = 2, rows = 2) {
        if (cols < 1) {
            this.cols = 1;
        } else {
            this.cols = parseInt(cols);
        };

        if (rows < 1) {
            this.rows = 1;
        } else {
            this.rows = parseInt(rows);
        };

        this.mat = this.init()
    };

    init() {
        let temp = new Array();
        for (let i = 0; i < this.rows; i++) {
            temp.push([])
            for (let j = 0; j < this.cols; j++) {
                temp[i][j] = 0;
            }
        }
        return temp;
    };

    setValue(colPos, rowPos, value) {
        if (isNaN(colPos) || isNaN(rowPos) || colPos < 0 || rowPos < 0) {
            return "Invalid Position"
        };

        if (isNaN(value)) {
            return "Value is Not a Number"
        };

        this.mat[colPos][rowPos] = value
    }

    getValue(colPos = 0, rowPos = 0) {
        colPos = parseInt(colPos);
        rowPos = parseInt(rowPos);
        if (isNaN(colPos) || isNaN(rowPos) || colPos < 0 || rowPos < 0) {
            return "Invalid Position"
        };

        return this.mat[colPos][rowPos]
    }

    isSquare() {
        if (this.cols === this.rows) {
            return true
        } else {
            return false
        }
    };

    add(mat2 = new Matrix(this.cols, this.rows)) {
        if (this.cols !== mat2.cols || this.rows !== mat2.rows) {
            return console.log("Matrices are not the same size");
        }

        let temp = new Array();
        for (let i = 0; i < this.cols; i++) {
            temp.push([])
            for (let j = 0; j < this.rows; j++) {
                temp[i][j] = this.mat[i][j] + mat2.mat[i][j];
            }
        }

        let newMat = new Matrix(this.cols, this.rows);
        newMat.mat = temp;

        return newMat;
    };

    subtract(mat2 = new Matrix(this.cols, this.rows)) {
        if (this.cols !== mat2.cols || this.rows !== mat2.rows) {
            return console.log("Matrices are not the same size");
        }

        let temp = new Array();
        for (let i = 0; i < this.cols; i++) {
            temp.push([])
            for (let j = 0; j < this.rows; j++) {
                temp[i][j] = this.mat[i][j] - mat2.mat[i][j];
            }
        }

        let newMat = new Matrix(this.cols, this.rows);
        newMat.mat = temp;

        return newMat;
    };

    scalarMultiply(k = 1) {
        if (isNaN(k)) {
            return "Scalar is Not a Number"
        };

        let temp = new Array();
        for (let i = 0; i < this.rows; i++) {
            temp.push([])
            for (let j = 0; j < this.cols; j++) {
                temp[i][j] = k * this.mat[i][j];
            }
        }
        return temp;
    }

    multiplication(mat2 = new Matrix(this.cols, this.rows)) {
        if (this.cols !== mat2.rows) {
            return console.log("Matrices differ operable sizes");
        }

        let temp = new Array();

        /* Original Iteration
        for (let i = 0; i < this.rows; i++) {
            temp.push([])
            for (let j = 0; j < mat2.cols; j++) {
                temp[i][j] = 0;
                for (let k = 0; k < mat2.rows; k++) {
                    temp[i][j] += this.mat[i][k] * mat2.mat[k][j];
                    //console.log("at Pos: " + i + ", " + j + " the value is: " + this.mat[i][k] * mat2.mat[k][j]);
                };
            };
        };*/

        /*//Switched Iteration, Breaks at last operartions
        for (let i = 0; i < mat2.cols; i++) {
            temp.push([]);
            for (let j = 0; j < this.rows; j++) {
                temp[i][j] = 0;
                for (let k = 0; k < mat2.rows; k++) {
                    temp[i][j] += this.mat[i][k] * mat2.mat[k][j];
                    console.log(temp);
                    //console.log("at Pos: " + i + ", " + j + " the value is: " + this.mat[i][k] * mat2.mat[k][j]);
                };
            };
        };*/

        //Both codes shares the same basis, yet I dont know how or why it works
        /*
        for (let i = 0; i < this.rows; i++) {
            temp.push([])
            for (let j = 0; j < mat2.cols; j++) {
                temp[i][j] = 0;
                for (let k = 0; k < mat2.rows; k++) {
                    temp[i][j] += this.mat[i][k] * mat2.mat[k][j];
                    //console.log("at Pos: " + i + ", " + j + " the value is: " + this.mat[i][k] * mat2.mat[k][j]);
                };
            };
        };
        */

        for (let i = 0; i < this.rows; i++) {
            temp.push([])
            for (let j = 0; j < mat2.cols; j++) {
                temp[i][j] = 0;
                for (let k = 0; k < this.cols; k++) {
                    temp[i][j] += this.mat[i][k] * mat2.mat[k][j];
                };
            };
        };

        let newMat = new Matrix(this.rows, mat2.cols);
        newMat.mat = temp;

        return newMat;
    };

    transpose() {
        let temp = new Array();
        for (let i = 0; i < this.cols; i++) {
            temp.push([]);
            for (let j = 0; j < this.rows; j++) {
                temp[i][j] = this.mat[j][i];
            };
        };

        let newMat = new Matrix(this.rows, this.cols);
        newMat.mat = temp;

        return newMat;
    };

    trace() {
        if (!this.isSquare()) {
            return "Matrix is not square"
        }

        let temp = 0;

        for (let i = 0; i < this.cols; i++) {
            temp += this.mat[i][i]
        };

        return temp;
    };
};

class Sprite {
    constructor(src = "null.png", /*posX = 0, posY = 0,*/ originX = 0, originY = 0, scaleX = 1, scaleY = 1, angle = 0) {
        this.img = new Image();
        this.img.src = src;
        /*this.pos = new Vector(posX, posY);*/
        this.origin = new Vector(originX, originY);
        this.scale = new Vector(scaleX, scaleY);
        this.angle = angle;
        this.alpha = 1;
    };

    drawAtPos(x = 0, y = 0) {
        let pos = new Vector(x, y);
        ctx.save();
        //ctx.translate(this.pos.x, this.pos.y);
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.globalAlpha = this.alpha;


        /*
        ctx.beginPath();
        ctx.rect(0, 0, this.img.width, this.img.height);
        ctx.stroke();
        */
        //ctx.translate(-this.pos.x, -this.pos.y);
        ctx.drawImage(this.img, -this.origin.x, -this.origin.y);



        //ctx.translate(-this.origin.x + this.pos.x, -this.origin.y + this.pos.y);
        //ctx.translate(-this.origin.x + pos.x, -this.origin.y + pos.y);
        ctx.translate(pos.x, pos.y);
        /*
        ctx.beginPath();
        ctx.rect(this.pos.x, this.pos.y, -this.origin.x, -this.origin.y);
        ctx.stroke();
        */
        //ctx.translate(-this.origin.x, this.origin.y);
        //ctx.drawImage(this.img, this.pos.x, this.pos.y);
        //ctx.translate(this.pos.x - this.origin.x, this.pos.y - this.origin.y);
        //ctx.translate(-this.origin.x + this.pos.x, this.origin.y + this.pos.y);
        ctx.restore();
    };

    drawTiles(x = 0, y = 0, rows = 1, cols = 1) {
        ctx.save()
        let grid = ctx.createPattern(this.img, "repeat")
        ctx.fillStyle = grid
        ctx.fillRect(0, 0, canvasData.width, canvasData.height)
        ctx.restore()
    };

    drawFromStrip(x = 0, y = 0, width = 0, height = 0, offsetX = 0, offsetY = 0) {
        let pos = new Vector(x, y);
        //let offset = new Vector(parseInt(offsetH), parseInt(offsetV)) //no need to initialize a vector
        ctx.save();

        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.globalAlpha = this.alpha;
        //ctx.drawImage(test.img,0, 0, 16, 16, 32, 32, 32, 32);
        ctx.drawImage(this.img, parseInt(offsetX), parseInt(offsetY), width, height, -this.origin.x, -this.origin.y, width, height);

        ctx.translate(pos.x, pos.y);
        ctx.restore();
    };

    drawAnimatedHorizontalStrip(x = 0, y = 0, width = 0, height = 0, index = 0) {
        let pos = new Vector(x, y);
        //let offset = new Vector(parseInt(offsetH), parseInt(offsetV)) //no need to initialize a vector
        ctx.save();

        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, width * (parseInt(index)), 0, width, height, -this.origin.x, -this.origin.y, width, height);

        ctx.translate(pos.x, pos.y);
        ctx.restore();
    };

    drawAnimatedVerticalStrip(x = 0, y = 0, width = 0, height = 0, index = 0) {
        let pos = new Vector(x, y);
        //let offset = new Vector(parseInt(offsetH), parseInt(offsetV)) //no need to initialize a vector
        ctx.save();

        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale.x, this.scale.y);
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, 0, height * (parseInt(index)), width, height, -this.origin.x, -this.origin.y, width, height);

        ctx.translate(pos.x, pos.y);
        ctx.restore();
    };
};

class Instance {
    constructor(posX = 0, posY = 0) {
        this.pos = new Vector(posX, posY);
        this.direction = 0;
        this.velocity = new Vector();
        this.acceleration = new Vector();
        this.sprite = new Sprite();
    };

    linealMovement() {
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;
    };

    freeMovement() {
        this.pos.x += this.velocity.magnitude() * Math.sin(this.direction)
        this.pos.y += this.velocity.magnitude() * -Math.cos(this.direction)
        this.velocity.x += this.acceleration.magnitude() * -Math.cos(this.direction)
        this.velocity.y += this.acceleration.magnitude() * -Math.sin(this.direction)
    };

    moveToPoint(x, y) {
        this.direction = slopeAngle(this.pos.x, this.pos.y, x, y);
        this.velocity.newCoords(1, 0);

        if (Math.abs(x - this.pos.x) + Math.abs(y - this.pos.y) < 10) {
            this.velocity.x = 0;
            return
        };

    };

    draw() {
        /*
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.sprite.angle);
        ctx.drawImage(this.sprite.img, -this.sprite.origin.x * 2, -this.sprite.origin.y * 2);
        ctx.translate(-this.sprite.origin.x + this.pos.x, -this.sprite.origin.y + this.pos.y);
        ctx.restore();
        */
        this.sprite.drawAtPos(this.pos.x, this.pos.y);
    };

    checkCollision(obj = Instance(), size = 1) {
        if (obj === undefined) {
            return false
        }

        if (obj.pos.x >= this.pos.x - size && obj.pos.x <= this.pos.x + size && obj.pos.y >= this.pos.y - size && obj.pos.y <= this.pos.y + size) {
            //player.pos.x - size, player.pos.y - size
            return true;
        } else {
            return false;
        };
    };

    checkRadialCollision(obj = Instance(), radius = 1) {
        if (obj === undefined) {
            return false
        }

        if (Math.hypot(this.pos.x - obj.pos.x, this.pos.y - obj.pos.y) < radius) {
            //player.pos.x - size, player.pos.y - size
            return true
        } else {
            return false;
        };
    };

};

class virtualKey {
    constructor(/*key = " ",*/ x = 0, y = 0, size = 1) {
        //this.key = key;
        this.pos = new Vector(x, y)
        this.sprite = new Sprite();
        this.size = size;
        this.init()
    };

    init() {
        if (this.size < 1) {
            this.size = 1
        };
    }

    isPressed(x = 0, y = 0) {

        let touchPos = new Vector(x, y)

        /* // Disabled due to poor accuracy
        if (touchPos.x >= this.pos.x - this.size && touchPos.x <= this.pos.x + this.size && touchPos.y >= this.pos.y - this.size && touchPos.y <= this.pos.y + this.size) {  
            return true;
        } else {
            return false;
        };*/

        if (touchPos.x >= this.pos.x - (this.size * 2) && touchPos.x <= this.pos.x + (this.size * 2) && touchPos.y >= this.pos.y - (this.size * 2) && touchPos.y <= this.pos.y + (this.size * 2)) {
            return true;
        } else {
            return false;
        };


    };

    drawKey() {
        this.sprite.drawAtPos(this.pos.x, this.pos.y);
    };

    drawBounds() {
        ctx.beginPath();
        ctx.rect(this.pos.x - this.size, this.pos.y - this.size, this.size * 2, this.size * 2);
        ctx.stroke();
    }

};

class virtualAnalogStick {
    constructor(x, y, radius = 1) {
        this.pos = new Vector(x, y);
        this.radius = radius;
        this.frontSprite = new Sprite();
        this.backSprite = new Sprite();
        this.touchPos = new Vector();
        this.holding = false;
    };

    isPressed(x = 0, y = 0) {
        //let normal = new Vector()
        if (Math.hypot((x - this.pos.x), (y - this.pos.y)) < this.radius ||  this.touchPos.magnitude() > 0 /*(Math.hypot((x - this.pos.x), (y - this.pos.y)) > this.radius && this.holding === true)*/) {
            //normal.newCoords(x - this.pos.x, y - this.pos.y)
            //this.touchPos.newCoords(normal.scalarMultiply(1 / this.radius).x, normal.scalarMultiply(1 / this.radius).y)
            this.holding = true
            return true
        } else {
            //this.touchPos.newCoords(0, 0)
            this.holding = false
            return false;
        };
    };

    getInput(x, y) {
        let normal = new Vector()
        let output = new Vector()
        if (Math.hypot((x - this.pos.x), (y - this.pos.y)) < this.radius || (Math.hypot((x - this.pos.x), (y - this.pos.y)) > this.radius && this.holding === true)) {
            //this.touchPos.subtract(this.pos).normalize()
            normal.newCoords(x - this.pos.x, y - this.pos.y)
            this.touchPos.newCoords(normal.scalarMultiply(1 / this.radius).x, normal.scalarMultiply(1 / this.radius).y)
            this.holding = true
        } else {
            this.touchPos.newCoords(0, 0)
            this.holding = false
        };

        if (this.touchPos.magnitude() * this.radius < this.radius) {
            //this.frontSprite.drawAtPos(this.pos.x + this.touchPos.x * this.radius, this.pos.y + this.touchPos.y * this.radius);
            output.newCoords(this.touchPos.x, this.touchPos.y);
        } else {
            output.newCoords(this.touchPos.normalize().x, this.touchPos.normalize().y);
        }

        return output
    };

    draw() {


        this.backSprite.drawAtPos(this.pos.x, this.pos.y);

        if (this.touchPos.magnitude() * this.radius < this.radius) {
            this.frontSprite.drawAtPos(this.pos.x + this.touchPos.x * this.radius, this.pos.y + this.touchPos.y * this.radius);
        } else {
            this.frontSprite.drawAtPos(this.pos.x + this.touchPos.normalize().x * this.radius, this.pos.y + this.touchPos.normalize().y * this.radius);
        }

        //console.log(this.touchPos.magnitude());

        //this.frontSprite.drawAtPos(this.pos.x + this.touchPos.x * this.radius, this.pos.y + this.touchPos.y * this.radius);

        /*
        this.backSprite.drawAtPos(this.pos.x, this.pos.y);
        this.frontSprite.drawAtPos(this.pos.x + touchPos.x * this.radius, this.pos.y+ touchPos.y * this.radius);
        */

        console.log();

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    };
};

const mouse = {
    lmb: false,
    mmb: false,
    rmb: false,
    pos: new Vector(0, 0)
};

/*
canvas.addEventListener("mousemove", (e) => {
    mouse.pos.newCoords(e.clientX - canvasData.bounds.x, e.clientY - canvasData.bounds.y)
    console.log(mouse.pos.print());
});
*/

const vec2 = new Vector(2, 1);
const vec3 = new Vector(1, 2);

const up = new Vector(0, 1);
const down = new Vector(0, -1);
const left = new Vector(-1, 0);
const right = new Vector(1, 0);


const mat2 = new Matrix(2, 2);
mat2.setValue(0, 0, 1);
mat2.setValue(0, 1, 2);
mat2.setValue(1, 0, 3);
mat2.setValue(1, 1, 4);

const mat3 = new Matrix(2, 2);
mat3.setValue(0, 0, 1);
mat3.setValue(0, 1, 2);
mat3.setValue(1, 0, 3);
mat3.setValue(1, 1, 4)

const mat4 = new Matrix(1, 3);
mat4.setValue(0, 0, 1);
mat4.setValue(1, 0, 2);
mat4.setValue(2, 0, 3);

const mat5 = new Matrix(3, 1);
mat5.setValue(0, 0, 1);
mat5.setValue(0, 1, 2);
mat5.setValue(0, 2, 3);

//const player = new Sprite("img/img.png", canvasData.width / 4, canvasData.height / 4, 64, 84);
//const player = new Sprite("img/img.png", 32 * 6, 32 * 6, 32, 42);
//const player = new Sprite("img/img.png", 0, 0, 32, 42);
//const player = new Sprite("img/img.png", canvasData.width / 4, canvasData.height / 4, 0, 0);
//const player = new Sprite("img/img.png");
//const player = new Sprite("img/img.png", 32, 32);

const mainSprite = new Sprite("img/img.png", 32, 42);

const player = new Instance(32, 32);
player.pos.newCoords(canvasData.width / 2, canvasData.height / 2)
player.sprite = new Sprite("img/img.png", 64, 84);
var playerNormal = new Vector();
var playerHealth = 100;

const background = new Sprite("img/BG.png");

/*
const dummy = new Instance(256, 256 )
dummy.sprite = new Sprite("img/idle.png")
dummy.sprite.origin.newCoords(64, 64)
dummy.direction = slopeAngle(dummy.pos.x, dummy.pos.y, player.pos.x,player.pos.y) + degToRad(90)
var dummyHealth = 100
var dummyLive = true
*/

const crosshair = {
    upper: new Sprite("img/crosshair.png"),
    lower: new Sprite("img/crosshair.png")
};

crosshair.upper.origin.newCoords(32, 32)
crosshair.lower.origin.newCoords(32, 32)

const test = new Sprite("img/character.png")

const reloadBtn = new virtualKey(canvasData.width - 72, canvasData.height / 2 - 64, 16*2);
reloadBtn.sprite = new Sprite("img/reload_button.png")
reloadBtn.sprite.origin.newCoords(16, 16)
reloadBtn.sprite.scale.newCoords(2, 2)


const leftAnalogStick = new virtualAnalogStick(128, canvasData.height - 128, 64);
leftAnalogStick.frontSprite = new Sprite("img/analog_stick_front.png", 16, 16);
leftAnalogStick.frontSprite.scale.newCoords(2,2)
leftAnalogStick.backSprite = new Sprite("img/analog_stick_back.png", 32, 32);
leftAnalogStick.backSprite.scale.newCoords(3,3)

leftAnalogStick.frontSprite.alpha = 0.5
leftAnalogStick.backSprite.alpha = 0.5

const rightAnalogStick = new virtualAnalogStick(canvasData.width - 128, canvasData.height - 128, 64);


rightAnalogStick.frontSprite = new Sprite("img/analog_stick_front.png", 16, 16);
rightAnalogStick.backSprite = new Sprite("img/analog_stick_back.png", 32, 32);
rightAnalogStick.frontSprite.scale.newCoords(2,2)
rightAnalogStick.backSprite = new Sprite("img/analog_stick_back.png", 32, 32);
rightAnalogStick.backSprite.scale.newCoords(3,3)

rightAnalogStick.frontSprite.alpha = 0.5
rightAnalogStick.backSprite.alpha = 0.5


//background.scale.newCoords(canvasData.width / 128, canvasData.height / 128)
//const gun = new Audio("snd/ak47_01.mp3")

function vectorRotation(angle, v = Vector) {
    let rotate = new Matrix(2, 2);
    rotate.setValue(0, 0, Math.cos(angle));
    rotate.setValue(0, 1, -Math.sin(angle));
    rotate.setValue(1, 0, Math.sin(angle));
    rotate.setValue(1, 1, Math.cos(angle));

    console.log(rotate.mat);

    let out = rotate.multiplication(v.toMatrix());

    console.log(out.mat);

    let vec = new Vector(truncatedRounding(out.getValue(0, 0), 8), truncatedRounding(out.getValue(1, 0), 8));

    return vec;
}

var bulletInst = new Array()
var dummyInst = new Array()
var bonusInst = new Array()

function createInstance(x, y) {
    //obj = new Instance(x, y);
    //instances.push(obj)
    //return obj
    return new Instance(x, y);
}

function clockCycle() {
    let clockTimer = Date.now();
    var deltaTime = clockTimer - executionTime;
    executionTime = clockTimer;
    //console.log("Delta Time at: " + deltaTime);
    update(deltaTime);
    draw();
    externalTiming();
    requestAnimationFrame(clockCycle)
};

function externalTiming() {
    let clockTimer = Date.now();
    var deltaTime = clockTimer - executionTime;
    executionTime = clockTimer;
    return deltaTime
}

var time = 0


const weapon = {
    fireRate: 5,
    capacity: 30,
    reloadTime: 135,
    recoil: 5,
    power: 20,
    barrel: new Vector(8, 56)
}


var ammo = weapon.capacity;
var shoot = weapon.fireRate;
var reloading = 0;
var spread = 0;
var magazines = 0;
var zombieSpawn = true;
const playerFuncs = {
    reload() {
        if (ammo < weapon.capacity && reloading == 0 && magazines > 0) {
            reloading = weapon.reloadTime;
            ammo = weapon.capacity
            magazines--
            let sndReloading = new Audio("snd/ak47_reload_01.mp3");
            sndReloading.play();
        };
    }
}

const world = {
    width: 1280,
    height: 720
};

const camera = {
    pos: new Vector(),
    offset: new Vector(),
    width: 640,
    height: 480
};

function update(deltaTime) {

    //console.log(triangleWave(time));
    //console.log("executing");

    time += 0.01;

    if (time > 2) {

        if (dummyInst.length < 8 && zombieSpawn === true) {
            let creature = createInstance(randomRange(0, canvasData.width), (canvasData.height / 2) + Math.sign(randomRange(-1, 1)) * (canvasData.height / 2 + 10))
            creature.sprite = new Sprite("img/zombie_idle.png")
            creature.sprite.origin.newCoords(64, 64)
            creature.direction = randomRange(degToRad(60), degToRad(120))
            //creature.direction = slopeAngle(dummy.pos.x, dummy.pos.y, player.pos.x,player.pos.y) + degToRad(90)
            let dummyHealth = 100
            let dummyLive = true
            let dummyAttack = true
            let dummyBonus = 0
            if (magazines > 2) {
                dummyBonus = (Math.random() <= 0.25)
            } else if (magazines < 2) {
                dummyBonus = (Math.random() <= 0.5)
            }

            dummyInst.push([creature, dummyHealth, dummyLive, dummyAttack, dummyBonus])
        }

        dummyInst.forEach((npc) => {
            npc[3] = true
        });


        time = 0;
    };

    //player.linealMovement();
    player.linealMovement();
    playerNormal.newCoords(Math.cos(player.direction), Math.sin(player.direction))

    bulletInst.forEach((element, i) => {

        //linealMovement doesnt initilalize trig functions
        element.linealMovement()
        //element.freeMovement();

        /*
        if (dummy.checkRadialCollision(element, 16) && dummyLive == true) {
            dummyHealth -= 15
            delete bulletInst[i]
            bulletInst.splice(i, 1)
        }
        */

        element.velocity.newCoords(Math.sin(element.direction) * weapon.power * (deltaTime * 0.1), -Math.cos(element.direction) * weapon.power * (deltaTime * 0.1))

        dummyInst.forEach((npc) => {
            if (npc[0].checkRadialCollision(element, 16) && npc[2] === true) {
                npc[1] -= 15
                delete bulletInst[i]
                bulletInst.splice(i, 1)
            };
        });



        if (element.pos.x < 0 || element.pos.x > canvasData.width || element.pos.y < 0 || element.pos.y > canvasData.height) {
            delete bulletInst[i]
            bulletInst.splice(i, 1)
        };
    });
    //player.pos.newCoords(32 * sawtoothWave(time) + 64, 32 * sawtoothWave(time) + 64);
    //player.pos.newCoords(lerp(canvasData.width / 2, canvasData.width - 32, smoothStep(triangleWave(time)/2 + 0.5) * 2 - 1), 128)

    if (shoot > 0) {
        //shoot--
        shoot--

    }

    if (reloading > 0) {
        reloading--
    }

    if (spread < 0 /*|| ammo === 0*/) {
        spread = 0
    }

    if (mouse.lmb === true && shoot === 0 && ammo > 0 && reloading === 0 && playerHealth > 0) {

        //let bullet = createInstance(player.pos.x, player.pos.y);
        //let bullet = createInstance(player.pos.x + (playerNormal.x * 8) + (playerNormal.y * 52), player.pos.y + (playerNormal.y * 8) - (playerNormal.x * 52));
        //let bullet = createInstance(player.pos.x + (playerNormal.x * weapon.barrel.x) + (playerNormal.y * weapon.barrel.y), player.pos.y + (playerNormal.y * weapon.barrel.x) - (playerNormal.x * weapon.barrel.y));
        let bullet = createInstance(player.pos.x + playerNormal.dotProduct(weapon.barrel), player.pos.y + (playerNormal.y * weapon.barrel.x) - (playerNormal.x * weapon.barrel.y));
        let gun = new Audio("snd/ak47_01.mp3")
        gun.play();
        bulletInst.push(bullet)
        //console.log(bullet.pos);
        bullet.direction = player.direction + randomRange(degToRad(-spread), degToRad(spread))
        bullet.sprite = new Sprite("img/bullet.png")

        //check for sprite origin affecting instance position


        bullet.sprite.origin.x = 16
        bullet.sprite.origin.y = 16


        bullet.sprite.angle = bullet.direction
        //bullet.velocity.newCoords(Math.sin(bullet.direction) * 20, -Math.cos(bullet.direction) * 20)
        bullet.velocity.newCoords(Math.sin(bullet.direction) * weapon.power, -Math.cos(bullet.direction) * weapon.power)
        bullet.sprite.scale.y = 5
        //console.log(bullet.sprite.origin);
        ammo--;
        shoot = 5;

        if (spread < weapon.recoil && ammo > 0) {
            //spread += 0.4 //Hardcoded
            spread += 0.4
        }

    };

    if ((mouse.lmb === false) && (shoot === 0 && spread > 0) && playerHealth > 0) {
        //spread -= 0.2 //Hardcoded
        spread -= 0.2
    }

    dummyInst.forEach((element, i) => {
        if (element[1] > 0 && element[2] === true) {

            if (playerHealth > 0) {
                element[0].direction = slopeAngle(element[0].pos.x, element[0].pos.y, player.pos.x, player.pos.y) + degToRad(90)
            }

            element[0].freeMovement()
            //element[0].velocity.x = deltaTime * 0.05
            element[0].velocity.x = deltaTime * 0.05
        }


        if (element[1] < 0 && element[2] === true) {
            element[2] = false
            element[0].sprite.img.src = "img/zombie_dead.png"
            let empty = new Audio("snd/npc_dead.mp3");
            empty.play();
            if (element[4] === true) {
                let extra = createInstance(element[0].pos.x, element[0].pos.y)
                extra.sprite = new Sprite("img/pickup.png", 16, 16)
                extra.sprite.scale.newCoords(0.75, 0.75)
                bonusInst.push(extra)
            }
        };

        if (dummyInst.length >= 8 && element[2] == false) {
            delete dummyInst[i]
            dummyInst.splice(i, 1)
        }

        if (element[0].checkRadialCollision(player, 16) && element[2] == true && element[3] === true) {
            playerHealth -= 5
            element[3] = false
        }
    });

    if (playerHealth < 0) {
        player.sprite.img.src = "img/dead.png"
    }

    bonusInst.forEach((element, i) => {
        if (element.checkRadialCollision(player, 32)) {
            magazines++
            delete bonusInst[i]
            bonusInst.splice(i, 1)

            let pickup = new Audio("snd/ammo_pickup.mp3");
            pickup.play();
        }
    })




    /*
    if (dummyHealth > 0 && dummyLive === true) {
        dummy.direction = slopeAngle(dummy.pos.x, dummy.pos.y, player.pos.x,player.pos.y) + degToRad(90)
        dummy.freeMovement()
        dummy.velocity.x = 0.2
    }


    if (dummyHealth < 0 && dummyLive === true) {
        dummyLive = false
        dummy.sprite.img.src = "img/dead.png"
        let empty = new Audio("snd/npc_dead.mp3");
        empty.play();
    };
    */

    //console.log(player.checkCollision(dummy, 16));
    //console.log(player.checkRadialCollision(dummy, 16));
    //console.log(spread);

};

canvas.addEventListener("mousedown", (e) => {
    //mouse.lmb = true

    /*
    if (e.button === 0) {
        mouse.lmb = true    
    };
    */

    switch (e.button) {
        case 0:
            mouse.lmb = true;
            break;

        case 1:
            mouse.mmb = true;
            break;

        case 2:
            mouse.rmb = true;
            break;


    };


    if (e.button === 0) {
        if (shoot == 0 && ammo <= 0 && reloading == 0) {
            let empty = new Audio("snd/empty-fire.mp3");
            empty.play();
        };
    };



    /*
    if (shoot == 0 && ammo <= 0 && reloading == 0) {
        let empty = new Audio("snd/empty-fire.mp3");
        empty.play();
    }
    */

});

canvas.addEventListener("mouseup", (e) => {
    //mouse.lmb = false

    switch (e.button) {
        case 0:
            mouse.lmb = false;
            break;

        case 1:
            mouse.mmb = false;
            break;

        case 2:
            mouse.rmb = false;
            break;


    };

    if (e.button === 0) {
        //mouse.lmb = false;
        shoot = 0;
    };

});

canvas.addEventListener("mousemove", (e) => {
    mouse.pos.newCoords(e.clientX - canvasData.bounds.x, e.clientY - canvasData.bounds.y)
    //console.log(mouse.pos.print());
});

document.addEventListener("keyup", (e) => {
    if (e.key == "a" || e.key == "d") {
        player.velocity.x = 0
    };

    if (e.key == "s" || e.key == "w") {
        player.velocity.y = 0
    };

    /*
    if ((e.key == "r" || e.key == "R") && ammo < weapon.capacity && reloading == 0 && magazines > 0) {
        reloading = weapon.reloadTime;
        ammo = weapon.capacity
        magazines--
        let sndReloading = new Audio("snd/ak47_reload_01.mp3");
        sndReloading.play();
    }
    */


    if ((e.key == "r" || e.key == "R")) {
        playerFuncs.reload()
    }

    switch (e.key) {
        case "a":
        case "d":
            player.velocity.x = 0
            break;

        case "w":
        case "s":
            player.velocity.y = 0
            break;
    }

    //console.log(e.key);

    //player.velocity.x = 0
    //player.velocity.y = 0
});

document.addEventListener("keydown", (e) => {
    let deltaTime = externalTiming()
    /*
    if (e.key == "a") {
        
    }*/


    if (e.key === " ") {

    };


    //console.log(e.key);

    if (playerHealth > 0) {
        switch (e.key) {
            case "d":
                player.velocity.x = deltaTime * 0.1

                break;
            case "a":
                player.velocity.x = -deltaTime * 0.1

                break;
            case "s":
                player.velocity.y = deltaTime * 0.1

                break;
            case "w":
                player.velocity.y = -deltaTime * 0.1
                break;
        }
    }


});

//Reserved for Mobile Controls
canvas.addEventListener("touchstart", (e) => {
    //mouse.lmb = true
    //console.log(e.targetTouches[0].clientX + ", " + e.targetTouches[0].clientY);
    if (reloadBtn.isPressed(e.targetTouches[0].clientX, e.targetTouches[0].clientY)) {
        console.log("Virtual Key Pressed");
        playerFuncs.reload()
    };

    if (leftAnalogStick.isPressed(e.targetTouches[0].clientX, e.targetTouches[0].clientY)) {
        leftAnalogStick.getInput(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }

    
    if (rightAnalogStick.isPressed(e.targetTouches[0].clientX, e.targetTouches[0].clientY)) {
        rightAnalogStick.getInput(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }

    //console.log(Math.hypot(e.targetTouches[0].clientX - leftAnalogStick.pos.x, e.targetTouches[0].clientY - leftAnalogStick.pos.y))
    //console.log("Distance: " + Math.hypot(e.targetTouches[0].clientX - leftAnalogStick.pos.x, e.targetTouches[0].clientY - leftAnalogStick.pos.y))
    //console.log(e.targetTouches[0].clientX, e.targetTouches[0].clientY)

})

canvas.addEventListener("touchend", (e) => {
    //mouse.lmb = false
    leftAnalogStick.touchPos.newCoords(0,0)
    rightAnalogStick.touchPos.newCoords(0,0)

    player.velocity.newCoords(0,0)
    mouse.lmb = false




});

canvas.addEventListener("touchmove", (e) => {
    //mouse.pos.newCoords(e.targetTouches[0].clientX - canvasData.bounds.x, e.targetTouches[0].clientX - canvasData.bounds.y)

    for (let i = 0; i < e.targetTouches.length; i++) {

            player.velocity.x = leftAnalogStick.getInput(e.targetTouches[i].clientX, e.targetTouches[i].clientY).x * 2 

            player.velocity.y = leftAnalogStick.getInput(e.targetTouches[i].clientX, e.targetTouches[i].clientY).y * 2      
    
        
        if (rightAnalogStick.isPressed(e.targetTouches[i].clientX, e.targetTouches[i].clientY)) {
            player.direction = rightAnalogStick.getInput(e.targetTouches[i].clientX, e.targetTouches[i].clientY).getAngle() + degToRad(90);
        }

        
        if (leftAnalogStick.isPressed(e.targetTouches[i].clientX, e.targetTouches[i].clientY) && !rightAnalogStick.isPressed(e.targetTouches[i].clientX, e.targetTouches[i].clientY)) {
            player.direction = leftAnalogStick.getInput(e.targetTouches[i].clientX, e.targetTouches[i].clientY).getAngle() + degToRad(90);
        } 

        if (rightAnalogStick.getInput(e.targetTouches[i].clientX, e.targetTouches[i].clientY).magnitude() > 0.95) {
            mouse.lmb = true
        } else {
            mouse.lmb = false
        }


        
    };
        
    


    

    /*
    if (leftAnalogStick.isPressed(e.targetTouches[0].clientX, e.targetTouches[0].clientY) && !rightAnalogStick.isPressed(e.targetTouches[0].clientX, e.targetTouches[0].clientY)) {
            player.direction = leftAnalogStick.getInput(e.targetTouches[0].clientX, e.targetTouches[0].clientY).getAngle() + degToRad(90);
        }
    */

});


//disabled as canvas doesnt exist
function draw(/*deltaTime*/) {
    ctx.clearRect(0, 0, canvasData.width, canvasData.height)

    //background.drawAtPos();
    background.drawTiles()
    //dummy.draw()
    //mainSprite.angle = player.pos.subtract(mouse.pos).getAngle() - degToRad(90)
    //player.draw();
    //mainSprite.angle = player.pos.subtract(mouse.pos).getAngle() - degToRad(90)

    /*
    bulletInst.forEach(element => {
        if (element instanceof Instance) {
            element.draw();
        }
    });
    */

    dummyInst.forEach((element, i) => {
        element[0].draw();
        element[0].sprite.angle = element[0].direction;
    });

    bonusInst.forEach(element => {
        if (element instanceof Instance) {
            element.draw();
            element.sprite.angle = Math.PI * 2 * sawtoothWave(time);
            element.sprite.scale.newCoords(triangleWave(time) / 8 + (0.625), triangleWave(time) / 8 + (0.625))
        }
    });

    bulletInst.forEach(element => {
        if (element instanceof Instance) {
            element.draw();
        }
    });





    if (playerHealth > 0) {
        //player.direction = slopeAngle(player.pos.x, player.pos.y, mouse.pos.x, mouse.pos.y) + degToRad(90);
        player.sprite.angle = player.direction;
    }




    //mainSprite.drawAtPos(32 * Math.cos(time) + 64, 32 * Math.sin(time) + 64)

    /*
    ctx.beginPath();
    ctx.rect(player.pos.x + player.origin.x, player.pos.y + player.origin.y, player.img.width, player.img.height);
    ctx.stroke();
    */


    /*
    ctx.beginPath();
    ctx.rect(player.pos.x, player.pos.y, player.sprite.img.width, player.sprite.img.height);
    ctx.stroke();
    */


    ctx.font = "10px Arial";
    ctx.fillText("Ammo: " + ammo, ((canvasData.width / 8) * 0) + 10, canvasData.height - 16);
    ctx.fillText("Recoil: " + truncatedRounding(spread, 1), ((canvasData.width / 8) * 1) + 10, canvasData.height - 16);
    ctx.fillText("Health: " + playerHealth, ((canvasData.width / 8) * 2) + 10, canvasData.height - 16);
    ctx.fillText("Magazines: " + magazines, ((canvasData.width / 8) * 3) + 10, canvasData.height - 16);
    ctx.fillText("Delta Time: " + externalTiming(), ((canvasData.width / 8) * 4) + 10, canvasData.height - 16);


    player.draw();

    let target = new Vector(mouse.pos.x - player.pos.x, mouse.pos.y - player.pos.y);
    let dist = target.magnitude() / 100;

    //wtf - its was ported from the c++ version of the game, also adjust the crosshair position
    crosshair.upper.drawAtPos(mouse.pos.x - target.normalize().y * 8 - spread * (-target.normalize().y * dist), mouse.pos.y + target.normalize().x * 8 - spread * (target.normalize().x * dist))
    crosshair.lower.drawAtPos(mouse.pos.x - target.normalize().y * 8 + spread * (-target.normalize().y * dist), mouse.pos.y + target.normalize().x * 8 + spread * (target.normalize().x * dist))

    crosshair.upper.angle = player.direction + degToRad(90) - degToRad(spread);
    crosshair.lower.angle = player.direction + degToRad(90) + degToRad(spread);

    /* //Rewritten to slopeAngle()
    player.direction = player.pos.subtract(mouse.pos).getAngle() - degToRad(90);
    */
    //player.pos.newCoords(mouse.pos.x, mouse.pos.y)

    reloadBtn.drawKey();

    leftAnalogStick.draw();
    rightAnalogStick.draw();



};

/* //Discarted Hardcoded Framerates
const fpsThirty = 1000 / 30;
const fpsSixty = 1000 / 60;
*/

//var core = setInterval(clockCycle, (1000 / 60) /*(1000/60)*/)
clockCycle();

