export default class Bullet {
    constructor(args) {
        this.position = args.position;
        this.speed = args.speed;
        this.radius = args.radius;
        this.delete = false;
        this.onDie = args.onDie;
        this.direction = args.direction;
    }

    die() {
        this.delete = true;
    }

    update() {
        if (this.direction === "up") {
            this.position.y -= this.speed;
        } else {
            this.position.y += this.speed;
        }
    }

    render(state) {
        if (this.position.y > state.screen.height || this.position.y <0) {
            this.die();
        }

        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.fillStyle = '#FF0';
        context.lineWidth = 0.5;
        context.beginPath();
        context.arc(0, 0, 2, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.restore();
    }
}