console.log('hi script.js');

const container = document.querySelector("#spell-container");
const banner = document.querySelector(".banner");

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

// function showData(songList) {
//     container.innerHTML = ""; // Alte Songkarten entfernen
//     songList.forEach((element) => {
//         let card = document.createElement("article");
//         card.innerHTML = `
//             <div class="cassette">
//                 <div class="label">
//                     <p>🎵 Titel: "${element.title}"</p>
//                     <p>👤 Interpret: ${element.artist.name}</p>
//                     <p>🕒 Zeit: ${new Date(element.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//                 </div>
//             </div>
//         `;
//         container.appendChild(card);
//     });
// }

function showData(songList) {
    container.innerHTML = ""; // Vorherige Inhalte löschen

    songList = songList.slice(1); // Den ersten Song entfernen

    songList.forEach((element) => {
        // Interpret sicher auslesen – je nach Struktur
        const artist = element.artist || element.interpreten?.[0] || "Unbekannt";
        
        // Zeit schön formatieren
        const formattedTime = new Date(element.date || element.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        let card = document.createElement("article");
        card.innerHTML = `
            <div class="cassette">
                <div class="label">
                    <p>🎵 Titel: "${element.title}"</p>
                    <p>👤 Interpret: ${artist.name}</p>
                    <p>🕒 Zeit: ${formattedTime}</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// function updateNowPlayingBanner(song) {
//     console.log("Aktueller Song für Banner:", song);
//     banner.textContent = `${song.artist} - ${song.time} NOW PLAYING: "${song.title}"`;
// }

function updateNowPlayingBanner(song) {
    const artist = song.artist?.name || song.interpreten?.[0] || "Unbekannt";

    const rawTime = song.startTime || song.date;
    let formattedTime = "?";
    if (rawTime) {
        const date = new Date(rawTime);
        if (!isNaN(date)) {
            formattedTime = date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    banner.innerHTML = `<span>NOW PLAYING: ${artist} - "${song.title}" - ${formattedTime} Uhr</span>`;
}

async function startApp() {
    const myData = await fetchData(API_URL);
    console.log(myData.songList[0]);

    showData(myData.songList);
    // updateNowPlayingBanner(myData.songList[0]);
    if (myData.songList.length > 0) {
        updateNowPlayingBanner(myData.songList[0]);
    } else {
        banner.textContent = "Aktuell wird kein Song gespielt.";
    }
}

startApp(); // <-- Starte alles hier
setInterval(startApp, 30000); // <-- Alle 30 Sekunden aktualisieren

// Dropdown-Menü zum Laden vergangener Songs
const archiveSelect = document.querySelector("#archive-select");
archiveSelect?.addEventListener("change", async (event) => {
    const archiveUrl = event.target.value;
    if (archiveUrl) {
        const data = await fetchData(archiveUrl);
        if (data.songList?.length > 0) {
            showArchivedSongs(data.songList);
        }
    }
});

// Funktion zum Anzeigen älterer Songs
function showArchivedSongs(songList) {
    const archiveContainer = document.querySelector("#archive-container");
    archiveContainer.innerHTML = ""; // Leeren

    songList.forEach((element) => {
        const artist = element.artist?.name || element.interpreten?.[0] || "Unbekannt";
        const formattedTime = new Date(element.date || element.startTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        const listItem = document.createElement("li");
        listItem.textContent = `${formattedTime} – ${artist}: "${element.title}"`;
        archiveContainer.appendChild(listItem);
    });
}
