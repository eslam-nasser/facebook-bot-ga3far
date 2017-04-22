module.exports = {
    // get random value from an array
    getRandomFromArray: function(arr){
        return arr[Math.floor(Math.random()*arr.length)]
    },
    // get random image size
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // is this single word is in array?
    arrayContains: function(needle, arrhaystack){
        var ret = false;
        needle.split(' ').map(item => {
            if(arrhaystack.indexOf(item) > -1){ret = true}
        })
        return ret;
    }
}