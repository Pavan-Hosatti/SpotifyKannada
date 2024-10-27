async function getsongs(folder) {
    try {
        currfolder = folder;
        console.log(`Fetching songs from folder: /Spotify/songs/${currfolder}`);
        let response = await fetch(`/Spotify/songs/${currfolder}/`);
        console.log('Response:', response);
        if (!response.ok) throw new Error('Failed to fetch songs');
        let div = document.createElement('div');
        div.innerHTML = await response.text();
        console.log('Inner HTML:', div.innerHTML);
        let as = div.getElementsByTagName('a');
        songs = [];
        for (let element of as) {
            if (element.href.endsWith('.mp3')) {
                console.log('Element:', element.href);
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
                console.log('Folder:', folder);
                cardContainer.innerHTML += `<div data-folder="${folder}" class="card">${folder}</div>`;
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





































































