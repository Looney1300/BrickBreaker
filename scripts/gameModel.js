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
    let gameTime = 0;
    let levelCount = 1;
    let level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
    level.gapAbove = gapAbove;
    
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
                if(brickY1 < ballY2 && brickY2 > ballY1){
                    brickList.splice(i,1);
                }
            }
        }
    }

    function reflectCollisionWithWall(){
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
        detectCollisionWithBrick();
        reflectCollisionWithWall();
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