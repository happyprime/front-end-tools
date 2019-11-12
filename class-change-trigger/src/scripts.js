( ( root, factory ) => {
	if ( typeof define === 'function' && define.amd ) {
		define( [], factory );
	} else if ( typeof exports === 'object' ) {
		module.exports = factory();
	} else {
		root.classChangeTrigger = factory();
	}
} )( typeof self !== 'undefined' ? self : this, () => {

	'use strict';

	// Object for public APIs.
	const classChangeTrigger = {};

	// Placeholder for user settings.
	let settings;

	/**
	 * Toggles a class on an element based on a trigger element's position
	 * within the viewport for each user-defined set.
	 *
	 * @private
	 */
	const scrollHandler = () => {

		requestAnimationFrame( () => {
			settings.forEach( set => {

				const triggerTop = set.trigger.getBoundingClientRect().top;

				const distance = ( 'px' === set.unit )
					? Math.round( triggerTop )
					: Math.round( ( triggerTop / window.innerHeight ) * 100 );

				if ( distance <= set.distance ) {
					if ( ! set.target.classList.contains( set.class ) ) {
						set.target.classList.add( set.class );
					}
				} else {
					if ( set.target.classList.contains( set.class ) ) {
						set.target.classList.remove( set.class );
					}
				}

			} );
		} );

	};


	/**
	 * Destroys the current initialization.
	 *
	 * @public
	 */
	classChangeTrigger.destroy = () => {

		// If plugin isn't already initialized, stop.
		if ( !settings ) return;

		// Remove event listeners.
		window.removeEventListener( 'scroll', scrollHandler, true );

		// Reset variables.
		settings = null;

	};

	/**
	 * Initializes the plugin.
	 *
	 * @public
	 *
	 * @param {Array} options User settings. An array of objects defining `trigger`, `target`, `class`, `distance`, and `unit`.
	 */
	classChangeTrigger.init = ( options ) => {

		// Destroy any existing initializations.
		classChangeTrigger.destroy();

		// Merge user options with defaults.
		settings = options;

		// Listen for scroll events.
		window.addEventListener( 'scroll', scrollHandler, true );

	};

	return classChangeTrigger;

} );