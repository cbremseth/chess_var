function checkForCheck(game, piece, source, target) {
  // Store the current board (deep copy)
  const savedBoard = JSON.parse(JSON.stringify(game.board.position));
  const savedValidMoves = JSON.parse(JSON.stringify(game.validMoves));
  console.log("Before Move:", JSON.stringify(game.board.position));
  // Move piece
  game.board.position[target] = piece;
  delete game.board.position[source];
  console.log("After Move:", JSON.stringify(game.board.position));
  // Update all valid moves
  updateAllValidMoves(game);
  console.log("After Move:", JSON.stringify(game.board.position));
  let inCheck = false;
  // Get king's position and color to check against
  const whiteKing = "wK";
  const blackKing = "bK";
  for (let position in game.validMoves) {
    for (let move of game.validMoves[position]) {
      if (game.board.position[move] == whiteKing) {
        inCheck = true;
        break;
      }
    }
    if (inCheck) break;
  }
  for (let position in game.validMoves) {
    for (let move of game.validMoves[position]) {
      if (game.board.position[move] == blackKing) {
        inCheck = true;
        break;
      }
    }
    if (inCheck) break;
  }

  // Restore the board's position
  game.board.position = savedBoard;
  console.log("After Restore:", JSON.stringify(game.board.position));
  game.validMoves = savedValidMoves;
  console.log(inCheck);
  return inCheck;
}

function knightMoves(game, piece, source) {
  if (!game.validMoves[source]) {
    game.validMoves[source] = [];
  }

  const letters = "abcdefgh";
  const currentX = letters.indexOf(source[0]);
  const currentY = 8 - parseInt(source[1]);

  // The potential moves for a knight
  const directions = [
    [-2, 1], // 2 squares up, 1 square right
    [-1, 2], // 1 square up, 2 squares right
    [1, 2], // 1 square down, 2 squares right
    [2, 1], // 2 squares down, 1 square right
    [2, -1], // 2 squares down, 1 square left
    [1, -2], // 1 square down, 2 squares left
    [-1, -2], // 1 square up, 2 squares left
    [-2, -1], // 2 squares up, 1 square left
  ];

  for (let [dx, dy] of directions) {
    const newX = currentX + dx;
    const newY = currentY + dy;

    // Check if the new coordinates are within board bounds
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      const notation = letters[newX] + (8 - newY).toString();

      // If the square is empty or occupied by an opponent's piece
      if (
        !game.board.position[notation] ||
        game.board.position[notation][0] !== piece[0]
      ) {
        game.validMoves[source].push(notation);
      }
    }
  }
}

function rookMoves(game, piece, source) {
  if (!game.validMoves[source]) {
    game.validMoves[source] = [];
  }

  const letters = "abcdefgh";
  const currentX = letters.indexOf(source[0]);
  const currentY = 8 - parseInt(source[1]);

  const directions = [
    [0, 1], // up
    [1, 0], // right
    [0, -1], // down
    [-1, 0], // left
  ];

  for (let [dx, dy] of directions) {
    let x = currentX;
    let y = currentY;

    while (true) {
      x += dx;
      y += dy;

      // Break if the coordinates are out of board bounds
      if (x < 0 || x > 7 || y < 0 || y > 7) break;

      const notation = letters[x] + (8 - y).toString();

      // If the square is empty
      if (!game.board.position[notation]) {
        game.validMoves[source].push(notation);
      }
      // If the square is occupied
      else {
        // If occupied by an opponent's piece, add the move and then break
        if (game.board.position[notation][0] !== piece[0]) {
          game.validMoves[source].push(notation);
        }
        // Break in either case as the rook can't jump over pieces
        break;
      }
    }
  }
}

function bishopMoves(game, piece, source) {
  if (!game.validMoves[source]) {
    game.validMoves[source] = [];
  }

  const letters = "abcdefgh";
  const currentX = letters.indexOf(source[0]);
  const currentY = 8 - parseInt(source[1]);

  const directions = [
    [-1, 1], // forward left
    [1, 1], // forward right
    [-1, -1], // backward left
    [1, -1], // backward right
  ];

  for (let [dx, dy] of directions) {
    let x = currentX;
    let y = currentY;
    while (true) {
      x += dx;
      y += dy;
      if (x < 0 || x > 7 || y < 0 || y > 7) break;

      const notation = letters[x] + (8 - y).toString();
      if (game.board.position[notation]) {
        if (game.board.position[notation][0] !== piece[0]) {
          game.validMoves[source].push(notation);
          break;
        } else {
          break;
        }
      } else {
        game.validMoves[source].push(notation);
      }
    }
  }
}

function kingMoves(game, piece, source) {
  if (!game.validMoves[source]) {
    game.validMoves[source] = [];
  }
  const letters = "abcdefgh";
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  const currentX = letters.indexOf(source[0]);
  const currentY = 8 - parseInt(source[1]);
  for (let [dx, dy] of directions) {
    const newX = currentX + dx;
    const newY = currentY + dy;

    // Check if the new coordinates are within the bounds
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      const notation = letters[newX] + (8 - newY).toString();

      // If the square is empty
      if (!game.board.position[notation]) {
        game.validMoves[source].push(notation);
      }
      // If the square is occupied by an opponent's piece
      else if (game.board.position[notation][0] !== piece[0]) {
        game.validMoves[source].push(notation);
      }
    }
  }
}

function updateMoves(game, piece, source) {
  if (!game.validMoves[source]) {
    game.validMoves[source] = [];
  } else {
    game.validMoves[source].length = 0;
  }

  switch (piece[1]) {
    case "K":
      kingMoves(game, piece, source);
      break;
    case "B":
      bishopMoves(game, piece, source);
      break;
    case "R":
      rookMoves(game, piece, source);
      break;
    case "N":
      knightMoves(game, piece, source);
      break;
  }
}

function updateStatus() {
  const turnIndicator = document.getElementById("turn");
  const stateIndicator = document.getElementById("state");

  // Check if a king has reached row 8
  for (let position in game.board.position) {
    if (position[1] === "8") {
      if (game.board.position[position] === "wK") {
        game.state = "WHITE WINS";
        stateIndicator.innerHTML = "White Wins";
      } else if (game.board.position[position] === "bK") {
        game.state = "BLACK WINS";
        stateIndicator.innerHTML = "Black Wins";
      }
    }
  }

  if (game.state === "WHITE WINS" || game.state === "BLACK WINS") {
    return; // If the game has ended due to a win, no need to proceed further
  }

  // Otherwise, continue updating whose turn it is
  game.turn = game.turn === "w" ? "b" : "w";
  if (game.turn == "w") {
    turnIndicator.innerHTML = "White";
  } else {
    turnIndicator.innerHTML = "Black";
  }
}

function updateAllValidMoves(game) {
  game.validMoves = {}; // reset valid moves
  // Loop through all pieces in game.board.position
  for (let position in game.board.position) {
    const piece = game.board.position[position];
    updateMoves(game, piece, position);
  }
}

class ChessVar {
  constructor() {
    this.board = document.querySelector("chess-board");
    this.validMoves = {};
    this.turn = "w";
    this.state = "UNFINISHED";
  }
}

const game = new ChessVar();

game.board.setPosition({
  a1: "wK",
  a2: "wR",
  b1: "wB",
  b2: "wB",
  c1: "wN",
  c2: "wN",
  h1: "bK",
  h2: "bR",
  g1: "bB",
  g2: "bB",
  f1: "bN",
  f2: "bN",
});
updateAllValidMoves(game);

game.board.addEventListener("drag-start", (e) => {
  const { source, piece, position, orientation } = e.detail;

  // do not pick up pieces if the game is over
  if (game.state == "WHITE WINS" || game.state == "BLACK WINS") {
    e.preventDefault();
    return;
  }

  // only pick up pieces for the side to move
  if (
    (game.turn == "w" && piece.search(/^b/) !== -1) ||
    (game.turn == "b" && piece.search(/^w/) !== -1)
  ) {
    e.preventDefault();
    return;
  }
});

game.board.addEventListener("drop", (e) => {
  const { source, target, setAction, piece } = e.detail;
  // console.log("source " + source);
  // console.log("target " + target);
  console.log(e.detail);
  if (!game.validMoves[source]) {
    game.validMoves[source] = [];
  }
  const move = game.validMoves[source].includes(target);

  if (move && !checkForCheck(game, piece, source, target)) {
    game.board.position[target] = piece;
    delete game.board.position[source];
    updateAllValidMoves(game, piece, target);
    updateStatus();
  } else {
    setAction("snapback");
  }
});
