MyGame.gameModel = function(paddle, ball, colorList){
    let that = {};
    let CANVASWIDTH = 1600;
    let CANVASHEIGHT = 1000;
    let graphics = MyGame.graphics;
    let breakerMaker = MyGame.breakerMaker;
    let gameWidthInBricks = 15;
    let gameHeightInBricks = 5;
    let brickUnit = CANVASWIDTH/gameWidthInBricks;
    let gapAbove = 6/5*brickUnit;
    paddle.gapBelowPaddle = brickUnit * (2/5 + paddle.height);
    let gameTime = 0;
    let levelCount = 1;
    let level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
    level.gapAbove = gapAbove;
    ball.xRate = ball.rate * Math.cos(Math.PI/4);
    ball.yRate = -1 * ball.rate * Math.sin(Math.PI/4);
    let Xrate = ball.xRate;
    let Yrate = ball.yRate;

    
    //Game graphics members
    let brickLevel = graphics.BrickLevel(level);
    let paddleGraphic = graphics.Paddle(gameWidthInBricks, gameHeightInBricks, paddle);
    let ballGraphic = graphics.Ball(gameWidthInBricks, ball);
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

    that.drawGame = function(){
        graphics.clear();
        brickLevel.draw();
        paddleGraphic.draw();
        ballGraphic.draw();
    }

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
                    //Checking how to reflect the ball after hitting a brick
                    // if (brickX1 > ballX1 || brickX2 < ballX2){
                    //     ball.xRate *= -1;
                    // }else{
                    //     ball.yRate *= -1;
                    // }
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
        if (ball.centerX - ball.radius <= 0 || ball.centerX + ball.radius >= CANVASWIDTH){
            ball.xRate *= -1;
        }
        if (ball.centerY - ball.radius <= 0){
            ball.yRate *= -1;
        }
        if (ball.centerY + ball.radius >= CANVASHEIGHT){
            ball.yRate *= -1;
            return false;
        }
        return true;
    }

    function updateCollisions(){
        if (ball.centerY < gapAbove + 2/5 * brickUnit * (gameHeightInBricks + 1) + ball.radius){
            detectCollisionWithBrick();
        }else if (ball.centerY > CANVASWIDTH - paddle.gapBelowPaddle - paddle.width*brickUnit){
            detectCollisionWithPaddle();
        }
        detectCollisionWithWall();
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

    that.updateGameModel = function(elapsedTime){
        updateBall(elapsedTime);
        updateCollisions();
    }

    return that;
};