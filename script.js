const k = document.getElementById("k-value");
const submitBtn = document.getElementById("submit-btn");
const animationBox = document.getElementById("animation-box");

// -------------------------- Validation --------------------------

const validateKValue = () => {
    const kValue = parseInt(Number(k.value));
    const errorMsg = document.querySelector('.err-msg');

    if(kValue >= 0 && kValue <= 8){
        errorMsg.classList.add("hidden");
        return true;
    }else{
        errorMsg.classList.remove("hidden");
        return false;
    }
}

// -------------------------- class Block --------------------------
class Block{
    constructor(posX, sideLen, velocity, m){
        this.x = posX;
        this.side = sideLen;
        this.V = velocity;
        this.m = m;
    }

    update() {
        this.x += this.V;
    }

    reverse() {
        this.V = -this.V;
    }

    isBlockCollision(block){
        return !(this.x + this.side < block.x || this.x > block.x + block.side);
    }

    calculateNewV(block){
        const sumM = this.m + block.m;
        return ( (this.m - block.m)/sumM * this.V ) + ( (2.0*block.m/sumM) * block.V );
    }
} 


class Animation{
    constructor(width, height, kValue, parentNode) {
        this.width = width;
        this.height = height;
        this.kValue = kValue;
        this.parentNode = parentNode;
        
        this.timeSteps = Math.pow(10, kValue);
        this.count = 0;

        this.leftBorder = 10;
        this.rightBorder = this.width - 80;
        this.mid = (this.width - 40)/2;
        
        this.blocks = this.setBlocks();
        
        this.canvas = this.createCanvasElement(width, height);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(1, -1);   

        this.parentNode.appendChild(this.canvas);
    }

    setBlocks(){
        const m = Math.pow(100, this.kValue);
        const blockLeft = new Block(
            this.leftBorder,    // posX,
            50,                 // sideLen,
            5/this.timeSteps,   // velocity,
            m);                 // mass

        const blockRight = new Block(
            this.mid + 50,
            50,
            0,
            1);

        return [blockLeft, blockRight];
    }

    createCanvasElement(width, height){
        const canvas = document.createElement('canvas');
        
        canvas.style.width = width;
        canvas.style.height = height;
        canvas.width = width;
        canvas.height = height;
        canvas.classList.add("animation");
    
        return canvas;
    }

    drawFrame(){
        this.drawWalls()
        this.setTitle();
        this.drawBlocks();
    }

    drawWalls(){
        this.ctx.fillStyle = 'rgba(255, 255, 0, 0.671)';
        this.ctx.fillRect(this.width - 40 + 10, 20-this.height, 10, this.height - 40);
        this.ctx.fillRect(10, 20-this.height, this.width - 40, 10);
    }

    setTitle(){
        this.ctx.scale(1, -1);
        this.ctx.fillStyle = 'rgba(133, 9, 138, 0.856)';
        this.ctx.font = '20px Goldman';
        this.ctx.fillText('k = ' + this.kValue + `      PI = `+ Math.PI + `     count = ` + this.count, this.leftBorder, 20);
        this.ctx.scale(1, -1);
    }

    drawBlocks(){
        this.calculateNewBlocksPostion();

        this.ctx.fillStyle = 'rgba(255, 0, 0)';
        this.ctx.fillRect(this.blocks[0].x, 30-this.height, 50, 50);
    
        this.ctx.fillStyle = 'rgba(0, 0, 255)';
        this.ctx.fillRect(this.blocks[1].x, 30-this.height, 50, 50);
    }

    calculateNewBlocksPostion(){
        for(let i = 0; i < this.timeSteps; i++){
            // calc if collision
            if(this.blocks[1].isBlockCollision(this.blocks[0])){
                const V0_prim = this.blocks[0].calculateNewV(this.blocks[1]);
                const V1_prim = this.blocks[1].calculateNewV(this.blocks[0]);
                                
                this.blocks[0].V = V0_prim;
                this.blocks[1].V = V1_prim;

                this.count++;
            }
    
            // wall collision
            if(this.blocks[1].x >= this.rightBorder){
                this.blocks[1].reverse();
                this.count++;
            }

            // update pos
            this.blocks[0].update();
            this.blocks[1].update();
        }
    }
    
    clearContext(){
        this.ctx.scale(1, -1);   
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.scale(1, -1);  
    }

    step(){
        this.clearContext();
        this.drawFrame();
        window.requestAnimationFrame(()=>this.step())
    }

    animate(){
        window.requestAnimationFrame(()=>this.step());    
    }
}

const clearAnimationBox = () => {
    while (animationBox.firstChild) {
        animationBox.removeChild(animationBox.firstChild);
    }
}

const render = () => {
    if(validateKValue()){
        const kValue = parseInt(k.value);
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const animation = new Animation(0.5*vw, 400, kValue, animationBox);
        animation.animate();
    }else{
        clearAnimationBox();
    }
}

submitBtn.addEventListener('click', render);