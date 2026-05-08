const socket = io();

let myIndex = null;

const hand = ["グー", "チョキ", "パー"];

function select(v) {
    socket.emit("choice", v);
    document.getElementById("status").innerText = "選択中...";
}

// プレイヤー割り当て
socket.on("init", (data) => {

    myIndex = data.index;

    document.getElementById("status").innerText =
        "あなたはプレイヤー " + myIndex;
});

// 満員
socket.on("full", () => {
    document.getElementById("status").innerText = "満員です";
});

// 勝敗
socket.on("result", (data) => {

    let text = `
P1: ${hand[data.p1]}
P2: ${hand[data.p2]}
`;

    if (data.result === "draw") text += "\n引き分け";
    if (data.result === "p1") text += "\nP1の勝ち";
    if (data.result === "p2") text += "\nP2の勝ち";

    document.getElementById("status").innerText = text;
});