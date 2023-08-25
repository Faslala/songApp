const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const cover = document.getElementById('cover');
const play = document.getElementById('play');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const currentProgress = document.getElementById('current-progress');
const progressContatiner = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');
const likeButton = document.getElementById('like');

const asYouWere = {
    songName : 'As You Were',
    artist : 'TrackTribe',
    file: 'as_you_were',
    liked: false,
};
const boomBapFlick = {
    songName : 'Boom Bap Flick',
    artist : 'Quincas Moreira',
    file: 'boom_bap_flick',
    liked: false,
};
const cantHide = {
    songName : 'Can\'t Hide',
    artist : 'Otis Mcdonald',
    file: 'cant_hide',
    liked: false,
};

let isPlaying = false;
let isShuffle = false;
let isRepeatOn = false;
let isLiked = false;
const playlist = [asYouWere, boomBapFlick, cantHide];

let sortedPlaylist = [...playlist];
let index = 0;

function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle');
    play.querySelector('.bi').classList.add('bi-pause-circle');
    song.play();
    play.classList.add('button-active')
    songName.classList.add('button-active')
    bandName.classList.add('button-active')
    songTime.classList.add('button-active')
    totalTime.classList.add('button-active')
    isPlaying = true;
}

function pauseSong(){
    play.querySelector('.bi').classList.add('bi-play-circle');
    play.querySelector('.bi').classList.remove('bi-pause-circle');
    song.pause();
    play.classList.remove('button-active')
    isPlaying = false;
}

function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }
    else {
        playSong();
    }
}

function likeButtonRender(){
    if (sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-star');
        likeButton.querySelector('.bi').classList.add('bi-star-fill');
        likeButton.classList.add('button-active');
    } else {
        likeButton.querySelector('.bi').classList.add('bi-star');
        likeButton.querySelector('.bi').classList.remove('bi-star-fill');
        likeButton.classList.remove('button-active');
    }

}

function initializeSong(){
    cover.src = `images/${sortedPlaylist[index].file}.webp`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }
    else {
        index -= 1;
    }
    initializeSong();
    playSong();
    previous.classList.add('button-active');
    setTimeout(() => {
        previous.classList.remove('button-active');
    }, 1000);
}

function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }
    else {
        index += 1;
    }
    initializeSong();
    playSong();
    next.classList.add('button-active');
    setTimeout(() => {
        next.classList.remove('button-active');
    }, 1000);
}

function updateProgress() {
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);   
}

function jumpto(event) {
    const width = progressContatiner.clientWidth;
    const clicoPosition = event.offsetX;
    const jumpToTime = (clicoPosition/width)*song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex =  size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
    return preShuffleArray;
}

function shuffleButtonClicked() {
    if (isShuffle === false) {
        isShuffle = true; 
        sortedPlaylist = shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    } else {
        isShuffle = false; 
        sortedPlaylist = shuffleArray(playlist);
        shuffleButton.classList.remove('button-active');
    }
}

function repeatButtonClicked() {
    if (isRepeatOn === false) {
        isRepeatOn = true;
        repeatButton.classList.add('button-active')
    } else {
        isRepeatOn = false;
        repeatButton.classList.remove('button-active')
    }
}

function nextOrRepeat() {
    if (isRepeatOn === false) {
        nextSong()
    } else {
        playSong()
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let sec = Math.floor(originalNumber - hours * 3600 - min * 60);

    // return `${hours.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`

}

function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);
}

function likeButtonClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;
    } else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();   
    JSON.stringify(localStorage('playlist', playlist));
}

initializeSong();

play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgress);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContatiner.addEventListener('click', jumpto);
shuffleButton.addEventListener('click', shuffleButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);

