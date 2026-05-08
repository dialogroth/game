let players = {};
let order = [];

function judge(a, b) {
    if (a === b) return "draw";

    if (
        (a === 0 && b === 1) ||
        (a === 1 && b === 2) ||
        (a === 2 && b === 0)
    ) return "p1";

    return "p2";
}

io.on("connection", (socket) => {

    if (order.length >= 2) {
        socket.emit("full");
        return;
    }

    socket.on("join", (name) => {

        order.push(socket.id);

        players[socket.id] = {
            name: name || "名無し",
            choice: null,
            index: order.length
        };

        socket.emit("init", {
            index: players[socket.id].index
        });

        io.emit("players", players);
    });

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
            p1: players[p1],
            p2: players[p2],
            result
        });

        players[p1].choice = null;
        players[p2].choice = null;
    });

    socket.on("disconnect", () => {

        order = order.filter(id => id !== socket.id);

        delete players[socket.id];

        io.emit("players", players);
    });
});