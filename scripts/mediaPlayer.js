/*======================================================
    MEDIA PLAYER: ELEMENTOS DA UI
======================================================*/
const
    playlistBanner = document.getElementById('playlist-banner'),
    playlistName = document.getElementById('playlist-name'),
    playlistDetails = document.getElementById('playlist-details'),
    playlistContainer = document.getElementById('playlist-container'),
    trackPlayingNow = document.getElementById('track-playingNow'),
    trackArtist = document.getElementById('track-artist'),
    trackCurrentTime = document.getElementById('track-currentTime'),
    trackSeekerSlider = document.getElementById('track-seekerSlider'),
    trackDuration = document.getElementById('track-duration'),
    btnPrev = document.getElementById('btn-prev'),
    btnPlay = document.getElementById('btn-play'),
    btnNext = document.getElementById('btn-next');

/*======================================================
    MEDIA PLAYER: GLOBAIS
======================================================*/
let playlist = null,
    actualTrack = 0,
    isPlaying = false;

//Elemento de áudio para o Player de música
let audioElement = document.createElement('audio');

/*======================================================
    MEDIA PLAYER: DATA
    TODO: call in click event
======================================================*/
//DATA: Pega os dados da playlist à executar
(async function getPlaylistData(url) {
    let response = await fetch(url);

    if (response.status === 200) {
        let json = await response.json();
        playlist = json;
        loadPlaylistData(json);
    } else {
        console.log(`HTTP-Error: ${response.status}`);
    }
})('http://localhost:5500/playlist/playlist.json');

//DATA: Carregar dados da playlist no front
function loadPlaylistData(data) {
    let trackList = document.createElement('UL'),
        trackListItem = document.createElement('LI');

    trackList.setAttribute('id', 'trackList');

    playlistContainer.appendChild(trackList);


    let populateTracks = function(item) {
        playlistName.innerText = item.name;
        playlistBanner.style.backgroundImage = `url("/playlist/${item.name}/cover/${item.cover}")`;
        // console.log(item);
        // console.log(item.tracks);

        for (let i = 0; i < item.tracks.length; i++) {
            console.log(i + item.tracks[i].trackName)
            if (trackList.childElementCount === 0) {
                trackList.appendChild(trackListItem);
            } else {
                let trackListElement = document.getElementById('trackList');
                console.log(trackListElement);
                // TODO: adicionar li dentro da ul com nome das faixas
            }
        }

    }

    data.forEach(populateTracks);
}

/*======================================================
    MEDIA PLAYER: AÇÕES
======================================================*/
//Ação: play()
function play() {
    if (audioElement.src && audioElement.readyState === 4) {
        audioElement.play();
    } else {
        audioElement.src = playlist;
        audioElement.play();
    }
}

//Ação: pause()
function pause() {
    if (audioElement.play) {
        audioElement.pause();
    }
}

//Ação: stop()
function stop() {
    if (audioElement.play) {
        pause();
        goTo(0);
    } else if (audioElement.paused) {
        goTo(0);
    }
}

//Ação: goTo(time in sec)
function goTo(time) {
    audioElement.currentTime = time;
}