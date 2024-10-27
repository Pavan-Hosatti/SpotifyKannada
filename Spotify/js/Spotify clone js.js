async function displayAlbums() {
    try {
        let response = await fetch('/Spotify/songs/');
        if (!response.ok) throw new Error('Failed to fetch albums');
        let div = document.createElement('div');
        div.innerHTML = await response.text();
        let anchors = div.getElementsByTagName('a');
        let cardContainer = document.querySelector('.cardContainer');
        cardContainer.innerHTML = '';
        for (let e of anchors) {
            if (e.href.includes('songs') && !e.href.includes('.htaccess')) {
                let song = e.href.split('/').slice(-1)[0];
                cardContainer.innerHTML += `<div data-song="${song}" class="card">${song}</div>`;
            }
        }
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', async function () {
                playmusic(this.dataset.song);
            });
        });
    } catch (error) {
        console.error(error);
        alert('Unable to fetch albums. Please try again later.');
    }
}

async function getsongs() {
    try {
        let response = await fetch('/Spotify/songs/');
        if (!response.ok) throw new Error('Failed to fetch songs');
        let div = document.createElement('div');
        div.innerHTML = await response.text();
        let as = div.getElementsByTagName('a');
        songs = [];
        for (let element of as) {
            if (element.href.endsWith('.mp3')) {
                songs.push(element.href.split('/Spotify/songs/')[1]);
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

main();


































































