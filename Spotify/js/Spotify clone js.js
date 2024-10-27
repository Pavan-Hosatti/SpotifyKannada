let currentSong = new Audio();
let songs = [];
let currentIndex = -1;
let currfolder = '';

// Converts seconds to minutes:seconds format
function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Fetch and display songs when a playlist is clicked
async function getsongs(folder) {
    try {
        currfolder = folder;
        console.log(`Fetching songs from Spotify/songs/${currfolder}/info.json`);
        
        let response = await fetch(`Spotify/songs/${currfolder}/info.json`);
        if (!response.ok) throw new Error('Failed to fetch songs');

        let data = await response.json();
        songs = data.songs || [];
        
        console.log(`Songs fetched: ${JSON.stringify(songs)}`); // Logging fetched songs
        updateSongList();

        // Play the first song in the playlist
        if (songs.length > 0) {
            playmusic(songs[0]);
        }
    } catch (error) {
        console.error(error);
        alert('Unable to fetch songs. Please try again later.');
    }
}

// Update the displayed song list
const updateSongList = () => {
    let songUL = document.querySelector('.songlist ul');
    songUL.innerHTML = '';
    currentIndex = -1; // Reset currentIndex on new playlist

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class='invert' src='Spotify/img/music.svg' alt=''>
                <div class='info'>
                    <div>${song.replaceAll('%20', ' ')}</div>
                    <div>Artist</div>
                </div>
                <div class='playnow'>
                    <span>Play now</span>
                    <img class='invert' src='Spotify/img/play.svg' alt=''>
                </div>
            </li>`;
    }

    Array.from(songUL.getElementsByTagName('li')).forEach((e, index) => {
        e.addEventListener('click', () => {
            playmusic(songs[index]);
        });
    });
}

// Play the selected song
const playmusic = (track, pause = false) => {
    currentSong.src = `Spotify/songs/${currfolder}/${track}`;
    currentSong.load();
    console.log("Loading track:", currentSong.src);

    if (!pause) {
        currentSong.play().then(() => {
            console.log("Song is playing");
            document.getElementById('play').src = 'Spotify/img/pause.svg';
        }).catch(error => {
            console.error("Playback failed:", error);
        });
    } else {
        currentSong.pause();
        document.getElementById('play').src = 'Spotify/img/play.svg';
    }

    document.querySelector('.songinfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
    currentIndex = songs.indexOf(track);
};

// Load album data from albums.json and create album cards
async function loadAlbumData() {
    try {
        const response = await fetch('Spotify/albums.json');
        if (!response.ok) throw new Error('Failed to fetch album data');
        
        const albums = await response.json();
        const cardContainer = document.querySelector('.cardContainer');
        cardContainer.innerHTML = '';

        albums.forEach(album => {
            cardContainer.innerHTML += `
                <div data-folder="${album.folder}" class="card">
                    <img src="Spotify/songs/${album.folder}/cover.jpg" alt="${album.name} cover">
                    <div>${album.name}</div>
                </div>`;
        });

        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', async function () {
                await getsongs(this.dataset.folder);
            });
        });
    } catch (error) {
        console.error('Error loading album data:', error);
        alert('Unable to load album data.');
    }
}

// Initialize app
async function main() {
    await loadAlbumData();

    // Play/Pause button functionality
    document.getElementById('play').addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById('play').src = 'Spotify/img/pause.svg';
        } else {
            currentSong.pause();
            document.getElementById('play').src = 'Spotify/img/play.svg';
        }
    });

    // Update the time display and seek bar during song playback
    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.songtime').innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    });

    // Previous and Next buttons functionality
    document.getElementById('previous').addEventListener('click', () => {
        if (currentIndex > 0) playmusic(songs[currentIndex - 1]);
    });

    document.getElementById('next').addEventListener('click', () => {
        if (currentIndex < songs.length - 1) playmusic(songs[currentIndex + 1]);
    });

    // Volume control slider
    document.querySelector('.range input').addEventListener('input', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Mute/Unmute functionality
    document.querySelector('.volume > img').addEventListener('click', (e) => {
        if (e.target.src.includes('volume.svg')) {
            e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
            currentSong.volume = 0;
            document.querySelector('.range input').value = 0;
        } else {
            e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
            currentSong.volume = 0.1;
            document.querySelector('.range input').value = 10;
        }
    });

    // Show and hide hamburger menu
    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    });

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%';
    });

    // Seek bar control
    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });
}

main();





















// let currentSong = new Audio();
// let songs = [];
// let currentIndex = -1;
// let currfolder = '';

// function secondsToMinutes(seconds) {
//     if (isNaN(seconds) || seconds < 0) return "00:00";
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// }

// // Fetch and display songs when a playlist is clicked
// async function getsongs(folder) {
//     try {
//         currfolder = folder;
//         console.log(`Fetching songs from Spotify/songs/${currfolder}/info.json`);
        
//         let response = await fetch(`Spotify/songs/${currfolder}/info.json`);
//         if (!response.ok) throw new Error('Failed to fetch songs');

//         let data = await response.json();
//         songs = data.songs || [];

//         // Automatically play the first song if songs are available
//         if (songs.length > 0) {
//             currentIndex = 0; // Set current index to the first song
//             playmusic(songs[currentIndex]); // Play the first song
//         }

//         updateSongList();
//     } catch (error) {
//         console.error(error);
//         alert('Unable to fetch songs. Please try again later.');
//     }
// }

// // Update the displayed song list
// const updateSongList = () => {
//     let songUL = document.querySelector('.songlist ul');
//     songUL.innerHTML = '';
//     for (const song of songs) {
//         songUL.innerHTML += `
//             <li>
//                 <img class='invert' src='Spotify/img/music.svg' alt=''>
//                 <div class='info'>
//                     <div>${song.replaceAll('%20', ' ')}</div>
//                     <div>Artist</div>
//                 </div>
//                 <div class='playnow'>
//                     <span>Play now</span>
//                     <img class='invert' src='Spotify/img/play.svg' alt=''>
//                 </div>
//             </li>`;
//     }
//     Array.from(songUL.getElementsByTagName('li')).forEach((e, index) => {
//         e.addEventListener('click', () => {
//             currentIndex = index; // Update current index to the clicked song
//             playmusic(songs[currentIndex]); // Play the selected song
//         });
//     });
// }

// // Play selected song
// const playmusic = (track, pause = false) => {
//     currentSong.src = `Spotify/songs/${currfolder}/${track}`;
//     currentSong.load();
//     console.log("Loading track:", currentSong.src);
    
//     if (!pause) {
//         currentSong.play().then(() => {
//             console.log("Song is playing");
//             document.getElementById('play').src = 'Spotify/img/pause.svg';
//         }).catch(error => {
//             console.error("Playback failed:", error);
//         });
//     } else {
//         currentSong.pause();
//         document.getElementById('play').src = 'Spotify/img/play.svg';
//     }

//     document.querySelector('.songinfo').innerHTML = decodeURI(track);
//     document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
// };

// // Load album data from albums.json
// async function loadAlbumData() {
//     try {
//         const response = await fetch('Spotify/albums.json');
//         if (!response.ok) throw new Error('Failed to fetch album data');
        
//         const albums = await response.json();
//         const cardContainer = document.querySelector('.cardContainer');
//         cardContainer.innerHTML = '';
        
//         albums.forEach(album => {
//             cardContainer.innerHTML += `
//                 <div data-folder="${album.folder}" class="card">
//                     <img src="Spotify/songs/${album.folder}/cover.jpg" alt="${album.name} cover">
//                     <div>${album.name}</div>
//                 </div>`;
//         });
        
//         document.querySelectorAll('.card').forEach(card => {
//             card.addEventListener('click', async function () {
//                 await getsongs(this.dataset.folder);
//             });
//         });
//     } catch (error) {
//         console.error('Error loading album data:', error);
//         alert('Unable to load album data.');
//     }
// }

// // Initialize app
// async function main() {
//     await loadAlbumData();
    
//     document.getElementById('play').addEventListener('click', () => {
//         if (currentSong.paused) {
//             currentSong.play();
//             document.getElementById('play').src = 'Spotify/img/pause.svg';
//         } else {
//             currentSong.pause();
//             document.getElementById('play').src = 'Spotify/img/play.svg';
//         }
//     });

//     currentSong.addEventListener('timeupdate', () => {
//         document.querySelector('.songtime').innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
//         document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
//     });

//     document.getElementById('previous').addEventListener('click', () => {
//         if (currentIndex > 0) {
//             currentIndex--; // Decrement index
//             playmusic(songs[currentIndex]); // Play previous song
//         }
//     });

//     document.getElementById('next').addEventListener('click', () => {
//         if (currentIndex < songs.length - 1) {
//             currentIndex++; // Increment index
//             playmusic(songs[currentIndex]); // Play next song
//         }
//     });

//     document.querySelector('.range input').addEventListener('input', (e) => {
//         currentSong.volume = parseInt(e.target.value) / 100;
//     });

//     document.querySelector('.volume > img').addEventListener('click', (e) => {
//         if (e.target.src.includes('volume.svg')) {
//             e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
//             currentSong.volume = 0;
//             document.querySelector('.range input').value = 0;
//         } else {
//             e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
//             currentSong.volume = 0.1;
//             document.querySelector('.range input').value = 10;
//         }
//     });

//     document.querySelector('.hamburger').addEventListener('click', () => {
//         document.querySelector('.left').style.left = '0';
//     });

//     document.querySelector('.close').addEventListener('click', () => {
//         document.querySelector('.left').style.left = '-100%';
//     });

//     document.querySelector('.seekbar').addEventListener('click', e => {
//         let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
//         document.querySelector('.circle').style.left = percent + '%';
//         currentSong.currentTime = ((currentSong.duration) * percent) / 100;
//     });
// }

// main();








// let currentSong = new Audio();
// let songs = [];
// let currentIndex = -1;
// let currfolder = '';

// function secondsToMinutes(seconds) {
//     if (isNaN(seconds) || seconds < 0) return "00:00";
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// }

// // Fetch and display songs when a playlist is clicked
// async function getsongs(folder) {
//     try {
//         currfolder = folder;
//         console.log(`Fetching songs from Spotify/songs/${currfolder}/info.json`);
        
//         let response = await fetch(`Spotify/songs/${currfolder}/info.json`);
//         if (!response.ok) throw new Error('Failed to fetch songs');

//         let data = await response.json();
//         songs = data.songs || [];
        
//         updateSongList();
//     } catch (error) {
//         console.error(error);
//         alert('Unable to fetch songs. Please try again later.');
//     }
// }

// // Update the displayed song list
// const updateSongList = () => {
//     let songUL = document.querySelector('.songlist ul');
//     songUL.innerHTML = '';
//     for (const song of songs) {
//         songUL.innerHTML += `
//             <li>
//                 <img class='invert' src='Spotify/img/music.svg' alt=''>
//                 <div class='info'>
//                     <div>${song.replaceAll('%20', ' ')}</div>
//                     <div>Artist</div>
//                 </div>
//                 <div class='playnow'>
//                     <span>Play now</span>
//                     <img class='invert' src='Spotify/img/play.svg' alt=''>
//                 </div>
//             </li>`;
//     }
//     Array.from(songUL.getElementsByTagName('li')).forEach((e, index) => {
//         e.addEventListener('click', () => {
//             playmusic(songs[index]);
//         });
//     });
// }

// // Play selected song
// const playmusic = (track, pause = false) => {
//     currentSong.src = `Spotify/songs/${currfolder}/${track}`;
//     currentSong.load();
//     console.log("Loading track:", currentSong.src);
    
//     if (!pause) {
//         currentSong.play().then(() => {
//             console.log("Song is playing");
//             document.getElementById('play').src = 'Spotify/img/pause.svg';
//         }).catch(error => {
//             console.error("Playback failed:", error);
//         });
//     } else {
//         currentSong.pause();
//         document.getElementById('play').src = 'Spotify/img/play.svg';
//     }

//     document.querySelector('.songinfo').innerHTML = decodeURI(track);
//     document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
//     currentIndex = songs.indexOf(track);
// };


// // Load album data from albums.json
// async function loadAlbumData() {
//     try {
//         const response = await fetch('Spotify/albums.json');
//         if (!response.ok) throw new Error('Failed to fetch album data');
        
//         const albums = await response.json();
//         const cardContainer = document.querySelector('.cardContainer');
//         cardContainer.innerHTML = '';
        
//         albums.forEach(album => {
//             cardContainer.innerHTML += `
//                 <div data-folder="${album.folder}" class="card">
//                     <img src="Spotify/songs/${album.folder}/cover.jpg" alt="${album.name} cover">
//                     <div>${album.name}</div>
//                 </div>`;
//         });
        
//         document.querySelectorAll('.card').forEach(card => {
//             card.addEventListener('click', async function () {
//                 await getsongs(this.dataset.folder);
//             });
//         });
//     } catch (error) {
//         console.error('Error loading album data:', error);
//         alert('Unable to load album data.');
//     }
// }

// // Initialize app
// async function main() {
//     await loadAlbumData();
    
//     document.getElementById('play').addEventListener('click', () => {
//         if (currentSong.paused) {
//             currentSong.play();
//             document.getElementById('play').src = 'Spotify/img/pause.svg';
//         } else {
//             currentSong.pause();
//             document.getElementById('play').src = 'Spotify/img/play.svg';
//         }
//     });

//     currentSong.addEventListener('timeupdate', () => {
//         document.querySelector('.songtime').innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
//         document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
//     });

//     document.getElementById('previous').addEventListener('click', () => {
//         if (currentIndex > 0) playmusic(songs[currentIndex - 1]);
//     });

//     document.getElementById('next').addEventListener('click', () => {
//         if (currentIndex < songs.length - 1) playmusic(songs[currentIndex + 1]);
//     });

//     document.querySelector('.range input').addEventListener('input', (e) => {
//         currentSong.volume = parseInt(e.target.value) / 100;
//     });

//     document.querySelector('.volume > img').addEventListener('click', (e) => {
//         if (e.target.src.includes('volume.svg')) {
//             e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
//             currentSong.volume = 0;
//             document.querySelector('.range input').value = 0;
//         } else {
//             e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
//             currentSong.volume = 0.1;
//             document.querySelector('.range input').value = 10;
//         }
//     });

//     document.querySelector('.hamburger').addEventListener('click', () => {
//         document.querySelector('.left').style.left = '0';
//     });

//     document.querySelector('.close').addEventListener('click', () => {
//         document.querySelector('.left').style.left = '-100%';
//     });

//     document.querySelector('.seekbar').addEventListener('click', e => {
//         let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
//         document.querySelector('.circle').style.left = percent + '%';
//         currentSong.currentTime = ((currentSong.duration) * percent) / 100;
//     });
// }

// main();

















// let currentSong = new Audio();
// let songs = [];
// let currentIndex = -1;
// let currfolder = '';

// function secondsToMinutes(seconds) {
//     if (isNaN(seconds) || seconds < 0) return "00:00";
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);
//     return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
// }

// // Fetch and display songs when a playlist is clicked
// async function getsongs(folder) {
//     try {
//         currfolder = folder;
//         console.log(`Fetching songs from Spotify/songs/${currfolder}/info.json`);
        
//         let response = await fetch(`Spotify/songs/${currfolder}/info.json`);
//         if (!response.ok) throw new Error('Failed to fetch songs');

//         let data = await response.json();
//         songs = data.songs || [];
        
//         updateSongList();
//     } catch (error) {
//         console.error(error);
//         alert('Unable to fetch songs. Please try again later.');
//     }
// }

// // Update the displayed song list
// const updateSongList = () => {
//     let songUL = document.querySelector('.songlist ul');
//     songUL.innerHTML = '';
//     for (const song of songs) {
//         songUL.innerHTML += `
//             <li>
//                 <img class='invert' src='Spotify/img/music.svg' alt=''>
//                 <div class='info'>
//                     <div>${song.replaceAll('%20', ' ')}</div>
//                     <div>Artist</div>
//                 </div>
//                 <div class='playnow'>
//                     <span>Play now</span>
//                     <img class='invert' src='Spotify/img/play.svg' alt=''>
//                 </div>
//             </li>`;
//     }
//     Array.from(songUL.getElementsByTagName('li')).forEach((e, index) => {
//         e.addEventListener('click', () => {
//             playmusic(songs[index]);
//         });
//     });
// }

// // Play selected song
// const playmusic = (track, pause = false) => {
//     currentSong.src = `Spotify/songs/${currfolder}/${track}`;
//     if (!pause) {
//         currentSong.play();
//         document.getElementById('play').src = 'Spotify/img/pause.svg';
//     } else {
//         currentSong.pause();
//         document.getElementById('play').src = 'Spotify/img/play.svg';
//     }
//     document.querySelector('.songinfo').innerHTML = decodeURI(track);
//     document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
//     currentIndex = songs.indexOf(track);
// }

// // Load album data from albums.json
// async function loadAlbumData() {
//     try {
//         const response = await fetch('Spotify/albums.json');
//         if (!response.ok) throw new Error('Failed to fetch album data');
        
//         const albums = await response.json();
//         const cardContainer = document.querySelector('.cardContainer');
//         cardContainer.innerHTML = '';
        
//         albums.forEach(album => {
//             cardContainer.innerHTML += `
//                 <div data-folder="${album.folder}" class="card">
//                     <img src="Spotify/songs/${album.folder}/cover.jpg" alt="${album.name} cover">
//                     <div>${album.name}</div>
//                 </div>`;
//         });
        
//         document.querySelectorAll('.card').forEach(card => {
//             card.addEventListener('click', async function () {
//                 await getsongs(this.dataset.folder);
//             });
//         });
//     } catch (error) {
//         console.error('Error loading album data:', error);
//         alert('Unable to load album data.');
//     }
// }

// // Initialize app
// async function main() {
//     await loadAlbumData();
    
//     document.getElementById('play').addEventListener('click', () => {
//         if (currentSong.paused) {
//             currentSong.play();
//             document.getElementById('play').src = 'Spotify/img/pause.svg';
//         } else {
//             currentSong.pause();
//             document.getElementById('play').src = 'Spotify/img/play.svg';
//         }
//     });

//     currentSong.addEventListener('timeupdate', () => {
//         document.querySelector('.songtime').innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
//         document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
//     });

//     document.getElementById('previous').addEventListener('click', () => {
//         if (currentIndex > 0) playmusic(songs[currentIndex - 1]);
//     });

//     document.getElementById('next').addEventListener('click', () => {
//         if (currentIndex < songs.length - 1) playmusic(songs[currentIndex + 1]);
//     });

//     document.querySelector('.range input').addEventListener('input', (e) => {
//         currentSong.volume = parseInt(e.target.value) / 100;
//     });

//     document.querySelector('.volume > img').addEventListener('click', (e) => {
//         if (e.target.src.includes('volume.svg')) {
//             e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
//             currentSong.volume = 0;
//             document.querySelector('.range input').value = 0;
//         } else {
//             e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
//             currentSong.volume = 0.1;
//             document.querySelector('.range input').value = 10;
//         }
//     });

//     document.querySelector('.hamburger').addEventListener('click', () => {
//         document.querySelector('.left').style.left = '0';
//     });

//     document.querySelector('.close').addEventListener('click', () => {
//         document.querySelector('.left').style.left = '-100%';
//     });

//     document.querySelector('.seekbar').addEventListener('click', e => {
//         let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
//         document.querySelector('.circle').style.left = percent + '%';
//         currentSong.currentTime = ((currentSong.duration) * percent) / 100;
//     });
// }

// main();





































































































