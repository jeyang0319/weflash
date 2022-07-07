window.onload = function() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    let lastframe = 0;
    let fpstime = 0;
    let framecount = 0;
    
    let initialized = false;
    
    let level = {
        x: 4,           // x 좌표
        y: 83,          // y 좌표
        width: 0,       
        height: 0,      
        columns: 15,    // 세로 줄 수
        rows: 14,       // 가로 줄 수
        bubblewidth: 40,  
        bubbleheight: 40, 
        rowheight: 34,  // 겨냥 화살표 길이
        radius: 20,     
        bubbles: []
    };

    class Bubble {
        constructor(x, y, type, shift) {
            this.x = x;
            this.y = y;
            this.type = type;
            this.removed = false;
            this.shift = shift;
            this.velocity = 0;
            this.alpha = 1;
            this.processed = false;
        }
    }
    
    let player = {
        x: 0,
        y: 0,
        angle: 0,
        bubbletype: 0,
        bubble: {
                    x: 0,
                    y: 0,
                    angle: 0,
                    speed: 1000,
                    dropspeed: 900,
                    bubbletype: 0,
                    visible: false
                },
        nextbubble: {
                        x: 0,
                        y: 0,
                        bubbletype: 0
                    }
    };
    
    let neighborsoffsets = [[[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]], // Even row bubbles
                            [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]];  // Odd row bubbles
    
    let bubblecolors = 7;
    
    let gameStates = { init: 0, ready: 1, shootbubble: 2, removecluster: 3, gameover: 4 };
    let gameState = gameStates.init;
    
    let score = 0;
    
    let turncounter = 0;
    let rowoffset = 0;
    
    let animationstate = 0;
    let animationtime = 0;
    
    let showcluster = false;
    let cluster = [];
    let floatingclusters = [];
    
    let images = [];
    let bubbleimage;
    
    let loadcount = 0;
    let loadtotal = 0;
    let preloaded = false;
    
    function loadImages(imagefiles) {
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;
        
        let loadedimages = [];
        for (let i=0; i<imagefiles.length; i++) {
            let image = new Image();
            
            image.onload = function () {
                loadcount++;
                if (loadcount == loadtotal) {
                    preloaded = true;
                }
            };
            
            image.src = imagefiles[i];
            loadedimages[i] = image;
        }
        
        return loadedimages;
    }
    
    function init() {
        images = loadImages(["bubble-sprites.png"]);
        bubbleimage = images[0];
    
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
        
        for (let i=0; i<level.columns; i++) {
            level.bubbles[i] = [];
            for (let j=0; j<level.rows; j++) {
                level.bubbles[i][j] = new Bubble(i, j, 0, 0);
            }
        }
        
        level.width = level.columns * level.bubblewidth + level.bubblewidth/2;
        level.height = (level.rows-1) * level.rowheight + level.bubbleheight;
        
        player.x = level.x + level.width/2 - level.bubblewidth/2;
        player.y = level.y + level.height;
        player.angle = 90;
        player.bubbletype = 1;
        
        player.nextbubble.x = player.x - 2 * level.bubblewidth;
        player.nextbubble.y = player.y;
        
        newGame();
        
        main(0);
    }
    
    function main(tframe) {
        window.requestAnimationFrame(main);
    
        if (!initialized) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (preloaded) {
                setTimeout(function(){initialized = true;}, 1);
            }
        } else {
            update(tframe);
            render();
        }
    }
    
    function update(tframe) {
        let dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        
        updateFps(dt);
        
        if (gameState == gameStates.ready) {
        } else if (gameState == gameStates.shootbubble) {
            stateShootBubble(dt);
        } else if (gameState == gameStates.removecluster) {
            stateRemoveCluster(dt);
        }
    }
    
    function setGameState(newgameState) {
        gameState = newgameState;
        
        animationstate = 0;
        animationtime = 0;
    }
    
    function stateShootBubble(dt) {
        player.bubble.x += dt * player.bubble.speed * Math.cos(degToRad(player.bubble.angle));
        player.bubble.y += dt * player.bubble.speed * -1*Math.sin(degToRad(player.bubble.angle));
        
        if (player.bubble.x <= level.x) {
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x;
        } else if (player.bubble.x + level.bubblewidth >= level.x + level.width) {
            player.bubble.angle = 180 - player.bubble.angle;
            player.bubble.x = level.x + level.width - level.bubblewidth;
        }
 
        if (player.bubble.y <= level.y) {
            player.bubble.y = level.y;
            snapBubble();
            return;
        }
        
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                let bubble = level.bubbles[i][j];
                
                if (bubble.type < 0) {
                    continue;
                }
                
                let coord = getBubbleCoordinate(i, j);
                if (circleIntersection(player.bubble.x + level.bubblewidth/2,
                                       player.bubble.y + level.bubbleheight/2,
                                       level.radius,
                                       coord.bubblex + level.bubblewidth/2,
                                       coord.bubbley + level.bubbleheight/2,
                                       level.radius)) {
                                        
                    snapBubble();
                    return;
                }
            }
        }
    }
    
    function stateRemoveCluster(dt) {
        if (animationstate == 0) {
            resetRemoved();
            
            for (let i=0; i<cluster.length; i++) {
                cluster[i].removed = true;
            }
            
            score += cluster.length * 100;
            
            floatingclusters = findFloatingClusters();
            
            if (floatingclusters.length > 0) {
                for (let i=0; i<floatingclusters.length; i++) {
                    for (let j=0; j<floatingclusters[i].length; j++) {
                        let bubble = floatingclusters[i][j];
                        bubble.shift = 0;
                        bubble.shift = 1;
                        bubble.velocity = player.bubble.dropspeed;
                        
                        score += 100;
                    }
                }
            }
            animationstate = 1;
        }
        
        if (animationstate == 1) {
            let bubblesleft = false;
            for (let i=0; i<cluster.length; i++) {
                let bubble = cluster[i];
                
                if (bubble.type >= 0) {
                    bubblesleft = true;
                    bubble.alpha -= dt * 15;
                    if (bubble.alpha < 0) {
                        bubble.alpha = 0;
                    }

                    if (bubble.alpha == 0) {
                        bubble.type = -1;
                        bubble.alpha = 1;
                    }
                }                
            }
            
            for (let i=0; i<floatingclusters.length; i++) {
                for (let j=0; j<floatingclusters[i].length; j++) {
                    let bubble = floatingclusters[i][j];
                    
                    if (bubble.type >= 0) {
                        bubblesleft = true;
                        
                        bubble.velocity += dt * 700;
                        bubble.shift += dt * bubble.velocity;
                            
                        bubble.alpha -= dt * 8;
                        if (bubble.alpha < 0) {
                            bubble.alpha = 0;
                        }

                        if (bubble.alpha == 0 || (bubble.y * level.rowheight + bubble.shift > (level.rows - 1) * level.rowheight + level.bubbleheight)) {
                            bubble.type = -1;
                            bubble.shift = 0;
                            bubble.alpha = 1;
                        }
                    }
                }
            }
            
            if (!bubblesleft) {
                nextBubble();
                
                let bubblefound = false
                for (let i=0; i<level.columns; i++) {
                    for (let j=0; j<level.rows; j++) {
                        if (level.bubbles[i][j].type != -1) {
                            bubblefound = true;
                            break;
                        }
                    }
                }
                
                if (bubblefound) {
                    setGameState(gameStates.ready);
                } else {
                    setGameState(gameStates.gameover);
                }
            }
        }
    }
    
    function snapBubble() {
        let centerx = player.bubble.x + level.bubblewidth/2;
        let centery = player.bubble.y + level.bubbleheight/2;
        let gridpos = getGridPosition(centerx, centery);

        if (gridpos.x < 0) {
            gridpos.x = 0;
        }
            
        if (gridpos.x >= level.columns) {
            gridpos.x = level.columns - 1;
        }

        if (gridpos.y < 0) {
            gridpos.y = 0;
        }
            
        if (gridpos.y >= level.rows) {
            gridpos.y = level.rows - 1;
        }

        let addbubble = false;
        console.log(level.bubbles[gridpos.x][gridpos.y].type)
        if (level.bubbles[gridpos.x][gridpos.y].type != -1) {
            for (let newrow=gridpos.y+1; newrow<level.rows; newrow++) {
                console.log(level.bubbles[gridpos.x][newrow].type)
                if (level.bubbles[gridpos.x][newrow].type == -1) {
                    gridpos.y = newrow;
                    console.log(gridpos.y + '1')
                    addbubble = true;
                    break;
                }
            }
        } else {
            addbubble = true;
        }

        if (addbubble) {
            player.bubble.visible = false;
        
            level.bubbles[gridpos.x][gridpos.y].type = player.bubble.bubbletype;
            
            if (checkGameOver()) {
                return;
            }
            
            cluster = findCluster(gridpos.x, gridpos.y, true, true, false);
            
            if (cluster.length >= 3) {
                setGameState(gameStates.removecluster);
                return;
            }
        }
        
        turncounter++;
        console.log(turncounter)
        if (turncounter >= 5) {
            addBubbles();
            turncounter = 0;
            rowoffset = (rowoffset + 1) % 2;
            
            if (checkGameOver()) {
                return;
            }
        }

        nextBubble();
        setGameState(gameStates.ready);
    }
    
    function checkGameOver() {
        for (let i=0; i<level.columns; i++) {
            if (level.bubbles[i][level.rows-1].type != -1) {
                nextBubble();
                setGameState(gameStates.gameover);
                return true;
            }
        }
        return false;
    }
    
    function addBubbles() {
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows-1; j++) {
                level.bubbles[i][level.rows-1-j].type = level.bubbles[i][level.rows-1-j-1].type;
            }
        }
        
        for (let i=0; i<level.columns; i++) {
            level.bubbles[i][0].type = getExistingColor();
        }
    }
    
    function findColors() {
        let foundcolors = [];
        let colortable = [];
        for (let i=0; i<bubblecolors; i++) {
            colortable.push(false);
        }
        
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                let bubble = level.bubbles[i][j];
                if (bubble.type >= 0) {
                    if (!colortable[bubble.type]) {
                        colortable[bubble.type] = true;
                        foundcolors.push(bubble.type);
                    }
                }
            }
        }
        
        return foundcolors;
    }
    
    function findCluster(tx, ty, matchtype, reset, skipremoved) {
        if (reset) {
            resetProcessed();
        }
        
        let targetbubble = level.bubbles[tx][ty];
        
        let toprocess = [targetbubble];
        targetbubble.processed = true;
        let foundcluster = [];

        while (toprocess.length > 0) {
            let currentbubble = toprocess.pop();
            
            if (currentbubble.type == -1) {
                continue;
            }
            
            if (skipremoved && currentbubble.removed) {
                continue;
            }
            
            if (!matchtype || (currentbubble.type == targetbubble.type)) {
                foundcluster.push(currentbubble);
                
                let neighbors = getNeighbors(currentbubble);
                
                for (let i=0; i<neighbors.length; i++) {
                    if (!neighbors[i].processed) {
                        toprocess.push(neighbors[i]);
                        neighbors[i].processed = true;
                    }
                }
            }
        }
        
        return foundcluster;
    }
    
    function findFloatingClusters() {
        resetProcessed();
        
        let foundclusters = [];
        
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                let bubble = level.bubbles[i][j];
                if (!bubble.processed) {
                    let foundcluster = findCluster(i, j, false, false, true);
                    
                    if (foundcluster.length <= 0) {
                        continue;
                    }
                    
                    let floating = true;
                    for (let k=0; k<foundcluster.length; k++) {
                        if (foundcluster[k].y == 0) {
                            floating = false;
                            break;
                        }
                    }
                    
                    if (floating) {
                        foundclusters.push(foundcluster);
                    }
                }
            }
        }
        
        return foundclusters;
    }
    
    function resetProcessed() {
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                level.bubbles[i][j].processed = false;
            }
        }
    }
    
    function resetRemoved() {
        for (let i=0; i<level.columns; i++) {
            for (let j=0; j<level.rows; j++) {
                level.bubbles[i][j].removed = false;
            }
        }
    }
    
    function getNeighbors(bubble) {
        let bubblerow = (bubble.y + rowoffset) % 2; // Even or odd row
        let neighbors = [];
        
        let n = neighborsoffsets[bubblerow];
        
        for (let i=0; i<n.length; i++) {
            let nx = bubble.x + n[i][0];
            let ny = bubble.y + n[i][1];
            
            if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
                neighbors.push(level.bubbles[nx][ny]);
            }
        }
        return neighbors;
    }
    
    function updateFps(dt) {
        if (fpstime > 0.25) {
            fps = Math.round(framecount / fpstime);
            
            fpstime = 0;
            framecount = 0;
        }
        
        fpstime += dt;
        framecount++;
    }
    
    function drawCenterText(text, x, y, width) {
        let textdim = ctx.measureText(text);
        ctx.fillText(text, x + (width-textdim.width)/2, y);
    }
    
    function render() {
        let yoffset =  level.bubbleheight/2;
        
        ctx.fillStyle = "#333";
        ctx.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 4 - yoffset);
        
        renderBubbles();
        
        ctx.fillStyle = "#111111";
        ctx.fillRect(level.x - 4, level.y - 4 + level.height + 4 - yoffset, level.width + 8, 2*level.bubbleheight + 3);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "24px NEODGM";
        let scorex = level.x + level.width - 150;
        let scorey = level.y+level.height + level.bubbleheight - yoffset - 8;
        drawCenterText("Score:", scorex, scorey, 150);
        ctx.font = "24px NEODGM";
        drawCenterText(score, scorex, scorey+30, 150);

        if (showcluster) {
            renderCluster(cluster, 255, 128, 128);
            
            for (let i=0; i<floatingclusters.length; i++) {
                let col = Math.floor(100 + 100 * i / floatingclusters.length);
                renderCluster(floatingclusters[i], col, col, col);
            }
        }
        
        
        renderPlayer();
        
        if (gameState == gameStates.gameover) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(level.x - 4, level.y - 4, level.width + 8, level.height + 2 * level.bubbleheight + 8 - yoffset);
            
            ctx.fillStyle = "#ffffff";
            ctx.font = "40px NEODGM";
            drawCenterText("Game Over!", level.x, level.y + level.height / 2 - 30, level.width);
            ctx.font = "24px NEODGM";
            drawCenterText("당신의 점수는 " + score + "점 입니다", level.x, level.y + level.height / 2 + 40, level.width);
        }
    }
    
    function renderBubbles() {
        for (let j=0; j<level.rows; j++) {
            for (let i=0; i<level.columns; i++) {
                let bubble = level.bubbles[i][j];
            
                let shift = bubble.shift;
                
                let coord = getBubbleCoordinate(i, j);
                
                if (bubble.type >= 0) {
                    ctx.save();
                    ctx.globalAlpha = bubble.alpha;
                    
                    drawBubble(coord.bubblex, coord.bubbley + shift, bubble.type);
                    
                    ctx.restore();
                }
            }
        }
    }
    
    function renderCluster(cluster, r, g, b) {
        for (let i=0; i<cluster.length; i++) {
            let coord = getBubbleCoordinate(cluster[i].x, cluster[i].y);
            
            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(coord.bubblex+level.bubblewidth/4, coord.bubbley+level.bubbleheight/4, level.bubblewidth/2, level.bubbleheight/2);
        }
    }
    
    function renderPlayer() {
        let centerx = player.x + level.bubblewidth/2;
        let centery = player.y + level.bubbleheight/2;
        
        ctx.fillStyle = "#7a7a7a";
        ctx.beginPath();
        ctx.arc(centerx, centery, level.radius+12, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#eeeeee";
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "orange";
        ctx.beginPath();
        ctx.moveTo(centerx, centery);
        ctx.lineTo(centerx + 1.5*level.bubblewidth * Math.cos(degToRad(player.angle)), centery - 1.5*level.bubbleheight * Math.sin(degToRad(player.angle)));
        ctx.stroke();
        
        drawBubble(player.nextbubble.x, player.nextbubble.y, player.nextbubble.bubbletype);
        
        if (player.bubble.visible) {
            drawBubble(player.bubble.x, player.bubble.y, player.bubble.bubbletype);
        }
    }
    
    function getBubbleCoordinate(column, row) {
        let bubblex = level.x + column * level.bubblewidth;
        
        if ((row + rowoffset) % 2) {
            bubblex += level.bubblewidth/2;
        }
        
        let bubbley = level.y + row * level.rowheight;
        return { bubblex: bubblex, bubbley: bubbley };
    }
    
    function getGridPosition(x, y) {
        let gridy = Math.floor((y - level.y) / level.rowheight);
        
        let xoffset = 0;
        if ((gridy + rowoffset) % 2) {
            xoffset = level.bubblewidth / 2;
        }
        let gridx = Math.floor(((x - xoffset) - level.x) / level.bubblewidth);
        console.log('x = ', x, 'xoffset = ',xoffset, 'level.x = ', level.x, 'level.bubblewidth= ', level.bubblewidth )
        return { x: gridx, y: gridy };
    }

    
    function drawBubble(x, y, index) {
        if (index < 0 || index >= bubblecolors)
            return;
        
        ctx.drawImage(bubbleimage, index * 40, 0, 40, 40, x, y, level.bubblewidth, level.bubbleheight);
    }
    
    function newGame() {
        score = 0;
        
        turncounter = 0;
        rowoffset = 0;
        
        setGameState(gameStates.ready);
        
        createLevel();

        nextBubble();
        nextBubble();
    }
    
    function createLevel() {
        for (let j=0; j<level.rows; j++) {
            let randombubble = randRange(0, bubblecolors-1);
            let count = 0;
            for (let i=0; i<level.columns; i++) {
                if (count >= 2) {
                    let newbubble = randRange(0, bubblecolors-1);
                    
                    if (newbubble == randombubble) {
                        newbubble = (newbubble + 1) % bubblecolors;
                    }
                    randombubble = newbubble;
                    count = 0;
                }
                count++;
                
                if (j < level.rows/2) {
                    level.bubbles[i][j].type = randombubble;
                } else {
                    level.bubbles[i][j].type = -1;
                }
            }
        }
    }
    
    function nextBubble() {
        player.bubbletype = player.nextbubble.bubbletype;
        player.bubble.bubbletype = player.nextbubble.bubbletype;
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.visible = true;
        
        let nextcolor = getExistingColor();
        
        player.nextbubble.bubbletype = nextcolor;
    }
    
    function getExistingColor() {
        existingcolors = findColors();
        
        let bubbletype = 0;
        if (existingcolors.length > 0) {
            bubbletype = existingcolors[randRange(0, existingcolors.length-1)];
        }
        
        return bubbletype;
    }
    
    function randRange(low, high) {
        return Math.floor(low + Math.random()*(high-low+1));
    }
    
    function shootBubble() {
        player.bubble.x = player.x;
        player.bubble.y = player.y;
        player.bubble.angle = player.angle;
        player.bubble.bubbletype = player.bubbletype;

        setGameState(gameStates.shootbubble);
    }
    
    function circleIntersection(x1, y1, r1, x2, y2, r2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        let len = Math.sqrt(dx * dx + dy * dy);
        
        if (len < r1 + r2) {
            return true;
        }
        return false;
    }
    
    function radToDeg(angle) {
        return angle * (180 / Math.PI);
    }
    
    function degToRad(angle) {
        return angle * (Math.PI / 180);
    }

    function onMouseMove(e) {
        let pos = getMousePos(canvas, e);
        let mouseangle = radToDeg(Math.atan2((player.y+level.bubbleheight/2) - pos.y, pos.x - (player.x+level.bubblewidth/2)));

        if (mouseangle < 0) {
            mouseangle = 180 + (180 + mouseangle);
        }

        let lbound = 8;
        let ubound = 172;
        if (mouseangle > 90 && mouseangle < 270) {
            if (mouseangle > ubound) {
                mouseangle = ubound;
            }
        } else {
            if (mouseangle < lbound || mouseangle >= 270) {
                mouseangle = lbound;
            }
        }

        player.angle = mouseangle;
    }
    
    function onMouseDown(e) {
        let pos = getMousePos(canvas, e);
        
        if (gameState == gameStates.ready) {
            shootBubble();
        } else if (gameState == gameStates.gameover) {
            newGame();
        }
    }
    
    function getMousePos(canvas, e) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
            y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
        };
    }
    
    init();
};