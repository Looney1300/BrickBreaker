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

    that.drawGame = function(){
        graphics.clear();
        brickLevel.draw();
        paddleGraphic.draw();
        ballGraphic.draw();
    }

    function updateBallLocation(elapsedTime){
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
            let rate = 1000;
            paddle.x += elapsedTime/1000 * rate;
        }
    }
    
    that.movePaddleLeft = function(elapsedTime){
        if (isInLeftBound(paddle)){
            let rate = 1000;
            paddle.x -= elapsedTime/1000 * rate;
        }
    }

    that.updateGameModel = function(elapsedTime){
        updateBallLocation(elapsedTime);
    }

    return that;
};