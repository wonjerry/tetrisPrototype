// TETRIS!
// user settings

var slowness= 10; // make larger to make the pieces fall slower!
var W = 10; // width in number of pieces
var H = 22; // height in number of pieces
var block_size = 18; // for drawing: size of a block
var calculated_width = W * block_size,
    calculated_height = H * block_size,
    board,
    pending_shape,
    active_shape,
    context,
    level,
    score,
    lines,
    counter;

var BLOCK_EMPTY = 0,
    BLOCK_FULL = 1,
    BLOCK_ACTIVE = 2;

var Shape = function(){

  var self = this;

  this.shapes = [

    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 1, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0]],
    [[0, 0, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0]]
  ];

  this.rotate = function() {
    var new_shape = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    for (var j = 0; j < 4; j++){
      for (var i = 0; i < 4; i++) {
        new_shape[i][j] = self.shape[4 - j - 1][i];
      }
    }

    self.shape = new_shape;
  };

  this.left_edge = function() {
    for (var x = 0; x < 4; x++){
      for (var y = 0; y < 4; y++){
        if (self.shape[y][x] === BLOCK_FULL) {
          return x;
        }
      }
    }
  };

  this.right_edge = function() {
    for (var x = 3; x >= 0; x--){
      for (var y = 0; y < 4; y++){
        if (self.shape[y][x] === BLOCK_FULL) {
            return x;
        }
      }
    }
  };

  this.bottom_edge = function() {

    for (var y = 3; y >= 0; y--){

      for (var x = 0; x < 4; x++){

        if (self.shape[y][x] === BLOCK_FULL){

          return y;

        }

      }

    }

  };

  // spawn a random shape
  this.initialize = function() {
    var rotations = floor(random(0,4));
    var shape_idx = floor(random(0,this.shapes.length));
    this.shape = this.shapes[shape_idx];
    for (var i = 0; i < rotations; i++) {
      self.rotate();
    }
  };

  // clone this shape
  this.clone = function() {
    var s = new Shape();
    s.x = self.x;
    s.y = self.y;
    s.shape = self.shape;
    return s;
    };
};

var add_shape=function() {

  active_shape = pending_shape;

  active_shape.x = W / 2 - 2;

  active_shape.y = -1;

  pending_shape = new Shape();

  pending_shape.initialize();

  if (this.is_collision(active_shape)){

    this.reset();

  }

};

var reset = function() {

  board = [];

  for (var y = 0; y < H; y++) {

    var row = [];

    for (var x = 0; x < W; x++){

     row.push(0);

    }

    board.push(row);

  }

  score = 0;

  lines = 0;

  level = 1;

  pending_shape = new Shape();

  pending_shape.initialize();

  add_shape();

};

var rotate_shape=function() {

  var rotated_shape = active_shape.clone();

  rotated_shape.rotate();

  if (rotated_shape.left_edge() + rotated_shape.x < 0){

    rotated_shape.x = -rotated_shape.left_edge();

  }else if (rotated_shape.right_edge() + rotated_shape.x >= W){

    rotated_shape.x = W - rotated_shape.right_edge() - 1;

  }

  if (rotated_shape.bottom_edge() + rotated_shape.y > H) {

    return false;

  }

  if (!this.is_collision(rotated_shape)){

   active_shape = rotated_shape;

  }

};

var move_left=function() {

  active_shape.x--;

  if (this.out_of_bounds() || this.is_collision(active_shape)) {

    active_shape.x++;

    return false;

  }

  return true;

};

var move_right=function() {

  active_shape.x++;

  if (this.out_of_bounds() || this.is_collision(active_shape)) {

    active_shape.x--;

    return false;

  }

  return true;

};

var move_down=function() {

  active_shape.y++;

  if (this.check_bottom() || this.is_collision(active_shape)) {

    active_shape.y--;

    this.shape_to_board();

    add_shape();

    return false;

  }

  return true;

};

var out_of_bounds=function() {

  if (active_shape.x + active_shape.left_edge() < 0){

   return true;

  }

  else if (active_shape.x + active_shape.right_edge() >= W){

    return true;

  }

  return false;

};

var check_bottom=function() {

  return (active_shape.y + active_shape.bottom_edge() >= H);

};

var is_collision= function(shape) {

  for (var y = 0; y < 4; y++){

    for (var x = 0; x < 4; x++) {

      if (y + shape.y < 0) {

       continue;

      }

      if (shape.shape[y][x] && board[y + shape.y][x + shape.x]){

        return true;

      }

    }

  }

  return false;

};

var test_for_line=function() {

  for (var y = H - 1; y >= 0; y--) {

    var counter = 0;

    for (var x = 0; x < W; x++){

      if (board[y][x] === BLOCK_FULL) {

        counter++;

      }

    }

    if (counter === W) {

      this.process_line(y);

      return true;

    }

  }

  return false;

};

var process_line=function(y_to_remove) {

  lines++;

  score += level;

  if (lines % 10 === 0){

   level++;

  }

  for (var y = y_to_remove - 1; y >= 0; y--){

    for (var x = 0; x < W; x++){

      board[y + 1][x] = board[y][x];

    }

  }

};

var shape_to_board=function() {

  // transpose onto board

  for (var y = 0; y < 4; y++){

    for (var x = 0; x < 4; x++) {

      var dx = x + active_shape.x,

          dy = y + active_shape.y;

      if (dx < 0 || dx >= W || dy < 0 || dy >=H){

          continue;

      }

      if (active_shape.shape[y][x] === BLOCK_FULL){

        board[dy][dx] = BLOCK_FULL;

      }

    }

  }

  var lines_found = 0;

  while (test_for_line()) {

    lines_found++;

  }

  return lines_found;

};

var draw_game_board=function() {

  background(255, 255, 255);

  fill(128, 128, 128);

  rect(0, 0, calculated_width, calculated_height);

  fill(50,50,50);

  var y=0;

  var x=0;

  for (y = 0; y < H; y++){

    for (x = 0; x < W; x++){

      if (board[y][x] === BLOCK_FULL || board[y][x] === BLOCK_ACTIVE){

        this.draw_block(x, y);

      }

    }

  }

  fill(255, 255, 255);

  for (y = 0; y < 4; y++){

    for (x = 0; x < 4; x++) {

      var dx = x + active_shape.x,

          dy = y + active_shape.y;

      if (active_shape.shape[y][x] === BLOCK_FULL){

        this.draw_block(dx, dy);

      }

    }

  }

  fill(0, 0, 0);

  text("LINES: " + lines, 300, 20);

};

var draw_block=function(x, y) {

  rect(x * block_size, y * block_size, block_size, block_size);

};

var update_board=function() {

  move_down();

};

reset();

counter=0;

var wasup=0, wasdown=0, wasleft=0, wasright=0;

var leftcount=0, rightcount=0;

var draw = function() {

  counter++;

  // update all variables

  if(counter%slowness===0) { update_board(); }

  // draw the board

  draw_game_board();

  // handle user input

  var isup=0, isdown=0, isleft=0, isright=0;

  if (keyIsPressed && keyCode === LEFT) { isleft=1; }

  if (keyIsPressed && keyCode === RIGHT) { isright=1; }

  if (keyIsPressed && keyCode === DOWN) { isdown=1; }

  if (keyIsPressed && keyCode === UP) { isup=1; }

  if((isleft===1 && wasleft===0) || leftcount>5) { move_left(); }

  if((isright===1 && wasright===0) || rightcount>5) { move_right(); }

  if(isdown===1) { move_down(); }

  if(isup===1 && wasup===0) { rotate_shape(); }

  if(wasright===1 && isright===1) { rightcount++; }

  if(wasleft===1 && isleft===1) { leftcount++; }

  if(isright===0) { rightcount=0; }

  if(isleft===0) { leftcount=0; }

  wasleft= isleft;

  wasright= isright;

  wasdown= isdown;

  wasup= isup;

};
