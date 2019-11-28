

let cDir = 0;
let cPos = [0,0];

let points = [
];

let graph = new Graph("gDiv",points,false);

window.onresize = function(){graph.onResize();};

graph.callBackDrawing(
    function () {
        drawCar(cPos,cDir);
        drawLeftTurn(cPos,cDir,120,checkLeftTurn(points,cPos,cDir,120));
        drawRightTurn(cPos,cDir,120,checkRightTurn(points,cPos,cDir,120));
        drawStraightPath(cPos,cDir,134,checkStrightPath(points,cPos,cDir,134));
    }
);

graph.focus();

let socket = io('http://192.168.0.104:8080');

socket.on("connected", (data)=>{
    document.getElementById("onlineLed").style.background = "darkgreen";
});
socket.on("moves", (data)=>{
    changePosition(data);
});
socket.on("points", (data)=>{
    addPoints(data);
});