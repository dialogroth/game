enchant();

window.onload = function () {

    const game = new Core(640, 480);
    const socket = io();

    let players = {};
    let bullets = {};

    let name = prompt("名前");

    socket.emit("join", name);

    const myPlayer = new Sprite(32, 32);
    myPlayer.backgroundColor = "red";
    myPlayer.x = 100;
    myPlayer.y = 100;

    game.rootScene.addChild(myPlayer);

    game.rootScene.on("enterframe", () => {

        if (game.input.left) myPlayer.x -= 4;
        if (game.input.right) myPlayer.x += 4;
        if (game.input.up) myPlayer.y -= 4;
        if (game.input.down) myPlayer.y += 4;

        socket.emit("move", {
            x: myPlayer.x,
            y: myPlayer.y
        });
    });

    window.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            socket.emit("shoot");
        }
    });

    socket.on("players", (data) => {
        players = data;
        drawPlayers();
    });

    socket.on("bullets", (data) => {
        bullets = data;
        drawBullets();
    });

    function drawPlayers() {

        game.rootScene.childNodes = [myPlayer];

        Object.values(players).forEach(p => {

            const sp = new Sprite(32, 32);
            sp.backgroundColor = "blue";
            sp.x = p.x;
            sp.y = p.y;

            game.rootScene.addChild(sp);
        });
    }

    function drawBullets() {

        Object.values(bullets).forEach(b => {

            const sp = new Sprite(10, 10);
            sp.backgroundColor = "yellow";
            sp.x = b.x;
            sp.y = b.y;

            game.rootScene.addChild(sp);
        });
    }

    game.start();
};