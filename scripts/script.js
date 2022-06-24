'use strict';

const player1 = {
  name: "",
  score: "",
  $elementName: $("#p1n")[0],
  $elementScore: $("#p1s")[0],

  updateInfo: function (n, s) {
    this.name = n;
    this.$elementName.innerText = n;
    this.score = s;
    this.$elementScore.innerText = s;
  },
  updateScoreInfo: function(s){
    this.score = s;
    this.$elementScore.innerText = s;
  },
}

const player2 = {
  name: "",
  score: "",
  $elementName: $("#p2n")[0],
  $elementScore: $("#p2s")[0],

  updateInfo: function (n, s) {
    this.name = n;
    this.$elementName.innerText = n;
    this.score = s;
    this.$elementScore.innerText = s;
  },
  updateScoreInfo: function(s){
    this.score = s;
    this.$elementScore.innerText = s;
  },
}

const game = {
  title: "Connect Four",
  isRunning: false,
  wasRunning: false,
  currentScreen: 0, //0 means splash, 1 means game, 2 means game-over
  players: [null, null],
  scoreboard: ["TBD", "TBD"],
  $p1Name : $("#p1inputname")[0],
  $p2Name : $("#p2inputname")[0],
  $p1Button : $("#p1submitname")[0],
  $p2Button : $("#p2submitname")[0],
  $startButton : $("#startpause")[0],
  $infoArea : $(".infoarea")[0],
  $gameStat : $("#gamestatusid")[0],
  m1p1: new bootstrap.Modal($('#m1p1')[0]), //m1p1 means modal 1 page 1, etc.
  m1p2: new bootstrap.Modal($('#m1p2')[0]),
  m2p1: new bootstrap.Modal($('#m2p1')[0]),
  isRStat:null,
  wasRstat:null,
  boardSize:null,


// below are properties for time control=====================================================================================================================

  loopDuration: 100,
  timeLimit: 10000,
  timeRemain: 10000,
  intervalID: null,
  progressBar: 100,

//addP1 and addP2 are for adding players
  addP1: function () {
    this.$p1Button.addEventListener('click', function (e) {
      e.preventDefault();
      if (game.$p1Name.value.length > 0) {
        if (game.$p1Name.value.length > 7) {
          $(".infoarea").empty();
          game.$infoArea.append("Player1: Please put a name less than 8 characters");
        }
        else {
          player1.updateInfo(game.$p1Name.value, "TBD");
          game.$p1Name.value = "";
          game.$p1Button.disabled = true;
          game.$p1Name.disabled = true;
          if (player2.name != "")
            game.$startButton.disabled = false;
          $(".infoarea").empty();
        }
      }
    });
  },

  addP2: function () {
    this.$p2Button.addEventListener('click', function (e) {
      e.preventDefault();
      if (game.$p2Name.value.length > 0) {
        if (game.$p2Name.value.length > 7) {
          $(".infoarea").empty();
          game.$infoArea.append("Player2: Please put a name less than 8 characters");
        }
        else {
          player2.updateInfo(game.$p2Name.value, "TBD");
          game.$p2Name.value = "";
          game.$p2Button.disabled = true;
          game.$p2Name.disabled = true;
          if (player1.name != "")
            game.$startButton.disabled = false;
          $(".infoarea").empty();
        }
      }
    });
  },

//The method below is for start button.
  startPause: function () {
    this.$startButton.addEventListener('click', function (e) {
      if (game.isRunning == false && game.wasRunning == false) {
        game.isRunning = true;
        game.switchS(1);
        game.$gameStat.innerText = "Running";
        game.$startButton.innerHTML = `Pause <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-btn" viewBox="0 0 16 16">
        <path d="M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
      </svg>`;
        const quitButton = document.createElement("button")
        quitButton.setAttribute("id", "quitbutton");
        quitButton.setAttribute("type", "button");
        quitButton.innerText = "Quit";
        $("#startpause").after(quitButton);
        quitButton.addEventListener('click', function () {
          game.quitGame();
        })
        const endButton = document.createElement("button")
        endButton.setAttribute("id", "endbutton");
        endButton.setAttribute("type", "button");
        endButton.innerText = "End Game";
        $("#startpause").after(endButton);
        endButton.addEventListener('click', function () {
          game.endGame();
        })
        $("#timeLimitSelect").prop('disabled', true);
        $("#dSelect").prop('disabled',true);
        game.startTimer();
        game.boardSize = $("#dSelect")[0].value;
        gameA.initBoard(game.boardSize);
        return;
      } else if (game.isRunning == true && game.wasRunning == false) {
        game.wasRunning = true;
        game.$gameStat.innerText = "Paused";
        game.$startButton.innerHTML = `Resume <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-angry" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zm6.991-8.38a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5s-1-.672-1-1.5c0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1zm-6.552 0a.5.5 0 0 0-.448.894l1.009.504A1.94 1.94 0 0 0 5 6.5C5 7.328 5.448 8 6 8s1-.672 1-1.5c0-.247-.04-.48-.11-.686a.502.502 0 0 0-.166-.761l-2-1z"/>
      </svg>`;
      game.pauseTimer();
        return;
      } else if (game.isRunning == true && game.wasRunning == true) {
        game.wasRunning = false;
        game.$gameStat.innerText = "Running";
        game.$startButton.innerHTML = `Pause <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-btn" viewBox="0 0 16 16">
        <path d="M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
      </svg>`;
        game.resumeTimer();
        return;
      } else if (game.isRunning == false && game.wasRunning == true){
        game.isRunning = false;
        game.wasRunning = false;
        game.switchS(1);
        game.$gameStat.innerText = "";
        game.$startButton.innerHTML = `Start <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16">
        <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
      </svg>`;
        $("#startpause").nextAll().remove();
        $("#timeLimitSelect").prop('disabled', false);
        $("#dSelect").prop('disabled',false);
        return;
      }
    });
  },

  //The method below is for quit button
  quitGame: function () {
    player1.updateInfo("", "");
    player2.updateInfo("", "");
    this.$startButton.innerHTML = `Start <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-btn" viewBox="0 0 16 16">
    <path d="M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z"/>
    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
  </svg>`;
    this.$startButton.disabled = true;
    this.$p1Button.disabled = false;
    this.$p1Name.disabled = false;
    this.$p2Button.disabled = false;
    this.$p2Name.disabled = false;
    this.isRunning = false;
    this.wasRunning = false;
    this.$gameStat.innerText = "";
    player1.updateInfo("","");
    player2.updateInfo("","");
    $(".infoarea").empty();
    $("#game-screen").empty();
    this.switchS(0);
    this.resetTimer();
    $("#timeLimitSelect").prop('disabled', false);
    $("#dSelect").prop('disabled',false);
    $("#timeLimitSelect")[0].value = "none";
    $("#startpause").nextAll().remove();

  },

  //The method below is for ending game button
  endGame: function () {
    this.$startButton.innerHTML = `Play Again <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-dollar" viewBox="0 0 16 16">
    <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
  </svg>`;
    this.isRunning = false;
    this.wasRunning = true;
    $("#game-screen").empty();
    game.switchS(2);
    this.$gameStat.innerText = "Ended"
    $("#endbutton").remove();
    this.resetTimer();
    game.$startButton.disabled = false;
  },

//The method below is for switching screen
  switchS: function (a) {
    switch (a) {
      case 0:
        $("#splash-screen").show();
        $("#game-screen").hide();
        $("#over-screen").hide();
        this.currentScreen = 0;
        $(".dywHelpBtn").show();
        break;
      case 1:
        $("#splash-screen").hide();
        $("#game-screen").show();
        $("#over-screen").hide();
        this.currentScreen = 1;
        $(".dywHelpBtn").show();
        break;
      case 2:
        $("#splash-screen").hide();
        $("#game-screen").hide();
        $("#over-screen").show();
        this.currentScreen = 2;
        $(".dywHelpBtn").hide();
        break;
    }
  },
// The methods below are for showing proper modals. showModal method will check current screen
//and show the right modal. In game screen, modal 2 will also pause the game when you call it,
// and closeM2P1 method restore game status when you close it.

  showModal: function () {
    $(".dywHelpBtn").on("click", function(){
      if(game.currentScreen == 0){
        game.m1p1.show();
      } else if (game.currentScreen == 1){
        game.pauseTimer();
        game.isRStat = game.isRunning;  // Those lines will memorize the origin game status, and set buttons.
        game.wasRStat = game.wasRunning;
        game.wasRunning = true;
        game.isRunning = true;
        game.$gameStat.innerText = "Paused";
        game.$startButton.innerHTML = `Resume <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-angry" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zm6.991-8.38a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5s-1-.672-1-1.5c0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1zm-6.552 0a.5.5 0 0 0-.448.894l1.009.504A1.94 1.94 0 0 0 5 6.5C5 7.328 5.448 8 6 8s1-.672 1-1.5c0-.247-.04-.48-.11-.686a.502.502 0 0 0-.166-.761l-2-1z"/>
      </svg>`;
        game.m2p1.show();
      }
    });
  },

  closeM2P1: function(){
    game.m2p1._element.addEventListener("hide.bs.modal", function(e){ //Those lines are for restoring origin game status after modal is cloded.
      game.isRunning = game.isRStat;
      game.wasRunning = game.wasRStat;
      if  (game.isRunning == true && game.wasRunning == false) {
        game.$gameStat.innerText = "Running";
        game.resumeTimer();
        game.$startButton.innerHTML = `Pause <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-btn" viewBox="0 0 16 16">
        <path d="M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z"/>
        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
      </svg>`;
      } else if (game.isRunning == true && game.wasRunning == true) {
        game.$gameStat.innerText = "Paused";
        game.$startButton.innerHTML = `Resume <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-emoji-angry" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zm6.991-8.38a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5s-1-.672-1-1.5c0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1zm-6.552 0a.5.5 0 0 0-.448.894l1.009.504A1.94 1.94 0 0 0 5 6.5C5 7.328 5.448 8 6 8s1-.672 1-1.5c0-.247-.04-.48-.11-.686a.502.502 0 0 0-.166-.761l-2-1z"/>
      </svg>`;
      } 
    });
  },

//The methods below are for time control=======================================================================================================================================
  resetTimer: function(){
    clearInterval(game.intervalID);
    game.timeLimit =10000;
    game.timeRemain = 10000;
    game.intervalID = null;
    game.progressBar = 100;
    $("#myProgress").hide();
    $("#myBar").hide();
    $(".infoarea").empty();
  },

  pauseTimer: function(){
    clearInterval(game.intervalID);
  },

  resumeTimer: function(){
    if($("#timeLimitSelect")[0].value != "none"){
      game.timeLoop(game.timeLimit, game.timeRemain);
    }
  },

  startTimer: function (){
    if ($("#timeLimitSelect")[0].value == "none"){
      game.timeRemain = 10000;
      game.timeLimit = 10000;
      $("#myProgress").hide();
      $("#myBar").hide();
      $(".infoarea").empty();
    }else if ($("#timeLimitSelect")[0].value == "10s"){
      game.timeRemain = 10000;
      game.timeLimit = 10000;
      $("#myProgress").show();
      $("#myBar").show();
      $(".infoarea").empty();
      this.timeLoop(game.timeLimit, game.timeRemain);
    }else if ($("#timeLimitSelect")[0].value == "7s"){
      game.timeRemain = 7000;
      game.timeLimit = 7000;
      $("#myProgress").show();
      $("#myBar").show();
      $(".infoarea").empty();
      this.timeLoop(game.timeLimit, game.timeRemain);
    }else if ($("#timeLimitSelect")[0].value == "3s"){
      game.timeRemain = 3000;
      game.timeLimit = 3000;
      $("#myProgress").show();
      $("#myBar").show();
      $(".infoarea").empty();
      this.timeLoop(game.timeLimit, game.timeRemain);
    }

  },

  timeLoop: function (givenTime, timeLeftOver) {
    var countDownFutureTime = Date.now() + timeLeftOver;
    game.intervalID = setInterval(function () {
      var now = new Date().getTime();
      game.timeRemain = countDownFutureTime - now;
      var minutes = Math.floor((game.timeRemain % (1000 * 60 * 60)) / (1000 * 60));
      minutes = (minutes<10) ? ("0" + minutes) : (minutes);
      var seconds = Math.floor((game.timeRemain % (1000 * 60)) / 1000);
      seconds = (seconds<10) ? ("0" + seconds) : (seconds);
      var tenthSeconds = Math.floor((game.timeRemain % (1000 * 60)) % 1000 / 1000 / 0.1);
      game.$infoArea.innerHTML = minutes + ":" + seconds + "." + tenthSeconds;
      game.progressBar = game.timeRemain/givenTime * 100;
      if (game.progressBar<=50 && game.progressBar > 25)
        $("#myBar").css("background-color", "orange");
      else if (game.progressBar <= 25)
        $("#myBar").css("background-color", "red");
      $("#myBar").css("width", game.progressBar + "%")
      if (game.timeRemain < 0) {
        clearInterval(game.intervalID);
        game.$infoArea.innerHTML = "00" + ":" + "00" + "." + "0";
        $("#myBar").css("background-color", "green");
        gameA.timeIsUp();
      }
    }, game.loopDuration);
  },
}



//====================Game Algorithm=====================================================

const gameA = {
  gameScreen: $("#game-screen"),
  boardTopBar: null,
  board: null,
  yellowIsNext: true,

  initBoard: function (size){
    this.gameScreen.empty();
    var row = size - 1;
    var col = size;
    this.boardTopBar = new Array(col);
    this.board = new Array(row);
    for(var j = 0;j< col; j++){
      gameA.boardTopBar[j] = this.gameScreen.append(`<div class=\"cell row-top col-${j}\"></div>`).children().last();
    }

    for(var i = 0;i< row; i++){
      this.board[i] = new Array(col);
      for(var j = 0;j<col;j++){
        gameA.board[i][j] = this.gameScreen.append(`<div class=\"cell row-${i} col-${j}\"></div>`).children().last();
      }
    }
    if (size == 8){
      $("#game-screen").css("grid-template-columns", "repeat(8,1fr)");
      $("#game-screen").css("grid-template-rows", "repeat(8,1fr)");
      $("#game-screen .cell").css({"height":"76px", "width":"76px"});
    } else if (size == 9){
      $("#game-screen").css("grid-template-columns", "repeat(9,1fr)");
      $("#game-screen").css("grid-template-rows", "repeat(9,1fr)");
      $("#game-screen .cell").css({"height":"67.6px", "width":"67.6px"});
    }
      player1.updateScoreInfo("Yellow's turn");
      player2.updateScoreInfo("");
    this.MouseOverCell();
    this.MouseMoveOut();
    this.MouseClick();
  },

  getClassList: function (cell){
    var classListResult = cell[0].classList;
    return classListResult;
  },

  getCellIndex: function (cell){
    var rowNum = Number(this.getClassList(cell)[1][4]);
    var colNum = Number(this.getClassList(cell)[2][4]);
    return [rowNum, colNum];
  },

  getFirstEmptyCellInColumn: function (cell) {
    var [rowIndex, colIndex] = this.getCellIndex(cell);
    for (var i = game.boardSize - 2; i >= 0; i--) {
      if (!this.getClassList(this.board[i][colIndex]).contains("yellow") && !this.getClassList(this.board[i][colIndex]).contains("red"))
        return this.board[i][colIndex];
    }
    return null;
  },

  addBoardTopBar: function (cell) {
    if (game.isRunning == true && game.wasRunning == false) {
      var [rowIndex, colIndex] = this.getCellIndex(cell);
      this.boardTopBar[colIndex].addClass(this.yellowIsNext ? "yellow" : "red");
    } else
      return;
  },

  clearBoardTopBar: function (cell){
    if (game.isRunning == true && game.wasRunning == false) {
      var [rowIndex, colIndex] = this.getCellIndex(cell);
      this.boardTopBar[colIndex].removeClass("yellow red");
    } else
      return;
  },

  clickCellAddColor: function (cell){
    if(game.isRunning == true && game.wasRunning == false){
      var firstEmptyCell = gameA.getFirstEmptyCellInColumn(cell);
      if(!firstEmptyCell)
        return;
      firstEmptyCell.addClass(gameA.yellowIsNext ? "yellow" : "red");
      if (this.judgeWin(firstEmptyCell))
        return;
      this.yellowIsNext = !this.yellowIsNext;
      if(gameA.yellowIsNext == true){
        player1.updateScoreInfo("Yellow's turn");
        player2.updateScoreInfo("");
      }else{
        player1.updateScoreInfo("");
        player2.updateScoreInfo("Red's turn");
      }
      this.clearBoardTopBar(cell);
      this.addBoardTopBar(cell);
      game.pauseTimer();
      game.startTimer();
    }
  },
  getCellColor: function (cell){
    if(cell.hasClass("yellow"))
      return "yellow";
    else if (cell.hasClass("red"))
      return "red";
    else
      return null;
  },
//the method below is for checking continuous 4 cells. If a line of cells has 4 cells, then it is winning.
  checkWin: function (cellsArray){
    if(cellsArray.length<4)
      return false;
    return true;
  },

  afterWin: function (cell, cellsArray){
    game.resetTimer();
    cellsArray.forEach(element => {
      element.addClass("win");
    });
    this.clearBoardTopBar(cell);
    game.isRunning = false;
    game.wasRunning = true;
    game.$startButton.disabled = true;
    game.$infoArea.append("Game Over "+gameA.getCellColor(cell).toUpperCase()+" has won");
    if(gameA.getCellColor(cell) == "yellow"){
      player1.updateScoreInfo("Winner");
      player2.updateScoreInfo("Lost");
    }
    else{
      player1.updateScoreInfo("Lost");
      player2.updateScoreInfo("Winner");
    }
  },

  afterTie: function (cell){
    game.resetTimer();
    this.clearBoardTopBar(cell);
    game.isRunning = false;
    game.wasRunning = true;
    game.$startButton.disabled = true;
    game.$infoArea.append("Game is a tie");
    player1.updateScoreInfo("Tie");
    player2.updateScoreInfo("Tie");

  },

  timeIsUp:function (){
    gameA.boardTopBar.forEach(function (element){
      element.removeClass("yellow red");
    });
    game.isRunning = false;
    game.wasRunning = true;
    game.$startButton.disabled = true;
    var currentColor = gameA.yellowIsNext ? "red":"yellow";
    game.$infoArea.append("Time is up. Game Over "+currentColor+" has won");
    if(currentColor == "yellow"){
      player1.updateScoreInfo("Winner");
      player2.updateScoreInfo("Lost");
    }
    else{
      player1.updateScoreInfo("Lost");
      player2.updateScoreInfo("Winner");
    }

  },
//the method below is for getting continous 4 cells in 
//horizontal, vertial, top-right to bottom-left and top-left to bottom-right direction
  judgeWin: function (cell){


    var color = this.getCellColor(cell);
    if(!color)
      return;
    var [rowIndex, colIndex] = this.getCellIndex(cell);

    //check horizontally to left
    var cellArray = [cell];
    var rowToCheck = rowIndex;
    var colToLeft = colIndex -1;
    while (colToLeft >= 0) {
      let cellToCheckToLeft = this.board[rowToCheck][colToLeft];
      if (this.getCellColor(cellToCheckToLeft) === color) {
        cellArray.push(cellToCheckToLeft);
        colToLeft--;
      } else {
        break;
      }
    }
    //check horizontally to right
    var colToRight = colIndex+1;
    while (colToRight <= game.boardSize-1) {
      let cellToCheckToRight = this.board[rowToCheck][colToRight];
      // colToRight++;
      if (this.getCellColor(cellToCheckToRight) === color) {
        cellArray.push(cellToCheckToRight);
        colToRight++;
      }
      else {
        break;
      }
    }

    if (this.checkWin(cellArray)){
      this.afterWin(cell, cellArray);
      return true;
    }

    //Check vertically to top
    cellArray = [cell];
    // var rowToTop = rowIndex -1;
    var colToCheck = colIndex;
    // while (rowToTop >= 0) {
    //   console.log("rowToTop"+rowToTop);
    //   let cellToCheckToTop = this.board[rowToTop][colToCheck];
    //   if (this.getCellColor(cellToCheckToTop) === color) {
    //     cellArray.push(cellToCheckToTop);
    //     rowToTop--;
    //   } else {
    //     break;
    //   }
    // }
    //check vertically to bottom
    var rowToBottom = rowIndex+1;
    while (rowToBottom <= game.boardSize-2) {
      let cellToCheckToBottom = this.board[rowToBottom][colIndex];
      if (this.getCellColor(cellToCheckToBottom) === color) {
        cellArray.push(cellToCheckToBottom);  
        rowToBottom++;
      }
      else {
        break;
      }
    }

    if (this.checkWin(cellArray)){
      this.afterWin(cell, cellArray);
      return true;
    }
    
  //Check diagonally to bottom-left
  cellArray = [cell];
  var rowToBL = rowIndex +1;
  var colToBL = colIndex -1;
  while (colToBL >= 0 && rowToBL <= game.boardSize-2) {
    let cellToCheckToBL = this.board[rowToBL][colToBL];
    if (this.getCellColor(cellToCheckToBL) === color) {
      cellArray.push(cellToCheckToBL);
      rowToBL++;
      colToBL--;
    } else {
      break;
    }
  }
  //Check diagonally to top-right
  var rowToTR = rowIndex-1;
  var colToTR = colIndex+1;
  while (colToTR <= game.boardSize-1 && rowToTR >= 0) {
    let cellToCheckToTR = this.board[rowToTR][colToTR];
    if (this.getCellColor(cellToCheckToTR) === color) {
      cellArray.push(cellToCheckToTR);  
      rowToTR--;
      colToTR++;
    }
    else {
      break;
    }
  }
 
  if (this.checkWin(cellArray)){
    this.afterWin(cell, cellArray);
    return true;
  }
   //Check diagonally to bottom-right
   cellArray = [cell];
   var rowToBR = rowIndex +1;
   var colToBR = colIndex +1;
   while (colToBR <= game.boardSize-1 && rowToBR <= game.boardSize-2) {
     let cellToCheckToBR = this.board[rowToBR][colToBR];
     if (this.getCellColor(cellToCheckToBR) === color) {
       cellArray.push(cellToCheckToBR);
       rowToBR++;
       colToBR++;
     } else {
       break;
     }
   }

   //Check diagonally to top-left
   var rowToTL = rowIndex-1;
   var colToTL = colIndex-1;
   while (colToTL >=0 && rowToTL >= 0) {
     let cellToCheckToTL = this.board[rowToTL][colToTL];
     if (this.getCellColor(cellToCheckToTL) === color) {
       cellArray.push(cellToCheckToTL);  
       rowToTL--;
       colToTL--;
     }
     else {
       break;
     }
   }
  
   if (this.checkWin(cellArray)){
     this.afterWin(cell, cellArray);
     return true;
   }

    //check tie
    var lastRow = 0;
    for (let cell of gameA.board[0]) {
      if (gameA.getCellColor(cell) === "red" || gameA.getCellColor(cell) === "yellow") {
        lastRow++;
      }
    }
    if (lastRow == game.boardSize) {
      this.afterTie(cell);
      return "tie";
    }

  },

//below are eventy handlers
  MouseOverCell: function () {
    for (var i = 0; i < game.boardSize - 1; i++) {
      gameA.board[i].forEach(function (element) {
        element.on("mouseover", function (e) {
          gameA.addBoardTopBar($(e.currentTarget));
        });
      })
    }
    gameA.boardTopBar.forEach(function (element) {
      element.on("mouseover", function (e) {
        gameA.addBoardTopBar($(e.currentTarget));
      });
    })
  },

  MouseMoveOut: function() {
    for (var i = 0; i < game.boardSize - 1; i++) {
      gameA.board[i].forEach(function (element) {
        element.on("mouseout", function (e) {
          gameA.clearBoardTopBar($(e.currentTarget));
        });
      })
    }
    gameA.boardTopBar.forEach(function (element) {
      element.on("mouseout", function (e) {
        gameA.clearBoardTopBar($(e.currentTarget));
      });
    })
  },
  
  MouseClick: function(){
    for (var i = 0; i < game.boardSize - 1; i++) {
      gameA.board[i].forEach(function (element) {
        element.on("click", function (e) {
          gameA.clickCellAddColor($(e.currentTarget));
        });
      })
    }
    gameA.boardTopBar.forEach(function (element) {
      element.on("click", function (e) {
        gameA.clickCellAddColor($(e.currentTarget));
      });
    })
  },





}

game.addP1();
game.addP2();
game.startPause();
game.showModal();
game.closeM2P1();