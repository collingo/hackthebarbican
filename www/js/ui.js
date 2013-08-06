var barbican = window.barbican || {};

barbican.ui = (function () {

	var ctas = $('.cta_collection a');
	var close = $('.close');
	var selectedClass = 'selected';

	var onClickHandler = function (event) {
			
		var target = $(this).attr('href');

		$('.section').removeClass(selectedClass);
		$(target).addClass(selectedClass);

		if (target.match(/home/)) {
			$('.footer').show();
		} else {
			$('.footer').hide();
		}

		event.preventDefault();
	};

	ctas.on('click', onClickHandler);
	close.on('click', onClickHandler);

})();

$(function () {

	barbican.sound = function () {

		var equaliser = document.querySelector('.soundPlaying img');
		var defaultState = equaliser.src;



		var onAudioHandler = function (event) {
			if (event.type === 'play') {
				//equaliser.src = 
			}
		};

		$('#audioPlayer').on('loadstart play', function (event) {
			console.log(event);
		});
	}

	barbican.sound();

});