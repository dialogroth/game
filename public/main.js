enchant();

window.onload = function () {

    const game = new Core(640, 480);

    game.fps = 30;

    game.onload = function () {

        const socket = io();

        const players = {};

        const myPlayer = new Sprite(32, 32);

        myPlayer.backgroundColor = "red";

        myPlayer.x = 100;
        myPlayer.y = 100;

        game.rootScene.addChild(myPlayer);

        game.rootScene.on("enterframe", () => {

            if (game.input.left) {
                myPlayer.x -= 4;
            }

            if (game.input.right) {
                myPlayer.x += 4;
            }

            if (game.input.up) {
                myPlayer.y -= 4;
            }

            if (game.input.down) {
                myPlayer.y += 4;
            }

            socket.emit("move", {
                x: myPlayer.x,
                y: myPlayer.y
            });
        });
    };

    game.start();
};