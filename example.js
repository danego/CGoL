//Conway's Game of Life (CGoL)

;(function(global) {

  //like jQuery, function constructor is called from within the library so user doesn't have to type 'new'
  let CgolBoardInitializer = function(boardSize) {
    return new CgolBoardInitializer.init(boardSize);
  }

  let boardHtmlLineByLineRepresentation,  
    boardHTML,
    boardHTMLSize,          //is length of one side (ie square root of boardHTML array length - dependent on square board)
    boardHTMLTotalLength;   //total length of boardHTML single array

  CgolBoardInitializer.prototype = {

    //changes cell from dead to alive (for user to input starting positions or randomMark funcs)
    makeMark: function(indexForSingleLineX, indexForY) {
      //marks board based on snake chart/one-line numbers 
      if(indexForY === undefined) boardHTML[indexForSingleLineX] = "X";
  
      //XY passed in - marks board based on nested array coords (converts to snake/one-line)
      else {
  
        //"mark = board length * x coord + y coord"
        let singleLineIndex = boardHTMLSize * indexForSingleLineX + indexForY; 
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

    //updates text content of <p> elements in boardHtmlLineByLineRepresentation
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
        boardHtmlLineByLineRepresentation[i].textContent = htmlLineText;
      }
    },
    
    //advances state of board to next turn/tick
    makeTurn: function () { 
      //sets forLoop start & stop indices for counting neighbors in each row. Also counts number of neighbors on current row.
      function setForLoopNeighborIndices(cellIndex) {

        totNeighborsAlive = 0;
        //Edge Test & Prep: Set for loop variables & count same-row neighbors
        //Left-Edge Case
        if (cellIndex % boardHTMLSize === 0) {
  
          forLoopStartAboveRow = cellIndex - boardHTMLSize;
          forLoopStopAboveRow = forLoopStartAboveRow + 1;
          forLoopStartBelowRow = cellIndex + boardHTMLSize;
          forLoopStopBelowRow = forLoopStartBelowRow + 1;
          //Count in-row neighbors - Right neigh only
          if (boardHTML[cellIndex + 1] === 'X') totNeighborsAlive++;
        }
        //Right-Edge Case
        else if ((cellIndex + 1) % boardHTMLSize === 0) {
    
          forLoopStartAboveRow = cellIndex - boardHTMLSize - 1;
          forLoopStopAboveRow = forLoopStartAboveRow + 1;
          forLoopStartBelowRow = cellIndex + boardHTMLSize -1;
          forLoopStopBelowRow = forLoopStartBelowRow + 1;
          //Count in-row neighbors - Left neigh only
          if (boardHTML[cellIndex - 1] === 'X') totNeighborsAlive++;
        }
        //Interior Case (all non-edge cells)
        else {
    
          forLoopStartAboveRow = cellIndex - boardHTMLSize - 1;
          forLoopStopAboveRow = forLoopStartAboveRow + 2;
          forLoopStartBelowRow = cellIndex + boardHTMLSize - 1;
          forLoopStopBelowRow = forLoopStartBelowRow + 2;
          //Count in-row neighbors - both neighs
          if (boardHTML[cellIndex - 1] === 'X') totNeighborsAlive++;
          if (boardHTML[cellIndex + 1] === 'X') totNeighborsAlive++;
        }
          
        return countTotNeighborsInRows();
      }

      function countTotNeighborsInRows() { 
        //Now run for loops to count neighbors in above & below rows:
        //sets range to row above 
        for (let j = forLoopStartAboveRow; j <= forLoopStopAboveRow; j++) {

          if (boardHTML[j] === 'X') totNeighborsAlive++;
        }
        //sets range to row below
        for (let j = forLoopStartBelowRow; j <= forLoopStopBelowRow; j++) {
        
          if (boardHTML[j] === 'X') totNeighborsAlive++;
        }
    
        return totNeighborsAlive;
      }

      let totNeighborsAlive,
          forLoopStartAboveRow, 
          forLoopStopAboveRow,
          forLoopStartBelowRow,
          forLoopStopBelowRow;

      //create new array for resulting board (will replace boardHTML at end):
      const boardResultAsSingleArray = new Array(boardHTML.length).fill("-");

      //can't use forEach bc functions (and called funcs) use both index and element @ index
      for (let i = 0; i < boardHTML.length; i++) {
      
        //returns num of neighbors alive (eventually)
        const totNeighborsAlive = setForLoopNeighborIndices(i);
    
        //Evaluate neighbor count to determine if cell lives or die:
        //case: if alive already
        if (boardHTML[i] === 'X') {
        
          if (totNeighborsAlive < 2 || totNeighborsAlive > 3) boardResultAsSingleArray[i] = "-";
          else boardResultAsSingleArray[i] = "X";
        }
        
        //case: dead cell
        else {
            
          if (totNeighborsAlive === 3) boardResultAsSingleArray[i] = "X";
          else boardResultAsSingleArray[i] = "-";
          }
      }

      //set internal board equal to resulting array/board 
      boardHTML = boardResultAsSingleArray;

      }//end of makeTurn()

    } //end of CgolBoardInitializer.prototype set-up      

    //sets up HTML board using p elements. Called from .init
    function createHtmlBoardElements(boardSize) {
      let lineRepresentation = "";
      for (let i = 0; i < boardSize; i++) {

        lineRepresentation += " -";
      }
      //add HTML <p> board
      boardHtmlLineByLineRepresentation = new Array(boardSize);
      for (let i = 0; i < boardSize; i++) {

        boardHtmlLineByLineRepresentation[i] = document.createElement('p');
        boardHtmlLineByLineRepresentation[i].textContent = lineRepresentation;
        document.body.appendChild(boardHtmlLineByLineRepresentation[i]);
      }
    }

    //creates board - Square only for now. Default board size is 5.
    CgolBoardInitializer.init = function(boardSize) {

      const boardAsSingleArray = new Array(boardSize * boardSize);
      boardAsSingleArray.fill("-");

      boardHTML = boardAsSingleArray;
      boardHTMLSize = boardSize;
      boardHTMLTotalLength = boardHTML.length;

      createHtmlBoardElements(boardSize);
    }//end of CgolBoardInitializer.init

    CgolBoardInitializer.init.prototype = CgolBoardInitializer.prototype;
    global.CgolBoardInitializer = CgolBoardInitializer;

}(window));

//************************ */

//HTML event handlers:
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

//end of html event handlers setup 


//html testing 
const board = CgolBoardInitializer(15);

//make 5-cell vertical line
board.makeMark(2);
board.makeMark(7);
board.makeMark(12);
board.makeMark(17);
board.makeMark(22);
board.displayBoardHTML();





