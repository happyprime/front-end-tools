# Primary Navigation

A plug-and-play component with basic styling and configurable JavaScript handling for an accessible and intuitive navigation UI.

## Demos

* [Horizontal Navigation](https://happyprime.github.io/front-end-tools/navigation/horizontal/)
* [Vertical Navigation](https://happyprime.github.io/front-end-tools/navigation/vertical/)

## Usage

Include the stylesheet and script on your page, and initialize the JavaScript with `navigation.init();`

Settings can be passed in to the plugin like so:

```js
navigation.init( {
	breakpoint: 960,
	main: document.getElementById( 'main' ),
	nav: document.getElementById( 'nav' ),
} );
```

### Available Settings

* `breakpoint`: Pixel width at which the navigation is styled for mobile devices. Defaults to `null`.
* `main`: _Required_. The element containing the page's content. Defaults to `null`.
* `minHeights`: Whether the plugin should set minimum heights on the main and nav elements. Defaults to `true`.
* `nav`: _Required_. The element containing the navigation. Defaults to `null`.
* `orientation`: The orientation of the navigation. Accepts `vertical` or `horizontal`. Defaults to `vertical`.
* `position`: Initial `top` value of the navigation element from CSS, if set. Defaults to `0`.