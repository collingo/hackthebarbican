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
        clockWatcher.pollingChange();
        clockWatcher.draw($target);
    };

    clockWatcher.lastChanged = function(){
        lastTimeChange = time;
    };

    clockWatcher.pollingChange = function(){
        pollingChanged = time;
    };

    clockWatcher.setTime = function(){
        time = new Date().getTime();
    };

    clockWatcher.displayTime = function(){
        var displayTime = moment().format("HH:mm:ss");

        $target.html(displayTime);
    };

    clockWatcher.playAudio = function(audio){
        var player = $('#audioPlayer'),
            playerSource = $('#audioPlayer source');
            console.log(player, playerSource);
        
        playerSource[0].src = audio;

        player[0].load();
    };

    clockWatcher.splitResponse = function(data){
        var items = data.split('|');
        
        clockWatcher.playAudio(items[1]);

        $('.content p').html('<h5> the current response from the server is '+data+'</h5>');
    
    };

    clockWatcher.ajaxRequest = function(){
        $.ajax({
            url: "/time",
            success: function(data) {
                clockWatcher.splitResponse(data);
            }

        });
    };

    clockWatcher.polling = function(){
        if((time - pollingChanged) > 30000){
            var testDisplay = moment().format("HH:mm:ss");
            
            clockWatcher.ajaxRequest();

            clockWatcher.pollingChange();
        }
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

        clockWatcher.polling();
        
        clockWatcher.checkTimeDiff();
    };


})(document);