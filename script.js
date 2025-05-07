console.log('hi script.js');

const container = document.querySelector("#spell-container");
const banner = document.querySelector("#now-playing-banner");

const API_URL = "https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7";

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error(e);
        return { songList: [] }; // Fallback, damit showData nicht crasht
    }
}

function showData(songList) {
    songList.forEach((element) => {
        let card = document.createElement("article");
        card.innerHTML = `
            <div class="cassette">
                <div class="label">
                    <p>🎵 Titel: "${element.title}"</h2>
                    <p>👤 Interpret: ${element.artist}</p>
                    <p>🕒 Zeit: ${element.time}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateNowPlayingBanner(song) {
    console.log("Aktueller Song für Banner:", song);
    banner.textContent = `${song.artist} - ${song.time} NOW PLAYING: "${song.title}"`;
}

async function startApp() {
    const myData = await fetchData(API_URL);
    console.log(myData.songList[0]);

    showData(myData.songList);
    updateNowPlayingBanner(myData.songList[0]);
}

startApp(); // <-- Starte alles hier
