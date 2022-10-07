# screen-share-pro
Share your display or recieve and stream another friend's (peer) display entirely in the browser. As easy as 1, 2, 3 ✨.

Screen Share Pro (a name that i coined in less than 10 seconds) is a screen sharing mini tool that leverages the features provided
by WebRTC to create a P2P (peer-to-peer) connection between (in the meantime, only) two browsers. It uses a nodejs server bundled with
socket.io to act as a signaling server, and once the connection is estabilished and the two peer are connected, server goes on standby
and you (or the other one) can start sharing their screen.

Note: Either one of the peers must be an Initiator, an Initiator is a peer that has the priviliages to start a sceeen share,
while the other peer, not being the Initiator, can only stream the video. You can become the Initiator by storing a key-value pair in
your browser's local storage. That pair must have a key called 'initiator', and the value set to true. While the document loads,
JS will read your page's local storage and, upon identifying the initiator, will provide with differnet pages for the Initiator and the
recieving peer. For confirmation, you will also see a <i>snackbar</i> in the bottom left corner telling whether you are the Initiator
or the recieving peer. If both of the peer are recieving peers or both are the Initiators, a connection won't be estabilished and stream
sharing won't be possible.
