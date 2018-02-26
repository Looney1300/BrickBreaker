MyGame.breakerMaker = (function(){
    
    //We need a level generator function.
    function generateLevel(widthInBricks, heightInBricks, colorList){

        function brickListGenerator(){
            let brickList = [];
            for (let x=0; x < widthInBricks; ++x){
                for (let y=0; y < heightInBricks; ++y){
                    let r = Math.round((Math.random()*1000)) % colorList.length;
                    brickList.push({
                        rotation: 0,
                        x: x,
                        y: y,
                        fillStyle: colorList[r%colorList.length].fill,
                        strokeStyle: colorList[r%colorList.length].stroke
                    });
                }
            }
            return brickList;
        }

        let brickList = brickListGenerator();

        let level = {
            width: widthInBricks,
            height: heightInBricks,
            brickList: brickList
        }

        return level;
    }

    return {
        generateLevel: generateLevel
    };

})();