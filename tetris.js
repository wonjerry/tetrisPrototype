var BOARD_WIDTH = 10;
var BOARD_HEIGHT = 20;

var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

var FALLING_TIME = 40;

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
        if( i + y > BOARD_HEIGHT || j + x > BOARD_WIDTH || j + x < 0 || board[y+j][x+i]){
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
        newBoard[i][j] = 0;
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
      if(!board[i][j]){/* 0인 성분이 있으면 한줄이 다 안채워진것이므로 붙여넣기 해 준다.*/
        /*count--로 아래부터 새로운 board를 채워주는 이유는 맨 아래줄부터 1로 채워진 줄이 있다면 자동적으로
        새로운 board에는 추가되지 않기 때문이다. 이 이후에 맨위부터 count까지는 0으로 채워 주어야 한다.*/
        newBoard[--count] = board[i].slice();
        break;
      }
    }
  }

   function randomBlock(){
     return BLOCKS[Math.floor(Math.random()*BLOCKS.length)];
   }

   function tetrisGame(){
     this.blockX = 0;
     this.blockY = 0;
     this.isGameOver = false;
     this.isPause = false;
     this.score = 0;
     this.currentBlock = randomBlock();
     this.nextBlock = randomBlock();

     this.board = [];

     for(var i = 0; i < BOARD_HEIGHT; i++){
       for(var j = 0; j< BOARD_WIDTH; j++){
         board[i][j] = 0;
       }
     }
   }

   /*interval 함수의 인자로 쓰일 함수이다. 시간 간격 이후에 할 일을 정의한다.*/
   tetrisGame.prototype.go = function() {
     if(tetrisGame.isGameOver){
       return false;
     }

     if(intersectCheck(this.blockY + 1,this.blockX,this.currentBlock,this.board)){
       this.board = applyBlock(this.blockY,this.blockX,this.currentBlock,this.board);

     }else{
       this.blockY += 1;
     }

   }

  for(var i =0; i<count; i++){
    newBoard[i] = [];
    for(var j = 0; j<BOARD_WIDTH; j++){
      newBoard[i][j] = 0;
    }
  }
  /*점수 계산을 위해 count값도 필요하기 때문에 객체로 만들어서 리턴 해 준다.*/
  return {
    'newBoard' : newBoard,
    'deletedLine' : count
  };
}


function draw_tetris(containerElement){
  var leftPanel = draw_tetrisLeftPanel();
  var rightPanel = draw_tetrisRightPanel();
  containerElement.append(leftPanel);
  containerElement.append(rightPanel);
}

function draw_tetrisRightPanel(game) {
  /*var boardElem = draw_tetrisBoard(game);*/
  var rightPaneElem = document.createElement('div');
  rightPaneElem.classList.add('tetrisRightPane');
  /*rightPaneElem.appendChild(boardElem);*/
  return rightPaneElem;
}

function draw_tetrisLeftPanel(){
  var leftPanel = document.createElement('div');
  leftPanel.classList.add('tetrisLeftPanel');
  var nextBlockPanel = draw_nextBlock();
  var scorePanel = draw_score();
  var keysPanel = draw_keys();

  leftPanel.append(scorePanel);
  leftPanel.append(nextBlockPanel);
  leftPanel.append(keysPanel);
  return leftPanel;
}

function draw_block(game){

}

function draw_tetrisBoard(game){

}

function draw_nextBlock(){
  var blockElem = document.createElement('div');
  blockElem.classList.add('tetrisNextblock');
  blockElem.innerHTML =
      "<p>블록이 오는 자리</p>";
      /*만약 pause나 gameover이면 여기다가 if문으로 컨트롤 해 주어야 한다.*/
      return blockElem;
}

function draw_score(/*game*/){
  /*var score = game.getScore();*/
  var scoreElem = document.createElement('div');
  scoreElem.classList.add('tetrisScore');
  scoreElem.innerHTML =
      "<p> score : 10000 </p>";
      /*만약 pause나 gameover이면 여기다가 if문으로 컨트롤 해 주어야 한다.*/

  return scoreElem;
}

function draw_keys(){
  var usageElem = document.createElement('div');
  usageElem.classList.add('tetrisUsage');
  usageElem.innerHTML =
      "<table>" +
      "<tr><th>Cursor Keys</th><td>Steer</td></tr>" +
      "<tr><th>a/s</th><td>Rotate</td></tr>" +
      "<tr><th>Space bar</th><td>Let fall</td></tr>" +
      "<tr><th>Enter</th><td>Toggle pause</td></tr>" +
      "<tr><th>r</th><td>Restart game</td></tr>" +
      "</table>";
  return usageElem;
}
