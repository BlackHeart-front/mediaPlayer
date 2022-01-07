//Elemento de áudio para o Player de música
let audioElement = document.createElement('audio');

//Faixa de áudio ou playlist à executar
//let playlist = '/playlist/bensound-acousticbreeze.mp3';
async function getPlaylist(url) {
    let response = await fetch(url);
    return response;
}


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