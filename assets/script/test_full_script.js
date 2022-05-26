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
      console.log(cells.length)
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
        }
        changeCarousel();
    }
    
    init();
  })()
  
