
let http = require("http");
let fs = require("fs");

let uiPage = fs.readFileSync("interface.html", "utf8");
let redImg = fs.readFileSync("resources/red.png");
let red2Img = fs.readFileSync("resources/red2.png");
let screwHeadImg = fs.readFileSync("resources/screwhead.png");
let pageStyle = fs.readFileSync("resources/pageStyle.css");
let pageFunctions = fs.readFileSync("resources/pageFunctions.js");
let graphClass = fs.readFileSync("resources/graphClass.js");
let rcPanelFunctions = fs.readFileSync("resources/rcPanelFunctions.js");
let rcPanelStyle = fs.readFileSync("resources/rcPanelStyle.css");
let setup = fs.readFileSync("resources/setup.js");
let socketLib = fs.readFileSync("resources/socket.io.js");


let ipAdresa = "192.168.0.104";
// iphone ip 172.20.10.2
// Wifi_home ip 192.168.0.104:8080/
// jCoders ROOM4 ip 192.168.174.100

let method;
let url;

let mode = "stop()";

let server = http.createServer(function (req, resp) {

    method = req.method;
    url = req.url;

	//logging method and url to cmd
    //console.log("\n method = " + method + "     url = " + url);

    if(url.indexOf("/resources/") == 0) {
        if(url.indexOf("red.png") == 11) {
            resp.writeHead(200, { "Content-Type" : "image/png" });
            resp.end(redImg,"binary");
        }
        else if(url.indexOf("red2.png") == 11) {
            resp.writeHead(200, { "Content-Type" : "image/png" });
            resp.end(red2Img,"binary");
        }
        else if(url.indexOf("screwhead.png") == 11) {
            resp.writeHead(200, { "Content-Type" : "image/png" });
            resp.end(screwHeadImg,"binary");
        }
        else if(url.indexOf("pageFunctions.js") == 11) {
            resp.writeHead(200, { "Content-Type" : "text/javascript" });
            resp.end(pageFunctions,"binary");
        }
        else if(url.indexOf("pageStyle.css") == 11) {
            resp.writeHead(200, { "Content-Type" : "text/css" });
            resp.end(pageStyle,"binary");
        }
        else if(url.indexOf("graphClass.js") == 11) {
            resp.writeHead(200,{"Content-Type":"text/javascript"});
            resp.end(graphClass,"binary");
        }
        else if(url.indexOf("rcPanelFunctions.js") == 11) {
            resp.writeHead(200,{"Content-Type":"text/javascript"});
            resp.end(rcPanelFunctions,"binary");
        }
        else if(url.indexOf("rcPanelStyle.css") == 11) {
            resp.writeHead(200,{"Content-Type":"text/css"});
            resp.end(rcPanelStyle,"binary");
        }
        else if(url.indexOf("setup.js") == 11) {
            resp.writeHead(200,{"Content-Type":"text/css"});
            resp.end(setup,"binary");
        }
        else if(url.indexOf("socket.io.js") == 11) {
            resp.writeHead(200,{"Content-Type":"text/javascript"});
            resp.end(socketLib,"binary");
        }
    }
    else if(url.indexOf("/") == 0) {
        resp.writeHead(200, {"Content-Type":"text/html"});
        resp.end(uiPage);
    }
    else { 
        resp.writeHead(404, {"Content-Type":"text/plain"});
        resp.end("404 : Not found");
    }  //for irregular urls

    req.on('error', function (err) {
        // This prints the error message and stack trace to `stderr`.
        console.error(err.stack);
    });
})

server.listen(8080, ipAdresa);

let io = require('socket.io')(server);

io.on("connection", function (socket) {

    socket.emit("connected","");

    socket.on("ui", function (data){
        io.sockets.emit("mode",data);
    });

    socket.on("botMove", function (data){
        io.sockets.emit("moves",data);
        //console.log("move :     "+data.move[0]+"    "+data.move[1]);
    });
    socket.on("botPt", function (data){
        io.sockets.emit("points",data);
    });
});

console.log("Server running at " + ipAdresa + ":8080");

