MyGame.gameModel = function(paddle, ball, colorList){
    let that = {};
    let CANVASWIDTH = 1600;
    let CANVASHEIGHT = 1000;
    let graphics = MyGame.graphics;
    let breakerMaker = MyGame.breakerMaker;
    let gameWidthInBricks = 15;
    let gameHeightInBricks = 5;
    let gameTime = 0;
    let levelCount = 1;
    let level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
    
    
    
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
        let toDelete = [];
        for (let i=0; i < level.brickList; level.brickList.length){
            if (brickList[i].x >= ball.centerX + ball.radius && brickList[i].x <= ball.centerX + ball.radius){
                if (brickList[i].y >= ball.centerY + ball.radius && brickList[i].y <= ball.centerY + ball.radius){
                    //Collision is detected.
                    toDelete.push(i);
                }
            }
        }
        for (let i=0; i < toDelete.length; ++i){
            console.log('splicing brick: ', i);
            brickList.splice(i,1);
        }
    }

    function detectCollisionWithWall(){
        if (ball.centerX - ball.radius <= 0 || ball.centerX + ball.radius >= CANVASWIDTH){
            ball.xRate *= -1;
        }
        if (ball.centerY - ball.radius <= 0 || ball.centerY + ball.radius >= CANVASHEIGHT){
            ball.yRate *= -1;
        }
    }


    function updateCollisions(){
        detectCollisionWithBrick();
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

    function isInTopBound(object){
        return object.y > 0;
    }

    function isInBottomBound(object){
        return (object.y + object.height) > CANVASHEIGHT;
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