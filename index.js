const likeContEL = document.querySelector(".like-container");
const historyContEl = document.querySelector(".history-container");
let history = JSON.parse(localStorage.getItem("history")) || [];

document.addEventListener("DOMContentLoaded", () => {
  Main();
});

async function getRandomPhoto() {
  try {
    const response = await fetch("https://api.unsplash.com/photos/random", {
      headers: {
        Authorization: "Client-ID Access Key",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    saveToHistory(data);
    return data;
  } catch (error) {
    console.error("Error fetching photo: ", error);
    if (error instanceof TypeError) {
      console.log("Network error or URL might be incorrect");
    }
  }
}

function saveToHistory(data) {
  history.push(data);
  if (history.length > 5) {
    history.shift();
  }
  localStorage.setItem("history", JSON.stringify(history));
}

function renderHistory() {
    if (!historyContEl) {
        console.error("History container not found");
        return;
    }
  let historyHTML = "";
  history.forEach((item, index) => {
    historyHTML += `<div class="history-item" data-index="${index}">
                            <img src="${item.urls.thumb}" alt="Thumbnail">
                        </div>`;
  });
  historyContEl.innerHTML = historyHTML;

  const historyItems = document.querySelectorAll(".history-item");
  historyItems.forEach((item) => {
    item.addEventListener("click", function () {
      const index = parseInt(item.getAttribute("data-index"));
      if (!isNaN(index) && index >= 0 && index < history.length) {
        const selectedData = history[index];
        const imgHTML = createImg(selectedData);
        likeContEL.innerHTML = imgHTML;
      }
    });
  });
}

function createImg(objInfo) {
  return `<div class="img">
                <img src="${objInfo.urls.regular}" alt="">
            </div>
            <div class="info">
                <h1 class="info_name">${objInfo.user.first_name}</h1>
                <h1 class="info_distr">${objInfo.user.bio}</h1>
                <button class="info_like">Like</button>
                <button class="info_previous">Previous</button>
                <p class="info_count">Просмотров: ${objInfo.likes}</p>
            </div>`;
}

async function Main() {
  const data = await getRandomPhoto();
  if (data) {
    const imgHTML = createImg(data);
    likeContEL.innerHTML = imgHTML;

    const likeButtonEl = document.querySelector(".info_like");
    const likeCountEl = document.querySelector(".info_count");
    const likePreviousEl = document.querySelector(".info_previous");

    let isLiked = false;

    likeButtonEl.addEventListener("click", function () {
      if (isLiked) {
        data.likes -= 1;
      } else {
        data.likes += 1;
      }
      isLiked = !isLiked;

      likeCountEl.textContent = `Просмотров: ${data.likes}`;
    });

    likePreviousEl.addEventListener("click", function () {
      if (history.length > 1) {
        history.pop();
        const previousData = history.pop();
        saveToHistory(previousData);
        const imgHTML = createImg(previousData);
        likeContEL.innerHTML = imgHTML;
        renderHistory();
      }
    });

    renderHistory();
  }
}
