let currentSong = new Audio()
play = document.getElementById("play");
previous = document.getElementById("previous")
next = document.getElementById("next")
let songs
let currFolder;

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



async function getsongs(folder){
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let responce = await a.text();
    let div = document.createElement('div');
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")} </div>
                                <div>dinesh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="images/playsong.svg" alt="">
                            </div></li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e =>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

   return songs
}

const playMusic =(track, pause='false') =>{
    currentSong.src = `http://127.0.0.1:3000/${currFolder}/` +track
    if(!pause){
        currentSong.play()
        play.src = 'images/pause.svg'
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    
}

async function displayAlbums(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let responce = await a.text();
    let div = document.createElement('div');
    div.innerHTML = responce;
    let anchor = div.getElementsByTagName("a")
    let array =Array.from(anchor)
    
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let responce = await a.json();
            let cardcontainer = document.querySelector(".cardcontainer")
            console.log(responce)
            cardcontainer.innerHTML = cardcontainer.innerHTML + 
            `       <div data-folder="${folder}" class="card">
                        <div class="play">
                            <button class="play"><img src="images/play.svg" alt=""></button>
                        </div>
                        <img src="http://127.0.0.1:3000/songs/${folder}/cover.jpg" class="card-img-top"
                            alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${responce.title}</h5>
                            <p class="card-text">${responce.description}</p>
                        </div>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", async items=>{
            songs = await getsongs(`songs/${items.currentTarget.getAttribute('data-folder')}`)
            playMusic(songs[0],false)
        })
    });
}

async function main(){


    await getsongs("songs/cs")
    playMusic(songs[0], true)

    displayAlbums()
    
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = 'images/pause.svg'
        }
        else{
            currentSong.pause()
            play.src = 'images/playsong.svg'
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