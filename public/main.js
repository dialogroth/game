const socket = io();

const hand = ["グー", "チョキ", "パー"];

let myIndex = null;
let myName = prompt("名前を入力してね");

socket.emit("join", myName);

function select(v) {
    socket.emit("choice", v);
    document.getElementById("status").innerText = "選択中...";
}

socket.on("init", (data) => {
    myIndex = data.index;

    document.getElementById("status").innerText =
        myName + "（P" + myIndex + "）で参加中";
});

socket.on("full", () => {
    document.getElementById("status").innerText = "満員です";
});

socket.on("result", (data) => {

    let text = `
${data.p1.name} : ${hand[data.p1.choice]}
${data.p2.name} : ${hand[data.p2.choice]}
`;

    if (data.result === "draw") text += "\n引き分け";
    if (data.result === "p1") text += `\n${data.p1.name} の勝ち`;
    if (data.result === "p2") text += `\n${data.p2.name} の勝ち`;

    document.getElementById("status").innerText = text;
});