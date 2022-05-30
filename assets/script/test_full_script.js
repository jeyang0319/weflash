;(function () {
    'use strict'

    const carousel = document.querySelector(".carousel");
    let cells, cellCount;
    let selectedIndex = 0;
    const cellWidth = carousel.offsetWidth;
    let radius, theta;
    
    function rotateCarousel() {
      let angle = theta * selectedIndex * -1;
      carousel.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    }
    
    let prevButton = document.querySelector(".carousel_prev_button");
    prevButton.addEventListener("click", function () {
      selectedIndex--;
      rotateCarousel();
    });
    
    let nextButton = document.querySelector(".carousel_next_button");
    nextButton.addEventListener("click", function () {
      selectedIndex++;
      rotateCarousel();
    });
    
    
    function changeCarousel() {
      for (let i = 0; i < cells.length; i++) {
        radius = Math.round(cellWidth / 2 / Math.tan(Math.PI / cellCount));
        theta = 360 / cellCount;
        let cell = cells[i];
        if (i < cellCount) {
          // visible cell
          cell.style.opacity = 1;
          let cellAngle = theta * i;
          cell.style.transform = `rotateY(${cellAngle}deg) translateZ(${radius}px)`;
        } else {
          // hidden cell
          cell.style.opacity = 0;
          cell.style.transform = "none";
        }
      }
      rotateCarousel();
    }
    
    const init = () => {
        for (let index = 1; index <= 16; index++) {
            const carouselItem = document.createElement('div');
            const carouselImage = document.createElement('img');
            carouselImage.src = `../assets/images/mbti_games/${index}.png`;
            carouselItem.className = 'carousel_cell';
            carouselItem.appendChild(carouselImage);
            carousel.appendChild(carouselItem);
            cells = carousel.querySelectorAll(".carousel_cell");
            cellCount = cells.length;

            carouselImage.addEventListener('click', () => {
              const mbti_result = {
                "esfp": {num : 11},"istp": {num : 12},"isfp": {num : 15},"estp": {num : 13},"intj": {num : 10},"estj": {num : 14},"infp": {num : 16},"infj": {num : 6},"enfp": {num : 2},"entj": {num : 3},"intp": {num : 7},"esfj": {num : 5},"enfj": {num : 1},"entp": {num : 4},"istj": {num : 9},"isfj": {num : 8}
            }
              const mbtiArr = ["esfp", "istp", "isfp", "estp", "intj", "estj", "infp", "infj", "enfp", "entj", "intp", "esfj", "enfj", "entp", "istj", "isfj"];
              for (let i = 0; i < mbtiArr.length; i++) {
                  const mbti_type = (mbtiArr[i])
                  if (mbti_result[mbti_type]["num"] === index) {
                    location.href = `./result_${mbti_type}.html`
                  }
              }
            })
        }
        changeCarousel();
    }
    
    init();
  })()
  
