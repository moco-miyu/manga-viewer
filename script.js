const totalPages = 20; // 画像の枚数に合わせて調整
let currentPage = 1;
const canvas = document.getElementById("mangaCanvas");
const ctx = canvas.getContext("2d");

function loadPage(page) {
  const img = new Image();
  const pageStr = page.toString().padStart(2, '0');
  img.src = `images/page${pageStr}.png`;

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // ページ進行表示更新
    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");
    progressText.textContent = `${currentPage} / ${totalPages}`;
    const progressPercent = currentPage / totalPages;
    progressFill.style.transform = `scaleX(${progressPercent})`;
  };
}

loadPage(currentPage);

// ボタンでページめくり（スマホでは非表示）
const isMobile = /iPhone|Android.+Mobile|Windows Phone/.test(navigator.userAgent);
if (!isMobile) {
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;  // 右から左に進む方向に変更
      loadPage(currentPage);
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;  // 右から左に戻る方向に変更
      loadPage(currentPage);
    }
  });
}

// スワイプ操作（スマホ向け）
let startX = null;

canvas.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

canvas.addEventListener("touchend", (e) => {
  if (startX === null) return;
  const endX = e.changedTouches[0].clientX;
  const diffX = endX - startX;

  if (Math.abs(diffX) > 50) {
    if (diffX > 0 && currentPage < totalPages) {  // 右スワイプで進む
      currentPage++;
    } else if (diffX < 0 && currentPage > 1) {  // 左スワイプで戻る
      currentPage--;
    }
    loadPage(currentPage);
  }

  startX = null;
});

// 画面中央タップで進行状況を一時表示
let progressTimer = null;

document.getElementById("viewer").addEventListener("click", (e) => {
  const screenWidth = window.innerWidth;
  const tapX = e.clientX;
  const isLeft = tapX < screenWidth * 0.33;
  const isRight = tapX > screenWidth * 0.66;

  if (isLeft || isRight) return;

  const container = document.getElementById("progressContainer");

  if (container.classList.contains("visible")) {
    clearTimeout(progressTimer);
    container.style.opacity = '0';
    setTimeout(() => {
      container.classList.remove("visible");
    }, 300);
  } else {
    container.classList.add("visible");
    container.style.opacity = '1';

    clearTimeout(progressTimer);
    progressTimer = setTimeout(() => {
      container.style.opacity = '0';
      setTimeout(() => {
        container.classList.remove("visible");
      }, 300);
    }, 2000);
  }
});