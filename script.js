class ChessVar {
  constructor() {
    this.board = document.querySelector("chess-board");
    this.validMoves = {};
    this.turn = "w";
    this.state = "UNFINISHED";
  }

  checkForCheck(piece, source, target) {
    const savedBoard = JSON.parse(JSON.stringify(this.board.position));
    const savedValidMoves = JSON.parse(JSON.stringify(this.validMoves));
    this.board.position[target] = piece;
    delete this.board.position[source];
    this.updateAllValidMoves();

    let inCheck = false;
    const whiteKing = "wK";
    const blackKing = "bK";

    for (let position in this.validMoves) {
      for (let move of this.validMoves[position]) {
        if (
          this.board.position[move] === whiteKing ||
          this.board.position[move] === blackKing
        ) {
          inCheck = true;
          break;
        }
      }
      if (inCheck) break;
    }

    this.board.position = savedBoard;
    this.validMoves = savedValidMoves;

    return inCheck;
  }

  updateMoves(piece, source) {
    switch (piece[1]) {
      case "K":
        this.kingMoves(piece, source);
        break;
      case "B":
        this.bishopMoves(piece, source);
        break;
      case "R":
        this.rookMoves(piece, source);
        break;
      case "N":
        this.knightMoves(piece, source);
        break;
    }
  }

  updateAllValidMoves() {
    this.validMoves = {};
    for (let position in this.board.position) {
      const piece = this.board.position[position];
      this.updateMoves(piece, position);
    }
  }

  knightMoves(piece, source) {
    if (!this.validMoves[source]) {
      this.validMoves[source] = [];
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
          !this.board.position[notation] ||
          this.board.position[notation][0] !== piece[0]
        ) {
          this.validMoves[source].push(notation);
        }
      }
    }
  }

  rookMoves(piece, source) {
    if (!this.validMoves[source]) {
      this.validMoves[source] = [];
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
        if (!this.board.position[notation]) {
          this.validMoves[source].push(notation);
        }
        // If the square is occupied
        else {
          // If occupied by an opponent's piece, add the move and then break
          if (this.board.position[notation][0] !== piece[0]) {
            this.validMoves[source].push(notation);
          }
          // Break in either case as the rook can't jump over pieces
          break;
        }
      }
    }
  }

  bishopMoves(piece, source) {
    if (!this.validMoves[source]) {
      this.validMoves[source] = [];
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
        if (this.board.position[notation]) {
          if (this.board.position[notation][0] !== piece[0]) {
            this.validMoves[source].push(notation);
            break;
          } else {
            break;
          }
        } else {
          this.validMoves[source].push(notation);
        }
      }
    }
  }

  kingMoves(piece, source) {
    if (!this.validMoves[source]) {
      this.validMoves[source] = [];
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
        if (!this.board.position[notation]) {
          this.validMoves[source].push(notation);
        }
        // If the square is occupied by an opponent's piece
        else if (this.board.position[notation][0] !== piece[0]) {
          this.validMoves[source].push(notation);
        }
      }
    }
  }

  updateStatus() {
    const turnIndicator = document.getElementById("turn");
    const stateIndicator = document.getElementById("state");

    // Check if a king has reached row 8
    for (let position in this.board.position) {
      if (position[1] === "8") {
        if (this.board.position[position] === "wK") {
          this.state = "WHITE WINS";
          stateIndicator.innerHTML = "White Wins";
        } else if (this.board.position[position] === "bK") {
          this.state = "BLACK WINS";
          stateIndicator.innerHTML = "Black Wins";
        }
      }
    }

    if (this.state === "WHITE WINS" || this.state === "BLACK WINS") {
      return; // If the this has ended due to a win, no need to proceed further
    }

    // Otherwise, continue updating whose turn it is
    this.turn = this.turn === "w" ? "b" : "w";
    if (this.turn == "w") {
      turnIndicator.innerHTML = "White";
    } else {
      turnIndicator.innerHTML = "Black";
    }
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

game.updateAllValidMoves();

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

  if (move && !game.checkForCheck(piece, source, target)) {
    game.board.position[target] = piece;
    delete game.board.position[source];
    game.updateAllValidMoves();
    game.updateStatus();
  } else {
    setAction("snapback");
  }
});
