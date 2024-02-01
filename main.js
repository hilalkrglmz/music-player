const shuffleBtn = document.getElementById("shuffle");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const nextBtn = document.getElementById("next");
const repeatBtn = document.getElementById("repeat");
const closeBtn = document.getElementById("close-btn");
const openBtn = document.getElementById("play-list");
const songImg = document.getElementById("song-image")
const songName = document.getElementById("song-name")
const audio = document.getElementById("audio")
const artistName = document.getElementById("song-artist")
const progressBar = document.getElementById("progress-bar")
const currentBar = document.getElementById("current-progress")
const maxDuration = document.getElementById("max-duration")
const currentTimeRef = document.getElementById("current-time")
const playListContainer = document.getElementById("playlist-container")
const playListSongs = document.getElementById("playlist-songs")

/* index */
let index;

/* tekrar etme durumu */
let loop;

/* decode or parse yani kod çözme veya ayrıştırma */

const songsList = [
    {
        name: "Aya Benzer",
        link: "assets/ayabenzer.mp3",
        artist: "Mustafa Sandal",
        image: "assets/mustafa-sandal.jpg"
    },
    {
        name: "Yürek Yangini",
        link: "assets/yurekyangini.mp3",
        artist: "Baha",
        image: "assets/baha.jpg"
    },
    {
        name: "Yıllarım Gitti",
        link: "assets/yillarimgitti.mp3",
        artist: "Ferhat Göçer",
        image: "assets/ferhat-gocer.jpg"
    },
    {
        name: "Sevda Yanığı",
        link: "assets/sevdayng.mp3",
        artist: "Funda Arar",
        image: "assets/funda-arar.jpg"
    },
    {
        name: "Yak Gel",
        link: "assets/yakgel.mp3",
        artist: "Funda Arar",
        image: "assets/funda-arar.jpg"
    },
    {
        name: "Gir Kanıma",
        link: "assets/girkanima.mp3",
        artist: "Harun Kolçak",
        image: "assets/harun.jpg"
    },
    {
        name: "Yıllar Sonra",
        link: "assets/yillarsonra.mp3",
        artist: "Kıraç",
        image: "assets/kirac.jpg"
    },
    {
        name: "Sevemedim Karagözlüm",
        link: "assets/sevemedim.mp3",
        artist: "Muazzez Ersoy",
        image: "assets/ersoy.jpg"
    },
]

/* olaylar */
let events = {
    mouse: {
        click:"click"
    },
    touch: {
        click:"touchstart"
    }
}

let deviceType = ''

const isTouchDevice = () => {
    try {
        document.createEvent('TouchEvent')
        deviceType="touch"
        return true
    } catch (error) {
        deviceType="mouse"
        return false
    }
}

/* progress bar altındaki zaman kısımları düzeni */

const timeFormatter = (timeInput) => {

    let minute = Math.floor(timeInput/60)
    minute = minute <10 ? "0" + minute : minute
    let second = Math.floor(timeInput%60)
    second= second <10 ? "0" + second : second

    return `${minute}:${second} `
}

/* Şarkı atama */

const setSong = (arrayIndex) => {

    //console.log(arrayIndex)
    let {name, link, artist, image} = songsList[arrayIndex]

    audio.src = link;
    songName.innerHTML = name;
    artistName.innerHTML = artist;
    songImg.src = image;


    audio.onloadedmetadata = () => {
        maxDuration.innerText = timeFormatter(audio.duration)
    }

    playListContainer.classList.add('hide')
    playAudio()
}

const playAudio = () => {
    audio.play();
    pauseBtn.classList.remove('hide')
    playBtn.classList.add('hide')
}

/* şarkıyı tekrar etme */

repeatBtn.addEventListener('click', () => {
    if(repeatBtn.classList.contains('active')){
        repeatBtn.classList.remove('active')
        audio.loop= false;
    }else{
        repeatBtn.classList.add('active')
        audio.loop=true
    }
})

/* next song */
const nextSong = () => {
    if(loop){
        if(index == (songsList.length -1)){
            index=0;
        }else{
            index+1;
        }
    }else{
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }
    playAudio()
}

/* şarkıyı durdur */
const pauseAudio = () => {
    audio.pause()
    pauseBtn.classList.add('hide')
    playBtn.classList.remove('hide')
}

/* bir önceki şarkıya geçmek */

const prevSong = () => {

    if(index>0){
        pauseAudio()
        index-1;
    }else{
        index = songsList.length -1
    }
    setSong(index)
    playAudio()
}

/* şarkı bittiğinde kendiliğinden sonraki şarkıya geçmesi için */

audio.onended = () => {
    nextSong()
} 

/* karışık şarkı */

shuffleBtn.addEventListener('click', () => {
    if(shuffleBtn.classList.contains('active')){
        shuffleBtn.classList.remove('active')
        loop= true;
        console.log("karışık kapalı")
    }else{
        shuffleBtn.classList.add('active')
        loop= false;

    }
})

/* play tuşuna basılınca şarkı başlaması için */

playBtn.addEventListener('click', playAudio)
/* pause tuşuna basılınca durması için */

pauseBtn.addEventListener('click', pauseAudio)
/* next tuşuna basılınca sıradaki şarkı başlaması için */

nextBtn.addEventListener('click', nextSong)
/* prev tuşuna basılınca önceki şarkı başlaması için */

prevBtn.addEventListener('click', prevSong)

isTouchDevice()
progressBar.addEventListener(events[deviceType].click, (event)=> {


    let coordStart = progressBar.getBoundingClientRect().left

    let coordEnd = !isTouchDevice() ? event.clientX : event.touch[0].clientX
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth
    currentBar.style.width=progress * 100 + "%"

    //zaman


    audio.currentTime = progress * audio.duration
    audio.play()
    pauseBtn.classList.remove("hide")
    playBtn.classList.add("hide")
})
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentBar.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

//zaman guncellenmesi
audio.addEventListener('timeupdate', () => {
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})


window.onload = () => {

    index=0;
    setSong(index)
    initPlayList()
} 
const initPlayList = () => {
    for(let i in songsList){
        playListSongs.innerHTML+=`<li class="playListSong" onclick=setSong(${i})>
        <div class="playlist-image-container">
        <img  src=${songsList[i].image}>
        </div>
        <div class="playlist-song-details">
        <span id="playlist-song-name">${songsList[i].name}</span>
        <span id="playlist-song-artist">${songsList[i].artist}</span>
        </div>
        </li>`
    }
}

openBtn.addEventListener("click", () => {
    playListContainer.classList.remove('hide')
})

closeBtn.addEventListener("click", () =>{
    playListContainer.classList.add('hide')

})