/*테트리스 게임이 진행되는 부분을 borad라고 정의하고 그 borad의 너비와 높이를 정하였다.*/
var BOARD_WIDTH = 10;
var BOARD_HEIGHT = 20;

/*여기서 block은 실제 테트리스 게임에 나오는 블록을 이루는 작은 네모들이다.*/
var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

/*떨어지는 시간을 정의하였다.*/
var FALLING_TIME = 400;

/*P5.js에서 keycode가 정의되어 있지 않은 부분을 가독성을 위해 변수로 정의하였다.*/
var KEY_SPACE = 32;
var KEY_SHIFT = 16;

/*game 객체와 일정시간 반복을 위한 handler 객체를 전역으로 정의하였다.*/
var game;
var intervalHandler;


/*테트리스에 등장하는 블록에 대한 데이터와 기능들을 묶어놓은 객체이다
BLOCKS는 각 블록의 모양들을 배열로 표현해 놓은 것 이다. 그리고 모양별로 각각을 식별할 수 있는 숫자로 배열이 채워져 있다.
X,Y는 지금 현재 움직이는 블록의 좌표를 나타낸다.
currentBlock, nextBlock, holdBlock은 각각 현재 블록, 다음번에 나올 블록, 사용자가 hold한 블록이다.
각 메소드는 블록의 회전, 블록의 적용 및 삭제에 관한 메소드 이다.
*/
function Shape() {
  this.BLOCKS = [
    [
      [0,0,0,0],
      [0,11,11,0],
      [0,11,11,0],
      [0,0,0,0],
    ],
    [
      [0,0,12,0],
      [0,0,12,0],
      [0,0,12,0],
      [0,0,12,0],
    ],
    [
      [0,0,0,0],
      [0,13,13,0],
      [0,0,13,13],
      [0,0,0,0],
    ],
    [
      [0,0,0,0],
      [0,0,14,14],
      [0,14,14,0],
      [0,0,0,0],
    ],
    [
      [0,0,15,0],
      [0,15,15,0],
      [0,0,15,0],
      [0,0,0,0],
    ],
    [
      [0,16,0,0],
      [0,16,0,0],
      [0,16,16,0],
      [0,0,0,0],
    ],
    [
      [0,0,17,0],
      [0,0,17,0],
      [0,17,17,0],
      [0,0,0,0],
    ]
  ];
  this.X = 3;
  this.Y = 0;
  this.currentBlock = this.randomBlock();
  this.nextBlock = this.randomBlock();
  this.holdBlock = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
}

Shape.prototype.rotateRight = function(block){
  return [
    [block[3][0],block[2][0],block[1][0],block[0][0]],
    [block[3][1],block[2][1],block[1][1],block[0][1]],
    [block[3][2],block[2][2],block[1][2],block[0][2]],
    [block[3][3],block[2][3],block[1][3],block[0][3]]
  ];
}

Shape.prototype.rotateLeft = function(block){
  return [
    [block[0][3],block[1][3],block[2][3],block[3][3]],
    [block[0][2],block[1][2],block[2][2],block[3][2]],
    [block[0][1],block[1][1],block[2][1],block[3][1]],
    [block[0][0],block[1][0],block[2][0],block[3][0]]
  ];
}

Shape.prototype.intersectCheck = function(y,x,block,board){
  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      if(block[i][j]){
        if( i + y >= BOARD_HEIGHT || j + x >= BOARD_WIDTH || j + x < 0 || board[y+i][x+j]){
          return true; /* 움직였을 때 어떤 물체 또는 board 끝에 겹침을 뜻함*/
        }
      }
    }
  }
  return false;
}

Shape.prototype.applyBlock = function(y,x,block,board){
  var newBoard = [];

  for(var i =0; i<BOARD_HEIGHT; i++){
    newBoard[i] = board[i].slice();
  }

  for(var i = 0; i < 4; i++){
    for(var j = 0; j < 4; j++){
      if(block[i][j]){
        newBoard[i+y][j+x] = block[i][j];
      }
    }
  }
  return newBoard;
}

Shape.prototype.deleteLine = function(board){
    var newBoard = [];
    var count = BOARD_HEIGHT;
    for(var i=BOARD_HEIGHT; i --> 0;){
      for(var j=0; j<BOARD_WIDTH; j++){
        if(!board[i][j]){/* 0인 성분이 있으면 한줄이 다 안 채워진 것이므로 붙여넣기 해 준다.*/
          /*--count로 아래부터 새로운 board를 채워주는 이유는 맨 아래줄부터 1로 채워진 줄이 있다면 자동적으로
          새로운 board에는 추가되지 않기 때문이다. 이 이후에 맨위부터 count까지는 0으로 채워 주어야 한다.*/
          newBoard[--count] = board[i].slice();
          break;
        }
      }
    }

    for(var i = 0; i < count; i++){
      newBoard[i] = [];
      for(var j = 0; j < BOARD_WIDTH; j++){
        newBoard[i][j] = 0;
      }
    }

    return {
      'board' : newBoard,
      'deletedLineCount' : count
    };
}

Shape.prototype.randomBlock = function(){
  return this.BLOCKS[Math.floor(Math.random()*this.BLOCKS.length)];
}

Shape.prototype.clone = function(origin,target){
  for(var i = 0; i < 4; i++){
    target[i] = origin[i].slice();
  }
}

Shape.prototype.emptyCheck = function(block){
  for(var i =0; i<4; i++){
    for(var j=0; j<4; j++){
      if(block[i][j]) return false;
    }
  }

  return true;
}


/*전체적으로 게임을 진행시키기 위한 데이터와 메소드를 담고있는 객체*/
function TetrisGame(){

  this.isGameOver = false;
  this.isPause = false;
  this.holdable = true;

  this.block = new Shape();

  this.score = 0;

  this.board = [];

  for(var i = 0; i < BOARD_HEIGHT; i++){
    this.board[i] = [];
    for(var j = 0; j< BOARD_WIDTH; j++){
      this.board[i][j] = 0;
    }
  }
}

/*interval 함수의 인자로 쓰일 함수이다. 시간 간격 이후에 할 일을 정의한다.
1. 현재 Gameover 상태인지 체크한다.
2. 현재 블록이 내려갔을때 겹치는지 체크한다.
  2-1. 겹치면 블록을 현재 위치에 적용시킨다
  2-2. 블록이 한 줄 다 채워졌는지 체크하여 지운다.
  2-3. 만약 새로나올 블록의 위치에 어떤 블록이 나오면 Gameover 상태로 바꾼다.
  2-4. 그게 아니라면 다음 블록을 내보낸다.

3.  겹치지 않는다면 블록을 한 칸 내린다.
*/
TetrisGame.prototype.go = function() {
  if(this.getisGameover()){
    return false;
  }

  if(this.block.intersectCheck(this.block.Y + 1, this.block.X ,this.block.currentBlock, this.board)){
    this.board = this.block.applyBlock(this.block.Y, this.block.X ,this.block.currentBlock, this.board);
    var r = this.block.deleteLine(this.board);
    this.board = r.board;
    this.score += r.deletedLineCount*r.deletedLineCount*10;
    this.setHoldable(true);
    if(this.block.intersectCheck( 0, 3 ,this.block.nextBlock, this.board)){
      this.setIsGameover(true);
    }else{
      this.block.currentBlock = this.block.nextBlock;
      this.block.nextBlock = this.block.randomBlock();
      this.block.X = 3;
      this.block.Y = 0;
    }
  }else{
    this.block.Y += 1;

  }
  return true;
}

TetrisGame.prototype.steerLeft = function() {
if(!this.block.intersectCheck(this.block.Y, this.block.X - 1 ,this.block.currentBlock, this.board)){
   this.block.X -= 1;
}
}

TetrisGame.prototype.steerRight = function() {
if(!this.block.intersectCheck(this.block.Y, this.block.X + 1 ,this.block.currentBlock, this.board)){
   this.block.X += 1;
}
}

TetrisGame.prototype.steerDown = function() {
if(!this.block.intersectCheck(this.block.Y+1, this.block.X ,this.block.currentBlock, this.board)){
   this.block.Y += 1;
}
}

TetrisGame.prototype.rotateLeft = function() {
var newBlock = rotateLeft(this.block.currentBlock);
if(!this.block.intersectCheck(this.block.Y, this.block.X ,newBlock, this.board)){
   this.block.currentBlock = newBlock;
}
}

TetrisGame.prototype.rotateRight = function() {
var newBlock = this.block.rotateRight(this.block.currentBlock);
if(!this.block.intersectCheck(this.block.Y, this.block.X ,newBlock, this.board)){
   this.block.currentBlock = newBlock;
}
}

TetrisGame.prototype.letFall = function() {
  while(!this.block.intersectCheck(this.block.Y + 1, this.block.X ,this.block.currentBlock, this.board)){
     this.block.Y += 1;
  }
  this.go();
}

TetrisGame.prototype.hold = function() {
  this.holdable = false;
  /* hold블록이 비어있으면 currentBlock에 nextblock을 넣어줘야 한다.*/
  if(this.block.emptyCheck(this.block.holdBlock)){
    this.block.clone(this.block.currentBlock,this.block.holdBlock);
    this.block.clone(this.block.nextBlock, this.block.currentBlock);
    this.block.nextBlock = this.block.randomBlock();
  }else{
    var temp = [];
    for(var i =0; i<4; i++){
      temp[i] = [];
    }

    this.block.clone(this.block.holdBlock,temp);
    this.block.clone(this.block.currentBlock,this.block.holdBlock);
    this.block.clone(temp,this.block.currentBlock);

  }

}

TetrisGame.prototype.getBlockX = function() {
return this.block.X;
}

TetrisGame.prototype.getBlockY = function() {
return this.block.Y;
}

TetrisGame.prototype.getisGameover = function() {
return this.isGameOver;
}

TetrisGame.prototype.getisPause = function() {
return this.isPause;
}

TetrisGame.prototype.setIsGameover = function(bool) {
this.isGameOver = bool;
}

TetrisGame.prototype.setIsPause = function(bool) {
this.isPause = bool;
}

TetrisGame.prototype.getScore = function() {
return this.score;
}
TetrisGame.prototype.getCurrentBlock = function() {
return this.block.currentBlock;
}

TetrisGame.prototype.getNextBlock = function() {
return this.block.nextBlock;
}

TetrisGame.prototype.setHoldBlock = function(input) {
  this.block.holdBlock = input;
}

TetrisGame.prototype.getHoldBlock = function() {
return this.block.holdBlock;
}

TetrisGame.prototype.getHoldable = function() {
return this.holdable;
}

TetrisGame.prototype.setHoldable = function(input) {
  this.holdable = input;
}

TetrisGame.prototype.getBoard = function() {
return this.block.applyBlock(this.block.Y, this.block.X ,this.block.currentBlock, this.board);
}

function tetris_run() {
  clearInterval(intervalHandler);
  game = new TetrisGame();
  play();
}

function play() {
  intervalHandler = setInterval(
    function () {
      if (game.go()){
        redraw();
      }
    },
    FALLING_TIME
  );
}

function keyPressed(){
  var mustpause = false;
  if(game.getisPause()){
    if(keyCode === ENTER){
      game.setIsPause(false);
      play();
    }else if(key === 'R'){
      tetris_run();
    }
  }else{
    if(keyCode === ENTER){
      mustpause = true;
    }else if(key === 'R'){
      tetris_run();
    }else if(key === 'A'){
      game.rotateLeft();
    }else if(key === 'S'){
      game.rotateRight();
    }else if(keyCode === KEY_SPACE){/*space bar*/
      game.letFall();
    }else if(keyCode === KEY_SHIFT){/*shift*/
      if(game.getHoldable()){
        game.hold();
      }
    }else if(keyCode === LEFT_ARROW){
      game.steerLeft();
    }else if(keyCode === RIGHT_ARROW){
      game.steerRight();
    }else if(keyCode === DOWN_ARROW){
      game.steerDown();
    }else if(keyCode === UP_ARROW){
      game.rotateRight();
    }

    if (mustpause) {
      clearInterval(intervalHandler);
      game.setIsPause(true);
    }
    redraw();

  }
}

/*************여기서 부터는 게임 화면을 그리는 부분이다.****************혀/

/*P5.js의 메소드 이다. 프로그램이 실행 되기전 전처리를 맡는다.*/
function setup() {
  createCanvas(310, 850);
  textSize(20);
  noLoop();
  tetris_run();
}

/*P5.js의 메소드 이다. redraw()에 의해 반복적으로 호출되어 게임 화면을 현재 상태에 맞게 그려준다.*/

function draw(){
    clear();
    var startX = 0,startY = 0;
    draw_nextBlock(game.getNextBlock(),startX,startY);
    draw_holdBlock(game.getHoldBlock(),startX,startY);
    draw_tetrisBoard(game.getBoard(),startX,startY);
    draw_score(startX,startY);
    draw_state(game.getisPause(),game.getisGameover(),startX,startY)
}

function draw_tetrisBoard(board,Sx,Sx){
  draw_block(board,BOARD_HEIGHT,BOARD_WIDTH,0+Sx,170+Sx);
}

function draw_block(board, rowNum, colNum ,Sx,Sy){
   for(var i = 0; i < rowNum; i++){
    for(var j = 0; j < colNum; j++){
      /*뭔가 for문안에서 push pop이 발생하니 느릴 것 같다.*/
      push();
      translate(Sx + j*BLOCK_WIDTH ,Sy + i*BLOCK_HEIGHT);
      var colorType = '#000000';
      switch (board[i][j]) {
        case 11:
          colorType = '#ed0345';
          break;
        case 12:
          colorType = '#ef6a32';
          break;
        case 13:
          colorType = '#fbbf45';
          break;
        case 14:
          colorType = '#aad962';
          break;
        case 15:
          colorType = '#03c383';
          break;
        case 16:
          colorType = '#017351';
          break;
        case 17:
          colorType = '#a12a5e';
          break;
      }
      fill(color(colorType));/*black*/
      rect(0,0,BLOCK_WIDTH,BLOCK_HEIGHT);
      pop();
    }
  }
}

function draw_nextBlock(board,Sx,Sy){
  push();
  translate(0 + Sx,0 + Sy);
  text("Next Block", 0, 20);
  pop();
  draw_block(board,4,4,0+Sx,30+Sy);
}

function draw_holdBlock(board,Sx,Sy){
  push();
  translate(180+Sx,0+Sy);
  text("Hold Block", 0, 20);
  pop();
  draw_block(board,4,4,180+Sx,30+Sy);

}

function draw_score(Sx,Sy){
  var str = "SCORE";
  var score = game.getScore();
  push();
  translate(0,790);
  rect(0, 0, 120, 50);
  text(str, 10+Sx, 20+Sy);
  text(score, 10+Sx, 45+Sy);
  pop();
}

function draw_state(isPaused, isGameOver,Sx,Sy){
  push();
  translate(180,790);
  rect(0, 0, 120, 50);

  if(isGameOver){
    text("GAME OVER", 10+Sx, 35+Sy);
    return;
  }

  if(isPaused){
    text("PAUSED", 25+Sx, 35+Sy);
  }

}

function draw_keys(){
  push();
  translate(0,400);
  text("keys", 20, 20);

  text("Cursor Keys : Steer", 20, 60);
  text("a/s/up key : Rotate", 20, 80);
  text("Space bar : Let fall", 20, 100);
  text("shift : hold block", 20, 120);
  text("Enter : Toggle pause", 20, 140);
  text("r : Restart game", 20, 160);
  pop();
}
