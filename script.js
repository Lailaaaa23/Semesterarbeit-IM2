console.log('hi script.js')

const container = document.querySelector("#spell-container");

const API_URL = "https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7"


async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}

const myData = await fetchData(API_URL);
console.log(myData);

function showData () {
    myData.forEach((element) => {
        let card = document.createElement("article");
        /*card.classList.add("card");*/
        card.innerHTML = `
        <h2>${element.name}</h2>
        <p>${element.description}</p>
        `;
        container.appendChild(card);
    });
}

showData();