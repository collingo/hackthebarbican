/**
 * clockWatcher - clock timing script
 */

(function(document) {
    
    var $target = $('time'),
        $timeTarget = $('#test'),
        $tarAttr = $('time').attr('datetime'),
        time,
        lastTimeChange;

    window.clockWatcher = window.clockWatcher || {};

    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
        
                function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    clockWatcher.init = function(){            
        
        clockWatcher.setTime();

        clockWatcher.lastChanged();
        clockWatcher.displayTime();

        clockWatcher.draw($target);
    };

    clockWatcher.lastChanged = function(){
        lastTimeChange = time;
    };

    clockWatcher.setTime = function(){
        time = new Date().getTime();
    };

    clockWatcher.displayTime = function(){
        var displayTime = moment().format("HH:mm:ss");

        $target.html(displayTime);

    };

    clockWatcher.checkTimeDiff = function(){
        if((time - lastTimeChange) > 1000){
            
            clockWatcher.displayTime();

            clockWatcher.lastChanged();
        }
    };

    clockWatcher.draw = function(){
        requestAnimationFrame(clockWatcher.draw);

        clockWatcher.setTime();

        clockWatcher.checkTimeDiff();
    };


})(document);