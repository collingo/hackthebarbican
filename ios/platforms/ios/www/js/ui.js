var barbican = window.barbican || {};

barbican.ui = function () {

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
};

barbican.sound = function () {
	var audioPlayer = document.querySelector('#audioPlayer');
	var equaliser = document.querySelector('.soundPlaying img');
	var defaultState = equaliser.src;

	var onAudioHandler = function (event) {
		if (event.type === 'play') {
			equaliser.src = equaliser.dataset.playingSrc;
		} else {
			equaliser.src = defaultState;
		}
	};

	audioPlayer.addEventListener('loadstart', onAudioHandler, false);
	audioPlayer.addEventListener('play', onAudioHandler, false);
	audioPlayer.addEventListener('ended', onAudioHandler, false);
};

var init = function () {
	barbican.ui();
	barbican.sound();
};

document.addEventListener('DOMContentLoaded', init, false);