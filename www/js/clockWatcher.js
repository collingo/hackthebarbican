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
    var clockWatcher = window.clockWatcher;

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

    clockWatcher.log = function() {
        if(clockWatcher.debug) {
            console.log.apply(console, arguments);
        }
    };

    clockWatcher.init = function(format, debug) {

        clockWatcher.log("ClockWatcher running");

        // cache
        clockWatcher.format = format;
        clockWatcher.lastPoll = new Date().getTime();
        clockWatcher.debug = !!debug;

        $.ajax({
            url: "/time",
            success: function(data) {
                clockWatcher.processResponse(data);
                clockWatcher.delay = (60 - parseInt(data.split('|')[0].split(':')[2], 10)) * 1000;
                clockWatcher.draw();
            }
        });
    };

    clockWatcher.draw = function() {

        var currentTime = new Date().getTime();

        if((currentTime - clockWatcher.lastPoll) > clockWatcher.delay) {
            clockWatcher.log("ajax", currentTime);
            clockWatcher.ajaxRequest();
            clockWatcher.lastPoll = currentTime;
            clockWatcher.delay = 60000;
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
        if(items[4]) {
            $('body').addClass('glitchBackground');
            $('time').addClass('glitchText');
        } else {
            $('body').removeClass('glitchBackground');
            $('time').removeClass('glitchText');
        }
    };

    clockWatcher.displayTime = function(timeString) {
        var time;
        
        console.log(time);
        switch(clockWatcher.format) {
        case "HH":
            time = timeString.split(":")[0];
            break;
        case "mm":
            time = timeString.split(":")[1];
            break;
        default:
            time = timeString.split(":")[0]+":"+timeString.split(":")[1];
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