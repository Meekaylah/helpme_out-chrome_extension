document.addEventListener("DOMContentLoaded", () => {
  //GET SELECTORS OF THE BUTTONS
  const startVideoButton = document.querySelector("#start_video");
  const stopVideoButton = document.querySelector("#stop_video");
  const audioElement = document.querySelector("input#audio");
  const fullScreenSelect = document.querySelector(".full-screen");
  const currentTabSelect = document.querySelector(".current-tab");
  const closePopup = document.querySelector("#close");
  let screen = "browser";
  let hasAudio = true;
  
  // Add Event Listeners
  
  startVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {action: "request_recording", audio:hasAudio, screenType:screen}, function(response){
        if(!chrome.runtime.lastError){
          console.log(response);
        } else{
          console.log(chrome.runtime.lastError, "Error line 15");
        }
      })
    })
  })

  stopVideoButton.addEventListener("click", ()=>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "stopvideo"},  function(response){
            if(!chrome.runtime.lastError){
                console.log(response)
            } else{
                console.log(chrome.runtime.lastError, 'error line 27')
            }
        })
    } )
})

  closePopup.addEventListener("click", () => {
    window.close()
  })

  audioElement.addEventListener("click", () => {
    hasAudio = audioElement.checked
    console.log(hasAudio);
  })

  fullScreenSelect.addEventListener("click", () => {
    fullScreenSelect.style.opacity = 1
    currentTabSelect.style.opacity = 0.5
    screen = "window"
  })

  currentTabSelect.addEventListener("click", () => {
    currentTabSelect.style.opacity = 1
    fullScreenSelect.style.opacity = 0.5
    screen = "browser"
  })

})