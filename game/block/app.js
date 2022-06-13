import { Block } from "./block.js";
import { Bar } from "./bar.js";
import { Ball } from "./ball.js";

class App{
    constructor(){
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        const blockWidth = 50;
        const blockHeight = 20;
        
        this.blocks = [];
        for(let i = 0; i <= this.canvas.width - blockWidth; i += blockWidth){
            for(let j = 50; j <= 200; j += blockHeight){
                this.blocks.push(new Block(i, j));
            }
        }
        let size = this.blocks.length;
        console.log(size);

        this.bar = new Bar(100, this.canvas.width, this.canvas.height);

        this.ball = new Ball(10, this.canvas.width, this.canvas.height, this.bar, this.blocks);

        const moveSpeed = 10;

        window.addEventListener('keydown', (e) => {
            // 오른쪽
            if(e.key === "ArrowRight"){ this.bar.vx = moveSpeed; }
            // 왼쪽
            if(e.key === "ArrowLeft"){ this.bar.vx = -moveSpeed; }
            // 스페이스바
            if(e.key == " "){ this.ball.isGameStart = true; }
        });

        window.addEventListener('keyup', (e) => {
            if(e.key === "ArrowRight" || e.key == "ArrowLeft"){ this.bar.vx = 0; }
        });

        window.requestAnimationFrame(this.animate.bind(this));
    }

    draw(){
        this.ctx.fillStyle = "#FFFEF2";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.bar.draw(this.ctx);

        this.ball.draw(this.ctx);
    }

    animate(){
        this.draw();

        window.requestAnimationFrame(this.animate.bind(this));
    }
}

window.onload = () => {
    new App();
}