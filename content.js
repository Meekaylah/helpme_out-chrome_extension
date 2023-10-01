console.log("Hi, I have been injected whoopie!!!")

var recorder = null;
var recordedChunks = [];

function onAccessApproved(stream) {
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    }

    recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
            if (track.readyState === "live") {
                track.stop();
            }
        });

        // Generate the filename based on the last 12 characters in the Blob URL
        var url = URL.createObjectURL(recordedChunks[0]);
        var lastCharacters = url.substr(-12); // Get the last 12 characters of the URL
        var customFileName = `untitled_video_${lastCharacters}.mp4`;
        console.log(customFileName);

        // Create a Blob with the recorded chunks
        var blob = new Blob(recordedChunks, { type: 'video/mp4' });

        // Create a File object with a custom filename
        var file = new File([blob], customFileName, { type: 'video/mp4' });

        // Create a FormData object and append the File
        var formData = new FormData();
        formData.append('video', file);

        // Send the FormData to the server
        sendVideoToServer(formData);

        recordedChunks = []; // Reset recordedChunks
    }

    recorder.start();
}

function sendVideoToServer(formData) {
    fetch('https://chrome-extension-backend-w4r6.onrender.com/extension/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Video sent to the server successfully.');
            console.log(response.ok);
        } else {
            console.error('Error sending video to the server.');
            console.log(response.ok);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


chrome.runtime.onMessage.addListener( (message, sender, sendResponse)=>{

    if(message.action === "request_recording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            preferCurrentTab: message.screenType,
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

