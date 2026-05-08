const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let order = []; // 入室順

// 勝敗判定
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

    // 2人制限
    if (order.length >= 2) {
        socket.emit("full");
        return;
    }

    order.push(socket.id);

    players[socket.id] = {
        choice: null,
        index: order.length // P1 or P2固定
    };

    // 接続時情報
    socket.emit("init", {
        index: players[socket.id].index
    });

    io.emit("players", players);

    // じゃんけん選択
    socket.on("choice", (value) => {

        if (!players[socket.id]) return;

        players[socket.id].choice = value;

        if (order.length < 2) return;

        const p1 = order[0];
        const p2 = order[1];

        if (!players[p1] || !players[p2]) return;
        if (players[p1].choice === null || players[p2].choice === null) return;

        const result = judge(players[p1].choice, players[p2].choice);

        io.emit("result", {
            p1: players[p1].choice,
            p2: players[p2].choice,
            result
        });

        // リセット
        players[p1].choice = null;
        players[p2].choice = null;
    });

    socket.on("disconnect", () => {

        order = order.filter(id => id !== socket.id);

        delete players[socket.id];

        io.emit("players", players);
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on port " + PORT);
});