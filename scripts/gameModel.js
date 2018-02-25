MyGame.gameModel = function(level){
    let that = {};
    let graphics = MyGame.graphics;
    //Game graphics members
    let brickLevel = graphics.BrickLevel(level);

    that.drawGame = function(){
        brickLevel.draw();
    }

    that.moveCharacterRight = function(elapsedTime){
        
    }
    
    that.moveCharacterLeft = function(elapsedTime){

    }

    return that;
};