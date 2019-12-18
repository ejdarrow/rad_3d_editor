//Timer object used between voxel translation calls.
var timer = null;

//Calls the voxel translation function multiple times for the duration that the left mouse button is being held down.
function updateGridOnMouseDown(direction){
  timer = setInterval("updateGrid('" + direction + "');", cursorInterval);
}

//As soon as the user lifts up on the left mouse button, the translation timer needs to be reset.
function updateGridOnMouseUp(){
  window.clearInterval(timer);
}

//Resets the stage to its original orientation.
//In order for the stage to be reset, a page redirect is necessary and all point 
//data must be placed in the query string to be read by the page upon refresh.
function resetStage(){
	var voxelCoordinates = "{";

	for(var i = 0; i < voxelCount; i++){
		var voxel = document.getElementById(i + "");
		var voxelX = voxel.style.paddingLeft;
		var voxelY = voxel.style.paddingTop;
		var voxelZ = voxel.style.transform;

		//Strips the numeric information from the padding 
		//and translation properties of the x, y, and z coordinates.
		voxelX = voxelX.substring(0, voxelX.length - 2);
		voxelX = parseInt(voxelX);
		voxelY = voxelY.substring(0, voxelY.length - 2);
		voxelY = parseInt(voxelY);
		voxelZ = voxelZ.substring(11, voxelZ.length - 3);
		voxelZ = parseInt(voxelZ);

		if(i == voxelCount - 1){
			voxelCoordinates += "(" + voxelX + "," + voxelY + "," + voxelZ + ")";
		}
		else{
			voxelCoordinates += "(" + voxelX + "," + voxelY + "," + voxelZ + ");";
		}
	}

	voxelCoordinates += "}";
	window.location = "display.html?voxel_coordinates=" + voxelCoordinates;
}

//Cycles through all voxels on screen based on if the user wants to cycle forward or backward.
//This allows the user to delete unwanted voxels as they are working on their model.
function cycleVoxel(direction){
	var previousSelectedVoxelPosition = selectedVoxelPosition;

	if(direction == "back"){
		if(selectedVoxelPosition == 0){
			selectedVoxelPosition = voxelCount - 1;
		}
		else{
			selectedVoxelPosition -= 1;
		}
	}
	else if(direction == "forward"){
		if(selectedVoxelPosition == (voxelCount - 1)){
			selectedVoxelPosition = 0;
		}
		else{
			selectedVoxelPosition += 1;
		}
	}

	for(var i = 0; i < 6; i++){
		document.getElementById(selectedVoxelPosition+"").childNodes[i].style.backgroundColor = "red";
		document.getElementById(previousSelectedVoxelPosition+"").childNodes[i].style.backgroundColor = voxelColor;
	}
}

//Deletes a voxel at a specific position.
//This will delete whatever voxel the selectedVoxelPosition global variables is pointed at.
function deleteVoxel(){
	document.getElementById("cube").removeChild(document.getElementById(selectedVoxelPosition+""));
	for(var i = 0; i < voxelCount; i++){
		var tempVoxel = document.getElementById(i+"");
		if(i > selectedVoxelPosition){
			tempVoxel.id = i - 1;
		}
	}
	voxelCount -= 1;
}

//Creates the initial cursor voxel.
//NOTE: The following sets the voxel's CSS with concatenated JavaScript strings.
//      Setting the CSS with a JavaScript style property is desired, but I have not had any luck setting the webkit transform property.
//      The concatenation method works across all browsers regardless.
function createDimensionalCursor(width, height, depth){
	//Creates the cursor.
	var cursor = document.createElement('div');
	cursor.className = 'voxel';
/*Top[verified]*/
	var topFace = document.createElement('div');
	topFace.className = "voxelFace";
	var cssText = "height:" + depth + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateX(90deg) translateZ(" + depth / 2 + "px)";
	topFace.id = "topFace";
	topFace.setAttribute('style', cssText);
/*Front[verified]*/
	var frontFace = document.createElement('div');
	frontFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: translateZ(" + depth / 2 + "px);";
	frontFace.id = "frontFace";
	frontFace.setAttribute('style', cssText);
/*Right[verified]*/
	var leftFace = document.createElement('div');
	leftFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + depth + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -((depth / 2) - width) + "px);";
	leftFace.id = "rightFace";
	leftFace.setAttribute('style', cssText);
/*Back[verified]*/
	var backFace = document.createElement('div');
	backFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(180deg) translateZ(" + depth / 2 + "px);";
	backFace.id = "backFace";
	backFace.setAttribute('style', cssText);
/*Left*/
	var rightFace = document.createElement('div');
	rightFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + depth + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -(depth / 2) + "px);";
	rightFace.id = "leftFace";
	rightFace.setAttribute('style', cssText);
/*Bottom[verified]*/
	var bottomFace = document.createElement('div');
	bottomFace.className = "voxelFace";
    cssText = "height:" + depth + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateX(90deg) translateZ(" + -(height - (depth / 2)) + "px)";
	bottomFace.id = "bottomFace";
	bottomFace.setAttribute('style', cssText);
	cursor.appendChild(topFace);
	cursor.appendChild(frontFace);
	cursor.appendChild(rightFace);
	cursor.appendChild(backFace);
	cursor.appendChild(leftFace);
	cursor.appendChild(bottomFace);

	//Sets the cursor's coordinates.
	cursor.style.paddingLeft = "0px";
	cursor.style.paddingTop = "0px";
	cursor.style.transform = "translateZ(" + correctedZCoordinate + "px)";

	//A z-index is assigned to the cursor so that
	//other voxels can clip through the cursor.
	cursor.style.zIndex = "0";
	cursor.style.position = "absolute";

	//Assigns the cursor's id to the new voxel so that the new 
	//voxel becomes the new cursor.
	//The old cursor is assigned a numeric value starting at zero.
	//As new points are added, the numeric IDs will increase.
	cursor.id = "cursor"

	document.getElementById("cube").appendChild(cursor);

	//store the dimensional cursor's coordinates for the next shape.
	cursorXDimension = width;
	cursorYDimension = height;
	cursorZDimension = depth;
}

//Moves the cursor voxel right, up, left, down, in or out.
function updateGrid(direction){
	//Gets the cursor voxel and its coordinates.
	var cursor = document.getElementById("cursor");
	var cursorX = cursor.style.paddingLeft;
	var cursorY = cursor.style.paddingTop;
	var cursorZ = cursor.style.transform;

	//Strips the numeric information from the padding 
	//and translation properties of the x, y, and z coordinates.
	cursorX = cursorX.substring(0, cursorX.length - 2);
	cursorX = parseInt(cursorX);
	cursorY = cursorY.substring(0, cursorY.length - 2);
	cursorY = parseInt(cursorY);
	cursorZ = cursorZ.substring(11, cursorZ.length - 3);
	cursorZ = parseInt(cursorZ);

	//Depending on what button the user pressed, a right,
	//up, left, down, in, or out translation is made.
	switch(direction){
		case 'right':
			globalCursorX += 1;
			cursorX = globalCursorX + "px";
			//cursorX = cursorX + magnitude + "px";
			break;
		case 'up':
			globalCursorY -= 1
			cursorY = globalCursorY + "px";
			//cursorY = cursorY - magnitude + "px";
			break;
		case 'left':
			globalCursorX -= 1;
			cursorX = globalCursorX + "px";
			//cursorX = cursorX - magnitude + "px";
			break;
		case 'down':
			globalCursorY += 1;
			cursorY = globalCursorY + "px";
			//cursorY = cursorY + magnitude + "px";
			break;
		case 'in':
			globalCursorZ -= 1;
			cursorZ = globalCursorZ + "px";
			cursorZ = "translateZ(" + cursorZ + ")";
			break;
		case 'out':
			globalCursorZ += 1;
			cursorZ = globalCursorZ + "px";
			cursorZ = "translateZ(" + cursorZ + ")";
			break;
	}

	//Sets the cursor's x, y, and z coordinates to the newly calculated coordinates.
	cursor.style.paddingLeft = cursorX;
	cursor.style.paddingTop = cursorY;
	cursor.style.transform = cursorZ;
}

//Captures a voxel-point at the cursor's current position.
//NOTE: The following sets the voxel's CSS with concatenated JavaScript strings.
//      Setting the CSS with a JavaScript style property is desired, but I have not had any luck setting the webkit transform property.
//      The concatenation method works across all browsers regardless.
function capturePoint(){
	//Grab the current global dimensions that were last used in the cursor.
	width = cursorXDimension;
	height = cursorYDimension;
	depth = cursorZDimension;

	//Gets the cursor voxel and its coordinates.
	var cursor = document.getElementById("cursor");
	var cursorX = cursor.style.paddingLeft;
	var cursorY = cursor.style.paddingTop;
	var cursorZ = cursor.style.transform;

	//Creates a new voxel.
	var point = document.createElement('div');
	point.className = 'voxel';
	var face1 = document.createElement('div');
	face1.className = "voxelFace";

	/*Top[verified]*/
	var topFace = document.createElement('div');
	topFace.className = "voxelFace";
	var cssText = "height:" + depth + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateX(90deg) translateZ(" + depth / 2 + "px)";
	topFace.setAttribute('style', cssText);
	/*Front[verified]*/
	var frontFace = document.createElement('div');
	frontFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: translateZ(" + depth / 2 + "px);";
	frontFace.setAttribute('style', cssText);
	/*Right[verified]*/
	var leftFace = document.createElement('div');
	leftFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + depth + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -((depth / 2) - width) + "px);";
	leftFace.setAttribute('style', cssText);
	/*Back[verified]*/
	var backFace = document.createElement('div');
	backFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(180deg) translateZ(" + depth / 2 + "px);";
	backFace.setAttribute('style', cssText);
	/*Left*/
	var rightFace = document.createElement('div');
	rightFace.className = "voxelFace";
	cssText = "height:" + height + "px;width:" + depth + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateY(90deg) translateZ(" + -(depth / 2) + "px);";
	rightFace.setAttribute('style', cssText);
	/*Bottom[verified]*/
	var bottomFace = document.createElement('div');
	bottomFace.className = "voxelFace";
	cssText = "height:" + depth + "px;width:" + width + "px;background-color:" + "rgba(0, 0, 255, 0.25);" + ";-webkit-transform: rotateX(90deg) translateZ(" + -(height - (depth / 2)) + "px)";
	bottomFace.setAttribute('style', cssText);
	point.appendChild(topFace);
	point.appendChild(frontFace);
	point.appendChild(rightFace);
	point.appendChild(backFace);
	point.appendChild(leftFace);
	point.appendChild(bottomFace);

	//Assigns the cursor's coordinates to the new voxel.
	point.style.paddingLeft = cursorX;
	point.style.paddingTop = cursorY;
	point.style.transform = cursorZ;

	//A new z-index is assigned to the new voxel so that the 
	//voxels may overlap (or clip into) each other on the z axis.
	zIndexCount -= 1;
	point.style.zIndex = zIndexCount + "";
	point.style.position = "absolute";

	//Assigns the cursor's id to the new voxel so that the new 
	//voxel becomes the new cursor.
	//The old cursor is assigned a numeric value starting at zero.
	//As new points are added, the numeric IDs will increase.
	point.id = cursor.id;
	cursor.id = voxelCount + "";
	voxelCount += 1;

	document.getElementById("cube").appendChild(point);
}

//Traverses all voxels on screen, strips their coordinates, and stores their coordinates in a textarea element.
//The user is expected to copy and past the coordinates into a text file.
function saveMesh(){
	var voxelCoordinates = "{";

	for(var i = 0; i < voxelCount; i++){
		var voxel = document.getElementById(i + "");
		var voxelX = voxel.style.paddingLeft;
		var voxelY = voxel.style.paddingTop;
		var voxelZ = voxel.style.transform;

		//Strips the numeric information from the padding 
		//and translation properties of the x, y, and z coordinates.
		voxelX = voxelX.substring(0, voxelX.length - 2);
		voxelX = parseInt(voxelX);
		voxelY = voxelY.substring(0, voxelY.length - 2);
		voxelY = parseInt(voxelY);
		voxelZ = voxelZ.substring(11, voxelZ.length - 3);
		voxelZ = parseInt(voxelZ);

		if(i == voxelCount - 1){
			voxelCoordinates += "(" + voxelX + "," + voxelY + "," + voxelZ + ")";
		}
		else{
			voxelCoordinates += "(" + voxelX + "," + voxelY + "," + voxelZ + ");";
		}
	}

	voxelCoordinates += "}";

	document.getElementById("importExport").value = voxelCoordinates;
}

//Reads coordinates from the import/export text area and populates the stage with voxels based on the supplied coordinates.
//The user is expected to copy and past the coordinates from a text file into the textarea input of the page.
function importMesh(importText){
	importText = importText.replace("{","");
	importText = importText.replace("}","");
	var importArray = importText.split(";");
	for(var i = 0; i < importArray.length; i++){
		var coordinateArray = importArray[i].split(",");
		coordinateArray[0] = coordinateArray[0].replace("(","");
		coordinateArray[2] = coordinateArray[2].replace(")","");
		
		//Gets the cursor voxel and its coordinates.
		var cursor = document.getElementById("cursor");
		cursor.style.paddingLeft = coordinateArray[0] + "px";
		cursor.style.paddingTop = coordinateArray[1] + "px";
		cursor.style.transform = "translateZ(" + coordinateArray[2] + "px)";
		
		capturePoint();
	}
	
	//WARNING!!!
	//It is not known why updating the grid twice solves the issue where the cursor cannot enter its parent's space.
	//The bug in question only happens after an import.
	updateGrid("right")
	updateGrid("down")
}