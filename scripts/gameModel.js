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
    let particleSystem = MyGame.particleSystem;
    let gameWidthInBricks = 18;
    let gameHeightInBricks = 8;
    let gameWidthInBricks0 = gameWidthInBricks;
    let gameHeightInBricks0 = gameHeightInBricks;
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
    
    let score = 0;
    let lives = 0;
    let levelCount = 1;

    let top5 = MyGame.persistence.retrieveHighScores();
    
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

    let creditText = {
        text: '- Created By Landon Henrie -',
        font: '4em Courier', 
        fillStyle: colorList[2].fill, 
        fill: true, 
        align: 'center', 
        baseline: 'middle',
        x: CANVASWIDTH/2,
        y: CANVASHEIGHT/2
    };

    let highScoreText = {
        text: '- High Scores -',
        font: '7em Courier', 
        fill: true, 
        fillStyle: colorList[2].stroke, 
        stroke: true,
        strokeStyle: colorList[2].fill, 
        align: 'center', 
        baseline: 'top',
        x: CANVASWIDTH/2,
        y: 30
    };

    let top5Graphics = [];
    
    let menu = {
        background: menuBackground,
        button: menuButton,
        rows: 3,
        gap: CANVASHEIGHT/8,
        textList: textList,
    };
    
    let levelTrack = {
        text: 'Level '+ levelCount, 
        font: '3em New-Courier', 
        fillStyle: 'rgba(220, 220, 220, .2)', 
        fill: true, 
        stroke: true, 
        strokeStyle: 'rgba(255, 255, 255, 1)', 
        align: 'left', 
        baseline: 'bottom',
        x: 30,
        y: CANVASHEIGHT - 5
    };

    let gameScore = {
        text: 'Score: '+ score, 
        font: '3em New-Courier', 
        fillStyle: 'rgba(220, 220, 220, .2)', 
        fill: true, 
        stroke: true, 
        strokeStyle: 'rgba(255, 255, 255, 1)', 
        align: 'right', 
        baseline: 'bottom',
        x: CANVASWIDTH - 30,
        y: CANVASHEIGHT - 5
    };

    let livesObj = {
        text: 'Lives: ' + lives,
        font: '3em New-Courier', 
        fillStyle: 'rgba(220, 220, 220, .9)', 
        fill: true, 
        stroke: true, 
        strokeStyle: 'rgba(255, 255, 255, .9)', 
        align: 'center', 
        baseline: 'bottom',
        x: CANVASWIDTH/2,
        y: CANVASHEIGHT - 5
    }

    let countDown = {
        time: 0,
        text: '0',
        font: '30em New-Courier', 
        fillStyle: 'rgba(230, 230, 230, .8)', 
        fill: true, 
        align: 'center', 
        baseline: 'middle',
        x: CANVASWIDTH/2,
        y: CANVASHEIGHT/2
    }

    let particleSpec = {
        x: CANVASWIDTH/2,
        y: CANVASHEIGHT/2,
        particlesPerMS: .1,
        fill: 'rgba(100,100,100,1)',
        stroke: 'rgba(0,0,0,0)',
        maxRotation: .25,
        lifetime: {mean: 1000, std: 150},
        speed: {mean: .1, std: .05},
        size: {mean: 6, std: 2},
        duration: 250,
    }

    let particleEffects = [];
    let particleEffectGraphics = [];

    //Game graphics members
    let menuGraphic = graphics.Menu(menu);
    //let highScores = graphics.HighScores(Top5);
    let credits = graphics.Letters(creditText);
    let highScores = graphics.Letters(highScoreText);
    let menuBack = graphics.Background(menuBackground);

    let back = graphics.Background(background);
    let brickLevel = graphics.BrickLevel(level);
    let paddleGraphic = graphics.Paddle(paddle);
    let ballGraphic = graphics.Ball(ball);
    let levelTracker = graphics.Letters(levelTrack);
    let gameScoreDisplay = graphics.Letters(gameScore);
    let livesDisplay = graphics.Letters(livesObj);
    let countDownGraphic = graphics.Letters(countDown);

    //Building collision test groups by brick column
    // let testGroups = [];
    // for (let j=0; j < gameWidthInBricks; ++j){
    //     let columnj = []
    //     for (let i=0; i < gameHeightInBricks; ++i){
    //         columnj.push(level[i]);
    //     }
    // }

    let updateTop5Graphics = function(){
        top5Graphics.length = 0;
        for (let i=0; i<top5.length; ++i){
            top5Graphics.push(graphics.Letters({
                text: '' + (i + 1) + '. ' + top5[i],
                font: '5em Courier', 
                fill: true, 
                fillStyle: colorList[2].fill, 
                align: 'left', 
                baseline: 'top',
                x: CANVASWIDTH/2 - 180,
                y: 200 + 150*i 
            }));
        }
    }

    updateTop5Graphics();

    let drawGame = function(){
        graphics.clear();
        back.draw();
        brickLevel.draw();
        paddleGraphic.draw();
        ballGraphic.draw();
        levelTracker.draw();
        gameScoreDisplay.draw();
        livesDisplay.draw();
        countDownGraphic.draw();
        for (let i=0; i<particleEffectGraphics.length; ++i){
            console.log(particleEffectGraphics[i]);
            particleEffectGraphics[i].draw(particleEffects[i].particles);    
        }
        //TODO
        //border.draw
    }
    
    let drawMenu = function(){
        graphics.clear();
        menuGraphic.draw();
    }

    let drawCredits = function(){
        graphics.clear();
        menuBack.draw();
        credits.draw();
    }

    let drawHighScores = function(){
        graphics.clear();
        menuBack.draw();
        highScores.draw();
        for (let i=0; i<top5Graphics.length; ++i){
            top5Graphics[i].draw();
        }
    }

    //START - beginning draw
    that.drawGame = drawMenu;

    let countDownUpdate = function(elapsedTime){
        countDown.time += elapsedTime;
        if (countDown.time < 1000){
            countDown.text = '3';
        }
        else if (countDown.time < 2000){
            countDown.text = '2';
        }
        else if (countDown.time < 3000){
            countDown.text = '1';
        }else{
            countDown.text = '';
            countDown.time = 0;
            that.updateGame = gameModelUpdate;
        }
    }
    
    let menuUpdate = function(elapsedTime){

    }
    
    let gameModelUpdate = function(elapsedTime){
        updateBall(elapsedTime);
        updateCollisions();
        for (let i=0; i<particleEffects.length; ++i){
            particleEffects[i].update(elapsedTime);    
        }
    }
    
    //START - beginning update
    that.updateGame = menuUpdate;
    
    function detectCollisionWithBrick(){
        let didHitBrick = false;
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
                    score += brickList[i].points;
                    //Explode brick
                    particleEffects.push(particleSystem.ExplosionEffect({
                        x: CANVASWIDTH/2,
                        y: CANVASHEIGHT/2,
                        particlesPerMS: .1,
                        fill: 'rgba(100,100,100,1)',
                        stroke: 'rgba(0,0,0,0)',
                        maxRotation: .25,
                        lifetime: {mean: 1000, std: 150},
                        speed: {mean: .1, std: .05},
                        size: {mean: 6, std: 2},
                        duration: 250,
                    }));
                    particleEffectGraphics.push(graphics.Particles(particleEffects[particleEffects.length-1].particles));

                    brickList.splice(i,1);
                    level.rectangleList.splice(i,1);
                    didHitBrick = true;
                    gameScore.text = 'Score: ' + score;
                    //Checking how to reflect the ball after hitting a brick
                    if (brickY1 > ballY1 || brickY2 < ballY2){
                        ball.yRate *= -1;
                    }else{
                        ball.xRate *= -1;
                    }
                }
            }
        }
        return didHitBrick;
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
        paddle.width = 2;
        paddle.height = .4;
        paddleGraphic = graphics.Paddle(paddle);
    }

    function newGame(){
        //New Game
        restartBall();
        restartPaddle();
        level = breakerMaker.generateLevel(gameWidthInBricks0, gameHeightInBricks0, colorList);
        level.gapAbove = gapAbove;
        brickLevel = graphics.BrickLevel(level);
        lives = 3;
        livesObj.text = 'Lives: ' + lives;
        levelCount = 1;
        score = 0;
        gameScore.text = "Score: " + score;
        that.drawGame = drawGame;
        that.updateGame = countDownUpdate;
        console.log('New Game Starting');
    }

    function nextLevel(){
        score += 37*lives;
        gameScore.text = "Score: " + score;
        lives = 3;
        livesObj.text = "Lives: " + lives;
        ++levelCount;
        levelTrack.text = "Level " + levelCount;
        score += 100;
        restartBall();
        restartPaddle();
        gameWidthInBricks += 3;
        gameHeightInBricks += 1;
        brickUnit = CANVASWIDTH/gameWidthInBricks;
        level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
        level.gapAbove = gapAbove;
        brickLevel = graphics.BrickLevel(level);
        that.updateGame = countDownUpdate;
        console.log('Level ' + levelCount );
    }

    function updateCollisions(){
        if (ball.centerY < gapAbove + 2/5 * brickUnit * (gameHeightInBricks + 1) + ball.radius){
            if (detectCollisionWithBrick()){ 
                if (level.brickList.length === 0){
                    nextLevel();
                }
            }
        }else if (ball.centerY > CANVASWIDTH - paddle.gapBelowPaddle - paddle.width*brickUnit){
            detectCollisionWithPaddle();
        }
        if (!detectCollisionWithWall()){
            --lives;
            livesObj.text = "Lives: " + lives;
            that.updateGame = countDownUpdate;
            if (lives <= 0){
                top5.push(score);
                top5.sort(function(a,b){return b-a;})
                top5.splice(5, 1);
                for (let i=0; i<top5.length; ++i){
                    MyGame.persistence.remove(i);
                    MyGame.persistence.add(i, top5[i]);
                }
                top5 = MyGame.persistence.retrieveHighScores();
                updateTop5Graphics();
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
                that.drawGame = drawHighScores;
                lives = -1;
            }else if (buttonId === 3){
                that.drawGame = drawCredits;
                lives = -1;
            }
        }
        else if (lives === -1){
            that.drawGame = drawMenu;
            lives = 0;
        }
    }

    that.escape = function(){
        lives = 0;
        that.gameUpdate = menuUpdate;
        that.drawGame = drawMenu;
    }

    return that;
};