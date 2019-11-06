"use strict";function _typeof(obj){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj}}else{_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj}}return _typeof(obj)}(function(root,factory){if(typeof define==="function"&&define.amd){define([],factory)}else if((typeof exports==="undefined"?"undefined":_typeof(exports))==="object"){module.exports=factory()}else{root.sectionScroll=factory()}})(typeof self!=="undefined"?self:void 0,function(){'use strict';var sectionScroll={};var settings;var defaults={scrollableSection:document.querySelector(".scrolling-sections"),articlesContainer:document.querySelector(".scrolling-sections > div")};var state={index:0,articles:null};var extendDefaults=function extendDefaults(defaults,options){var property;for(property in options){if(Object.prototype.hasOwnProperty.call(options,property)){defaults[property]=options[property]}}return defaults};var getArticles=function getArticles(){if(!settings.scrollableSection)return;var articles=settings.scrollableSection.querySelectorAll("article");if(!articles)return;state.articles=articles;settings.scrollableSection.style.height="100vh"};var scrollSection=function scrollSection(direction){if("down"===direction&&state.index+1>=state.articles.length){document.body.classList.remove("scroll-lock");return}if("up"===direction){if(state.index<=0)return;var sectionBounds=settings.scrollableSection.getBoundingClientRect();if(sectionBounds.top!==0){document.body.classList.remove("scroll-lock");return}}document.body.classList.add("scroll-lock");var index="down"===direction?state.index+1:state.index-1;var value="translate3d(0px, -".concat(index*window.innerHeight,"px, 0px)");settings.articlesContainer.style.transform=value;state.index=index};var wheelHandler=function wheelHandler(event){var scrollDirection=event.deltaY>0?"down":"up";requestAnimationFrame(function(){return scrollSection(scrollDirection)})};var keyDownHandler=function keyDownHandler(event){if("ArrowDown"!==event.code&&"ArrowUp"!==event.code)return;var scrollDirection="ArrowDown"===event.code?"down":"up";scrollSection(scrollDirection)};sectionScroll.destroy=function(){if(!settings)return;window.addEventListener("wheel",wheelHandler,true);window.addEventListener("keydown",keyDownHandler,true);settings=null;state.articles=null;state.index=0};sectionScroll.init=function(options){sectionScroll.destroy();settings=extendDefaults(defaults,options||{});getArticles();if(!state.articles)return;window.addEventListener("wheel",wheelHandler,true);window.addEventListener("keydown",keyDownHandler,true)};return sectionScroll});