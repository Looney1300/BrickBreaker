//On my MyGame object, I'm making a main property that is filled
// with a function that is immediately invoked.
MyGame.main = (function(graphics, breakerMaker, keyboard, mouse){
    
    let previousTime = performance.now();

    //-------------------------------------------
    //            Default Game Model
    //-------------------------------------------
    //Generate default level
    let colorList = [
        {fill: 'rgba(0, 0, 255, 1)', stroke: 'rgba(0, 0, 175, 1)'},
        {fill: 'rgba(255, 0, 0, 1)', stroke: 'rgba(175, 0, 0, 1)'},
        {fill: 'rgba(0, 255, 0, 1)', stroke: 'rgba(0, 175, 0, 1)'},
        {fill: 'rgba(255, 120, 255, 1)', stroke: 'rgba(175, 100, 175, 1)'},
        {fill: 'rgba(240, 230, 0, 1)', stroke: 'rgba(170, 165, 0, 1)'},        
        {fill: 'rgba(150, 50, 255, 1)', stroke: 'rgba(100, 35, 150, 1)'},        
    ]

    //Starting paddle width and height in brick units.
    // reflectance is how much the trajectory of the ball is changed after hitting 
    // the end of the paddle in some arbitrary unit.
    let paddle = {
        fillStyle: 'rgba(0, 255, 0, 1)',
        strokeStyle: 'rgba(0, 150, 0, 1)',
        width: 2,
        height: .4,
        rate: 1000,
        reflectance: .8 
    }
    
    //Ball radius in width and height
    let ball = {
        fillStyle: 'rgba(255,255,255,1)',
        strokeStyle: 'rgba(255,255,255,1)',
        rate: paddle.rate * 0.8,
        radius: .25
    }

    //background images for gameplay and menu
    let background = 'images/space1.jpg';
    let menuBackground = 'images/space2.jpg';

    let gameSpecs = {
        paddle: paddle,
        ball: ball,
        background: background,
        menuBackground: menuBackground,
        colorList: colorList
    }

    //generate the default gameModel
    let gameModel = MyGame.gameModel(gameSpecs);


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

    //Default key/mouse registration to handlers
    keyboard.registerKey(KeyEvent['DOM_VK_RIGHT'], gameModel.movePaddleRight);
    keyboard.registerKey(KeyEvent['DOM_VK_LEFT'], gameModel.movePaddleLeft);

    mouse.registerMouseReleasedHandler(gameModel.menuSelection);

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

    function update(elapsedTime){
        updateFPS(elapsedTime);
        gameModel.updateGame(elapsedTime);        
    }

    function processInput(elapsedTime){
        keyboard.processInput(elapsedTime);
    }

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

}(MyGame.graphics, MyGame.breakerMaker, MyGame.input.Keyboard(), MyGame.input.Mouse()));