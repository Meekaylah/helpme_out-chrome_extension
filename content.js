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
        var customFileName = `untitled_video_${lastCharacters}.webm`;

        // Create a Blob with the recorded chunks
        var blob = new Blob(recordedChunks, { type: 'video/webm' });

        // Create a File object with a custom filename
        var file = new File([blob], customFileName, { type: 'video/webm' });

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
        } else {
            console.error('Error sending video to the server.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Rest of your code for handling messages



// console.log("Hi, I have been injected whoopie!!!")

// var recorder = null;
// var recordedChunks = [];

// function onAccessApproved(stream) {
//     recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = function (event) {
//         if (event.data.size > 0) {
//             recordedChunks.push(event.data);
//         }
//     }

//     recorder.onstop = function () {
//         stream.getTracks().forEach(function (track) {
//             if (track.readyState === "live") {
//                 track.stop();
//             }
//         });

//         // Generate the filename based on the last 12 characters in the Blob URL
//         var url = URL.createObjectURL(recordedChunks[0]);
//         var lastCharacters = url.substr(-12); // Get the last 12 characters of the URL
//         var customFileName = `untitled_video_${lastCharacters}.webm`;
//         console.log(customFileName);

//         // Create a Blob with the recorded chunks and set the filename
//         var blob = new Blob(recordedChunks, { type: 'video/webm' });
//         blob.name = customFileName;

//         // Create a FormData object and append the Blob
//         var formData = new FormData();
//         formData.append('video', blob);

//         // Send the FormData to the server
//         sendVideoToServer(formData);

//         recordedChunks = []; // Reset recordedChunks
//     }

//     recorder.start();
// }

// function sendVideoToServer(formData) {
//     fetch('https://chrome-extension-backend-w4r6.onrender.com/extension/', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (response.ok) {
//             console.log('Video sent to the server successfully.');
//         } else {
//             console.error('Error sending video to the server.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// Rest of your code for handling messages




// console.log("Hi, I have been injected whoopie!!!")

// var recorder = null;
// var recordedChunks = [];

// function onAccessApproved(stream) {
//     recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = function (event) {
//         if (event.data.size > 0) {
//             recordedChunks.push(event.data);
//         }
//     }

//     recorder.onstop = function () {
//         stream.getTracks().forEach(function (track) {
//             if (track.readyState === "live") {
//                 track.stop();
//             }
//         });

//         // Send the recorded video to the server
//         sendVideoToServer(new Blob(recordedChunks, { type: 'video/webm' }));
//         recordedChunks = []; // Reset recordedChunks
//     }

//     recorder.start();
// }

// function sendVideoToServer(blob) {
//     var formData = new FormData();
//     formData.append('video', blob);

//     fetch('https://chrome-extension-backend-w4r6.onrender.com/extension/', {
//         method: 'POST',
//         body: formData
//     })
//     .then(response => {
//         if (response.ok) {
//             console.log('Video sent to the server successfully.');
//         } else {
//             console.error('Error sending video to the server.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }



// console.log("Hi, I have been injected whoopie!!!")

// var recorder = null
// function onAccessApproved(stream){
//     recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = function(event){
//         let recordedBlob  = event.data;
//         let url = URL.createObjectURL(recordedBlob);

//         console.log(url);

//         let a = document.createElement("a");

//         a.style.display = "none";
//         a.href = url;

//         let title = String(url).split("/")
//         let title2 = title[title.length - 1]
//         let name0 = title2.split("-")
//         let name = name0[name0.length - 1]

//         a.download=`untitled_video_${name}.webm`;

//         document.body.appendChild(a);
//         a.click();

//         document.body.removeChild(a);

//         URL.revokeObjectURL(url);
//     }
//     recorder.onstop = function(){
//         stream.getTracks().forEach(function(track){
//             if(track.readyState === "live"){
//                 track.stop()
//             }
//         })
//     }

//     recorder.start();
// }


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

