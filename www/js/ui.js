var barbican = window.barbican || {};

barbican.ui = (function () {

	var ctas = $('.cta_collection a').on('click', onClickHandler);

	var onClickHandler = function (event) {
		
	};

})();

$(function () {

	barbican.sound = function () {

		var equaliser = document.querySelector('.soundPlaying img');
		var defaultState = equaliser.src;



		var onAudioHandler = function (event) {
			if (event.type === 'play') {
				equaliser.src = 
			}
		};

		$('#audioPlayer').on('loadstart play', function (event) {
			console.log(event);
		});
	}

	barbican.sound();

});