console.log("Hi, I have been injected whoopie!!!")

var recorder = null
function onAccessApproved(stream){
    recorder = new MediaRecorder(stream);

    recorder.start();

    recorder.onstop = function(){
        stream.getTracks().forEach(function(track){
            if(track.readyState === "live"){
                track.stop()
            }
        })
    }

    recorder.ondataavailable = function(event){
        let recordedBlob  = event.data;
        let url = URL.createObjectURL(recordedBlob);

        console.log(url);

        let a = document.createElement("a");

        a.style.display = "none";
        a.href = url;

        let title = String(url).split("/")
        let title2 = title[title.length - 1]
        let name0 = title2.split("-")
        let name = name0[name0.length - 1]

        a.download=`untitled_video_${name}.webm`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }
}


chrome.runtime.onMessage.addListener( (message, sender, sendResponse)=>{

    if(message.action === "request_recording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            video: {
                displaySurface: message.screenType,
                mediaSource: "screen"
            },
            audio: message.audio
        }).then((stream)=>{
            onAccessApproved(stream)
        })  
    }

    if(message.action === "stopvideo"){
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if(!recorder) return console.log("no recorder")

        recorder.stop();


    }

})

