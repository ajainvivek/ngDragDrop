## Install

You can download all necessary ngDragDrop files manually or via

```bash
bower install ngDragDrop
```

### [Demo](http://plnkr.co/edit/VtW4K2?p=preview)

## Usage

You need only to include ``ngDragDrop.js`` (as minimal setup) to your project and then you can start using ``ngDragDrop``. For usage just include

```html
<div class="drag_container">
  <h4>Draggables</h4>
  <div ng-drag-drop dropTo="#drop-zone" styles="{{styles}}" on-drag="dragCallback(event)" on-drop="dropCallback(event)" on-over="overCallback(event)">
    <div class="draggable-item" dragIt="true">Drag Item A</div>
    <div class="draggable-item" dragIt="true">Drag Item B</div>
    <div class="draggable-item" dragIt="false">Fixed Item C</div>
  </div>
</div>
<div class="drop_container">
  <h4>Drop Zone</h4>
  <div id="drop-zone">
  </div>
</div>
```

## Collaboration

Your help is appreciated! If you've found a bug or something is not clear, please raise an issue.

Ideally, if you've found an issue, you will submit a PR that meets our [contributor guidelines][contributor-guidelines].

## API

ngDragDrop service provides easy to use and minimalistic API, but in the same time it's powerful enough. Here is the list of accessible methods that you can use:

===

### ``.setup(options)``

Method allows to setup to HTML5 drag drop. It accepts ``options`` object as the only argument.

### Options:

##### ``styles {Object}``

Styles can be added to visually see the drag drop in action

```javascript
var app = angular.module('demo', ['ngDragDrop']);

app.controller("mainCtrl", function ($scope, ngDragDrop) {
	$scope.styles = {
		draggables : {
			onDragging : {border: "1px dashed #000", cursor : "move"},
			onStart : {opacity: 0.5}
		},
		droppables : {
			onEnter: {background: "red"},
			onLeave: {background: "yellow"}
		}
	};
});
```

```html
<div ng-drag-drop dropTo="#drop-zone" styles="{{styles}}"></div>
```

It's possible to bind drag and drop events to element:

```javascript
var app = angular.module('demo', ['ngDragDrop']);

app.controller("mainCtrl", function ($scope, ngDragDrop) {
	$scope.dragCallback = function (event) {
		console.log("Dragging", event);
	};
	$scope.dropCallback = function (event) {
		var currDragElem = ngDragDrop.getCurrentDragElement();
		var dropElem = angular.element(event.target);
		currDragElem.css({
			"pointer-events": "none"
		});
		dropElem.append(currDragElem);
	};
	$scope.overCallback = function (event) {
		console.log("Drag Over", event);
	};
});
```

```html
<div ng-drag-drop dropTo="#drop-zone" on-drag="dragCallback(event)" on-drop="dropCallback(event)" on-over="overCallback(event)">
```

### License
MIT
