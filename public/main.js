enchant();

window.onload = function () {

    const game = new Core(640, 480);
    const socket = io();

    let players = {};
    let bullets = [];

    let name = prompt("名前入れて");

    socket.emit("join", name);

    const myPlayer = new Sprite(32, 32);
    myPlayer.backgroundColor = "red";
    myPlayer.x = 100;
    myPlayer.y = 100;

    game.rootScene.addChild(myPlayer);

    // 他プレイヤー描画
    function drawPlayers() {
        game.rootScene.childNodes = [myPlayer];
        Object.keys(players).forEach(id => {
            const p = players[id];
            const sp = new Sprite(32, 32);
            sp.backgroundColor = "blue";
            sp.x = p.x;
            sp.y = p.y;
            game.rootScene.addChild(sp);
        });
    }

    game.rootScene.on("enterframe", () => {

        if (game.input.left) myPlayer.x -= 4;
        if (game.input.right) myPlayer.x += 4;
        if (game.input.up) myPlayer.y -= 4;
        if (game.input.down) myPlayer.y += 4;

        socket.emit("move", {
            x: myPlayer.x,
            y: myPlayer.y
        });

        drawPlayers();
    });

    // 弾撃ち
    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            socket.emit("shoot");
        }
    });

    socket.on("players", (data) => {
        players = data;
    });

    socket.on("shot", (data) => {
        let b = new Sprite(10, 10);
        b.backgroundColor = "yellow";
        b.x = 200;
        b.y = 200;
        game.rootScene.addChild(b);
        bullets.push(b);
    });

    game.start();
};