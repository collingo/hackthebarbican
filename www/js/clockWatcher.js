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

    clockWatcher.showImage = function(string){
        var image = $('.image_holder');
        
        image[0].src = string;
    };

    clockWatcher.playAudio = function(audio){
        var player = $('#audioPlayer'),
            playerSource = $('#audioPlayer source');

        playerSource[0].src = audio;
        player[0].load();
    };

    clockWatcher.pullContent = function(jsonUrl){
        $.ajax({
            url: jsonUrl,
            dataType: 'json',
            success: function(data) {
                $('.content p').html(data.copy);
            }

        });
    };

    clockWatcher.splitResponse = function(data){
        var items = data.split('|');
        
        // if(items.length > 1){
        //     clockWatcher.playAudio(items[1]);
        //     clockWatcher.showImage(items[2]);
        //     clockWatcher.pullContent(items[3]);
        // }else{
            clockWatcher.playAudio(items[1]);
        // }
    };

    clockWatcher.ajaxRequest = function(){
        $.ajax({
            url: "/time",
            success: function(data) {
                clockWatcher.splitResponse(data);
                console.log(data);
            }

        });
    };

    clockWatcher.polling = function(){
        if((time - pollingChanged) > 10000){
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