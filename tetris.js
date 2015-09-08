//reminder to fix rotation when block is near floor.
var i;
var j;
//var NROWS=61;
//var NCOLS=30;
var NROWS=31;
var NCOLS=14;
var PXSZ=10;

var time=0;
var timeDisp=document.getElementById("time");
timeDisp.innerHTML=time.toFixed(2);

var SCORETEXT="Score: "
var score=0;
var scoreDisp=document.getElementById("score");
scoreDisp.innerHTML=(score);
//scoreDisp.innerHTML=SCORETEXT.concat(score);

var WHITE="#FFFFFF"
var BLACK="#000000"
var RED="#FF0000"
var BLUE="#0000FF"
var LIME="#00FF00"

var INITIALHEIGHT=20;
//var INITIALHEIGHT=NROWS-2;

var otherBlocks={
	height:INITIALHEIGHT,
	//height:NROWS-1,
	blocks:[],
	fall:function(line){
		if(line<otherBlocks.height)	return;
//alert(otherBlocks.height);
//alert(line-1);
		for(i=(line-1);i>=(otherBlocks.height);i--){
			for(j=0;j<NCOLS;j++){
				if(otherBlocks.blocks[j+(i*NCOLS)]>0){
					otherBlocks.blocks[j+((i+1)*NCOLS)]=1;
				}else{
					otherBlocks.blocks[j+((i+1)*NCOLS)]=0;
				}
				otherBlocks.blocks[j+(i*NCOLS)]=0;
			}
		}
		otherBlocks.height++;
	}
}

function lineComplete(line){
	for(j=0;j<NCOLS;j++){
		if(otherBlocks.blocks[j+((line)*NCOLS)]==0){
			return 0;
		}
	}
	score++;
	scoreDisp.innerHTML=score;
	//scoreDisp.innerHTML=SCORETEXT.concat(score);
	return 1;
}

for(i=(otherBlocks.height+1);i<NROWS;i++){
	for(j=0;j<NCOLS;j++){
		otherBlocks.blocks[j+(i*NCOLS)]=1;
	}
}

var fallingBlock={
	color:WHITE,
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
		}
		for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
/*
			if(fallingBlock.blocks[0+(i*NCOLS)]>0){
				return;
			}
*/
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
		}
		for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
/*
			if(fallingBlock.blocks[(NCOLS-1)+(i*NCOLS)]>0){
				return;
			}
*/
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
		if(fallingBlock.topRow<=otherBlocks.height){
			otherBlocks.height=fallingBlock.topRow-1;
		}
		for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
			if(lineComplete(i)){
				otherBlocks.fall(i);
			}
		}
		fallingBlock.newBlock();
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
	newB2:function(){
		fallingBlock.type=2;
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=1;
		for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
			fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
		}
		fallingBlock.blocks[fallingBlock.pivot-1+(fallingBlock.bottomRow*NCOLS)]=1;
	},
	newB3:function(){
		fallingBlock.type=3;
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=1;
		fallingBlock.blocks[fallingBlock.pivot+(fallingBlock.topRow*NCOLS)]=1;
		for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
			fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
		}
	},
	newB4:function(){
		fallingBlock.type=4;
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=1;
		for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
			fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
		}
		fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.bottomRow*NCOLS)]=1;
	},
	newB5:function(){
		fallingBlock.type=5;
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=1;
		for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
			fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
		}
		for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
			fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
		}
	},
	newB6:function(){
		fallingBlock.type=6;
		fallingBlock.topRow=0;
		fallingBlock.bottomRow=1;
		for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
			fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
		}
		for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
			fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
		}
	},
	newBlock:function(){
		fallingBlock.pivot=7;
		fallingBlock.state=0;
		for(i=0;i<NROWS;i++){
			for(j=0;j<NCOLS;j++){
				fallingBlock.blocks[j+(i*NCOLS)]=0;
			}
		}
		//z=Math.floor((Math.random()*7));
		z=2+Math.floor((Math.random()*3));
		switch(z){
			case 0:
				fallingBlock.newB0();
			break;
			case 1:
				fallingBlock.newB1();
			break;
			case 2:
				fallingBlock.newB2();
			break;
			case 3:
				fallingBlock.newB3();
			break;
			case 4:
				fallingBlock.newB4();
			break;
			case 5:
				fallingBlock.newB5();
			break;
			case 6:
				fallingBlock.newB6();
			break;
			default:
		}
		z=Math.floor((Math.random()*3));
		switch(z){
	/*
			case :
			break;
	*/
			case 0:
				fallingBlock.color=(RED);
			break;
			case 1:
				fallingBlock.color=(BLUE);
			break;
			case 2:
				fallingBlock.color=(LIME);
			break;
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
			case 0:	//I
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
			case 1:	//box
			break;
			case 2:	//7
				switch(fallingBlock.state){
					case 0:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot-1+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					case 1:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow+1);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.topRow*NCOLS)]=1;
					break;
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					default:
				}
			break;
			case 3:	//T
				switch(fallingBlock.state){
					case 0:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						fallingBlock.blocks[fallingBlock.pivot+(fallingBlock.topRow*NCOLS)]=1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
					break;
					case 1:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						fallingBlock.blocks[((fallingBlock.topRow+1)*NCOLS)+fallingBlock.pivot+1]=1;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						fallingBlock.blocks[((fallingBlock.topRow+1)*NCOLS)+fallingBlock.pivot-1]=1;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
				}
			break;
			case 4:	//L
				switch(fallingBlock.state){
					case 0:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					case 1:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.topRow+1);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot-1+(fallingBlock.topRow*NCOLS)]=1;
					break;
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.topRow*NCOLS)]=1;
					break;
					default:
				}
			break;
			case 5:	//Z
				switch(fallingBlock.state){
					case 0:
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
					break;
					case 1:
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=fallingBlock.pivot+1;
						for(i=(fallingBlock.topRow);i<(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						j=fallingBlock.pivot;
						for(i=(fallingBlock.topRow+1);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					default:
				}
			break;
			case 6:	//S
				switch(fallingBlock.state){
					case 0:
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state++;
							if(fallingBlock.state>3)	fallingBlock.state=0;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
					break;
					case 1:
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=fallingBlock.pivot;
						for(i=(fallingBlock.topRow);i<(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						j=fallingBlock.pivot+1;
						for(i=(fallingBlock.topRow+1);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					default:
				}
			break;
			default:
		}
	},
	rotateCW:function(){
		fallingBlock.state++;
		if(fallingBlock.state>3)	fallingBlock.state=0;
		switch(fallingBlock.type){
			case 0:	//I
				switch(fallingBlock.state){
					case 0:
					case 2:
						if(fallingBlock.pivot<2||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
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
			case 1:	//box
			break;
			case 2:	//7
				switch(fallingBlock.state){
					case 0:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot-1+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					case 1:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow+1);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.topRow*NCOLS)]=1;
					break;
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					default:
				}
			break;
			case 3:	//T
				switch(fallingBlock.state){
					case 0:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						fallingBlock.blocks[fallingBlock.pivot+(fallingBlock.topRow*NCOLS)]=1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
					break;
					case 1:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						fallingBlock.blocks[((fallingBlock.topRow+1)*NCOLS)+fallingBlock.pivot+1]=1;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						fallingBlock.blocks[((fallingBlock.topRow+1)*NCOLS)+fallingBlock.pivot-1]=1;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
				}
			break;
			case 4:	//L
				switch(fallingBlock.state){
					case 0:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.bottomRow*NCOLS)]=1;
					break;
					case 1:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.topRow+1);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot-1+(fallingBlock.topRow*NCOLS)]=1;
					break;
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=(fallingBlock.pivot);
						for(i=(fallingBlock.topRow);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						fallingBlock.blocks[fallingBlock.pivot+1+(fallingBlock.topRow*NCOLS)]=1;
					break;
					default:
				}
			break;
			case 5:	//Z
				switch(fallingBlock.state){
					case 0:
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
						for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
					break;
					case 1:
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=fallingBlock.pivot+1;
						for(i=(fallingBlock.topRow);i<(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						j=fallingBlock.pivot;
						for(i=(fallingBlock.topRow+1);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					default:
				}
			break;
			case 6:	//S
				switch(fallingBlock.state){
					case 0:
					case 2:
						if(fallingBlock.pivot<1||fallingBlock.pivot>(NCOLS-2)){
							fallingBlock.state--;
							if(fallingBlock.state<0)	fallingBlock.state=3;
							return;
						}
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+1;
						for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
							fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
						}
						for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
							fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
						}
					break;
					case 1:
					case 3:
						fallingBlock.clearBlock();
						fallingBlock.bottomRow=fallingBlock.topRow+2;
						j=fallingBlock.pivot;
						for(i=(fallingBlock.topRow);i<(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
						j=fallingBlock.pivot+1;
						for(i=(fallingBlock.topRow+1);i<=(fallingBlock.bottomRow);i++){
							fallingBlock.blocks[j+(i*NCOLS)]=1;
						}
					break;
					default:
				}
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
	time=time+0.01;
	timeDisp.innerHTML=time.toFixed(2);
}

function updateBlocks(){
	fallingBlock.fall();
}

var tmp;

function drawBlocks(){
//	randomColor();
	setColor(fallingBlock.color);
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
	setColor(WHITE);
//	cv.fillStyle="#ffffff";
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
	cv.fillRect(0,0,NCOLS*PXSZ,(NROWS-1)*PXSZ);
}

document.onkeydown=function(event){
	event=event||window.event;
	var x=event.keyCode;
//alert(x);
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
		case 90:
		case 122:		//z key
			fallingBlock.rotateCCW();
		break;
		case 88:
		case 120:		//x key
			fallingBlock.rotateCW();
		break;
		default:
	}
}
