// Name: Lazar Lazarevic
// Date: 25 April 2015
// Bug: When redrawing, the coordinates/rotation change for some reason. I did not have time to fix it :(

var xSquare, ySquare, ctx, p = 1, xArc = 0, yArc = 0, count = 0, oldWidth, firstPass = true, alterX = false;

function setup() {
    xSquare = screen.width / 2;
    ySquare = screen.height / 2;
    var c = document.getElementById("c");
    ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
   p = 1; xArc = 0; yArc = 0; count = 0; firstPass = true; alterX = false;
}

function generateFiboSpiral(n, scale) {
    setup();
    for (var i = 1; i <= n ; i++) {
        var fNum = fibonacci(i);
        calcNextPos(fNum * scale);
        draw(xSquare, ySquare, fNum * scale, scale);
    }
}

function fibonacci(n) {
    return n == 0 ? 0 : n == 1 ? 1 : fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculating the next position for a square and modifying position for arc
// Count means in which direction to move drawing point: 0 - up, 1 - left, 2 - down, 3 - right
function calcNextPos(width) {
    if (firstPass) {
        firstPass = false;
        return;
    }
    xArc = yArc = 0;
    switch (count % 4) {
        case 0:
            if (alterX)
                xSquare -= (width - oldWidth);
            alterX = true;
            yArc = width;
            ySquare -= width;
            count = 0;
            break;
        case 1:
            xSquare -= width;
            yArc = xArc = width;
            break;
        case 2:
            ySquare += oldWidth;
            xArc = width;
            break;
        case 3:
            xSquare += oldWidth;
            ySquare -= (width - oldWidth);
            break;
    }
    oldWidth = width;
    count++;
}

function draw(x, y, width, scale) {
    ctx.beginPath();
    ctx.rect(x, y, width, width);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + xArc, y + yArc, width, (p -= 0.5) * Math.PI, (p - 0.5) * Math.PI, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.font = width / 5 + "px serif";
    ctx.fillText(width / scale, x + width / 2, y + width / 2, width);
}

