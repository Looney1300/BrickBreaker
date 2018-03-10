MyGame.gameModel = function(gameSpecs){
    let that = {};
    //Unpacking gameSpecs
    let paddle = gameSpecs.paddle;
    paddle.width0 = paddle.width;
    paddle.height0 = paddle.height;
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
    let countDownMode = true;
    
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
        font: '2em New-Courier', 
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
        font: '2em New-Courier', 
        fillStyle: 'rgba(220, 220, 220, .2)', 
        fill: true, 
        stroke: true, 
        strokeStyle: 'rgba(255, 255, 255, 1)', 
        align: 'right', 
        baseline: 'bottom',
        x: 300,
        y: CANVASHEIGHT - 5
    };

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
    
    let particleEffects = [];
    let particleEffectGraphics = [];
    let ballList = [ball];
    
    //Game graphics members
    let menuGraphic = graphics.Menu(menu);
    let credits = graphics.Letters(creditText);
    let highScores = graphics.Letters(highScoreText);
    let menuBack = graphics.Background(menuBackground);
    
    let back = graphics.Background(background);
    let brickLevel = graphics.BrickLevel(level);
    let paddleGraphic = graphics.Paddle(paddle);
    let ballGraphic = graphics.Ball(ball, paddle);
    let levelTracker = graphics.Letters(levelTrack);
    let gameScoreDisplay = graphics.Letters(gameScore);
    let countDownGraphic = graphics.Letters(countDown);
    let ballGraphicsList = [ballGraphic];
    let livesGraphicsList = [];

    //Building collision test groups by brick column
    // let testGroups = [];
    // for (let j=0; j < gameWidthInBricks; ++j){
    //     let columnj = []
    //     for (let i=0; i < gameHeightInBricks; ++i){
    //         columnj.push(level[i]);
    //     }
    // }

    let restartLives = function(){
        for (let i=0; i<3; ++i){
            livesGraphicsList.push(graphics.Rectangle({
                rotation: 0,
                x: CANVASWIDTH - (i+1)*100, 
                y: CANVASHEIGHT - 30,
                width: CANVASWIDTH/20,
                height: CANVASHEIGHT/80,
                fillStyle: paddle.fillStyle,
                strokeStyle: paddle.strokeStyle
            }));
        }
    }

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
        levelTracker.draw();
        gameScoreDisplay.draw();
        for (let i=0; i<livesGraphicsList.length; ++i){
            livesGraphicsList[i].draw();
        }
        for (let i=0; i<ballGraphicsList.length; ++i){
            ballGraphicsList[i].draw();
        }
        for (let i=0; i<particleEffectGraphics.length; ++i){
            particleEffectGraphics[i].draw(particleEffects[i].particles);    
        }
        countDownGraphic.draw();
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
            countDownMode = false;
        }
    }
    
    let menuUpdate = function(elapsedTime){ }
    
    let gameModelUpdate = function(elapsedTime){
        updateBalls(elapsedTime);
        updateCollisions();
        for (let i=0; i<particleEffects.length; ++i){
            if (!particleEffects[i].update(elapsedTime)){
                particleEffects.splice(i,1);
                particleEffectGraphics.splice(i,1);
            }
        }
    }
    
    //START - beginning update
    that.updateGame = menuUpdate;
    
    function detectCollisionWithBrick(ball1){
        let didHitBrick = false;
        let brickList = level.brickList;
        for (let i = (brickList.length-1); i >= 0; --i){
            brickX1 = brickUnit * brickList[i].x;
            brickY1 = 2/5 * brickUnit * brickList[i].y + gapAbove;
            brickX2 = brickUnit * (brickList[i].x + 1)
            brickY2 = 2/5 * brickUnit * (brickList[i].y + 1) + gapAbove;
            ballX1 = ball1.centerX - ball1.radius;
            ballY1 = ball1.centerY - ball1.radius;
            ballX2 = ball1.centerX + ball1.radius;
            ballY2 = ball1.centerY + ball1.radius;

            if (brickX1 < ballX2 && brickX2 > ballX1){
                if (brickY1 < ballY2 && brickY2 > ballY1){
                    console.log('detected brick collision');
                    score += brickList[i].points;
                    //Explode brick
                    particleEffects.push(particleSystem.AreaDissolveEffect({
                        x: (brickList[i].x + .1) * brickUnit,
                        y: (brickList[i].y - .2) * 2/5 * brickUnit + gapAbove,
                        xMax: (brickList[i].x + .5 + .3) * brickUnit,
                        yMax: (brickList[i].y + .5 - .2) * 2/5 * brickUnit + gapAbove,
                        numParticles: 80,
                        particlesPerMS: .1,
                        fill: brickList[i].fillStyle,
                        stroke: 'rgba(0,0,0,0)',
                        maxRotation: .1,
                        lifetime: {mean: 700, std: 100},
                        speed: {mean: .05, std: .01},
                        size: {mean: 9, std: 3},
                        gravity: 7,
                        duration: 100,
                    }));
                    particleEffectGraphics.push(graphics.Particles(particleEffects[particleEffects.length-1].particles));

                    brickList.splice(i,1);
                    level.rectangleList.splice(i,1);
                    didHitBrick = true;
                    gameScore.text = 'Score: ' + score;
                    //Checking how to reflect the ball after hitting a brick
                    if (brickY1 > ballY1 || brickY2 < ballY2){
                        ball1.yRate *= -1;
                    }else{
                        ball1.xRate *= -1;
                    }
                }
            }
        }
        return didHitBrick;
    }

    function detectCollisionWithPaddle(ball1){
        paddleCenterX = paddle.x + 1/2 * paddle.width;
        paddleX1 = paddle.x;
        paddleY1 = paddle.y;
        paddleX2 = paddle.x + paddle.width;
        paddleY2 = paddle.y + paddle.height;
        ballX1 = ball1.centerX - ball1.radius;
        ballY1 = ball1.centerY - ball1.radius;
        ballX2 = ball1.centerX + ball1.radius;
        ballY2 = ball1.centerY + ball1.radius;

        if (paddleX1 < ballX2 && paddleX2 > ballX1){
            if (paddleY1 < ballY2 && paddleY2 > ballY1){
                let weight = 2 * (paddleCenterX - ball1.centerX)/(paddle.width);
                ball1.xRate += paddle.reflectance * weight * ball1.rate * -1;
                ball1.yRate *= -1;
            }
        }
    }

    function detectCollisionWithWall(ball1){
        if (ball1.centerX - ball1.radius <= 0 && ball1.xRate < 0){
            ball1.xRate *= -1;
        }
        else if (ball1.centerX + ball1.radius >= CANVASWIDTH && ball1.xRate > 0){
            ball1.xRate *= -1;
        }
        if (ball1.centerY - ball1.radius <= 0 && ball1.yRate < 0){
            ball1.yRate *= -1;
        }
        if (ball1.centerY + ball1.radius >= CANVASHEIGHT + 8*brickUnit){
            //Uncomment to create a floor.
            //ball1.yRate *= -1;
            return false;
        }
        return true;
    }

    function restartBall(){
        ball.xRate = ball.xRate0;
        ball.yRate = ball.yRate0;
        ballGraphic = graphics.Ball(ball, paddle);
        ball.centerX = paddle.x + paddle.width/2;
    }

    function restartPaddle(){
        paddle.x = paddle.x0;
        paddle.width = paddle.width0;
        paddle.height = paddle.height0;
        paddleGraphic = graphics.Paddle(paddle);
    }

    function newGame(){
        restartPaddle();
        restartBall(ball, paddle);
        level = breakerMaker.generateLevel(gameWidthInBricks0, gameHeightInBricks0, colorList);
        level.gapAbove = gapAbove;
        brickLevel = graphics.BrickLevel(level);
        lives = 3;
        restartLives();
        levelCount = 1;
        score = 0;
        gameScore.text = "Score: " + score;
        that.drawGame = drawGame;
        that.updateGame = countDownUpdate;
        countDownMode = true;
        console.log('New Game Starting');
    }

    function nextLevel(){
        particleEffectGraphics.length = 0;
        particleEffects.length = 0;
        ball.x = 1.5*CANVASWIDTH
        score += 37*lives;
        gameScore.text = "Score: " + score;
        lives = 3;
        restartLives();
        ++levelCount;
        levelTrack.text = "Level " + levelCount;
        score += 100;
        restartPaddle();
        restartBall(ball, paddle);
        gameWidthInBricks += 3;
        gameHeightInBricks += 1;
        brickUnit = CANVASWIDTH/gameWidthInBricks;
        level = breakerMaker.generateLevel(gameWidthInBricks, gameHeightInBricks, colorList);
        level.gapAbove = gapAbove;
        brickLevel = graphics.BrickLevel(level);
        that.updateGame = countDownUpdate;
        countDownMode = true;
        console.log('Level ' + levelCount );
    }

    function updateCollisions(){
        for (let i=0; i<ballList.length; ++i){
            if (ballList[i].centerY < gapAbove + 2/5 * brickUnit * (gameHeightInBricks + 1) + ballList[i].radius){
                if (detectCollisionWithBrick(ballList[i])){ 
                    if (level.brickList.length === 0){
                        nextLevel();
                    }
                }
            }else if (ballList[i].centerY > CANVASWIDTH - paddle.gapBelowPaddle - paddle.width*brickUnit){
                detectCollisionWithPaddle(ballList[i]);
            }
            if (!detectCollisionWithWall(ballList[i])){
                if (ballList.length === 1){
                    --lives;
                    livesGraphicsList.pop();
                    restartBall(ball, paddle);
                    that.updateGame = countDownUpdate;
                    countDownMode = true;
                    if (lives <= 0){
                        top5.push(score);
                        top5.sort(function(a,b){return b-a;})
                        top5.splice(5, 1);
                        for (let x=0; x<top5.length; ++x){
                            MyGame.persistence.remove(x);
                            MyGame.persistence.add(x, top5[x]);
                        }
                        top5 = MyGame.persistence.retrieveHighScores();
                        updateTop5Graphics();
                        that.updateGame = menuUpdate;
                        that.drawGame = drawMenu;
                    }
                }else{
                    ballList.splice(i,1);
                    ballGraphicsList.splice(i,1);
                }
            }
        }
    }
    
    function updateBalls(elapsedTime){
        for (let i=0; i<ballList.length; ++i){
            ballList[i].centerX += ballList[i].xRate * elapsedTime/1000;
            ballList[i].centerY += ballList[i].yRate * elapsedTime/1000;
        }
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
            if (countDownMode){
                ball.centerX += elapsedTime/1000 * paddle.rate;
            }
        }
    }
    
    that.movePaddleLeft = function(elapsedTime){
        if (isInLeftBound(paddle)){
            paddle.x -= elapsedTime/1000 * paddle.rate;
            if (countDownMode){
                ball.centerX -= elapsedTime/1000 * paddle.rate;
            }
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