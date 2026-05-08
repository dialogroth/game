const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};
let bullets = [];

io.on("connection", (socket) => {

    socket.on("join", (name) => {
        players[socket.id] = {
            name,
            x: 100,
            y: 100,
            hp: 5
        };

        io.emit("players", players);
    });

    socket.on("move", (data) => {
        if (!players[socket.id]) return;

        players[socket.id].x = data.x;
        players[socket.id].y = data.y;

        io.emit("players", players);
    });

    socket.on("shoot", () => {
        if (!players[socket.id]) return;

        bullets.push({
            id: socket.id,
            x: players[socket.id].x,
            y: players[socket.id].y,
            vx: 0,
            vy: -5
        });
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("players", players);
    });
});

// ゲームループ（サーバー側で処理）
setInterval(() => {

    // 弾移動
    bullets.forEach(b => {
        b.y += b.vy;
    });

    // 当たり判定
    bullets.forEach((b, i) => {
        Object.keys(players).forEach(id => {

            if (id === b.id) return;

            const p = players[id];

            if (!p) return;

            const dx = p.x - b.x;
            const dy = p.y - b.y;

            if (Math.sqrt(dx * dx + dy * dy) < 20) {
                p.hp -= 1;
                bullets.splice(i, 1);

                if (p.hp <= 0) {
                    delete players[id];
                }

                io.emit("players", players);
            }
        });
    });

    io.emit("bullets", bullets);

}, 100);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
    console.log("Server running");
});