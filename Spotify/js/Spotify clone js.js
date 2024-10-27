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

async function getsongs(folder) {
    try {
        currfolder = folder;
        console.log(`Fetching songs from folder: Spotify/songs/${currfolder}`);
        
        let response = await fetch(`Spotify/songs/${currfolder}/`);
        console.log('Response:', response);
        
        if (!response.ok) throw new Error('Failed to fetch songs');
        
        let div = document.createElement('div');
        div.innerHTML = await response.text();
        
        let as = div.getElementsByTagName('a');
        songs = [];
        
        for (let element of as) {
            if (element.href.endsWith('.mp3')) {
                songs.push(element.href.split(`${currfolder}/`)[1]);
            }
        }
        
        console.log('Songs:', songs);
        updateSongList();
    } catch (error) {
        console.error(error);
        alert('Unable to fetch songs. Please try again later.');
    }
}

const updateSongList = () => {
    let songUL = document.querySelector('.songlist ul');
    songUL.innerHTML = '';
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

const playmusic = (track, pause = false) => {
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

async function loadPlaylistCovers() {
    try {
        const response = await fetch('Spotify/songs/info.json');
        if (!response.ok) throw new Error('Failed to fetch json data');
        
        const albums = await response.json();
        const cardContainer = document.querySelector('.cardContainer');
        cardContainer.innerHTML = '';
        
        albums.forEach(album => {
            cardContainer.innerHTML += `
                <div data-title="${album.title}" class="card">
                    <img src="Spotify/songs/${album.title}/cover.jpg" alt="${album.name} cover">
                    <div>${album.name}</div>
                </div>`;
        });
        
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', async function () {
                await getsongs(this.dataset.folder);
            });
        });
    } catch (error) {
        console.error('Error loading playlist covers:', error);
        alert('Unable to load playlists.');
    }
}

async function main() {
    await loadPlaylistCovers();
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
        if (currentIndex > 0) playmusic(songs[currentIndex - 1]);
    });

    document.getElementById('next').addEventListener('click', () => {
        if (currentIndex < songs.length - 1) playmusic(songs[currentIndex + 1]);
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













































































