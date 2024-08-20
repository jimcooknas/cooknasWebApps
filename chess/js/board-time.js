var blackTimerHour = 0;
var blackTimerMin = 0;
var blackTimerSec = 0;
var whiteTimerHour = 0;
var whiteTimerMin = 0;
var whiteTimerSec = 0;


function startTimer() {
  $('#game-timer').removeClass('hidden');

  var timeSec = 0, timeMin = 0;
  var timeSecStr = '', timeMinStr = '';

  clearInterval(gameTimer);

  gameTimer = setInterval(function() { 
    timeSec++;
    if (timeSec >= 0 && timeSec <= 9) {
      timeSecStr = '0' + timeSec;
    }
    if (timeSec >= 10 && timeSec <= 59) {
      timeSecStr = timeSec;
    }
    if (timeSec == 60) {
      timeSecStr = '00';
      timeSec = 0;
      timeMin++;
    }
    if (timeMin >= 0 && timeMin <= 9) {
      timeMinStr = '0' + timeMin;
    }
    if (timeMin >= 10 && timeMin <= 59) {
      timeMinStr = timeMin;
    }

    if(game.turn()=='b'){
      blackTimerSec++;
      if(blackTimerSec >= 60){
        blackTimerMin++;
        blackTimerSec -= 60;
      }
      if(blackTimerMin >=60){
        blackTimerHour++;
        blackTimerMin -= 60;
      }
      $('#game-timer-black').text(blackTimerHour + ":" + (blackTimerMin<10?"0"+blackTimerMin:blackTimerMin)+":"+(blackTimerSec<10?"0"+blackTimerSec:blackTimerSec));
    }
    if(game.turn()=='w'){
      whiteTimerSec++;
      if(whiteTimerSec >= 60){
        whiteTimerMin++;
        whiteTimerSec -= 60;
      }
      if(whiteTimerMin >=60){
        whiteTimerHour++;
        whiteTimerMin -= 60;
      }
      $('#game-timer-white').text(whiteTimerHour + ":" + (whiteTimerMin<10?"0"+whiteTimerMin:whiteTimerMin)+":"+(whiteTimerSec<10?"0"+whiteTimerSec:whiteTimerSec));
    }

    $('#game-timer').text(timeMinStr + ':' + timeSecStr);

    // if (timeMin >= 5) {
    //   clearInterval(gameTimer);
    // }
  }, 1000);
}

function stopTimer() {
  clearInterval(gameTimer);
  $('#game-timer').text('00:00');
}