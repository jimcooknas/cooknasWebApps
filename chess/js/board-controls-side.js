
// Right panel control buttons logic

// Reset board to classic starting position

$('#btn-new-game').click(function() {

  console.log('Making new game.');

  gameStarted = false;
  gameEnd = false;

  stopTimer();
  blackTimerHour = 0;
  blackTimerMin = 0;
  blackTimerSec = 0;
  whiteTimerHour = 0;
  whiteTimerMin = 0;
  whiteTimerSec = 0;
  $('#game-timer-black').text("0:00:00");
  $('#game-timer-white').text("0:00:00");

  $('#game-settings').removeClass('hidden');
  $('#btn-choose-white-side, #btn-choose-black-side').removeClass('locked');
  $('#game-analyze-string').addClass("hidden");

  $('#btn-choose-black-side').removeClass('selected');
  $('#btn-choose-white-side').addClass('selected');

  playerSide = 'w';
  opponentSide = 'b';
  firstTurn = 'player';

  $('#btn-undo-move').addClass('hidden');
  $('#game-state').addClass('hidden');

  document.getElementById("btn-switch-sides").disabled = false;
  $('#btn-switch-sides').removeClass('disabled');

  document.getElementById("btn-show-hint").disabled = false;
  $('#btn-show-hint').removeClass('disabled');

  // setBoard();

  game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  board.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  if (playerSide == 'b') {
    game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    board.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    opponentTurn();
  } else {
    game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    board.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    // unlock if locked
    $('#board').disabled=false;//removeClass('locked');
    // reset turns history
    $('#game-turns-history ol').html('');
  }

});

// Empty board and enable custom pieces

$('#btn-empty-board').click(function() {

  stopTimer();

  $('#game-timer').addClass('hidden');
  $('#btn-choose-white-side, #btn-choose-black-side').removeClass('locked');
  $('#btn-undo-move').addClass('hidden');
  $('#board').disabled=false;//removeClass('locked');

  $('body').find('img[data-piece="wP"]').remove();
  $(window).unbind();

  board.clear();

  board = ChessBoard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true
  });

  boardPieces = true;

  $('#game-turn').addClass('hidden');

});

// Load PGN string popup

$('#btn-load-pgn').click(function() {
  if ($('#board-load-pgn-area').hasClass('hidden')) {
    $('#board-load-fen-area, #board-save-pgn-area').addClass('hidden');
    $('#board-load-pgn-area').removeClass('hidden').find('textarea').focus().select();
  } else {
    $('#board-load-pgn-area').addClass('hidden');
  }
});

$('#board-load-pgn-area button').click(function() {
  eventLoadPgnData();
  $('#board-load-pgn-area').addClass('hidden');
});

$('#board-load-pgn-area textarea').keydown(function(e) {
  e.preventDefault();
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    eventLoadPgnData();
    $('#board-load-pgn-area').addClass('hidden');
  }
});

function eventLoadPgnData() {
  if ($('#board-load-pgn-area textarea').val() == '') return;

  var fenString = '';
  Init('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  SetPgnMoveText($('#board-load-pgn-area textarea').val());
  var ff = "", ff_new = "", ff_old;

  do {
    ff_old = ff_new;
    MoveForward(1);
    ff_new = GetFEN();
    if (ff_old!=ff_new) ff += ff_new + "\n";
    fenString = ff_new;
  }
  while (ff_old != ff_new);

  console.log('PGN converted to FEN: ' + fenString);

  loadBoard(fenString);
  checkTurn();
  checkAnalyzeOption();
}

$('#board-load-pgn-area .close').click(function() {
  $('#board-load-pgn-area').addClass('hidden');
});

// Load FEN string popup

$('#btn-load-fen').click(function() {
  if ($('#board-load-fen-area').hasClass('hidden')) {
    $('#board-load-pgn-area, #board-save-pgn-area').addClass('hidden');
    $('#board-load-fen-area').removeClass('hidden').find('textarea').focus().select();
  } else {
    $('#board-load-fen-area').addClass('hidden');
  }
});

$('#board-load-fen-area button').click(function() {
  eventLoadFenData();
  $('#board-load-fen-area').addClass('hidden');
});

$('#board-load-fen-area textarea').keydown(function(e) {
  //e.preventDefault();
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    eventLoadFenData();
    $('#board-load-fen-area').addClass('hidden');
  }
});

function eventLoadFenData() {
  var fenString = $('#board-load-fen-area textarea').val();
  var gameValidation = game.validate_fen(fenString);
  if (!gameValidation.valid) {
    console.log('Error ' + gameValidation.error_number + ': ' + gameValidation.error);
    alert('Error ' + gameValidation.error_number + ': ' + gameValidation.error)
    return;
  };
  loadBoard(fenString);
  //*****************************/
  $('#board-load-fen-area').addClass('hidden');
  checkTurn();
  checkAnalyzeOption();
}

$('#board-load-fen-area .close').click(function () {
  $('#board-load-fen-area').addClass('hidden');
});

$('#board-save-pgn-area textarea').keydown(function(e) {
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    $('#board-save-pgn-area').addClass('hidden');
  }
});

$('#board-save-pgn-area button').click(function() {
  var fileContent = $('#board-save-pgn-area textarea').text();
  // $('#game-turns-history ol li').each(function(i){
  //   let idx = $(this).text().search(/\d/);
  //   fileContent += $(this).text().substring(0, idx+1)+" " + $(this).text().substring(idx+1, $(this).text().length) +"\r\n";
  // });
  var bb = new Blob([fileContent ], { type: 'text/plain' });
  var a = document.createElement('a');
  a.download = 'gamePGN.txt';
  a.href = window.URL.createObjectURL(bb);
  a.click();
  a.remove();
  $('#board-save-pgn-area').addClass('hidden');
  alert("PGN file saved in Downloads folder by name 'gamePGN.txt'");
});

$('#board-save-pgn-area .close').click(function() {
  $('#board-save-pgn-area').addClass('hidden');
});

// Analyze moves

$('#btn-analyze').click(function() {
  if ($(this).hasClass('disabled')) {
    console.log('Cannot analyze in opponent turn.');
    return;
  }
  stateAnalyze = 'grep';
  $('#btn-analyze').addClass('disabled loading');
  console.log('Analyze ' + game.fen());
  stockfish.postMessage('position fen ' + game.fen());
  stockfish.postMessage('go depth ' + staticSkill);
});

function checkAnalyzeOption() {
  if (game.turn() != playerSide) {
    $('#btn-analyze').addClass('disabled');
  } else {
    $('#btn-analyze').removeClass('disabled');
  }
}

$('#btn-settings').click(function() {
  //$('#game-difficulty-skill-settings').toggleClass('hidden');
  $('#piece-settings-board-piece').toggleClass('hidden');
});

$('#piece-settings-board-piece .close').click(function() {
  $('#piece-settings-board-piece').addClass('hidden');
});

$('#btn-choose-white-side').click(function() {
  if ($(this).hasClass('locked')) return;
  $('#game-settings .btn').removeClass('selected');
  $(this).addClass('selected');
  playerSide = 'w';
  opponentSide = 'b';
  if (typeof board.setOrientation == 'function') {
    board.setOrientation(playerSide);
  } else {
    board.orientation('white');
  }
  $('#game-settings .btn').addClass('locked');
  $('#game-settings').addClass('hidden');
});

$('#btn-choose-black-side').click(function() {
  if ($(this).hasClass('locked')) return;
  $('#game-settings .btn').removeClass('selected');
  $(this).addClass('selected');
  playerSide = 'b';
  opponentSide = 'w';
  if (typeof board.setOrientation == 'function') {
    board.setOrientation(playerSide);
  } else {
    board.orientation('black');
  }
  opponentTurn();
  $('#game-settings .btn').addClass('locked');
  $('#game-settings').addClass('hidden');
});

$('#btn-resign').click(function() {
  $('#board-resign-game-area').toggleClass('hidden');
});

$('#board-resign-game-area .close').click(function() {
  $('#board-resign-game-area').addClass('hidden');
});

$('#board-resign-game-area .yes').click(function() {
  gameEnd = true;
  stopTimer();
  $('#game-state').text('Game ended. Player resigned!').removeClass('hidden');
  $('#game-timer').addClass('hidden');
  $('#board').disabled=true;//addClass('locked');
  $('#board-resign-game-area').addClass('hidden');
  hideAnalyze();
});

$('#board-resign-game-area .no').click(function() {
  $('#board-resign-game-area').addClass('hidden');
});

function boardColorClicked(){
  console.log("boardColorClicked");
  if($('#set1').is(':checked'))
    changeBoardColor("#DCDCDC", "#ABABAB");
  else if ($('#set2').is(':checked'))
    changeBoardColor("#f1e1a1", "#6f5f2f");
  else if($('#set3').is(':checked'))
    changeBoardColor("#e1f1a1", "#5f6f2f");
}

function changeBoardColor(colWhite, colBlack){
  console.log("changeBoardColor: "+colWhite + " " + colBlack);
  var rule = getStyleRule('.white-1e1d7');
  rule.backgroundColor = colWhite;
  var rule1 = getStyleRule('.black-3c85d');
  rule1.backgroundColor = colBlack;
  // $('.white-1e1d7').css("background", colWhite);
  // $('.black-3c85d').css("background", colBlack);
}

//get the rules of the specified class
function getStyleRule(name) {
  for(var i=0; i<document.styleSheets.length; i++) {
    var ix, sheet = document.styleSheets[i];
    for (ix=0; ix<sheet.cssRules.length; ix++) {
        if (sheet.cssRules[ix].selectorText === name)
            return sheet.cssRules[ix].style;
    }
  }
return null;
}

function hideAnalyze(){
  $('.game-analyze').addClass('hidden');
}

function pieceSetChanged(sel){
  console.log("Piece Set selected: "+sel.options[sel.selectedIndex].text);
  selectedPieceSet = sel.options[sel.selectedIndex].text;
  var position = game.fen();
  console.log("Position: "+position);
  //setDesktopBoard(position);
  loadBoard(position);
  // unlock if locked
  $('#board').disabled=false;
}