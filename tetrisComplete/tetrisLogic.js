var BOARD_WIDTH = 10;
var BOARD_HEIGHT = 20;

var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

var FALLING_TIME = 400;

var KEY_SPACE = 32;
var KEY_SHIFT = 16;

var BLOCKS = [
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

var game;
var intervalHandler;

function rotateRight(block){
  return [
    [block[3][0],block[2][0],block[1][0],block[0][0]],
    [block[3][1],block[2][1],block[1][1],block[0][1]],
    [block[3][2],block[2][2],block[1][2],block[0][2]],
    [block[3][3],block[2][3],block[1][3],block[0][3]]
  ];
}

function rotateLeft(block){
  return [
    [block[0][3],block[1][3],block[2][3],block[3][3]],
    [block[0][2],block[1][2],block[2][2],block[3][2]],
    [block[0][1],block[1][1],block[2][1],block[3][1]],
    [block[0][0],block[1][0],block[2][0],block[3][0]]
  ];
}

function intersectCheck(y,x,block,board){
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

function applyBlock(y,x,block,board){
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

function deleteLine(board){
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

function randomBlock(){
  return BLOCKS[Math.floor(Math.random()*BLOCKS.length)];
}

function TetrisGame(){
  this.blockX = 3;
  this.blockY = 0;
  this.isGameOver = false;
  this.isPause = false;
  this.score = 0;
  this.currentBlock = randomBlock();
  this.nextBlock = randomBlock();
  this.holdable = true;
  this.holdBlock = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];

  this.board = [];

  for(var i = 0; i < BOARD_HEIGHT; i++){
    this.board[i] = [];
    for(var j = 0; j< BOARD_WIDTH; j++){
      this.board[i][j] = 0;
    }
  }
}

/*interval 함수의 인자로 쓰일 함수이다. 시간 간격 이후에 할 일을 정의한다.*/
TetrisGame.prototype.go = function() {
  if(this.getisGameover()){
    return false;
  }

  if(intersectCheck(this.blockY + 1, this.blockX ,this.currentBlock, this.board)){
    this.board = applyBlock(this.blockY, this.blockX ,this.currentBlock, this.board);
    var r = deleteLine(this.board);
    this.board = r.board;
    this.score += r.deletedLineCount*r.deletedLineCount*10;
    this.setHoldable(true);
    if(intersectCheck( 0, 3 ,this.nextBlock, this.board)){
      this.setIsGameover(true);
    }else{
      this.currentBlock = this.nextBlock;
      this.nextBlock = randomBlock();
      this.blockX = 3;
      this.blockY = 0;
    }
  }else{
    this.blockY += 1;

  }
  return true;
}

TetrisGame.prototype.steerLeft = function() {
if(!intersectCheck(this.blockY, this.blockX - 1 ,this.currentBlock, this.board)){
   this.blockX -= 1;
}
}

TetrisGame.prototype.steerRight = function() {
if(!intersectCheck(this.blockY, this.blockX + 1 ,this.currentBlock, this.board)){
   this.blockX += 1;
}
}

TetrisGame.prototype.steerDown = function() {
if(!intersectCheck(this.blockY+1, this.blockX ,this.currentBlock, this.board)){
   this.blockY += 1;
}
}

TetrisGame.prototype.rotateLeft = function() {
var newBlock = rotateLeft(this.currentBlock);
if(!intersectCheck(this.blockY, this.blockX ,newBlock, this.board)){
   this.currentBlock = newBlock;
}
}

TetrisGame.prototype.rotateRight = function() {
var newBlock = rotateRight(this.currentBlock);
if(!intersectCheck(this.blockY, this.blockX ,newBlock, this.board)){
   this.currentBlock = newBlock;
}
}

TetrisGame.prototype.letFall = function() {
  while(!intersectCheck(this.blockY + 1, this.blockX ,this.currentBlock, this.board)){
     this.blockY += 1;
  }
  this.go();
}

TetrisGame.prototype.hold = function() {
  this.holdable = false;
  if(emptyCheck(this.holdBlock)){
    clone(this.currentBlock,this.holdBlock);
    clone(this.nextBlock, this.currentBlock);
    this.nextBlock = randomBlock();
  }else{
    var temp = [];
    for(var i =0; i<4; i++){
      temp[i] = [];
    }

    clone(this.holdBlock,temp);
    clone(this.currentBlock,this.holdBlock);
    clone(temp,this.currentBlock);

  }

}

function clone(origin,target){
  for(var i = 0; i < 4; i++){
    target[i] = origin[i].slice();
  }
}

function emptyCheck(block){
  for(var i =0; i<4; i++){
    for(var j=0; j<4; j++){
      if(block[i][j]) return false;
    }
  }

  return true;
}

TetrisGame.prototype.getBlockX = function() {
return this.blockX;
}

TetrisGame.prototype.getBlockY = function() {
return this.blockY;
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
return this.currentBlock;
}

TetrisGame.prototype.getNextBlock = function() {
return this.nextBlock;
}

TetrisGame.prototype.setHoldBlock = function(input) {
this.holdBlock = input;
}

TetrisGame.prototype.getHoldBlock = function() {
return this.holdBlock;
}

TetrisGame.prototype.getHoldable = function() {
return this.holdable;
}

TetrisGame.prototype.setHoldable = function(input) {
this.holdable = input;
}

TetrisGame.prototype.getBoard = function() {
return applyBlock(this.blockY, this.blockX ,this.currentBlock, this.board);
}

function setup() {
  createCanvas(800, 600);
  textSize(20);
  noLoop();
  tetris_run();
}

function draw(){
    clear();
    draw_tetrisLeftPanel(game);
    draw_tetrisRightPanel(game);
    draw_tetrisSubPanel(game);
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

function draw_tetrisRightPanel(game){
  var board = game.getBoard();
  draw_tetrisBoard(board);
}

function draw_tetrisSubPanel(game){
  var board = game.getHoldBlock();
  draw_holdBlock(board);
}

function draw_tetrisBoard(board){
  draw_block(board,BOARD_HEIGHT,BOARD_WIDTH,300,0);
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
          colorType = '#ff0000';
          break;
        case 12:
          colorType = '#7cfc00';
          break;
        case 13:
          colorType = '#000080';
          break;
        case 14:
          colorType = '#00ffff';
          break;
        case 15:
          colorType = '#8a2be2';
          break;
        case 16:
          colorType = '#ffff00';
          break;
        case 17:
          colorType = '#1a8072';
          break;
      }
      fill(color(colorType));/*black*/
      rect(0,0,BLOCK_WIDTH,BLOCK_HEIGHT);
      pop();
    }
  }
}

function draw_tetrisLeftPanel(game){
  draw_nextBlock(game.getNextBlock());
  draw_score(false,false);
  draw_keys();
}

function draw_nextBlock(board){
  push();
  translate(0,0);
  text("Next Block", 20, 20);
  draw_block(board,4,4,20,40);
}

function draw_holdBlock(board){
  push();
  translate(620,0);
  text("Hold Block", 20, 20);
  pop();
  draw_block(board,4,4,640,40);

}

function draw_score(isPaused, isGameOver){
  var x=20;
  var y=20;
  var str = 'score : ' + game.getScore();
  push();
  translate(0,200);
  text(str, x, y);

  if(game.getisPause()){
    text("PAUSED", 40, y+=40);
  }

  if(game.getisGameover()){
    text("GAME OVER", 40, y+=40);
  }

  pop();
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
