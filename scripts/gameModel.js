MyGame.gameModel = function(gameSpecs){
    let that = {};
    //Unpacking gameSpecs
    let paddle = gameSpecs.paddle;
    let ball = gameSpecs.ball;
    let colorList = gameSpecs.colorList;
    let background = gameSpecs.background;
    let menuBackground = gameSpecs.menuBackground;
    
    let CANVASWIDTH = 1600;
    let CANVASHEIGHT = 1000;
    let graphics = MyGame.graphics;
    let breakerMaker = MyGame.breakerMaker;
    let gameWidthInBricks = 15;
    let gameHeightInBricks = 6;
    let brickUnit = CANVASWIDTH/gameWidthInBricks;
    let gapAbove = 8/5 * brickUnit;
    paddle.gapBelowPaddle = brickUnit * (2/5 + paddle.height);
    
    let level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
    level.gapAbove = gapAbove;
    ball.radius0 = ball.radius;
    let startAngle = 2*Math.PI/5;
    ball.xRate = ball.rate * Math.cos(startAngle);
    ball.yRate = -1 * ball.rate * Math.sin(startAngle);
    ball.xRate0 = ball.xRate;
    ball.yRate0 = ball.yRate;
    
    let gameTime = 0;
    let lives = 0;
    let levelCount = 0;

    //Menu Screen
     //button list for menu screen: same components as a rectangle.
    let menuButton = {
        x: 1/5 * CANVASWIDTH,
        width: 3/5 * CANVASWIDTH,
        height: CANVASHEIGHT/6,
        fillStyle: 'rgba(0, 0, 255, .6)',
        strokeStyle: 'rgba(0, 0, 175, .6)'
    };

    let textList = [{text: '- N E W  G A M E -', font: '4.5em Courier', fillStyle: colorList[0].stroke, fill: true, stroke: true, strokeStyle: 'rgba(220,220,220,1)', align: 'center', baseline: 'middle'},
    {text: '- H I G H  S C O R E S -', font: '3.6em Courier', fillStyle: colorList[0].stroke, fill: true, stroke: true, strokeStyle: 'rgba(220,220,220,1)', align: 'center', baseline: 'middle'},
    {text: '- C R E D I T S -', font: '3.5em Courier', fillStyle: colorList[0].stroke, fill: true, stroke: true, strokeStyle: 'rgba(220,220,220,1)', align: 'center', baseline: 'middle'}
    ];

    let menu = {
        background: menuBackground,
        button: menuButton,
        rows: 3,
        gap: CANVASHEIGHT/8,
        textList: textList,
    };
    
    //Game graphics members
    let back = graphics.Background(background)
    let menuGraphic = graphics.Menu(menu);
    let brickLevel = graphics.BrickLevel(level);
    let paddleGraphic = graphics.Paddle(paddle);
    let ballGraphic = graphics.Ball(ball);
    //TODO: 
    //let levelTracker = graphics.Text(levelCount);
    //let gameTimeDisplay = graphics.Text(gameTime);

    //Building collision test groups by brick column
    let testGroups = [];
    for (let j=0; j < gameWidthInBricks; ++j){
        let columnj = []
        for (let i=0; i < gameHeightInBricks; ++i){
            columnj.push(level[i]);
        }
    }

    let drawGame = function(){
        graphics.clear();
        back.draw();
        brickLevel.draw();
        paddleGraphic.draw();
        ballGraphic.draw();
        //TODO
        //lives.draw
        //score.draw
        //border.draw
    }

    let drawMenu = function(){
        graphics.clear();
        menuGraphic.draw();  
        //TODO
        //newGameText.draw      
    }

    let drawCountDown = function(){

    }

    //START - beginning draw
    that.drawGame = drawMenu;
    // that.drawGame = drawGame;

    let countDownUpdate = function(elapsedTime){

    }
    
    let menuUpdate = function(elapsedTime){

    }
    
    let gameModelUpdate = function(elapsedTime){
        updateBall(elapsedTime);
        updateCollisions();
    }
    
    //START - beginning update
    that.updateGame = menuUpdate;
    // that.updateGame = gameModelUpdate;
    
    function detectCollisionWithBrick(){
        let brickList = level.brickList;
        for (let i = (brickList.length-1); i >= 0; --i){
            brickX1 = brickUnit * brickList[i].x;
            brickY1 = 2/5 * brickUnit * brickList[i].y + gapAbove;
            brickX2 = brickUnit * (brickList[i].x + 1)
            brickY2 = 2/5 * brickUnit * (brickList[i].y + 1) + gapAbove;
            ballX1 = ball.centerX - ball.radius;
            ballY1 = ball.centerY - ball.radius;
            ballX2 = ball.centerX + ball.radius;
            ballY2 = ball.centerY + ball.radius;

            if (brickX1 < ballX2 && brickX2 > ballX1){
                if (brickY1 < ballY2 && brickY2 > ballY1){
                    console.log('detected brick collision');
                    brickList.splice(i,1);
                    level.rectangleList.splice(i,1);
                    //Checking how to reflect the ball after hitting a brick
                    if (brickY1 > ballY1 || brickY2 < ballY2){
                        ball.yRate *= -1;
                    }else{
                        ball.xRate *= -1;
                    }
                }
            }
        }
    }

    function detectCollisionWithPaddle(){
        paddleCenterX = paddle.x + 1/2 * paddle.width;
        paddleX1 = paddle.x;
        paddleY1 = paddle.y;
        paddleX2 = paddle.x + paddle.width;
        paddleY2 = paddle.y + paddle.height;
        ballX1 = ball.centerX - ball.radius;
        ballY1 = ball.centerY - ball.radius;
        ballX2 = ball.centerX + ball.radius;
        ballY2 = ball.centerY + ball.radius;

        if (paddleX1 < ballX2 && paddleX2 > ballX1){
            if (paddleY1 < ballY2 && paddleY2 > ballY1){
                let weight = 2 * (paddleCenterX - ball.centerX)/(paddle.width);
                ball.xRate += paddle.reflectance * weight * ball.rate * -1;
                ball.yRate *= -1;
            }
        }
    }

    function detectCollisionWithWall(){
        if (ball.centerX - ball.radius <= 0 && ball.xRate < 0){
            ball.xRate *= -1;
        }
        else if (ball.centerX + ball.radius >= CANVASWIDTH && ball.xRate > 0){
            ball.xRate *= -1;
        }
        if (ball.centerY - ball.radius <= 0 && ball.yRate < 0){
            ball.yRate *= -1;
        }
        if (ball.centerY + ball.radius >= CANVASHEIGHT + 8*brickUnit){
            //Uncomment to create a floor.
            //ball.yRate *= -1;
            return false;
        }
        return true;
    }

    function restartBall(){
        ball.xRate = ball.xRate0;
        ball.yRate = ball.yRate0;
        ballGraphic = graphics.Ball(ball);
    }

    function restartPaddle(){
        paddle.x = paddle.x0;
    }

    function newGame(){
        //New Game
        restartBall();
        restartPaddle();
        level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
        level.gapAbove = gapAbove;
        brickLevel = graphics.BrickLevel(level);
        lives = 3;
        levelCount = 1;
        that.drawGame = drawGame;
        that.updateGame = gameModelUpdate;
        console.log('New Game Starting');
    }

    function credits(){
        console.log('Showing Credits');
    }

    function highScores(){
        console.log('Showing High Scores');
    }

    function updateCollisions(){
        if (ball.centerY < gapAbove + 2/5 * brickUnit * (gameHeightInBricks + 1) + ball.radius){
            detectCollisionWithBrick();
        }else if (ball.centerY > CANVASWIDTH - paddle.gapBelowPaddle - paddle.width*brickUnit){
            detectCollisionWithPaddle();
        }
        if (!detectCollisionWithWall()){
            --lives;
            if (lives <= 0){
                that.updateGame = menuUpdate;
                that.drawGame = drawMenu;
            }
            restartBall();
        }
    }
    
    function updateBall(elapsedTime){
        ball.centerX += ball.xRate * elapsedTime/1000;
        ball.centerY += ball.yRate * elapsedTime/1000;
    }

    function isInRightBound(object){
        return (object.x + object.width) < CANVASWIDTH;
    }

    function isInLeftBound(object){
        return object.x > 0;
    }


    that.movePaddleRight = function(elapsedTime){
        if (isInRightBound(paddle)){
            paddle.x += elapsedTime/1000 * paddle.rate;
        }
    }
    
    that.movePaddleLeft = function(elapsedTime){
        if (isInLeftBound(paddle)){
            paddle.x -= elapsedTime/1000 * paddle.rate;
        }
    }

    that.menuSelection = function(e){
        if (lives === 0){
            let x = 0;
            let y = 0;
            //The following if/else statement from 
            // https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
            if (e.x || e.y) { 
                x = e.x;
                y = e.y;
            } else { 
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
            } 

            let buttonId = menuGraphic.isCoordinateOnButton({x: x, y: y});
            if (buttonId === 1){
                newGame();
            }else if (buttonId === 2){
                highScores();
            }else if (buttonId === 3){
                credits();
            }
        }
    }

    return that;
};