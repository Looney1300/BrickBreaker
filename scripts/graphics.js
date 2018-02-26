/*
MyGame.graphics is an immediately invoked function with the following sub-functions
  clear()
  Texture(spec)
*/
MyGame.graphics = (function(){
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d');

    function clear(){
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        //What does this do?
        context.restore();
    }

    /*Rectangle expects a spec with
        rotation
        x
        width
        y
        height
        fillStyle
        strokeStyle
    */
    function Rectangle(spec){
        let that = {};

        that.updateRotation = function(angle){
            spec.rotation += angle;
        };

        that.draw = function(){
            //Rotating a shape
            //1. Translate (0,0) of canvas to center of shape
            context.save();
            context.translate(spec.x + spec.width/2, spec.y + spec.height/2);
            //2. Rotate canvas
            context.rotate(spec.rotation);
            context.translate(-(spec.x + spec.width/2), -(spec.y + spec.height/2));
            //3. Draw shape at original coordinates
            context.fillStyle = spec.fillStyle;
            context.fillRect(spec.x, spec.y, spec.width, spec.height);
            context.strokeStyle = spec.strokeStyle;
            context.strokeRect(spec.x, spec.y, spec.width, spec.height);
            //4. Undo translations and rotations of canvas.
            context.restore();
        };

        return that;
    }

    /*
    Texture function passed spec property expects
      spec.imageSrc
      spec.rotation
      spec.center.x
      spec.center.y
      spec.width
      spec.height
     Texture function 'has' the following properties
      .draw
    */
    function Texture(spec){
        let that = {},
            ready = false,
            image = new Image();
        
        image.onload = function(){
            ready = true;
        };
        image.src = spec.imageSrc;
        that.updateRotation = function(angle){
            spec.rotation += angle;
        };

        that.draw = function(spec1){
            if (ready){                
                context.save();
                context.translate(spec1.center.x, spec1.center.y);
                context.rotate(spec1.rotation);
                context.translate(-spec1.center.x, -spec1.center.y);

                context.drawImage(
                    image,
                    spec1.center.x - spec1.width/2,
                    spec1.center.y -spec1.height/2,
                    spec1.width, spec1.height);

                context.restore();   
            }
        };

        return that;
    }

    /*
    Line function is passed a lineList object that has: 
      maxX 
      maxY
      lineList list of {x,y} pairs
     Each pair represents the start and end of a line.
     max x,y are used for calculating the scale on the canvas. 
     It assumes the associated coordinate system is meant to 
     scale the entire canvas, centered on the canvas.
    */
    function Lines(lines){
        let w;
        lines.maxX > lines.maxY ? w = lines.maxX : w = lines.maxY;
        context.beginPath();
        for(let i=0; i < lines.lineList.length; i+=2){
            context.moveTo(lines.lineList[i].x*(canvas.width/w), lines.lineList[i].y*(canvas.height/w));
            context.lineTo(lines.lineList[i+1].x*(canvas.width/w), lines.lineList[i+1].y*(canvas.height/w));
        }
        context.stroke();
        context.closePath();
    }

    /*
    Rectangles is a shorthand way to generate a list of Rectangle's, and a draw function that draws all the given rectangles.
    */
    function Rectangles(rectangles){
        let that = {};
        let rects = [];
        for (let i=0; i < rectangles.length; ++i){
            rects.push(Rectangle(rectangles[i]));
        }
        that.draw = function(){
            for (let i=0; i < rectangles.length; ++i){
                rects[i].draw();
            }
        };
        return that;
    }

    //TODO: make a curvy line drawer.
    function Curves(curveList){ }

    /*
    BrickBox function is passed a level object with the following:
      width
      height
      brickList
     It uses the Rectangle to draw the bricks in the level, centered on the level section of the canvas.
     Bricks are assumed to have a width/height ratio of 5/2, and is calculated from the brickWidth given.
    */
    function BrickLevel(level){
        let that = {};
        //Build rectange spec List
        function buildRectangleList(newBrickBox){
            let rectangleList = [];
            let brickUnit = canvas.width/newBrickBox.width;
            for (let i = 0; i < newBrickBox.brickList.length; ++i){
                    //Give the necessary components to the Rectangle function.
                    rectangleList.push({
                        x: newBrickBox.brickList[i].x * brickUnit,
                        y: newBrickBox.brickList[i].y * 2/5 * brickUnit,
                        width: brickUnit,
                        height: 2/5 * brickUnit,
                        rotation: newBrickBox.brickList[i].rotation,
                        fillStyle: newBrickBox.brickList[i].fillStyle,
                        strokeStyle: newBrickBox.brickList[i].strokeStyle
                    });
            }
            return rectangleList;
        }

        that.draw = function(){
            let rs = Rectangles(buildRectangleList(level));
            rs.draw();
        };
        return that;
    }

    function assetToTextureSpec(character, maze){
        let texture = {
            imageSrc: character.src,
            rotation: character.direction*3.14159/2,
            center: mazeToCanvasCoordinates(maze, {x: character.location.x + 0.5, y: character.location.y + 0.5}),
            width: mazeCellWidthUnitsToCanvasUnits(maze, 1),
            height: mazeCellHeightUnitsToCanvasUnits(maze, 1)
        };
        return texture;
    }

    
    return {
        clear: clear,
        Rectangle: Rectangle,
        Texture: Texture,
        Lines: Lines,
        BrickLevel: BrickLevel,
        assetToTextureSpec: assetToTextureSpec
    };

}());