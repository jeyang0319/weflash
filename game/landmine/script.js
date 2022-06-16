const $tbody = document.querySelector("#table tbody");
const $timer = document.querySelector(".timer");
const $easy = document.getElementById("easy");
const $normal = document.getElementById("normal");
const $hard = document.getElementById("hard");
const $start = document.querySelector(".start");
const $level = document.getElementById('level');
const $gameover = document.querySelector('.gameover');
// const $form = document.querySelector(".form");
const $result = document.querySelector("#result");
let row = 10; // 줄
let cell = 10; // 칸
let mine = 10; // 지뢰 갯수

const code = {
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    MINE: -6,
    OPENED: 0, // 0 이상이면 다 모두 열린 칸
};

let data;
let openCount;
let startTime;
let interval;

function onSubmit() {
    // event.preventDefault(); //form에 preventDefault()안하면 폼이 새로고침 됨
    openCount = 0;
    clearInterval(interval);
    $timer.textContent = '0초';
    $tbody.innerHTML = '';
    drawTable()
    let startTime = new Date();
    interval = setInterval(() => {
        const time = Math.floor((new Date() - startTime) / 1000);
        $timer.textContent = `${time}초`;
        }, 1000) //1초마다
}

$start.addEventListener('click', () => {
    onSubmit();
});


function chooseLevel() {
   if ($easy.checked) {
    row = 10;
    cell = 10;
    mine = 10;
   } else if ($normal.checked) {
    row = 20;
    cell = 20;
    mine = 40;
   } else if ($hard.checked) {
    row = 30;
    cell = 30;
    mine = 90;
   }
}

// function chooseHeight() {
//     const tdCell = document.querySelector('.tdCell')
//     if ($easy.checked) {
//         $td.style.height = '30';
//         $td.style.width = '30';
//        } else if ($normal.checked) {
//         tdCell.style.height = '20px';
//         tdCell.style.width = '20px';
//        } else if ($hard.checked) {
//         tdCell.style.height = '10px';
//         tdCell.style.width = '10px';
//        }
// }

// chooseLevel();

function plantMine() {
    const candidate = Array(row * cell).fill().map((arr, i) => {
        return i;
    });
    const shuffle = [];
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen); //지뢰가 들어갈 칸들 -> 게임 마다 매번 달라짐
    }
    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData = [];
        data.push(rowData);
        for (let j = 0; j < cell;j++) {
            rowData.push(code.NORMAL);
        }
    }

    for (let k = 0; k < shuffle.length; k++) { // 랜덤한 shuffle을 넣어줌
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = code.MINE;
    }
    return data;
}

function onRightClick(event) { // 우클릭으로 깃발 꼽기
    event.preventDefault(); //우클릭 했을 때 기본적으로 나오는 것 제거하기
    const target = event.target; //target은 tbody가 아니라 td
    const rowIndex = target.parentNode.rowIndex; //target.parentNode는 tr // 클릭한 td가 몇번째 행, 열인지 알아냄
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];
    if (cellData === code.MINE) { //지뢰면
        data[rowIndex][cellIndex] = code.QUESTION_MINE; //물음표 지뢰로
        target.className = 'question';
        target.textContent = "🏁";
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.QUESTION_MINE) { //물음표 지뢰면
        data[rowIndex][cellIndex] = code.FLAG_MINE; // 깃발 지뢰로
        target.className = 'flag';
        target.textContent = "!";
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.FLAG_MINE) { // 깃발 지뢰면
        data[rowIndex][cellIndex] = code.MINE; // 지뢰로
        target.className = '';
        target.textContent = '';
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.NORMAL) { // 닫힌 칸이면
        data[rowIndex][cellIndex] = code.QUESTION; // 물음표로
        target.className = 'question';
        target.textContent = '🏁';
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.QUESTION) {
        data[rowIndex][cellIndex] = code.FLAG;
        target.className = 'flag';
        target.textContent = '!';
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.FLAG) {
        data[rowIndex][cellIndex] = code.NORMAL;
        target.className = '';
        target.textContent = '';
        console.log(rowIndex, cellIndex);
    }
}

function countMine(rowIndex, cellIndex) {
    const mines = [code.MINE, code.QUESTION_MINE, code.FLAG_MINE];
    let i = 0;
    mines.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++; //&&연산자는 앞에 조건이 있으면 뒤에 연산 진행
    mines.includes(data[rowIndex - 1]?.[cellIndex]) && i++; //?. 연산자는 undifined 안에 undifined가 있을 때 이를 보호해줌 아니면 오류발생
    mines.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++;
    mines.includes(data[rowIndex]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex]?.[cellIndex + 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++;
    return i;

}

function open(rowIndex, cellIndex) {
    if (data[rowIndex]?.[cellIndex] >= code.OPENED) return; //한번 열었던 칸은 다시 열지 않음
    const target = $tbody.children[rowIndex]?.children[cellIndex];
    if (!target) {
        return;
    }
    const count = countMine(rowIndex, cellIndex);
    target.textContent = count || '';
    target.className = 'opened';
    data[rowIndex][cellIndex] = count;
    openCount++;
    if (openCount === row * cell - mine) {
        const time = Math.floor((new Date() - startTime) / 1000);
        clearInterval(interval);
        $tbody.removeEventListener('contextmenu', onRightClick);
        $tbody.removeEventListener('click', onLeftClick);
        setTimeout(() => { //화면이 바뀔 수 있는 시간 주기
            alert(`승리했습니다! ${time}초가 걸렸습니다.`)
        }, 0)
    }

    return count;
}

function openAround(rI, cI) {
    setTimeout(() => {
        const count = open(rI, cI);
        if (count === 0) {
            openAround(rI - 1, cI -1);
            openAround(rI - 1, cI);
            openAround(rI - 1, cI + 1);
            openAround(rI, cI - 1);
            openAround(rI, cI + 1);
            openAround(rI + 1, cI - 1);
            openAround(rI + 1, cI);
            openAround(rI + 1, cI + 1);
        } 
    }, 0)
}

function onLeftClick(event) {
    const target = event.target;
    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];
    console.log(rowIndex, cellIndex)
    if (cellData === code.NORMAL) {
        openAround(rowIndex, cellIndex);
    } else if (cellData === code.MINE) {
        target.textContent = '펑';
        target.className = 'opened';
        clearInterval(interval);
        $tbody.removeEventListener('contextmenu', onRightClick);
        $tbody.removeEventListener('click', onLeftClick);
        $gameover.style.display = 'flex';
    }
}

function drawTable() {
    chooseLevel();
    data = plantMine();
    data.forEach((row) => {
        const $tr = document.createElement('tr');
        row.forEach((cell) => {
            const $td = document.createElement('td');
            // $td.className = 'tdCell'
            // chooseHeight();
            if (cell === code.MINE) {
                // $td.textContent = '.' //개발 편의를 위해
            };
            $tr.append($td);
            
        });
        $tbody.append($tr);
        $tbody.addEventListener('contextmenu', onRightClick); //우클릭
        $tbody.addEventListener('click', onLeftClick); //좌클릭
    });
};
