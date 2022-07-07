import blocks from "./blocks.js"

const playground = document.querySelector(".playground > ul")
const gameText = document.querySelector(".game-text")
const scoreDisplay = document.querySelector(".score")
const levelDisplay = document.querySelector(".level")
const startBtn = document.querySelector('.start')
const restartBtn = document.querySelector('.restart')
const next = document.querySelector(".next > ul")

// Setting
const rows = 20;
const cols = 10;


// variables
let score = 0;
let duration = 500; // 블럭이 떨어지는 시간
let downInterval;
let tempMovingItem; // 무빙 실행 전 잠시 담아두는 용도로 사용
let level = 1;
let num = 2;


const movingItem = { // 다음 블럭의 타입과 좌표 등 정보 가지고 있는 변수
    type: "",
    direction: 1,
    top: 0,
    left: 0,
};

init()


//functions
function init() {

    tempMovingItem = { ...movingItem };
    console.log(tempMovingItem + '1');
    for (let i = 0; i < rows; i++) {
        prependNewLine()
    }

    tempMovingItem = { ...movingItem };
    console.log(tempMovingItem + '2');
    for (let i = 0; i < 4; i++) {
        nextBlock()
    }
    // prev();

    // generateNewBlock();
}

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    generateNewBlock();
    prev();

})

function nextBlock() {
    const li2 = document.createElement("li");
    const ul2 = document.createElement("ul");
    for (let j = 0; j < 4; j++) {
        const matrix = document.createElement("li");
        ul2.prepend(matrix);
    }
    li2.prepend(ul2)
    next.prepend(li2)


}

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < cols; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)

}

function renderBlocks(moveType = "") {
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })
    blocks[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);  // false 또는 true가 담김
        if (isAvailable) {
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = { ...movingItem }
            if (moveType === "retry") {
                clearInterval(downInterval);
                showGameOverText();
            }
            setTimeout(() => { // 콜스택 에러 발생 방지. 
                renderBlocks("retry"); //재귀함수 호출 
                if (moveType === "top") {
                    seizeBlock();
                }
            }, 0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}

function prev() {
    const blockArray = Object.entries(blocks);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    movingItem.type = blockArray[randomIndex][0]
    console.log(movingItem.type);
    console.log(blocks[movingItem.type][0][1][0])

}

function seizeBlock() { //밑에 더이상 내려갈 곳이 없으면 더이상 움직이지 않게 고정
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}

function checkMatch() {

    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if (!li.classList.contains("seized")) {
                matched = false;
            }
        })
        if (matched) {
            child.remove();
            prependNewLine()
            score += 1;
            scoreDisplay.innerText = score;
            if (score > num ) {
                level += 1;
                levelDisplay.innerText = level;
                num += 2;
                duration -= 50;
                console.log(duration);
            }
        }
    })
    generateNewBlock();
}

function generateNewBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(()=> {
        moveBlock('top', 1)
    }, duration)

    const blockArray = Object.entries(blocks);
    const randomIndex = Math.floor(Math.random() * blockArray.length)

    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    if (tempMovingItem) {
        tempMovingItem = { ...movingItem };
    } else {
        console.log('X');
        return
    }
    renderBlocks();
    console.log(tempMovingItem);
}

function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}

function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, 15)
}

function showGameOverText() {
    clearInterval(downInterval);
    gameText.style.display = "flex";
}

// event handling
document.addEventListener("keydown", e => {
    switch(e.keyCode) {
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            changeDirection();
            break;
        case 32:
            dropBlock();
        default:
            break;
    }
})