var i;
var j;
var NROWS=61;
var NCOLS=30;
var PXSZ=10;

var BLACK="#000000"
var RED="#FF0000"
var BLUE="#0000FF"
var LIME="#00FF00"

var INITIALHEIGHT=12;
//var INITIALHEIGHT=NROWS-2;

var otherBlocks={
	height:INITIALHEIGHT,
	//height:NROWS-1,
	blocks:[]
}

for(i=(otherBlocks.height+1);i<NROWS;i++){
	for(j=0;j<NCOLS;j++){
		otherBlocks.blocks[j+(i*NCOLS)]=1;
	}
}

var fallingBlock={
	pivot:7,
	type:0,
	state:0,
	topRow:0,
	bottomRow:0,
	blocks:[],
	moveLeft:function(){
		if(fallingBlock.bottomRow>=otherBlocks.height){
			for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
				for(j=0;j<NCOLS;j++){
					if(fallingBlock.blocks[j+((i)*NCOLS)]>0){
						if(otherBlocks.blocks[j-1+((i)*NCOLS)]>0){
//							fallingBlock.crash();
							return;
						}
					}
				}
			}
		}
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
		fallingBlock.pivot--;
	},
	moveRight:function(){
		if(fallingBlock.bottomRow>=otherBlocks.height){
			for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
				for(j=0;j<NCOLS;j++){
					if(fallingBlock.blocks[j+((i)*NCOLS)]>0){
						if(otherBlocks.blocks[j+1+((i)*NCOLS)]>0){
//							fallingBlock.crash();
							return;
						}
					}
				}
			}
		}
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
		fallingBlock.pivot++;
	},
	crash:function(){
		for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
			for(j=0;j<NCOLS;j++){
				otherBlocks.blocks[j+(i*NCOLS)]|=fallingBlock.blocks[j+(i*NCOLS)];
			}
		}
		fallingBlock.newBlock();
		if(fallingBlock.bottomRow<=otherBlocks.height){
			otherBlocks.height=fallingBlock.bottomRow-1;
		}
	},
	newB0:function(){
		fallingBlock.type=0;
		fallingBlock.topRow=1;
		fallingBlock.bottomRow=1;
		for(j=(fallingBlock.pivot-2);j<(fallingBlock.pivot+2);j++){
		//for(j=5;j<9;j++){
			fallingBlock.blocks[j+(1*NCOLS)]=1;
		}
	},
	newB1:function(){
		fallingBlock.type=1;
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=1;
		for(i=0;i<2;i++){
			for(j=5;j<7;j++){
				fallingBlock.blocks[j+(i*NCOLS)]=1;
			}
		}
	},
	newBlock:function(){
		fallingBlock.pivot=7;
		for(i=0;i<NROWS;i++){
			for(j=0;j<NCOLS;j++){
				fallingBlock.blocks[j+(i*NCOLS)]=0;
			}
		}
		z=Math.floor((Math.random()*2));
		switch(z){
			case 0:
				fallingBlock.newB0();
			break;
			case 1:
				fallingBlock.newB1();
			break;
			default:
		}
	},
	clearBlock:function(){
		for(i=fallingBlock.bottomRow;i>=fallingBlock.topRow;i--){
			for(j=0;j<NCOLS;j++){
				fallingBlock.blocks[j+(i*NCOLS)]=0;
			}
		}
	},
	rotateCCW:function(){
		fallingBlock.state--;
		if(fallingBlock.state<0)	fallingBlock.state=3;
		switch(fallingBlock.type){
			case 0:
				switch(fallingBlock.state){
					case 0:
					case 2:
						if(fallingBlock.pivot<2||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow;
						for(j=(fallingBlock.pivot-2);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
					break;
					case 1:
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+3;
						j=fallingBlock.pivot;
						for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					default:
				}
			break;
			case 1:
			break;
			default:
		}
	},
	rotateCW:function(){
	},
	fall:function(){
		if(fallingBlock.bottomRow>=otherBlocks.height){
			for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
				for(j=0;j<NCOLS;j++){
					if(fallingBlock.blocks[j+((i)*NCOLS)]>0){
						if(otherBlocks.blocks[j+((i+1)*NCOLS)]>0){
							fallingBlock.crash();
							return;
						}
					}
				}
			}
		}
		for(i=fallingBlock.bottomRow;i>=fallingBlock.topRow;i--){
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
};
fallingBlock.newBlock();
var canvas=document.getElementById("myCanvas");
var cv=canvas.getContext("2d");

function randomColor(){
	z=Math.floor((Math.random()*3));
	switch(z){
/*
		case :
		break;
*/
		case 0:
			setColor(RED);
		break;
		case 1:
			setColor(BLUE);
		break;
		case 2:
			setColor(LIME);
		break;
	}
}

setInterval(updateGame,10);

var t=0;
var SPEED=50;

function updateGame(){
	t++;
	if(t>=SPEED){
		t=0;
		updateBlocks();
	}
		drawBackground();
		drawBlocks();
}

function updateBlocks(){
	fallingBlock.fall();
}

var tmp;

function drawBlocks(){
	randomColor();
//	cv.fillStyle="#ffffff";
	tmp=fallingBlock.topRow;
	if(tmp==0)	tmp=1;
	for(i=tmp;i<=fallingBlock.bottomRow;i++){
		for(j=0;j<NCOLS;j++){
			if(fallingBlock.blocks[j+(i*NCOLS)]>0){
				cv.fillRect(j*PXSZ,(i-1)*PXSZ,PXSZ,PXSZ);
				//cv.fillRect(j*PXSZ,(i)*PXSZ,PXSZ,PXSZ);
			}
		}
	}
	cv.fillStyle="#ffffff";
	for(i=otherBlocks.height;i<NROWS;i++){
		for(j=0;j<NCOLS;j++){
			if(otherBlocks.blocks[j+(i*NCOLS)]>0){
				cv.fillRect(j*PXSZ,(i-1)*PXSZ,PXSZ,PXSZ);
				//cv.fillRect(j*PXSZ,i*PXSZ,PXSZ,PXSZ);
			}
		}
	}
}

function setColor(color){
	cv.fillStyle=color;
}

function drawBackground(){
	setColor(BLACK);
//	cv.fillStyle=BLACK;
	//cv.fillStyle="#000000";
	cv.fillRect(0,0,NCOLS*PXSZ,(NROWS-1)*PXSZ);
}

document.onkeydown=function(event){
	event=event||window.event;
	var x=event.keyCode;
	switch(x){
		case 37:
			fallingBlock.moveLeft();
		break;
		case 38:	//up key
			fallingBlock.rotateCCW();
		break;
		case 39:
			fallingBlock.moveRight();
		break;
		case 40:
			fallingBlock.fall();
		break;
		case 122:		//z key
			fallingBlock.rotateCCW();
		break;
		case 120:		//x key
			fallingBlock.rotateCW();
		break;
		default:
	}
}
