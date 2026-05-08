const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

    socket.on("join", (name) => {
        players[socket.id] = {
            name: name,
            x: 100,
            y: 100,
            hp: 3
        };

        io.emit("players", players);
    });

    socket.on("move", (data) => {
        if (!players[socket.id]) return;

        players[socket.id].x = data.x;
        players[socket.id].y = data.y;

        socket.broadcast.emit("playerMoved", {
            id: socket.id,
            x: data.x,
            y: data.y
        });
    });

    socket.on("shoot", () => {
        socket.broadcast.emit("shot", {
            id: socket.id
        });
    });

    socket.on("hit", (targetId) => {
        if (players[targetId]) {
            players[targetId].hp -= 1;
        }
        io.emit("players", players);
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("players", players);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running");
});