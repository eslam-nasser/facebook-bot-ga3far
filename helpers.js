module.exports = {
    // get random value from an array
    getRandomFromArray: function(arr){
        return arr[Math.floor(Math.random()*arr.length)]
    },
    // get random image size
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}