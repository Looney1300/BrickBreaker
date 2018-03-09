MyGame.persistence = (function () {
    'use strict';
    
    var highScores = {},
    previousScores = localStorage.getItem('MyGame.highScores');

    if (previousScores !== null) {
        highScores = JSON.parse(previousScores);
    }

    function add(key, value) {
        highScores[key] = value;
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }

    function remove(key) {
        delete highScores[key];
        localStorage['MyGame.highScores'] = JSON.stringify(highScores);
    }

    function retrieveHighScores() {   
        let highs = [];     
        for (let value in highScores){
            highs.push(Number(highScores[value]));
        }
        return highs;
    }

    return {
        add : add,
        remove : remove,
        retrieveHighScores : retrieveHighScores
    };
}());