

function drawCar(carPos,carDir)
{
    let c = document.getElementById("gDivCanvas");
    let ctx = c.getContext("2d");

    // green body
    let newPt = graph.rotatePoint(- 3.5,11,carDir);
    let p1 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(3.5,11,carDir);
    let p2 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(3.5,-10,carDir);
    let p3 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(-3.5,-10,carDir);
    let p4 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,255,0,0.4)";
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.lineTo(p4[0],p4[1]);
    ctx.closePath();
    ctx.fill();

    // black front left tire
    newPt = graph.rotatePoint(-7,10,carDir);
    p1 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(-5,10,carDir);
    p2 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(-5,6,carDir);
    p3 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(-7,6,carDir);
    p4 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.lineTo(p4[0],p4[1]);
    ctx.closePath();
    ctx.fill();
    
    // black front right tire
    newPt = graph.rotatePoint(5,10,carDir);
    p1 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(7,10,carDir);
    p2 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(7,6,carDir);
    p3 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(5,6,carDir);
    p4 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.lineTo(p4[0],p4[1]);
    ctx.closePath();
    ctx.fill();

    // black back left tire
    newPt = graph.rotatePoint(-7,-5,carDir);
    p1 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(-5,-5,carDir);
    p2 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(-5,-9,carDir);
    p3 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(-7,-9,carDir);
    p4 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.lineTo(p4[0],p4[1]);
    ctx.closePath();
    ctx.fill();

    // black back right tire
    newPt = graph.rotatePoint(7,-5,carDir);
    p1 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(5,-5,carDir);
    p2 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(5,-9,carDir);
    p3 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    newPt = graph.rotatePoint(7,-9,carDir);
    p4 = graph.convert([newPt[0] + carPos[0], newPt[1] + carPos[1]]);
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.lineTo(p4[0],p4[1]);
    ctx.closePath();
    ctx.fill();
}

function drawLeftTurn(center,direction,carRad,color)
{
    let c = document.getElementById("gDivCanvas");
    let ctx = c.getContext("2d");
    
    let newPt = graph.rotatePoint( -carRad-7, 0, direction );
    newPt = graph.convert( [ newPt[0]+center[0], newPt[1]+center[1] ] );

    let newRad = graph.convert( [ carRad, 0 ] );
    let gCenter = graph.convert( [ 0, 0 ] );

    ctx.setLineDash([16,8]);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc( newPt[0], newPt[1], newRad[0]-gCenter[0], -(direction*Math.PI/180), -Math.PI/2-(direction*Math.PI/180), true );
    ctx.stroke();

    newRad =  graph.convert( [ carRad+14, 0 ] );

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc( newPt[0], newPt[1], newRad[0]-gCenter[0], -(direction*Math.PI/180), -Math.PI/2-(direction*Math.PI/180), true );
    ctx.stroke();

    ctx.setLineDash([]);
}

function drawRightTurn(center,direction,carRad,color)
{
    let c = document.getElementById("gDivCanvas");
    let ctx = c.getContext("2d");
    
    let newPt = graph.rotatePoint( carRad+7, 0, direction );
    newPt = graph.convert( [ newPt[0]+center[0], newPt[1]+center[1] ] );

    let newRad = graph.convert( [ carRad, 0 ] );
    let gCenter = graph.convert( [ 0, 0 ] );

    ctx.setLineDash([16,8]);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc( newPt[0], newPt[1], newRad[0]-gCenter[0], -Math.PI-(direction*Math.PI/180), -Math.PI/2-(direction*Math.PI/180), false );
    ctx.stroke();

    newRad =  graph.convert( [ carRad+14, 0 ] );

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.arc( newPt[0], newPt[1], newRad[0]-gCenter[0], -Math.PI-(direction*Math.PI/180), -Math.PI/2-(direction*Math.PI/180), false );
    ctx.stroke();

    ctx.setLineDash([]);
}

function drawStraightPath(center, direction, carRad, color)
{
    let c = document.getElementById("gDivCanvas");
    let ctx = c.getContext("2d");

    let newPt = graph.rotatePoint(-7,0,direction);
    let firstPoint = graph.convert([ center[0]+newPt[0], center[1]+newPt[1] ]);
    newPt = graph.rotatePoint(-7,carRad,direction);
    let secondPoint = graph.convert([ center[0]+newPt[0], center[1]+newPt[1] ]);


    ctx.setLineDash([16,8]);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(firstPoint[0],firstPoint[1]);
    ctx.lineTo(secondPoint[0],secondPoint[1]);
    ctx.stroke();
    
    
    newPt = graph.rotatePoint(7,0,direction);
    firstPoint = graph.convert([ center[0]+newPt[0], center[1]+newPt[1] ]);
    newPt = graph.rotatePoint(7,carRad,direction);
    secondPoint = graph.convert([ center[0]+newPt[0], center[1]+newPt[1] ]);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.moveTo(firstPoint[0],firstPoint[1]);
    ctx.lineTo(secondPoint[0],secondPoint[1]);
    ctx.stroke();

    ctx.setLineDash([]);
}

function checkLeftTurn(pts, center, direction, carRad)
{
    for(let i = 0; i < pts.length; i++)
    {
        let pA = [center[0]+7*Math.cos(direction*Math.PI/180),center[1]+7*Math.sin(direction*Math.PI/180)];
        let pB = [pA[0]-carRad*Math.sin(direction*Math.PI/180),pA[1]+carRad*Math.cos(direction*Math.PI/180)];
        let pD = [center[0]-(carRad+7)*Math.cos(direction*Math.PI/180),center[1]-(carRad+7)*Math.sin(direction*Math.PI/180)];
        let ATP = [pts[i][0]-pA[0],pts[i][1]-pA[1]];
        let ATB = [pB[0]-pA[0],pB[1]-pA[1]];
        let ATD = [pD[0]-pA[0],pD[1]-pA[1]];
        let calcValue = Math.pow(pts[i][0]-pD[0],2)+Math.pow(pts[i][1]-pD[1],2);
        if(
            (0 < vecDotProduct(ATP,ATB))
            &&
            (vecDotProduct(ATP,ATB) < vecDotProduct(ATB,ATB))
            &&
            (0 < vecDotProduct(ATP,ATD))
            &&
            (vecDotProduct(ATP,ATD) < vecDotProduct(ATD,ATD))
            &&
            (calcValue > Math.pow(carRad,2))
            &&
            (calcValue < Math.pow(carRad + 14,2))
        )
        {return "red";}
    }
    return "green";
}

function checkRightTurn(pts, center, direction, carRad)
{
    for(let i = 0; i < pts.length; i++)
    {
        let pA = [center[0]-7*Math.cos(direction*Math.PI/180),center[1]-7*Math.sin(direction*Math.PI/180)];
        let pB = [pA[0]-carRad*Math.sin(direction*Math.PI/180),pA[1]+carRad*Math.cos(direction*Math.PI/180)];
        let pD = [center[0]+(carRad+7)*Math.cos(direction*Math.PI/180),center[1]+(carRad+7)*Math.sin(direction*Math.PI/180)];
        let ATP = [pts[i][0]-pA[0],pts[i][1]-pA[1]];
        let ATB = [pB[0]-pA[0],pB[1]-pA[1]];
        let ATD = [pD[0]-pA[0],pD[1]-pA[1]];
        let calcValue = Math.pow(pts[i][0]-pD[0],2)+Math.pow(pts[i][1]-pD[1],2);
        if(
            (0 < vecDotProduct(ATP,ATB))
            &&
            (vecDotProduct(ATP,ATB) < vecDotProduct(ATB,ATB))
            &&
            (0 < vecDotProduct(ATP,ATD))
            &&
            (vecDotProduct(ATP,ATD) < vecDotProduct(ATD,ATD))
            &&
            (calcValue > Math.pow(carRad,2))
            &&
            (calcValue < Math.pow(carRad + 14,2))
        )
        {return "red";}
    }
    return "green";
}

function checkStrightPath(pts, center, direction, carRad)
{
    for(let i = 0; i < pts.length; i++)
    {
        let pA = [center[0]-7*Math.cos(direction*Math.PI/180),center[1]-7*Math.sin(direction*Math.PI/180)];
        let pB = [pA[0]-carRad*Math.sin(direction*Math.PI/180),pA[1]+carRad*Math.cos(direction*Math.PI/180)];
        let pD = [center[0]+7*Math.cos(direction*Math.PI/180),center[1]+7*Math.sin(direction*Math.PI/180)];
        let ATP = [pts[i][0]-pA[0],pts[i][1]-pA[1]];
        let ATB = [pB[0]-pA[0],pB[1]-pA[1]];
        let ATD = [pD[0]-pA[0],pD[1]-pA[1]];
        if(
            (0 < vecDotProduct(ATP,ATB))
            &&
            (vecDotProduct(ATP,ATB) < vecDotProduct(ATB,ATB))
            &&
            (0 < vecDotProduct(ATP,ATD))
            &&
            (vecDotProduct(ATP,ATD) < vecDotProduct(ATD,ATD))
        )
        {return "red";}
    }
    return "green";
}

function vecDotProduct(vectA,vectB)
{
    return vectA[0]*vectB[0]+vectA[1]*vectB[1];
}