const socket = io('/');

const myPeer = new Peer(undefined, {
    host: '/',
    port: '81'
});

const peers= {};

const videoContainer = document.getElementById('video-grid');
const myVideo = document.getElementById('my-video');
myVideo.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{

    myVideo.srcObject = stream;
    
    myPeer.on('call', call => {
        // console.log('Incoming call from: ' + call.peer);
        call.answer(stream);
        const videoElement = document.createElement('video');
        videoElement.setAttribute('controls', '');
        call.on('stream', userVideoStream => {
            addVideoStream(videoElement, userVideoStream);
        });
        call.on('close', () =>{
            videoElement.remove();
        });
    });
    
    socket.on('user-connected', userId => {
        // console.log('User connected: ' + userId);
        connectToNewUser(userId, stream);
    });
    
}).catch(error => {
    console.error("Error Accessing Camera", error);
});

socket.on('user-disconnected', userId => {
    // console.log('User disconnected: ' + userId);
    if(peers[userId]) peers[userId].close();
});

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});


// socket.on('user-connected', userId =>{
//     console.log("User Connected: " + userId);
// });

function connectToNewUser(userId, stream){
    const call = myPeer.call(userId, stream);
    const videoElement = document.createElement('video');
    videoElement.setAttribute('controls', '');
    call.on('stream', userVideoStream => {
      addVideoStream(videoElement, userVideoStream);
    });
    call.on('close', () =>{
        videoElement.remove();
    });

    peers[userId] = call;

}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoContainer.appendChild(video);
  }