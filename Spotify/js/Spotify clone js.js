let currentSong = new Audio();
let songs = [];
let currfolder = "";
let currentIndex = -1;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getsongs(folder) {
    try {
        currfolder = folder;
        let response = await fetch(`songs/${folder}`);
        if (!response.ok) throw new Error("Failed to fetch songs");
        let div = document.createElement("div");
        div.innerHTML = await response.text();
        let as = div.getElementsByTagName("a");
        songs = [];
        for (let element of as) {
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(currfolder)[1]);
            }
        }
        updateSongList();
    } catch (error) {
        console.error(error);
        alert("Unable to fetch songs. Please try again later.");
    }
}

const updateSongList = () => {
    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Harry</div>
                </div>
                <div class="playnow">
                    <span>Play now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>`;
    }
    Array.from(songUL.getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playmusic(songs[index]);
            closeHamburgerMenu();
        });
    });
}

const playmusic = (track, pause = false) => {
    currentSong.src = `songs/${currfolder}/${track}`;
    if (!pause) {
        currentSong.play();
        document.getElementById("play").src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    currentIndex = songs.indexOf(track);
}

async function displayAlbums() {
    try {
        let response = await fetch("songs/");
        if (!response.ok) throw new Error("Failed to fetch albums");
        let div = document.createElement("div");
        div.innerHTML = await response.text();
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";
        for (let e of anchors) {
            if (e.href.includes("songs") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-2)[0];
                let infoResponse = await fetch(`songs/${folder}/info.json`);
                if (!infoResponse.ok) throw new Error("Failed to fetch folder info");
                let folderInfo = await infoResponse.json();
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <img src="songs/${folder}/cover.jpg" alt="">
                        <h2>${folderInfo.title}</h2>
                        <p>${folderInfo.description}</p>
                    </div>`;
            }
        }
    }






























































