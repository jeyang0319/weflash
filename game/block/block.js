export class Block {
    constructor(x, y){
        this.x = x;
        this.y = y;

        this.width = 50;
        this.height = 20;

        this.strokeColor = "#fff"; //테두리
        this.fillColor = "#FFD0F0"; // 블럭 색
    }

    draw(ctx){
        ctx.strokeStyle = this.strokeColor;
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}