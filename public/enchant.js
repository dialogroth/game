function enchant() {
}

class Core {

    constructor(width, height) {

        this.width = width;
        this.height = height;

        this.rootScene = {
            addChild: function(sprite) {
                document.body.appendChild(sprite.element);
            },

            on: function(event, callback) {

                if (event === "enterframe") {

                    setInterval(callback, 1000 / 30);
                }
            }
        };

        this.input = {};

        window.addEventListener("keydown", (e) => {

            if (e.key === "ArrowLeft") this.input.left = true;
            if (e.key === "ArrowRight") this.input.right = true;
            if (e.key === "ArrowUp") this.input.up = true;
            if (e.key === "ArrowDown") this.input.down = true;
        });

        window.addEventListener("keyup", (e) => {

            if (e.key === "ArrowLeft") this.input.left = false;
            if (e.key === "ArrowRight") this.input.right = false;
            if (e.key === "ArrowUp") this.input.up = false;
            if (e.key === "ArrowDown") this.input.down = false;
        });
    }

    start() {

        if (this.onload) {

            this.onload();
        }
    }
}

class Sprite {

    constructor(width, height) {

        this.element = document.createElement("div");

        this.element.style.position = "absolute";
        this.element.style.width = width + "px";
        this.element.style.height = height + "px";
    }

    set x(value) {

        this.element.style.left = value + "px";
    }

    get x() {

        return parseInt(this.element.style.left) || 0;
    }

    set y(value) {

        this.element.style.top = value + "px";
    }

    get y() {

        return parseInt(this.element.style.top) || 0;
    }

    set backgroundColor(value) {

        this.element.style.backgroundColor = value;
    }
}