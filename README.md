# screen-share-pro
Share your display or recieve and stream another friend's (peer) display entirely in the browser. As easy as 1, 2, 3 ✨.

Screen Share Pro (a name that i coined in less than 10 seconds) is a screen sharing mini tool that leverages the features provided
by <a href="https://webrtc.org/">WebRTC</a> to create a <a href="https://en.wikipedia.org/wiki/Peer-to-peer">P2P (peer-to-peer)</a>
connection between (in the meantime, only) two browsers. It uses a nodejs server bundled with <a href="https://socket.io/">socket.io</a>
to act as a signaling server, and once the connection is estabilished and the two peers are connected, server goes on standby and you
(or the other one) can start sharing their screen.

Note: Either one of the peers must be an Initiator. An Initiator is a peer that has the priviliages to start a sceeen share,
while the other peer, not being the Initiator, can only stream the video. You can become the Initiator by storing a key-value pair in
your browser's local storage. That pair must have a key called 'initiator', and the value set to "true" (a string.). While the document loads,
JS will read your page's local storage and, upon identifying the initiator, will provide with differnet pages for the Initiator and the
recieving peer. For confirmation, you will also see a <i>snackbar</i> in the bottom left corner telling whether you are the Initiator
or the recieving peer. If both of the peer are recieving peers or both are the Initiators, a connection won't be estabilished and stream
sharing won't be possible.

FAQs:
  Q: What's with the certificate files in the cert directory?
    A: Sometime in the development stage, the page that was not having a valid SSL cert, was not allowing the browser to send system audio,
      so I put together a dummy localhost cert, and it worked fine. But later, after I had tested the page in a secure context, the browser
      was then allowing the audio over an unsecure context. I dunno whether it was me or the browser, but that happend.
      So the purpose of the certs in the cert directory is to enable you to send audio over https if http doesn't allow you. No extra config
      is necessary, node will actually start two servers, an http one, and another one with https. If the app doesn't work properly in http,
      use https.
  Q: Why does this app have such a large CSS bundle?
    A: At this point, this app uses three CSS bundles. A bootstrap lib, main style sheet, and a big CSS file called all.cs. This all.css is
    the font-awesome emojis file and since this web app uses some of those emojis, it has to load that file too. Removing it will, of course, 
    not cause any issues and will result in a smaller CSS bundle size.
