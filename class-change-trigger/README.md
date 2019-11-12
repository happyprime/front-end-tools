# Class Change Trigger

A plugin for triggering a class change on an element based on a trigger element's position within the viewport.

## [Demo](https://happyprime.github.io/front-end-tools/class-change-trigger/)

## Usage

Include the script on your page, and initialize it with `classChangeTrigger();`.

An array of objects containing the trigger element, target element, class to apply, distance at which to apply the class, and distance unit can be passed in to the plugin initialization. For example:

```js
classChangeTrigger.init( [
	{
		trigger: document.querySelector( '.first-trigger' ),
		target: document.querySelector( '.home-link' ),
		class: 'yellow',
		distance: '50',
		unit: '%',
	},
	{
		trigger: document.querySelector( '.second-trigger' ),
		target: document.querySelector( '.home-link' ),
		class: 'gray',
		distance: '50',
		unit: 'px',
	}
] );
```

### Object Properties

* `trigger`: The element whose position should trigger the class change.
* `target`: The element that the class change should apply to.
* `class`: The class to apply to the `target` element.
* `distance`: The distance the `trigger` element should be from the top of the viewport in order to apply the class change.
* `unit`: Units the `distance` value should be calculated. Accepts `px` or `%`.