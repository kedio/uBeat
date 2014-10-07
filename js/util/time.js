/**
 * Created by dominique on 06/10/14.
 */
function Time(timeInMilli){
    var timeInMilli = timeInMilli;

    this.format = function(){
            var timeInSecond = Math.round(timeInMilli/1000);
            return Math.floor(timeInSecond / 60) + ": " + pad(timeInSecond % 60,2);
    }

    var pad = function(str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
    }
}