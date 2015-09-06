var i;
var arr=[];
for(i=0;i<10;i++){
	arr[i]=i;
}
//window.alert(arr);
var canvas=document.getElementById("myCanvas");
var cv=canvas.getContext("2d");

cv.fillStyle="#ffffff";
cv.fillRect(50,50,200,500);

setInterval(draw,1000);

function draw(){
	drawBackground();
}

function drawBackground(){
	cv.fillRect(0,0,300,600);
}
