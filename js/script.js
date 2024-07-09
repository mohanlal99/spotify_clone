// console.log("start Write to Java Script");

let songlist;
let csong = new Audio();
let song;
let currfolder;
// this is a async getSong() function and this is fetch songs folder find song
async function getSong(folder) {
  currfolder = folder
  let fetchsong = await fetch(`http://127.0.0.1:3000/${folder}/`); //found song in this folder
  let respons = await fetchsong.text(); //this wati found after
  let div = document.createElement("div");
  div.innerHTML = respons;
  let as = div.getElementsByTagName("a");
  song = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href.split(`/${folder}/`)[1]);
    }
  }


  let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUl.innerHTML = ""
  playMusic(song[0], true);
  // song found in folder after set li in div and body
  for (const s of song) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                  <img class="invert musicimg" src="image/music.svg" alt="" />
                  <div class="info">
                      <div>${decodeURI(s)}</div>
                      <div>Artist Mohanlal</div>
                  </div>
                  <div class="palynow">
                       <img class="invert musicimg" src="image/play-round-icon.svg" alt="" />
        </div></li>`;
  }

  // song name Array from after song playMusic function calling and pass
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });


  return song;
  

}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track)
  csong.src = `/${currfolder}/` + track;
  if (!pause) {
    csong.play();
    play.src = "image/pause.svg";
  }
  // dicoderi function remover all other content ex %20
  document.querySelector(".songinfo").innerHTML = decodeURI(`${track}`);
};


async function displayalbum(){
  let fetchsong = await fetch(`http://127.0.0.1:3000/songs/`); //found song in this folder
  let respons = await fetchsong.text(); //this wati found after
  let div = document.createElement("div");
  div.innerHTML = respons;
  let anchor = div.getElementsByTagName("a")
  
  let array = Array.from(anchor)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
  
    if(e.href.includes("/songs")){
      let folder = e.href.split("/").slice(-2)[0];
      console.log(folder);
      
      // fetch folder 
      let fetchsong = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`); //found song in this folder
      let respons = await fetchsong.json();
      console.log(respons);
      let cardContainer = document.querySelector(".cardContainer")
      
      
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder=${folder} class="card">
      <div class="imglogo">
          <img src="/songs/${folder}/cover.jpg"
              alt="" />
          <div class="logo flex jcenter a-center">
              <img src="image/play.svg" alt="" />
          </div>
      </div>
      <h1>${respons.title}</h1>
      <p>${respons.discription}</p>
  </div>`
    
    }
  };
  
  
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async (item)=>{
      song = await getSong(`songs/${item.currentTarget.dataset.folder}`)
      console.log(song);
      
    })
    
  })

}





async function main() {
  await getSong("songs/tophindi");
  
// display album in spotify playlist
  displayalbum();



  // play button event
  play.addEventListener("click", () => {
    if (csong.paused) {
      csong.play();
      play.src = "image/pause.svg";
    } else {
      csong.pause();
      play.src = "image/play-round-icon.svg";
    }
  });

 

  // song time play after running
  csong.addEventListener("timeupdate", () => {
    if(isNaN(csong.duration)){
      document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    }else{
      updateTimeDisplay();

    }
    let bar = (csong.currentTime / csong.duration) * 100;
    document.querySelector(".circle").style.width = bar + "%";
  });

  // music linebar
  document.querySelector(".linebar").addEventListener("click", (e) => {
    const clickX = e.offsetX;
    const totalWidth = (clickX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.width = totalWidth + "%";
    let clickedTime = (csong.duration * totalWidth) / 100;
    csong.currentTime = clickedTime;
  });

// song volume set
  volinput.addEventListener("change",(e)=>{
    csong.volume = e.target.value / 100
    document.querySelector(".mute").src = "image/voice.svg"
    
  })

  // volume mute umute 
  document.querySelector(".mute").addEventListener("click",()=>{
    if(csong.volume > 0){
      csong.volume = 0
      volinput.value = 0
      document.querySelector(".mute").src = "image/mute.svg"
    }else{
      csong.volume = .5
      volinput.value = 10
      document.querySelector(".mute").src = "image/voice.svg"
    }
  })




  // hamburguricon
  document.querySelector(".hamburgericon").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-1%";
    document.querySelector(".left").style.height = "100%";
    document.querySelector(".left").style.margin = "0";
    document.querySelector(".left").style.display = "block";
  });

  // hamburgur close icon event
  document.querySelector(".cicon").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".left").style.display = "none";
  });

     // song pre button
     pre.addEventListener("click", () => {
      let index = song.indexOf(csong.src.split("/").slice(-1)[0]);
      if (index > 0) {
        playMusic(song[index - 1]);
      }
    });
  
    // song next button
    next.addEventListener("click", () => {
      let index = song.indexOf(csong.src.split("/").slice(-1)[0]);
      if ((index +1) < song.length) {
        console.log(length);
        playMusic(song[index+1]);
  
      }
    
        
    });

  // song time function
  function updateTimeDisplay() {
    var currentMinutes = Math.floor(csong.currentTime / 60);
    var currentSeconds = Math.floor(csong.currentTime % 60);
    var durationMinutes = Math.floor(csong.duration / 60);
    var durationSeconds = Math.floor(csong.duration % 60);

    // Format the time to ensure two digits
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
    durationMinutes = (durationMinutes < 10 ? "0" : "") + durationMinutes;
    durationSeconds = (durationSeconds < 10 ? "0" : "") + durationSeconds;

    // Update the display
    document.querySelector(
      ".songtime"
    ).textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
  }

}

// document.querySelector(".playbar").style.background = `${getRamdom()}`


// function getRamdom(){
//   let a = Math.floor(Math.random()*255)
//   let b = Math.floor(Math.random()*255)
//   let c = Math.floor(Math.random()*255)
//   let d = Math.floor(Math.random()*100)/100
 
//   return `rgba(${a}, ${b}, ${c}, ${d})`
// }



main();
