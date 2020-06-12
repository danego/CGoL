//Conway's Game of Life (CGoL)

;(function(global) {

  //like jQuery, function constructor is called from within the library so user doesn't have to type 'new'
  let CgolBoardInitializer = function(boardSize) {
    return new CgolBoardInitializer.init(boardSize);
  }

  let boardHTML_lineByLineRepresentation,  
    boardHTML,
    boardHTMLSize,          //is length of one side (ie square root of boardHTML array length - dependent on square board)
    boardHTMLTotalLength;   //total length of boardHTML single array

  CgolBoardInitializer.prototype = {

    //changes cell from dead to alive (for user to input starting positions or randomMark funcs)
    makeMark: function(index_singleLine_X, index_Y) {
      //marks board based on snake chart/one-line numbers 
      if(index_Y === undefined) boardHTML[index_singleLine_X] = "X";
  
      //XY passed in - marks board based on nested array coords (converts to snake/one-line)
      else {
  
        //"mark = board_length * x coord + y coord"
        let singleLineIndex = boardHTMLSize * index_singleLine_X + index_Y; 
        boardHTML[singleLineIndex] = "X";
      }
    },

    //create this many random marks
    makeMarkRandom: function(markCount) {

      for (let count = 0; count < markCount; count++) {

        const rMarkPostion = Math.floor(Math.random() * boardHTML.length);
        this.makeMark(rMarkPostion);
      }
      this.displayBoardHTML();
    },

    //set board back to all dead cells
    clearBoard: function() {

      boardHTML = boardHTML.map(boardArrayElement => {
        return boardArrayElement = '-';
      });
    },

    //returns boardSize 
    get boardSize() {
      return boardHTMLSize;
    },

    //returns total length (not size) of boardHTML single array
    get totalLength() {
      return boardHTMLTotalLength;
    },

    //updates text content of <p> elements in boardHTML_lineByLineRepresentation
    displayBoardHTML: function() {

      let singleArrayIndex = 0;

      //runs two for loops of board side size and keeps index of equivalent boardHTML (single array)
      for (let i = 0; i < boardHTMLSize; i++) {
  
        let htmlLineText = "";
        for (let j = 0; j < boardHTMLSize; j++) {

          htmlLineText = htmlLineText + ' ' + boardHTML[singleArrayIndex];
          singleArrayIndex++;
        }

        //actually changes HTML element's text
        boardHTML_lineByLineRepresentation[i].textContent = htmlLineText;
      }
    },
    
    //advances state of board to next turn/tick
    makeTurn: function () { 
      //sets forLoop start & stop indices for counting neighbors in each row. Also counts number of neighbors on current row.
      function setForLoopNeighborIndices(cellIndex) {

        totNeighborsAlive = 0;
        //Edge Test & Prep: Set for_loop variables & count same-row neighbors
        //Left-Edge Case
        if (cellIndex % boardHTMLSize === 0) {
  
          forLoop_StartAboveRow = cellIndex - boardHTMLSize;
          forLoop_StopAboveRow = forLoop_StartAboveRow + 1;
          forLoop_StartBelowRow = cellIndex + boardHTMLSize;
          forLoop_StopBelowRow = forLoop_StartBelowRow + 1;
          //Count in-row neighbors - Right neigh only
          if (boardHTML[cellIndex + 1] === 'X') totNeighborsAlive++;
        }
        //Right-Edge Case
        else if ((cellIndex + 1) % boardHTMLSize === 0) {
    
          forLoop_StartAboveRow = cellIndex - boardHTMLSize - 1;
          forLoop_StopAboveRow = forLoop_StartAboveRow + 1;
          forLoop_StartBelowRow = cellIndex + boardHTMLSize -1;
          forLoop_StopBelowRow = forLoop_StartBelowRow + 1;
          //Count in-row neighbors - Left neigh only
          if (boardHTML[cellIndex - 1] === 'X') totNeighborsAlive++;
        }
        //Interior Case (all non-edge cells)
        else {
    
          forLoop_StartAboveRow = cellIndex - boardHTMLSize - 1;
          forLoop_StopAboveRow = forLoop_StartAboveRow + 2;
          forLoop_StartBelowRow = cellIndex + boardHTMLSize - 1;
          forLoop_StopBelowRow = forLoop_StartBelowRow + 2;
          //Count in-row neighbors - both neighs
          if (boardHTML[cellIndex - 1] === 'X') totNeighborsAlive++;
          if (boardHTML[cellIndex + 1] === 'X') totNeighborsAlive++;
        }
          
        return countTotNeighborsInRows();
      }

      function countTotNeighborsInRows() { 
        //Now run for loops to count neighbors in above & below rows:
        //sets range to row above 
        for (let j = forLoop_StartAboveRow; j <= forLoop_StopAboveRow; j++) {

          if (boardHTML[j] === 'X') totNeighborsAlive++;
        }
        //sets range to row below
        for (let j = forLoop_StartBelowRow; j <= forLoop_StopBelowRow; j++) {
        
          if (boardHTML[j] === 'X') totNeighborsAlive++;
        }
    
        return totNeighborsAlive;
      }

      let totNeighborsAlive,
          forLoop_StartAboveRow, 
          forLoop_StopAboveRow,
          forLoop_StartBelowRow,
          forLoop_StopBelowRow;

      //create new array for resulting board (will replace boardHTML at end):
      const boardResult_singleArray = new Array(boardHTML.length).fill("-");

      //can't use forEach bc functions (and called funcs) use both index and element @ index
      for (let i = 0; i < boardHTML.length; i++) {
      
        //returns num of neighbors alive (eventually)
        const totNeighborsAlive = setForLoopNeighborIndices(i);
    
        //Evaluate neighbor count to determine if cell lives or die:
        //case: if alive already
        if (boardHTML[i] === 'X') {
        
          if (totNeighborsAlive < 2 || totNeighborsAlive > 3) boardResult_singleArray[i] = "-";
          else boardResult_singleArray[i] = "X";
        }
        
        //case: dead cell
        else {
            
          if (totNeighborsAlive === 3) boardResult_singleArray[i] = "X";
          else boardResult_singleArray[i] = "-";
          }
      }

      //set internal board equal to resulting array/board 
      boardHTML = boardResult_singleArray;

      }//end of makeTurn()

    } //end of CgolBoardInitializer.prototype set-up      

    //sets up HTML board using p elements. Called from .init
    function createHtmlBoardElements(boardSize) {
      let lineRepresentation = "";
      for (let i = 0; i < boardSize; i++) {

        lineRepresentation += " -";
      }
      //add HTML <p> board
      boardHTML_lineByLineRepresentation = new Array(boardSize);
      for (let i = 0; i < boardSize; i++) {

        boardHTML_lineByLineRepresentation[i] = document.createElement('p');
        boardHTML_lineByLineRepresentation[i].textContent = lineRepresentation;
        document.body.appendChild(boardHTML_lineByLineRepresentation[i]);
      }
    }

    //creates board - Square only for now. Default board size is 5.
    CgolBoardInitializer.init = function(boardSize) {

      const board_singleArray = new Array(boardSize * boardSize);
      board_singleArray.fill("-");

      boardHTML = board_singleArray;
      boardHTMLSize = boardSize;
      boardHTMLTotalLength = boardHTML.length;

      createHtmlBoardElements(boardSize);
    }//end of CgolBoardInitializer.init

    CgolBoardInitializer.init.prototype = CgolBoardInitializer.prototype;
    global.CgolBoardInitializer = CgolBoardInitializer;

}(window));

//************************ */

//HTML event_handlers:
//when html button is pressed makeTurn func is called on boardHTML
document.getElementById("makeTurn").onclick = function() {
  
  board.makeTurn();
  board.displayBoardHTML();
}

document.getElementById("makeRandomMark").onclick = function() {
  //makes size of board # of random marks. Allows user to make turns 
  const markCount = board.boardSize;
  board.clearBoard();
  board.makeMarkRandom(markCount);
}

document.getElementById("makeRandomMarkAutoTurns").onclick = function() {
  //makes (currently) 8 random marks. Automates makeTurns
  const boardTotLength = board.totalLength;
  //sets # of marks to boardSideSize / mcLimiter (3) ... for a large amount of marks dynamic w/ board size
  const markCountLimiter = 3;
  const initialMarkCount = Math.floor(boardTotLength / (Math.sqrt(boardTotLength) / markCountLimiter));
  board.makeMarkRandom(initialMarkCount);
  // Every .3 second make a run to automate the cells
  const autoTurnInterval = window.setInterval(function() {

    board.makeTurn();
    board.displayBoardHTML()
  }, 300);
  // After 25 seconds stop the cell process
  setTimeout(function() {

    clearInterval(autoTurnInterval);
  }, 25000)
}

/*
//HTML selector issues ... same road block to createBoard w/ specific size
document.getElementById("rando-select").onclick = function() {

  let element = document.getElementById("rando-select");
  let randoAmount = element.options[element.selectedIndex].value;
  console.log(randoAmount);
}
*/

//end of html event_handlers setup 


//html testing 
const board = CgolBoardInitializer(15);

//make 5-cell vertical line
board.makeMark(2);
board.makeMark(7);
board.makeMark(12);
board.makeMark(17);
board.makeMark(22);
board.displayBoardHTML();





