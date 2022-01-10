console.clear();

/*======================================================
    MEDIA PLAYER: ELEMENTOS DA UI
======================================================*/
const
    playlistBanner = document.querySelector('#playlist-banner'),
    playlistName = document.querySelector('#playlist-name'),
    playlistDetails = document.querySelector('#playlist-details'),
    playlistContainer = document.querySelector('#playlist-container'),
    mediaPlayerControlsContainer = document.querySelector('#mediaPlayer-controls'),
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
    isPlaying = false,

    //Elemento de áudio para o Player de música
    mediaPlayer = document.createElement('AUDIO');

/*======================================================
    MEDIA PLAYER: PEGAR DADOS E POPULAR FRONT
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
let loadPlaylistData = data => {
    let trackList = document.createElement('UL');

    trackList.setAttribute('id', 'trackList');
    playlistContainer.appendChild(trackList);

    (function() {
        playlistName.innerText = data[0].name;
        playlistBanner.style.backgroundImage = `url(${data[0].cover})`;
        playlistDetails.innerHTML = `<i class="fas fa-music margin-right-sm"></i> ${data[0].tracks.length} músicas`;

        for (let i = 0; i < data[0].tracks.length; i++) {
            if (trackList.childElementCount === 0) {
                trackList
                    .insertAdjacentHTML('beforeend', `<li data-track="${0}" onclick="playThisTrack(this);"><p>${i + 1}</p><div><p>${data[0].tracks[0].trackName}</p><p>${data[0].tracks[0].trackArtist}</p></div></li>`);
            } else {
                trackList
                    .insertAdjacentHTML('beforeend', `<li data-track="${i}" onclick="playThisTrack(this);"><p>${i + 1}</p><div><p>${data[0].tracks[i].trackName}</p><p>${data[0].tracks[i].trackArtist}</p></div></li>`);
            }
        }
        if (trackList.childElementCount === data[0].tracks.length) {
            playingNow();
        }
    })();
}

// DATA: Carregar informações da faixa em execução
let playingNow = () => {
    let updateTime = null,
        updateSeeker = null;

    trackPlayingNow.innerText = playlistData[0].tracks[actualTrack].trackName;
    trackArtist.innerText = playlistData[0].tracks[actualTrack].trackArtist;

    let timeData = () => {
        let trackDurationMinutes = Math.floor(mediaPlayer.duration / 60),
            trackDurationSeconds = Math.floor(mediaPlayer.duration - trackDurationMinutes * 60),
            trackCurrentMinutes = Math.floor(mediaPlayer.currentTime / 60),
            trackCurrentSeconds = Math.floor(mediaPlayer.currentTime - trackCurrentMinutes * 60);

        if (trackDurationMinutes < 10) { trackDurationMinutes = `0${trackDurationMinutes}` }
        if (trackDurationSeconds < 10) { trackDurationSeconds = `0${trackDurationSeconds}` }
        if (trackCurrentMinutes < 10) { trackCurrentMinutes = `0${trackCurrentMinutes}` }
        if (trackCurrentSeconds < 10) { trackCurrentSeconds = `0${trackCurrentSeconds}` }

        trackDuration.innerText = `${trackDurationMinutes}:${trackDurationSeconds}`;
        trackCurrentTime.innerText = `${trackCurrentMinutes}:${trackCurrentSeconds}`;
    }

    let seekSliderMove = () => {
        trackSeekerSlider.max = mediaPlayer.duration;
        trackSeekerSlider.stepUp(1);
    }

    // mostrar informações de tempo da faixa carregada
    if (isPlaying) {
        updateTime = setInterval(() => { timeData(); }, 100);
        updateSeeker = setInterval(() => { seekSliderMove() }, 1000);

        mediaPlayer.addEventListener('ended', () => {
            clearInterval(updateTime);
            clearInterval(updateSeeker);
            seekerSliderReset();

            isPlaying = false;
            btnPlay.classList.remove('icon-pause');
            btnPlay.classList.add('icon-play')
            btnPlay.firstChild.innerText = 'play';
            mediaPlayerControlsContainer.classList.remove('animate-hue');
            playlistName.classList.remove('animate-hue');
            playlistBanner.classList.remove('animate-hue');

        });
    } else {
        trackDuration.innerText = '00:00';
        trackCurrentTime.innerText = '00:00';
    }

    // stop => updateTime
    btnPlay.addEventListener('click', () => {
        clearInterval(updateTime);
        clearInterval(updateSeeker);
    });
    btnPrev.addEventListener('click', () => {
        clearInterval(updateTime);
        clearInterval(updateSeeker);
    });
    btnNext.addEventListener('click', () => {
        clearInterval(updateTime);
        clearInterval(updateSeeker);
    });
}

/*======================================================
    MEDIA PLAYER: CARREGAR FAIXA
======================================================*/
let loadFirstTrack = data => {
    if (actualTrack === 0 && !isPlaying) {
        mediaPlayer.src = data[0].tracks[0].path;
    } else {
        console.log(`Erro ao carregar a primeira faixa!`);
    }
}

/*======================================================
    MEDIA PLAYER: SEEK SLIDER
======================================================*/
//Ação: busca interativa na faixa
let seekSlider = () => {
    let seekValue = trackSeekerSlider.value;

    if (mediaPlayer.src && mediaPlayer.readyState === 4) {
        seekValue = mediaPlayer.duration * (seekValue / 100);
        mediaPlayer.currentTime = seekValue;
    }
}
trackSeekerSlider.addEventListener('change', seekSlider);

/*======================================================
    MEDIA PLAYER: AÇÕES
======================================================*/
//Ação: executar ou pausar faixa
let play_pause = () => {
    if (mediaPlayer.src && !isPlaying && btnPlay.getAttribute('disabled') === null) {
        mediaPlayer.play();
        isPlaying = true;
        btnPlay.classList.remove('icon-play');
        btnPlay.classList.add('icon-pause');
        btnPlay.firstChild.innerText = 'pause';
        mediaPlayerControlsContainer.classList.add('animate-hue');
        playlistName.classList.add('animate-hue');
        playlistBanner.classList.add('animate-hue');
        playingNow();
    } else if (isPlaying) {
        mediaPlayer.pause();
        isPlaying = false;
        btnPlay.classList.remove('icon-pause');
        btnPlay.classList.add('icon-play')
        btnPlay.firstChild.innerText = 'play';
        mediaPlayerControlsContainer.classList.remove('animate-hue');
        playlistName.classList.remove('animate-hue');
        playlistBanner.classList.remove('animate-hue');
    }
}
btnPlay.addEventListener('click', play_pause);


//Ação: avançar faixa
let nextTrack = () => {
    ++actualTrack;

    checkNext();
    checkPrevious();
    seekerSliderReset();

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

//Ação: retroceder faixa
let previousTrack = () => {
    --actualTrack;

    checkNext();
    checkPrevious();
    seekerSliderReset();

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

//Ação: clicar na faixa
let playThisTrack = (target) => {
    let trackId = target.getAttribute('data-track');

    actualTrack = trackId;
    isPlaying = false;

    checkNext();
    checkPrevious();
    seekerSliderReset();

    if (actualTrack < playlistData[0].tracks.length) {
        mediaPlayer.src = playlistData[0].tracks[actualTrack].path;
        playingNow();
    } else {
        console.log(`fim da playlist ${playlistData[0].name}`);
    }

    btnPlay.click();

    window.location.href = '#controls';
}

/*======================================================
    MEDIA PLAYER: VERIFICAÇÕES
======================================================*/
let changeStateBtn = (btn, state) => {
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

let checkNext = () => {
    if (actualTrack < (playlistData[0].tracks.length - 1)) {
        changeStateBtn(btnNext, 'enabled');
    } else {
        changeStateBtn(btnNext, 'disabled');
    }
}

let checkPrevious = () => {
    if (actualTrack != 0) {
        changeStateBtn(btnPrev, 'enabled');
    } else {
        changeStateBtn(btnPrev, 'disabled');
    }
}

/*======================================================
    MEDIA PLAYER: RESET
======================================================*/
let seekerSliderReset = () => {
    trackSeekerSlider.value = 0;
    trackSeekerSlider.max = 0;
}