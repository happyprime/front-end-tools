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

	// Default settings.
	const defaults = {};

	// Placeholder for defaults merged with user settings.
	let settings;

	/**
	 * Merges user options with the default settings.
	 *
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
	 * Destroys the current initialization.
	 *
	 * @public
	 */
	classChangeTrigger.destroy = () => {

		// If plugin isn't already initialized, stop.
		if ( !settings ) return;



		// Reset variables.
		settings = null;

	};

	/**
	 * Initializes the plugin.
	 *
	 * @public
	 *
	 * @param {Object} options User settings.
	 */
	classChangeTrigger.init = ( options ) => {

		// Destroy any existing initializations.
		classChangeTrigger.destroy();

		// Merge user options with defaults.
		settings = extendDefaults( defaults, options || {} );

	};

	return classChangeTrigger;

} );