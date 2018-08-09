document.onkeydown = checkKey;

var levels = [
  {
    field: [
      [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0]
    ],
    hole: {
      x: 10,
      y: 3
    },
    cube: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  },

  {
    field: [
      [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0]
    ],
    hole: {
      x: 10,
      y: 3
    },
    cube: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  }
];

var level = 0;

function start() {
  field = levels[level].field;
  cube = Object.assign({}, levels[level].cube);
  hole = levels[level].hole;
  steps = "";
  playing = true;
  loose = false;
  draw();
}

function checkKey(e) {
  if (!playing || loose) return;

  e = e || window.event;

  if (e.keyCode == "38") {
    move("U");
    e.preventDefault();
  } else if (e.keyCode == "40") {
    move("D");
    e.preventDefault();
  } else if (e.keyCode == "37") {
    move("L");
    e.preventDefault();
  } else if (e.keyCode == "39") {
    move("R");
    e.preventDefault();
  }
}

function move(e) {
  steps = e;
  draw();
}

var loose = false;
var playing = false;

var space = 2;
var cellSize = 50;

var field = [];

var cube;

var hole;

var steps = "";

var w, h, offset, wPix, hPix;

function draw() {
  w = field[0].length;
  h = field.length;

  offset = 2 * (space + cellSize);

  wPix = w * (space + cellSize) + space + 2 * offset;
  hPix = h * (space + cellSize) + space + 2 * offset;

  var ctx = createCanvas();
  drawField(ctx);
  drawCube(ctx);
  drawHole(ctx);
  for (var k = 0; k < steps.length; k++) {
    processStep(steps.charAt(k));
  }
}

function processStep(step) {
  moveCube(step);
  var ctx = createCanvas();
  drawField(ctx);
  drawCube(ctx);
  drawHole(ctx);
}

function moveCube(step) {
  if (step === "R") {
    cube.x = cube.x + 1 + cube.w;
    if (cube.w === 1) {
      cube.w = 0;
    } else if (cube.h === 0) {
      cube.w = 1;
    }
  }
  if (step === "L") {
    cube.x = cube.x - 1;
    if (cube.w === 1) {
      cube.w = 0;
    } else if (cube.h === 0) {
      cube.w = 1;
      cube.x--;
    }
  }
  if (step === "D") {
    cube.y = cube.y + 1 + cube.h;
    if (cube.h === 1) {
      cube.h = 0;
    } else if (cube.w === 0) {
      cube.h = 1;
    }
  }
  if (step === "U") {
    cube.y = cube.y - 1;
    if (cube.h === 1) {
      cube.h = 0;
    } else if (cube.w === 0) {
      cube.h = 1;
      cube.y--;
    }
  }
}

function createCanvas() {
  document.getElementById("root").innerHTML = "";
  var canvas = document.createElement("canvas");
  canvas.width = wPix;
  canvas.height = hPix;
  document.getElementById("root").appendChild(canvas);
  return canvas.getContext("2d");
}

function drawField(ctx) {
  ctx.fillRect(0, 0, wPix, hPix);
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {
      if (field[y][x] === 1) {
        drawRect(ctx, x, y, "#fff");
      }
    }
  }
}

function drawCube(ctx) {
  var color = "#0f0";
  if (
    cube.x < 0 ||
    cube.y < 0 ||
    cube.x + cube.w > w - 1 ||
    cube.y + cube.h > h - 1 ||
    field[cube.y][cube.x] === 0 ||
    field[cube.y + cube.h][cube.x + cube.w] === 0
  ) {
    loose = true;
    color = "#f00";
  }
  if (cube.x === hole.x && cube.y === hole.y && cube.h + cube.w === 0) {
    level++;
    start();
  }
  drawRect(ctx, cube.x, cube.y, color);
  drawRect(ctx, cube.x + cube.w, cube.y + cube.h, color);
  console.log(cube);
}

function drawHole(ctx) {
  drawRect(ctx, hole.x, hole.y, "#aaa");
}

function drawRect(ctx, x, y, color) {
  ctx.fillStyle = color;
  var xPix = x * (space + cellSize) + space + offset;
  var yPix = y * (space + cellSize) + space + offset;
  ctx.fillRect(xPix, yPix, cellSize, cellSize);
}
