# Full-height Section Scroller

A plug-and-play component with basic styling and configurable JavaScript for scrolling smoothly between full-height sections.

## [Demo](https://happyprime.github.io/front-end-tools/section-scroll/)

## Usage

Include the stylesheet and script on your page, and initialize the JavaScript with `sectionScroll.init();`.

Settings can be passed in to the plugin like so:

```js
sectionScroll.init( {
	scrollableSection: document.querySelector( '.scrolling-sections' ),
	transitionDuration: '1s',
	transitionTimingFunction: 'ease',
} );
```

### Available Settings

* `scrollableSection`: The element containing the scrollable sections. Defaults to `document.querySelector( '.scrolling-sections' )`.
* `transitionDuration`: The scroll animation [duration](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration). Defaults to `1s`.
* `transitionTimingFunction`: The scroll animation [timing function](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function). Defaults to `ease`.