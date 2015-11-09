/*!
 * angular-ngDragDrop
 * 
 * Version: 1.0 - 2015-11-09T20:12:42.778Z
 * License: MIT
 */


/*
 * ngDragDrop - HTML5 Drag & Drop
 * http://github.com/ajainvivek/ngDragDrop
 * (c) 2015 MIT License, https://chaicode.com
 */

(function(window, angular, undefined) {
  'use strict';

  var module = angular.module('ngDragDrop', []);

  var $el = angular.element;
  var isDef = angular.isDefined;
  var style = (document.body || document.documentElement).style;
  var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
  var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';

  module.provider('ngDragDrop', function() {
    var defaults = this.defaults = {
      styles : {
        draggables : {
          onDragging : {},
          onStart : {}
        },
        droppables : {
          onEnter: {},
          onLeave: {}
        }
      }
    };

    this.setDefaults = function (newDefaults) {
        angular.extend(defaults, newDefaults);
    };

    this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller',
      function($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller) {
        var privateMethods = {
          currentDragElement: {},
          currentDropElement: {},
          resetStyles: function () {
            var defaults = publicMethods.getDefaults();
            var i;
            var onDraggingKeys = Object.keys(defaults.styles.draggables.onDragging);
            var onStartKeys = Object.keys(defaults.styles.draggables.onStart);
            var onEnterKeys = Object.keys(defaults.styles.droppables.onEnter);
            var onLeaveKeys = Object.keys(defaults.styles.droppables.onLeave);

            if (!angular.equals({}, this.currentDragElement)) {
              //Reset Draggables
              for (i = 0; i < onDraggingKeys.length; i++) {
                this.currentDragElement.css(onDraggingKeys[i], "");
              }
              for (i = 0; i < onStartKeys.length; i++) {
                this.currentDragElement.css(onStartKeys[i], "");
              }
            }
            
            if (!angular.equals({}, this.currentDropElement)) {
              //Reset Droppables
              for (i = 0; i < onEnterKeys.length; i++) {
                this.currentDropElement.css(onEnterKeys[i], "");
              }
              for (i = 0; i < onLeaveKeys.length; i++) {
                this.currentDropElement.css(onLeaveKeys[i], "");
              }
            }
            
          },
          bindDragEvents: function (scope, dragElems, listeners) {
            var self = this;
            var defaults = publicMethods.getDefaults();

            var onDragStart = function (event) {
              self.currentDragElement = angular.element(event.target);
              angular.element(event.target).css(defaults.styles.draggables.onStart);
            };

            var onDrag = function (event) {
              angular.element(event.target).css(defaults.styles.draggables.onDragging);
              listeners.onDrag({
                event : event
              });
              return true;
            };

            var onDragEnd = function (event) {
              self.resetStyles();
            };

            for (var i = 0; i < dragElems.length; i++) {
              dragElems[i].addEventListener('dragstart', onDragStart);
              dragElems[i].addEventListener('drag', onDrag);
              dragElems[i].addEventListener('dragend', onDragEnd);
            }
          },
          bindDropEvents: function (scope, dropZone, listeners) {
            var self = this;
            var defaults = publicMethods.getDefaults();
            
            var onDragEnter = function (event) {
              self.currentDropElement = angular.element(event.target);
              angular.element(event.target).css(defaults.styles.droppables.onEnter);
              event.preventDefault();
            };

            var onDragOver = function (event) {
              listeners.onOver({event: event});
              //Allow moves
              event.dataTransfer.dropEffect = "move";
              event.preventDefault();
              return false; 
            };

            var onDragLeave = function (event) {
              angular.element(event.target).css(defaults.styles.droppables.onLeave);
            };

            var onDrop = function (event) {
              event.preventDefault();
              listeners.onDrop({event: event});
              $timeout(function() { //Reset Drag/Drop Element
                self.currentDropElement = {}; 
                self.currentDragElement = {};
              }, 10);
             
            };

            dropZone.addEventListener('drop', onDrop);
            dropZone.addEventListener('dragenter', onDragEnter);
            dropZone.addEventListener('dragleave', onDragLeave);
            dropZone.addEventListener('dragover', onDragOver);
          },
          setDraggable: function(scope, elem, listeners) {
            var dragItems = angular.element(elem.querySelectorAll("[dragIt='true']"));
            dragItems.attr("draggable", true);
            this.bindDragEvents(scope, dragItems, listeners);
            return dragItems;
          },
          setDroppable: function (scope, elem, listeners) {
            var style = elem.attr("dropTo");
            this.bindDropEvents(scope, document.querySelectorAll(style)[0], listeners);
          }
        };

        var publicMethods = {
          setup: function(opts) {
            angular.extend(defaults, opts);
            var options = this.getDefaults();
            privateMethods.setDraggable(options.scope, options.elem[0], options.listeners);
            privateMethods.setDroppable(options.scope, options.elem, options.listeners);
          },
          getDefaults: function () {
              return defaults;
          },
          getCurrentDragElement : function () {
            return privateMethods.currentDragElement;
          }
        };

        return publicMethods;
      }
    ];
  });

  module.directive('ngDragDrop', ['ngDragDrop', '$parse', function(ngDragDrop, $parse) {
    return {
      restrict: 'EA',
      scope: {
        onDrag: '&',
        onDrop: '&',
        onOver: '&'
      },
      link: function(scope, elem, attrs) {
        var ngDragDropScope = angular.isDefined(scope.ngDragDropScope) ? scope.ngDragDropScope : 'noScope';
        var defaults = ngDragDrop.getDefaults();
        ngDragDrop.setup({
          elem : elem,
          attrs : attrs,
          scope: scope,
          listeners : {
            onDrag : scope.onDrag || function () {}, 
            onDrop : scope.onDrop || function () {},
            onOver : scope.onOver || function () {}
          },
          styles : JSON.parse(attrs.styles) || defaults.styles
        });
      }
    };
  }]);

})(window, window.angular);
angular.module("ngDragDrop").run(["$templateCache", function($templateCache) {$templateCache.put("ngDragDrop.html","<div class=\"\"><div>The value is {{getValue()}}</div><button ng-click=\"increment()\">+</button></div>");}]);