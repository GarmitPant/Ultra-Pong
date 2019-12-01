/// <reference path="./p5.global-mode.d.ts" />
var pad = 20 ,
  x = pad, 
  y = 100,
  y1 = 0,
  y2 = 0,
  z1 = 0,
  z2 = 0,
  ydis = 0,
  hdis = 0,
  cx = 100,
  cy = 100,
  boardspeed = 30,
  cpuspeed = 15,
  cblockh = 100, //Height of PR
  hblockh = 100,
  blockwid = 8,  //Width of Both Blocks
  ballx = 180,
  bally = 180,
  xspeed,
  yspeed,
  r = 15,
  blockh = 100, //Height of PL 
  ballspeed = 7,
  yourscore = 0,
  cpuscore = 0,
  bullets = [],
  cbullets = [],
  hbullets = [],  //2nd player bullets
  hit = false,
  chit= false,
  available= true, //For cpu shoot
  n = 0;
var tail1 = [ballx, bally],
    tail2 = [ballx, bally],
    tail3 = [ballx, bally],
    tail4 = [ballx, bally],
    tail5 = [ballx, bally];

var startScreen=true;//makes the start screen
var singlePlayer=false;//single player mode
var playerSelect=130;//box around game mode


let serial, serial1;
let latestData = "0";
var shit = new Audio('Input-05.wav');
var bhit = new Audio('lol.wav')


function setup() {
  cx = windowWidth-pad;
  g = windowWidth-pad;
  createCanvas(windowWidth, windowHeight);
  stroke(255, 100);
  serial = new p5.SerialPort();
  serial.open("COM8");
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial1 = new p5.SerialPort();
  serial1.open("COM9");
  serial1.on('data', gotcData);
  serial1.on('error', gotError);
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  var yVals = splitTokens(currentString, '-');
  if(yVals[0]){
  	y1 = int(trim(yVals[0]));
  }
  if(yVals[1]){
  	y2 = int(trim(yVals[1]));
  }
}

function gotcData() {
  let currentString = serial1.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  var zVals = splitTokens(currentString, '-');
  if(zVals[0]){
  	z1 = int(trim(zVals[0]));
  }
  if(zVals[1]){
  	z2 = int(trim(zVals[1]));
  }
}


function menu(){
	fill(255,255,255);
    rect(windowWidth/2,95,200,210);//menu border
    fill(0,0,0);
    rect(windowWidth/2+5,100,190,200);//menu
    fill(255,255,255);
    textSize(30);
    rect(windowWidth/2+20,playerSelect,160,36);//box around game mode
    fill(0,0,0);
    rect(windowWidth/2+23,playerSelect+3,154,30);//box around game mode

    if ( y1 <= 15 ){
    	playerSelect=130;
    }
    else{
    	playerSelect=200;
    }


    
    // if (keyCode){
    // 	if (key == 'r'){playerSelect=130};//moves box up
    // 	if (key == 'f'){playerSelect=200};//moves box down
    if (keyCode == 32 || y2 == 1){//select game mode
      if (startScreen){
      if (playerSelect==130){
        singlePlayer=true;
        startScreen=false;

        reset();
        
      }//makes game one player
      if (playerSelect==200){
        singlePlayer=false;
        startScreen=false;
        h= topedge(hblockh);
        reset();
        
      }//makes game two player
      }
    }
  fill(255,255,255);
    text("One Player",windowWidth/2+25,160);//brings you to one player game
    text("Two Player",windowWidth/2+25,230);//brings you to two player game
}



function draw() {
  // background(0);
  background(114, 122, 47);  //Color of the board 
  board();
  score();
  step = windowHeight/37;
  y = step * y1;
  if(singlePlayer){
    cy = cpu(cblockh);
    rect(x, y, blockwid, blockh);
    rect(cx,cy, blockwid, cblockh);
  }
  else{
    cy =  step *(37 - z1);
    rect(x, y, blockwid, blockh);
    rect(cx,cy, blockwid, cblockh);
  }

  if ( y2 == 1 ){
    if( bullets.length < 2){
          var bullet = new Bullet(20, y+25, 1);
          bullets.push(bullet);
          bhit.play();
        }
    }
   if ( z2 == 1 ){
    if( hbullets.length < 2){
          var hbullet = new Bullet(cx, cy+25, -1);
          hbullets.push(hbullet);
          bhit.play();
        }
    }
  


  
  drawBall();
  ballx = ballx + xspeed;
  if (ballx > windowWidth-r)  {
     yourscore += 1;
     reset();
  }
  if (ballx < r)  {
     cpuscore += 1;
     reset();
  }
  bally = bally + yspeed;
  if (bally > height-r || bally < r) {
	 	yspeed = -yspeed;
  }
  if (collideRectCircle(x, y, blockwid, blockh, ballx, bally, 2*r, 2*r)){
      if (xspeed < 30){
        xspeed = xspeed * 1.05;
      }
      if (yspeed < 30){
      	yspeed = yspeed * 1.02;
      }
      xspeed = -xspeed;
      ballx += xspeed;
      shit.play();

    
  }
  if (collideRectCircle(cx, cy, blockwid, cblockh, ballx, bally, 2*r, 2*r)){
      if (xspeed < 30){
        xspeed = xspeed * 1.05;
      }
      if (yspeed < 30){
      	yspeed = yspeed * 1.02;
      }
      xspeed = -xspeed;
      ballx += xspeed;
      shit.play();
      
  }



  tail()
  ydis = 0;
  hdis = 0;
  for (var j =0; j< bullets.length; j++) {
    hit = collideRectCircle(cx, cy, blockwid, cblockh, bullets[j].x, bullets[j].y, 2*r, 2*r);
    if (hit){
      yourscore+=1;
      delete bullets[j];
      bullets.splice(j,1);
      continue;
      }
    if( bullets[j].x > windowWidth-r){
      delete bullets[j];
      bullets.splice(j,1);
    }
  }



  for (var j =0; j< hbullets.length; j++) {
    chit = collideRectCircle(x, y, blockwid, cblockh, hbullets[j].x, hbullets[j].y, 2*r, 2*r);
    if (chit){
      cpuscore+=1;
      delete hbullets[j];
      hbullets.splice(j,1);
      continue;
      }
    if( hbullets[j].x < 15 ){
      delete hbullets[j];
      hbullets.splice(j,1);
    }
    
  }

  for (var j =0; j< cbullets.length; j++) {
    chit = collideRectCircle(x, y, blockwid, cblockh, cbullets[j].x, cbullets[j].y, 2*r, 2*r);
    if (chit){
      cpuscore+=1;
      delete cbullets[j];
      cbullets.splice(j,1);
      continue;
      }
    if( cbullets[j].x < 15 ){
      delete cbullets[j];
      cbullets.splice(j,1);
    }
    
  }


  for (var i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].move();
  }

   for (var f = 0; f < hbullets.length; f++) {
   	hbullets[f].show();
   	hbullets[f].move();
   }

   for (var f = 0; f < cbullets.length; f++) {
   	cbullets[f].show();
   	cbullets[f].move();
   }


  if (startScreen){
  	menu();
	}

}

function cShoot(){
  if (cbullets.length<1){
      var cbullet = new Bullet(cx, cy+25, -1);
      cbullets.push(cbullet);
      bhit.play();
  }
}


function keyPressed() {
    if (key == "w") {
      ydis = -boardspeed;
    } 
    else if (key == "s") {
      ydis = +boardspeed;
    }
    if(key ===" "){
      if( bullets.length < 2){
        var bullet = new Bullet(20, y+25, 1);
        bullets.push(bullet);
        bhit.play();
      }

    }

    if (singlePlayer == false){
    	if (key == "y") {
      		hdis = -boardspeed;
    	} 
    	else if (key == "h") {
      		hdis = +boardspeed;
    	}

    	if(key ==="m"){
      		if( hbullets.length < 2){
        		var hbullet = new Bullet(cx, cy+25, -1);
        		hbullets.push(hbullet);
      		}

    	}
    }
    
}


 function ypos(){ 
  if (mouseY-(0.5*blokh) <= 0){
    return(0); 
  }else if((mouseY+(0.5*blokh) >= height)) {
    return(height-blokh);
  }else{
    return(mouseY-(0.5*blokh));
  }
}
  


function topedge(blokh){  
  if (mouseY-(0.5*blokh) <= 0){
    return(0); 
  }else if((mouseY+(0.5*blokh) >= height)) {
    return(height-blokh);
  }else{
    return(mouseY-(0.5*blokh));
  }
}

function reset(){
  xspeed = 0;
  yspeed = 0;
  ballx = windowWidth/2;
  bally = windowHeight/2;
  cy = windowHeight/2;
  // y = windowHeight/2;
  while(xspeed == 0){
    xspeed = round(random(-1,1))*ballspeed;
  }
  while(yspeed == 0){
  yspeed = round(random(-1,1))*ballspeed;
  }
  // delay();
}

function cpu(cblokh){
  cShoot();
  if (ballx >= windowWidth/2){
    if ((cy+(0.5*cblokh) < bally)){
      return(cy += cpuspeed);
    } else if((cy+(0.5*cblokh) > bally)){
      return(cy -= cpuspeed);
    } else{
      return(cy)
    }
  }else{
    if ((cy+(0.5*cblokh) < windowHeight/2)){
      return(cy += cpuspeed-5);
    } else if((cy+(0.5*cblokh) > windowHeight/2)){
      return(cy -= cpuspeed-5);
    } else{
      return(cy)
    }
  }
}



function score(){
  fill(255);
  textSize(128);
  noStroke();
  text(yourscore, (windowWidth/3), 150);
  fill(255);
  text(cpuscore, (windowWidth*(2/3))-75, 150);
}

function board(){
  	// fill(255);
    // ellipse(windowWidth/2, windowHeight/2, 200);
    fill(255);
  	rect(windowWidth/2-4 ,0, 5, windowHeight);
    stroke(255);
    strokeWeight(6);
    fill(255, 204, 0)
  	ellipse(windowWidth/2, windowHeight/2, 192);
  	
}

function drawBall(){
  fill(20);
  ellipse (tail5[0], tail5[1], 5); 
  fill(70);
  ellipse (tail4[0], tail4[1], 10); 
  fill(120);
  ellipse (tail3[0], tail3[1], 15); 
  fill(170);
  ellipse (tail2[0], tail2[1], 20); 
  fill(220);
  ellipse (tail1[0], tail1[1], 25); 
  fill(255);
  ellipse (ballx, bally, 2*r, 2*r); 
}


function tail(){
  dis = 0;
  if(ballx < tail1[0])
    lx = -dis;
  else
    lx = +dis;
  if(bally < tail1[1])
    ly = -dis;
  else
    ly = +dis;
  tail5 = [tail4[0] - lx,tail4[1] - ly]
  tail4 = [tail3[0] - lx,tail3[1] - ly]
  tail3 = [tail2[0] - lx,tail2[1] - ly]
  tail2 = [tail1[0] - lx,tail1[1] - ly]
  tail1 = [ballx, bally]
}

function delay(){
  var holder = millis();
  while(holder+500 >= millis()){
    
  }
}