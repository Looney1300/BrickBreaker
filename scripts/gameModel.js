MyGame.gameModel = function(paddle, colorList){
    let that = {};
    let graphics = MyGame.graphics;
    let breakerMaker = MyGame.breakerMaker;
    let gameWidthInBricks = 15;
    let gameHeightInBricks = 5;
    
    let levelCount = 1;
    let level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
    

    //Game graphics members
    let brickLevel = graphics.BrickLevel(level);
    let paddleGraphic = graphics.Paddle(gameWidthInBricks, gameHeightInBricks, paddle);
    //TODO: let levelTracker = graphics.Text(levelCount);

    that.drawGame = function(){
        graphics.clear();
        brickLevel.draw();
        paddleGraphic.draw();
    }

    that.movePaddleRight = function(elapsedTime){
        
    }
    
    that.movePaddleLeft = function(elapsedTime){

    }

    return that;
};