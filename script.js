console.log("javascript")
let currentsong = new Audio();
let songs;
async function getsongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    // let lis = div.getElementsByTagName("li")
    // console.log(lis)
    let as = div.getElementsByTagName("a")
        // console.log(as)
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href)
            songs.push(element.href.split("/songs/")[1])

        }
    }
    // console.log(songs)
    return songs

}

// let all_songs = getsongs()
// console.log(all_songs)

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track + ".mp3")
    currentsong.src = "/songs/" + track;
    if (!pause) {
        currentsong.play()
        document.getElementById("play").src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
        // document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function main() {

    //get the list of all songs
    songs = await getsongs()

    playMusic(songs[0], true)

    // console.log(songs)
    //show all the songs in the playlist
    let songUL = document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
                            <img src="music.svg" alt="" class="invert">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                            
                            </div>
                            <div class="playnow">
                                <span>play now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div>
                        </li>`
    }

    //attach an event listner to to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    });

    //attach an event listner to play next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            document.getElementById("play").src = "pause.svg"
        } else {
            currentsong.pause()
            document.getElementById("play").src = "play.svg"
        }
    })

    //converting seconds to minute:seconds format
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00"
        }
        // Ensure the input is an integer
        seconds = Math.floor(seconds);

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    //listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(formatTime(currentsong.currentTime), formatTime(currentsong.duration))
        document.querySelector(".songtime").innerHTML = formatTime(currentsong.currentTime) + "/" + formatTime(currentsong.duration)
        document.querySelector(".seekbar_circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".seekbar_circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })


    // // play the first song
    // var audio = new Audio(songs[0]);
    // // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     // let duration = audio.duration;
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime)
    // });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //adding event listeners to previous and next buttons
    previous.addEventListener("click", () => {
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        if ((index - 1) >= 0) {

            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(songs, index)
        console.log(songs.length)
        if ((index + 1) < (songs.length)) {
            playMusic(songs[index + 1])
        }
    })


}
main()