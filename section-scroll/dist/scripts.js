"use strict";function _typeof(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj}}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj}}return _typeof(obj)}(function(root,factory){if(typeof define==="function"&&define.amd){define(["wheel-indicator"],factory)}else if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"){module.exports=factory(require("wheel-indicator"))}else{root.sectionScroll=factory(root.WheelIndicator)}})(typeof self!=="undefined"?self:void 0,function(WheelIndicator){'use strict';var sectionScroll={};var defaults={scrollableSection:document.querySelector(".scrolling-sections"),transitionDuration:"1s",transitionTimingFunction:"ease"};var state={articles:null,container:null,index:0,touchEndY:0,touchStartY:0,wheelHandler:null};var settings;var extendDefaults=function extendDefaults(defaults,options){var property;for(property in options){if(Object.prototype.hasOwnProperty.call(options,property)){defaults[property]=options[property]}}return defaults};var sectionInViewport=function sectionInViewport(){var sectionBounds=settings.scrollableSection.getBoundingClientRect();return sectionBounds.top===0};var getArticles=function getArticles(){if(!settings.scrollableSection)return;var articles=settings.scrollableSection.querySelectorAll("article");if(!articles)return;state.articles=articles;settings.scrollableSection.style.height="100vh";state.container=settings.scrollableSection.querySelector("div");state.container.style.transitionTimingFunction=settings.transitionTimingFunction;state.container.style.transitionDuration=settings.transitionDuration;if(sectionInViewport()){document.body.classList.add("scroll-lock")}else{state.index=state.articles.length;scrollSection()}};var scrollSection=function scrollSection(direction){if("up"===direction&&state.index<=0)return;if("down"===direction&&state.index+1>=state.articles.length){if(!settings.scrollableSection.nextElementSibling)return;document.body.classList.remove("scroll-lock");state.wheelHandler.turnOff();return}var index="down"===direction?state.index+1:state.index-1;var value="translate3d(0px, -".concat(index*window.innerHeight,"px, 0px)");state.container.style.transform=value;state.index=index};var keyDownHandler=function keyDownHandler(event){var keys=["ArrowDown","ArrowUp","Space"];if(!keys.includes(event.code)||!sectionInViewport())return;var direction="ArrowUp"===event.code?"up":"down";scrollSection(direction)};var scrollHandler=function scrollHandler(){if(sectionInViewport()&&!document.body.classList.contains("scroll-lock")){document.body.classList.add("scroll-lock");state.wheelHandler.turnOn()}};var swipeHandler=function swipeHandler(){if(!sectionInViewport())return;var direction=state.touchEndY>state.touchStartY?"up":"down";scrollSection(direction)};sectionScroll.destroy=function(){if(!settings)return;window.addEventListener("keydown",keyDownHandler,true);state.wheelHandler.destroy();settings=null;state.articles=null;state.index=0};sectionScroll.init=function(options){sectionScroll.destroy();settings=extendDefaults(defaults,options||{});getArticles();if(!state.articles)return;window.addEventListener("keydown",keyDownHandler,true);state.wheelHandler=new WheelIndicator({elem:settings.scrollableSection,callback:function callback(event){return scrollSection(event.direction)}});window.addEventListener("scroll",scrollHandler,true);settings.scrollableSection.addEventListener("touchstart",function(event){state.touchStartY=event.changedTouches[0].screenY},false);settings.scrollableSection.addEventListener("touchend",function(event){state.touchEndY=event.changedTouches[0].screenY;swipeHandler()},false)};return sectionScroll});