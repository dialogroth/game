const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let choices = {};

function judge(a, b) {
    if (a === b) return "draw";
    if (
        (a === 0 && b === 1) ||
        (a === 1 && b === 2) ||
        (a === 2 && b === 0)
    ) {
        return "p1";
    }
    return "p2";
}

io.on("connection", (socket) => {

    players[socket.id] = true;

    socket.on("choice", (value) => {

        choices[socket.id] = value;

        const ids = Object.keys(choices);

        if (ids.length === 2) {

            const p1 = ids[0];
            const p2 = ids[1];

            const result = judge(choices[p1], choices[p2]);

            io.emit("result", {
                p1: choices[p1],
                p2: choices[p2],
                result
            });

            choices = {};
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        delete choices[socket.id];
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running");
});