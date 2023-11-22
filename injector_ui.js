var lastFrame = null;

async function processFrame(video,btn) {
  btn.innerHTML = "Processing...";
  //video.currentTime = 0;
  lastFrame = null;
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let ctx = canvas.getContext("2d");
  function draw(){
    ctx.drawImage(video, 0, 0);
    let imageData = ctx.getImageData(200, 200, 10, 10);
    if (lastFrame == null) {
      lastFrame = imageData;
    }
    //compare image
    let diff = 0;
    for (let i = 0; i < imageData.data.length; i+=10) {
      diff += Math.abs(imageData.data[i] - lastFrame.data[i]);
    }
    if(diff > 1000){
      console.log("found!!!");
      btn.innerHTML = "Found";
      video.currentTime = video.currentTime - 0.000;
      video.pause();
      return;
    }
    requestAnimationFrame(draw);
  }
  video.play();
  draw();
}
async function process() {
  let allVideoDom = document.getElementsByTagName("video");
  if (allVideoDom.length == 0) {
    return;
  }
  if(allVideoDom.length > 1){
    for (let i = 0; i < allVideoDom.length; i++) {
      let parentDoc = allVideoDom[i].parentNode;
      //check if exist button
      let button = parentDoc.getElementsByTagName("button");
      if(button.length > 0){
        continue;
      }
      //create button
      button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-primary";
      button.innerHTML = "Process";
      button.style = "position:absolute;top:5px;left:5px;";
      parentDoc.appendChild(button);
      //add event
      button.addEventListener("click", function () {
        //seek to start
        //allVideoDom[i].currentTime = 0;
        processFrame(allVideoDom[i], button);
      });
    }
  }else if(allVideoDom.length == 1){
    let parentDoc = allVideoDom[0].parentNode.parentNode;
    //check if exist button
    let button = parentDoc.getElementsByTagName("button");
    //check if one of these button html is "Process" or "Found" or "Processing..." 
    let found = false;
    for (let i = 0; i < button.length; i++) {
      if(button[i].innerHTML == "Process" || button[i].innerHTML == "Found" || button[i].innerHTML == "Processing..."){
        found = true;
        break;
      }
    }
    if(found){
      return;
    }
    //create button
    button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary";
    button.innerHTML = "Process";
    button.style = "position:absolute;top:5px;left:5px;";
    parentDoc.appendChild(button);
    //add event
    button.addEventListener("click", function () {
      //seek to start
      //allVideoDom[0].currentTime = 0;
      processFrame(allVideoDom[0], button);
    });
  }
}

document.addEventListener('keydown', async function(event) {
    if (event.code == "ArrowDown" || event.code == "ArrowUp" || event.code == "Enter" || event.code == "NumpadEnter") {
        // ctrl + enter
        await process();
    }
    if(event.code == "Escape"){
      let video = document.getElementsByTagName("video");
      for (let i = 0; i < video.length; i++) {
        video[i].pause();
        video[i].controls = true;
        //remove other nodes except video
        let parentDoc = video[i].parentNode;
        let childNodes = parentDoc.childNodes;
        for (let j = 0; j < childNodes.length; j++) {
          if(childNodes[j].nodeName != "VIDEO"){
            parentDoc.removeChild(childNodes[j]);
          }
        }
      }
    }
});

console.log("injector_ui.js loaded");
process();