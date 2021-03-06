const canvas = document.querySelector("#canvas") as HTMLCanvasElement

interface Dimensions {
    width: number
    height: number
    mouse: {
        x: undefined | number
        y: undefined | number
    }
    colors: string[]
}
const w: Dimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
    mouse: {
        x: undefined,
        y: undefined,
    },

    colors: ["red", "blue", "orange", "pink", "purple", "yellow", "green"],
};

const c = canvas.getContext("2d")

window.addEventListener("mousemove", (e) => {
    w.mouse.x = e.x;
    w.mouse.y = e.y;
});

window.addEventListener("resize", () => {
    canvas.width = w.width;
    canvas.height = w.height;
    init();
});

window.addEventListener("load", () => {
    canvas.width = w.width;
    canvas.height = w.height;
});

const maxRadius = 50;

abstract class Shape {
    protected x: number
    protected y: number
    protected dx: number
    protected dy: number
    protected color: string

    constructor(_x: number, _y: number, _dx: number, _dy: number) {
        this.x = _x;
        this.y = _y;
        this.dx = _dx;
        this.dy = _dy;
        this.color = w.colors[Math.floor(Math.random() * w.colors.length)];
    }

    abstract draw: () => void
    abstract update: () => void
}

class Circle extends Shape {
    protected r: number
    protected minR: number
    constructor(_x: number, _y: number, _dx: number, _dy: number, _r: number) {
        super(_x, _y, _dx, _dy)
        this.r = _r;
        this.minR = _r;
    }
    draw = () => {
        c!.beginPath();
        c!.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        c!.fill();
        c!.fillStyle = this.color;
    };

    update = () => {
        if (this.x + this.r > w.width || this.x - this.r < 0)
            this.dx = this.dx * -1;
        this.x += this.dx;
        if (this.y + this.r > w.height || this.y - this.r < 0) this.dy = -this.dy;
        this.y += this.dy;

        this.x += this.dx;
        this.y += this.dy;

        if (
            w.mouse.x! - this.x < 100 &&
            w.mouse.x! - this.x > -100 &&
            w.mouse.y! - this.y < 100 &&
            w.mouse.y! - this.y > -100
        ) {
            if (this.r < maxRadius) {
                this.r += 1;
            }
        } else if (this.r > this.minR) {
            this.r -= 1;
        }

        this.draw();
    };
}



let circlesArray: any = [];

const init = () => {
    const speed = 5;
    circlesArray = [];
    for (let i = 0; i < 500; i++) {
        const circle: [number, number, number, number, number] = [
            Math.random() * (w.width - 40 * 2) + 40,
            Math.random() * (w.height - 40 * 2) + 40,
            (Math.random() - 0.5) * speed,
            (Math.random() - 0.5) * speed,
            Math.random() * 3 + 1,
        ];
        circlesArray.push(new Circle(...circle));
    }
};
const animate = () => {
    c!.clearRect(0, 0, w.width, w.height);
    requestAnimationFrame(animate);

    for (let i = 0; i < circlesArray.length; i++) {
        circlesArray[i].update();
    }
};
animate();
init();
