//Finds the center point of the browser window.
var originX = document.body.offsetWidth / 2;
var originY = document.body.offsetHeight / 2;

//Determines the amount of degrees the cube will rotate upon calling the rotateByMouse() function.
var xThetaMultiplier = 10;
var yThetaMultiplier = 10;

//Sets up the grid's face dimensions
//NOTE: The following sets the grid's CSS with concatenated JavaScript strings.
//      Setting the CSS with a JavaScript style property is desired, but I have not had any luck setting the webkit transform property.
//      The concatenation method works across all browsers regardless.
var grid = document.getElementById("cube");
grid.style.height = cubeDimension + "px";
grid.style.width = cubeDimension + "px";
var cssText = "	height: " + cubeDimension + "px;width: " + cubeDimension + "px;-webkit-transform: rotateX(90deg) translateZ(" + cubeSideDimension + "px);-moz-transform: rotateX(90deg) translateZ(" + cubeSideDimension + "px);transform: rotateX(90deg) translateZ(" + cubeSideDimension + "px);";
document.getElementById("face1").setAttribute('style', cssText);
cssText = "height: " + cubeDimension + "px;width: " + cubeDimension + "px;-webkit-transform: translateZ(" + cubeSideDimension + "px);-moz-transform: translateZ(" + cubeSideDimension + "px);transform: translateZ(" + cubeSideDimension + "px);";
document.getElementById("face2").setAttribute('style', cssText);
cssText = "height: " + cubeDimension + "px;width: " + cubeDimension + "px;-webkit-transform: rotateY(90deg) translateZ(" + cubeSideDimension + "px);-moz-transform: rotateY(90deg) translateZ(" + cubeSideDimension + "px);transform: rotateY(90deg) translateZ(" + cubeSideDimension + "px);";
document.getElementById("face3").setAttribute('style', cssText);
cssText = "height: " + cubeDimension + "px;width: " + cubeDimension + "px;-webkit-transform: rotateY(180deg) translateZ(" + cubeSideDimension + "px);-moz-transform: rotateY(180deg) translateZ(" + cubeSideDimension + "px);transform: rotateY(180deg) translateZ(" + cubeSideDimension + "px);";
document.getElementById("face4").setAttribute('style', cssText);
cssText = "height: " + cubeDimension + "px;width: " + cubeDimension + "px;-webkit-transform: rotateY(-90deg) translateZ(" + cubeSideDimension + "px);-moz-transform: rotateY(-90deg) translateZ(" + cubeSideDimension + "px);transform: rotateY(-90deg) translateZ(" + cubeSideDimension + "px);";
document.getElementById("face5").setAttribute('style', cssText);
cssText = "height: " + cubeDimension + "px;width: " + cubeDimension + "px;-webkit-transform: rotateX(-90deg) rotate(180deg) translateZ(" + cubeSideDimension + "px);-moz-transform: rotateX(-90deg) rotate(180deg) translateZ(" + cubeSideDimension + "px);transform: rotateX(-90deg) rotate(180deg) translateZ(" + cubeSideDimension + "px);";
document.getElementById("face6").setAttribute('style', cssText);

//A normalized vector has a magnitude of 1 and can point in any direction on a plane.
//Mouse coordinates are fed into the parameters as X and Y values, 
//and their vector magnitude is found after performing the Pythagorean theorem on each coordinate.
//After the magnitude is calculated, a normalized heading is returned for the specified coordinate.
function normalize(coordinate, x, y){
	var magnitude = (x * x) + (y * y);
	magnitude = Math.sqrt(magnitude);
	var normalized = 0.00;

	if(coordinate == "x"){
		var normalized = x / magnitude;	
	}
	else{
		var normalized = y / magnitude;	
	}
	return normalized;
}

//Rotates the cube when a mouse event is fired.
function rotateByMouse(event) {
	//Gets the x and y coordinates of the mouse.
	var x = event.clientX;
	var y = event.clientY;

	//The new x and y coordinates of the mouse relative to the center of the browser window.
	relativeX = x - originX;
	relativeY = y - originY;

	//Newly calculated angles used to rotate the cube.
	thetaX += normalize("x", relativeX, relativeY) * xThetaMultiplier;
	thetaY += normalize("y", relativeX, relativeY) * yThetaMultiplier;

	//Updates the CSS to Rotate the cube.
	document.getElementById('cube').style[prop] = "rotateX(" + -thetaY + "deg) rotateY(" + thetaX + "deg)";
}

//Rotates the cube when a key event is fired.
//NOTE: the cube is rotated at 90 degree intervals, this is by design, it allows the user to quickly change cube faces.
function rotateByArrowKeys(event) {
	switch(event.keyCode) {
		case 37: // left
			thetaY -= 90;
			break;

		case 38: // up
			thetaX += 90;
			event.preventDefault();
			break;

		case 39: // right
			thetaY += 90;
			break;

		case 40: // down
			thetaX -= 90;
			event.preventDefault();
			break;
	};

	//Updates the CSS to Rotate the cube.
	document.getElementById('cube').style[prop] = "rotateX(" + thetaX + "deg) rotateY(" + thetaY + "deg)";
}

//A general function for handling key down events.
function keyEvent(event) {
	var frontFace = document.getElementById("frontFace");
	var rightFace = document.getElementById("rightFace");

	i = 1;

	switch(event.keyCode) {
		case 37: // left
			var width = frontFace.style.width;
			var height = frontFace.style.height;
			var backFaceDepth = backFace.style.transform;
			var topFaceDepth = topFace.style.transform;
			var bottomFaceDepth = bottomFace.style.transform;
			width = width.substring(0, width.length - 2);
			width = parseInt(width);
			width -= 1;
			height = height.substring(0, height.length - 2);
			height = parseInt(height);
			//Sets the cursor's x, y, and z coordinates to the newly calculated coordinates.
			var cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.5);" + ";-webkit-transform: translateZ(" + 100 / 2 + "px);";
			document.getElementById("frontFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + backFaceDepth + ";";
			document.getElementById("backFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + 100 + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -((100 / 2) - width) + "px);";
			document.getElementById("rightFace").setAttribute("style", cssText);
			cssText = "height:" + 100 + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + topFaceDepth + ";";
			topFace.setAttribute('style', cssText);
			cssText = "height:" + 100 + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + bottomFaceDepth + ";";
			bottomFace.setAttribute('style', cssText);
			break;

		case 38: // up
			var height = frontFace.style.height;
			var width = frontFace.style.width;
			var backFaceDepth = backFace.style.transform;
			var leftFaceDepth = leftFace.style.transform;
			console.log(backFaceDepth);
			height = height.substring(0, height.length - 2);
			height = parseInt(height);
			height -= 1;
			width = width.substring(0, width.length - 2);
			width = parseInt(width);
			//Sets the cursor's x, y, and z coordinates to the newly calculated coordinates.
			var cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.5);" + ";-webkit-transform: translateZ(" + 100 / 2 + "px);";
			document.getElementById("frontFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + backFaceDepth + ";";
			document.getElementById("backFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + 100 + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -((100 / 2) - width) + "px);";
			document.getElementById("rightFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + 100 + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + leftFaceDepth + ";";
			document.getElementById("leftFace").setAttribute("style", cssText);
			cssText = "height:" + 100 + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateX(90deg) translateZ(" + -(height - (100 / 2)) + "px);";
			bottomFace.setAttribute('style', cssText);
			break;

		case 39: // right
			var width = frontFace.style.width;
			var height = frontFace.style.height;
			var rightFaceDepth = rightFace.style.transform;
			var backFaceDepth = backFace.style.transform;
			var topFaceDepth = topFace.style.transform;
			var bottomFaceDepth = bottomFace.style.transform;
			console.log(topFaceDepth);
			width = width.substring(0, width.length - 2);
			width = parseInt(width);
			width += 1;
			height = height.substring(0, height.length - 2);
			height = parseInt(height);
			//Sets the cursor's x, y, and z coordinates to the newly calculated coordinates.
			var cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.5);" + ";-webkit-transform: translateZ(" + 100 / 2 + "px);";
			document.getElementById("frontFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + backFaceDepth + ";";
			document.getElementById("backFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + 100 + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -((100 / 2) - width) + "px);";
			document.getElementById("rightFace").setAttribute("style", cssText);
			cssText = "height:" + 100 + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + topFaceDepth + ";";
			topFace.setAttribute('style', cssText);
			cssText = "height:" + 100 + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + bottomFaceDepth + ";";
			bottomFace.setAttribute('style', cssText);
			break;

		case 40: // down
			var height = frontFace.style.height;
			var width = frontFace.style.width;
			var backFaceDepth = backFace.style.transform;
			var leftFaceDepth = leftFace.style.transform;
			height = height.substring(0, height.length - 2);
			height = parseInt(height);
			height += 1;
			width = width.substring(0, width.length - 2);
			width = parseInt(width);
			//Sets the cursor's x, y, and z coordinates to the newly calculated coordinates.
			var cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.5);" + ";-webkit-transform: translateZ(" + 100 / 2 + "px);";
			document.getElementById("frontFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + backFaceDepth + ";";
			document.getElementById("backFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + 100 + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -((100 / 2) - width) + "px);";
			document.getElementById("rightFace").setAttribute("style", cssText);
			cssText = "height:" + height + "px;width:" + 100 + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: " + leftFaceDepth + ";";
			document.getElementById("leftFace").setAttribute("style", cssText);
			cssText = "height:" + 100 + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateX(90deg) translateZ(" + -(height - (100 / 2)) + "px);";
			bottomFace.setAttribute('style', cssText);
			break;
	};
}

//Rotates the cube 90 degrees in a specified direction.
function rotateOrthogonally(direction){
	if(direction == "left"){
		thetaY -= 90;
	}
	else if(direction == "up"){
		thetaX += 90;
	}
	else if(direction == "right"){
		thetaY += 90;
	}
	else{
		thetaX -= 90;
	}

	//Updates the CSS to Rotate the cube.
	document.getElementById('cube').style[prop] = "rotateX(" + thetaX + "deg) rotateY(" + thetaY + "deg)";
}

//Changes the text and background color of a button element when the element is in focus.
function buttonFocus(element, backgroundColor, color){
	element.style.backgroundColor = backgroundColor;
	element.style.color = color;
}

//This code is required for the CSS transformation to work.
var props = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '), prop, el = document.createElement('div');
for(var i = 0, l = props.length; i < l; i++) {
	if(typeof el.style[props[i]] !== "undefined") {
		prop = props[i];
		break;
	}
}

//Reset the angles for each coordinate so they may increment again.
var thetaX = 0;
var thetaY = 0;

//Gets query string information.
var queryString = window.location.search;
var queryStringArray = queryString.split("?voxel_coordinates=");
var queryCoordinates = queryStringArray[1];

//The import will not work if the user supplies an empty set,
//or if the query string information does not exist.
//NOTE: this code always runs upon page load, it is meant to run right 
//      after a window refresh event fired by the refresh button.
if(queryCoordinates != "{}" && queryCoordinates != null){
	importMesh(queryCoordinates);
}