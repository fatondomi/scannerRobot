
let cTurn = 0;
let cPower = 0;

let panelOn = true;

let panelOx = 80;
let panelOy = 80;
let panelPanX = 0;
let panelPanY = 0;
let panelPan = false;

let previousKeyDown = 0;

function onPanelMouseMove(e)
{
    //refreshing mouse position after mouse is moved
    if(panelPan)
    {
        panelOx = panelPanX - e.pageX;
        panelOy = panelPanY - e.pageY;
        document.getElementById("panel").style.right = panelOx + "px";
        document.getElementById("panel").style.bottom = panelOy + "px";
    }
}

function txtBoxPressed(e)
{
    e.stopPropagation();
    document.getElementById("txtBox").innerHTML = "( Move with WASD )";
}

function stopBubble(e)
{
    e.stopPropagation();
}

function onPanelMouseDown(e)
{
    e.stopPropagation();
    panelPan = true;
    panelPanX = panelOx + e.pageX;
    panelPanY = panelOy + e.pageY;
    document.getElementById("panel").style.cursor = '-webkit-grabbing';
}

function onPanelMouseUp(e)
{
    e.stopPropagation();
    panelPan = false;
    document.getElementById("txtBox").innerHTML="Click here to enable keyboard input";
    document.getElementById("panel").style.cursor = '-webkit-grab';
    cTurn = 0;
    cPower = 0;
    sendDriveMode();
}

function sliderMoved()
{
    let value = document.getElementById("powerSlider").value;
    document.getElementById("powerLabel").innerHTML = "Power : " + value;
}

function keyDown(e)
{
    let txtBox = document.getElementById("txtBox");
    
    let btnDown = e.which || e.keyCode;

    if(btnDown == 80) // P
    {
        panelOn = !panelOn;
        if(panelOn)
        {
            document.getElementById("panel").style.display = "block";
        }
        else
        {
            document.getElementById("panel").style.display = "none";
        }
    }
    
    if(btnDown == previousKeyDown) {return;}
    else{previousKeyDown = btnDown;}

    if(txtBox.innerHTML.indexOf("Click") != 0)
    {
        
        if(btnDown == 87) //W == 87
        {
            cPower = (cPower == 0)? 1 : cPower;
        }
        else if(btnDown == 65) //A == 65
        {
            cTurn = (cTurn == 0)? -1 : cTurn;
        }
        else if(btnDown == 83) //S == 83
        {
            cPower = (cPower == 0)? -1 : cPower;
        }
        else if(btnDown == 68) //D == 68
        {
            cTurn = (cTurn == 0)? 1 : cTurn;
        }
        else if(btnDown == 77) // M
        {
            let pwmPower = document.getElementById("powerSlider").value;
            pwmPower = pwmPower - 0 + 100;
            pwmPower = (pwmPower > 1023)? 1023 : pwmPower;
            document.getElementById("powerSlider").value = pwmPower;
            sliderMoved();
        }
        else if(btnDown == 76) // L
        {
            let pwmPower = document.getElementById("powerSlider").value;
            pwmPower -= 100;
            pwmPower = (pwmPower < 0)? 0 : pwmPower;
            document.getElementById("powerSlider").value = pwmPower;
            sliderMoved();
        }

        if(cTurn != 0 || cPower != 0) {
            sendDriveMode();
            txtBox.innerHTML = "( " + stringCommand() + " )";
        }
    }
}

function keyUp(e)
{
    let txtBox = document.getElementById("txtBox");
    if(txtBox.innerHTML.indexOf("Click") != 0)
    {
        let btnUp = e.which || e.keyCode;
        if(btnUp == previousKeyDown){previousKeyDown=0;}
        let driveChanged = false;
        if(btnUp == 87) //W == 87
        {
            cPower = (cPower == 1)? 0 : cPower;
            driveChanged = true;
        }
        else if(btnUp == 65) //A == 65
        {
            cTurn = (cTurn == -1)? 0 : cTurn;
            driveChanged = true;
        }
        else if(btnUp == 83) //S == 83
        {
            cPower = (cPower == -1)? 0 : cPower;
            driveChanged = true;
        }
        else if(btnUp == 68) //D == 68
        {
            cTurn = (cTurn == 1)? 0 : cTurn;
            driveChanged = true;
        }

        if(driveChanged)
        {
            sendDriveMode();
            let newStringCommand = stringCommand();
            if(newStringCommand == "")
            {
                txtBox.innerHTML = "( Move with WASD )";
            }
            else
            {
                txtBox.innerHTML = "( " + newStringCommand + " )";
            }
        }
    }
}

function stringCommand()
{
    let keysDownText = "";

    if(cPower == 1)
    { 
        keysDownText = "Power Forward";

        if(cTurn == 1)
        {
            keysDownText += " + Turn Right";
        }
        else if(cTurn == -1)
        {
            keysDownText += " + Turn Left";
        }
        return keysDownText;
    }
    else if(cPower == -1)
    {
        keysDownText = "Power Backward";

        if(cTurn == 1)
        {
            keysDownText += " + Turn Right";
        }
        else if(cTurn == -1)
        {
            keysDownText += " + Turn Left";
        }
        return keysDownText;
    }

    if(cTurn == 1)
    {
        keysDownText = "Turn Right";
    }
    else if(cTurn == -1)
    {
        keysDownText = "Turn Left";
    }
    return keysDownText;
}

function powerBtnPressed(e) 
{
    e.stopPropagation();
    document.getElementById("txtBox").innerHTML = "( Power Forward )"; //W == 87
    cTurn = 0;
    cPower = 1;
    sendDriveMode();
}

function powerBtn2Pressed(e)
{
    e.stopPropagation();
    document.getElementById("txtBox").innerHTML = "( Power Backward )"; //S == 83
    cTurn = 0;
    cPower = -1;
    sendDriveMode();
}

function turnBtnPressed(e)
{
    e.stopPropagation();
    document.getElementById("txtBox").innerHTML = "( Turn Right )"; //D == 68
    cTurn = 1;
    cPower = 0;
    sendDriveMode();
}

function turnBtn2Pressed(e)
{
    e.stopPropagation();
    document.getElementById("txtBox").innerHTML = "( Turn Left )"; //A == 65
    cTurn = -1;
    cPower = 0;
    sendDriveMode();
}

function btnReleased(e)
{
    e.stopPropagation();
    cPower = 0;
    cTurn = 0;
    sendDriveMode();
    document.getElementById("txtBox").innerHTML="Click here to enable keyboard input";
}

function turnCPressed(e)
{
    e.stopPropagation();
    socket.emit("ui","turnRight()");
}

function turnCCPressed(e)
{
    e.stopPropagation();
    socket.emit("ui","turnLeft()");
}

function scanPressed(e)
{
    e.stopPropagation();
    socket.emit("ui","scan()");
}

function aPilotPressed(e)
{
    e.stopPropagation();
    if(checkStrightPath(points,cPos,cDir,134)=="green")
    {
        socket.emit("ui","drive(0,1,700)");
        setTimeout(()=>{
                socket.emit("ui","drive(0,0,0)");
        },1000);
    }
    else if(checkRightTurn(points,cPos,cDir,120)=="green")
    {
        socket.emit("ui","drive(1,0,1000)");
        setTimeout(()=>{
                socket.emit("ui","drive(1,1,1000)");
        },300);
        setTimeout(()=>{
                socket.emit("ui","drive(1,0,0)");
        },2500);
        setTimeout(()=>{
                socket.emit("ui","drive(0,0,0)");
        },2700);
    }
    else if(checkLeftTurn(points,cPos,cDir,120)=="green")
    {   
        socket.emit("ui","drive(-1,0,1000)");
        setTimeout(()=>{
                socket.emit("ui","drive(-1,1,1000)");
        },300);
        setTimeout(()=>{
                socket.emit("ui","drive(-1,0,0)");
        },2500);
        setTimeout(()=>{
                socket.emit("ui","drive(0,0,0)");
        },2700);
    }
}

function sendDriveMode()
{
    let pwmPower = document.getElementById("powerSlider").value;

    //   drive(dir,power,pwmPower)
    if((cPower == 0) && (cTurn ==0))
    {
        socket.emit("ui","stop()");
    }
    else
    {
        socket.emit("ui","drive(" + cTurn + "," + cPower + "," + pwmPower + ")");
    }
}

function changePosition(newPack)
{
    //newPack = {move:[dir,steps]}

    if(newPack.move[0] == 0)
    {
        cPos[0] = cPos[0] + Math.cos(Math.PI * (cDir + 90) / 180) * 3.5 * newPack.move[1];
        cPos[1] = cPos[1] + Math.sin(Math.PI * (cDir + 90) / 180) * 3.5 * newPack.move[1];
        graph.drawCS();
    }
    else if(newPack.move[0] == 1)
    {
        let turnRadius = 120;    //in cm
        let centerX = cPos[0] + turnRadius * Math.cos(cDir * Math.PI / 180);
        let centerY = cPos[1] + turnRadius * Math.sin(cDir * Math.PI / 180);
        let rotationAngle = (newPack.move[1] / turnRadius) * 180 / Math.PI;
        let displacementVector = graph.rotatePoint(cPos[0] - centerX,cPos[1] - centerY,-rotationAngle);
        
        cPos[0] = centerX + displacementVector[0];
        cPos[1] = centerY + displacementVector[1];
        cDir -= rotationAngle; 
        graph.drawCS();
    }
    else if(newPack.move[0] == -1)
    {
        let turnRadius = 120;    //in cm
        let centerX = cPos[0] - turnRadius * Math.cos(cDir * Math.PI / 180);
        let centerY = cPos[1] - turnRadius * Math.sin(cDir * Math.PI / 180);
        let rotationAngle = (newPack.move[1] / turnRadius) * 180 / Math.PI;
        let displacementVector = graph.rotatePoint(cPos[0] - centerX,cPos[1] - centerY,rotationAngle);
        
        cPos[0] = centerX + displacementVector[0];
        cPos[1] = centerY + displacementVector[1];
        cDir += rotationAngle; 
        graph.drawCS();
    }
}

function addPoints(pointsObj)
{
    //{points:[localStepCounter,currentVal]}
    let distance = Math.pow(4,-((pointsObj.points[1] - 760) / 200)) + 18;
    
    if(distance>150){return;}
    
    let newPt;
    if(pointsObj.points[0] >= 0)
    {
        newPt = graph.rotatePoint(distance,0,cDir+180+(pointsObj.points[0]*180/1025));
    }
    else
    {
        newPt = graph.rotatePoint(distance,0,cDir-(pointsObj.points[0]*180/1025));
    }
    
    points.push([cPos[0] + newPt[0],cPos[1] + newPt[1]]);
    graph.drawCS();
}