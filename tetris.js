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

//var SCORETEXT="Score: "
var score=0;
var scoreDisp=document.getElementById("score");
scoreDisp.innerHTML=(score);
//scoreDisp.innerHTML=SCORETEXT.concat(score);

var WHITE="#FFFFFF"
var BLACK="#000000"
var RED="#FF0000"
var BLUE="#0000FF"
var LIME="#00FF00"

var gameInterval;

//var INITIALHEIGHT=20;
var INITIALHEIGHT=NROWS-2;

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
  if(SPEED>1){
    SPEED=(SPEED*0.9);
  }
  return 1;
}

function initLines(y){
  otherBlocks.height=y
  for(i=0;i<(y+1);i++){
    for(j=0;j<NCOLS;j++){
      otherBlocks.blocks[j+(i*NCOLS)]=0;
    }
  }
  for(i=(y+1);i<NROWS;i++){
    for(j=0;j<NCOLS;j++){
      otherBlocks.blocks[j+(i*NCOLS)]=1;
    }
  }
}

function undoTurn(direction){
  if(direction>0){
    fallingBlock.state--;
    if(fallingBlock.state<0)	fallingBlock.state=3;
  }else{
    fallingBlock.state++;
    if(fallingBlock.state>3)	fallingBlock.state=0;
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
    if(fallingBlock.topRow==0){
      //alert("game over");
      state="game over";
      clearInterval(gameInterval);
      showMenu("game over");
      return;
    }
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
    z=Math.floor((Math.random()*7));
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
  rotate:function(direction){
    if(direction>0){
      fallingBlock.state++;
      if(fallingBlock.state>3)	fallingBlock.state=0;
    }else{
      fallingBlock.state--;
      if(fallingBlock.state<0)	fallingBlock.state=3;
    }
    switch(fallingBlock.type){
      case 0:	//I
        switch(fallingBlock.state){
          case 0:
          case 2:
            if(fallingBlock.pivot<2||fallingBlock.pivot>(NCOLS-2)){
              undoTurn(direction);
              return;
            }
            for(j=(fallingBlock.pivot-2);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+(fallingBlock.topRow*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            fallingBlock.clearBlock();
            fallingBlock.bottomRow=fallingBlock.topRow;
            for(j=(fallingBlock.pivot-2);j<(fallingBlock.pivot+2);j++){
              fallingBlock.blocks[j+(fallingBlock.topRow*NCOLS)]=1;
            }
            break;
          case 1:
          case 3:
            j=fallingBlock.pivot;
            for(i=fallingBlock.topRow;i<=(fallingBlock.topRow+3);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+(fallingBlock.topRow*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot-1+((fallingBlock.topRow+1)*NCOLS)]>0){
              undoTurn(direction);
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
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
              if(otherBlocks.blocks[j+(fallingBlock.topRow*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            j=(fallingBlock.pivot);
            for(i=(fallingBlock.topRow+1);i<=((fallingBlock.topRow+2));i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+((fallingBlock.topRow+1)*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot+1+(fallingBlock.topRow*NCOLS)]>0){
              undoTurn(direction);
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
            j=(fallingBlock.pivot);
            for(i=(fallingBlock.topRow);i<=((fallingBlock.topRow+2));i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot+1+((fallingBlock.topRow+2)*NCOLS)]>0){
              undoTurn(direction);
              return;
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot+(fallingBlock.topRow*NCOLS)]>0){
              undoTurn(direction);
              return;
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+((fallingBlock.topRow+1)*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            fallingBlock.clearBlock();
            fallingBlock.bottomRow=fallingBlock.topRow+1;
            fallingBlock.blocks[fallingBlock.pivot+(fallingBlock.topRow*NCOLS)]=1;
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
              fallingBlock.blocks[j+(fallingBlock.bottomRow*NCOLS)]=1;
            }
            break;
          case 1:
            if(otherBlocks.blocks[((fallingBlock.topRow+1)*NCOLS)+fallingBlock.pivot+1]>0){
              undoTurn(direction);
              return;
            }
            j=(fallingBlock.pivot);
            for(i=(fallingBlock.topRow);i<=(fallingBlock.topRow+2);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[((fallingBlock.topRow+1)*NCOLS)+fallingBlock.pivot+1]>0){
              undoTurn(direction);
              return;
            }
            j=(fallingBlock.pivot);
            for(i=(fallingBlock.topRow);i<=(fallingBlock.topRow+2);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+(fallingBlock.topRow*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot+((fallingBlock.topRow+1)*NCOLS)]>0){
              undoTurn(direction);
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
            if(otherBlocks.blocks[((fallingBlock.topRow+1)*NCOLS)+fallingBlock.pivot-1]>0){
              undoTurn(direction);
              return;
            }
            j=(fallingBlock.pivot);
            for(i=(fallingBlock.topRow);i<=(fallingBlock.topRow+2);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+(fallingBlock.topRow*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot+1+((fallingBlock.topRow+1)*NCOLS)]>0){
              undoTurn(direction);
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
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
              if(otherBlocks.blocks[j+((fallingBlock.topRow+2)*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            j=(fallingBlock.pivot);
            for(i=(fallingBlock.topRow);i<=((fallingBlock.topRow+1));i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+((fallingBlock.topRow+1)*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot-1+(fallingBlock.topRow*NCOLS)]>0){
              undoTurn(direction);
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
            j=(fallingBlock.pivot);
            for(i=(fallingBlock.topRow);i<=((fallingBlock.topRow+2));i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            if(otherBlocks.blocks[fallingBlock.pivot+1+((fallingBlock.topRow)*NCOLS)]>0){
              undoTurn(direction);
              return;
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
              if(otherBlocks.blocks[j+(fallingBlock.topRow*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+((fallingBlock.topRow+1)*NCOLS)]){
                undoTurn(direction);
                return;
              }
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
            j=fallingBlock.pivot+1;
            for(i=(fallingBlock.topRow);i<(fallingBlock.topRow+2);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            j=fallingBlock.pivot;
            for(i=(fallingBlock.topRow+1);i<=(fallingBlock.topRow+2);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
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
              if(direction>0){
                fallingBlock.state--;
                if(fallingBlock.state<0)	fallingBlock.state=3;
                return;
              }else{
                fallingBlock.state++;
                if(fallingBlock.state>3)	fallingBlock.state=0;
                return;
              }
            }
            for(j=(fallingBlock.pivot-1);j<(fallingBlock.pivot+1);j++){
              if(otherBlocks.blocks[j+((fallingBlock.topRow+1)*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            for(j=(fallingBlock.pivot);j<(fallingBlock.pivot+2);j++){
              if(otherBlocks.blocks[j+(fallingBlock.topRow*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
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
            j=fallingBlock.pivot;
            for(i=(fallingBlock.topRow);i<(fallingBlock.topRow+2);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
            j=fallingBlock.pivot+1;
            for(i=(fallingBlock.topRow+1);i<=(fallingBlock.topRow+2);i++){
              if(otherBlocks.blocks[j+(i*NCOLS)]>0){
                undoTurn(direction);
                return;
              }
            }
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
  drop:function(){
    while (!fallingBlock.fall());
  },
  fall:function(){
    if(fallingBlock.bottomRow>=otherBlocks.height){
      for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
        for(j=0;j<NCOLS;j++){
          if(fallingBlock.blocks[j+((i)*NCOLS)]>0){
            if(otherBlocks.blocks[j+((i+1)*NCOLS)]>0){
              fallingBlock.crash();
              return true;
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
    return false;
  }
};
var canvas=document.getElementById("myCanvas");
var cv=canvas.getContext("2d");

function checkCollision(){
  for(i=fallingBlock.topRow;i<=fallingBlock.bottomRow;i++){
    for(j=0;j<NCOLS;j++){
      if(fallingBlock.blocks[j+((i)*NCOLS)]>0){
        if(otherBlocks.blocks[j+((i)*NCOLS)]>0){
          return 1;
        }
      }
    }
  }
  return 0;
}

function randomColor(){
  z=Math.floor((Math.random()*3));
  switch(z){
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

var t=0;
var INITIALSPEED=50;
var SPEED;

function updateGame(){
  drawBackground();
  drawBlocks();
  t++;
  if(t>=SPEED){
    t=0;
    updateBlocks();
  }
  timeDisp.innerHTML=time.toFixed(2);
  time=time+0.01;
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

function startGame(){
  initLines(INITIALHEIGHT);
  //initLines(4);
  fallingBlock.newBlock();
  gameInterval=setInterval(updateGame,10);  //calls updateGame every 10 milliseconds. 10 milliseconds is the minimum possible value.

  t=0;
  time=0;
  SPEED=INITIALSPEED;
}

function pause(){
  if(state=="running"){
    //alert("clearing interval");
    cv.font="100% Arial";
    cv.fillStyle="gray";
    cv.fillText("paused",5,(NROWS*PXSZ/2));
    clearInterval(gameInterval);
    state="paused";
  }else if(state=="paused"){
    //alert("setting interval");
    gameInterval=setInterval(updateGame,10);  //calls updateGame every 10 milliseconds. 10 milliseconds is the minimum possible value.
    state="running";
  }
}

//document.onkeydown=function(event){
window.onkeydown=function(event){
  event=event||window.event;
  var x=event.keyCode;
  //alert(x);
  switch(x){
    case 65:  //a key
    case 37:
      fallingBlock.moveLeft();
      break;
    case 87:	//w key
    case 38:	//up key
      fallingBlock.rotate(0);
      break;
    case 68:  //d key
    case 39:
      fallingBlock.moveRight();
      break;
    case 83:  //s key
    case 40:
      fallingBlock.fall();
      break;
    case 90:
    case 122:		//z key
      fallingBlock.rotate(0);
      break;
    case 88:
    case 120:		//x key
      fallingBlock.rotate(1);
      break;
    case 13:		//enter key
      if(state=="game over"){
        startGame();
      }
      break;
    case 32:    //space bar
      fallingBlock.drop();
      break;
    case 80:		//p key
      pause();
      break;
    default:
  }
}
var state="idle";
canvas.onmousemove=function(event){
  //if(state!="running"){
  if(state=="idle"){
    state="running";
    startGame();
  }
}

//startGame();

function showMenu(text){
  initLines(0);
  updateGame();
  cv.font="100% Arial";
  cv.fillStyle="black";
  cv.fillText(text,5,(NROWS*PXSZ/2));
}

showMenu("click here to start");
