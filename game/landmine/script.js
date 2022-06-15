const $tbody = document.querySelector("#table tbody");
const $result = document.querySelector("#result");
const row = 10; // 줄
const cell = 10; // 칸
const mine = 10; // 지뢰 갯수

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
        target.textContent = "?";
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.QUESTION_MINE) { //물음표 지뢰면
        data[rowIndex][cellIndex] = code.FLAG_MINE; // 깃발 지뢰로
        target.className = 'flag';
        target.textContent = "!";
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.FLAG_MINE) { // 깃발 지뢰면
        data[rowIndex][cellIndex] = code.MINE; // 지뢰로
        target.className = '';
        target.textContent = 'X';
        console.log(rowIndex, cellIndex);
    } else if (cellData === code.NORMAL) { // 닫힌 칸이면
        data[rowIndex][cellIndex] = code.QUESTION; // 물음표로
        target.className = 'question';
        target.textContent = '?';
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

function onLeftClick(event) {
    const target = event.target;
    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];
    console.log(rowIndex, cellIndex)
    if (cellData === code.NORMAL) {
        const count = countMine(rowIndex, cellIndex);
        target.textContent = count || '';
        target.className = 'opened';
        data[rowIndex][cellIndex] = count;
    } else if (cellData === code.MINE) {
        //펑
    }
}

function drawTable() {
    data = plantMine();
    data.forEach((row) => {
        const $tr = document.createElement('tr');
        row.forEach((cell) => {
            const $td = document.createElement('td');
            if (cell === code.MINE) {
                $td.textContent = 'X' //개발 편의를 위해
            };
            $tr.append($td);
        });
        $tbody.append($tr);
        $tbody.addEventListener('contextmenu', onRightClick); //우클릭
        $tbody.addEventListener('click', onLeftClick); //좌클릭
    });
};

drawTable();