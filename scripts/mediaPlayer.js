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

/*======================================================
    MEDIA PLAYER: CARREGAR FAIXA
======================================================*/
function loadFirstTrack(data) {
    if (actualTrack === 0 && !isPlaying) {
        mediaPlayer.src = data[0].tracks[0].path;
        console.log('Primeira faixa carregada!');
    } else {
        console.log(`Erro ao carregar a primeira faixa!`);
    }
}

/*======================================================
    MEDIA PLAYER: AÇÕES
======================================================*/
//Ação: play()
btnPlay.addEventListener('click', play_pause);

function play_pause() {
    if (mediaPlayer.src && mediaPlayer.readyState === 4 && !isPlaying && btnPlay.getAttribute('disabled') === null) {
        mediaPlayer.play();
        isPlaying = true;
        this.setAttribute('class', 'btn-pause');
        this.firstChild.innerText = 'pause';
    } else if (isPlaying) {
        mediaPlayer.pause();
        isPlaying = false;
        this.setAttribute('class', 'btn-play')
        this.firstChild.innerText = 'play';
    }
    checkNext();
    checkPrevious();
}

//Ação: nextTrack()

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
    if (actualTrack === playlistData[0].tracks.length) {
        changeStateBtn(btnNext, 'disabled');
    } else {
        changeStateBtn(btnNext, 'enabled');
    }
}

let checkPrevious = function() {
    if (actualTrack != 0) {
        changeStateBtn(btnPrev, 'enabled');
    } else {
        changeStateBtn(btnPrev, 'disabled');
    }
}