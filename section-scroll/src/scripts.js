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

	// Object for keeping track of the user is in a scrollable section.
	const state = {
		index: 0,
		articles: null
	};

	// Placeholder for defaults merged with user settings.
	let settings;

	// Placeholder for setting up the `wheel` event listener.
	let wheelHandler;

	// Placeholder for the scrollable section `article` container element.
	let articlesContainer;

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

		articlesContainer = settings.scrollableSection.querySelector( 'div' );

		articlesContainer.style.transitionTimingFunction = settings.transitionTimingFunction;

		articlesContainer.style.transitionDuration = settings.transitionDuration;

	};

	/**
	 * Animates the section scrolling using `transform: translate3d()`,
	 * which leverages hardware acceleration for better performance.
	 * @private
	 * @param {String} direction
	 */
	const scrollSection = ( direction ) => {

		if ( 'down' === direction && state.index + 1 >= state.articles.length ) {
			wheelHandler.turnOff();
			document.body.classList.remove( 'scroll-lock' );
			return;
		}

		if ( 'up' === direction ) {

			if ( state.index <= 0 ) return;

			const sectionBounds = settings.scrollableSection.getBoundingClientRect();

			if ( sectionBounds.top !== 0 ) {
				wheelHandler.turnOff();
				document.body.classList.remove( 'scroll-lock' );
				return;
			}

		}

		wheelHandler.turnOn();
		document.body.classList.add( 'scroll-lock' );

		let index = ( 'down' === direction )
			? state.index + 1
			: state.index - 1;

		const value = `translate3d(0px, -${ index * window.innerHeight }px, 0px)`;

		articlesContainer.style.transform = value;

		state.index = index;

	};

	/**
	 * Handles scrolling via the up and down arrow keys.
	 * @private
	 * @param {Event} event The keydown event.
	 */
	const keyDownHandler = ( event ) => {

		if ( 'ArrowDown' !== event.code && 'ArrowUp' !== event.code ) return;

		const scrollDirection = ( 'ArrowDown' === event.code )
			? 'down'
			: 'up';

		scrollSection( scrollDirection );

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
		wheelHandler.destroy();

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

		// Use `wheel-indicator` to listen for wheel events.
		wheelHandler = new WheelIndicator( {
			elem: settings.scrollableSection,
			callback: ( event ) => scrollSection( event.direction )
		} );

	};

	return sectionScroll;

} );