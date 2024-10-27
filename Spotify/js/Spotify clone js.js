let currentSong = new Audio();
let songs = [];
let currentIndex = -1;
let currfolder = '';

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Function to load songs from the clicked playlist folder
async function getSongs(folder) {
    try {
        currfolder = folder;
        console.log(`Fetching songs from folder: Spotify/songs/${currfolder}/info.json`);

        // Fetching songs from the info.json file inside the selected folder
        let response = await fetch(`Spotify/songs/${currfolder}/info.json`);
        
        if (!response.ok) throw new Error('Failed to fetch songs');
        
        let data = await response.json();
        songs = data.songs || [];
        
        console.log('Fetched songs:', songs);
        updateSongList();  // Update the song list UI
    } catch (error) {
        console.error('Error loading songs:', error);
        alert('Unable to fetch songs. Please try again later.');
    }
}

// Function to update the song list UI
const updateSongList = () => {
    let songUL = document.querySelector('.songlist ul');
    songUL.innerHTML = '';
    
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class='invert' src='Spotify/img/music.svg' alt=''>
                <div class='info'>
                    <div>${decodeURI(song.replace(/%20/g, ' '))}</div>
                    <div>Harry</div>
                </div>
                <div class='playnow'>
                    <span>Play now</span>
                    <img class='invert' src='Spotify/img/play.svg' alt=''>
                </div>
            </li>`;
    }
    
    // Add event listeners to each song item
    Array.from(songUL.getElementsByTagName('li')).forEach((element, index) => {
        element.addEventListener('click', () => {
            playMusic(songs[index]);
        });
    });
}

// Function to play a song
const playMusic = (track, pause = false) => {
    currentSong.src = `Spotify/songs/${currfolder}/${track}`;
    if (!pause) {
        currentSong.play();
        document.getElementById('play').src = 'Spotify/img/pause.svg';
    } else {
        currentSong.pause();
        document.getElementById('play').src = 'Spotify/img/play.svg';
    }
    document.querySelector('.songinfo').innerHTML = decodeURI(track);
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
    currentIndex = songs.indexOf(track);
}

// Function to dynamically load playlists based on folders in Spotify/songs
async function loadPlaylists() {
    const playlists = ['emotional', 'feel_good', 'powerful and energetic', 'romantic_and_soulful']; // List of folders under Spotify/songs
    
    const cardContainer = document.querySelector('.cardContainer');
    cardContainer.innerHTML = '';
    
    playlists.forEach(playlist => {
        cardContainer.innerHTML += `
            <div data-folder="${playlist}" class="card">
                <img src="Spotify/songs/${playlist}/cover.jpg" alt="${playlist} cover">
                <div>${playlist.replace(/_/g, ' ')}</div>
            </div>`;
    });
    
    // Add event listeners to each playlist card
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', async function () {
            await getSongs(this.dataset.folder);
        });
    });
}

// Main function to initialize the app
async function main() {
    await loadPlaylists();
    document.getElementById('play').addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            document.getElementById('play').src = 'Spotify/img/pause.svg';
        } else {
            currentSong.pause();
            document.getElementById('play').src = 'Spotify/img/play.svg';
        }
    });

    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.songtime').innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    });

    document.getElementById('previous').addEventListener('click', () => {
        if (currentIndex > 0) playMusic(songs[currentIndex - 1]);
    });

    document.getElementById('next').addEventListener('click', () => {
        if (currentIndex < songs.length - 1) playMusic(songs[currentIndex + 1]);
    });

    document.querySelector('.range input').addEventListener('input', (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector('.volume > img').src = document.querySelector('.volume > img').src.replace('mute.svg', 'volume.svg');
        }
    });

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

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    });

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%';
    });

    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });
}

main();












































































