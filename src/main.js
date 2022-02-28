"use strict";

const GAME_DURATION_SEC = 30;

const CASH_SIZE_WIDTH = 460;
const CASH_SIZE_HEIGHT = 90;
const CASH_COUNT = 1;

const gameContainer = document.querySelector(".game");

const receivedPrice = document.querySelector(".received");
const productPrice = document.querySelector(".product");
const change = document.querySelector(".change");
const input = document.querySelector(".change__value");
const cashResultVal = document.querySelector(".game_cashResult");
const resultText = document.querySelector(".result__Text");

const field = document.querySelector(".game__field");
const fieldCashBox = document.querySelector(".field__cash_box");

const timerIndicator = document.querySelector(".game__timer");
const feildRect = field.getBoundingClientRect();
const resetBtn = document.querySelector(".game_reset");
const submitBtn = document.querySelector(".game_submit");
const returnCashCont = document.querySelector(".game_retunCash");

const gameBtn = document.querySelector(".game__button");

const popUpContainer = document.querySelector(".pop-up");
const popUprefreshBtn = document.querySelector(".pop-up__refresh");
const popUpText = document.querySelector(".pop-up__message");

const coinSound = new Audio("./sound/coin.mp3");
const bgSound = new Audio("./sound/bg-SellBuyMusic.mp3");
const correctSound = new Audio("./sound/Correct.mp3");
const winSound = new Audio("./sound/win.mp3");
const wrongSound = new Audio("./sound/wrong.mp3");
const binSound = new Audio("./sound/bin.mp3");

let started = false;
let answer = 0;
let timer = undefined;
let fieldClicked = false;

field.addEventListener("click", onFieldClick);

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
    playSound(wrongSound);
  } else {
    startGame();
  }
});

popUprefreshBtn.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

submitBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
  showFinalResult();
});

resetBtn.addEventListener("click", () => {
  playSound(binSound);
  cashResultVal.innerText = "00000";
});

function startGame() {
  started = true;
  initGame();
  showQuiz();
  showTimer();
  handleGameButton();
  startGameTimer();
  returnCashAnimation();
  input.classList.add("play");
  playSound(bgSound);
}

function stopGame() {
  started = false;

  stopGameTimer();
  handleGameButton();
  showPopUpWithText("다시 한 번 해볼까요?");
  input.classList.remove("play");
  returnCashCont.classList.remove("play");
  stopSound(bgSound);
}

function initGame() {
  field.innerHTML = "";
  input.value = "";
  result("");
  cashResultVal.innerText = "00000";
  addCash("Cash50000", CASH_COUNT, "img/50000.png");
  addCash("Cash10000", CASH_COUNT, "img/10000.png");
  addCash("Cash5000", CASH_COUNT, "img/5000.png");
  addCash("Cash1000", CASH_COUNT, "img/1000.png");
  addCash("Cash500", CASH_COUNT, "img/500.png");
  addCash("Cash100", CASH_COUNT, "img/100.png");
  addCash("Cash50", CASH_COUNT, "img/50.png");
  addCash("Cash10", CASH_COUNT, "img/10.png");
}

function addCash(className, count, imgPath) {
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", `${className} cash_img`);
    item.setAttribute("src", imgPath);
    item.style.position = "relative";
    field.appendChild(item);
  }
}

function showQuiz() {
  let n1tenThousands = Math.floor(Math.random() * (6 - 4) + 4);
  let n1thousands = Math.floor(Math.random() * 9 + 1);
  let n1hundreds = 0;
  let n1tens = 0;
  let n1ones = 0;

  let n2tenThousands = Math.floor(Math.random() * (4 - 1) + 1);
  let n2thousands = Math.floor(Math.random() * 9 + 1);
  let n2hundreds = Math.floor(Math.random() * 9 + 1);
  let n2tens = Math.floor(Math.random() * 9 + 1);
  let n2ones = 0;

  let n1 = `${n1tenThousands}${n1thousands}${n1hundreds}${n1tens}${n1ones} `;
  let n2 = `${n2tenThousands}${n2thousands}${n2hundreds}${n2tens}${n2ones} `;

  n1 = Number(n1);
  n2 = Number(n2);
  receivedPrice.value = n1;
  productPrice.value = n2;

  answer = n1 - n2;
  console.log(answer);

  inputEnter();
}

function handleGameButton() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.toggle("fa-stop");
  icon.classList.toggle("fa-play");
}

function inputEnter() {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      showResult();
    }
  });
}

function showResult() {
  if (Number(input.value) === answer) {
    returnCashCont.classList.add("play");
    input.classList.remove("play");
    playSound(correctSound);
    result("맞았어요! 이제 금액에 맞게 거스름돈을 드려볼까요? ");
  } else {
    playSound(wrongSound);
    result("음..다시 한번 계산해볼까요?");
  }
}

function result(text) {
  resultText.innerHTML = text;
}

function resetInputValue() {
  if (fieldClicked === true) {
    return false;
  }
  fieldClicked = true;
  input.value = "";
}

function onFieldClick(e) {
  if (!started) {
    return;
  }

  const target = e.target;

  function resultCash(valueName, cashValue) {
    if (target.matches(".Cash" + `${cashValue}`)) {
      playSound(coinSound);
      valueName.innerText = Number(valueName.innerText) + cashValue;
    }
  }

  resultCash(cashResultVal, 50000);
  resultCash(cashResultVal, 10000);
  resultCash(cashResultVal, 5000);
  resultCash(cashResultVal, 1000);
  resultCash(cashResultVal, 500);
  resultCash(cashResultVal, 100);
  resultCash(cashResultVal, 50);
  resultCash(cashResultVal, 10);
}

function showTimer() {
  timerIndicator.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      playSound(wrongSound);
      showPopUpWithText("시간 초과 ⏰  다시 한 번 해볼까요?");
      stopGame();
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const seconds = time % 60;
  timerIndicator.innerHTML = `${seconds}`;
}

function showPopUp() {
  popUpContainer.classList.remove("hide");
  showResult();
}

function hidePopUp() {
  popUpContainer.classList.add("hide");
}

function showFinalResult() {
  // console.log("input.value", Number(input.value));
  // console.log("answer", answer);
  if (Number(cashResultVal.innerText) === answer) {
    playSound(winSound);
    showPopUpWithText("훌륭해요! 다음에 또 올게요!");
  } else {
    playSound(wrongSound);
    showPopUpWithText("다시 한번 해볼까요?");
  }
}

function showPopUpWithText(text) {
  popUpContainer.classList.remove("hide");
  popUpText.innerText = text;
}

function returnCashAnimation() {
  input.classList.add("play");
  returnCashCont.classList.remove("play");
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
