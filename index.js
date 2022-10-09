const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const https = require("https");
const fs = require("fs");

console.log(process.platform);
// Settings for secure https server
const options = {
    key: fs.readFileSync("./cert/cert.key"),
    cert: fs.readFileSync("./cert/cert.crt"),
};
const httpsServer = https.createServer(options, app);
const httpsServerIO = new Server(httpsServer);

const io = new Server(http);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/static/"));

io.on("connection", (socket) => {
    socket.on("signal", (data) => {
        socket.broadcast.emit("signal", data);
    });
});
httpsServerIO.on("connection", (socket) => {
    socket.on("signal", (data) => {
        socket.broadcast.emit("signal", data);
    });
});

app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
    console.log(`Server is live on http://localhost:3000`);
});

// httpsServer.listen(443, () => {
//     // `Secure HTTPS Sever is live on https://localhost:3000/`
//     console.log(`Secure HTTPS Server is live on https://localhost:3000/`);
// })
