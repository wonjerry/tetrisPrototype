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
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
  ],
  [
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
  ],
  [
    [1,0,0,0],
    [1,1,0,0],
    [1,0,0,0],
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

document.write(BLOCKS[0]);



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
