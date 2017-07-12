var BOARD_WIDTH = 10;
var BOARD_HEIGHT = 20;

var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

var FALLING_TIME = 400;

var KEY_ENTER = 13;
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_UP = 38;
var KEY_A = 65;
var KEY_S = 83;
var KEY_R = 82;

var BLOCKS = [
  [
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0],
  ],
  [
    [0,0,0,0],
    [0,1,1,0],
    [0,0,1,1],
    [0,0,0,0],
  ],
  [
    [0,0,0,0],
    [0,0,1,1],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,0,1,0],
    [0,1,1,0],
    [0,0,1,0],
    [0,0,0,0],
  ],
  [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,0,1,0],
    [0,0,1,0],
    [0,1,1,0],
    [0,0,0,0],
  ]
]
/*지금은 배열을 이용하여 블록을 표시 및 회전 하였지만 전반적인 개발을 일단 마치면 bitmask방식으로 바꿔볼 예정이다.*/
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
        newBoard[i+y][j+x] = 1;
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
     if(this.isGameOver){
       return false;
     }

     if(intersectCheck(this.blockY + 1, this.blockX ,this.currentBlock, this.board)){
       this.board = applyBlock(this.blockY, this.blockX ,this.currentBlock, this.board);
       var r = deleteLine(this.board);
       this.board = r.board;
       this.score += r.deletedLineCount*r.deletedLineCount*10;
       if(intersectCheck( 0, 3 ,this.nextBlock, this.board)){
         this.isGameOver = true;
         return false;
       }
       this.currentBlock = this.nextBlock;
       this.nextBlock = randomBlock();
       this.blockX = 3;
       this.blockY = 0;
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

TetrisGame.prototype.getBoard = function() {
  return applyBlock(this.blockY, this.blockX ,this.currentBlock, this.board);
}

function draw_tetris(game, ispaused){

  var gameElem = document.createElement('div');
  gameElem.classList.add('tetrisGame');
  var leftPanel = draw_tetrisLeftPanel(game);
  var rightPanel = draw_tetrisRightPanel(game);
  gameElem.append(leftPanel);
  gameElem.append(rightPanel);

  return gameElem;
}

function draw_tetrisRightPanel(game) {
  var boardElem = draw_tetrisBoard(game);
  var rightPaneElem = document.createElement('div');
  rightPaneElem.classList.add('tetrisRightPanel');
  rightPaneElem.appendChild(boardElem);
  return rightPaneElem;
}

function draw_tetrisLeftPanel(game){
  var leftPanel = document.createElement('div');
  leftPanel.classList.add('tetrisLeftPanel');
  var nextBlockPanel = draw_nextBlock(game);
  var scorePanel = draw_score(game);
  var keysPanel = draw_keys();

  leftPanel.append(nextBlockPanel);
  leftPanel.append(scorePanel);
  leftPanel.append(keysPanel);
  return leftPanel;
}

function draw_block( borad, rowNum, colNum){
  var boardElem = document.createElement('div');
  for(var i = 0; i < rowNum; i++){
    for(var j = 0; j < colNum; j++){
      var blockElem = document.createElement('div');
      blockElem.classList.add('tetrisBlock');
      if(borad[i][j]){
        blockElem.classList.add('exist');
      }
      blockElem.style.top = i*BLOCK_HEIGHT + 'px';
      blockElem.style.left = j*BLOCK_WIDTH + 'px';
      boardElem.appendChild(blockElem);
    }
  }

  return boardElem;
}

function draw_tetrisBoard(game){
  var gameBoard = game.getBoard();
  var boardElem = draw_block(gameBoard,BOARD_HEIGHT,BOARD_WIDTH);
  boardElem.classList.add('tetrisBoard');
  return boardElem;
}

function draw_nextBlock(game){
  var blockElem = draw_block(game.nextBlock,4,4);
  blockElem.classList.add('tetrisNextblock');
  return blockElem;
}

function draw_score(game){
  var score = game.getScore();
  var scoreElem = document.createElement('div');
  scoreElem.classList.add('tetrisScore');
  scoreElem.innerHTML =
      "<p> score : "+score+" </p>";
      /*만약 pause나 gameover이면 여기다가 if문으로 컨트롤 해 주어야 한다.*/
      if(game.getisPause()){
        scoreElem.innerHTML +=
            "<p> Paused </p>";
      }
      if(game.getisGameover()){
        scoreElem.innerHTML +=
            "<p> GameOver </p>";
      }

  return scoreElem;
}

function draw_keys(){
  var usageElem = document.createElement('div');
  usageElem.classList.add('tetrisUsage');
  usageElem.innerHTML =
      "<table>" +
      "<tr><th>Cursor Keys</th><td>Steer</td></tr>" +
      "<tr><th>a/s/up key</th><td>Rotate</td></tr>" +
      "<tr><th>Space bar</th><td>Let fall</td></tr>" +
      "<tr><th>Enter</th><td>Toggle pause</td></tr>" +
      "<tr><th>r</th><td>Restart game</td></tr>" +
      "</table>";
  return usageElem;
}

function redraw(game, isPaused, containerElem) {
  var gameElem = draw_tetris(game, isPaused);
  containerElem.innerHTML = '';
  containerElem.appendChild(gameElem);
}

function tetris_run(containerElem) {
  var game = new TetrisGame();

  play();

  function play() {
    var intervalHandler = setInterval(
      function () {
        if (game.go()){
          redraw(game, false, containerElem);
        }
      },
      FALLING_TIME
    );

    function keyHandler(kev) {
        if (kev.shiftKey || kev.altKey || kev.metaKey)
          return;
        var consumed = true;
        var mustpause = false;
        if (kev.keyCode === KEY_ENTER) {
          mustpause = true;
        } else if (kev.keyCode === KEY_R) {
          game = new TetrisGame();
        } else if (kev.keyCode === KEY_UP) {
          game.rotateLeft();
        }else if (kev.keyCode === KEY_LEFT) {
          game.steerLeft();
        } else if (kev.keyCode === KEY_RIGHT) {
          game.steerRight();
        } else if (kev.keyCode === KEY_DOWN) {
          game.steerDown();
        } else if (kev.keyCode === KEY_A) {
          game.rotateLeft();
        } else if (kev.keyCode === KEY_S) {
          game.rotateRight();
        } else if (kev.keyCode === KEY_SPACE) {
          game.letFall();
        } else {
          consumed = false;
        }
        if (consumed) {
          kev.preventDefault();
          if (mustpause) {
            containerElem.removeEventListener('keydown', keyHandler);
            clearInterval(intervalHandler);
            game.setIsPause(true);
            pause();
          } else {
            redraw(game, false, containerElem);
          }
        }
    }

    containerElem.addEventListener('keydown', keyHandler);
  }

  function pause(){

    function keyHandler(keyValue){
      if(keyValue.keyCode === KEY_ENTER){
        containerElem.removeEventListener('keydown',keyHandler);
        game.setIsPause(false);
        play();
      }
    }

    containerElem.addEventListener('keydown', keyHandler);
    redraw(game, true, containerElem);
  }

}
