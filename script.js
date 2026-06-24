const slideGroup = document.getElementById("slideGroup");
const middlePanel = document.getElementById("middlePanel");
const hiddenWord = document.getElementById("hiddenWord");
const leftWord = document.getElementById("leftWord");
const rightWord = document.getElementById("rightWord");
const foldLeft = document.getElementById("foldLeft");
const foldRight = document.getElementById("foldRight");

slideGroup.classList.add("hint");

// 닫힌 상태에서도 '미안', '해'는 보이게
leftWord.style.opacity = 1;
rightWord.style.opacity = 1;
hiddenWord.style.opacity = 0;

let dragging = false;
let startX = 0;
let currentX = 0;

const startLeft = 480;
const foldWidth = 330;

slideGroup.addEventListener("mousedown", startDrag);
slideGroup.addEventListener("touchstart", startDrag, { passive: false });

window.addEventListener("mousemove", drag);
window.addEventListener("touchmove", drag, { passive: false });

window.addEventListener("mouseup", stopDrag);
window.addEventListener("touchend", stopDrag);

function startDrag(e) {
  dragging = true;

  slideGroup.classList.remove("hint");
  slideGroup.style.transition = "none";

  startX = getX(e) - currentX;
}

function drag(e) {
  if (!dragging) return;
  e.preventDefault();

  currentX = getX(e) - startX;

  if (currentX < 0) currentX = 0;
  if (currentX > foldWidth) currentX = foldWidth;

  updateFold(currentX);
}

function stopDrag() {
  if (!dragging) return;

  dragging = false;

  const progress = currentX / foldWidth;

  if (progress > 0.82) {
    currentX = foldWidth;
  }

  if (progress < 0.18) {
    currentX = 0;
  }

  slideGroup.style.transition =
    "left 0.28s cubic-bezier(.2,.9,.2,1)";

  middlePanel.style.transition =
    "width 0.28s cubic-bezier(.2,.9,.2,1)";

  hiddenWord.style.transition =
    "opacity 0.28s ease, width 0.28s ease";

  foldLeft.style.transition =
    "transform 0.28s ease, opacity 0.28s ease";

  foldRight.style.transition =
    "transform 0.28s ease, opacity 0.28s ease";

  updateFold(currentX);

  setTimeout(() => {
    middlePanel.style.transition = "none";
    hiddenWord.style.transition = "none";
    foldLeft.style.transition = "none";
    foldRight.style.transition = "none";

    if (currentX === 0) {
      slideGroup.classList.add("hint");
    }
  }, 1500);
}

function updateFold(value) {
  const progress = value / foldWidth;

  middlePanel.style.width = value + "px";
  slideGroup.style.left = startLeft + value + "px";

  // '미안', '해'는 항상 보임
  leftWord.style.opacity = 1;
  rightWord.style.opacity = 1;

  // '하다고'만 펼칠수록 나타남
  hiddenWord.style.opacity = progress;
  hiddenWord.style.width = value + "px";

  const foldOpacity = 1 - progress;

  const leftAngle = -105 + progress * 105;
  const rightAngle = 105 - progress * 105;

  foldLeft.style.opacity = foldOpacity;
  foldRight.style.opacity = foldOpacity;

  foldLeft.style.transform = `rotateY(${leftAngle}deg)`;
  foldRight.style.transform = `rotateY(${rightAngle}deg)`;

  if (progress > 0.96) {
    foldLeft.style.opacity = 0;
    foldRight.style.opacity = 0;
  }
}

function getX(e) {
  if (e.touches) {
    return e.touches[0].clientX;
  }

  return e.clientX;
}
