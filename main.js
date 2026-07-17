/* カードの初期化 */
loadYouTube();
loadPixiv();
console.log("main.js loaded");

function loadPixiv()
{

    fetch("pixiv_works.json")
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById("pixiv-list");

            data.slice(0, 6).forEach(work => {
                const article = createWorkCard(work);
                list.appendChild(article);
            });

            const list_ = document.getElementById("pixiv-list");
            const slider = list_.closest(".works-slider");
            initializeSlider(slider);
        })
        .catch(error => {
            console.error(error);
        });

}

function loadYouTube()
{
    const API_KEY = "AIzaSyBkeXZ2eVobAWGBfB3oNWvJBRhVOlZqifQ";
    const UPLOADS_PLAYLIST_ID = "UUtMTS0giQnrpwEtb7BbpQYg";

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=6&key=${API_KEY}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("youtube-list");

            data.items.forEach(video => {
                const videoId = video.snippet.resourceId.videoId;
                const work = YouTube_to_Work(video);
                const article = createWorkCard(work);
                list.appendChild(article);
            });

        const list_2 = document.getElementById("youtube-list");
        const slider = list_2.closest(".works-slider");
        initializeSlider(slider);

        });
}


/*Pixivと同じ形式に変換*/
function YouTube_to_Work(video)
{
    return {
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        url: `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`
    };
}

/*作品カードを作る*/
function createWorkCard(work)
{
    const article = document.createElement("article");
    enableTitleEffect(article);
    article.className = "work-item";

    article.innerHTML = `
        <a href="${work.url}" target="_blank" rel="noopener noreferrer">
            <img src="${work.thumbnail}" alt="${work.title}">
            <h4 class="work-title">　${work.title}</h4>
        </a>
    `;

    return article;
}

/*ホバー時に作品カードを傾ける*/
function enableTitleEffect(card)
{
    card.addEventListener("mousemove", (event) =>
        {
            const rect = card.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const rotateY = (mouseX - centerX) / 15;
            const rotateX = (centerY - mouseY) / 15;

            card.style.setProperty("--rotateX", `${rotateX}deg`);
            card.style.setProperty("--rotateY", `${rotateY}deg`);
        });
    card.addEventListener("mouseleave", () =>
        {
            card.style.setProperty("--rotateX", `0deg`);
            card.style.setProperty("--rotateY", `0deg`);
        });
}


/* スライダーのボタンわよ～ */
function initializeSlider(slider)
{
    const nextButton = slider.querySelector(".next");
    const prevButton = slider.querySelector(".prev");
    const workList = slider.querySelector(".work-list");

    const CARD_WIDTH = 344; // カード+ギャップの幅
    let currentIndex = 0;
    const visibleCount = 3;
    const totalCount = workList.children.length;
    const maxIndex = totalCount - visibleCount;

    function updateButtons()
    {
        prevButton.disabled = (currentIndex === 0);
        nextButton.disabled = (currentIndex === maxIndex);
    }

    updateButtons();

    nextButton.addEventListener("click",() => {

        if(currentIndex < maxIndex)
        {
            currentIndex++;
        }

        workList.style.transform = `translateX(${-currentIndex * CARD_WIDTH}px)`;
        updateButtons();
    });
    prevButton.addEventListener("click",() => {

        if(currentIndex > 0)
        {
            currentIndex--;
        }
        
        workList.style.transform = `translateX(${-currentIndex * CARD_WIDTH}px)`;
        updateButtons();
    });
}

