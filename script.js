let currentSong = new Audio()
play = document.getElementById("play");
previous = document.getElementById("previous")
next = document.getElementById("next")
let songs

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs(){
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let responce = await a.text();
    let div = document.createElement('div');
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
   
}

const playMusic =(track, pause='false') =>{
    currentSong.src = "http://127.0.0.1:3000/songs/" +track
    if(!pause){
        currentSong.play()
        play.src = 'pause.svg'
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){


    songs = await getsongs()
    playMusic(songs[0], true)
    console.log(songs)
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")} </div>
                                <div>dinesh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="playsong.svg" alt="">
                            </div></li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = 'pause.svg'
        }
        else{
            currentSong.pause()
            play.src = 'playsong.svg'
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seakbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0;
        document.querySelector(".body").style.backdropFilter = "blur(5px)";
    })
    document.querySelector(".cross").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = -120 + "%"
    })
    previous.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index-1) >= 0){
            playMusic(songs[index -1], false)
        }
    })
    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) < songs.length){
            playMusic(songs[index +1],false)
        }
    })

}





main()