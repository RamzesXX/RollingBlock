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

var solver;
var level = 0;
var solution = [];

function start() {
  field = levels[level].field;
  solver = new Solver(field);
  cube = Object.assign({}, levels[level].cube);
  hole = levels[level].hole;
  steps = "";
  playing = true;
  loose = false;
  solution = solver.getPath(0, 0, hole.x, hole.y).split(" -> ");
  draw();
}

function botStart() {
  start();
  var intervalID = setInterval(() => {
    if (solution.length > 0 && (playing && !loose)) {
      move(solution.shift());
    } else {
      clearInterval(intervalID);
    }
  }, 500);
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
  //console.log(cube);
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

function Solver(field_) {
  var Up = "U";
  var Down = "D";
  var Left = "L";
  var Right = "R";
  var Start = "S";

  var X = "X";
  var Y = "Y";
  var Z = "Z";

  var BAR_SIZE = 2;
  var ZERO = 0;
  var ONE = 1;

  var allowedMovements = {};
  var movementsForOrientation;

  var field = field_;
  var fieldSizeY = field_.length;
  var fieldSizeX = field_[0].length;
  var visitTracker = {};

  function AllowedMovement(dX, dY, toOrientation) {
    this.dX = dX;
    this.dY = dY;
    this.toOrientation = toOrientation;
  }

  function Position(x, y, orientation) {
    this.x = x;
    this.y = y;
    this.orientation = orientation ? orientation : Z;
    this.toString = function() {
      return x + "," + y + "," + orientation;
    };

    this.toString = this.toString.bind(this);
  }

  function VisitInfo(fromPosition, action) {
    this.fromPosition = fromPosition;
    this.action = action;
  }

  // from Z orientation movements
  movementsForOrientation = {};
  movementsForOrientation[Left] = new AllowedMovement(-BAR_SIZE, ZERO, X);
  movementsForOrientation[Right] = new AllowedMovement(ONE, ZERO, X);
  movementsForOrientation[Up] = new AllowedMovement(ZERO, -BAR_SIZE, Y);
  movementsForOrientation[Down] = new AllowedMovement(ZERO, ONE, Y);
  allowedMovements[Z] = movementsForOrientation;

  // from Y orientation movements
  movementsForOrientation = {};
  movementsForOrientation[Left] = new AllowedMovement(-ONE, ZERO, Y);
  movementsForOrientation[Right] = new AllowedMovement(ONE, ZERO, Y);
  movementsForOrientation[Up] = new AllowedMovement(ZERO, -ONE, Z);
  movementsForOrientation[Down] = new AllowedMovement(ZERO, BAR_SIZE, Z);
  allowedMovements[Y] = movementsForOrientation;

  // from X orientation movements
  movementsForOrientation = {};
  movementsForOrientation[Left] = new AllowedMovement(-ONE, ZERO, Z);
  movementsForOrientation[Right] = new AllowedMovement(BAR_SIZE, ZERO, Z);
  movementsForOrientation[Up] = new AllowedMovement(ZERO, -ONE, X);
  movementsForOrientation[Down] = new AllowedMovement(ZERO, ONE, X);
  allowedMovements[X] = movementsForOrientation;

  function checkIfBarCanBePlaced(newX, newY, dx, dy) {
    for (var i = 0; i < BAR_SIZE; i++) {
      if (field[newY + dy * i][newX + dx * i] === ZERO) {
        return false;
      }
    }

    return true;
  }

  function isMovementPossible(currentPosition, movement) {
    var newX = currentPosition.x + movement.dX;
    var newY = currentPosition.y + movement.dY;

    if (movement.toOrientation === Z) {
      return (
        newX >= 0 &&
        newX < fieldSizeX &&
        newY >= 0 &&
        newY < fieldSizeY &&
        field[newY][newX] === ONE
      );
    }

    if (movement.toOrientation === X) {
      return (
        newX >= 0 &&
        newX + BAR_SIZE < fieldSizeX &&
        newY >= 0 &&
        newY < fieldSizeY &&
        checkIfBarCanBePlaced(newX, newY, ONE, ZERO)
      );
    }

    if (movement.toOrientation === Y) {
      return (
        newX >= 0 &&
        newX < fieldSizeX &&
        newY >= 0 &&
        newY + BAR_SIZE < fieldSizeY &&
        checkIfBarCanBePlaced(newX, newY, ZERO, ONE)
      );
    }

    return false;
  }

  function pickPath(startPosition, finishPosition) {
    var path = [];
    var position = finishPosition;

    while (position.toString() !== startPosition.toString()) {
      var visitInfo = visitTracker[position.toString()];
      path.unshift(visitInfo);
      position = visitInfo.fromPosition;
    }

    return path;
  }

  function findPath(startPosition, finishPosition) {
    var positionsToProcess = [];

    visitTracker = {};
    positionsToProcess.push(startPosition);
    visitTracker[startPosition.toString()] = new VisitInfo(
      startPosition,
      Start
    );

    while (positionsToProcess.length > 0) {
      var currentPosition = positionsToProcess.shift();
      var availableMovements = allowedMovements[currentPosition.orientation];

      if (currentPosition.toString() === finishPosition.toString()) {
        return pickPath(startPosition, finishPosition);
      }

      Object.keys(availableMovements).forEach(movementDirection => {
        var movement = availableMovements[movementDirection];

        if (isMovementPossible(currentPosition, movement)) {
          var newPosition = new Position(
            currentPosition.x + movement.dX,
            currentPosition.y + movement.dY,
            movement.toOrientation
          );

          if (!visitTracker[newPosition.toString()]) {
            positionsToProcess.push(newPosition);
            visitTracker[newPosition.toString()] = new VisitInfo(
              currentPosition,
              movementDirection
            );
          }
        }
      });
    }

    return [];
  }

  this.getPath = function(fromX, fromY, toX, toY) {
    return findPath(new Position(fromX, fromY, Z), new Position(toX, toY, Z))
      .map(visitInfo => visitInfo.action)
      .join(" -> ");
  };
}
