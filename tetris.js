var i;
var j;
var NROWS=60;
var NCOLS=30;
var PXSZ=10;

var INITIALHEIGHT=10;

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
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=0;
		for(j=5;j<9;j++){
			fallingBlock.blocks[j]=1;
		}
	},
	newB1:function(){
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=0;
		for(i=0;i<2;i++){
			for(j=5;j<7;j++){
				fallingBlock.blocks[j+(i*NCOLS)]=1;
			}
		}
	},
	newBlock:function(){
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
};
fallingBlock.newBlock();
var canvas=document.getElementById("myCanvas");
var cv=canvas.getContext("2d");

//setInterval(updateGame,300);
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
			fallingBlock.fall();
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
