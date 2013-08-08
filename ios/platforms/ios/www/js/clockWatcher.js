/**
 * clockWatcher - clock timing script
 */

(function(document) {
    
    var $target = $('time'),
        $timeTarget = $('#test'),
        $tarAttr = $('time').attr('datetime'),
        time,
        lastTimeChange,
        pollingChanged;

    window.clockWatcher = window.clockWatcher || {};

    window.requestAnimFrame = (function() {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
        
                function( callback ) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();

    console.log("ClockWatcher running");

    clockWatcher.log = function() {
        if(clockWatcher.debug) {
            console.log.apply(console, arguments);
        }
    };

    clockWatcher.init = function(format, debug) { 

        // cache
        clockWatcher.format = format;
        clockWatcher.lastPoll = new Date().getTime();
        clockWatcher.debug = !!debug;

        // collect current time from server
        clockWatcher.ajaxRequest();

        // start draw cycle
        clockWatcher.draw();
    };

    clockWatcher.draw = function() {

        var currentTime = new Date().getTime();

        if((currentTime - clockWatcher.lastPoll) > 5000) {
            clockWatcher.log("ajax", currentTime);
            clockWatcher.ajaxRequest();
            clockWatcher.lastPoll = currentTime;
        }

        requestAnimFrame(clockWatcher.draw);
    };

    clockWatcher.ajaxRequest = function() {
        $.ajax({
            url: "/time",
            success: clockWatcher.processResponse
        });
    };

    clockWatcher.processResponse = function(data) {
        clockWatcher.log(data);
        var items = data.split('|');
        
        clockWatcher.displayTime(items[0]);
        clockWatcher.playAudio(items[1]);
    };

    clockWatcher.displayTime = function(timeString) {
        var time;
        switch(clockWatcher.format) {
        case "HH":
            time = timeString.split(":")[0];
            break;
        case "mm":
            time = timeString.split(":")[1];
            break;
        default:
            time = timeString;
        }
        $target.html(time);
    };

    clockWatcher.playAudio = function(audio) {
        var player = $('#audioPlayer'),
            playerSource = $('#audioPlayer source');

        playerSource[0].src = audio;
        player[0].load();
    };

})(document);