
const SNACKBAR = document.getElementById('snackbar');
const HEADER_CONTENT = document.getElementsByClassName('jumbotron header-content')[0];
const VIDEO_ELEMENT = document.getElementById('video-source');
const STATUS_ELEMENT = document.getElementById('status');
const VIDEO_AREA = document.getElementsByClassName('video-area jumbotron')[0];
const RECIEVING_VIDEO_TEXT = document.getElementById('recieving-video');
// Global variables;
var video;
var STOP_BUTTON;
var MAIN_BUTTON;
var peer;

const sleep = (ms=2000) => {
    return new Promise(r => {
        setTimeout(r, ms);
    })
}

const requestfullScreen = () => {
    // console.log(VIDEO_ELEMENT.requestFullscreen)
    VIDEO_ELEMENT.setAttribute('full-screen', true);
    if (VIDEO_ELEMENT.requestFullscreen) {
        VIDEO_ELEMENT.requestFullscreen();
    } else if (VIDEO_ELEMENT.webkitRequestFullscreen) {
        VIDEO_ELEMENT.webkitRequestFullscreen();
    } else if (VIDEO_ELEMENT.msRequestFullScreen) {
        VIDEO_ELEMENT.msRequestFullScreen();
    }
}

const exitFullScreen = () => {
    VIDEO_ELEMENT.removeAttribute('full-screen');
    if (VIDEO_ELEMENT.exitFullScreen) {
        VIDEO_ELEMENT.exitFullScreen();
    } else if (VIDEO_ELEMENT.webkitExitFullscreen) {
        VIDEO_ELEMENT.webkitExitFullscreen();
    } else if (VIDEO_ELEMENT.msExitFullscreen) {
        ms.exitFullScreen();
    }
}

// const isInitiator = () => {
//     return new Promise((resolve, reject) => {
//         if (peer.initiator) {
//             resolve(true)
//         }
//         resolve(false)
//     })
// }

// const toggleSharing = async (ev) => {
//     ev.preventDefault();
//     console.log(MAIN_BUTTON)
    // try {
    //     let video = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});
    //     peer.addStream(video);
    // } catch (error) {
    //     SNACKBAR.textContent = "Something went wrong! Please try again.";
    //     SNACKBAR.className = "show";
    //     setTimeout(() => { SNACKBAR.className = SNACKBAR.className.replace("show", "")}, 3000);
    // }
// }

const startSharing = async (ev) => {
    ev.preventDefault();
    try {
        video = await navigator.mediaDevices.getDisplayMedia({audio: true, video: true});
        peer.send('start-stream');
        peer.addStream(video);
        STOP_BUTTON.removeAttribute('hidden');
        MAIN_BUTTON.setAttribute('hidden', true);
        STATUS_ELEMENT.textContent = 'Stream is now being shared.'
    } catch (error) {
        SNACKBAR.textContent = "Something went wrong! Please try again.";
        SNACKBAR.className = "show";
        setTimeout(() => { SNACKBAR.className = SNACKBAR.className.replace("show", "")}, 3000);
        console.log(error)
    }

}
const stopSharing = (ev) => {
    peer.send('stop-stream');
    ev.preventDefault();
    video.getTracks().forEach(track => track.stop());
    STOP_BUTTON.setAttribute('hidden', true);
    MAIN_BUTTON.removeAttribute('hidden');
    STATUS_ELEMENT.textContent = 'Stream sharing is now stopped.'
}

socket = io();
peer = new SimplePeer({initiator: localStorage.getItem('user-name') === 'Saba',
trickle: false})

peer.on('error', err => console.log('Error', err))

peer.on('signal', (data) => {
    console.log(`Signal: ${JSON.stringify(data)}`)
    socket.emit('signal', JSON.stringify(data))
})
socket.on('signal', (data) => {
    peer.signal(JSON.parse(data))
})
peer.on('connect', () => {
    if (peer.initiator) {
        MAIN_BUTTON.removeAttribute('disabled');
        STATUS_ELEMENT.textContent = 'Connected to the recieving peer.';
        setTimeout(() => STATUS_ELEMENT.textContent = "No stream is being shared.", 3000)
    } else {
        STATUS_ELEMENT.textContent = 'Connected to the initiator.';
        setTimeout(() => STATUS_ELEMENT.textContent = "No incoming stream.", 3000)
    }
    console.log('Peer connected.')
})
peer.on('data', (data) => {
    data.toString() === 'stop-stream' ? STATUS_ELEMENT.textContent = 'Stream Stopped.' : STATUS_ELEMENT.textContent = 'Stream Started.'
})
peer.on('stream', async (stream) => {
    await sleep(2000); // Why wait? // Why not wait? ~ AB
    // VIDEO_ELEMENT.parentElement.removeAttribute('hidden');
    RECIEVING_VIDEO_TEXT.removeAttribute('hidden');
    VIDEO_ELEMENT.srcObject = stream
    VIDEO_ELEMENT.play();
    try {
        requestfullScreen();
    } catch (err) {
        console.log(err);
        console.log('Couldn\'t open full screen.');
    }
})

// isInitiator().then(async isInitiator => {
//     if (isInitiator) {
//         SNACKBAR.textContent = 'You are the Initiator.'
//         SNACKBAR.className = "show"
//         await sleep(25);
//     }
// })
if (peer.initiator) {
    // STATUS_ELEMENT.textContent = 'No stream is being shared.'
    VIDEO_AREA.setAttribute('hidden', true);
    // STATUS_ELEMENT.setAttribute('hidden', true);
    SNACKBAR.textContent = "You are the Initiator.";
    SNACKBAR.className = "show";
    setTimeout(() => { SNACKBAR.className = SNACKBAR.className.replace("show", "")}, 3000);
    MAIN_BUTTON = document.createElement('button');
    MAIN_BUTTON.textContent = 'Start Sharing'
    MAIN_BUTTON.classList = 'btn btn-primary';
    MAIN_BUTTON.style.cursor = 'pointer'
    MAIN_BUTTON.setAttribute('disabled', true);
    HEADER_CONTENT.appendChild(MAIN_BUTTON);
    // MAIN_BUTTON.addEventListener('click', toggleSharing)
    MAIN_BUTTON.addEventListener('click', startSharing)
    STOP_BUTTON = document.createElement('button');
    STOP_BUTTON.textContent = 'Stop Sharing';
    STOP_BUTTON.setAttribute('hidden', true);
    STOP_BUTTON.classList = 'btn btn-danger';
    STOP_BUTTON.style.cursor = 'pointer'
    HEADER_CONTENT.appendChild(STOP_BUTTON);
    STOP_BUTTON.addEventListener('click', stopSharing)
    // MAIN_BUTTON.addEventListener('click', (ev) => {
    //     ev.preventDefault();
    //     startSharing();
    //     MAIN_BUTTON.textContent = 'Stop Sharing'
    //     MAIN_BUTTON.classList = 'btn btn-danger'
    //     MAIN_BUTTON.removeEventListener('click', startSharing);
    //     MAIN_BUTTON.addEventListener('click', (ev) => {
    //         ev.preventDefault();
    //         stopSharing();
    //         MAIN_BUTTON.textContent = 'Start Sharing'
    //         MAIN_BUTTON.classList = 'btn btn-primary';
    //     })
    // })

} else {
    SNACKBAR.textContent = "You are a recieving peer."
    SNACKBAR.className = "show"
    setTimeout(() => { SNACKBAR.className = SNACKBAR.className.replace("show", "")}, 3000);
    document.body.addEventListener('keyup', (ev) => {
        if (ev.key === 'f') {
            VIDEO_ELEMENT.getAttribute('full-screen') === true ? exitFullScreen() : requestfullScreen();
        }
    })
}