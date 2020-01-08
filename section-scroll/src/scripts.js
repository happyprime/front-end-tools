( ( root, factory ) => {
	if ( typeof define === 'function' && define.amd ) {
		define( ['wheel-indicator'], factory );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory( require( 'wheel-indicator' ) );
	} else {
		root.sectionScroll = factory( root.WheelIndicator );
	}
} )( typeof self !== 'undefined' ? self : this, ( WheelIndicator ) => {

	'use strict';

	// Object for public APIs.
	const sectionScroll = {};

	// Default settings.
	const defaults = {
		scrollableSection: document.querySelector( '.scrolling-sections' ),
		transitionDuration: '1s',
		transitionTimingFunction: 'ease'
	};

	// Object for keeping track of where the user is in a scrollable section.
	const state = {
		articles: null,
		container: null,
		index: 0,
		touchEndY: 0,
		touchStartY: 0,
		wheelHandler: null
	};

	// Placeholder for defaults merged with user settings.
	let settings;

	/**
	 * Merges user options with the default settings.
	 * @private
	 * @param {Object} defaults Default settings.
	 * @param {Object} options  User settings.
	 */
	const extendDefaults = ( defaults, options ) => {

		let property;

		for ( property in options ) {
			if ( Object.prototype.hasOwnProperty.call( options, property ) ) {
				defaults[ property ] = options[ property ];
			}
		}

		return defaults;

	};

	/**
	 * Determines if the scrollable section is at the top of the viewport.
	 * @private
	 */
	const sectionInViewport = () => {

		const sectionBounds = settings.scrollableSection.getBoundingClientRect();

		return sectionBounds.top === 0;

	};

	/**
	 * Attempts to find full-height scrollable articles,
	 * and set inline styles required for the animation.
	 * @private
	 */
	const getArticles = () => {

		if ( !settings.scrollableSection ) return;

		const articles = settings.scrollableSection.querySelectorAll( 'article' );

		if ( !articles ) return;

		state.articles = articles;

		settings.scrollableSection.style.height = '100vh';

		state.container = settings.scrollableSection.querySelector( 'div' );

		state.container.style.transitionTimingFunction = settings.transitionTimingFunction;

		state.container.style.transitionDuration = settings.transitionDuration;

		if ( sectionInViewport() ) {
			document.body.classList.add( 'scroll-lock' );
		} else {
			state.index = state.articles.length;

			scrollSection();
		}

	};

	/**
	 * Animates the section scrolling using `transform: translate3d()`,
	 * which leverages hardware acceleration for better performance.
	 * @private
	 * @param {String} direction
	 */
	const scrollSection = ( direction ) => {

		// Return early if scrolling up and already on the first section.
		if ( 'up' === direction && state.index <= 0 ) return;

		// Return early if scrolling down and already on the last section.
		if ( 'down' === direction && state.index + 1 >= state.articles.length ) {

			// Return now if there is no content after the Scrolling Sections block.
			if ( !settings.scrollableSection.nextElementSibling ) return;

			// If there is content after the Scrolling Sections block,
			// remove the `scroll-lock` class from the body and disable
			// `WheelIndicator` before returning.
			document.body.classList.remove( 'scroll-lock' );
			state.wheelHandler.turnOff();

			return;
		}

		// Increment the index accordingly, then animate using inline styles.
		const index = ( 'down' === direction )
			? state.index + 1
			: state.index - 1;

		const value = `translate3d(0px, -${ index * window.innerHeight }px, 0px)`;

		state.container.style.transform = value;

		state.index = index;

	};

	/**
	 * Handles scrolling via the up and down arrow and space keys.
	 * @private
	 * @param {Event} event The keydown event.
	 */
	const keyDownHandler = ( event ) => {

		const keys = [ 'ArrowDown', 'ArrowUp', 'Space' ];

		if ( !keys.includes( event.code ) || !sectionInViewport() ) return;

		const direction = ( 'ArrowUp' === event.code )
			? 'up'
			: 'down';

		scrollSection( direction );

	};

	/**
	 * Reenables `WheelIndicator` if the top of the scrollable section
	 * hits the top of the viewport.
	 * @private
	 */
	const scrollHandler = () => {

		if ( sectionInViewport() && !document.body.classList.contains( 'scroll-lock' ) ) {
			document.body.classList.add( 'scroll-lock' );

			state.wheelHandler.turnOn();
		}

	};

	/**
	 * Handles scrolling via swiping on a touch device.
	 * @private
	 */
	const swipeHandler = () => {

		if ( !sectionInViewport() ) return;

		const direction = ( state.touchEndY > state.touchStartY )
			? 'down'
			: 'up';

		scrollSection( direction );

	};

	/**
	 * Destroys the current initialization.
	 * @public
	 */
	sectionScroll.destroy = () => {

		// If plugin isn't already initialized, stop.
		if ( !settings ) return;

		// Remove event listeners.
		window.addEventListener( 'keydown', keyDownHandler, true );
		state.wheelHandler.destroy();

		// Reset variables.
		settings = null;
		state.articles = null;
		state.index = 0;

	};

	/**
	 * Initializes the plugin.
	 *
	 * @public
	 * @param {Object} options                          User settings.
	 * @param {Object} options.scrollableSection        The scrollable section. Defaults to `document.querySelector( '.scrolling-sections' )`.
	 * @param {String} options.transitionDuration       The scroll animation duration. Defaults to `1s`.
	 * @param {String} options.transitionTimingFunction The scroll animation timing function. Defaults to `ease`.
	 */
	sectionScroll.init = ( options ) => {

		// Destroy any existing initializations.
		sectionScroll.destroy();

		// Merge user options with defaults.
		settings = extendDefaults( defaults, options || {} );

		// Attempt to find articles in a scrollable section.
		getArticles();

		// Return early if no articles were found.
		if ( !state.articles ) return;

		// Listen for keydown events.
		window.addEventListener( 'keydown', keyDownHandler, true );

		// Use `WheelIndicator` to listen for wheel events.
		state.wheelHandler = new WheelIndicator( {
			elem: settings.scrollableSection,
			callback: ( event ) => scrollSection( event.direction )
		} );

		// Listen for scroll events.
		window.addEventListener( 'scroll', scrollHandler, true );

		// Listen for touchstart events to set the starting point for a swipe.
		settings.scrollableSection.addEventListener( 'touchstart', event => {
			state.touchStartY = event.changedTouches[0].screenY;
		}, false );

		// Listen for touchend events to set the ending point for a swipe.
		settings.scrollableSection.addEventListener( 'touchend', event => {
			state.touchEndY = event.changedTouches[0].screenY;
			swipeHandler();
		}, false );

	};

	return sectionScroll;

} );