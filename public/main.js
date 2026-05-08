const socket = io();

function select(v) {
    socket.emit("choice", v);
    document.getElementById("status").innerText = "選択中...";
}

socket.on("result", (data) => {

    const hand = ["グー", "チョキ", "パー"];

    let text = `
あなた: ${hand[data.p1]}
相手: ${hand[data.p2]}
`;

    if (data.result === "draw") text += "引き分け";
    if (data.result === "p1") text += "プレイヤー1の勝ち";
    if (data.result === "p2") text += "プレイヤー2の勝ち";

    document.getElementById("status").innerText = text;
});