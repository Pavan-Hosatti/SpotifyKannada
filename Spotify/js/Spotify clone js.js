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
        let response = await fetch(`/Spotify/songs/${folder}`);
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
    currentSong.src = `/Spotify/songs/${currfolder}/${track}`;
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
        let response = await fetch("/Spotify/songs/");
        if (!response.ok) throw new Error("Failed to fetch albums");
        let div = document.createElement("div");
        div.innerHTML = await response.text();
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        cardContainer.innerHTML = "";
        for (let e of anchors) {
            if (e.href.includes("/Spotify/songs") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-2)[0];
                let infoResponse = await fetch(`/Spotify/songs/${folder}/info.json`);
                if (!infoResponse.ok) throw new Error("Failed to fetch folder info");
                let folderInfo = await infoResponse.json();
                cardContainer.innerHTML += `
                    <div data-folder="${folder}" class="card">
                        <img src="/Spotify/songs/${folder}/cover.jpg" alt="">
                        <h2>${folderInfo.title}</h2>
                        <p>${folderInfo.description}</p>
                    </div>`;
            }
        }
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", async function () {
                await getsongs(this.dataset.folder);
                playmusic(songs[0]);
            });
        });
    } catch (error) {
        console.error(error);
        alert("Unable to fetch albums. Please try again later.");
    }
}

async function main() {
    await displayAlbums();
    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById("play").src = "img/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.getElementById("previous").addEventListener("click", () => {
        if (currentIndex > 0) playmusic(songs[currentIndex - 1]);
    });

    document.getElementById("next").addEventListener("click", () => {
        if (currentIndex < songs.length - 1) playmusic(songs[currentIndex + 1]);
    });

    document.querySelector(".range input").addEventListener("input", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("mute.svg", "volume.svg");
        }
    });

    document.querySelector(".volume > img").addEventListener("click", (e) => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range input").value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range input").value = 10;
        }
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });
}

main();
















































// let currentSong = new Audio();
// let songs = [];
// let currfolder = "";
// let currentIndex = -1;

// function secondsToMinutes(seconds) {
//     if (isNaN(seconds) || seconds < 0) {
//         return "00:00";
//     }
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     const formattedMinutes = String(minutes).padStart(2, '0');
//     const formattedSeconds = String(remainingSeconds).padStart(2, '0');
//     return `${formattedMinutes}:${formattedSeconds}`;
// }

// async function getsongs(folder) {
//     try {
//         currfolder = folder;
//         let response = await fetch(`${folder}/`);
//         if (!response.ok) throw new Error("Failed to fetch songs");

//         let div = document.createElement("div");
//         div.innerHTML = await response.text();
//         let as = div.getElementsByTagName("a");
//         songs = []; 

//         for (let element of as) {
//             if (element.href.endsWith(".mp3")) {
//                 songs.push(element.href.split(currfolder)[1]);
//             }
//         }

//         updateSongList();
//     } catch (error) {
//         console.error(error);
//         alert("Unable to fetch songs. Please try again later.");
//     }
// }

// const updateSongList = () => {
//     let songUL = document.querySelector(".songlist ul");
//     songUL.innerHTML = ""; 
//     for (const song of songs) {
//         songUL.innerHTML += `
//             <li>
//                 <img class="invert" src="img/music.svg" alt="">
//                 <div class="info">
//                     <div>${song.replaceAll("%20", " ")}</div>
//                     <div>Harry</div>
//                 </div>
//                 <div class="playnow">
//                     <span>Play now</span>
//                     <img class="invert" src="img/play.svg" alt="">
//                 </div>
//             </li>`;
//     }

//     // Attach event listener to each song
//     Array.from(songUL.getElementsByTagName("li")).forEach((e, index) => {
//         e.addEventListener("click", () => {
//             playmusic(songs[index]);
//             // Close menu after selecting a song
//             closeHamburgerMenu(); 
//         });
//     });
// }

// const playmusic = (track, pause = false) => {
//     currentSong.src = `${currfolder}${track}`;
//     if (!pause) {
//         currentSong.play();
//         document.getElementById("play").src = "img/pause.svg";
//     }
//     document.querySelector(".songinfo").innerHTML = decodeURI(track);
//     document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
//     currentIndex = songs.indexOf(track);
// }

// async function displayAlbums() {
//     try {
//         let response = await fetch("/songs/");
//         if (!response.ok) throw new Error("Failed to fetch albums");

//         let div = document.createElement("div");
//         div.innerHTML = await response.text();
//         let anchors = div.getElementsByTagName("a");
//         let cardContainer = document.querySelector(".cardContainer");
//         cardContainer.innerHTML = "";

//         let array = Array.from(anchors);
//         for (let e of array) {
//             if (e.href.includes("/songs")) {
//                 if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
//                 let folder = e.href.split("/").slice(-2)[0];

//                 // Get the data of the folder
//                 let infoResponse = await fetch(`/songs/${folder}/info.json`);
//                 if (!infoResponse.ok) throw new Error("Failed to fetch folder info");

//                 let folderInfo = await infoResponse.json();
//                 cardContainer.innerHTML += `
//                     <div data-folder="${folder}" class="card">
//                         <div class="play">
//                             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
//                                 <circle cx="12" cy="12" r="10" fill="#5bb450" />
//                                 <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="black" />
//                             </svg>
//                         </div>
//                         <img src="/songs/${folder}/cover.jpg" alt="">
//                         <h2>${folderInfo.title}</h2>
//                         <p>${folderInfo.description}</p>
//                     </div>`;
//             }
//         }}

//         // Load the playlist whenever a card is clicked
//         Array.from(document.getElementsByClassName("card")).forEach(e => {
//             // Remove any previous click listeners
//             e.removeEventListener("click", cardClickHandler); 
//             e.addEventListener("click", cardClickHandler);
//         });
//     } catch (error) {
//         console.error(error);
//         alert("Unable to fetch albums. Please try again later.");
//     }
// }

// // Function to handle playlist card click
// async function cardClickHandler(e) {
//     await getsongs(`songs/${this.dataset.folder}`);
//     playmusic(songs[0]);
//     // Open the menu after selecting a playlist
//     toggleHamburgerMenu();
// }

// async function main() {
//     await displayAlbums();

//     // Attach event listener to play, next, and previous 
//     document.getElementById("play").addEventListener("click", () => {
//         if (currentSong.paused) {
//             currentSong.play();
//             document.getElementById("play").src = "img/pause.svg";
//         } else {
//             currentSong.pause();
//             document.getElementById("play").src = "img/play.svg";
//         }
//     });

//     // Time update event
//     currentSong.addEventListener("timeupdate", () => {
//         document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
//         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

//     });

//     // Add an event listener to previous
//     document.getElementById("previous").addEventListener("click", () => {
//         if (currentIndex > 0) {
//             playmusic(songs[currentIndex - 1]);
//         }
//     });

//     // Add an event listener to next
//     document.getElementById("next").addEventListener("click", () => {
//         if (currentIndex < songs.length - 1) {
//             playmusic(songs[currentIndex + 1]);
//         }
//     });

//     // Add event listener to volume (sound adjust)
//     document.querySelector(".range input").addEventListener("input", (e) => {
//         currentSong.volume = parseInt(e.target.value) / 100;
//         if(currentSong.volume > 0){
//             document.querySelector(".volume > img").src  =  document.querySelector(".volume > img").src.replace("mute.svg", "volume.svg");
//         }
//     });

//     // Add event listener to mute
//     document.querySelector(".volume > img").addEventListener("click", (e) => {
//         if (e.target.src.includes("volume.svg")) {
//             e.target.src = e.target.src.replace("volume.svg", "mute.svg");
//             currentSong.volume = 0;
//             document.querySelector(".range input").value = 0;
//         } else {
//             e.target.src = e.target.src.replace("mute.svg", "volume.svg");
//             currentSong.volume = 0.1;
//             document.querySelector(".range input").value = 10;
//         }
//     });

//     // Add event listener for hamburger menu
//     document.querySelector(".hamburger").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "0"
//     })


//     // event listener to close icon
//     document.querySelector(".close").addEventListener("click", () => {
//         document.querySelector(".left").style.left = "-100%";
//     })

//     //seekbar should move
     


//     // add event listner to seekbar
//     document.querySelector(".seekbar").addEventListener("click", e => {
//         let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
//         document.querySelector(".circle").style.left = percent + "%";
//         currentSong.currentTime = ((currentSong.duration) * percent) / 100;
//     })
// }
// main();














