( ( root, factory ) => {
	if ( typeof define === 'function' && define.amd ) {
		define( [], factory );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory();
	} else {
		root.sectionScroll = factory();
	}
} )( typeof self !== 'undefined' ? self : this, () => {

	'use strict';

	// Object for public APIs.
	const sectionScroll = {};

	// Placeholder for defaults merged with user settings.
	let settings;

	// Default settings.
	const defaults = {
		scrollableSection: document.querySelector( '.scrolling-sections' ),
		articlesContainer: document.querySelector( '.scrolling-sections > div' )
	};

	// Object for keeping track of the user is in a scrollable section.
	const state = {
		index: 0,
		articles: null
	};

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
	 * and set an inline `height` on the section wrapper.
	 * @private
	 */
	const getArticles = () => {

		if ( !settings.scrollableSection ) return;

		const articles = settings.scrollableSection.querySelectorAll( 'article' );

		if ( !articles ) return;

		state.articles = articles;

		settings.scrollableSection.style.height = '100vh';

	};

	/**
	 * Animates the section scrolling using `transform: translate3d()`,
	 * which leverages hardware acceleration for better performance.
	 * @private
	 * @param {String} direction
	 */
	const scrollSection = ( direction ) => {

		if ( 'down' === direction && state.index + 1 >= state.articles.length ) {
			document.body.classList.remove( 'scroll-lock' );
			return;
		}

		if ( 'up' === direction ) {

			if ( state.index <= 0 ) return;

			const sectionBounds = settings.scrollableSection.getBoundingClientRect();

			if ( sectionBounds.top !== 0 ) {
				document.body.classList.remove( 'scroll-lock' );
				return;
			}

		}

		document.body.classList.add( 'scroll-lock' );

		let index = ( 'down' === direction )
			? state.index + 1
			: state.index - 1;

		const value = `translate3d(0px, -${ index * window.innerHeight }px, 0px)`;

		settings.articlesContainer.style.transform = value;

		state.index = index;

	};

	/**
	 * Handles scroll events fired by wheel/touchpad/etc.
	 * @private
	 * @param {Event} event The scroll event.
	 */
	const wheelHandler = ( event ) => {

		const scrollDirection = ( event.deltaY > 0 )
			? 'down'
			: 'up';

		requestAnimationFrame( () => scrollSection( scrollDirection ) );

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
		window.addEventListener( 'wheel', wheelHandler, true );
		window.addEventListener( 'keydown', keyDownHandler, true );

		// Reset variables.
		settings = null;
		state.articles = null;
		state.index = 0;

	};

	/**
	 * Initializes the plugin.
	 *
	 * @public
	 * @param {Object}  options                   User settings.
	 * @param {Object}  options.scrollableSection The scrollable section. Defaults to `document.querySelector( '.scrolling-sections' )`.
	 * @param {Object}  options.articlesContainer The article container within the scrollable section. Defaults to `document.querySelector( '.scrolling-sections > div' )`.
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

		// Listen for wheel events - `scroll` doesn't fire due to styles on `body`.
		window.addEventListener( 'wheel', wheelHandler, true );

		// Listen for keydown events.
		window.addEventListener( 'keydown', keyDownHandler, true );

	};

	return sectionScroll;

} );