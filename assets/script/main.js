;(function () {
    'use strict'
    
    const get = (target) => {
        return document.querySelector(target)
    }

    const $ready = get('.ready')
    const $question = get('.question')
    const $start = get('.start')
    const $buttons = get('.buttons')
    const $cross = get('.cross')
    const $firstCross = get('.first_cross')
    const $firstButtons = get('.first_buttons')
    const $display = get('.display')
    const $title = get('.title')
    const $button = get('.button')
    const $coin = get('.coin')
    const $coinImg = get('.coin_img')
    const $startBtn = get('.start_button')
    const $questionPage = get('.question_page')
    const $mainPage = get('.main_page')
    const $tetris = get('.tetris')

    const gameReady = () => {
        $coinImg.classList.toggle('show')
        setTimeout(coin_move, 200)
        setTimeout(gameReady2, 1200)
    }

    const gameReady2 = () => {
        $ready.classList.toggle('show')
        $start.classList.toggle('show')
        $firstButtons.classList.toggle('show')
        $firstCross.classList.toggle('show')
        $display.classList.toggle('show')
        $title.classList.toggle('start')
        $coin.classList.toggle('start')
        $button.classList.toggle('show')
        setTimeout(gameReady_button, 300)
    }

    const gameReady_button = () => {
        $buttons.classList.toggle('none')
        $cross.classList.toggle('none')
    }

    const startGame = () => {
        $question.classList.toggle('show')
        $start.classList.toggle('show') 
    }

    const gameStart = () => {
        $mainPage.classList.toggle('none')
        $tetris.classList.toggle('none')
        $questionPage.classList.toggle('show')
        $display.classList.toggle('show')
        $display.classList.toggle('start')
    }


    const coin_move = () => {
        $coinImg.style.marginRight = 150 + 'px';
        $coinImg.style.opacity = 10 + '%';
    }

    const init = () => {
        $ready.addEventListener('click', () => {
            gameReady()
        })
        $startBtn.addEventListener('click', () => {
            gameStart()
        })
    }
    init()
  })()
  
