var app = angular.module('demo', ['ngSanitize', 'ngDragDrop']);

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