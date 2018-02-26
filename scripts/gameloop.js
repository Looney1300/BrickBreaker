

//Load APIs 
// let breakerMaker = MyGame.breakerMaker;
// let graphics = MyGame.graphics;
// let keyboard = MyGame.input.Keyboard();

//On my MyGame object, I'm making a main property that is filled
// with a function that is immediately invoked with the graphics api parameter
// listed immediately after.
MyGame.main = (function(graphics, breakerMaker, keyboard){
    
    let previousTime = performance.now();

    //-------------------------------------------
    //            Default Game Model
    //-------------------------------------------
    //Generate default level
    let colorList = [
        {fill: 'rgba(100, 100, 100, 1)', stroke: 'rgba(0, 0, 0, 1)'},
        {fill: 'rgba(150, 150, 150, 1)', stroke: 'rgba(0, 0, 0, 1)'},
        {fill: 'rgba(200, 200, 200, 1)', stroke: 'rgba(0, 0, 0, 1)'},
        {fill: 'rgba(50, 50, 50, 1)', stroke: 'rgba(0, 0, 0, 1)'},
    ]

    //Starting paddle width and height in brick units.
    let paddle = {
        fillStyle: 'rgba(0, 255, 0, 1)',
        strokeStyle: 'rgba(0, 150, 0, 1)',
        width: 2,
        height: .5,
        rate: 2500
    }

    //Ball radius in width and height
    let ball = {
        fillStyle: 'rgba(255,255,255,1)',
        strokeStyle: 'rgba(255,255,255,1)',
        xRate: 50,
        yRate: -100,
        radius: .5
    }

    //generate the default gameModel
    let gameModel = MyGame.gameModel(paddle, ball, colorList);


    //----------------------------------------------
    //                  Handlers
    //----------------------------------------------

    function toggleKeyBindings(){
        // keyboard.registerKey(KeyEvent['DOM_VK_UP'], moveCharacterUp);
        // keyboard.registerKey(KeyEvent['DOM_VK_RIGHT'], moveCharacterRight);
        // keyboard.registerKey(KeyEvent['DOM_VK_DOWN'], moveCharacterDown);
        // keyboard.registerKey(KeyEvent['DOM_VK_LEFT'], moveCharacterLeft);
        // keyboard.registerKey(KeyEvent['DOM_VK_C'], toggleCrumbMode);
        // keyboard.registerKey(KeyEvent['DOM_VK_H'], toggleHintMode);
        // keyboard.registerKey(KeyEvent['DOM_VK_S'], toggleSolutionMode);
        // keyboard.registerKey(KeyEvent['DOM_VK_V'], toggleScoreVisibility);
    }

    //---------------------------------------------------------------

    //Default key registration to handlers
    keyboard.registerKey(KeyEvent['DOM_VK_RIGHT'], gameModel.movePaddleRight);
    keyboard.registerKey(KeyEvent['DOM_VK_LEFT'], gameModel.movePaddleLeft);


    //----------------------------------------------
    //      Web Page Rendering scripts
    //----------------------------------------------


    let fpsList = [];
    let fpsAccumulator = 0;
    function updateFPS(elapsedTime){
        let fps = (1000/elapsedTime);
        fpsList.push(fps);
        fpsAccumulator += fps;
        document.getElementById('fps').innerHTML = 'fps: ' + (fpsAccumulator/fpsList.length).toFixed(3);
        while (fpsList.length > 10){
            fpsAccumulator -= fpsList[0];
            fpsList.splice(0,1);
        }
    }

    //-----------------------------------------------------
    //
    //                  Actual Game Loop
    //
    //-----------------------------------------------------

    function processInput(elapsedTime){
        keyboard.processInput(elapsedTime);
    }

    let countDownUpdate = function(elapsedTime){
    }
    
    let menuUpdate = function(elapsedTime){
    }
    
    function gameModelUpdate(elapsedTime){
        updateFPS(elapsedTime);
        gameModel.updateGameModel(elapsedTime);        
    }
    
    //TODO: this should start at menuUpdate, but for easy 
    //development, I will initialize it with gameUpdate.
    // let update = menuUpdate;
    let update = gameModelUpdate;

    function render(elapsedTime){
        //Draw the game (clearing the screen is handled by the drawGame function)
        gameModel.drawGame();
    }

    function gameLoop(time){
        let elapsedTime = time - previousTime;
        previousTime = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render(elapsedTime);
        requestAnimationFrame(gameLoop);
    }

    console.log('game initializing...');
    requestAnimationFrame(gameLoop);

}(MyGame.graphics, MyGame.breakerMaker, MyGame.input.Keyboard()));