const ver = 4; // 가로
let hor = 2; // 세로
let speed = 500;
let openTime = 5500;
const container = document.querySelector(".container");
const guide = document.querySelector(".guide");
const mainStart = document.querySelector(".mainStart");
const start = document.querySelector(".start");
const restart = document.querySelector(".restart");
const startPage = document.querySelector(".gameStart");
const end = document.querySelector(".end");
const win = document.querySelector(".win");
const gameOver = document.querySelector(".gameOver");
const level = document.querySelector(".level");
const $easy = document.getElementById("easy");
const $normal = document.getElementById("normal");
const $hard = document.getElementById("hard");

const colorArr = ['red', 'orange', 'yellow', 'green', 'blue', 'salmon', 'plum', 'rgb(255, 219, 152)', 'pink', 'purple', 'rgb(255, 128, 128)', 'rgb(187, 255, 250)', 'rgb(254, 169, 255)', 'rgb(209, 181, 236)', 'rgb(104, 220, 255)', 'rgb(147, 255, 164)']
let color = [];

for (let i = 0; colorArr.length > 0; i++) {
  color = color.concat(
    colorArr.splice(Math.floor(Math.random() * colorArr.length), 1)
  )
}

let arr = [];

function chooseLevel() {
  if ($easy.checked) {
   hor = 1;
   speed = 800;
   openTime = 4000;
  } else if ($normal.checked) {
   hor = 2;
   speed = 650;
   openTime = 4800;
  } else if ($hard.checked) {
   hor = 3;
   speed = 500;
   openTime = 5300;
  }
  for (i = 1; i < ver * hor + 1; i++) {
    arr.push(i)
  }
  setTimeout(() => {
    shuffle(arr);
  }, 0);
  console.log(arr);
}

const setting = (ver, hor) => {
  for (let i = 0; i < ver * hor; i++) {
    
    const num = i + 1;
    const card = document.createElement("div");
    const cardInner = document.createElement("div");
    const front = document.createElement("div");
    const back = document.createElement("div");

    card.classList.add("card");
    cardInner.classList.add("cardInner");
    front.classList.add("front");
    back.classList.add("back");

    front.classList.add(num);

    container.appendChild(card);
    card.appendChild(cardInner);
    cardInner.appendChild(front);
    cardInner.appendChild(back);

    front.innerHTML = i + 1;
    back.innerHTML = i + 1;

    // 앞면에 카드 색 넣기
    front.style.backgroundColor = 'rgb(194, 188, 255)';
    // 뒷면에 카드 색 넣기
    back.style.backgroundColor = color[i];

    start.addEventListener('click', cardArr);
  } 
};

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function cardArr() {
  console.log(arr);
  start.style.display = 'none';
  restart.style.display = 'flex';
  for (let i = 0; i < arr.length; i++) {
    const aa = arr[i]
    const target = document.getElementsByClassName(aa)[0]
    const mother = target.parentElement.parentElement;
    setTimeout(() => {
      mother.classList.toggle("flipped");
    }, speed * i);

    setTimeout(() => {
      mother.classList.remove("flipped")
    }, 500 + speed * i);
  }

  setTimeout(() => {
    startPage.style.display = 'flex';
  }, 700 + ver * hor * 600);

  setTimeout(() => {
    startPage.style.display = 'none';
  }, 1700 + ver * hor * 600)
  gameStart();
}

function gameStart() {
  let j = 0;
  for(let i = 1; i < arr.length + 1; i++) {
    const target = document.getElementsByClassName(i)[0];
    const mother = target.parentElement.parentElement;
    setTimeout(() => {
      console.log(mother);
      mother.addEventListener('click', () => {
        mother.classList.toggle("flipped");
        
        if (i === arr[j]) {
          j += 1;
          if (j === ver * hor) {
            setTimeout(() => {
              win.style.display = 'flex';
            }, 800);
          } return
        } else {
          setTimeout(() => {
            mother.classList.remove("flipped");
          }, 1000);
          gameOver.style.display = "flex";
          end.innerHTML = `틀렸어요..
          정답 순서는 ${arr}이에요`
          
          return
        }
        
      })
    }, openTime)
  }
}

mainStart.addEventListener('click', () => {
  chooseLevel();
  mainStart.style.display = 'none';
  guide.style.display = 'none';
  start.style.display = 'flex';
  level.style.display = 'none';
  setting(ver, hor);
})