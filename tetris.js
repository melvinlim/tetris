var i;
var j;
var NROWS=60;
var NCOLS=30;
var PXSZ=10;

var otherBlocks={
	height:5,
	//height:NROWS-1,
	blocks:[]
}

var fallingBlock={
	topRow:0,
	bottomRow:0,
	blocks:[],
	moveLeft:function(){
		for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
			if(fallingBlock.blocks[0+(i*NCOLS)]>0){
				return;
			}
			for(j=1;j<NCOLS;j++){
				if(fallingBlock.blocks[j+(i*NCOLS)]>0){
					fallingBlock.blocks[j+(i*NCOLS)-1]=1;
					fallingBlock.blocks[j+(i*NCOLS)]=0;
				}
			}
		}
	},
	moveRight:function(){
		for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
			if(fallingBlock.blocks[(NCOLS-1)+(i*NCOLS)]>0){
				return;
			}
			for(j=(NCOLS-2);j>=0;j--){
				if(fallingBlock.blocks[j+(i*NCOLS)]>0){
					fallingBlock.blocks[j+(i*NCOLS)+1]=1;
					fallingBlock.blocks[j+(i*NCOLS)]=0;
				}
			}
		}
	},
	crash:function(){
		for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
			for(j=0;j<NCOLS;j++){
				otherBlocks.blocks[j+(i*NCOLS)]|=fallingBlock.blocks[j+(i*NCOLS)];
			}
		}
		fallingBlock.newBlock();
	},
	newBlock:function(){
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=0;
		for(i=0;i<NROWS;i++){
			for(j=0;j<NCOLS;j++){
				fallingBlock.blocks[j+(i*NCOLS)]=0;
			}
		}

		for(j=5;j<9;j++){
			fallingBlock.blocks[j]=1;
		}
	}
};
fallingBlock.newBlock();
var canvas=document.getElementById("myCanvas");
var cv=canvas.getContext("2d");

setInterval(updateGame,300);

function updateGame(){
	updateBlocks();
	drawBackground();
	drawBlocks();
}

function updateBlocks(){
	if(fallingBlock.bottomRow>=otherBlocks.height){
		fallingBlock.crash();
	}
	for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
		for(j=0;j<NCOLS;j++){
			if(fallingBlock.blocks[j+(i*NCOLS)]>0){
				fallingBlock.blocks[j+((i+1)*NCOLS)]=1;
				fallingBlock.blocks[j+(i*NCOLS)]=0;
			}
		}
	}
	fallingBlock.topRow++;
	fallingBlock.bottomRow++;
}

function drawBlocks(){
	cv.fillStyle="#ffffff";
	for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
		for(j=0;j<NCOLS;j++){
			if(fallingBlock.blocks[j+(i*NCOLS)]>0){
				cv.fillRect(j*PXSZ,i*PXSZ,PXSZ,PXSZ);
			}
		}
	}
	for(i=otherBlocks.height;i<NROWS;i++){
		for(j=0;j<NCOLS;j++){
			if(otherBlocks.blocks[j+(i*NCOLS)]>0){
				cv.fillRect(j*PXSZ,i*PXSZ,PXSZ,PXSZ);
			}
		}
	}
}

function drawBackground(){
	cv.fillStyle="#000000";
	cv.fillRect(0,0,NCOLS*PXSZ,NROWS*PXSZ);
}

document.onkeydown=function(event){
	event=event||window.event;
	var x=event.keyCode;
	switch(x){
		case 37:
			fallingBlock.moveLeft();
		break;
		case 38:	//up key
			rotateCCW();
		break;
		case 39:
			fallingBlock.moveRight();
		break;
		case 40:
			moveDown();
		break;
		case 122:		//z key
			rotateCCW();
		break;
		case 120:		//x key
			rotateCW();
		break;
		default:
	}
}
