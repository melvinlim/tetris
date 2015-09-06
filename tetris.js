var i;
var NROWS=60;
var NCOLS=30;
var PXSZ=10;
var arr=[];
for(i=0;i<NROWS;i++){
	for(j=0;j<NCOLS;j++){
		arr[j+(i*NCOLS)]=0;
	}
}
for(j=5;j<9;j++){
	arr[j]=1;
}
//window.alert(arr);
var canvas=document.getElementById("myCanvas");
var cv=canvas.getContext("2d");

setInterval(updateGame,100);

function updateGame(){
	updateBlocks();
	drawBackground();
	drawBlocks();
}

function updateBlocks(){
	for(i=(NROWS-2);i>=0;i--){
		for(j=0;j<NCOLS;j++){
			if(arr[j+(i*NCOLS)]>0){
				arr[j+((i+1)*NCOLS)]=1;
				arr[j+(i*NCOLS)]=0;
			}
		}
	}
}

function drawBlocks(){
	cv.fillStyle="#ffffff";
	for(i=0;i<NROWS;i++){
		for(j=0;j<NCOLS;j++){
			if(arr[j+(i*NCOLS)]>0){
				cv.fillRect(j*PXSZ,i*PXSZ,PXSZ,PXSZ);
			}
		}
	}
}

function drawBackground(){
	cv.fillStyle="#000000";
	cv.fillRect(0,0,NCOLS*PXSZ,NROWS*PXSZ);
}
