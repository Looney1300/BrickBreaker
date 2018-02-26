

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
        {fill: 'rgba(100, 100, 100, 1)', stroke: 'rgba(255, 255, 255, 1)'},
        {fill: 'rgba(150, 150, 150, 1)', stroke: 'rgba(255, 255, 255, 1)'},
        {fill: 'rgba(200, 200, 200, 1)', stroke: 'rgba(255, 255, 255, 1)'},
        {fill: 'rgba(50, 50, 50, 1)', stroke: 'rgba(255, 255, 255, 1)'},
    ]

    //Test Shapes

    //generate the default gameModel
    let gameModel = MyGame.gameModel(breakerMaker.generateLevel(15, 5, colorList));


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
    keyboard.registerKey(KeyEvent['DOM_VK_RIGHT'], gameModel.moveCharacterRight);
    keyboard.registerKey(KeyEvent['DOM_VK_LEFT'], gameModel.moveCharacterLeft);


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
        //keyboard.processInput(elapsedTime);
    }

    function update(elapsedTime){
        //gameModel.updateGameTime(elapsedTime);
        updateFPS(elapsedTime);
    }

    function render(elapsedTime){
        graphics.clear();
        //Draw the game
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