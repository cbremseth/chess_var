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
      // console.log(piece + " " + position);
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
          return;
        } else if (this.board.position[position] === "bK") {
          this.state = "BLACK WINS";
          stateIndicator.innerHTML = "Black Wins";
          return;
        }
      }
    }

    if (this.turn == "w") {
      turnIndicator.innerHTML = "White";
    } else {
      turnIndicator.innerHTML = "Black";
    }
  }

  toggleTurn() {
    this.turn = this.turn === "w" ? "b" : "w";
  }
}

class ChessBot {
  constructor(game) {
    this.game = game;
    this.pieceValues = {
      R: 80,
      N: 20,
      B: 100,
    };
  }
  // Create a method to make the move on behalf of the bot
  makeMove() {
    let validMoveFound = false;

    // Loop until a valid move is found
    while (!validMoveFound) {
      const bestMove = this.getBestMove();

      if (bestMove) {
        const { source, target } = bestMove;
        const piece = this.game.board.position[source];

        // Check if the move is valid
        if (!this.game.checkForCheck(piece, source, target)) {
          console.log(
            "Bot is moving from",
            bestMove.source,
            "to",
            bestMove.target
          );

          // Perform the move
          this.game.board.position[bestMove.target] =
            this.game.board.position[bestMove.source];
          delete this.game.board.position[bestMove.source];

          // Update the game state
          this.game.updateAllValidMoves();
          this.game.updateStatus();

          validMoveFound = true; // Exit the loop
        }
      } else {
        // No more moves left, exit the loop
        break;
      }
    }
  }
}

class BeginnerChessBot extends ChessBot {
  getBestMove() {
    // Find all valid moves for black pieces
    let blackMoves = [];
    for (let position in this.game.validMoves) {
      if (
        this.game.board.position[position] &&
        this.game.board.position[position][0] === "b"
      ) {
        for (let move of this.game.validMoves[position]) {
          blackMoves.push({ source: position, target: move });
        }
      }
    }

    // Randomly select one of the valid moves
    if (blackMoves.length > 0) {
      return blackMoves[Math.floor(Math.random() * blackMoves.length)];
    } else {
      return null; // No valid moves available
    }
  }
}

class IntermediateChessBot extends ChessBot {
  getBestMove() {
    let highestValueCapture = null;
    let highestValueAvoid = null;
    let highestValue = 0;
    let randomKingMove = null;
    let randomMove = null;
    let highestThreatValue = 0;
    console.log("Valid Moves: ", this.game.validMoves);
    console.log("Board Position: ", this.game.board.position);

    let mostThreatenedPiece = null;

    for (let position in this.game.validMoves) {
      const pieceInfo = this.game.board.position[position];
      const isValidMoveForBlack = pieceInfo && pieceInfo[0] === "b";

      for (let move of this.game.validMoves[position]) {
        console.log("Considering move from ", position, " to ", move);

        const moveObj = { source: position, target: move };
        const targetPieceInfo = this.game.board.position[move];

        // Store a random move as a fallback
        if (
          !randomMove &&
          isValidMoveForBlack &&
          !this.game.checkForCheck(pieceInfo, position, move)
        ) {
          randomMove = moveObj;
        }

        // Check for king advancement
        if (
          pieceInfo &&
          !this.game.checkForCheck(pieceInfo, position, move) &&
          pieceInfo === "bK" &&
          moveObj.source[1] < moveObj.target[1]
        ) {
          randomKingMove = moveObj;
        }

        // Check for capturing moves
        if (targetPieceInfo && targetPieceInfo[0] === "w") {
          const capturedValue = this.pieceValues[targetPieceInfo[1]];
          if (capturedValue > highestValue) {
            if (!this.game.checkForCheck(pieceInfo, position, move)) {
              highestValue = capturedValue;
              highestValueCapture = moveObj;
            }
          }
        }

        // Identify the bot's piece under the most significant threat
        if (
          pieceInfo &&
          pieceInfo[0] === "w" &&
          targetPieceInfo &&
          targetPieceInfo[0] === "b"
        ) {
          const threatValue = this.pieceValues[targetPieceInfo[1]];
          if (threatValue > highestThreatValue) {
            highestThreatValue = threatValue;
            mostThreatenedPiece = moveObj.target;
            console.log(mostThreatenedPiece);
          }
        }
      }
    }

    // Find an escape move for the most threatened piece
    if (mostThreatenedPiece) {
      const validEscapeMoves = this.game.validMoves[mostThreatenedPiece];
      for (let potentialEscape of validEscapeMoves) {
        let isSafe = true;
        for (let opponentSquare in this.game.validMoves) {
          const opponentPiece = this.game.board.position[opponentSquare];
          if (
            opponentPiece &&
            opponentPiece[0] === "w" &&
            this.game.validMoves[opponentSquare].includes(potentialEscape)
          ) {
            isSafe = false;
            break;
          }
        }

        // Check if the move does not put anything in check
        if (
          isSafe &&
          !this.game.checkForCheck(
            this.game.board.position[mostThreatenedPiece],
            mostThreatenedPiece,
            potentialEscape
          )
        ) {
          highestValueAvoid = {
            source: mostThreatenedPiece,
            target: potentialEscape,
          };
          break;
        }
      }
    }
    console.log(
      "Valid moves for threatened piece: ",
      this.game.validMoves[mostThreatenedPiece]
    );
    console.log("Highest threat value: ", highestThreatValue);
    console.log("highest valud avoid", highestValueAvoid);
    console.log(this.game.board.position);
    if (highestValueCapture) {
      console.log("capturing");
      return highestValueCapture;
    }
    if (highestValueAvoid) {
      console.log("avoiding capture");
      return highestValueAvoid;
    }
    if (randomKingMove) {
      console.log("advancing king");
      return randomKingMove;
    }
    if (randomMove) {
      console.log("random move");
      return randomMove;
    }

    return null; // No valid moves available
  }
}

class ExpertChessBot extends ChessBot {}

document.getElementById("startGame").addEventListener("click", function () {
  document.getElementById("startGame").style.display = "none";
  const difficulty = document.getElementById("difficultySelect").value;
  let bot;
  const game = new ChessVar();
  switch (difficulty) {
    case "none":
      bot = null; // no bot in this mode
      break;
    case "beginner":
      bot = new BeginnerChessBot(game);
      break;
    case "intermediate":
      bot = new IntermediateChessBot(game);
      break;
    case "expert":
      bot = new ExpertChessBot(game);
      break;
  }

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
    if (bot && piece.search(/^b/) !== -1) {
      e.preventDefault();
      return;
    }
  });

  game.board.addEventListener("drop", (e) => {
    const { source, target, setAction, piece, newPosition } = e.detail;
    console.log(e.detail);
    // Check if the move is valid
    if (
      game.validMoves[source] &&
      game.validMoves[source].includes(target) &&
      !game.checkForCheck(piece, source, target)
    ) {
      // Update valid moves only once after the player's move
      game.board.position = newPosition;
      game.updateAllValidMoves();

      // Update the game status only once
      console.log("Board position after move:", game.board.position);

      game.toggleTurn();
      game.updateStatus();

      // Check if it's the bot's turn and if so, invoke it

      invokeBot(game, bot);
      game.board.position = newPosition;
    } else {
      // If the move was not valid, snap the piece back to its original position
      setAction("snapback");
    }
  });

  function invokeBot(game, bot) {
    if (bot && game.turn === "b" && game.state == "UNFINISHED") {
      // Delay the bot's move by 1 second
      setTimeout(() => {
        bot.makeMove();
        game.updateAllValidMoves();
        game.toggleTurn();
        game.updateStatus();
      }, 1000);
    }
  }
});
