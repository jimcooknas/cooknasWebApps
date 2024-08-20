var selectedPieceSet = "cburnett";
// init board desktop

function setDesktopBoard(position = false, sparePieces = false) {

  gameEnd = false;

  // mode to set chess figures in custom position
  if (sparePieces) {
    board = ChessBoard('board', {
      draggable: true,
      dropOffBoard: 'trash',
      sparePieces: true,
      pieceTheme: 'imgpieces/'+selectedPieceSet+'/{piece}.svg'
    });
    return;
  }

  // init board with preloaded position (fen)
  if (position == false) {
    position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  } else {
    console.log('Custom: ' + position);
  }

  // game rules control object
  game = new Chess(position);

  var onDragStart = function(source, piece) {
    // do not pick up pieces if the game is over or if it's not that side's turn
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
    
  };

  var onDrop = function(source, target, piece, newPos, oldPos, orientation) {
    removeGreySquares();
    $('#game-settings').addClass('hidden');
    $('#game-analyze-string').addClass('hidden');

    if (!gameStarted) {
      gameStarted = true;
      $('#btn-choose-white-side, #btn-choose-black-side').addClass('locked');
    }

    // see if the move is legal
    var move = game.move({
      from: source,
      to: target,
      promotion: 'q'
    });

    // illegal move
    if (move === null) {
      console.log('Player illegal move.');
      return 'snapback';
    }

    promotionPos = newPos;
    moveSource = source;
    moveTarget = target;

    // promotion move
    if (move.promotion != undefined) {
      $('#game-promotion').removeClass('hidden');
      $('#board').disabled=true;//addClass('locked');
      console.log('Paused for promotion.');
      return;
    }

    dumpLog(false);

    listMoves();
    opponentTurn();
  };

  var onMouseoverSquare = function(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    });
    // skip if there are no moves available for this square
    if (moves.length === 0) return;
    // highlight the square they moused over
    greySquare(square);
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to);
    }
  };

  var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
  };

  var onSnapEnd = function() {
    board.position(game.fen());
    gameHistoryAddMove(game.fen());
    if (game.history().length > 0) $('#btn-take-back').removeClass('disabled');
  };

  board = ChessBoard('board', {
    position: position,
    draggable: true,
    showNotation: true,
    onDragStart: onDragStart,
    dropOffBoard: 'snapback',
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'imgpieces/'+selectedPieceSet+'/{piece}.svg'
  });

  gameHistoryClear();

  // field highlight functions
  var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
  };

  var greySquare = function(square) {
    //console.log("grey "+square);
    var squareEl = $('#board .square-' + square), background = $('#set1').is(':checked')?"#fbe3e7":$('#set2').is(':checked')?"#fa5a3a":"#ff8f6f";
    if (squareEl.hasClass('black-3c85d') === true) background = $('#set1').is(':checked')?"#f7c5cd":$('#set2').is(':checked')?"#af3f0f":"#af5f1f";
    squareEl.css('background', background);
  };
  //$('#set1').is(':checked')?"#fbe3e7":$('#set2').is(':checked')?"#f1e1a1":"#e1f1a1"
  //$('#set1').is(':checked')?"#f7c5cd":$('#set2').is(':checked')?"#6f5f2f":"#5f6f2f"
};
