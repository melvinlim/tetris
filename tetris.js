var i;
var NROWS=30;
var NCOLS=60;
var PXSZ=10;
var arr=[];
for(i=0;i<NCOLS;i++){
	for(j=0;j<NROWS;j++){
		arr[j+(i*NROWS)]=0;
	}
}
window.alert(arr);
var canvas=document.getElementById("myCanvas");
var cv=canvas.getContext("2d");

cv.fillStyle="#ffffff";
cv.fillRect(50,50,200,500);

setInterval(updateGame,1000);

function updateGame(){
	drawBackground();
	drawBlocks();
}

function drawBlocks(){
}

function drawBackground(){
	cv.fillStyle="#000000";
	cv.fillRect(0,0,NROWS*PXSZ,NCOLS*PXSZ);
}
