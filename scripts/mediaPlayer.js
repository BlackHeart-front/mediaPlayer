/*======================================================
    MEDIA PLAYER: ELEMENTOS DA UI
======================================================*/
const
    playlistBanner = document.querySelector('#playlist-banner'),
    playlistName = document.querySelector('#playlist-name'),
    playlistDetails = document.querySelector('#playlist-details'),
    playlistContainer = document.querySelector('#playlist-container'),
    trackPlayingNow = document.querySelector('#track-playingNow'),
    trackArtist = document.querySelector('#track-artist'),
    trackCurrentTime = document.querySelector('#track-currentTime'),
    trackSeekerSlider = document.querySelector('#track-seekerSlider'),
    trackDuration = document.querySelector('#track-duration'),
    btnPrev = document.querySelector('#btn-prev'),
    btnPlay = document.querySelector('#btn-play-pause'),
    btnNext = document.querySelector('#btn-next');

// BTN: Status default
btnPrev.setAttribute('disabled', 'disabled');
btnPlay.setAttribute('disabled', 'disabled');
btnNext.setAttribute('disabled', 'disabled');

/*======================================================
    MEDIA PLAYER: GLOBAIS
======================================================*/
let playlistData = null, //only dev
    actualTrack = null,
    isPlaying = false;

//Elemento de áudio para o Player de música
let mediaPlayer = document.createElement('audio');

/*======================================================
    MEDIA PLAYER: PEGAR DADOS E POPULAR FRONT
    TODO: call in click event
======================================================*/
//DATA: Pega os dados da playlist à executar
(async function getPlaylistData(url) {
    let response = await fetch(url);

    if (response.status === 200) {
        let json = await response.json();

        playlistData = json; //only dev
        actualTrack = 0;

        loadPlaylistData(json);
        loadFirstTrack(json);
        changeStateBtn(btnPlay, 'enabled');
        checkNext();
    } else {
        console.log(`HTTP-Error: ${response.status}`);
    }
})('http://localhost:5500/playlist/playlist.json');

//DATA: Carregar dados da playlist no front
function loadPlaylistData(data) {
    let trackList = document.createElement('DL');

    trackList.setAttribute('id', 'trackList');
    playlistContainer.appendChild(trackList);

    (function() {
        playlistName.innerText = data[0].name;
        playlistBanner.style.backgroundImage = `url(${data[0].cover})`;
        playlistDetails.innerText = `${data[0].tracks.length} músicas`;

        for (let i = 0; i < data[0].tracks.length; i++) {
            if (trackList.childElementCount === 0) {
                trackList
                    .insertAdjacentHTML('beforeend', `<dt>${i + 1}</dt><dd><p>${data[0].tracks[0].trackName}</p><p>${data[0].tracks[0].trackArtist}</p></dd>`);
            } else {
                trackList
                    .insertAdjacentHTML('beforeend', `<dt>${i + 1}</dt><dd><p>${data[0].tracks[i].trackName}</p><p>${data[0].tracks[i].trackArtist}</p></dd>`);
            }
        }
    })();
}

// DATA: Carregar informações da faixa em execução
let playingNow = function() {
    trackPlayingNow.innerText = playlistData[0].tracks[actualTrack].trackName;
    trackArtist.innerText = playlistData[0].tracks[actualTrack].trackArtist;

    if (isPlaying) {
        setTimeout(() => {
            trackDuration.innerText = mediaPlayer.duration;
            trackCurrentTime.innerText = mediaPlayer.currentTime;
        }, 100);
    } else {
        trackDuration.innerText = '00:00';
        trackCurrentTime.innerText = '00:00';
    }
}

/*======================================================
    MEDIA PLAYER: CARREGAR FAIXA
======================================================*/
function loadFirstTrack(data) {
    if (actualTrack === 0 && !isPlaying) {
        mediaPlayer.src = data[0].tracks[0].path;
    } else {
        console.log(`Erro ao carregar a primeira faixa!`);
    }
}

/*======================================================
    MEDIA PLAYER: AÇÕES
======================================================*/
//Ação: play_pause(
let play_pause = function() {
    if (mediaPlayer.src && mediaPlayer.readyState === 4 && !isPlaying && btnPlay.getAttribute('disabled') === null) {
        mediaPlayer.play();
        isPlaying = true;
        this.setAttribute('class', 'btn-pause');
        this.firstChild.innerText = 'pause';
        playingNow();
    } else if (isPlaying) {
        mediaPlayer.pause();
        isPlaying = false;
        this.setAttribute('class', 'btn-play')
        this.firstChild.innerText = 'play';
    }
}
btnPlay.addEventListener('click', play_pause);


//Ação: nextTrack()
let nextTrack = function() {
    ++actualTrack;

    checkNext();
    checkPrevious();

    if (actualTrack < playlistData[0].tracks.length) {
        mediaPlayer.src = playlistData[0].tracks[actualTrack].path;
        playingNow();

    } else {
        console.log(`fim da playlist ${playlistData[0].name}`);
    }

    if (isPlaying) {
        mediaPlayer.play();
    }
}
btnNext.addEventListener('click', nextTrack);

//Ação: previousTrack()
let previousTrack = function() {
    --actualTrack;

    checkNext();
    checkPrevious();

    if (actualTrack <= playlistData[0].tracks.length) {
        mediaPlayer.src = playlistData[0].tracks[actualTrack].path;
        playingNow();
    } else {
        console.log(`fim da playlist ${playlistData[0].name}`);
    }

    if (isPlaying) {
        mediaPlayer.play();
    }
}
btnPrev.addEventListener('click', previousTrack);


//Ação: goTo(time in sec)
function goTo(time) {
    mediaPlayer.currentTime = time;
}

/*======================================================
    MEDIA PLAYER: VERIFICAÇÕES
======================================================*/
let changeStateBtn = function(btn, state) {
    switch (state) {
        case 'enabled':
            btn.removeAttribute('disabled');
            break;
        case 'disabled':
            btn.setAttribute('disabled', 'disabled');
            break;
        default:
            console.log('Error!');
            break;
    }
}

let checkNext = function() {
    if (actualTrack < (playlistData[0].tracks.length - 1)) {
        changeStateBtn(btnNext, 'enabled');
    } else {
        changeStateBtn(btnNext, 'disabled');
    }
}

let checkPrevious = function() {
    if (actualTrack != 0) {
        changeStateBtn(btnPrev, 'enabled');
    } else {
        changeStateBtn(btnPrev, 'disabled');
    }
}