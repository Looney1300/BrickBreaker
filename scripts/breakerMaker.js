MyGame.breakerMaker = (function(){
    
    function generateLevel(widthInBricks, heightInBricks, colorList){

        function pointGenerator(i){
            switch (i){
                case 0: return 5;
                case 1: return 3;
                case 2: return 2;
                case 3: return 1;
                default: return 0;
            }
        }

        function brickListGenerator(){
            let brickList = [];
            for (let x=0; x < widthInBricks; ++x){
                for (let y=0; y < heightInBricks; ++y){
                    //let r = Math.round((Math.random()*1000)) % colorList.length;
                    brickList.push({
                        rotation: 0,
                        x: x,
                        y: y,
                        fillStyle: colorList[Math.floor(y/2)%colorList.length].fill,
                        strokeStyle: colorList[Math.floor(y/2)%colorList.length].stroke,
                        // fillStyle: colorList[r%colorList.length].fill,
                        // strokeStyle: colorList[r%colorList.length].stroke,
                        points: pointGenerator(Math.floor(y/2)%colorList.length)
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