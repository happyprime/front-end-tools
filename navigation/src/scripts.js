( ( root, factory ) => {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory);
	} else if ( typeof exports === 'object' ) {
		module.exports = factory();
	} else {
		root.navigation = factory();
	}
} )( typeof self !== 'undefined' ? self : this, () => {

	'use strict';

	// Object for public APIs.
	const navigation = {};

	// Placeholder for defaults merged with user settings.
	let settings;

	// Default settings.
	const defaults = {
		breakpoint: null,
		main: null,
		nav: null,
		orientation: 'vertical',
		position: 0,
		minHeights: true,
	};

	// Object for keeping track of the `nav` element's scroll state.
	const navScrollState = {
		position: 0,
		top: 0,
	};

	/**
	 * Merges any user options with the default settings.
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
	 * Returns the dropdown button element needed for the menu.
	 */
	const getDropdownButton = () => {

		const dropdownButton = document.createElement( 'button' );

		dropdownButton.classList.add( 'dropdown-toggle' , 'js-dropdown-toggle' );

		// Revisit for translation and internationalization.
		dropdownButton.setAttribute( 'aria-label', 'Expand child menu' );

		dropdownButton.setAttribute( 'aria-expanded', 'false' );

		return dropdownButton;

	};

	/**
	 * Adjusts the navigation markup to be more accessible.
	 * @private
	 */
	const accessibleNav = () => {

		const menu = settings.nav.querySelector( 'ul' );

		// Get the submenus.
		const submenus = menu.querySelectorAll( 'ul' );

		// No point if no submenus.
		if ( ! submenus.length ) return;

		// Create the dropdown button.
		const dropdownButton = getDropdownButton();

		submenus.forEach( ( submenu ) => {
			const parentMenuItem = submenu.parentNode;
			let dropdown = parentMenuItem.querySelector( '.js-dropdown-toggle' );

			// If no dropdown, create one.
			if ( ! dropdown ) {
				const thisDropdownButton = dropdownButton.cloneNode( true );

				// Add before submenu.
				submenu.parentNode.insertBefore( thisDropdownButton, submenu );
			}
		} );

		menu.classList.add( 'has-dropdown-toggle' );

	};

	/**
	 * Initialize the mobile menu toggle button.
	 */
	const toggleNav = () => {

		const menuToggle = settings.nav.querySelector( '.menu-toggle' );

		// Return early if there is no menu toggle button.
		if ( !menuToggle ) return;

		menuToggle.setAttribute( 'aria-expanded', 'false' );

		// Revisit for translation and internationalization.
		menuToggle.setAttribute( 'aria-label', 'Open menu' );

		menuToggle.addEventListener( 'click', () => {
			settings.nav.classList.toggle( 'toggled-on' );

			const expanded = 'false' === menuToggle.getAttribute( 'aria-expanded' ) ? 'true' : 'false';
			const label = 'Open menu' === menuToggle.getAttribute( 'aria-label' ) ? 'Close menu' : 'Open menu';

			menuToggle.setAttribute( 'aria-expanded', expanded );
			menuToggle.setAttribute( 'aria-label', label );

			document.body.classList.toggle( 'menu-toggled-on' );
		}, false );

	};

	/**
	 * Sets the minimum height on both the `main` and `nav` elements.
	 * @private
	 */
	const setMinHeight = () => {

		if ( !settings.minHeights ) return;

		if ( settings.breakpoint && settings.breakpoint > window.innerWidth ) {
			settings.nav.removeAttribute( 'style' );
			return;
		}

		const navHeight = settings.nav.querySelector( 'ul' ).scrollHeight;
		const windowHeight = window.innerHeight;
		const minHeight = ( navHeight > windowHeight )
			? navHeight + 'px'
			: windowHeight + 'px';

		settings.main.style.minHeight = minHeight;
		settings.nav.style.minHeight = minHeight;

	};

	/**
	 * Toggles the `open` class for list items containing child lists.
	 * @private
	 * @param {Event} event The click event.
	 */
	const toggleSection = ( event ) => {

		const target = event.target;

		// Bail if the click isn't on a dropdown toggle button.
		if ( !target.classList.contains( 'js-dropdown-toggle' ) ) return;

		// Toggle the `open` class on the parent `li`.
		target.parentNode.classList.toggle( 'toggled-open' );

		const expanded = 'false' === target.getAttribute( 'aria-expanded' ) ? 'true' : 'false';

		target.setAttribute( 'aria-expanded', expanded );

		setMinHeight();

		positionNav();

	};

	/**
	 * Ensures proper positioning of the navigation when the page scrolled.
	 * @private
	 */
	const positionNav = () => {

		const windowTop = window.pageYOffset;
		const bottomedOut = ( window.innerHeight + windowTop ) >= document.body.offsetHeight;
		const scrollDiff = navScrollState.top - windowTop;
		const upperBound = ( settings.nav.scrollHeight - window.innerHeight ) * -1;

		let position = navScrollState.position;

		// Within the upper bounds, calculate the position based on scroll location.
		position = position + scrollDiff;

		// If the position is greater than the default, reset it to the default.
		// This prevents scrolling too far up.
		if ( settings.position < position ) {
			position = settings.position;
		}

		// If the position is outside of the upper bound, reset it to the upper bound.
		// This prevents scrolling too far down.
		if ( position < upperBound || bottomedOut ) {
			position = upperBound;
		}

		navScrollState.position = position;
		navScrollState.top = windowTop;

		settings.nav.style.top = position + 'px';

	};

	/**
	 * Ensures that the `positionNav` function fires only when needed,
	 * and uses the `requestAnimationFrame` method for optimal performance.
	 * @private
	 */
	const scrollHandler = () => {

		if (
			( !settings.breakpoint || settings.breakpoint < window.innerWidth )
			&& settings.main.offsetHeight > settings.nav.scrollHeight
			&& window.innerHeight < ( settings.nav.scrollHeight + settings.position )
		) {
			requestAnimationFrame( positionNav );
		}

	};

	/**
	 * Destroys the current initialization.
	 * @public
	 */
	navigation.destroy = () => {

		// If plugin isn't already initialized, stop.
		if ( !settings ) return;

		// Remove event listeners.
		settings.element.removeEventListener( 'click', toggleSection, false );

		if ( 'vertical' === settings.orientation ) {
			window.addEventListener( 'resize', setMinHeight, true );
			window.removeEventListener( 'scroll', positionNav, true );
		}

		// Reset variables.
		settings = null;

	};

	/**
	 * Initializes the plugin.
	 *
	 * @public
	 * @param {Object}  options             User settings.
	 * @param {Number}  options.breakpoint  Pixel width at which the navigation is styled for mobile devices. Defaults to `null`
	 * @param {Object}  options.main        The element containing the page's content. Required. Defaults to `null`.
	 * @param {Boolean} options.minHeights  Whether the plugin should set min heights on the main and nav elements. Defaults to `true`.
	 * @param {Object}  options.nav         The element containing the navigation. Required. Defaults to `null`.
	 * @param {String}  options.orientation The orientation of the navigation. Accepts `vertical` or `horizontal`. Defaults to `vertical`.
	 * @param {Number}  options.position    Initial `top` value of the navigation element from CSS, if set. Defaults to `0`.
	 */
	navigation.init = ( options ) => {

		// Check for required settings.
		if ( !options.nav || !options.main ) return;

		// Destroy any existing initializations.
		navigation.destroy();

		// Merge user options with defaults.
		settings = extendDefaults( defaults, options || {} );

		accessibleNav();

		toggleNav();

		// Listen for click events on the navigation element.
		settings.nav.addEventListener( 'click', toggleSection, false );

		if ( 'vertical' === settings.orientation ) {
			setMinHeight();
			window.addEventListener( 'resize', setMinHeight, true );
			window.addEventListener( 'scroll', scrollHandler, true );
		}

	};

	return navigation;

});