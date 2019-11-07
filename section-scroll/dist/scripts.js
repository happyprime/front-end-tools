"use strict";function _typeof(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj}}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj}}return _typeof(obj)}(function(root,factory){if(typeof define==="function"&&define.amd){define(["wheel-indicator"],factory)}else if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"){module.exports=factory(require("wheel-indicator"))}else{root.sectionScroll=factory(root.WheelIndicator)}})(typeof self!=="undefined"?self:void 0,function(WheelIndicator){'use strict';var sectionScroll={};var defaults={scrollableSection:document.querySelector(".scrolling-sections"),transitionDuration:"1s",transitionTimingFunction:"ease"};var state={index:0,articles:null};var settings;var wheelHandler;var articlesContainer;var extendDefaults=function extendDefaults(defaults,options){var property;for(property in options){if(Object.prototype.hasOwnProperty.call(options,property)){defaults[property]=options[property]}}return defaults};var sectionInViewport=function sectionInViewport(){var sectionBounds=settings.scrollableSection.getBoundingClientRect();return sectionBounds.top===0};var getArticles=function getArticles(){if(!settings.scrollableSection)return;var articles=settings.scrollableSection.querySelectorAll("article");if(!articles)return;if(sectionInViewport()){document.body.classList.add("scroll-lock")}state.articles=articles;settings.scrollableSection.style.height="100vh";articlesContainer=settings.scrollableSection.querySelector("div");articlesContainer.style.transitionTimingFunction=settings.transitionTimingFunction;articlesContainer.style.transitionDuration=settings.transitionDuration};var scrollSection=function scrollSection(direction){if("up"===direction&&state.index<=0)return;if("down"===direction&&state.index+1>=state.articles.length||"up"===direction&&!sectionInViewport()){document.body.classList.remove("scroll-lock");wheelHandler.turnOff();return}var index="down"===direction?state.index+1:state.index-1;var value="translate3d(0px, -".concat(index*window.innerHeight,"px, 0px)");articlesContainer.style.transform=value;state.index=index};var keyDownHandler=function keyDownHandler(event){var keys=["ArrowDown","ArrowUp","Space"];if(!keys.includes(event.code)||!sectionInViewport())return;var scrollDirection="ArrowUp"===event.code?"up":"down";scrollSection(scrollDirection)};var scrollHandler=function scrollHandler(){if(!sectionInViewport())return;document.body.classList.add("scroll-lock");wheelHandler.turnOn()};sectionScroll.destroy=function(){if(!settings)return;window.addEventListener("keydown",keyDownHandler,true);wheelHandler.destroy();settings=null;state.articles=null;state.index=0};sectionScroll.init=function(options){sectionScroll.destroy();settings=extendDefaults(defaults,options||{});getArticles();if(!state.articles)return;window.addEventListener("keydown",keyDownHandler,true);wheelHandler=new WheelIndicator({elem:settings.scrollableSection,callback:function callback(event){return scrollSection(event.direction)}});window.addEventListener("scroll",scrollHandler,true)};return sectionScroll});