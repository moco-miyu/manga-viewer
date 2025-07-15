const totalPages = 3;
let currentPage = 1;

const canvas = document.getElementById("mangaCanvas");
const ctx = canvas.getContext("2d");

function loadPage(pageNum) {
  const img = new Image();
  const paddedNum = pageNum.toString().padStart(2, '0');
  img.src = `images/page${paddedNum}.png`;
  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

// 左ボタン = 「次のページ」（ページ数増える）
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadPage(currentPage);
  }
});

// 右ボタン = 「前のページ」（ページ数減る）
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadPage(currentPage);
  }
});

// スワイプ処理（右にスワイプ → 次のページ、左にスワイプ → 前のページ）
let touchStartX = 0;

canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});

canvas.addEventListener("touchend", (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  if (deltaX > 50 && currentPage < totalPages) {
    currentPage++;
    loadPage(currentPage);
  } else if (deltaX < -50 && currentPage > 1) {
    currentPage--;
    loadPage(currentPage);
  }
});

loadPage(currentPage);