let currentSong = new Audio();
let songs = [];
let currentIndex = -1;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getsongs() {
    try {
        let response = await fetch('/Spotify/songs/');
        console.log('Songs Response:', response);
        if (!response.ok) throw new Error('Failed to fetch songs');
        let div = document.createElement('div');
        div.innerHTML = await response.text();
        let anchors = div.getElementsByTagName('a');
        songs = [];
        for (let anchor of anchors) {
            if (anchor.href.includes('.mp3')) {
                songs.push(anchor.href.split('/Spotify/songs/')[1]);
            }
        }
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
                    <div>Harry</div>
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
    currentSong.src = `/Spotify/songs/${track}`;
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

async function displayAlbums() {
    try {
        let response = await fetch('/Spotify/songs/');
        console.log('Albums Response:', response);
        if (!response.ok) throw new Error('Failed to fetch albums');
        let div = document.createElement('div');
        div.innerHTML = await response.text();
        let anchors = div.getElementsByTagName('a');
        let cardContainer = document.querySelector('.cardContainer');
        cardContainer.innerHTML = '';
        for (let e of anchors) {
            if (e.href.includes('songs') && !e.href.includes('.htaccess')) {
                let folder = e.href.split('/').slice(-2)[0];
                cardContainer.innerHTML += `<div data-folder="${folder}" class='card'>${folder}</div>`;
            }
        }
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', async function () {
                await getsongs(this.dataset.folder);
            });
        });
    } catch (error) {
        console.error(error);
        alert('Unable to fetch albums. Please try again later.');
    }
}

async function main() {
    await displayAlbums();
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




































































